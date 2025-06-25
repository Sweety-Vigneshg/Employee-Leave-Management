require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'leave_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test DB connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL database');
  connection.release();
});

// Create tables if they don't exist
db.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('employee', 'admin') NOT NULL DEFAULT 'employee',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

db.query(`
  CREATE TABLE IF NOT EXISTS leaves (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`);

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

// Routes
app.post('/api/register', async (req, res) => {
  const { username, password, role } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.query(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      [username, hashedPassword, role || 'employee'],
      (error, results) => {
        if (error) {
          if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Username already exists' });
          }
          return res.status(500).json({ message: 'Database error' });
        }
        
        res.status(201).json({ message: 'User registered successfully' });
      }
    );
  } catch (err) {
    res.status(500).json({ message: 'Error hashing password' });
  }
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  
  db.query(
    'SELECT * FROM users WHERE username = ?',
    [username],
    async (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Database error' });
      }
      
      if (results.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      const user = results[0];
      
      try {
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
            role: user.role
          }
        });
      } catch (err) {
        res.status(500).json({ message: 'Error comparing passwords' });
      }
    }
  );
});

app.get('/api/user', authenticateJWT, (req, res) => {
  res.json(req.user);
});

app.post('/api/leaves', authenticateJWT, (req, res) => {
  const { start_date, end_date, reason } = req.body;
  const userId = req.user.id;
  
  if (!start_date || !end_date || !reason) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  
  db.query(
    'INSERT INTO leaves (user_id, start_date, end_date, reason, status) VALUES (?, ?, ?, ?, ?)',
    [userId, start_date, end_date, reason, 'pending'],
    (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Database error' });
      }
      
      res.status(201).json({ message: 'Leave application submitted successfully' });
    }
  );
});

app.get('/api/leaves', authenticateJWT, (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;
  
  let query = '';
  let params = [];
  
  if (role === 'admin') {
    query = `
      SELECT leaves.*, users.username 
      FROM leaves 
      JOIN users ON leaves.user_id = users.id
      ORDER BY leaves.created_at DESC
    `;
  } else {
    query = 'SELECT * FROM leaves WHERE user_id = ? ORDER BY created_at DESC';
    params = [userId];
  }
  
  db.query(query, params, (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Database error' });
    }
    
    res.json(results);
  });
});

app.put('/api/leaves/:id', authenticateJWT, (req, res) => {
  const { status } = req.body;
  const leaveId = req.params.id;
  const role = req.user.role;
  
  if (role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can update leave status' });
  }
  
  if (!status || !['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }
  
  db.query(
    'UPDATE leaves SET status = ? WHERE id = ?',
    [status, leaveId],
    (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Database error' });
      }
      
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Leave not found' });
      }
      
      res.json({ message: 'Leave status updated successfully' });
    }
  );
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});