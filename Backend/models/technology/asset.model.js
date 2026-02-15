import mongoose, { trusted } from "mongoose";
import assignmentSchema from "./commonSchema.js";

const assetSchema = new mongoose.Schema(
  {
    tag: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    }, //unique: true
    type: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    status: { type: String, required: true, index: true, trim: true },
    isDeleted: { type: Boolean, default: false },
    assignedTo: assignmentSchema,
    reassignments: [assignmentSchema],
    vendor_name: { type: String, required: true, trim: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration", // jisne license create kiya
      default: null,
    },
    purchase_date: {
      type: Date,
      required: [true, "Purchase date is required"],
      validate: {
        validator: function (value) {
          if (!value) return false;
          const today = new Date();
          today.setHours(0, 0, 0, 0); // sirf date check karne ke liye
          return value <= today; // aaj ya past ki date valid
        },
        message: "Purchase date cannot be in the future",
      },
    },
    warranty_end: {
      type: Date,
      required: [true, "Warranty end date is required"],
      validate: {
        validator: function (value) {
          // Agar purchase_date nahi hai to skip karo
          if (!this.purchase_date || !value) return true;
          return value >= this.purchase_date;
        },
        message: "Warranty end date must be after the purchase date",
      },
    },
    amc_contract: { type: String, enum: ["Yes", "No"], required: true },
    contract_no: { type: String, default: "", trim: true },
    validity: {
      type: Date,
      default: null,
      validate: {
        validator: function (value) {
          if (!value) return true; // agar null hai to skip
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return value >= today; // sirf aaj ya future ki date valid
        },
        message: "Validity date cannot be in the past",
      },
    },
  },
  { timestamps: true }
);

const assetModel = mongoose.model("Asset", assetSchema);
export default assetModel;
