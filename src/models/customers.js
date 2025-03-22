const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  phone: String,
  total: Number,
  transactions: [
    {
      type: { type: String, enum: ['purchase', 'payment'] },
      amount: Number,
      date: { type: Date, default: Date.now },
      for: String, 
    },
  ],
});

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;