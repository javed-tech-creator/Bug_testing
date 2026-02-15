import mongoose from "mongoose";

const expenseCategorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: [
        "Logistics",
        "Material",
        "Office Supplies",
        "Travel",
        "AMC",
        "Repairs",
      ],
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// ✅ Make category + department unique together
expenseCategorySchema.index({ category: 1, department: 1 }, { unique: true });

// ✅ Ensure indexes follow schema only (remove old "name_1")
expenseCategorySchema.set("autoIndex", true);

const ExpenseCategory =
  mongoose.models.ExpenseCategory ||
  mongoose.model("ExpenseCategory", expenseCategorySchema);

export default ExpenseCategory;
