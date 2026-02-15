import mongoose from "mongoose";

// Assignment step schema - userId + assignTime for each step
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

const clientMappingSchema = new mongoose.Schema(
  {
    clientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Client",
        required:true,
        index:true,
    },
    projectId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        index: true,
    }],
    isSendtoManager: { type: Boolean, default: false },
    isSendtoProjectDepartment: { type: Boolean, default: false },

    // Step 2: Client sent to Manager
    manager: {
      type: assignStepSchema,
      default: null,
    },
    projectDepartmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },

    projectDepartmentManager: {
      type: assignStepSchema,
      default: null,
    },

    currentStep: {
      type: String,
      enum: ["executive", "manager", "projectDepartment"],
      default: null,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

clientMappingSchema.index({ clientId: 1 }, { unique: true });

const ClientMapping = mongoose.model("ClientMapping", clientMappingSchema);
export default ClientMapping;
