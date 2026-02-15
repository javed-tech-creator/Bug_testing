import mongoose from "mongoose";
import { baseProfileSchema } from "./baseProfileSchema.model.js";

const freelancerSchema = new mongoose.Schema(
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
freelancerSchema.index({ contactNumber: 1, email: 1, businessName: 1 });

// text search for flexible searching
freelancerSchema.index({
  contactPersonName: "text",
  businessName: "text",
  email: "text",
  city: "text",
  state: "text",
});

const FreelancerProfile = mongoose.model("FreelancerProfile", freelancerSchema);
export default FreelancerProfile;
