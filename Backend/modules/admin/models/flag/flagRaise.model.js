import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const { Schema } = mongoose;
const AutoIncrement = AutoIncrementFactory(mongoose);

const flagRaiseSchema = new Schema(
  {
    flagCode: {
      type: Number,
      unique: true,
    },

    type: {
      type: String,
      default: "issue",
      enum: [
        "issue",
        "rework",
        "escalation",
        "clarification",
        "risk",
        "dependency",
      ],
    },

    title: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    reason: {
      type: String,
      trim: true,
    },

    departmentId: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
      index: true,
    },

    againstDepartmentId: [
      {
        type: Schema.Types.ObjectId,
        ref: "Department",
      },
    ],

    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      index: true,
    },

    agaistId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    raisedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    reviewRemark: {
      type: String,
      trim: true,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
      index: true,
    },

    status: {
      type: String,
      enum: [
        "open",
        "in_review",
        "rework_requested",
        "rework_done",
        "approved",
        "rejected",
        "resolved",
        "closed",
      ],
      default: "open",
      index: true,
    },

    reworkInstruction: {
      type: String,
      trim: true,
    },

    resolvedAt: {
      type: Date,
    },

    resolvedRemark: {
      type: String,
      trim: true,
    },

    slovedTime: {
      type: Number, // in hours
      default: 0,
    },

    visibility: {
      type: String,
      enum: ["private", "department", "organization"],
      default: "department",
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);


flagRaiseSchema.plugin(AutoIncrement, {
  inc_field: "flagCode",
  start_seq: 1000,
});


flagRaiseSchema.index({ departmentId: 1, status: 1 });
flagRaiseSchema.index({ assignedTo: 1, status: 1 });
flagRaiseSchema.index({ projectId: 1 });
flagRaiseSchema.index({ productId: 1 });
flagRaiseSchema.index({ agaistID: 1 });
flagRaiseSchema.index({ createdAt: -1 });

export const FlagRaise = mongoose.model(
  "FlagRaise",
  flagRaiseSchema
);
