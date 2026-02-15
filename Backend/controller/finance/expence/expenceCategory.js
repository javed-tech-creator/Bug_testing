import ExpenseCategory from "../../../models/finance/expence/expenceCategory.js";
 

export const createCategory = async (req, res) => {
  try {
    const { category, department } = req.body;
    console.log("👉 Request Body:", req.body);

    // Validation
    if (!category || !department) {
      return res.status(400).json({ error: "Category and Department are required" });
    }

    // Duplicate check
    const exists = await ExpenseCategory.findOne({ category, department });
    if (exists) {
      return res.status(400).json({ error: "This category already exists for this department" });
    }

    // Create
    const newCategory = await ExpenseCategory.create({ category, department });
    res.status(201).json(newCategory);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await ExpenseCategory.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update category by ID
export const updateCategory = async (req, res) => {
  try {
    const updatedCategory = await ExpenseCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // enum validation ke liye runValidators important
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json(updatedCategory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete category by ID
export const deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await ExpenseCategory.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
