// models/vendorCustomerModel.model.js
import mongoose from "mongoose";

const vendorCustomerSchema = new mongoose.Schema(
  {
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    fullName: { 
      type: String, 
      required: true, 
      trim: true 
    },
    phone: { 
      type: String, 
      required: true, 
      trim: true,
      match: [/^\d{10}$/, "Phone number must be exactly 10 digits"] 
    },
    email: { 
      type: String, 
      required: true, 
      trim: true, 
      lowercase: true, 
      match: [/.+\@.+\..+/, "Please enter a valid email address"] 
    },
    gstin: { 
      type: String, 
      default: "", 
      uppercase: true, 
      match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GSTIN format"], 
    },
    companyName: { 
      type: String, 
      required: true, 
      trim: true 
    },
    addressLine1: { 
      type: String, 
      required: true, 
      trim: true 
    },
    addressLine2: { 
      type: String, 
      default: "", 
      trim: true 
    },
    city: { 
      type: String, 
      required: true, 
      trim: true 
    },
    pincode: { 
      type: String, 
      required: true, 
      match: [/^\d{6}$/, "Pincode must be exactly 6 digits"] 
    },
    state: { 
      type: String, 
      required: true, 
      trim: true 
    },
    country: { 
      type: String, 
      default: "India" 
    },
  },
  { timestamps: true }
);

vendorCustomerSchema.index({ createdBy: 1 });
const vendorCustomerModel= mongoose.model("Customer", vendorCustomerSchema);

export default vendorCustomerModel;