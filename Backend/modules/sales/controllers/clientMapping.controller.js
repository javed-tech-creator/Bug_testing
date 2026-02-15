import mongoose from "mongoose";
import ApiError from "../../../utils/master/ApiError.js";
import Client from "../models/client.model.js";
import ClientMapping from "../models/clientMapping.model.js";

/**
 * POST /client-mapping/send-to-manager
 * Client ID dekar Client table mein isSentToManager = true set karta hai
 * Body: { clientId }
 */
export const sendToManager = async (req, res, next) => {
  try {
    const { clientId } = req.body;

    if (!clientId) {
      return next(new ApiError(400, "Client ID is required"));
    }

    if (!mongoose.isValidObjectId(clientId)) {
      return next(new ApiError(400, "Invalid client ID"));
    }

    const client = await Client.findById(clientId).select("-password -sequence_value").lean();

    if (!client) {
      return next(new ApiError(404, "Client not found"));
    }

    if (client.isDeleted || client.status === "Deleted") {
      return next(new ApiError(404, "Client not found"));
    }

    await Client.findByIdAndUpdate(clientId, { isSentToManager: true });
    return res.api(200, "Client sent to manager successfully", {
      client: { ...client, isSentToManager: true },
    });
  } catch (err) {
    return next(new ApiError(500, err.message || "Internal server error"));
  }
};

/**
 * POST /client-mapping/send-to-project-department
 * Manager sends client to project department
 * Body: { clientId } - sirf clientId, baaki req.user aur client table se controller mein
 */
export const sendToProjectDepartment = async (req, res, next) => {
  try {
    const { clientId } = req.body;

    if (!clientId) {
      return next(new ApiError(400, "Client ID is required"));
    }

    if (!mongoose.isValidObjectId(clientId)) {
      return next(new ApiError(400, "Invalid client ID"));
    }

    const managerId = req.user?._id;
    const projectDepartmentId = req.user?.department;

    if (!managerId) {
      return next(new ApiError(401, "Unauthorized - User not found"));
    }

    const client = await Client.findById(clientId).lean();
    if (!client) {
      return next(new ApiError(404, "Client not found"));
    }

    if (!client.isSentToManager) {
      return next(new ApiError(400, "Client must be sent to manager first"));
    }

    const assignTime = new Date();
    const projectIds = client.projectId?.length
      ? client.projectId.map((p) => (p && p._id ? p._id : p))
      : [];

    let mapping = await ClientMapping.findOne({ clientId, isDeleted: { $ne: true } });

    if (mapping) {
      mapping.projectDepartmentId = projectDepartmentId || mapping.projectDepartmentId;
      mapping.projectDepartmentManager = { userId: managerId, assignedAt: assignTime };
      mapping.projectId = projectIds;
      mapping.isSendtoProjectDepartment = true;
      mapping.currentStep = "projectDepartment";
      await mapping.save();
    } else {
      mapping = await ClientMapping.create({
        clientId,
        projectId: projectIds,
        projectDepartmentId: projectDepartmentId || null,
        projectDepartmentManager: { userId: managerId, assignedAt: assignTime },
        isSendtoManager: true,
        isSendtoProjectDepartment: true,
        currentStep: "projectDepartment",
      });
    }

    await Client.findByIdAndUpdate(clientId, { isSentToProjectDepartment: true });

    const populated = await ClientMapping.findById(mapping._id)
      .populate("clientId", "name email phone companyName clientId")
      .populate("projectDepartmentManager.userId", "name email")
      .populate("projectDepartmentId", "name")
      .populate("projectId", "projectName projectId")
      .lean();

    return res.api(200, "Client sent to project department successfully", {
      clientMapping: populated,
      client: { ...client, isSentToProjectDepartment: true },
    });
  } catch (err) {
    return next(new ApiError(500, err.message || "Internal server error"));
  }
};

/**
 * GET /client-mapping/client/:clientId
 * Get client mapping by client ID with all details
 */
export const getClientMappingByClientId = async (req, res, next) => {
  try {
    const { clientId } = req.params;

    if (!clientId || !mongoose.isValidObjectId(clientId)) {
      return next(new ApiError(400, "Valid client ID is required"));
    }

    const mapping = await ClientMapping.findOne({
      clientId,
      isDeleted: { $ne: true },
    })
      .populate("clientId", "name email phone companyName clientId leadId projectId")
      .populate("executive.userId", "name email phone")
      .populate("manager.userId", "name email phone")
      .populate("projectDepartmentManager.userId", "name email phone")
      .populate("projectDepartmentId", "name")
      .populate("projectId", "projectName projectId status")
      .lean();

    if (!mapping) {
      return next(new ApiError(404, "Client mapping not found"));
    }

    const client = await Client.findById(clientId)
      .populate({ path: "leadId", select: "clientName phone email leadStatus" })
      .select("-password -sequence_value")
      .lean();

    return res.api(200, "Client mapping fetched successfully", {
      clientMapping: mapping,
      client: client || null,
    });
  } catch (err) {
    return next(new ApiError(500, err.message || "Internal server error"));
  }
};
