import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "ExpenseCategory", required: true },
  department: { type: String, required: true },
  project: { type: String },
  task: { type: String },
  receiptUrl: { type: String },
  status: { type: String, enum: ["Requested", "Verified", "Approved"], default: "Requested" },
}, { timestamps: true });

const Expense2= mongoose.models.Expense2 ||mongoose.model("Expense2", expenseSchema);
export default  Expense2
