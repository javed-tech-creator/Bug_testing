
import mongoose from "mongoose";
import Department from "../../../HR/models/masters/department.model.js";
import Project from "../../../sales/models/project.model.js";
import ClientProduct from "../../../sales/models/clientProduct.model.js";
import User from "../../../HR/models/masters/user.model.js";
import { FlagRaise } from "../../models/flag/flagRaise.model.js";
import { sendNotification } from "../../../notification/controllers/notification.controller.js";
import ApiError from "../../../../utils/master/ApiError.js";


export const createFlagRaise = async (req, res, next) => {
  try {
    if (!req || !req.body) {
      return next(new ApiError(400, "Request body is required"));
    }
    const {
      type,
      title,
      description,
      reason,
      departmentId,
      againstDepartmentId,
      projectId,
      productId,
      agaistId,
      assignedTo,
      priority,
      visibility,
      reworkInstruction,
      userId,
    } = req.body;

    // Basic validations
    if (!title || !title.trim()) {
      return next(new ApiError(400, "Title is required"));
    }



    if (!departmentId || !mongoose.isValidObjectId(departmentId)) {
      return next(new ApiError(400, "Valid department ID is required"));
    }

    if (!projectId || !mongoose.isValidObjectId(projectId)) {
      return next(new ApiError(400, "Valid project ID is required"));
    }

    const department = await Department.findOne({
      _id: departmentId
    });

    if (!department) {
      return next(new ApiError(404, "Department not found or inactive"));
    }

    const project = await Project.findOne({
      _id: projectId
    });

    if (!project) {
      return next(new ApiError(404, "Project not found or inactive"));
    }

    // Check if product exists if provided
    if (productId && mongoose.isValidObjectId(productId)) {
      const product = await ClientProduct.findOne({
        _id: productId,
        isActive: true,
      });

      if (!product) {
        return next(new ApiError(404, "Product not found or inactive"));
      }
    }

    // Validate againstDepartmentId array if provided
    if (againstDepartmentId && Array.isArray(againstDepartmentId)) {
      const invalidDepartmentIds = againstDepartmentId.filter(
        (id) => !mongoose.isValidObjectId(id)
      );

      if (invalidDepartmentIds.length > 0) {
        return next(new ApiError(400, "One or more against department IDs are invalid"));
      }

      // Check if all against departments exist
      const againstDepartments = await Department.find({
        _id: { $in: againstDepartmentId },
        isActive: true,
      });

      if (againstDepartments.length !== againstDepartmentId.length) {
        return next(new ApiError(404, "One or more against departments not found or inactive"));
      }
    }

    if (assignedTo && mongoose.isValidObjectId(assignedTo)) {
      const assignedUser = await User.findOne({
        _id: assignedTo,
        status: "Active",
      });

      if (!assignedUser) {
        return next(new ApiError(404, "Assigned user not found or inactive"));
      }
    }

    // Validate agaistId if provided
    if (agaistId && mongoose.isValidObjectId(agaistId)) {
      const againstUser = await User.findOne({
        _id: agaistId,
        status: "Active",
      });

      if (!againstUser) {
        return next(new ApiError(404, "Against user not found or inactive"));
      }
    }

    // Check for duplicate open flags with same title and project
    const existingFlag = await FlagRaise.findOne({
      title: title.trim(),
      projectId: projectId,
      status: { $in: ["open", "in_review", "rework_requested"] },
      isActive: true,
    });

    if (existingFlag) {
      return next(new ApiError(400, "An active flag with same title already exists for this project"));
    }

    // Create flag raise document
    const flagRaise = new FlagRaise({
      type: type,
      title: title.trim(),
      description: description.trim(),
      reason: reason?.trim(),
      departmentId: departmentId,
      againstDepartmentId: againstDepartmentId || [],
      projectId: projectId,
      productId: productId,
      agaistId: agaistId,
      raisedBy: userId, 
      assignedTo: assignedTo,
      priority: priority || "medium",
      visibility: visibility || "department",
      reworkInstruction: reworkInstruction?.trim(),
      status: "open",
      isActive: true,
    });

    const savedFlagRaise = await flagRaise.save();

    // Populate references for response
    await savedFlagRaise.populate([
      { path: "departmentId", select: "name code" },
      { path: "againstDepartmentId", select: "name code" },
      { path: "projectId", select: "projectName projectCode" },
      { path: "productId", select: "name code" },
      { path: "agaistId", select: "name email phone" },
      { path: "raisedBy", select: "name email phone designation" },
      { path: "assignedTo", select: "name email phone designation" },
    ]);

    // Send notifications to relevant users
    try {
      const notificationData = {
        title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Flag Raised`,
        body: `${savedFlagRaise.title} - ${savedFlagRaise.description.substring(0, 100)}...`,
        flagId: savedFlagRaise._id,
        projectId: savedFlagRaise.projectId._id,
        priority: savedFlagRaise.priority,
      };

      // Notify department heads
      const departmentHead = await User.findOne({
        departmentId: departmentId,
        status: "Active",
      });

      if (departmentHead) {
        await sendNotification({
          channels: ["mobile", "web"],
          data: notificationData,
          userIds: [departmentHead._id],
        });
      }

      // Notify assigned user if exists
      if (assignedTo) {
        await sendNotification({
          channels: ["mobile", "web", "email"],
          data: {
            ...notificationData,
            title: `Flag Assigned to You: ${notificationData.title}`,
          },
          userIds: [assignedTo],
        });
      }

      // Notify project manager
      const projectManager = await User.findOne({
        _id: project.projectManager,
        status: "Active",
      });

      if (projectManager) {
        await sendNotification({
          channels: ["mobile", "web"],
          data: notificationData,
          userIds: [projectManager._id],
        });
      }

      // Notify against user if exists
      if (agaistId) {
        await sendNotification({
          channels: ["mobile", "web", "email"],
          data: {
            ...notificationData,
            title: `Flag Raised Against You: ${notificationData.title}`,
          },
          userIds: [agaistId],
        });
      }

    } catch (notificationError) {
      console.error("Flag notification error:", notificationError);
      // Don't fail the request if notification fails
    }

    // Prepare response
    const flagResponse = {
      _id: savedFlagRaise._id,
      flagCode: savedFlagRaise.flagCode,
      type: savedFlagRaise.type,
      title: savedFlagRaise.title,
      description: savedFlagRaise.description,
      reason: savedFlagRaise.reason,
      department: {
        _id: savedFlagRaise.departmentId._id,
        name: savedFlagRaise.departmentId.name,
        code: savedFlagRaise.departmentId.code,
      },
      againstDepartments: savedFlagRaise.againstDepartmentId?.map(dept => ({
        _id: dept._id,
        name: dept.name,
        code: dept.code,
      })),
      project: {
        _id: savedFlagRaise.projectId._id,
        name: savedFlagRaise.projectId.projectName,
        code: savedFlagRaise.projectId.projectCode,
      },
      product: savedFlagRaise.productId ? {
        _id: savedFlagRaise.productId._id,
        name: savedFlagRaise.productId.name,
        code: savedFlagRaise.productId.code,
      } : null,
      againstUser: savedFlagRaise.agaistId ? {
        _id: savedFlagRaise.agaistId._id,
        name: savedFlagRaise.agaistId.name,
        email: savedFlagRaise.agaistId.email,
      } : null,
      raisedBy: {
        _id: savedFlagRaise.raisedBy._id,
        name: savedFlagRaise.raisedBy.name,
        email: savedFlagRaise.raisedBy.email,
      },
      assignedTo: savedFlagRaise.assignedTo ? {
        _id: savedFlagRaise.assignedTo._id,
        name: savedFlagRaise.assignedTo.name,
        email: savedFlagRaise.assignedTo.email,
      } : null,
      priority: savedFlagRaise.priority,
      status: savedFlagRaise.status,
      visibility: savedFlagRaise.visibility,
      reworkInstruction: savedFlagRaise.reworkInstruction,
      createdAt: savedFlagRaise.createdAt,
      updatedAt: savedFlagRaise.updatedAt,
    };

    return res.api(201, "Flag raised successfully!", flagResponse);

  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return next(new ApiError(400, `${field} already exists`));
    }
    
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((error) => error.message);
      return next(new ApiError(400, errors.join(", ")));
    }

    console.error("Flag raise error:", err);
    return next(new ApiError(500, err.message || "Internal server error"));
  }
};

// Additional flag management APIs
export const getFlagById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid flag ID"));
    }

    const flag = await FlagRaise.findOne({
      _id: id,
      isActive: true,
    }).populate([
      { path: "departmentId", select: "name code" },
      { path: "againstDepartmentId", select: "name code" },
      { path: "projectId", select: "projectName projectCode" },
      { path: "productId", select: "name code" },
      { path: "agaistId", select: "name email phone" },
      { path: "raisedBy", select: "name email phone designation" },
      { path: "assignedTo", select: "name email phone designation" },
      { path: "reviewedBy", select: "name email" },
    ]);

    if (!flag) {
      return next(new ApiError(404, "Flag not found"));
    }

    return res.api(200, "Flag retrieved successfully", flag);
  } catch (err) {
    return next(new ApiError(500, err.message || "Internal server error"));
  }
};

export const updateFlagStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, reviewRemark, resolvedRemark } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid flag ID"));
    }

    const validStatuses = [
      "open",
      "in_review",
      "rework_requested",
      "rework_done",
      "approved",
      "rejected",
      "resolved",
      "closed",
    ];

    if (!status || !validStatuses.includes(status)) {
      return next(new ApiError(400, "Valid status is required"));
    }

    const flag = await FlagRaise.findOne({
      _id: id,
      isActive: true,
    });

    if (!flag) {
      return next(new ApiError(404, "Flag not found"));
    }

    // Check permission - only assigned user, raised user, or department head can update
    const user = req.user;
    const isAuthorized = 
      flag.assignedTo?.toString() === user._id.toString() ||
      flag.raisedBy.toString() === user._id.toString() ||
      user.designation?.includes("Department Head") ||
      user.designation?.includes("Team Lead");

    if (!isAuthorized) {
      return next(new ApiError(403, "Not authorized to update this flag"));
    }

    // Update flag
    const updates = {
      status: status,
      reviewedBy: status === "rejected" || status === "approved" ? user._id : flag.reviewedBy,
      reviewRemark: reviewRemark || flag.reviewRemark,
    };

    if (status === "resolved") {
      updates.resolvedAt = new Date();
      updates.resolvedRemark = resolvedRemark;
      
      // Calculate solved time in hours
      const createdAt = new Date(flag.createdAt);
      const resolvedAt = new Date();
      const timeDiff = Math.abs(resolvedAt - createdAt);
      updates.slovedTime = Math.ceil(timeDiff / (1000 * 60 * 60)); // Convert to hours
    }

    const updatedFlag = await FlagRaise.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate([
      { path: "departmentId", select: "name code" },
      { path: "projectId", select: "projectName projectCode" },
      { path: "assignedTo", select: "name email" },
      { path: "raisedBy", select: "name email" },
    ]);

    return res.api(200, "Flag status updated successfully", updatedFlag);
  } catch (err) {
    return next(new ApiError(500, err.message || "Internal server error"));
  }
};

export const getFlagsByProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { status, type, priority } = req.query;

    if (!mongoose.isValidObjectId(projectId)) {
      return next(new ApiError(400, "Invalid project ID"));
    }

    const filter = {
      projectId: projectId,
      isActive: true,
    };

    if (status) {
      filter.status = status;
    }

    if (type) {
      filter.type = type;
    }

    if (priority) {
      filter.priority = priority;
    }

    const flags = await FlagRaise.find(filter)
      .populate([
        { path: "departmentId", select: "name code" },
        { path: "projectId", select: "projectName" },
        { path: "raisedBy", select: "name email" },
        { path: "assignedTo", select: "name email" },
      ])
      .sort({ createdAt: -1 });

    return res.api(200, "Flags retrieved successfully", flags);
  } catch (err) {
    return next(new ApiError(500, err.message || "Internal server error"));
  }
};