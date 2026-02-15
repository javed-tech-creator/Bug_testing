import mongoose from "mongoose";
import { isURL } from "../../validator/lib/isURL.js";

const StatusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: [
        "Running",
        "Paused",
        "Draft",
        "Scheduled",
        "Completed",
        "Cancelled",
        "Failed",
      ],
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration",
      required: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

//  Target Audience Schema
const TargetAudienceSchema = new mongoose.Schema({
  region: {
    type: String,
    required: [true, "Region is required"],
    trim: true,
    minlength: [2, "Region must be at least 2 characters"],
    maxlength: [100, "Region can't exceed 100 characters"],
  },
  demographics: {
    type: String,
    required: [true, "Demographics is required"],
    trim: true,
    minlength: [2, "Demographics must be at least 2 characters"],
    maxlength: [200, "Demographics can't exceed 200 characters"],
  },
  interests: {
    type: [String],
    required: [true, "At least one interest is required"],
    validate: {
      validator: (v) => Array.isArray(v) && v.length > 0,
      message: "At least one interest must be provided",
    },
  },
});

//  Campaign Schema
const CampaignSchema = new mongoose.Schema(
  {
    campaign_id: {
       type: String,
        required: true, 
        unique: true
       }, // Platform se aayega
    campaignName: {
      type: String,
      required: [true, "Campaign name is required"],
      trim: true,
      minlength: [2, "Campaign name must be at least 2 characters"],
      maxlength: [200, "Campaign name can't exceed 200 characters"],
    },
    type: {
      type: String,
      required: [true, "Campaign type is required"],
      enum: {
        values: ["Print", "Digital", "Event", "Other"],
        message: "Type must be Print, Digital, Event or Other",
      },
    },
    platform: {
      type: String,
      required: [true, "Platform is required"],
      enum: {
        values: ["Facebook", "Instagram", "Google Ads", "Whatsapp", "Other"],
        message: "Invalid platform",
      },
    },
    objective: {
      type: String,
      required: [true, "Objective is required"],
      enum: {
        values: ["Awareness", "Lead Gen", "Engagement", "Other"],
        message: "Invalid objective",
      },
    },
    targetAudience: { type: TargetAudienceSchema, required: true },
    budget: {
      type: Number,
      required: [true, "Budget is required"],
      min: [1, "Budget must be greater than 0"],
    },
    landingPage: {
      type: String,
      validate: {
        validator: (v) => !v || isURL(v),
        message: "Landing page must be a valid URL",
      },
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          if (!this.startDate || !value) return true; // skip if missing
          return new Date(value) > new Date(this.startDate);
        },
        message: "End date must be after start date",
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration", // assume you have a User model
      default: null,
    },
    //  Soft delete fields
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration", // assume you have a User model
      default: null,
    },
    statusHistory: [StatusHistorySchema], // added array for history
    status: {
      type: String,
      default: "Draft",
      enum: [
        "Running",
        "Paused",
        "Draft",
        "Scheduled",
        "Completed",
        "Cancelled",
        "Failed",
      ],
    },
  },
  { timestamps: true }
);

const campaignModel = mongoose.model("Campaign", CampaignSchema);
export default campaignModel;
