const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['admin', 'staff', 'customer'],
    default: 'customer',
    required: true
  },
  // Admin & optional Customer
  email: {
    type: String,
    trim: true,
    lowercase: true,
    sparse: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please fill a valid email address']
  },
  // Admin only
  password: {
    type: String,
    minlength: 6
  },
  // Staff & Customer
  name: {
    type: String,
    trim: true
  },
  // All roles (except admin maybe, but plan says admin phone too)
  phone: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  // Staff only
  staffId: {
    type: String,
    unique: true,
    sparse: true
  },
  pin: {
    type: String,
  },
  // Customer only
  address: {
    type: String,
    trim: true
  }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  // Hash password if modified
  if (this.isModified('password') && this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.matchPin = async function (enteredPin) {
  return enteredPin === this.pin;
};

module.exports = mongoose.model('User', userSchema);
