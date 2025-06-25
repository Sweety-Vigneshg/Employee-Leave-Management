const db = require('../config/db');

class Leave {
  static async create({ employeeId, startDate, endDate, reason }) {
    const [result] = await db.execute(
      'INSERT INTO leaves (employee_id, start_date, end_date, reason, status) VALUES (?, ?, ?, ?, "Pending")',
      [employeeId, startDate, endDate, reason]
    );
    return result.insertId;
  }

  static async findByEmployeeId(employeeId) {
    const [rows] = await db.execute('SELECT * FROM leaves WHERE employee_id = ? ORDER BY created_at DESC', [employeeId]);
    return rows;
  }

  static async findAll() {
    const [rows] = await db.execute(`
      SELECT l.*, e.name AS employee_name 
      FROM leaves l
      JOIN employees e ON l.employee_id = e.id
      ORDER BY l.created_at DESC
    `);
    return rows;
  }

  static async updateStatus(id, status) {
    await db.execute('UPDATE leaves SET status = ? WHERE id = ?', [status, id]);
  }
}

module.exports = Leave;