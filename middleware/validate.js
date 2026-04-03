const validateRegister = (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'Name required!' });
  }

  if (!email || email.trim() === '') {
    return res.status(400).json({ message: 'Email required!' });
  }

  // Email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Enter Valid email!' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password atleast 6 character!' });
  }

  if (role && !['admin', 'analyst', 'viewer'].includes(role)) {
    return res.status(400).json({ message: 'only Role can be admin, analyst and viewer!' });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || email.trim() === '') {
    return res.status(400).json({ message: 'Email required!' });
  }

  if (!password || password.trim() === '') {
    return res.status(400).json({ message: 'Password required!' });
  }

  next();
};

const validateRecord = (req, res, next) => {
  const { amount, type, category, date } = req.body;

  if (!amount || isNaN(amount)) {
    return res.status(400).json({ message: 'Amount should be valid number!' });
  }

  if (amount <= 0) {
    return res.status(400).json({ message: 'Amount mote than 0!' });
  }

  if (!type || !['income', 'expense'].includes(type)) {
    return res.status(400).json({ message: 'Type only income or expense!' });
  }

  if (!category || category.trim() === '') {
    return res.status(400).json({ message: 'Category required!' });
  }

  if (date && isNaN(new Date(date).getTime())) {
    return res.status(400).json({ message: 'Enter Valid date!' });
  }

  next();
};

module.exports = { validateRegister, validateLogin, validateRecord };