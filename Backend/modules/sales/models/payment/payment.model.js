import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    index: true
  },
  clientId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Client',
  required: true,
  index: true
},
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  mode: {
    type: String,
    enum: ['CASH', 'UPI', 'BANK_TRANSFER', 'CHEQUE', 'CREDIT_CARD', 'DEBIT_CARD','OTHER'],
    required: true
  },
  type: {
    type: String,
    enum: ['INITIAL', 'REMAINING', 'FINAL'],
    required: true
  },

  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],
    default: 'PENDING'
  },

  transactionId: {
    type: String,
    sparse: true 
  },
  
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  remark: {
    type: String,
    maxlength: 500
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;