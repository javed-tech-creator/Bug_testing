// import Expense from "../../models/finance/expence.js";
// import Budget from "../../models/finance/budget.js";
// // 🔹 Create Expense
// export const createExpense = async (req, res) => {
//   try {
//     const { category, department, task, amount, receiptUrl,project } = req.body;

//     const expense = await Expense.create({
//       category,
//       department,
//       task,
//       amount,
//       project,
//       receiptUrl: req.file ? req.file.path : receiptUrl, // agar file upload ho to multer ka path
//     });

//     res.status(201).json(expense);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // 🔹 Get All Expenses
// export const getExpenses = async (req, res) => {
//   try {
//     const expenses = await Expense.find().sort({ createdAt: -1 });
//     res.json(expenses);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // 🔹 Update Expense Status
// export const updateExpenseStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     const expense = await Expense.findById(id);
//     if (!expense) return res.status(404).json({ message: "Expense not found" });

//     expense.status = status;
//     await expense.save();

//     res.json(expense);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // 🔹 Delete Expense
// export const deleteExpense = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!id.match(/^[0-9a-fA-F]{24}$/)) {
//       return res.status(400).json({ message: "Invalid Expense ID" });
//     }

//     const expense = await Expense.findByIdAndDelete(id);
//     if (!expense) return res.status(404).json({ message: "Expense not found" });

//     res.json({ message: "Expense deleted successfully", expense });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // 🔹 Daily / Monthly Expense Summary
// export const getExpenseSummary = async (req, res) => {
//   try {
//     const summary = await Expense.aggregate([
//       {
//         $group: {
//           _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
//           totalAmount: { $sum: "$amount" },
//           count: { $sum: 1 },
//         },
//       },
//       { $sort: { "_id.year": -1, "_id.month": -1 } },
//     ]);

//     res.json(summary);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
 
// // 🔹 Create or Update Budget
// export const setBudget = async (req, res) => {
//   try {
//     const { department, project, budgetAmount, period } = req.body;

//     // Check if budget already exists
//     let budget = await Budget.findOne({ department, project });

//     if (budget) {
//       // Update
//       budget.budgetAmount = budgetAmount;
//       budget.period = period || budget.period;
//       await budget.save();
//       return res.json({ message: "Budget updated", budget });
//     }

//     // Create new
//     budget = await Budget.create({
//       department,
//       project,
//       budgetAmount,
//       period,
//     });

//     res.status(201).json({ message: "Budget created", budget });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // 🔹 Get All Budgets
// export const getBudgets = async (req, res) => {
//   try {
//     const budgets = await Budget.find().sort({ createdAt: -1 });
//     res.json(budgets);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // 🔹 Budget vs Actual Reporting
// // 🔹 Budget vs Actual Reporting
// export const budgetVsActual = async (req, res) => {
//   try {
//     const { department, project } = req.query;

//     // Budget fetch
//     const budgetDoc = await Budget.findOne({ department, project });
//     if (!budgetDoc) {
//       return res.status(404).json({ message: "Budget not set for this department/project" });
//     }

//     // Expenses total
//     const totalExpense = await Expense.aggregate([
//       {
//         $match: { department, ...(project ? { project } : {}) },
//       },
//       { $group: { _id: null, total: { $sum: "$amount" } } },
//     ]);

//     const actual = totalExpense[0]?.total || 0;
//     const remaining = budgetDoc.budgetAmount - actual;

//     res.json({
//       department,
//       project,
//       budget: budgetDoc.budgetAmount,
//       actual,
//       remaining,
//       period: budgetDoc.period,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


import Expense from "../../models/finance/expence.js";
import multer from "multer";
import path from "path";
import { uploadPDFToCloudinary } from "../../Helpers/finance/cloudinaryFinancePdf.js";

// Upload setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ✅ Create Expense
export const createExpense = async (req, res) => {
  try {
    const expense = await Expense.create(req.body);
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
// export const uploadReceipt = async (req, res) => {
//   try {
//     const { expenseId } = req.body;

//     if (!req.file) {
//       return res.status(400).json({ success: false, message: "No file uploaded" });
//     }

//     const updatedExpense = await Expense.findByIdAndUpdate(
//       expenseId,
//       { receipt: req.file.path },
//       { new: true }
//     );
//       const pdfUrl = await uploadPDFToCloudinary(updatedExpense, "expence_docs");
    

//     res.status(200).json({
//       success: true,
//       message: "Receipt uploaded",
//       file: req.file.filename,
//       path: req.file.path,
//       pdfUrl,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// ✅ Upload Receipt
// export const uploadReceipt = async (req, res) => {
//   try {
//     const {expenseId} = req.body ;
//     console.log("Expense ID:", expenseId);

//     if (!expenseId) {
//       return res.status(400).json({ success: false, message: "expenseId missing" });
//     }

//     if (!req.file) {
//       return res.status(400).json({ success: false, message: "No file uploaded" });
//     }

//     // Cloudinary upload using buffer
//     const streamUpload = (buffer) => {
//       return new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//           { resource_type: "auto", folder: "quotations" },
//           (error, result) => {
//             if (result) resolve(result);
//             else reject(error);
//           }
//         );
//         streamifier.createReadStream(buffer).pipe(stream);
//       });
//     };

//     const result = await streamUpload(req.file.buffer);

//     const updatedExpense = await Expense.findByIdAndUpdate(
//       expenseId,
//       { receipt: result.secure_url },
//       { new: true }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Receipt uploaded to Cloudinary",
//       receiptUrl: result.secure_url,
//       updatedExpense,
//     });
//   } catch (err) {
//     console.error("Upload Receipt Error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

export const uploadReceipt = async (req, res) => {
  try {
    console.log("req.body:", req.body); // debug
    console.log("req.file:", req.file); // debug

    const expenseId = req.body.expenseId; // destructure after checking
    if (!expenseId) {
      return res
        .status(400)
        .json({ success: false, message: "Expense ID missing" });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    // Cloudinary upload
    const fileUrl = await uploadPDFToCloudinary(req.file.path);

    const updatedExpense = await Expense.findByIdAndUpdate(
      expenseId,
      { receipt: fileUrl },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Receipt uploaded to Cloudinary",
      receiptUrl: fileUrl,
      updatedExpense,
    });
  } catch (err) {
    console.error("Upload Receipt Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }}
export const saveReceipt = async (req, res) => {
  try {
    const { expenseId } = req.body;
    const expense = await Expense.findByIdAndUpdate(expenseId, { receipt: req.file.filename }, { new: true });
    res.json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Get all expenses
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get expense by ID
export const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update status
export const updateExpenseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // <- yaha undefined error aata hai agar express.json() missing ho

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const expense = await Expense.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.status(200).json({ success: true, message: "Status updated", expense });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete expense
export const deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Monthly summary
export const getMonthlySummary = async (req, res) => {
  try {
    const summary = await Expense.aggregate([
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
    ]);
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

