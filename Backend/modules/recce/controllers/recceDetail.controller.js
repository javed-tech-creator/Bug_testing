import ProjectModel from "../../../modules/sales/models/project.model.js";
import responseHandler from "../../../utils/responseHandler.utils.js";
import tryCatchFn from "../../../utils/tryCatch.utils.js";
import Client from "../../../modules/sales/models/client.model.js";
import mongoose from "mongoose";
import RecceDetail from "../models/recceDetail.model.js";

class recceController {
  createRecceByCoordinator = tryCatchFn(async (req, res) => {
    const {
      projectId,
      leadId,
      clientId,
      receivedId,
      deadline,
      urgency,
      projectComments,
    } = req.body;

    // =============================
    // Validation
    // =============================

    if (!projectId || !leadId || !clientId || !deadline) {
      return responseHandler.errorResponse(res, 400, "Required fields missing");
    }

    // =============================
    // Create Recce
    // =============================

    const newRecce = await RecceDetail.create({
      projectId,
      leadId,
      clientId,

      send_by: req.user._id.toString(), // coordinator id
      received_by: receivedId || null,

      deadline,
      urgency,
      projectComments,

      feedback_panel: {
        finalDecision: "pending",
      },
    });

    return responseHandler.successResponse(
      res,
      201,
      "Recce created successfully",
      newRecce,
    );
  });

  getAllRecceByDecision = tryCatchFn(async (req, res) => {
    const { page = 1, limit = 10, type = "pending" } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const managerId = req.user?._id?.toString();

    const pipeline = [
      {
        $match: {
          received_by: new mongoose.Types.ObjectId(managerId),
          "feedback_panel.final_decision": type,
        },
      },

      //  Join Project
      {
        $lookup: {
          from: "projects",
          localField: "projectId",
          foreignField: "_id",
          as: "project",
        },
      },
      { $unwind: "$project" },

      //  Join Client
      {
        $lookup: {
          from: "clients",
          localField: "project.clientId",
          foreignField: "_id",
          as: "client",
        },
      },
      { $unwind: { path: "$client", preserveNullAndEmptyArrays: true } },

      {
        $project: {
          _id: "$project._id",
          projectName: "$project.projectName",
          clientName: "$client.name",
          address: "$client.address",
          status: "$feedback_panel.final_decision",
          visitTime: "$project.createdAt",
        },
      },

      { $skip: skip },
      { $limit: limitNum },
    ];

    const [recceData, totalCount] = await Promise.all([
      RecceDetail.aggregate(pipeline),
      RecceDetail.countDocuments({
        received_by: managerId,
        "feedback_panel.final_decision": type,
      }),
    ]);

    responseHandler.successResponse(res, 200, "Recce fetched successfully", {
      recceData,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalRecords: totalCount,
      },
    });
  }); // manager fetch sales in recce list and accepted or rejected or flagged by manager by sending type (pending, accept, reject, flag) as query parameter

  recceDecisionResponse = tryCatchFn(async (req, res) => {
    const {
      id,
      status, // accepted | decline | flag | pending
      flagType,
      flagRemark,
      declineRemark,
      recceRemark,
      remarkRating,
      basicClientRemark,
      projectInformationRemark,
      sideAddressRemark,
      receiving_checklist,
      designAssetsRemark,
      reccefeedback,
    } = req.body;

    // ===============================
    // 🔹 Validation
    // ===============================

    if (!id) {
      return responseHandler.errorResponse(res, 400, "Recce id is required");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return responseHandler.errorResponse(res, 400, "Invalid Recce id");
    }

    const recceDetail = await RecceDetail.findById(id);

    if (!recceDetail) {
      return responseHandler.errorResponse(res, 404, "Recce not found");
    }

    // ===============================
    // 🔹 Basic Field Updates
    // ===============================

    if (recceRemark !== undefined) recceDetail.recceComment = recceRemark;

    if (remarkRating !== undefined) recceDetail.remarkScore = remarkRating;

    if (basicClientRemark) recceDetail.basicClientRemark = basicClientRemark;

    if (projectInformationRemark)
      recceDetail.projectInformationRemark = projectInformationRemark;

    if (sideAddressRemark) recceDetail.sideAddressRemark = sideAddressRemark;

    if (designAssetsRemark) recceDetail.designAssetsRemark = designAssetsRemark;

    if (reccefeedback) recceDetail.reccefeedback = reccefeedback;

    if (receiving_checklist)
      recceDetail.receiving_checklist = receiving_checklist;

    // ===============================
    // 🔹 Feedback Panel Logic
    // ===============================

    if (status) {
      recceDetail.feedback_panel.finalDecision = status.toLowerCase();

      if (status.toLowerCase() === "decline") {
        recceDetail.feedback_panel.declineRemark = declineRemark || "";
      }

      if (status.toLowerCase() === "flag") {
        recceDetail.feedback_panel.flagType = flagType || "";
        recceDetail.feedback_panel.flagRemark = flagRemark || "";
      }

      if (status.toLowerCase() === "accepted") {
        recceDetail.current_assigned_executive = null;
        recceDetail.current_recce_assigned_id = null;
      }
    }

    // Manager who handled it
    recceDetail.received_by =
      req.user?._id?.toString() || recceDetail.received_by;

    await recceDetail.save();

    return responseHandler.successResponse(
      res,
      200,
      "Recce updated successfully",
      recceDetail,
    );
  });
}
export default new recceController();
