import mongoose from "mongoose";
import { RecceAssigned } from "../../models/recceAssigned.base.model.js";
import ApiError from "../../../../utils/master/ApiError.js";

export const getAssignedRecceByStatus = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    //  status missing or invalid
    if (!["on_track", "not_on_track"].includes(status)) {
      return next(
        new ApiError(
          400,
          "Invalid status. Allowed values: on_track, not_on_track",
        ),
      );
    }

    const skip = (page - 1) * limit;

    const filter = {
      is_active: true,
    };

    //  Status logic
    if (status === "on_track") {
      filter.work_status = "on_track";
    }

    if (status === "not_on_track") {
      filter.work_status = { $ne: "on_track" };
    }

    const [records, total] = await Promise.all([
      RecceAssigned.find(filter)
        .populate("recce_detail_id")
        .populate("assigned_to", "name")
        .populate("assigned_by", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),

      RecceAssigned.countDocuments(filter),
    ]);

    return res.api(200, "Assigned recce fetched successfully", {
      data: records,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return next(new ApiError(500, error.message));
  }
};

export const updatePlanningRecceStatus = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { id } = req.params;

    const { work_status, urgency, deadline, work_remark } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError(400, "Invalid assigned design id"));
    }

    //  At least one field required
    if (!work_status && !urgency && !deadline && !work_remark) {
      return next(
        new ApiError(400, "At least one field is required to update"),
      );
    }

    const assignedRecce = await RecceAssigned.findById(id).session(session);

    if (!assignedRecce) {
      return next(new ApiError(404, "Assigned recce not found"));
    }

    /* --------------------------------
     *  PUSH TO WORK STATUS HISTORY
     * -------------------------------- */
    assignedRecce.work_status_history.push({
      work_status: work_status || assignedRecce.work_status,
      urgency: urgency || assignedRecce.urgency,
      work_remark: work_remark || assignedRecce.work_remark,
      deadline: deadline !== undefined ? deadline : assignedRecce.deadline,
      plan_by: req.user._id.toString(),
      plan_at: new Date(),
    });

    /* --------------------------------
     *  UPDATE CURRENT FIELDS
     * -------------------------------- */
    if (work_status) assignedRecce.work_status = work_status;
    if (urgency) assignedRecce.urgency = urgency;
    if (deadline !== undefined) assignedRecce.deadline = deadline;
    if (work_remark !== undefined) assignedRecce.work_remark = work_remark;

    await assignedRecce.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.api(200, "Recce status updated successfully", {
      assignment_id: assignedRecce._id,
      work_status: assignedRecce.work_status,
      urgency: assignedRecce.urgency,
      deadline: assignedRecce.deadline,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return next(new ApiError(500, error.message));
  }
};

export const getWaitingDeclineByStatusList = async (req, res, next) => {
  try {
    const { type } = req.params;

    if (!type || !["decline", "waiting"].includes(type)) {
      return next(new ApiError(400, "Type must be decline or waiting"));
    }

    let filter = {
      is_active: true,
    };

    /* -----------------------------
       DECLINE CASE
    ------------------------------ */
    if (type === "decline") {
      filter["current_plan.approval_status"] = "declined";
      filter.work_status = "on_track";
    }

    /* -----------------------------
       WAITING CASE
    ------------------------------ */
    if (type === "waiting") {
      filter["current_plan.approval_status"] = "accepted";
      filter.work_status = {
        $in: [
          "postponed_by_company",
          "postponed_by_client",
          "hold_by_company",
          "hold_by_client",
        ],
      };
    }

    const list = await RecceAssigned.find(filter)
      .populate("assigned_to")
      .populate("recce_detail_id")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: `${type} list fetched successfully`,
      data: list,
    });
  } catch (error) {
    return next(new ApiError(500, error.message));
  }
};

export const workPlanningForNextDayAndToday = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const userId = req.user?._id?.toString();
    const { id, work_status, urgency, planned_slot, remark } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError(400, "Invalid assignment id"));
    }

    if (!planned_slot || !["5_pm", "8_pm", "10_30_am"].includes(planned_slot)) {
      return next(new ApiError(400, "Invalid planned slot"));
    }

    const assignment = await RecceAssigned.findById(id).session(session);

    if (!assignment) {
      return next(new ApiError(404, "Assignment not found"));
    }

    /* ---------------------------------------
       CALCULATE DATE BASED ON SLOT
    --------------------------------------- */
    const today = new Date();
    let plannedDate = new Date();

    if (planned_slot === "10_30_am") {
      // Today
      plannedDate.setHours(0, 0, 0, 0);
    } else {
      // Next Day
      plannedDate.setDate(today.getDate() + 1);
      plannedDate.setHours(0, 0, 0, 0);
    }

    /* ---------------------------------------
       PUSH OLD CURRENT_PLAN INTO HISTORY
    --------------------------------------- */
    if (
      assignment.current_plan &&
      (assignment.current_plan.planned_for_date ||
        assignment.current_plan.planned_by)
    ) {
      assignment.planning_history.push({
        planned_for_date: assignment.current_plan.planned_for_date,
        planned_slot: assignment.current_plan.planned_slot,
        planned_by: assignment.current_plan.planned_by,
        planned_at: assignment.current_plan.planned_at,
        approval_status: assignment.current_plan.approval_status,
        approval_by: assignment.current_plan.approval_by,
        approval_at: assignment.current_plan.approval_at,
        remark: assignment.current_plan.remark,
      });
    }

    /* ---------------------------------------
       UPDATE WORK STATUS FIELDS
    --------------------------------------- */
    if (work_status) assignment.work_status = work_status;
    if (urgency) assignment.urgency = urgency;

    /* ---------------------------------------
       SET NEW CURRENT PLAN
    --------------------------------------- */
    assignment.current_plan = {
      planned_for_date: plannedDate,
      planned_slot: planned_slot,
      planned_by: userId,
      planned_at: new Date(),
      approval_status: "waiting_for_acceptance",
      remark: remark || "",
      approval_by: null,
      approval_at: null,
    };

    await assignment.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Planning updated successfully",
      data: {
        id: assignment._id,
        work_status: assignment.work_status,
        urgency: assignment.urgency,
        planned_for_date: assignment.current_plan.planned_for_date,
        planned_slot: assignment.current_plan.planned_slot,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return next(new ApiError(500, error.message));
  }
};
