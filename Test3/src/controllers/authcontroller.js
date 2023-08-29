const passport = require('passport');
const User = require('../models/User');

exports.registerUser = (req, res) => {
  const { username, password } = req.body;

  User.register(new User({ username }), password, (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
    passport.authenticate('local')(req, res, () => {
      res.json({ message: 'Registration successful' });
    });
  });
};

exports.loginUser = passport.authenticate('local'), (req, res) => {
  res.json({ message: 'Login successful', user: req.user });
};

exports.logoutUser = (req, res) => {
  req.logout();
  res.json({ message: 'Logout successful' });
};

exports.getProfile = (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
};