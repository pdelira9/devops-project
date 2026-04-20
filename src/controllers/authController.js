const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashed
  });

  return res.json({
    message: "User registered successfully"
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ msg: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return res.status(400).json({ msg: 'Invalid password' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  return res.json({ token });
};