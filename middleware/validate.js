const validateRegister = (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ message: 'Name required hai!' });
  }

  if (!email || email.trim() === '') {
    return res.status(400).json({ message: 'Email required hai!' });
  }

  // Email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Valid email daalo!' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password kam se kam 6 characters ka hona chahiye!' });
  }

  if (role && !['admin', 'analyst', 'viewer'].includes(role)) {
    return res.status(400).json({ message: 'Role sirf admin, analyst ya viewer ho sakta hai!' });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || email.trim() === '') {
    return res.status(400).json({ message: 'Email required hai!' });
  }

  if (!password || password.trim() === '') {
    return res.status(400).json({ message: 'Password required hai!' });
  }

  next();
};

const validateRecord = (req, res, next) => {
  const { amount, type, category, date } = req.body;

  if (!amount || isNaN(amount)) {
    return res.status(400).json({ message: 'Amount valid number hona chahiye!' });
  }

  if (amount <= 0) {
    return res.status(400).json({ message: 'Amount 0 se zyada hona chahiye!' });
  }

  if (!type || !['income', 'expense'].includes(type)) {
    return res.status(400).json({ message: 'Type sirf income ya expense ho sakta hai!' });
  }

  if (!category || category.trim() === '') {
    return res.status(400).json({ message: 'Category required hai!' });
  }

  if (date && isNaN(new Date(date).getTime())) {
    return res.status(400).json({ message: 'Valid date daalo!' });
  }

  next();
};

module.exports = { validateRegister, validateLogin, validateRecord };