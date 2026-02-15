import mongoose from "mongoose";
const vendorSchema = new mongoose.Schema(
   
  {
    name: { type: String, required: true },
    company: { type: String },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    type: {
      type: String,
      enum: ["vendor", "contractor", "helper"],  
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { strict: true }  
);
const vnd = mongoose.models.vnd || mongoose.model("vnd", vendorSchema);
export default vnd