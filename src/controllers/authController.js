const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password, phone, pin } = req.body;

    if (email && password) {
      const user = await User.findOne({ email, role: 'admin' });
      if (user && (await user.matchPassword(password))) {
        return res.json({
          _id: user._id,
          role: user.role,
          email: user.email,
          token: generateToken(user._id),
        });
      }
      res.status(401);
      throw new Error('Invalid admin credentials');
    } else if (phone && pin) {
      const user = await User.findOne({ 
        $or: [{ phone: phone }, { staffId: phone }], 
        role: 'staff' 
      });
      if (user && (await user.matchPin(pin))) {
        return res.json({
          _id: user._id,
          role: user.role,
          phone: user.phone,
          token: generateToken(user._id),
        });
      }
      res.status(401);
      throw new Error('Invalid staff credentials');
    } else {
      res.status(400);
      throw new Error('Please provide email/password or phone/pin');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new user (Added for convenience since no user exists initially)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { email, password, phone } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await User.create({
      role: 'admin',
      email,
      password,
      phone
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        role: user.role,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { loginUser, registerUser };
