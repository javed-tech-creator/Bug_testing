import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: "ExpenseCategory", required: true },
  department: { type: String, required: true },
  project: { type: String },
  amount: { type: Number, required: true },
}, { timestamps: true });

const Budget2 =mongoose.models.Budget2 ||mongoose.model("Budget2", budgetSchema);
export default Budget2
