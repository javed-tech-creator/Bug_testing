import vnd from "../../models/accounts/vendor.js";

// ✅ Create Vendor
export const createVendor = async (req, res) => {
  try {
    const vendor = new vnd(req.body);

    const savedVendor = await vendor.save();

    res.status(201).json(savedVendor);
  } catch (error) {
    res.status(400).json({ message: "Error creating vendor", error: error.message });
  }
};

// ✅ Get All Vendors
export const getVendors = async (req, res) => {
  try {
    const vendors = await vnd.find();
   
    res.status(200).json({ success: true,vendors }); // directly array
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Get Vendor by ID
export const getVendorById = async (req, res) => {
  try {
    const vendor = await vnd.findById(req.params.id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    res.status(200).json(vendor);
  } catch (error) {
    res.status(500).json({ message: "Error fetching vendor", error: error.message });
  }
};

// ✅ Update Vendor
export const updateVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const { _id, ...updateData } = req.body; // ignore _id
    const vendor = await vnd.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    res.status(200).json(vendor);
  } catch (error) {
    res.status(400).json({ message: "Error updating vendor", error: error.message });
  }
};

// ✅ Delete Vendor
export const deleteVendor = async (req, res) => {
  try {
    const vendor = await vnd.findByIdAndDelete(req.params.id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    res.status(200).json({ message: "Vendor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting vendor", error: error.message });
  }
};
