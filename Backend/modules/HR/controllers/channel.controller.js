
import ApiError from "../../../utils/master/ApiError.js";
import Channel from "../models/channel.model.js";
import Branch from "../models/masters/branch.model.js";
import Department from "../models/masters/department.model.js";
import mongoose from "mongoose";

// Create Channel
export const createChannel = async (req, res, next) => {
  try {
    const { title, branch, department, status } = req.body;

    if (!title || !branch || !department) {
      return next(new ApiError(400, "Channel title, branch, and department are required"));
    }

    if (!mongoose.isValidObjectId(branch)) {
      return next(new ApiError(400, "Invalid Branch ID"));
    }
    if (!mongoose.isValidObjectId(department)) {
      return next(new ApiError(400, "Invalid Department ID"));
    }

    const branchExists = await Branch.findById(branch);
    if (!branchExists) {
      return next(new ApiError(404, "Branch not found"));
    }

    const deptExists = await Department.findById(department);
    if (!deptExists) {
      return next(new ApiError(404, "Department not found"));
    }

    const existing = await Channel.findOne({
      title: title.trim(),
      branch,
      department,
    });

    if (existing) {
      if (existing.status !== "Active") {
        existing.status = "Active";
        const reactivatedChannel = await existing.save();
        return res.api(200, "Channel reactivated successfully !!", reactivatedChannel);
      } else {
        return next(new ApiError(400, "Channel already exists in this branch & department"));
      }
    }

    const channel = new Channel({ title, branch, department, status });
    const savedChannel = await channel.save();

    return res.api(201, "Channel created successfully !!", savedChannel);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

// Get All Channels
export const getAllChannels = async (req, res, next) => {
  try {
    const channels = await Channel.find({ status: "Active" })
      .populate("branch", "branchId title")
      .populate("department", "departmentId title")
      .sort({ createdAt: -1 });

    return res.api(200, "Channels fetched successfully !!", channels);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

// Get Channel by ID
export const getChannelById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid Channel ID"));
    }

    const channel = await Channel.findOne({ _id: id, status: "Active" })
      .populate("branch", "branchId title")
      .populate("department", "departmentId title");

    if (!channel) {
      return next(new ApiError(404, "Channel not found or inactive"));
    }

    return res.api(200, "Channel fetched successfully !!", channel);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

// Update Channel
export const updateChannel = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, branch, department } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid Channel ID"));
    }

    if (branch && !mongoose.isValidObjectId(branch)) {
      return next(new ApiError(400, "Invalid Branch ID"));
    }
    if (department && !mongoose.isValidObjectId(department)) {
      return next(new ApiError(400, "Invalid Department ID"));
    }

    if (title && branch && department) {
      const existing = await Channel.findOne({
        title: title.trim(),
        branch,
        department,
        _id: { $ne: id },
      });
      if (existing) {
        if (existing.status !== "Active") {
          existing.status = "Active";
          const reactivatedChannel = await existing.save();
          return res.api(200, "Channel reactivated successfully !!", reactivatedChannel);
        } else {
          return next(new ApiError(400, "Channel already exists in this branch & department"));
        }
      }
    }

    const channel = await Channel.findOneAndUpdate(
      { _id: id, status: "Active" },
      req.body,
      { new: true, runValidators: true }
    )
      .populate("branch", "branchId title")
      .populate("department", "departmentId title");

    if (!channel) {
      return next(new ApiError(404, "Channel not found or inactive"));
    }

    return res.api(200, "Channel updated successfully !!", channel);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

// Soft Delete Channel
export const softDeleteChannel = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid Channel ID"));
    }

    const channel = await Channel.findByIdAndUpdate(
      id,
      { status: "Inactive" },
      { new: true }
    );

    if (!channel) {
      return next(new ApiError(404, "Channel not found"));
    }

    return res.api(200, "Channel soft deleted (Inactive) successfully !!", channel);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

// Permanent Delete Channel
export const deleteChannelPermanently = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid Channel ID"));
    }

    const channel = await Channel.findByIdAndDelete(id);

    if (!channel) {
      return next(new ApiError(404, "Channel not found"));
    }

    return res.api(200, "Channel permanently deleted successfully !!", channel);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};
