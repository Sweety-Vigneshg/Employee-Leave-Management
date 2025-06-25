const LeaveApplication = require('../models/LeaveApplication');
const Employee = require('../models/Employee');

const applyLeave = async (req, res) => {
  const { employee_id } = req.user;
  const { leave_type_id, start_date, end_date, days_requested, reason } = req.body;

  try {
    // Check leave balance
    const employee = await Employee.findById(employee_id);
    if (employee.leave_balance < days_requested) {
      return res.status(400).json({ error: 'Insufficient leave balance' });
    }

    const leaveId = await LeaveApplication.create({
      employee_id,
      leave_type_id,
      start_date,
      end_date,
      days_requested,
      reason
    });

    // Deduct leave balance
    const newBalance = employee.leave_balance - days_requested;
    await Employee.updateLeaveBalance(employee_id, newBalance);

    res.status(201).json({ id: leaveId, message: 'Leave application submitted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getMyLeaves = async (req, res) => {
  const { employee_id } = req.user;
  
  try {
    const leaves = await LeaveApplication.findByEmployeeId(employee_id);
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getPendingLeaves = async (req, res) => {
  try {
    const leaves = await LeaveApplication.findAllPending();
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const updateLeaveStatus = async (req, res) => {
  const { id } = req.params;
  const { status, manager_comments } = req.body;
  
  try {
    await LeaveApplication.updateStatus(id, status, manager_comments);
    res.json({ message: 'Leave status updated' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  applyLeave,
  getMyLeaves,
  getPendingLeaves,
  updateLeaveStatus
};