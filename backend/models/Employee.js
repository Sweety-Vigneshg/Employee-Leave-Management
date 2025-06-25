const db = require('../config/db');

class Employee {
  static async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM employees WHERE email = ?', [email]);
    return rows[0];
  }

  static async create({ name, email, password }) {
    const [result] = await db.execute(
      'INSERT INTO employees (name, email, password) VALUES (?, ?, ?)',
      [name, email, password]
    );
    return result.insertId;
  }
}

module.exports = Employee;