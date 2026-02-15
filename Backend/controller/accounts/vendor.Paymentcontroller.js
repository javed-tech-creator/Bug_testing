import { payment } from "../../models/accounts/vendorPayment.js";

import { uploadPDFToCloudinary } from "../../Helpers/finance/cloudinaryFinancePdf.js";
 

// Create new payment
export const createPayment = async (req, res) => {
  try {
    const { vendor, project, tasks = [], penalties = 0, bonuses = 0, dueDate } = req.body;

    // Agar tasks empty hai toh subTotal = 0
    const subTotal = tasks.length > 0
      ? tasks.reduce((sum, t) => sum + (t.rate * t.quantity), 0)
      : 0;

    const totalAmount = subTotal + bonuses - penalties;

    const newPayment = new payment({
      vendor,
      project,
      tasks: tasks.map(t => ({
        ...t,
        amount: t.rate * t.quantity
      })),
      subTotal,
      penalties,
      bonuses,
      totalAmount,
      dueDate
    });

    await newPayment.save();

    res.status(201).json({
      message: "Payment created successfully",
      success: true,
      data: newPayment
    });

  } catch (error) {
    console.error("Payment create error:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
}; 
// export const createPayment = async (req, res) => {
//   try {
//     console.log("REQ.BODY:", req.body);
//     console.log("REQ.FILES:", req.files);

//     // -------------------------------
//     // 1️⃣ Extract fields from req.body
//     // -------------------------------
//     const {
//       vendor,
//       project,
//       tasks,
//       penalties = 0,
//       bonuses = 0,
//       dueDate,
//       notes
//     } = req.body;

//     if (!vendor || !project) {
//       return res.status(400).json({ message: "Vendor and project are required" });
//     }

//     // -------------------------------
//     // 2️⃣ Parse JSON arrays (tasks, notes)
//     // -------------------------------
//     const tasksArray = tasks ? JSON.parse(tasks) : [];
//     const notesArray = notes ? JSON.parse(notes) : [];

//     // -------------------------------
//     // 3️⃣ Convert numbers properly
//     // -------------------------------
//     const penaltiesNum = Number(penalties) || 0;
//     const bonusesNum = Number(bonuses) || 0;

//     const tasksWithAmount = tasksArray.map(t => ({
//       description: t.description,
//       quantity: Number(t.quantity),
//       rate: Number(t.rate),
//       amount: Number(t.quantity) * Number(t.rate)
//     }));

//     const subTotal = tasksWithAmount.reduce((sum, t) => sum + t.amount, 0);
//     const totalAmount = subTotal + bonusesNum - penaltiesNum;

//     // -------------------------------
//     // 4️⃣ Upload files to Cloudinary
//     // -------------------------------
//     let paymentProofs = [];
//     if (req.files && req.files.length > 0) {
//       for (let file of req.files) {
//         const url = await uploadPDFToCloudinary(file.path, "vendorPayments");
//         paymentProofs.push(url);
//       }
//     }

//     // -------------------------------
//     // 5️⃣ Create Payment
//     // -------------------------------
//     const newPayment = new payment({
//       vendor,
//       project,
//       tasks: tasksWithAmount,
//       subTotal,
//       penalties: penaltiesNum,
//       bonuses: bonusesNum,
//       totalAmount,
//       dueDate,
//       notes: notesArray,
//       paymentProofs
//     });

//     await newPayment.save();

//     res.status(201).json({
//       message: "Payment created successfully",
//       success: true,
//       data: newPayment
//     });

//   } catch (error) {
//     console.error("Payment create error:", error);
//     res.status(500).json({
//       message: "Server Error",
//       error: error.message
//     });
//   }
// };

// Get all payments
export const getAllPayments = async (req, res) => {
  try {
    const payments = await payment.find().populate("vendor");
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get payment by ID
export const getPaymentById = async (req, res) => {
  try {
    const payment = await payment.findById(req.params.id).populate("vendor");
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Update payment (paidAmount, approvalStatus, tasks)
 
// export const updatePayment = async (req, res) => {
//   try {
//     const paymentRecord = await payment.findById(req.params.id);
//     if (!paymentRecord) return res.status(404).json({ message: "Payment not found" });

//     const { tasks, paidAmount, approvalStatus, penalties, bonuses, dueDate } = req.body;

//     if (tasks) {
//       paymentRecord.tasks = tasks.map(t => ({ ...t, amount: t.rate * t.quantity }));
//       paymentRecord.subTotal = tasks.reduce((sum, t) => sum + t.rate * t.quantity, 0);
//     }

//     if (penalties !== undefined) paymentRecord.penalties = penalties;
//     if (bonuses !== undefined) paymentRecord.bonuses = bonuses;
//     if (paidAmount !== undefined) paymentRecord.paidAmount = paidAmount;
//     if (approvalStatus) paymentRecord.approvalStatus = approvalStatus;
//     if (dueDate) paymentRecord.dueDate = dueDate;

//     paymentRecord.totalAmount = paymentRecord.subTotal + (paymentRecord.bonuses || 0) - (paymentRecord.penalties || 0);
    
//     await paymentRecord.save();
//     res.json(paymentRecord);
//   } catch (error) {
//     console.error(error); // error dekhne ke liye
//     res.status(500).json({ message: "Server Error" });
//   }
// };


export const updatePayment = async (req, res) => {
  try {
    const paymentRecord = await payment.findById(req.params.id);
    if (!paymentRecord) return res.status(404).json({ message: "Payment not found" });

    const { tasks, paidAmount, approvalStatus, penalties, bonuses, dueDate } = req.body;

    // Tasks update
    if (tasks) {
      const tasksArray = typeof tasks === "string" ? JSON.parse(tasks) : tasks;
      paymentRecord.tasks = tasksArray.map(t => ({ ...t, amount: t.rate * t.quantity }));
      paymentRecord.subTotal = tasksArray.reduce((sum, t) => sum + t.rate * t.quantity, 0);
    }

    if (penalties !== undefined) paymentRecord.penalties = Number(penalties);
    if (bonuses !== undefined) paymentRecord.bonuses = Number(bonuses);
    if (paidAmount !== undefined) paymentRecord.paidAmount = Number(paidAmount);
    if (approvalStatus) paymentRecord.approvalStatus = approvalStatus;
    if (dueDate) paymentRecord.dueDate = dueDate;

    // Multiple receipt upload
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const url = await uploadPDFToCloudinary(file.path, "vendorPayments");
        paymentRecord.paymentProofs.push(url);
      }
    }

    paymentRecord.totalAmount =
      paymentRecord.subTotal + (paymentRecord.bonuses || 0) - (paymentRecord.penalties || 0);

    await paymentRecord.save();
    res.json(paymentRecord);
  } catch (error) {
    console.error("Update Payment Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete payment

export const deletePayment = async (req, res) => {
  try {
    const paymentRecord = await payment.findByIdAndDelete(req.params.id);
    if (!paymentRecord) return res.status(404).json({ message: "Payment not found" });
    res.json({ message: "Payment deleted successfully" });
  } catch (error) {
    console.error(error);  // error dekhne ke liye
    res.status(500).json({ message: "Server Error" });
  }
}