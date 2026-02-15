 import Payout from "../../models/finance/expencePayout.js";
 import Vendor from "../../models/finance/vendor.js";

export const createPayout = async (req, res) => {
  try {
    const { vendor, poNumber, task, amount, taxDeduction } = req.body;
    const vendorExists = await Vendor.findById(vendor);
    if (!vendorExists) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const payout = await Payout.create({ vendor, poNumber, task, amount, taxDeduction });
    console.log("Payout created:", payout); // ✅ debug
    res.status(201).json({
      message: "Payout created successfully",
      payout
    });
  } catch (error) {
    console.error(error); // ✅ debug
    res.status(400).json({ message: error.message });
  }
};

// Get All Payouts
export const getPayouts = async (req, res) => {
  try {
    const payouts = await Payout.find().populate("vendor");
    res.json(payouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Payout Status
export const updatePayoutStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentDate } = req.body;
    const payout = await Payout.findById(id);
    if (!payout) {
      return res.status(404).json({ message: "Payout not found" });
    }

    payout.status = status;
    if (paymentDate) {
      payout.paymentDate = paymentDate;
    }
    await payout.save();
    res.json({
        message:"payout Updated successfully",
        payout
 }   );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Payout
export const deletePayout = async (req, res) => {
  try {
    const payout = await Payout.findByIdAndDelete(req.params.id);
    if (!payout) {
      return res.status(404).json({ success: false, message: "Payout not found" });
    }
    res.json({ success: true, message: "Payout deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
