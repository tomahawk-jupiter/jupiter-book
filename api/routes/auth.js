const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

/***** TODO *****
 *
 * Image upload for new user, cloudinary and db.
 */

/// REGISTER ///
router.post('/register', async (req, res) => {
  try {
    // Generate password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create new user
    const newUser = new User({
      username: req.body.username,
      location: req.body.location,
      email: req.body.email,
      password: hashedPassword
    });

    // Save user and response
    const user = await newUser.save();
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

/// LOGIN ///
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(403).json('Email not found');

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) return res.status(403).json('Incorrect password');

    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
