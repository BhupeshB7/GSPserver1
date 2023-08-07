const mongoose = require('mongoose');

const WithdrawalRequestSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  accountNo:{
    type: String,
    default:0,
  },
  ifscCode:{
    type: String,
    default:0,
  },
  GPay:{
    type: String,
    default:0,
    unique:true,
  },
  transactionNumber:{
    type:String,
    unique: true,
  },
  accountHolderName: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
},{
  timestamps:true
});

module.exports = mongoose.model('WithdrawalRequest', WithdrawalRequestSchema);
