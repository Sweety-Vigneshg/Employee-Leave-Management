const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const leaveController = require('../controllers/leaveController');

router.post('/apply', authMiddleware, leaveController.applyLeave);
router.get('/my-leaves', authMiddleware, leaveController.getMyLeaves);
router.get('/pending', authMiddleware, leaveController.getPendingLeaves);
router.put('/:id/status', authMiddleware, leaveController.updateLeaveStatus);

module.exports = router;