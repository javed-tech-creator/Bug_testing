import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pan: { type: String, required: true, unique: true },
  gst: { type: String, required: true, unique: true },
  email: { type: String },
  bankAccount: { type: String }
}, { timestamps: true });

export default mongoose.model("vendorTaxVendor", vendorSchema);