require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'leave_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Initialize database
async function initializeDatabase() {
  let connection;
  try {
    connection = await pool.getConnection();
    
    // Create users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('employee', 'admin') NOT NULL DEFAULT 'employee',
        full_name VARCHAR(255) NOT NULL DEFAULT '',
        email VARCHAR(255) NOT NULL DEFAULT '',
        position VARCHAR(100) NOT NULL DEFAULT '',
        department VARCHAR(100) NOT NULL DEFAULT '',
        phone VARCHAR(20) NOT NULL DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create leaves table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS leaves (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        reason TEXT NOT NULL,
        leave_type VARCHAR(50) NOT NULL DEFAULT 'vacation',
        status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Add foreign key constraint if missing
    const [fkCheck] = await connection.query(`
      SELECT COUNT(*) AS fk_exists
      FROM information_schema.TABLE_CONSTRAINTS
      WHERE CONSTRAINT_SCHEMA = ?
        AND TABLE_NAME = 'leaves'
        AND CONSTRAINT_NAME = 'leaves_ibfk_1'
        AND CONSTRAINT_TYPE = 'FOREIGN KEY'
    `, [process.env.DB_NAME || 'leave_management']);
    
    if (fkCheck[0].fk_exists === 0) {
      await connection.query(`
        ALTER TABLE leaves
        ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      `);
      console.log('Added foreign key constraint to leaves table');
    }
    
    // Add sample users if none exist
    const [userCount] = await connection.query('SELECT COUNT(*) AS count FROM users');
    if (userCount[0].count === 0) {
      const hashedAdminPass = await bcrypt.hash('admin123', 10);
      const hashedEmpPass = await bcrypt.hash('employee123', 10);
      
      await connection.query(
        'INSERT INTO users (username, password, role, full_name, email, position, department, phone) VALUES ?',
        [
          [
            ['admin', hashedAdminPass, 'admin', 'Admin User', 'admin@company.com', 'Administrator', 'Management', '123-456-7890'],
            ['employee', hashedEmpPass, 'employee', 'John Doe', 'john@company.com', 'Developer', 'Engineering', '987-654-3210']
          ]
        ]
      );
      console.log('Added sample users');
    }
    
    // Add sample leaves if none exist
    const [leaveCount] = await connection.query('SELECT COUNT(*) AS count FROM leaves');
    if (leaveCount[0].count === 0) {
      const [users] = await connection.query('SELECT id FROM users');
      
      if (users.length >= 2) {
        await connection.query(
          'INSERT INTO leaves (user_id, start_date, end_date, reason, leave_type, status) VALUES ?',
          [
            [
              [users[0].id, '2023-07-01', '2023-07-03', 'Family vacation', 'vacation', 'approved'],
              [users[1].id, '2023-07-05', '2023-07-06', 'Doctor appointment', 'sick', 'pending']
            ]
          ]
        );
        console.log('Added sample leave applications');
      }
    }
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  } finally {
    if (connection) connection.release();
  }
}

initializeDatabase();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

// Auth Middleware
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Admin Middleware
const requireAdmin = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [users] = await pool.query(
      'SELECT role FROM users WHERE id = ?',
      [userId]
    );
    
    if (users.length === 0 || users[0].role !== 'admin') {
      return res.status(403).json({ message: 'Admin privileges required' });
    }
    
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Routes
app.post('/api/register', async (req, res) => {
  const { username, password, role } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      [username, hashedPassword, role || 'employee']
    );
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Username already exists' });
    }
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  
  try {
    const [users] = await pool.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({ 
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        full_name: user.full_name,
        email: user.email,
        position: user.position,
        department: user.department,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Database error', error: error.message });
  }
});

app.get('/api/user', authenticateJWT, (req, res) => {
  res.json(req.user);
});

app.post('/api/leaves', authenticateJWT, async (req, res) => {
  const { start_date, end_date, reason, leave_type } = req.body;
  const userId = req.user.id;
  
  if (!start_date || !end_date || !reason) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  
  try {
    await pool.query(
      'INSERT INTO leaves (user_id, start_date, end_date, reason, leave_type, status) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, start_date, end_date, reason, leave_type || 'vacation', 'pending']
    );
    
    res.status(201).json({ message: 'Leave application submitted successfully' });
  } catch (error) {
    console.error('Leave submission error:', error);
    res.status(500).json({ 
      message: 'Database error', 
      error: error.message,
      code: error.code
    });
  }
});

app.get('/api/leaves', authenticateJWT, async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;
  
  try {
    let leaves;
    if (role === 'admin') {
      [leaves] = await pool.query(`
        SELECT leaves.*, users.username 
        FROM leaves 
        JOIN users ON leaves.user_id = users.id
        ORDER BY leaves.created_at DESC
      `);
    } else {
      [leaves] = await pool.query(
        'SELECT * FROM leaves WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
      );
    }
    
    res.json(leaves);
  } catch (error) {
    console.error('Leave retrieval error:', error);
    res.status(500).json({ 
      message: 'Database error', 
      error: error.message,
      code: error.code
    });
  }
});

