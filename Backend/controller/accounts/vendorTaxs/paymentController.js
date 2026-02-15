import venderTaxPayment from "../../../models/accounts/VenderTax/Payment.js";
import TaxRecord from "../../../models/accounts/VenderTax/TaxRecord.js";
import { sendEmail } from "../../../utils/account/mailer.js";
import { uploadPDFToCloudinary } from "../../../Helpers/finance/cloudinaryFinancePdf.js";

// ----------------- CREATE PAYMENT -----------------
export const createPayment = async (req, res) => {
  try {
    let { vendor, tasks = [], penalties = 0, bonuses = 0, dueDate } = req.body;

    // Agar tasks string me aaye (form-data), parse kar lo
    if (typeof tasks === "string") tasks = JSON.parse(tasks);

    const totalAmount = tasks.reduce((sum, t) => sum + t.rate * t.quantity, 0) + bonuses - penalties;

    const payment = new venderTaxPayment({ vendor, tasks, totalAmount, penalties, bonuses, dueDate });
    await payment.save();

    res.status(201).json({ message: "Payment created", payment });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// ----------------- GET ALL PAYMENTS -----------------
export const getPayments = async (req, res) => {
  try {
    const payments = await venderTaxPayment.find().populate("vendor");
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ----------------- GET PAYMENT BY ID -----------------
export const getPaymentById = async (req, res) => {
  try {
    const payment = await venderTaxPayment.findById(req.params.id).populate("vendor");
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ----------------- UPDATE PAYMENT -----------------
export const updatePayment = async (req, res) => {
  try {
    const payment = await venderTaxPayment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    let { tasks, penalties, bonuses, dueDate, vendor } = req.body;

    // Tasks ko parse karo agar string me aaye (form-data)
    if (tasks && typeof tasks === "string") tasks = JSON.parse(tasks);

    tasks = tasks || payment.tasks;
    penalties = penalties ?? payment.penalties;
    bonuses = bonuses ?? payment.bonuses;
    dueDate = dueDate || payment.dueDate;
    vendor = vendor || payment.vendor;

    // Recalculate total
    const totalAmount = tasks.reduce((sum, t) => sum + t.rate * t.quantity, 0) + bonuses - penalties;

    // Update fields
    payment.tasks = tasks;
    payment.penalties = penalties;
    payment.bonuses = bonuses;
    payment.totalAmount = totalAmount;
    payment.dueDate = dueDate;
    payment.vendor = vendor;

    // Upload paymentProof if file exists
    if (req.file) {
      const result = await uploadPDFToCloudinary(req.file.path);
      payment.paymentProof = result; // ye already secure_url string hai
    }

    await payment.save();

    res.json({ message: "Payment updated & recalculated", payment });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// ----------------- DELETE PAYMENT -----------------
export const deletePayment = async (req, res) => {
  try {
    const payment = await venderTaxPayment.findByIdAndDelete(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json({ message: "Payment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ----------------- APPROVE PAYMENT -----------------
export const approvePayment = async (req, res) => {
  try {
    const payment = await venderTaxPayment.findById(req.params.id).populate("vendor");
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.approved = true;
    await payment.save();

    // Send email
    if (payment.vendor.email) {
      sendEmail(
        payment.vendor.email,
        "Payment Approved",
        `Dear ${payment.vendor.name}, your payment of ₹${payment.totalAmount} has been approved.`
      );
    }

    // Create tax record
    const tdsRate = 10;
    const tdsAmount = payment.totalAmount * (tdsRate / 100);
    const taxRecord = new TaxRecord({
      payment: payment._id,
      vendor: payment.vendor._id,
      tds: tdsAmount,
      gstType: "B2B"
    });
    await taxRecord.save();

    res.json({ message: "Payment approved, Email sent & Tax record created", payment, taxRecord });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
