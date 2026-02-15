import mongoose from "mongoose";

const vendorProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // Personal & Business Info (Grouped)
  personalInfo: {
    contactPersonName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    contactNumber: {
      type: String,
      required: true,
      match: [/^[6-9]\d{9}$/, "Invalid mobile number"],
    },
    alternateContact: {
      type: String,
      match: [/^[6-9]\d{9}$/, "Invalid alternate mobile number"],
      default: "",
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Invalid email address",
      ],
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
  },

  // Address Info (Grouped)
  address: {
    street: { type: String, trim: true, default: "" },
    area: { type: String, trim: true, default: "" },
    city: { type: String, trim: true, default: "" },
    state: { type: String, trim: true, default: "" },
    pincode: {
      type: String,
      match: [/^\d{6}$/, "Invalid pincode"],
      default: "",
    },
  },

  // KYC Details (Grouped)
  kycDetails: {
    gstNumber: {
      type: String,
      trim: true,
      uppercase: true,
      match: [
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/,
        "Invalid GST Number",
      ],
      default: "",
    },
    panNumber: {
      type: String,
      trim: true,
      uppercase: true,
      match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN Number"],
      default: "",
    },
    aadharNumber: {
      type: String,
      match: [/^\d{12}$/, "Invalid Aadhar Number"],
      default: "",
    },
    bankName: {
      type: String,
      trim: true,
      default: "",
    },
    accountNumber: {
      type: String,
      match: [/^\d{9,18}$/, "Invalid account number"],
      default: "",
    },
    ifscCode: {
      type: String,
      uppercase: true,
      match: [/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC Code"],
      default: "",
    },
    cin: {
      type: String,
      uppercase: true,
      match: [
        /^([A-Z]{1})(\d{5})([A-Z]{2})(\d{4})([A-Z]{3})(\d{6})$/,
        "Invalid CIN Number",
      ],
      default: "",
    },
    tin: {
      type: String,
      match: [/^\d{11}$/, "Invalid TIN Number"],
      default: "",
    },
  },

  // Contract PDF
  contractForm: {
    fileName: { type: String, default: "" },
    fileUrl: { type: String, default: "" },
  },

  // Profile Image
  profileImage: {
    fileName: { type: String, default: "" },
    fileUrl: { type: String, default: "" },
    public_id:{type:String, default:""}
  },
}, {
  timestamps: true,
});

const VendorProfileModel = mongoose.model("VendorProfile", vendorProfileSchema);
export default VendorProfileModel;
