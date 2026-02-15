import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "vendorTaxVendor", required: true },
  tasks: [
    {
      name: String,
      rate: Number,
      quantity: Number,
      amount: Number
    }
  ],
  totalAmount: { type: Number, default: 0 },
  penalties: { type: Number, default: 0 },
  bonuses: { type: Number, default: 0 },
  dueDate: Date,
  approved: { type: Boolean, default: false },
  paymentProof: { type: String }
}, { timestamps: true });

export default mongoose.model("venderTaxPayment", paymentSchema);