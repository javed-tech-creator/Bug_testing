import Expense2 from "../../../models/finance/expence/expence.js";
import Budget2 from "../../../models/finance/expence/budget.js";
 import fs from "fs";
import ExpenseCategory from "../../../models/finance/expence/expenceCategory.js"; 
import { uploadPDFToCloudinary } from "../../../Helpers/finance/cloudinaryFinancePdf.js";  
export const createExpense = async (req, res) => {
  try {
    let receiptUrl = "";

    if (req.file) {
      
      if (req.file.path) {
       
        receiptUrl = await uploadPDFToCloudinary(req.file.path);
      } else if (req.file.buffer) {
    
        const tempPath = `temp_${Date.now()}.pdf`;
     
        await fs.promises.writeFile(tempPath, req.file.buffer);
        receiptUrl = await uploadPDFToCloudinary(tempPath);
      }
    }

    const { amount, category, department, project } = req.body;

    // Budget check
    const budget = await Budget2.findOne({ category, department, project });
    let budgetExceeded = false;
    if (budget && amount > budget.amount) budgetExceeded = true;

    const expense = await Expense2.create({ ...req.body, receiptUrl });

    const message = budgetExceeded
      ? "Expense created but exceeds the budget!"
      : "Expense created successfully within budget";

    res.status(201).json({ expense, message });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// Get all expenses
export const getExpenses = async (req, res) => {
  const expenses = await Expense2.find().populate("category");
  res.json(expenses);
};

// Update expense (status or details)
export const updateExpense = async (req, res) => {
  try {
    console.log("Request body:", req.body);

    // Merge only fields provided in req.body
    const updatedExpense = await Expense2.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },   // ✅ merge fields instead of overwriting
      { new: true }         // ✅ return the updated document
    );

    if (!updatedExpense)
      return res.status(404).json({ error: "Expense not found" });

    res.json(updatedExpense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Delete expense
export const deleteExpense = async (req, res) => {
  try {
    await Expense2.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Budget vs Actual Report
export const budgetVsActual = async (req, res) => {
  try {
    const { project, department } = req.query;
    let filter = {};
    if (project) filter.project = project;
    if (department) filter.department = department;

    // Get all categories
    const categories = await ExpenseCategory.find();

    // Get expenses and budgets
    const expenses = await Expense2.find(filter).populate("category");
    const budgets = await Budget2.find(filter).populate("category");

    // Initialize report
    const report = categories.map(cat => ({
      categoryId: cat._id,
      categoryName: cat.category,
      actual: 0,
      budget: 0,
      remaining: 0
    }));

    // Calculate actual
    expenses.forEach(exp => {
      const row = report.find(r => r.categoryId.toString() === exp.category?._id.toString());
      if (row) row.actual += exp.amount;
    });

    // Calculate budget
    budgets.forEach(bud => {
      const row = report.find(r => r.categoryId.toString() === bud.category?._id.toString());
      if (row) row.budget += bud.amount;
    });

    // Calculate remaining
    report.forEach(r => {
      r.remaining = r.budget - r.actual;
    });

    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};