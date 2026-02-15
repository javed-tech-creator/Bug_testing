import mongoose from "mongoose";
import ApiError from "../../../../utils/master/ApiError.js";
import { DesignAssigned } from "../../models/executive/designAssigned.base.model.js";

export const getAssignedDesignsByStatus = async (req, res, next) => {
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
      DesignAssigned.find(filter)
        .populate("design_request_id")
        .populate("assigned_to", "name")
        .populate("assigned_by", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),

      DesignAssigned.countDocuments(filter),
    ]);

    return res.api(200, "Assigned designs fetched successfully", {
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

export const updatePlanningDesignStatus = async (req, res, next) => {
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

    const assignedDesign = await DesignAssigned.findById(id).session(session);

    if (!assignedDesign) {
      return next(new ApiError(404, "Assigned design not found"));
    }

    /* --------------------------------
     *  PUSH TO WORK STATUS HISTORY
     * -------------------------------- */
    assignedDesign.work_status_history.push({
      work_status: work_status || assignedDesign.work_status,
      urgency: urgency || assignedDesign.urgency,
      work_remark: work_remark || assignedDesign.work_remark,
      deadline: deadline !== undefined ? deadline : assignedDesign.deadline,
      plan_by: req.user._id,
      plan_at: new Date(),
    });

    /* --------------------------------
     *  UPDATE CURRENT FIELDS
     * -------------------------------- */
    if (work_status) assignedDesign.work_status = work_status;
    if (urgency) assignedDesign.urgency = urgency;
    if (deadline !== undefined) assignedDesign.deadline = deadline;
    if (work_remark !== undefined) assignedDesign.work_remark = work_remark;

    await assignedDesign.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.api(200, "Design status updated successfully", {
      assignment_id: assignedDesign._id,
      work_status: assignedDesign.work_status,
      urgency: assignedDesign.urgency,
      deadline: assignedDesign.deadline,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return next(new ApiError(500, error.message));
  }
};
