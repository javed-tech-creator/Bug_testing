import mongoose from "mongoose";
import assignmentSchema from "./commonSchema.js";
const licenseSchema = new mongoose.Schema(
  {
    licenseId: {
      type: String,
      required: [true, "License ID / Key is required"],
      trim: true,
      unique: true,
      lowercase: true,
    },
    softwareName: {
      type: String,
      required: [true, "Software Name is required"],
      trim: true,
    },
    versionType: {
      type: String,
      enum: ["Single License", "Volume License", "Cloud"],
      required: [true, "Version / Type is required"],
    },
    validityStart: {
      type: Date,
      required: [true, "Start date is required"],
      validate: {
        validator: function (value) {
          if (!value) return false;
          const today = new Date();
          today.setHours(0, 0, 0, 0); // sirf date compare karne ke liye
          return value <= today; // start date aaj ya past me honi chahiye
        },
        message: "Start date cannot be in the future",
      },
    },

    validityEnd: {
      type: Date,
      required: [true, "End date is required"],
      validate: {
        validator: function (value) {
          // End date must be after start date
          return this.validityStart && value > this.validityStart;
        },
        message: "Validity end date must be greater than start date",
      },
    },
    seats: {
      type: Number,
      required: [true, "Number of seats is required"],
      min: [1, "Seats must be at least 1"],
    },
    renewalAlert: {
      type: String,
      enum: [
        "15 days before expiry",
        "30 days before expiry",
        "45 days before expiry",
        "60 days before expiry",
      ],
      required: [true, "Renewal Alert setting is required"],
    },
    vendorDetails: {
      type: String,
      required: [true, "Vendor details are required"],
      trim: true,
    },
    assignedTo: assignmentSchema,
    reassignments: [assignmentSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration", // jisne license create kiya
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const licenseModel = mongoose.model("License", licenseSchema);

export default licenseModel;
