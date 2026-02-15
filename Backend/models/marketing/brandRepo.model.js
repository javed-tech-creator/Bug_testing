import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [100, "Title cannot be more than 100 characters"],
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Photo", "Video", "Logo", "Brochure", "Creative"], //  aap apne categories define kar sakte ho
    },

    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign", //  Campaign model ko reference karega
      required: [true, "Campaign is required"],
    },

    file: {
      name: {
        type: String,
        required: [true, "File name is required"],
      },
      size: {
        type: Number, // in bytes
        required: [true, "File size is required"],
      },
      type: {
        type: String, // e.g. "image/png", "application/pdf", "video/mp4"
        required: [true, "File type is required"],
      },
      url: {
        type: String, // where file is stored (local path or cloud link)
        required: [true, "File URL is required"],
      },
    },
    isDeleted: {
      type: Boolean,
      default: false, //  soft delete flag
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration", //  registrationModel ko reference karega
      default: null,
    },
  },
  { timestamps: true }
);

const BrandRepoUploadModel = mongoose.model("BrandRepoUpload", uploadSchema);
export default BrandRepoUploadModel;
