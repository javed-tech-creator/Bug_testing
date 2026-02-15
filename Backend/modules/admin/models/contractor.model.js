import mongoose from "mongoose";
import { baseProfileSchema } from "./baseProfileSchema.model.js";

const contractorSchema = new mongoose.Schema(
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
contractorSchema.index({ contactNumber: 1, email: 1, businessName: 1 });

// text search for flexible searching
contractorSchema.index({
  contactPersonName: "text",
  businessName: "text",
  email: "text",
  city: "text",
  state: "text",
});

const ContractorProfile = mongoose.model("ContractorProfile", contractorSchema);
export default ContractorProfile;
