import mongoose from "mongoose";
import { baseProfileSchema } from "./baseProfileSchema.model.js";

const vendorSchema = new mongoose.Schema(
  {
    profileId: {
      type: String,
      unique: true,
      index: true,
      trim: true,
    },
    ...baseProfileSchema,
  },
  {
    timestamps: true,
  }
);

// compound index for fast lookups
vendorSchema.index({ contactNumber: 1, email: 1, businessName: 1 });

// text search for flexible searching
vendorSchema.index({
  contactPersonName: "text",
  businessName: "text",
  email: "text",
  city: "text",
  state: "text",
});

const VendorProfile = mongoose.model("VendorProfile", vendorSchema);
export default VendorProfile;
