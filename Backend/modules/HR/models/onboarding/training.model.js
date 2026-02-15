import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  url: { type: String, default: null },
  public_url: { type: String, default: null },
  public_id: { type: String, default: null },
}, { _id: false });

const trainingSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "EmployeeProfile", required: true },
  trainingName: { type: String, required: true }, 
  trainingType: { type: String, default: "other" },
  trainingPeriod: { type: String, required: true },
  trainingStartDate: { type: Date, default: Date.now },
  trainingEndDate: { type: Date, default: null },
  mentorName: { type: String, default: null },
  materials: [fileSchema],    
  completionStatus: { type: String, enum: ["not-started", "in-progress", "completed"], default: "not-started" },
  remark: { type: String, default: null },
  status: { type: String, enum: ["active", "completed", "pending", "cancelled"], default: "pending" },
  isMandatory: { type: Boolean, default: false }
}, { timestamps: true });

const Training =  mongoose.model("Training", trainingSchema);
export default Training
