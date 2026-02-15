import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now },
    department: { type: String, trim: true, default: "" },
    name: { type: String, trim: true, default: "" },
    role: { type: String, trim: true, default: "" },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration",
      default: null,
    },
  },
  { _id: false } // do not create extra _id
);

export default assignmentSchema;
