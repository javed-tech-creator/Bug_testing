import mongoose from "mongoose";
import ApiError from "../../../../utils/master/ApiError.js";
import DesignRequested from "../../models/manager/designRequested.model.js";
import DesignEventLog from "../../models/common_schema/EventsLogs.model.js";
import { DesignAssigned } from "../../models/executive/designAssigned.base.model.js";
import User from "../../../HR/models/masters/user.model.js";

const getUrgencyFromPriority = (priority = 5) => {
  if (priority >= 1 && priority <= 3) return "high";
  if (priority >= 4 && priority <= 7) return "medium";
  return "low"; // 8–10
};

export const assignDesign = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const {
      design_request_id,
      assignment_type, // "self" | "executive"
      assigned_to,
      deadline,
      priority_number,
      design_manager_comment,
    } = req.body;

    const assigned_by = req.user?._id?.toString();
    const branch_id = req.user?.branch?._id?.toString();
    const role = req.user?.designation?.title || "manager";

    /* ---------------- VALIDATION ---------------- */

    if (!design_request_id || !assignment_type) {
      return next(
        new ApiError(400, "design id and assignment_type are required"),
      );
    }

    if (!["self", "executive"].includes(assignment_type)) {
      return next(new ApiError(400, "Invalid assignment_type"));
    }

    if (!mongoose.Types.ObjectId.isValid(design_request_id)) {
      return next(new ApiError(400, "Invalid design_request_id"));
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

    const designRequest =
      await DesignRequested.findById(design_request_id).session(session);

    if (!designRequest) {
      return next(new ApiError(404, "Design request not found"));
    }

    /* ---------------- CREATE ASSIGNMENT ---------------- */
    const urgency = getUrgencyFromPriority(priority_number);

    const assignmentPayload = {
      design_request_id,
      assignment_type,
      assigned_by,
      branch_id,
      deadline: deadline || null,
      priority_number: priority_number || 5,
      design_manager_comment: design_manager_comment || "",
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

    const assignedDesign = await DesignAssigned.create([assignmentPayload], {
      session,
    });

    /* ---------------- UPDATE DESIGN REQUEST ---------------- */

    await DesignRequested.findByIdAndUpdate(
      design_request_id,
      {
        current_assigned_executive:
          assignment_type === "executive" ? assigned_to : assigned_by,
        current_design_assigned_id: assignedDesign[0]._id,
        $push: {
          assigned_executives: {
            assigned_to:
              assignment_type === "executive" ? assigned_to : assigned_by,
            assigned_design_id: assignedDesign[0]._id,
            assign_date: new Date(),
          },
        },
      },
      { session },
    );

    /* ---------------- FETCH NAME FOR TRACKER ---------------- */

    const populatedRequest = await DesignRequested.findById(design_request_id)
      .populate("current_assigned_executive", "name")
      .session(session);

    const assignedUserName =
      populatedRequest?.current_assigned_executive?.name || "User";

    const message =
      assignment_type === "self"
        ? `Design assigned to self by ${assignedUserName} (${role})`
        : `Design assigned to ${assignedUserName} (Executive)`;

    /* ---------------- EVENT LOG ---------------- */

    await DesignEventLog.findOneAndUpdate(
      {
        design_id: design_request_id,
        product_id: designRequest.product_id,
      },
      {
        $push: {
          events: {
            performed_by: assigned_by,
            performed_role: role,
            action_type: "design_assigned",
            message,
          },
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        session,
      },
    );

    /* ---------------- COMMIT ---------------- */

    await session.commitTransaction();
    session.endSession();

    return res.api(201, "Design assigned successfully", {
      data: {
        assignment_id: assignedDesign[0]._id,
        assignment_type,
        assigned_to: assignedDesign[0].assigned_to,
        priority_number: assignedDesign[0].priority_number,
        deadline: assignedDesign[0].deadline,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return next(new ApiError(500, error.message));
  }
};

export const reassignDesign = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const {
      design_request_id,
      assignment_type, // self | executive
      assigned_to,
      deadline,
      priority_number,
      design_manager_comment,
      de_assigned_remark,
    } = req.body;

    const assigned_by = req.user?._id?.toString();
    const branch_id = req.user?.branch?._id?.toString();
    const role = req.user?.designation?.title || "manager";

    /* ---------------- VALIDATION ---------------- */

    if (!design_request_id || !assigned_to) {
      return next(
        new ApiError(400, "design_request_id and assigned_to are required"),
      );
    }

    if (!mongoose.Types.ObjectId.isValid(design_request_id)) {
      return next(new ApiError(400, "Invalid design_request_id"));
    }

    if (!mongoose.Types.ObjectId.isValid(assigned_to)) {
      return next(new ApiError(400, "Invalid assigned_to"));
    }

    /* ---------------- FETCH DESIGN REQUEST ---------------- */

    const designRequest =
      await DesignRequested.findById(design_request_id).session(session);

    if (!designRequest) {
      return next(new ApiError(404, "Design request not found"));
    }

    /* ---------------- BLOCK SAME EXECUTIVE ---------------- */

    if (
      designRequest.current_assigned_executive?.toString() ===
      assigned_to.toString()
    ) {
      return next(
        new ApiError(400, "This executive is already assigned to this design"),
      );
    }

    /* ---------------- CLOSE CURRENT ASSIGNMENT ---------------- */

    if (designRequest.current_design_assigned_id) {
      await DesignAssigned.findByIdAndUpdate(
        designRequest.current_design_assigned_id,
        {
          is_active: false,
          de_assigned_at: new Date(),
          de_assigned_remark: de_assigned_remark || "",
        },
        { session },
      );
    }

    /* ---------------- GET OLD USER NAME ---------------- */

    const populatedOld = await DesignRequested.findById(design_request_id)
      .populate("current_assigned_executive", "name")
      .session(session);

    const oldUserName =
      populatedOld?.current_assigned_executive?.name ||
      "previous assigned user";

    const deAssignMessage = `Design assignment removed from ${oldUserName} by ${role}${
      de_assigned_remark ? `. Reason: ${de_assigned_remark}` : ""
    }`;

    /* ---------------- EVENT LOG (DE-ASSIGN) ---------------- */

    await DesignEventLog.findOneAndUpdate(
      {
        design_id: design_request_id,
        product_id: designRequest.product_id,
      },
      {
        $push: {
          events: {
            performed_by: assigned_by,
            performed_role: role,
            action_type: "design_de_assigned",
            message: deAssignMessage,
          },
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        session,
      },
    );

    /* ---------------- CREATE NEW ASSIGNMENT ---------------- */
    const urgency = getUrgencyFromPriority(priority_number);

    const reassignmentPayload = {
      design_request_id,
      assignment_type,
      assigned_by,
      branch_id,
      deadline: deadline || null,
      priority_number: priority_number || 5,
      design_manager_comment: design_manager_comment || "",
      is_active: true,
      is_reassigned: true,
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
          deadline: deadline || null, //  same deadline
          urgency,
        },
      ],
    };

    const newAssignment = await DesignAssigned.create([reassignmentPayload], {
      session,
    });

    /* ---------------- UPDATE PARENT ---------------- */

    await DesignRequested.findByIdAndUpdate(
      design_request_id,
      {
        current_design_assigned_id: newAssignment[0]._id,
        mark_as_started: false,
        current_assigned_executive:
          assignment_type === "self" ? assigned_by : assigned_to,
        $push: {
          assigned_executives: {
            assigned_to: assignment_type === "self" ? assigned_by : assigned_to,
            assigned_design_id: newAssignment[0]._id,
            assign_date: new Date(),
          },
        },
      },
      { session },
    );

    /* ---------------- GET NEW USER NAME ---------------- */

    const newUser = await User.findById(
      assignment_type === "self" ? assigned_by : assigned_to,
    )
      .select("name")
      .session(session);

    const newUserName = newUser?.name || "new executive";

    const reAssignMessage =
      assignment_type === "self"
        ? `Design reassigned to self by ${role}`
        : `Design reassigned to ${newUserName} by ${role}${
            de_assigned_remark ? `. Reason: ${de_assigned_remark}` : ""
          }`;

    /* ---------------- EVENT LOG (RE-ASSIGN) ---------------- */

    await DesignEventLog.findOneAndUpdate(
      {
        design_id: design_request_id,
        product_id: designRequest.product_id,
      },
      {
        $push: {
          events: {
            performed_by: assigned_by,
            performed_role: role,
            action_type: "design_reassigned",
            message: reAssignMessage,
          },
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        session,
      },
    );

    /* ---------------- COMMIT ---------------- */

    await session.commitTransaction();
    session.endSession();

    return res.api(200, "Design reassigned successfully", {
      data: {
        assignment_id: newAssignment[0]._id,
        assigned_to: newAssignment[0].assigned_to,
        priority_number: newAssignment[0].priority_number,
        deadline: newAssignment[0].deadline,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return next(new ApiError(500, error.message));
  }
};

export const getManagerAssignedDesigns = async (req, res, next) => {
  try {
    const managerId = req.user?._id?.toString();
    const branchId = req.user?.branch?._id?.toString();

    /* ---------------- VALIDATION ---------------- */

    if (!managerId || !branchId) {
      return next(new ApiError(400, "Manager or branch information missing"));
    }

    /* ---------------- QUERY ---------------- */

    const assignments = await DesignAssigned.find({
      branch_id: branchId,
      assignment_type: "self", // 👨‍💼 manager self assignment
      assigned_to: managerId, // 👤 assigned to manager
      is_active: true, //  active
      mark_as_started: false, // ❌ not started
    })
      .populate({
        path: "design_request_id",
        select: `
          design_id
          project_id
          product_id
          client_id
          feedback_panel
          createdAt
        `,
        populate: [
          { path: "project_id" },
          { path: "client_id" },
          { path: "product_id" },
        ],
      })
      .sort({ createdAt: -1 })
      .lean();

    /* ---------------- FORMAT RESPONSE ---------------- */

    const designs = assignments.map((item) => ({
      assignment_id: item._id,
      design_request_id: item.design_request_id?._id,
      design_id: item.design_request_id?.design_id,

      project: item.design_request_id?.project_id || null,
      client: item.design_request_id?.client_id || null,
      product: item.design_request_id?.product_id || null,

      priority: item.priority_number,
      deadline: item.deadline,
      assigned_at: item.createdAt,
    }));

    /* ---------------- RESPONSE ---------------- */

    return res.api(200, "Manager assigned designs fetched successfully", {
      count: designs.length,
      designs,
    });
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
      DesignAssigned.find(filter)
        .populate("design_request_id")
        .populate("assigned_to", "name")
        .populate("current_plan.planned_by", "name")
        .populate("assigned_by", "name")
        .sort({ "current_plan.planned_for_date": 1 })
        .skip(skip)
        .limit(limitNum),

      DesignAssigned.countDocuments(filter),
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

    const assignedDesign = await DesignAssigned.findById(id);

    if (!assignedDesign) {
      return next(new ApiError(404, "Assigned design not found"));
    }

    if (!assignedDesign.current_plan) {
      return next(new ApiError(400, "No current plan found for approval"));
    }

    /* --------------------------------
     *  UPDATE CURRENT PLAN
     * -------------------------------- */
    assignedDesign.current_plan.approval_status = approval_status;
    assignedDesign.current_plan.approval_by = req.user._id;
    assignedDesign.current_plan.approval_at = new Date();

    if (remark) {
      assignedDesign.current_plan.remark = remark;
    }

    /* --------------------------------
     *  PUSH TO PLANNING HISTORY
     * -------------------------------- */
    assignedDesign.planning_history.push({
      planned_for_date: assignedDesign.current_plan.planned_for_date,
      planned_slot: assignedDesign.current_plan.planned_slot,
      planned_by: assignedDesign.current_plan.planned_by,
      planned_at: assignedDesign.current_plan.planned_at,
      approval_status,
      approval_by: req.user._id,
      approval_at: new Date(),
      remark: remark || "",
    });

    await assignedDesign.save();

    return res.api(200, "Plan approval updated successfully", {
      assignment_id: assignedDesign._id,
      approval_status,
    });
  } catch (error) {
    return next(new ApiError(500, "Failed to update approval status"));
  }
};

// manager fetch all flag and decline design of  team list data
export const getManagerTeamFlagOrDeclineDesigns = async (req, res, next) => {
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

    const data = await DesignAssigned.find(filter)
      .populate("assigned_to", "name email")
      .populate("design_request_id")
      .sort({ createdAt: -1 });

    return res
      .status(200)
      .json({ data, message: "Team designs fetched successfully" });
  } catch (error) {
    return next(new ApiError(500, error.message));
  }
};
