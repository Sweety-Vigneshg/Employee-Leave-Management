const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Employee = require('../models/Employee');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const employee = await Employee.findByEmail(email);
    
    if (!employee) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Add password comparison
    const isMatch = await bcrypt.compare(password, employee.password);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: employee.id, email: employee.email, role: employee.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ 
      token,
      user: {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        role: employee.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};