import mongoose from "mongoose";

const { Schema } = mongoose;

const managerReportSchema = new Schema(
  {
    managerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    reportDate: {
      type: Date,
      required: true,
      index: true,
    },

    reportType: {
      type: String,
      enum: ["morning", "evening"],
      required: true,
    },
    remarks: { type: String, trim: true },
    highlights: { type: String, trim: true },
    challenges: { type: String, trim: true },
    dailyReportId: {
      type: Schema.Types.ObjectId,
      ref: "SalesDailyReporting",
    },

    status: {
      type: String,
      enum: ["draft", "submitted"],
      default: "draft",
    },

    submittedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

managerReportSchema.index(
  { managerId: 1, reportDate: 1, reportType: 1 },
  { unique: true }
);

managerReportSchema.index({ reportDate: 1 });

export const ManagerReport = mongoose.model(
  "ManagerReport",
  managerReportSchema
);
