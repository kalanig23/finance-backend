const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const authorizeRoles = require('../middleware/role');
const { getAllUsers, getUserById, updateRole, updateStatus } = require('../controllers/user');

router.get('/', protect, authorizeRoles('admin'), getAllUsers);
router.get('/:id', protect, authorizeRoles('admin'), getUserById);
router.put('/:id/role', protect, authorizeRoles('admin'), updateRole);
router.put('/:id/status', protect, authorizeRoles('admin'), updateStatus);

module.exports = router;