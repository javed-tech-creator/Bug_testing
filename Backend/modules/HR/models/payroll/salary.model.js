import mongoose, { model, Schema } from "mongoose";

const salaryPaymentSchema = new Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmployeeProfile",
      required: true,
    },
    year: { type: Number, required: true },
    month: { type: Number, required: true ,min: 1, max: 12 },  
    isPaid: { type: Boolean, default: false },
    paidAmount: { type: Schema.Types.Mixed },  
  },
  {
    timestamps: true,
  }
);
salaryPaymentSchema.index(
  { employeeId: 1, year: 1, month: 1 }, 
  { unique: true }
);
 
const salaryModel = model("SalaryPayment", salaryPaymentSchema);

export default salaryModel;