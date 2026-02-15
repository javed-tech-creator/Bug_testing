import ProjectModel from "../../../modules/sales/models/project.model.js";
import responseHandler from "../../../utils/responseHandler.utils.js";
import tryCatchFn from "../../../utils/tryCatch.utils.js";
import Client from "../../../modules/sales/models/client.model.js";
import mongoose from "mongoose";
import RecceDetail from "../models/recceDetail.model.js";
import User from "../../HR/models/masters/user.model.js";
import ApiError from "../../../utils/master/ApiError.js";
import { RecceAssigned } from "../models/recceAssigned.base.model.js";
import { log } from "console";

const getUrgencyFromPriority = (priority = 5) => {
  if (priority >= 1 && priority <= 3) return "high";
  if (priority >= 4 && priority <= 7) return "medium";
  return "low"; // 8–10
};

// Executive list for assignment (same branch, same department, exclude manager designation and self)
export const getExecutivesListForAssignment = async (req, res, next) => {
  try {
    const managerId = req.user?._id.toString();
    const branchId = req.user?.branch?._id.toString();
    const departmentId = req.user?.department?._id.toString();
    const managerDesignationId = req.user?.designation?._id.toString();

    /* ---------------- VALIDATION ---------------- */

    if (!branchId || !departmentId || !managerDesignationId) {
      return next(
        new ApiError(
          400,
          "Branch, department or designation not found in user context",
        ),
      );
    }

    /* ---------------- QUERY ---------------- */

    const users = await User.find({
      branch: branchId, //  same branch
      department: departmentId, //  same department
      designation: { $ne: managerDesignationId }, // ❌ manager designation exclude
      _id: { $ne: managerId }, //  self exclude (extra safety)
      status: "Active", // optional but recommended
    })
      .select("_id name designation")
      .populate("designation", "title")
      .lean();

    /* ---------------- RESPONSE ---------------- */

    return res.api(200, "Department's All Executives fetched successfully", {
      count: users.length,
      users,
    });
  } catch (error) {
    return next(new ApiError(500, error.message));
  }
};

