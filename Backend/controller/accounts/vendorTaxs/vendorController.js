import vendorTaxVendor from "../../../models/accounts/VenderTax/Vendor.js";

export const createVendor = async (req, res) => {
  try {
    const vendor = new vendorTaxVendor(req.body);
    await vendor.save();
    res.status(201).json({ message: "Vendor created", vendor });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getVendors = async (req, res) => {
  try {
    const vendors = await vendorTaxVendor.find();
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getVendorById = async (req, res) => {
  try {
    const vendor = await vendorTaxVendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    res.json(vendor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateVendor = async (req, res) => {
  try {
    const vendor = await vendorTaxVendor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    res.json({ message: "Vendor updated", vendor });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteVendor = async (req, res) => {
  try {
    const vendor = await vendorTaxVendor.findByIdAndDelete(req.params.id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    res.json({ message: "Vendor deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
