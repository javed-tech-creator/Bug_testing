import mongoose from "mongoose";
import ApiError from "../../../utils/master/ApiError.js";
import Client from "../../sales/models/client.model.js";
import ClientProjectMap from "../clientProjectMap.model.js";

/**
 * POST /project/client-project-map/assign-coordinator
 * Body: { clientId, projectId, coordinatorId, branch, deadline, urgency, comment }
 */
export const assignCoordinator = async (req, res, next) => {
  try {
    const {
      clientId,
      projectId = null,
      coordinatorId,
      branch = null,
      deadline = null,
      urgency = null,
      comment = null,
    } = req.body;

    if (!clientId || !mongoose.isValidObjectId(clientId)) {
      return next(new ApiError(400, "Valid clientId is required"));
    }

    if (coordinatorId && !mongoose.isValidObjectId(coordinatorId)) {
      return next(new ApiError(400, "Invalid coordinatorId"));
    }

    const client = await Client.findById(clientId).lean();
    if (!client) {
      return next(new ApiError(404, "Client not found"));
    }

    const assignTime = new Date();

    let mapping = await ClientProjectMap.findOne({ clientId, isDeleted: { $ne: true } });

    if (mapping) {
      mapping.projectId = projectId || mapping.projectId;
      mapping.coordinator = coordinatorId ? { userId: coordinatorId, assignedAt: assignTime } : mapping.coordinator;
      mapping.branch = branch || mapping.branch;
      mapping.deadline = deadline ? new Date(deadline) : mapping.deadline;
      mapping.urgency = urgency || mapping.urgency;
      mapping.comment = comment || mapping.comment;
      await mapping.save();
    } else {
      mapping = await ClientProjectMap.create({
        clientId,
        projectId,
        coordinator: coordinatorId ? { userId: coordinatorId, assignedAt: assignTime } : null,
        branch,
        deadline: deadline ? new Date(deadline) : null,
        urgency,
        comment,
      });
    }

    const populated = await ClientProjectMap.findById(mapping._id)
      .populate("clientId", "name email phone clientId")
      .populate("projectId", "projectName projectId")
      .populate("coordinator.userId", "name email phone")
      .lean();

    return res.api(200, "Coordinator assigned successfully", { clientProjectMap: populated });
  } catch (err) {
    console.log(err)
    return next(new ApiError(500, err.message || "Internal server error"));
  }
};

/**
 * GET /project/client-project-map/client/:clientId
 * Fetch client project mapping by clientId
 */
export const getClientProjectMapByClientId = async (req, res, next) => {
  try {
    const { clientId } = req.params;

    if (!clientId || !mongoose.isValidObjectId(clientId)) {
      return next(new ApiError(400, "Valid client ID is required"));
    }

    const mapping = await ClientProjectMap.findOne({
      clientId,
      isDeleted: { $ne: true },
    })
      .populate("clientId", "name email phone clientId")
      .populate("projectId", "projectName projectId")
      .populate("coordinator.userId", "name email phone")
      .lean();

    if (!mapping) {
      return next(new ApiError(404, "Client project mapping not found"));
    }

    return res.api(200, "Client project mapping fetched successfully", { clientProjectMap: mapping });
  } catch (err) {
    return next(new ApiError(500, err.message || "Internal server error"));
  }
};

/**
 * GET /project/client-project-map/assigned
 * Returns all client-project mappings that have a coordinator assigned
 */
export const getAssignedClients = async (req, res, next) => {
  try {
    const mappings = await ClientProjectMap.find({
      isDeleted: { $ne: true },
      "coordinator.userId": { $ne: null },
    })
      .populate({
        path: "clientId",
        populate: { path: "leadId", select: "clientName phone email leadStatus" },
      })
      .populate("projectId")
      .populate("coordinator.userId", "name email phone userId")
      .lean();

    return res.api(200, "Assigned client mappings fetched successfully", {
      count: mappings.length,
      mappings,
    });
  } catch (err) {
    return next(new ApiError(500, err.message || "Internal server error"));
  }
};

