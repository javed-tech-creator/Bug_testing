import mongoose from "mongoose";
import { baseProfileSchema } from "./baseProfileSchema.model.js";

const PartnerSchema = new mongoose.Schema(
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
PartnerSchema.index({ contactNumber: 1, email: 1, businessName: 1 });

// text search for flexible searching
PartnerSchema.index({
  contactPersonName: "text",
  businessName: "text",
  email: "text",
  city: "text",
  state: "text",
});

const PartnerProfile = mongoose.model("PartnerProfile", PartnerSchema);
export default PartnerProfile;
