import mongoose from "mongoose";
import ApiError from "../../../../utils/master/ApiError.js";
import { DesignAssigned } from "../../models/executive/designAssigned.base.model.js";
import DesignEventLog from "../../models/common_schema/EventsLogs.model.js";
import DesignRequested from "../../models/manager/designRequested.model.js";

export const getExecutiveAssignedDesigns = async (req, res, next) => {
  try {
    const { page = 1, limit = 25, decision = "pending" } = req.query; // pending, accepted, decline, flag

    const branch_id = req.user?.branch?._id?.toString();
    const executiveId = req.user?._id?.toString();

    /* ---------------- VALIDATION ---------------- */
    if (!branch_id || !executiveId) {
      return next(new ApiError(400, "branch_id or executiveId missing"));
    }

    if (!mongoose.Types.ObjectId.isValid(branch_id)) {
      return next(new ApiError(400, "Invalid branch_id"));
    }

    const allowedDecisions = ["pending", "accepted", "decline", "flag"];
    if (!allowedDecisions.includes(decision)) {
      return next(
        new ApiError(
          400,
          "Invalid decision. Allowed: pending, accepted, decline, flag",
        ),
      );
    }

    const pageNumber = Math.max(parseInt(page), 1);
    const pageSize = Math.min(parseInt(limit), 100);
    const skip = (pageNumber - 1) * pageSize;

    /* ---------------- FILTER ---------------- */
    const filter = {
      assignment_type: "executive",
      is_active: true,
      mark_as_started: false,
      branch_id,
      assigned_to: executiveId,
      "feedback_panel.final_decision": decision,
    };

    /* ---------------- QUERY ---------------- */
    const [data, total] = await Promise.all([
      DesignAssigned.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .populate({
          path: "design_request_id",
          populate: [
            { path: "product_id" },
            { path: "project_id" },
            { path: "client_id" },
          ],
        }),

      DesignAssigned.countDocuments(filter),
    ]);

    /* ---------------- RESPONSE ---------------- */
    return res.api(
      200,
      `${decision} executive assigned designs fetched successfully`,
      {
        meta: {
          total,
          page: pageNumber,
          limit: pageSize,
          totalPages: Math.ceil(total / pageSize),
        },
        data,
      },
    );
  } catch (error) {
    console.error("Get Executive Assigned Designs Error:", error);
    return next(new ApiError(500, "Internal server error"));
  }
};