// assigning recce to self or executives by manager
export const assignRecce = async (req, res, next) => {
  const session = await mongoose.startSession();
  log("Assign Recce called with body:", req.body);
  try {
    session.startTransaction();

    const {
      recce_detail_id,
      assignment_type, // "self" | "executive"
      assigned_to,
      deadline,
      priority_number,
      recce_manager_comment,
    } = req.body;

    const assigned_by = req.user?._id?.toString();
    const role = req.user?.designation?.title || "manager";

    /* ---------------- VALIDATION ---------------- */

    if (!recce_detail_id || !assignment_type) {
      return next(
        new ApiError(400, "recce detail id and assignment_type are required"),
      );
    }

    if (!["self", "executive"].includes(assignment_type)) {
      return next(new ApiError(400, "Invalid assignment_type"));
    }

    if (!mongoose.Types.ObjectId.isValid(recce_detail_id)) {
      return next(new ApiError(400, "Invalid recce_detail_id"));
    }

    if (
      assignment_type === "executive" &&
      (!assigned_to || !mongoose.Types.ObjectId.isValid(assigned_to))
    ) {
      return next(
        new ApiError(400, "assigned_to is required for executive assignment"),
      );
    }

    /* ---------------- CHECK DESIGN REQUEST ---------------- */

    const recceDetail =
      await RecceDetail.findById(recce_detail_id).session(session);

    if (!recceDetail) {
      return next(new ApiError(404, "Recce detail not found"));
    }

    /* ---------------- CREATE ASSIGNMENT ---------------- */
    const urgency = getUrgencyFromPriority(priority_number);

    const assignmentPayload = {
      recce_detail_id,
      assignment_type,
      assigned_by,
      deadline: deadline || null,
      priority_number: priority_number || 5,
      recce_manager_comment: recce_manager_comment || "",
      assigned_to: assignment_type === "self" ? assigned_by : assigned_to,

      //  AUTO DEFAULT STATUS
      work_status: "on_track",
      urgency,
      //  AUTO HISTORY ENTRY
      work_status_history: [
        {
          work_status: "on_track",
          plan_by: assigned_by, //  req.user._id
          plan_at: new Date(), //  now
          urgency,
          deadline: deadline || null, //  same deadline
        },
      ],
    };

    const assignedRecce = await RecceAssigned.create([assignmentPayload], {
      session,
    });

    /* ---------------- UPDATE RECCE DETAIL ---------------- */

    await RecceDetail.findByIdAndUpdate(
      recce_detail_id,
      {
        current_assigned_executive:
          assignment_type === "executive" ? assigned_to : assigned_by,
        current_recce_assigned_id: assignedRecce[0]._id,
        $push: {
          assigned_executives: {
            assigned_to:
              assignment_type === "executive" ? assigned_to : assigned_by,
            assigned_recce_id: assignedRecce[0]._id,
            assign_date: new Date(),
          },
        },
      },
      { session },
    );

    /* ---------------- FETCH NAME FOR TRACKER ---------------- */

    // const populatedRequest = await RecceAssigned.findById(assignedRecce[0]._id)
    //   .populate("current_assigned_executive", "name")
    //   .session(session);

    // const assignedUserName =
    //   populatedRequest?.current_assigned_executive?.name || "User";

    // const message =
    //   assignment_type === "self"
    //     ? `Recce assigned to self by ${assignedUserName} (${role})`
    //     : `Recce assigned to ${assignedUserName} (Executive)`;

    // /* ---------------- EVENT LOG ---------------- */

    // await DesignEventLog.findOneAndUpdate(
    //   {
    //     design_id: design_request_id,
    //     product_id: designRequest.product_id,
    //   },
    //   {
    //     $push: {
    //       events: {
    //         performed_by: assigned_by,
    //         performed_role: role,
    //         action_type: "design_assigned",
    //         message,
    //       },
    //     },
    //   },
    //   {
    //     upsert: true,
    //     new: true,
    //     setDefaultsOnInsert: true,
    //     session,
    //   },
    // );

    /* ---------------- COMMIT ---------------- */

    await session.commitTransaction();
    session.endSession();

    return res.api(201, "Design assigned successfully", {
      data: {
        assignment_id: assignedRecce[0]._id,
        assignment_type,
        assigned_to: assignedRecce[0].assigned_to,
        priority_number: assignedRecce[0].priority_number,
        deadline: assignedRecce[0].deadline,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return next(new ApiError(500, error.message));
  }
};

// assigned self and team recce list
export const getAssignedRecceList = async (req, res, next) => {
  // type = self | team
  try {
    const userId = req.user._id.toString();
    const { type } = req.query;

    let filter = {
      is_active: true,
    };

    if (type === "self") {
      // Jo recce mujhe assign hui hai
      filter.assigned_to = userId;
    } else if (type === "team") {
      // Jo recce maine assign ki hai dusron ko
      filter.assigned_by = userId;

      // Lekin khud ko assign wali nahi
      filter.assigned_to = { $ne: userId };
    } else {
      return res.api(400, "Type must be self or team");
    }

    const recceList = await RecceAssigned.find(filter)
      .populate({
        path: "recce_detail_id",
        match:
          type === "team"
            ? {
                "feedback_panel.finalDecision": {
                  $in: ["pending", "accepted"], // reject nahi aayega
                },
              }
            : {}, // self ke liye koi restriction nahi
      })
      .sort({ createdAt: -1 });

    // Null populated records remove karo
    const filteredData = recceList.filter(
      (item) => item.recce_detail_id !== null,
    );

    return res.api(200, `Recce list fetched for ${type}`, filteredData);
  } catch (error) {
    return next(new ApiError(500, error.message));
  }
};

export const getManagerNextDayPlanningList = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const filter = {
      is_active: true,
      "current_plan.planned_for_date": { $ne: null },
    };

    const [records, total] = await Promise.all([
      RecceAssigned.find(filter)
        .populate("recce_detail_id")
        .populate("assigned_to")
        .populate("current_plan.planned_by")
        .populate("assigned_by")
        .sort({ "current_plan.planned_for_date": 1 })
        .skip(skip)
        .limit(limitNum),

      RecceAssigned.countDocuments(filter),
    ]);

    return res.api(200, "Manager next-day planning list fetched successfully", {
      data: records,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    return next(
      new ApiError(500, "Failed to fetch manager next-day planning list"),
    );
  }
};

//  approve or reject plan by manager 
export const approveOrRejectPlanByManager = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { approval_status, remark } = req.body;

    //  validation
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError(400, "Invalid assigned design id"));
    }

    if (!["accepted", "declined"].includes(approval_status)) {
      return next(
        new ApiError(
          400,
          "Invalid approval_status. Allowed: accepted, declined",
        ),
      );
    }

    const assignedRecce = await RecceAssigned.findById(id);

    if (!assignedRecce) {
      return next(new ApiError(404, "Assigned recce not found"));
    }

    if (!assignedRecce.current_plan) {
      return next(new ApiError(400, "No current plan found for approval"));
    }

    /* --------------------------------
     *  UPDATE CURRENT PLAN
     * -------------------------------- */
    assignedRecce.current_plan.approval_status = approval_status;
    assignedRecce.current_plan.approval_by = req.user._id;
    assignedRecce.current_plan.approval_at = new Date();

    if (remark) {
      assignedRecce.current_plan.remark = remark;
    }

    /* --------------------------------
     *  PUSH TO PLANNING HISTORY
     * -------------------------------- */
    assignedRecce.planning_history.push({
      planned_for_date: assignedRecce.current_plan.planned_for_date,
      planned_slot: assignedRecce.current_plan.planned_slot,
      planned_by: assignedRecce.current_plan.planned_by,
      planned_at: assignedRecce.current_plan.planned_at,
      approval_status,
      approval_by: req.user._id,
      approval_at: new Date(),
      remark: remark || "",
    });

    await assignedRecce.save();

    return res.api(200, "Plan approval updated successfully", {
      assignment_id: assignedRecce._id,
      approval_status,
    });
  } catch (error) {
    return next(new ApiError(500, "Failed to update approval status"));
  }
};

// manager fetch all flag and decline design of  team list data
export const getManagerTeamFlagOrDeclineRecce = async (req, res, next) => {
  try {
    const managerId = req.user?._id.toString();
    const role = req.user?.designation?.title?.toLowerCase();

    if (!managerId || role !== "manager") {
      throw new ApiError(403, "Only manager can access this data");
    }

    const { type } = req.query; // flag | decline

    if (!["flag", "decline"].includes(type)) {
      throw new ApiError(400, "Invalid type. Allowed: flag | decline");
    }

    const filter = {
      assignment_type: "executive",
      assigned_by: new mongoose.Types.ObjectId(managerId),
      "feedback_panel.final_decision": type,
    };

    const data = await RecceAssigned.find(filter)
      .populate("assigned_to")
      .populate("recce_detail_id")
      .sort({ createdAt: -1 });

    return res
      .status(200)
      .json({ data, message: "Team recce fetched successfully" });
  } catch (error) {
    return next(new ApiError(500, error.message));
  }
};
