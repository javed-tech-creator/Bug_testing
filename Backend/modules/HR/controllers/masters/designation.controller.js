import ApiError from "../../../../utils/master/ApiError.js";
import Designation from "../../models/masters/designation.model.js";
import Department from "../../models/masters/department.model.js";
import Branch from "../../models/masters/branch.model.js";
import mongoose from "mongoose";

// Create Designation
export const createDesignation = async (req, res, next) => {
  try {
    const { title, description, depId, branchId, status } = req.body;

    if (!title || !depId || !branchId) {
      return next(new ApiError(400, "Designation title, department and branch are required"));
    }

    if (!mongoose.isValidObjectId(depId)) {
      return next(new ApiError(400, "Invalid Department ID"));
    }
    if (!mongoose.isValidObjectId(branchId)) {
      return next(new ApiError(400, "Invalid Branch ID"));
    }

    const depExists = await Department.findById(depId);
    if (!depExists) {
      return next(new ApiError(404, "Department not found"));
    }

    const branchExists = await Branch.findById(branchId);
    if (!branchExists) {
      return next(new ApiError(404, "Branch not found"));
    }

    const existing = await Designation.findOne({
      title: title.trim(),
      depId,
      branchId,
    });

    if (existing) {
      if (existing.status !== "Active") {
        existing.status = "Active";
        const reactivatedDesg = await existing.save();
        return res.api(200, "Designation reactivated successfully !!", reactivatedDesg);
      } else {
        return next(new ApiError(400, "Designation already exists in this department and branch"));
      }
    }

    const designation = new Designation({ title, description, depId, branchId, status });
    const savedDesg = await designation.save();

    return res.api(201, "Designation created successfully !!", savedDesg);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

// Get all Designations
export const getAllDesignations = async (req, res, next) => {
  try {
    const designations = await Designation.find({ status: "Active" })
      .populate("depId", "departmentId title")
      .populate("branchId", "branchId title")
      .sort({ createdAt: -1 });

    return res.api(200, "Designations fetched successfully !!", designations);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

// Get Designation by ID
export const getDesignationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid Designation ID"));
    }

    const designation = await Designation.findOne({ _id: id, status: "Active" })
      .populate("depId", "departmentId title")
      .populate("branchId", "branchId title");

    if (!designation) {
      return next(new ApiError(404, "Designation not found or inactive"));
    }

    return res.api(200, "Designation fetched successfully !!", designation);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

// Update Designation
export const updateDesignation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, depId, branchId } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid Designation ID"));
    }

    if (depId && !mongoose.isValidObjectId(depId)) {
      return next(new ApiError(400, "Invalid Department ID"));
    }

    if (branchId && !mongoose.isValidObjectId(branchId)) {
      return next(new ApiError(400, "Invalid Branch ID"));
    }

    if (title && depId && branchId) {
      const existing = await Designation.findOne({
        title: title.trim(),
        depId,
        branchId,
        _id: { $ne: id },
      });

      if (existing) {
        if (existing.status !== "Active") {
          existing.status = "Active";
          const reactivatedDesg = await existing.save();
          return res.api(200, "Designation reactivated successfully !!", reactivatedDesg);
        } else {
          return next(new ApiError(400, "Designation already exists in this department and branch"));
        }
      }
    }

    const designation = await Designation.findOneAndUpdate(
      { _id: id, status: "Active" },
      req.body,
      { new: true, runValidators: true }
    );

    if (!designation) {
      return next(new ApiError(404, "Designation not found or inactive"));
    }

    return res.api(200, "Designation updated successfully !!", designation);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

export const softDeleteDesignation = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid Designation ID"));
    }

    const designation = await Designation.findByIdAndUpdate(
      id,
      { status: "Inactive" },
      { new: true }
    );

    if (!designation) {
      return next(new ApiError(404, "Designation not found"));
    }

    return res.api(200, "Designation soft deleted (Inactive) successfully !!", designation);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

// Permanent Delete Designation
export const deleteDesignationPermanently = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid Designation ID"));
    }

    const designation = await Designation.findByIdAndDelete(id);

    if (!designation) {
      return next(new ApiError(404, "Designation not found"));
    }

    return res.api(200, "Designation permanently deleted successfully !!", designation);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

export const getDesignationsByDepartmentId = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid Department ID"));
    }

    const depExists = await Department.findOne({ _id: id, status: "Active" });
    if (!depExists) {
      return next(new ApiError(404, "Department not found or inactive"));
    }

    const designations = await Designation.find({ depId:id, status: "Active" })
      .populate("depId", "departmentId title")
      .populate("branchId", "branchId title")
      .sort({ createdAt: -1 });

    return res.api(200, "Designations fetched successfully for given department !!", designations);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};
