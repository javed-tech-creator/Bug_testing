import mongoose from "mongoose";

const payoutSchema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
  poNumber: { type: String, required: true },
  task: String,
  amount: { type: Number, required: true },
  taxDeduction: { type: Number, default: 0 },
  status: { type: String, enum: ["Requested", "Approved", "Paid"], default: "Requested" },
  paymentDate: Date,
  createdAt: { type: Date, default: Date.now },
});

const Payout = mongoose.model("Payout", payoutSchema);

export default Payout;
