const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const authorizeRoles = require('../middleware/role');
const { validateRecord } = require('../middleware/validate');
const {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord
} = require('../controllers/record');

router.post('/', protect, authorizeRoles('admin', 'analyst'), validateRecord, createRecord);
router.get('/', protect, getRecords);
router.get('/:id', protect, getRecordById);
router.put('/:id', protect, authorizeRoles('admin', 'analyst'), updateRecord);
router.delete('/:id', protect, authorizeRoles('admin'), deleteRecord);

module.exports = router;