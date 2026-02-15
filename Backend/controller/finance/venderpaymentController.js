import Payment from "../../models/finance/Payment.js";
import PurchaseOrder from "../../models/finance/PurchaseOrder.js";

// ✅ Create Payment
export const createPayment = async (req, res) => {
  try {
    const { po: poId, vendor, tds = 0, task } = req.body;

    // Fetch PO to get totalAmount
    const po = await PurchaseOrder.findById(poId);
    if (!po) {
      return res.status(404).json({ success: false, message: "PO not found" });
    }

    const amount = po.totalAmount;       // Original PO amount
    const netAmount = amount - tds;      // After TDS deduction

    const payment = new Payment({
      po: poId,
      vendor,
      amount,
      tds,
      netAmount,
      task,
      stage: "Requested", // default stage
    });

    await payment.save();

    res.status(201).json({ success: true, message: "Payment created successfully", data: payment });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// ✅ Get All Payments
export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate("po vendor");
    res.json({ success: true, message: "Payments fetched successfully", data: payments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get Payment by ID
export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate("po vendor");
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });
    res.json({ success: true, message: "Payment fetched successfully", data: payment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Update Payment
export const updatePayment = async (req, res) => {
  try {
    const { tds, task } = req.body;

    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });

    // Recalculate netAmount if TDS changes
    if (tds !== undefined) {
      payment.tds = tds;
      payment.netAmount = payment.amount - tds;
    }
    if (task) payment.task = task;

    await payment.save();

    res.json({ success: true, message: "Payment updated successfully", data: payment });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ✅ Delete Payment
export const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });
    res.json({ success: true, message: "Payment deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Update Stage (Requested → Approved → Paid)
export const updatePaymentStage = async (req, res) => {
  try {
    const { stage } = req.body;
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });

    payment.stage = stage;
    await payment.save();

    res.json({ success: true, message: `Payment stage updated to ${stage}`, data: payment });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ✅ Vendor Ledger
export const getVendorLedger = async (req, res) => {
  try {
    const vendorId = req.params.vendorId;

    // Fetch all payments for this vendor with PO populated
    const payments = await Payment.find({ vendor: vendorId }).populate("po");

    // Total Requested = sum of all PO amounts
    const totalRequested = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

    // Total Paid = sum of netAmount for Paid stage
    const totalPaid = payments.filter(p => p.stage === "Paid")
                              .reduce((sum, p) => sum + (p.netAmount || 0), 0);

    const balance = totalRequested - totalPaid;

    res.json({
      success: true,
      message: "Vendor ledger fetched successfully",
      data: {
        vendorId,
        totalRequested,
        totalPaid,
        balance,
        transactions: payments.map(p => ({
          _id: p._id,
          po: p.po,
          vendor: p.vendor,
          stage: p.stage,
          amount: p.amount,
          tds: p.tds,
          netAmount: p.netAmount,
          task: p.task,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        })),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
