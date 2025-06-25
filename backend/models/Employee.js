const db = require('../config/db');

class Employee {
  static async create({ name, email, password, role = 'employee', leave_balance = 20 }) {
    const [result] = await db.execute(
      'INSERT INTO Employees (name, email, password, role, leave_balance) VALUES (?, ?, ?, ?, ?)',
      [name, email, password, role, leave_balance]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM Employees WHERE email = ?', [email]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT id, name, email, role, leave_balance FROM Employees WHERE id = ?', [id]);
    return rows[0];
  }

  static async updateLeaveBalance(id, newBalance) {
    await db.execute('UPDATE Employees SET leave_balance = ? WHERE id = ?', [newBalance, id]);
  }
}

module.exports = Employee;