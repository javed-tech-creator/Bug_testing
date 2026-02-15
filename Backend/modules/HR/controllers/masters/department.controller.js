import ApiError from "../../../../utils/master/ApiError.js";
import Department from "../../models/masters/department.model.js";
import Branch from "../../models/masters/branch.model.js";
import mongoose from "mongoose";

export const createDepartment = async (req, res, next) => {
  try {
    const { title, branch, status } = req.body;

    if (!title || !branch) {
      return next(new ApiError(400, "Department title and branch are required"));
    }

    if (!mongoose.isValidObjectId(branch)) {
      return next(new ApiError(400, "Invalid Branch ID"));
    }

    const branchExists = await Branch.findById(branch);
    if (!branchExists) {
      return next(new ApiError(404, "Branch not found"));
    }

    const existing = await Department.findOne({
      title: title.trim(),
      branch,
    });

    if (existing) {
      if (existing.status !== "Active") {
        existing.status = "Active";
        const reactivatedDept = await existing.save();
        return res.api(
          200,
          "Department reactivated successfully !!",
          reactivatedDept
        );
      } else {
        return next(new ApiError(400, "Department already exists in this branch"));
      }
    }

    const department = new Department({ title, branch, status });
    const savedDept = await department.save();

    return res.api(201, "Department created successfully !!", savedDept);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

export const getAllDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find({ status: "Active" })
      .populate("branch", "branchId title")
      .sort({ createdAt: -1 });

    return res.api(200, "Departments fetched successfully !!", departments);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

export const getDepartmentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid Department ID"));
    }

    const department = await Department.findOne({ _id: id, status: "Active" }).populate("branch", "branchId title");

    if (!department) {
      return next(new ApiError(404, "Department not found or inactive"));
    }

    return res.api(200, "Department fetched successfully !!", department);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

export const updateDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, branch } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid Department ID"));
    }

    if (branch && !mongoose.isValidObjectId(branch)) {
      return next(new ApiError(400, "Invalid Branch ID"));
    }

    if (title && branch) {
      const existing = await Department.findOne({
        title: title.trim(),
        branch,
        _id: { $ne: id },
      });
      if (existing) {
        if (existing.status !== "Active") {
          existing.status = "Active";
          const reactivatedDept = await existing.save();
          return res.api(
            200,
            "Department reactivated successfully !!",
            reactivatedDept
          );
        } else {
          return next(new ApiError(400, "Department already exists in this branch"));
        }
      }
    }

    const department = await Department.findOneAndUpdate(
      { _id: id, status: "Active" },
      req.body,
      { new: true, runValidators: true }
    );

    if (!department) {
      return next(new ApiError(404, "Department not found or inactive"));
    }

    return res.api(200, "Department updated successfully !!", department);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

export const softDeleteDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid Department ID"));
    }

    const department = await Department.findByIdAndUpdate(
      id,
      { status: "Inactive" },
      { new: true }
    );

    if (!department) {
      return next(new ApiError(404, "Department not found"));
    }

    return res.api(200, "Department soft deleted (Inactive) successfully !!", department);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

export const deleteDepartmentPermanently = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid Department ID"));
    }

    const department = await Department.findByIdAndDelete(id);

    if (!department) {
      return next(new ApiError(404, "Department not found"));
    }

    return res.api(200, "Department permanently deleted successfully !!", department);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

export const getDepartmentsByBranchId = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid Branch ID"));
    }

    const branchExists = await Branch.findOne({ _id: id, status: "Active" });
    if (!branchExists) {
      return next(new ApiError(404, "Branch not found or inactive"));
    }

    const departments = await Department.find({ branch: id, status: "Active" })
      .populate("branch", "branchId title")
      .sort({ createdAt: -1 });

    return res.api(200, "Departments fetched successfully for given branch !!", departments);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};