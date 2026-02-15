import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  po: { type: mongoose.Schema.Types.ObjectId, ref: "PurchaseOrder", required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
  stage: { type: String, enum: ["Requested", "Approved", "Paid"], default: "Requested" },
  amount: { type: Number, required: true },
  tds: { type: Number, default: 0 }, // Tax deducted
  netAmount: { type: Number, required: true }, // amount - tds
  task: String,
  dueDate: Date
}, { timestamps: true });
const Payment = mongoose.models.Payment || mongoose.model('VenderPayment', paymentSchema);

export default Payment;
