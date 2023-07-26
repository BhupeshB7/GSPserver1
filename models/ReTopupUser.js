const mongoose = require('mongoose');
// Define a Mongoose Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    userID: { type: String, required: true },
    balance: { type: Number, required: true },
    income: { type: Number, required: true },
    selfIncome: { type: Number, required: true },
    LevelIncome: { type: Number, required: true },
  });
  module.exports = mongoose.model('RetopUpUser', userSchema);