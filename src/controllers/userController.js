const User = require('../models/User');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const addUser = async (req, res, next) => {
  try {
    const { role, name, phone, email, password, address } = req.body;
    
    // Default role is customer if not specified
    const userRole = role || 'customer';

    if (phone) {
      const userExists = await User.findOne({ phone });
      if (userExists) {
        res.status(400);
        throw new Error('User with this phone already exists');
      }
    }

    if (email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        res.status(400);
        throw new Error('User with this email already exists');
      }
    }

    let newUserPayload = { role: userRole, phone, name, email, address };
    if (!email || email.trim() === '') {
      delete newUserPayload.email;
    }

    if (userRole === 'admin') {
      newUserPayload.password = password;
    } else if (userRole === 'staff') {
      // Auto generate 6 digit ID and 4 digit PIN
      const generateId = () => Math.floor(100000 + Math.random() * 900000).toString();
      const generatePin = () => Math.floor(1000 + Math.random() * 9000).toString();
      
      let staffId = generateId();
      let isUnique = false;
      while (!isUnique) {
        const existing = await User.findOne({ staffId });
        if (!existing) isUnique = true;
        else staffId = generateId();
      }

      const pin = generatePin();
      newUserPayload.staffId = staffId;
      newUserPayload.pin = pin;

      const user = new User(newUserPayload);
      const createdUser = await user.save();
      
      return res.status(201).json({
        message: 'Staff created successfully',
        staffId: staffId,
        pin: pin, // Send back raw pin once for the admin to copy
        user: createdUser
      });
    }

    const user = new User(newUserPayload);
    const createdUser = await user.save();
    res.status(201).json(createdUser);
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, addUser };
