import Budget2 from "../../../models/finance/expence/budget.js";

export const createBudget = async (req, res) => {
  try {
    const budget = await Budget2.create(req.body);
    res.status(201).json(budget);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getBudgets = async (req, res) => {
  const budgets = await Budget2.find().populate("category");
  res.json(budgets);
};

export const updateBudget = async (req, res) => {
  try {
    const budget = await Budget2.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(budget);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteBudget = async (req, res) => {
  try {
    await Budget2.findByIdAndDelete(req.params.id);
    res.json({ message: "Budget deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
