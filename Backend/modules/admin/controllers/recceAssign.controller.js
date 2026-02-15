import mongoose from "mongoose";
import Project from "../../sales/models/project.model.js";
import AppError from "../../../utils/appError.js";

export const assignRecce = async (req, res, next) => {
  try {
    const {
      recceId,
      assignedTo,
      assignedBy,
      branch,
      priority,
      dueDate,
      comments,
    } = req.body || {};

    if (!recceId || !mongoose.Types.ObjectId.isValid(recceId)) {
      return next(new AppError("Valid recceId (project id) is required", 400));
    }

    if (!assignedTo || !mongoose.Types.ObjectId.isValid(assignedTo)) {
      return next(new AppError("Valid assignedTo user id is required", 400));
    }

    if (!assignedBy || !mongoose.Types.ObjectId.isValid(assignedBy)) {
      return next(new AppError("Valid assignedBy user id is required", 400));
    }

    const project = await Project.findById(recceId);
    if (!project) {
      return next(new AppError("Project not found", 404));
    }
    if (project.isDeleted) {
      return next(new AppError("Cannot assign a deleted project", 400));
    }

    // Update assignment details
    project.recceAssignment = {
      assignedTo,
      assignedBy,
      branch: branch || null,
      priority: ["Low", "Medium", "High"].includes(String(priority))
        ? priority
        : "Medium",
      dueDate: dueDate ? new Date(dueDate) : null,
      comments: comments || null,
      status: "Assigned",
      assignedAt: new Date(),
    };

    await project.save();

    return res.status(200).json({
      success: true,
      message: "Recce assigned successfully",
      data: {
        projectId: project._id,
        recceAssignment: project.recceAssignment,
      },
    });
  } catch (error) {
    console.error("Error assigning recce:", error);
    return next(new AppError(error.message || "Failed to assign recce", 500));
  }
};

export default { assignRecce };
