const db = require('../config/db');

class LeaveApplication {
  static async create({ employee_id, leave_type_id, start_date, end_date, days_requested, reason }) {
    const [result] = await db.execute(
      'INSERT INTO LeaveApplications (employee_id, leave_type_id, start_date, end_date, days_requested, reason) VALUES (?, ?, ?, ?, ?, ?)',
      [employee_id, leave_type_id, start_date, end_date, days_requested, reason]
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await db.execute(
      `SELECT la.*, lt.name AS leave_type_name 
       FROM LeaveApplications la
       JOIN LeaveTypes lt ON la.leave_type_id = lt.id
       WHERE la.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async findByEmployeeId(employee_id) {
    const [rows] = await db.execute(
      `SELECT la.*, lt.name AS leave_type_name 
       FROM LeaveApplications la
       JOIN LeaveTypes lt ON la.leave_type_id = lt.id
       WHERE la.employee_id = ?
       ORDER BY la.start_date DESC`,
      [employee_id]
    );
    return rows;
  }

  static async findAllPending() {
    const [rows] = await db.execute(
      `SELECT la.*, e.name AS employee_name, lt.name AS leave_type_name 
       FROM LeaveApplications la
       JOIN Employees e ON la.employee_id = e.id
       JOIN LeaveTypes lt ON la.leave_type_id = lt.id
       WHERE la.status = 'pending'
       ORDER BY la.start_date DESC`
    );
    return rows;
  }

  static async updateStatus(id, status, manager_comments = null) {
    await db.execute(
      'UPDATE LeaveApplications SET status = ?, manager_comments = ? WHERE id = ?',
      [status, manager_comments, id]
    );
  }
}

module.exports = LeaveApplication;