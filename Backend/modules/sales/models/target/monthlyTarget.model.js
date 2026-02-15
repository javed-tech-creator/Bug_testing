import mongoose from "mongoose";

const MonthlyTargetSchema = new mongoose.Schema(
  {
    executiveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    financialYear: { type: String, required: true },
    quarter: { type: String, enum: ["Q1", "Q2", "Q3", "Q4"], required: true },
    month: {
      type: String,
      enum: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      required: true,
      index: true,
    },

    monthlyTarget: { type: Number, required: true },
    totalSlotTarget: { type: Number, default: 0 },
    totalAchieved: { type: Number, default: 0 },

    carriedForwardFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MonthlyTarget",
    },
    carriedForwardAmount: { type: Number, default: 0 },

    status: {
      type: String,
      enum: [
        "assigned",
        "in_progress",
        "under_review",
        "completed",
        "archived",
      ],
      default: "assigned",
    },
    remark: String,
    // Dates
    assignedAt: { type: Date, default: Date.now },
    completedAt: Date,
    archivedAt: Date,

  },
  {
    timestamps: true,
  }
);

const MonthlyTarget = mongoose.model(
  "MonthlyTarget",
  MonthlyTargetSchema
);
export default MonthlyTarget;

