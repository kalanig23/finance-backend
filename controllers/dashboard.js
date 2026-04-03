const Record = require('../models/Record');

const getSummary = async (req, res) => {
  try {
    const records = await Record.find({ isDeleted: false });

    const totalIncome = records
      .filter(r => r.type === 'income')
      .reduce((sum, r) => sum + r.amount, 0);

    const totalExpense = records
      .filter(r => r.type === 'expense')
      .reduce((sum, r) => sum + r.amount, 0);

    const netBalance = totalIncome - totalExpense;

    const categoryTotals = {};
    records.forEach(r => {
      if (!categoryTotals[r.category]) {
        categoryTotals[r.category] = 0;
      }
      categoryTotals[r.category] += r.amount;
    });

    const recentActivity = await Record.find({ isDeleted: false })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalIncome,
      totalExpense,
      netBalance,
      categoryTotals,
      recentActivity
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMonthlyTrends = async (req, res) => {
  try {
    const trends = await Record.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } }
    ]);

    res.json({ trends });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Record.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);

    res.json({ categories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSummary, getMonthlyTrends, getCategories };