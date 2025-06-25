const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth'); // Fixed path
const leaveController = require('../controllers/leaveController');

router.post('/', authMiddleware, leaveController.createLeave);
router.get('/employee', authMiddleware, leaveController.getEmployeeLeaves);
router.get('/all', authMiddleware, leaveController.getAllLeaves);
router.put('/:id/status', authMiddleware, leaveController.updateLeaveStatus);

module.exports = router;