export const executiveDesignReceivedConfirmation = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const {
      design_request_id,
      feedback_panel,
      receiving_checklist,

      product_requirement_remark,
      upload_photos_remark,
      upload_videos_remark,
      installation_details_remark,
      raw_recce_remark,
      data_from_client_remark,
      Additional_instruction_remark,
    } = req.body;

    const executiveId = req.user?._id?.toString();
    const role = req.user?.designation?.title?.toLowerCase() || "";

    /* ---------------- AUTH & ROLE ---------------- */

    if (!executiveId) {
      return next(new ApiError(401, "Unauthorized user"));
    }

    if (role !== "executive") {
      return next(new ApiError(401, "Only Executive can submit this"));
    }

    if (!mongoose.Types.ObjectId.isValid(design_request_id)) {
      return next(new ApiError(400, "Invalid design_request_id"));
    }

    /* ---------------- FEEDBACK VALIDATION ---------------- */

    if (!feedback_panel) {
      return next(new ApiError(400, "Feedback panel is required"));
    }

    const {
      feedback,
      rating,
      final_decision,
      decline_remark,
      flag_type,
      flag_remark,
    } = feedback_panel;

    if (!feedback?.trim()) {
      return next(new ApiError(400, "Feedback is required"));
    }

    if (rating === null || rating === undefined) {
      return next(new ApiError(400, "Rating is required"));
    }

    if (!final_decision) {
      return next(new ApiError(400, "Final decision is required"));
    }

    if (final_decision === "decline" && !decline_remark?.trim()) {
      return next(new ApiError(400, "Decline remark is required"));
    }

    if (final_decision === "flag") {
      if (!flag_type || !flag_remark?.trim()) {
        return next(new ApiError(400, "Flag type & remark required"));
      }
    }

    /* ---------------- CHECKLIST ---------------- */

    if (
      !Array.isArray(receiving_checklist) ||
      receiving_checklist.length === 0
    ) {
      return next(new ApiError(400, "Receiving checklist is required"));
    }

    /* ---------------- FETCH EXECUTIVE ASSIGNMENT ---------------- */

    const assignment = await DesignAssigned.findOne({
      design_request_id,
      assigned_to: executiveId,
      assignment_type: "executive",
      is_active: true,
      mark_as_started: false,
    }).session(session);

    if (!assignment) {
      return next(
        new ApiError(
          404,
          "No active executive assignment found for this design",
        ),
      );
    }

    /* ---------------- REMARK MERGE ---------------- */

    const remarkMap = {
      product_requirement_remark,
      upload_photos_remark,
      upload_videos_remark,
      installation_details_remark,
      raw_recce_remark,
      data_from_client_remark,
      Additional_instruction_remark,
    };

    Object.entries(remarkMap).forEach(([key, value]) => {
      if (value) {
        assignment[key] = {
          ...assignment[key]?.toObject?.(),
          ...value,
        };
      }
    });

    /* ---------------- UPDATE EXECUTIVE DATA ---------------- */

    assignment.receiving_checklist = receiving_checklist;
    assignment.decision_submitted_date = new Date();

    assignment.feedback_panel = {
      feedback,
      rating,
      final_decision,
      decline_remark: final_decision === "decline" ? decline_remark : "",
      flag_type: final_decision === "flag" ? flag_type : "",
      flag_remark: final_decision === "flag" ? flag_remark : "",
    };

    await assignment.save({ session });

    /* ---------------- EVENT LOG (OPTIONAL BUT RECOMMENDED) ---------------- */

    let action_type = "executive_feedback_submitted";
    let message = "Executive submitted design feedback";

    if (final_decision === "accepted") {
      action_type = "executive_design_accepted";
      message = "Design accepted by executive";
    }

    if (final_decision === "decline") {
      action_type = "executive_design_declined";
      message = "Design declined by executive";
    }

    if (final_decision === "flag") {
      action_type = "executive_design_flagged";
      message = "Design flagged by executive";
    }

    await DesignEventLog.findOneAndUpdate(
      { design_id: design_request_id },
      {
        $push: {
          events: {
            performed_by: executiveId,
            performed_role: role,
            action_type,
            message,
          },
        },
      },
      {
        upsert: true,
        new: true,
        session,
      },
    );

    /* ---------------- COMMIT ---------------- */

    await session.commitTransaction();
    session.endSession();

    return res.api(200, "Executive design feedback submitted successfully");
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return next(new ApiError(500, error.message));
  }
};

export const executiveNextDayPlanningList = async (req, res, next) => {
  try {
    const user_id = req.user._id.toString();

    const today = new Date();

    const tomorrowStart = new Date(today);

    tomorrowStart.setDate(today.getDate() + 1);
    tomorrowStart.setHours(0, 0, 0, 0);

    const tomorrowEnd = new Date(tomorrowStart);

    tomorrowEnd.setHours(23, 59, 59, 999);

    const list = await DesignAssigned.find({
      assigned_to: user_id,
      work_status: "on_track",
      is_active: true,
      "current_plan.approval_status": "accepted",
      "current_plan.planned_for_date": {
        $gte: tomorrowStart,
        $lte: tomorrowEnd,
      },
    });

    res.status(200).json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUpcomingDesignRequests = async (req, res, next) => {
  try {
    const branchId = req.user?.branch?._id?.toString();

    if (!branchId) {
      throw new ApiError(400, "Branch not found in user");
    }

    const upcomingList = await DesignRequested.find({
      is_active: true,
      branch_id: branchId,
      "feedback_panel.final_decision": "accepted",
      current_assigned_executive: null,
    })
      .populate("project_id")
      .populate("client_id")
      .populate("product_id")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: upcomingList.length,
      data: upcomingList,
    });
  } catch (error) {
    next(error instanceof ApiError ? error : new ApiError(500, error.message));
  }
};
