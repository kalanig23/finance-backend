const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { getSummary, getMonthlyTrends, getCategories } = require('../controllers/dashboard');

router.get('/summary', protect, getSummary);
router.get('/monthly', protect, getMonthlyTrends);
router.get('/categories', protect, getCategories);

module.exports = router;