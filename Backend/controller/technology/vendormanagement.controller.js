// controllers/vendor.controller.js

import VendorManagementModel from "../../models/technology/vendormanagement.model.js";
import ApiError from "../../utils/master/ApiError.js";

// ================== CREATE Vendor ==================
// Create Vendor
export const createVendor = async (req, res, next) => {
  try {
    const vendor = new VendorManagementModel(req.body);
    await vendor.save();

    return res.status(201).json({
      success: true,
      message: "Vendor created successfully",
      data: vendor,
    });
  } catch (error) {
    next(error);
  }
};

// ================== GET all Vendors ==================
export const getVendors = async (req, res) => {
  try {
    // query params se page aur limit lena
  const page = parseInt(req.query.page, 10) || 1;   // default page = 1
    const limit = parseInt(req.query.limit, 10) || 10; // default limit = 10
    const skip = (page - 1) * limit;

    // total vendors count
    const totalVendors = await VendorManagementModel.countDocuments();

    // data fetch karna with sort, skip aur limit
    const vendors = await VendorManagementModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: vendors.length,
      total: totalVendors,
      currentPage: page,
      totalPages: Math.ceil(totalVendors / limit),
      data: vendors,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ================== GET single Vendor ==================
export const getVendorById = async (req, res) => {
  try {
    const vendor = await VendorManagementModel.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    res.status(200).json({ success: true, data: vendor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Vendor
export const updateVendor = async (req, res, next) => {
  try {
    const vendor = await VendorManagementModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // runValidators ensures validation on update
    );

    if (!vendor) {
       return next(new ApiError(404, "Vendor not found"));
    }

    return res.status(200).json({
      success: true,
      message: "Vendor updated successfully",
      data: vendor,
    });
  } catch (error) {
    next(error);
  }
};

// ================== DELETE Vendor ==================
export const deleteVendor = async (req, res) => {
  try {

    const vendor = await VendorManagementModel.findByIdAndDelete(req.params.id);

    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }

    res.status(200).json({ success: true, message: "Vendor deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
