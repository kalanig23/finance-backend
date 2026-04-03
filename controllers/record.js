const Record = require('../models/Record');

// Create record
const createRecord = async (req, res) => {
  try {
    const { amount, type, category, date, notes } = req.body;

    const record = await Record.create({
      user: req.user._id,
      amount,
      type,
      category,
      date: date || Date.now(),
      notes
    });

    res.status(201).json({ message: 'Record created!', record });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Sab records dekho
const getRecords = async (req, res) => {
  try {
    const { type, category, startDate, endDate, search, page, limit } = req.query;

    let filter = { isDeleted: false };

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (search) filter.notes = { $regex: search, $options: 'i' };
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const total = await Record.countDocuments(filter);
    const records = await Record.find(filter)
      .populate('user', 'name email')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      records
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ek record dekho
const getRecordById = async (req, res) => {
  try {
    const record = await Record.findOne({
      _id: req.params.id,
      isDeleted: false
    }).populate('user', 'name email');

    if (!record) {
      return res.status(404).json({ message: 'Record nahi mila!' });
    }

    res.json(record);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update record
const updateRecord = async (req, res) => {
  try {
    const record = await Record.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!record) {
      return res.status(404).json({ message: 'Record nahi mila!' });
    }

    res.json({ message: 'Record update ho gaya!', record });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Soft Delete
const deleteRecord = async (req, res) => {
  try {
    const record = await Record.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

    if (!record) {
      return res.status(404).json({ message: 'Record nahi mila!' });
    }

    res.json({ message: 'Record delete ho gaya!', record });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord
};