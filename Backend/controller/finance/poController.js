import PurchaseOrder from "../../models/finance/PurchaseOrder.js";
 
 
export const createPurchaseOrder = async (req, res) => {
  try {
    // Find the latest PO to generate next number
    const lastPO = await PurchaseOrder.findOne().sort({ createdAt: -1 });
    let nextNumber = 1;

    if (lastPO && lastPO.poNumber) {
      const match = lastPO.poNumber.match(/PO-(\d+)/);
      if (match) nextNumber = parseInt(match[1]) + 1;
    }

    const poNumber = `PO-${String(nextNumber).padStart(4, "0")}`;

    const po = new PurchaseOrder({
      ...req.body,
      poNumber // add auto-generated PO number
    });

    await po.save();

    res.status(201).json({
      success: true,
      message: "PO created successfully",
      data: po
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ✅ Get All POs
export const getPOs = async (req, res) => {
  try {
    const pos = await PurchaseOrder.find().populate("vendor");
    res.json({ success: true, message: "POs fetched successfully", data: pos });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Get PO by ID
export const getPOById = async (req, res) => {
  try {
    const po = await PurchaseOrder.findById(req.params.id).populate("vendor");
    if (!po) return res.status(404).json({ success: false, message: "PO not found" });
    res.json({ success: true, message: "PO fetched successfully", data: po });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Update PO
export const updatePO = async (req, res) => {
  try {
    const po = await PurchaseOrder.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!po) return res.status(404).json({ success: false, message: "PO not found" });
    res.json({ success: true, message: "PO updated successfully", data: po });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ✅ Delete PO
export const deletePO = async (req, res) => {
  try {
    const po = await PurchaseOrder.findByIdAndDelete(req.params.id);
    if (!po) return res.status(404).json({ success: false, message: "PO not found" });
    res.json({ success: true, message: "PO deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};