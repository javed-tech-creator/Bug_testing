import Budget from "../../models/finance/budget.js";
import Expense from "../../models/finance/expence.js"

// ✅ Create budget
export const createBudget = async (req, res) => {
  try {
    const budget = await Budget.create(req.body);
    res.status(201).json({ message: "Budget created", budget });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Get all budgets
export const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find();
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get budget by department/project
export const getBudgetByFilter = async (req, res) => {
  try {
    const { department, project } = req.query;
    const filter = {};
    if (department) filter.department = department;
    if (project) filter.project = project;

    const budgets = await Budget.find(filter);
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update budget
export const updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(budget);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete budget
export const deleteBudget = async (req, res) => {
  try {
    await Budget.findByIdAndDelete(req.params.id);
    res.json({ message: "Budget deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Budget vs Actual
export const budgetVsActual = async (req, res) => {
  try {
    const { department, project } = req.query;

    if (!department || !project) {
      return res.status(400).json({ error: "Department and Project required" });
    }

    // 1️⃣ Budget
 const budgets = await Budget.find({
  department: { $regex: `^${department.trim()}$`, $options: "i" },
  project: { $regex: `^${project.trim()}$`, $options: "i" },
});
const totalBudget = budgets.reduce((sum, b) => sum + b.budgetAmount, 0);

    // 2️⃣ Actual from Expense collection
const actualAgg = await Expense.aggregate([
  {
    $match: {
      department: { $regex: `^${department.trim()}$`, $options: "i" },
      project: { $regex: `^${project.trim()}$`, $options: "i" },
    },
  },
  { $group: { _id: null, actual: { $sum: "$amount" } } },
]);

const actual = actualAgg[0]?.actual || 0;
const remaining = totalBudget - actual;

res.json({ budget: totalBudget, actual, remaining });  
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
