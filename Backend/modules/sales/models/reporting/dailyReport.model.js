import mongoose from "mongoose";

const { Schema } = mongoose;

const morningLeadSchema = new Schema(
  {
    leadId: {
      type: Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
      index: true,
    },
    leadName: { type: String, trim: true },
    leadCompany: { type: String, trim: true },
    leadPhone: { type: String, trim: true },
    leadEmail: { type: String, lowercase: true, trim: true },
    leadLocation: { type: String, trim: true },

    expectedAmount: { type: Number, default: 0 },

    targetCategory: {
      type: String,
      enum: ["sales_in", "lead_in", "business_in", "amount_in"],
      required: true,
    },

    vertical: {
      type: String,
      enum: ["self", "business_associates", "franchise", "partner"],
      required: true,
    },

    timeDuration: {
      type: Number, 
      default: 0,
      min: 0,
    },

    actionRequired: {
      type: String,
      enum: ["call", "meeting", "demo", "followup", "proposal", "visit"],
      required: true,
    },

    remark: { type: String, trim: true },

    // Calculated fields (2%)
    leadAmount: { type: Number, default: 0 },
    dealAmount: { type: Number, default: 0 },
    relationAmount: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["planned", "in_progress", "completed"],
      default: "planned",
    },
  },
  { _id: false }
);

const eveningLeadSchema = new Schema(
  {
    leadId: {
      type: Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },

    leadName: { type: String, trim: true },
    leadCompany: { type: String, trim: true },

    actualAmount: { type: Number, default: 0 },

    timeSpent: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["win", "loss", "progress"],
      required: true,
    },

    winReason: { type: String, trim: true },
    lossReason: { type: String, trim: true },
    progressNotes: { type: String, trim: true },

    nextAction: { type: String, trim: true },
    followUpDate: { type: Date },

    // Updated calculated fields
    leadAmount: { type: Number, default: 0 },
    dealAmount: { type: Number, default: 0 },
    relationAmount: { type: Number, default: 0 },
    totalIncentive: { type: Number, default: 0 },

    // From morning comparison
    expectedAmount: { type: Number, default: 0 },
    timeAllocated: { type: Number, default: 0 },
    actionPlanned: { type: String, trim: true },
  },
  { _id: false }
);

const salesDailyReportingSchema = new Schema(
  {
    userId: {
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

    submittedAt: { type: Date },

    status: {
      type: String,
      enum: ["draft", "submitted", "approved"],
      default: "draft",
      index: true,
    },

    ipAddress: { type: String },
    deviceInfo: { type: String },

    morning: {
      plannedTasks: [{ type: String, trim: true }],
      plannedMeetings: { type: Number, default: 0 },
      targetForDay: { type: Number, default: 0 },
      leads: [morningLeadSchema],
      totalLeads: { type: Number, default: 0 },
      totalExpectedAmount: { type: Number, default: 0 },
      totalLeadAmount: { type: Number, default: 0 },
      totalTimeAllocated: { type: Number, default: 0 },
    },

    evening: {
      completedTasks: [{ type: String, trim: true }],
      tasksPending: [{ type: String, trim: true }],
      meetingsAttended: { type: Number, default: 0 },

      achievements: { type: String, trim: true },
      challengesFaced: { type: String, trim: true },

      salesDone: { type: Number, default: 0 },

      leads: [eveningLeadSchema],

      totalActualAmount: { type: Number, default: 0 },
      totalTimeSpent: { type: Number, default: 0 },
      conversionRate: { type: Number, default: 0 },
      totalIncentive: { type: Number, default: 0 },

      wonLeads: { type: Number, default: 0 },
      lostLeads: { type: Number, default: 0 },
      progressLeads: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

salesDailyReportingSchema.index(
  { userId: 1, reportDate: 1, reportType: 1 },
  { unique: true }
);

salesDailyReportingSchema.index({ userId: 1, status: 1 });
salesDailyReportingSchema.index({ reportDate: 1 });
salesDailyReportingSchema.index({ "morning.leads.leadId": 1 });

export const SalesDailyReporting = mongoose.model(
  "SalesDailyReporting",
  salesDailyReportingSchema
);
