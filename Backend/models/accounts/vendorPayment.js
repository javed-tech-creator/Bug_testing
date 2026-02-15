import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  description: { type: String, required: true },
  rate: { type: Number, required: true },
  quantity: { type: Number, required: true },
  amount: { type: Number, required: true }
});

const paymentSchema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "vnd", required: true },
  project: { type: String, required: true },
  tasks: [taskSchema],
  subTotal: { type: Number, required: true },
  penalties: { type: Number, default: 0 },
  bonuses: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  remainingAmount: { type: Number },
  status: { type: String, enum: ["pending", "partial", "paid"], default: "pending" },
  approvalStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  dueDate: { type: Date },
  paymentProofs: [{ type: String }], // URLs of uploaded proofs
  notes: [{ type: String }]
}, { timestamps: true });

// Auto calculate remainingAmount before save
paymentSchema.pre("save", function(next) {
  this.remainingAmount = this.totalAmount - this.paidAmount;
  if (this.paidAmount === 0) this.status = "pending";
  else if (this.paidAmount < this.totalAmount) this.status = "partial";
  else this.status = "paid";
  next();
});

export const  payment= mongoose.models.payment || mongoose.model("payment", paymentSchema);