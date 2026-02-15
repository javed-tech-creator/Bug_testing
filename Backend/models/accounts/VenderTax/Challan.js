import mongoose from "mongoose";

const challanSchema = new mongoose.Schema({
  vendorLedger: { type: mongoose.Schema.Types.ObjectId, ref: "vendorTaxVendor", required: true },
  file: { type: String, required: true },
  type: { type: String, enum: ["GST", "TDS", "PaymentProof"], required: true },
  uploadedAt: { type: Date, default: Date.now }
});

export default mongoose.model("vendortaxChallan", challanSchema);