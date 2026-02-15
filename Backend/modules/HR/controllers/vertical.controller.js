
import Vertical from "../models/vertical.model.js";
import Branch from "../models/masters/branch.model.js";
import Department from "../models/masters/department.model.js";
import Channel from "../models/channel.model.js";
import mongoose from "mongoose";
import ApiError from "../../../utils/master/ApiError.js";

// Create Vertical
export const createVertical = async (req, res, next) => {
  try {
    const { title, branch, department, channel, status } = req.body;

    if (!title || !branch || !department || !channel) {
      return next(new ApiError(400, "Vertical title, branch, department, and channel are required"));
    }

    if (!mongoose.isValidObjectId(branch)) {
      return next(new ApiError(400, "Invalid Branch ID"));
    }
    if (!mongoose.isValidObjectId(department)) {
      return next(new ApiError(400, "Invalid Department ID"));
    }
    if (!mongoose.isValidObjectId(channel)) {
      return next(new ApiError(400, "Invalid Channel ID"));
    }

    const branchExists = await Branch.findById(branch);
    if (!branchExists) {
      return next(new ApiError(404, "Branch not found"));
    }

    const deptExists = await Department.findById(department);
    if (!deptExists) {
      return next(new ApiError(404, "Department not found"));
    }

    const channelExists = await Channel.findById(channel);
    if (!channelExists) {
      return next(new ApiError(404, "Channel not found"));
    }

    const existing = await Vertical.findOne({
      title: title.trim(),
      branch,
      department,
      channel,
    });

    if (existing) {
      if (existing.status !== "Active") {
        existing.status = "Active";
        const reactivatedVertical = await existing.save();
        return res.api(200, "Vertical reactivated successfully !!", reactivatedVertical);
      } else {
        return next(new ApiError(400, "Vertical already exists in this channel"));
      }
    }

    const vertical = new Vertical({ title, branch, department, channel, status });
    const savedVertical = await vertical.save();

    return res.api(201, "Vertical created successfully !!", savedVertical);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

// Get All Verticals
export const getAllVerticals = async (req, res, next) => {
  try {
    const verticals = await Vertical.find({ status: "Active" })
      .populate("branch", "branchId title")
      .populate("department", "departmentId title")
      .populate("channel", "channelId title")
      .sort({ createdAt: -1 });

    return res.api(200, "Verticals fetched successfully !!", verticals);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

// Get Vertical by ID
export const getVerticalById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid Vertical ID"));
    }

    const vertical = await Vertical.findOne({ _id: id, status: "Active" })
      .populate("branch", "branchId title")
      .populate("department", "departmentId title")
      .populate("channel", "channelId title");

    if (!vertical) {
      return next(new ApiError(404, "Vertical not found or inactive"));
    }

    return res.api(200, "Vertical fetched successfully !!", vertical);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

// Update Vertical
export const updateVertical = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, branch, department, channel } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid Vertical ID"));
    }

    if (branch && !mongoose.isValidObjectId(branch)) {
      return next(new ApiError(400, "Invalid Branch ID"));
    }
    if (department && !mongoose.isValidObjectId(department)) {
      return next(new ApiError(400, "Invalid Department ID"));
    }
    if (channel && !mongoose.isValidObjectId(channel)) {
      return next(new ApiError(400, "Invalid Channel ID"));
    }

    if (title && branch && department && channel) {
      const existing = await Vertical.findOne({
        title: title.trim(),
        branch,
        department,
        channel,
        _id: { $ne: id },
      });
      if (existing) {
        if (existing.status !== "Active") {
          existing.status = "Active";
          const reactivatedVertical = await existing.save();
          return res.api(200, "Vertical reactivated successfully !!", reactivatedVertical);
        } else {
          return next(new ApiError(400, "Vertical already exists in this channel"));
        }
      }
    }

    const vertical = await Vertical.findOneAndUpdate(
      { _id: id, status: "Active" },
      req.body,
      { new: true, runValidators: true }
    )
      .populate("branch", "branchId title")
      .populate("department", "departmentId title")
      .populate("channel", "channelId title");

    if (!vertical) {
      return next(new ApiError(404, "Vertical not found or inactive"));
    }

    return res.api(200, "Vertical updated successfully !!", vertical);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

// Soft Delete Vertical
export const softDeleteVertical = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid Vertical ID"));
    }

    const vertical = await Vertical.findByIdAndUpdate(
      id,
      { status: "Inactive" },
      { new: true }
    );

    if (!vertical) {
      return next(new ApiError(404, "Vertical not found"));
    }

    return res.api(200, "Vertical soft deleted (Inactive) successfully !!", vertical);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

// Permanent Delete Vertical
export const deleteVerticalPermanently = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid Vertical ID"));
    }

    const vertical = await Vertical.findByIdAndDelete(id);

    if (!vertical) {
      return next(new ApiError(404, "Vertical not found"));
    }

    return res.api(200, "Vertical permanently deleted successfully !!", vertical);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};
