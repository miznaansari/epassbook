const mongoose = require('mongoose');
const { Schema } = mongoose;

const userTransactionSchema = new Schema({
  user_id: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', // Reference to the User model
    required: true 
  },
  transaction_name: { 
    type: String, 
    required: true 
  },
  transaction_type: { 
    type: String, 
    enum: ['spend', 'loan', 'lending', 'other'], 
    required: true 
  },
  transaction_status: { 
    type: String, 
    enum: ['pending', 'paid', 'received', 'lending', 'loan_pending', 'loan_paid', 'lending_pending', 'lending_received', 'success'], 
    required: true 
  },
  amount: { 
    type: mongoose.Types.Decimal128, // Using Decimal128 for precise decimal handling
    required: true 
  },
  balance: { 
    type: mongoose.Types.Decimal128, // Using Decimal128 for precise decimal handling
    required: true 
  },
  description: { 
    type: String, 
    default: null 
  }
}, { timestamps: true });

// Create and export the model
const UserTransaction = mongoose.model('UserTransaction', userTransactionSchema);
module.exports = UserTransaction;
