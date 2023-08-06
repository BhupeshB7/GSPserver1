const mongoose = require('mongoose');
const validator = require('validator');
// const bcrypt = require('bcrypt');
const pendingTransferSchema = new mongoose.Schema({
  amount: { type: Number, default: 0 },
  deduction: { type: Number, default: 0 },
  status: { type: String, default: 'Pending' },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Invalid email'
    }
  },
  password: {
    type: String,
    // required: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^(\+\d{1,3}[- ]?)?\d{10}$/.test(v);
      },
      message: 'Invalid mobile number'
    }
  },
  sponsorId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  bio: {
    type: String,
  },
  address: {
    type: String,
  },
  accountNo: {
    type: String,
  },
  ifscCode: {
    type: String,
  },
  GPay: {
    type: String,
  },
  aadhar: {
    type: String,
  },
  accountHolderName: {
    type: String,
  },
  withdrawalDone: {
    type: Boolean,
    default: false,
  },
  tokens: [{
    token: {
      type: String,
      required: true,
    },
  }],
  verifytoken:{
    type: String,
},
role: {
  type: String,
  enum: ['user', 'admin'],
  default: 'user',
},
is_active: { type: Boolean, default: false },
income:{type:Number, default:0},
balance:{type:Number, default:0},
withdrawal:{type:Number, default:0},
selfIncome:{type:Number, default:0},
teamIncome:{type:Number, default:0},
rewards:{type:Number, default:0},
topupWallet: { type: Number, default: 0 },
pendingTransfer: [pendingTransferSchema],
activationTime: {
  type: Date,
  default: null
},
  // Add the new field for tracking lastUpdated date
  lastUpdated: {
    type: Date,
  },
date: {Date},
 }, {timestamps: true},
);

module.exports = mongoose.model('User', userSchema);

