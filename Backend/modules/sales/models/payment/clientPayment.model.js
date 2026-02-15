import mongoose from 'mongoose'
import ApiError from '../../../../utils/master/ApiError.js';
const clientPaymentsSchema =  mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
    index: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    unique: true,
    index: true
  },
  quotationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ClientQuotation',
  },

  finalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  totalPaid: {
    type: Number,
    default: 0,
    min: 0,
  },
  remainingAmount: {
    type: Number,
   default:0,
    min: 0,
  },
  initialPaymentDone: {
    type: Boolean,
    default: false
  },
  paymentStatus: {
    type: String,
    enum: ['NOT_STARTED', 'INITIAL_DONE', 'PARTIAL', 'COMPLETED'],
    default: 'NOT_STARTED'
  },
  payments:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Payment",
  }],

  lastPaymentDate: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
},{timestamps:true});


clientPaymentsSchema.pre('save', function(next) {
    if (this.totalPaid > this.finalAmount) {
    return next(new ApiError('Total paid cannot exceed final amount'));
  }
 this.remainingAmount = Number((this.finalAmount - this.totalPaid).toFixed(2));
  if (this.totalPaid === 0) {
    this.paymentStatus = 'NOT_STARTED';
    this.initialPaymentDone = false;
  } else if (this.totalPaid >= this.finalAmount) {
    this.paymentStatus = 'COMPLETED';
    this.initialPaymentDone = true;
  } else if (this.totalPaid > 0 && this.totalPaid < this.finalAmount) {
    this.paymentStatus = 'PARTIAL';
    if (!this.initialPaymentDone && this.totalPaid > 0) {
      this.initialPaymentDone = true;
    }
  }
  
  next();
});

clientPaymentsSchema.index({ paymentStatus: 1 });
clientPaymentsSchema.index({ clientId: 1, paymentStatus: 1 });

const ClientPayment = mongoose.model('ClientPayment', clientPaymentsSchema);
export default ClientPayment