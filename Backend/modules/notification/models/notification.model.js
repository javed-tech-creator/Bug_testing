import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  type: { type: String, default: "info" },
  priority: { type: String, enum: ["low","normal","high"], default: "normal" },
  channels: [String],
  status: { type: String, enum: ["pending","sent","failed","queued"], default: "pending" },
  userId: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  scheduledAt: { type: Date, default: null },
  readAt: { type: Date, default: null },
  payload: { type: mongoose.Schema.Types.Mixed, default: null },
  chanelStatus: { type: mongoose.Schema.Types.Mixed, default: null },
  failedReason: { type: String, default: null },
}, { timestamps: true });


const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
