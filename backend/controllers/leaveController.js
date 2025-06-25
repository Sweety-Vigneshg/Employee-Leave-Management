const Leave = require('../models/Leave');

exports.createLeave = async (req, res) => {
  const { startDate, endDate, reason } = req.body;
  
  try {
    const newLeave = await Leave.create({
      employeeId: req.user.id,
      startDate,
      endDate,
      reason
    });
    
    res.status(201).json(newLeave);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getEmployeeLeaves = async (req, res) => {
  try {
    const leaves = await Leave.findByEmployeeId(req.user.id);
    res.json(leaves);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.findAll();
    res.json(leaves);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateLeaveStatus = async (req, res) => {
  const { status } = req.body;
  
  try {
    await Leave.updateStatus(req.params.id, status);
    res.json({ message: 'Leave status updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};