app.put('/api/leaves/:id', authenticateJWT, async (req, res) => {
  const { status } = req.body;
  const leaveId = req.params.id;
  const role = req.user.role;
  
  if (role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can update leave status' });
  }
  
  if (!status || !['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }
  
  try {
    const [result] = await pool.query(
      'UPDATE leaves SET status = ? WHERE id = ?',
      [status, leaveId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Leave not found' });
    }
    
    res.json({ message: 'Leave status updated successfully' });
  } catch (error) {
    console.error('Status update error:', error);
    res.status(500).json({ 
      message: 'Database error', 
      error: error.message,
      code: error.code
    });
  }
});

// Profile routes
app.get('/api/profile', authenticateJWT, async (req, res) => {
  const userId = req.user.id;

  try {
    const [users] = await pool.query(
      'SELECT id, username, role, full_name, email, position, department, phone FROM users WHERE id = ?',
      [userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(users[0]);
  } catch (error) {
    console.error('Profile retrieval error:', error);
    res.status(500).json({ 
      message: 'Database error', 
      error: error.message,
      code: error.code
    });
  }
});

app.put('/api/profile', authenticateJWT, async (req, res) => {
  const userId = req.user.id;
  const { full_name, email, position, department, phone } = req.body;

  try {
    await pool.query(
      `UPDATE users 
       SET full_name = ?, email = ?, position = ?, department = ?, phone = ?
       WHERE id = ?`,
      [full_name, email, position, department, phone, userId]
    );
    
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ 
      message: 'Database error', 
      error: error.message,
      code: error.code
    });
  }
});

app.put('/api/change-password', authenticateJWT, async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  try {
    // Get current user
    const [users] = await pool.query(
      'SELECT password FROM users WHERE id = ?',
      [userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const user = users[0];
    
    // Verify current password
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    await pool.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, userId]
    );
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ 
      message: 'Database error', 
      error: error.message,
      code: error.code
    });
  }
});

// Employee Management Routes
app.get('/api/employees', authenticateJWT, requireAdmin, async (req, res) => {
  try {
    const [employees] = await pool.query(
      'SELECT id, username, full_name, email, phone, position, department, role, created_at FROM users'
    );
    res.json(employees);
  } catch (error) {
    console.error('Employee retrieval error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/employees', authenticateJWT, requireAdmin, async (req, res) => {
  const { username, password, full_name, email, phone, position, department, role } = req.body;

  if (!username || !password || !full_name) {
    return res.status(400).json({ message: 'Username, password, and full name are required' });
  }

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert new employee
    const [result] = await pool.query(
      `INSERT INTO users 
        (username, password, full_name, email, phone, position, department, role) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [username, hashedPassword, full_name, email, phone, position, department, role || 'employee']
    );
    
    // Fetch the newly created employee without password
    const [newEmployee] = await pool.query(
      'SELECT id, username, full_name, email, phone, position, department, role, created_at FROM users WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json(newEmployee[0]);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Username already exists' });
    }
    console.error('Employee creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/employees/:id', authenticateJWT, requireAdmin, async (req, res) => {
  const id = req.params.id;
  const { full_name, email, phone, position, department, role, password } = req.body;
  
  try {
    let query = `
      UPDATE users SET 
        full_name = ?, 
        email = ?, 
        phone = ?, 
        position = ?, 
        department = ?, 
        role = ?
    `;
    
    const params = [full_name, email, phone, position, department, role];
    
    // Add password update if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ', password = ?';
      params.push(hashedPassword);
    }
    
    query += ' WHERE id = ?';
    params.push(id);
    
    await pool.query(query, params);
    
    // Fetch updated employee
    const [updatedEmployee] = await pool.query(
      'SELECT id, username, full_name, email, phone, position, department, role, created_at FROM users WHERE id = ?',
      [id]
    );
    
    if (updatedEmployee.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    res.json(updatedEmployee[0]);
  } catch (error) {
    console.error('Employee update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/employees/:id', authenticateJWT, requireAdmin, async (req, res) => {
  const id = req.params.id;
  
  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Employee deletion error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});