import mongoose from "mongoose";

const actionGroupSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    trim: true
  },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
  permissions: {
    crud: {
      type: [String],
      enum: ["view", "create", "update", "delete"],
      default: []
    },
    workflow: {
      type: [String],
      enum: ["import", "export", "assign", "approve", "reject", "submit", "reopen", "close", "forward", "return"],
      default: []
    },
    data: {
      type: [String],
      enum: ["filter", "search", "sort", "generate_report", "download", "upload", "print"],
      default: []
    },
    system: {
      type: [String],
      enum: ["login", "logout", "activate", "deactivate", "reset_password", "configure", "notify", "rate", "review", "track", "escalate"],
      default: []
    }
  }
}, { timestamps: true }); 

const ActionGroup = mongoose.model("ActionGroup", actionGroupSchema);

export default ActionGroup;
