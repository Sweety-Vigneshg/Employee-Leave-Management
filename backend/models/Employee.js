const db = require('../config/db');
const bcrypt = require('bcryptjs');

class Employee {
  static async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM employees WHERE email = ?', [email]);
    return rows[0];
  }

  static async create({ name, email, password }) {
    // Add password hashing
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO employees (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );
    return result.insertId;
  }
}

module.exports = Employee;