import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema(
  {
    // Lead Source (enum restricted)
    source: {
      type: String,
      enum: [
        "Facebook",
        "Google Ads",
        "Instagram",
        "Whatsapp",
        "Referral",
        "Manual",
        "Other",
      ],
      required: [true, "Lead source is required"],
      trim: true,
    },

    // Campaign mapping (Optional)
    campaignId: {
      type: String,
      default: null,
      trim: true,
    },
    campaignName: {
      type: String,
      default: "",
      trim: true,
      maxlength: [50, "Campaign name should not exceed 50 characters"],
    },

    // Basic details
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [30, "Name cannot exceed 30 characters"],
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      validate: {
        validator: (v) => /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v), // basic email regex
        message: "Please provide a valid email address",
      },
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      validate: {
        validator: (v) => /^\d{10}$/.test(v), // 10 digit Indian number
        message: "Phone number must be 10 digits",
      },
    },
    state: {
      type: String,
      trim: true,
      maxlength: [30, "State name too long"],
    },
    city: {
      type: String,
      trim: true,
      maxlength: [30, "City name too long"],
    },
    notes: {
      type: String,
      maxlength: [100, "Notes should not exceed 100 characters"],
      default: null,
      trim: true,
    },

    // Meta info
    leadGeneratedTime: { type: Date, default: Date.now },
isForwarded: { type: Boolean, default: false },
forwardedAt: { type: Date, default: null },
    leadStatus: {
      type: String,
      enum: ["Hot", "Warm", "Cold"],
      default: "Cold",
    },
  },
  { timestamps: true }
);

const MarketingLeadModel = mongoose.model("MarketingLead", LeadSchema);
export default MarketingLeadModel;
