const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const leaveController = require('../controllers/leaveController');

router.post('/', auth, leaveController.createLeave);
router.get('/employee', auth, leaveController.getEmployeeLeaves);
router.get('/all', auth, leaveController.getAllLeaves);
router.put('/:id/status', auth, leaveController.updateLeaveStatus);

module.exports = router;