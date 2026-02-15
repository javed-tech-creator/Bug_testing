import mongoose from "mongoose";

// Simple assign step schema to record who was assigned and when
const assignStepSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const clientProjectMapSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
      index: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
      index: true,
    },
    coordinator: {
      type: assignStepSchema,
      default: null,
    },
    branch: {
      type: String,
      default: null,
    },
    deadline: {
      type: Date,
      default: null,
    },
    urgency: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: null,
    },
    comment: {
      type: String,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Ensure one mapping per client
clientProjectMapSchema.index({ clientId: 1 }, { unique: true });

const ClientProjectMap = mongoose.model("ClientProjectMap", clientProjectMapSchema);
export default ClientProjectMap;
