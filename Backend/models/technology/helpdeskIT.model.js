import mongoose from "mongoose";
import assignmentSchema from "./commonSchema.js";

const ticketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    ticketType: {
      type: String,
      required: true,
      enum: ["Hardware", "Software", "Internet", "Email", "Other"], // tum apne hisaab se aur bhi add kar sakte ho
    },
    raisedBy: {
     type: mongoose.Schema.Types.ObjectId,
      ref: "Registration", // jisne ticket raise kiya // EMP-xxx / Department
      required: true,
      trim: true,
    },
    priority: {
      type: String,
      required: true,
      enum: ["Low", "Medium", "High"],
    },
    issueDescription: {
      type: String,
      required: true,
      trim: true,
    },
    attachment: {
      url: { type: String, default: "" },  // File ka URL (image/video)
      type: { type: String, default: "" }, // MIME type (image/png, video/mp4)
      name: { type: String, default: "" }, // File name (optional)
    },
    assignedTo: assignmentSchema,
     reassignments: [assignmentSchema],
    slaTimer: {
      type: String, // "4 hrs", "8 hrs" etc
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["Open", "In-Progress", "On-Hold", "Resolved"],
      default: "Open",
    },
    resolutionNotes: {
      type: String,
      default: "-",
      trim: true,
    },
     //  History field
    history: [
      {
        status: { type: String,trim: true, },
        resolutionNotes: { type: String,trim: true, },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Registration", // jisme se user update kare
        },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

//  Compound index for fast queries
ticketSchema.index({ raisedBy: 1, status: 1 });

const ticketModel = mongoose.model("Ticket", ticketSchema);
export default ticketModel;
