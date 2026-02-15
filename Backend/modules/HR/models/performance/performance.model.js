import mongoose from "mongoose";

const performanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmployeeProfile", 
      required: false,
    }, 
    role: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 5 }, 
   
  },
  { timestamps: true }
);

export default mongoose.model("Performance", performanceSchema);
