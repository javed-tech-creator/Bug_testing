import mongoose from "mongoose";
import { baseProfileSchema } from "./baseProfileSchema.model.js";

const FranchiseSchema = new mongoose.Schema(
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
FranchiseSchema.index({ contactNumber: 1, email: 1, businessName: 1 });

// text search for flexible searching
FranchiseSchema.index({
  contactPersonName: "text",
  businessName: "text",
  email: "text",
  city: "text",
  state: "text",
});

const FranchiseProfile = mongoose.model("FranchiseProfile", FranchiseSchema);
export default FranchiseProfile;
