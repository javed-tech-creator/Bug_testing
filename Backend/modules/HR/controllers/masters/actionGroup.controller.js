import ApiError from "../../../../utils/master/ApiError.js";
import ActionGroup from "../../models/masters/actionGroup.model.js";
import mongoose from "mongoose";
import Department from "../../models/masters/department.model.js";

export const createActionGroup = async (req, res, next) => {
  try {
    const { title, description, permissions, department } = req.body;

    if (!title) {
      return next(new ApiError(400, "ActionGroup title is required"));
    }
    if (!department || !mongoose.isValidObjectId(department)) {
      return next(new ApiError(400, "Valid department ID is required"));
    }
    const departmentExists = await Department.findById(department);
    if (!departmentExists) {
      return next(new ApiError(400, "Department not found"));
    }
    const existing = await ActionGroup.findOne({
      title: title.trim(),
      department,
    });

    if (existing) {
      return next(
        new ApiError(
          400,
          "ActionGroup with this title already exists in this department"
        )
      );
    }

    const actionGroup = new ActionGroup({
      title,
      description,
      permissions,
      department,
    });
    const saved = await actionGroup.save();

    return res.api(201, "ActionGroup created successfully !!", saved);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

export const getAllActionGroups = async (req, res, next) => {
  try {
    const groups = await ActionGroup.find()
      .populate("department", "title")
      .sort({ createdAt: -1 });
    return res.api(200, "ActionGroups fetched successfully !!", groups);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

export const getActionGroupById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid ActionGroup ID"));
    }

    const group = await ActionGroup.findById(id).populate("department", "title");
    if (!group) {
      return next(new ApiError(404, "ActionGroup not found"));
    }

    return res.api(200, "ActionGroup fetched successfully !!", group);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

export const updateActionGroup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, permissions, department } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid ActionGroup ID"));
    }

    if (department && !mongoose.isValidObjectId(department)) {
      return next(new ApiError(400, "Invalid department ID"));
    }
    const departmentExists = await Department.findById(department);
    if (!departmentExists) {
      return next(new ApiError(400, "Department not found"));
    }

    if (title && department) {
      const existing = await ActionGroup.findOne({
        title: title.trim(),
        department,
        _id: { $ne: id },
      });
      if (existing) {
        return next(
          new ApiError(
            400,
            "Another ActionGroup with this title already exists in this department"
          )
        );
      }
    }

    const updated = await ActionGroup.findByIdAndUpdate(
      id,
      { title, description, permissions, department },
      { new: true, runValidators: true }
    ).populate("department", "title");

    if (!updated) {
      return next(new ApiError(404, "ActionGroup not found"));
    }

    return res.api(200, "ActionGroup updated successfully !!", updated);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

export const deleteActionGroup = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid ActionGroup ID"));
    }

    const deleted = await ActionGroup.findByIdAndDelete(id);

    if (!deleted) {
      return next(new ApiError(404, "ActionGroup not found"));
    }

    return res.api(
      200,
      "ActionGroup permanently deleted successfully !!",
      deleted
    );
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

// Get all ActionGroups for a specific department

export const getActionGroupsByDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid Department ID"));
    }
    const departmentExists = await Department.findById(id);
    if (!departmentExists) {
      return next(new ApiError(400, "Department not found"));
    }

    const groups = await ActionGroup.find({ department: id })
      .populate("department", "title")
      .sort({ createdAt: -1 });

    return res.api(
      200,
      "ActionGroups for department fetched successfully !!",
      groups
    );
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};
