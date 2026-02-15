import mongoose from "mongoose";

// Regex for IFSC Code (India) - 4 letters, 0, then 6 digits
const IFSC_REGEX = /^[A-Za-z]{4}0[A-Z0-9]{6}$/;

// Simple regex for UPI ID (example@bank)
const UPI_REGEX = /^[\w.-]+@[\w.-]+$/;

const bankSchema = new mongoose.Schema(
  {
    accountHolderName: {
      type: String,
      required: [true, "Account holder name is required"],
      trim: true,
      minlength: [2, "Account holder name must be at least 2 characters"],
      maxlength: [50, "Account holder name cannot exceed 100 characters"],
    },
    accountNumber: {
      type: String,
      required: [true, "Account number is required"],
      trim: true,
      match: [/^\d{9,18}$/, "Account number must be between 9 and 18 digits"],
    },
    ifscCode: {
      type: String,
      required: [true, "IFSC code is required"],
      trim: true,
      uppercase: true,
      match: [IFSC_REGEX, "Invalid IFSC code format"],
    },
    bankName: {
      type: String,
      required: [true, "Bank name is required"],
      trim: true,
      minlength: [2, "Bank name must be at least 2 characters"],
      maxlength: [50, "Bank name cannot exceed 50 characters"],
    },
    branchName: {
      type: String,
      trim: true,
      maxlength: [50, "Branch name cannot exceed 50 characters"],
    },
    upiId: {
      type: String,
      trim: true,
      match: [UPI_REGEX, "Invalid UPI ID format"],
      maxlength: [40, "UPI ID cannot exceed 40 characters"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "CreatedBy (user) is required"],
    },
  },
  { timestamps: true }
);


const bankModel = mongoose.model("Bank", bankSchema);
export default bankModel;
