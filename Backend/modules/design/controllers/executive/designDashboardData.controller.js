import ApiError from "../../../../utils/master/ApiError.js";
import { DesignAssigned } from "../../models/executive/designAssigned.base.model.js";

export const getExecutiveDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user?._id.toString();

    if (!userId) {
      throw new ApiError(400, "User not found");
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    /* ================= TOTAL ================= */
    const totalDesigns = await DesignAssigned.countDocuments({
      assigned_to: userId,
    });

    /* ================= TODAY ================= */
    const todaysDesigns = await DesignAssigned.countDocuments({
      assigned_to: userId,
      is_active: true,
      "feedback_panel.final_decision": "accepted",
      "current_plan.approval_status": "accepted",
      "current_plan.planned_for_date": {
        $gte: todayStart,
        $lte: todayEnd,
      },
    });

    /* ================= ASSIGNED (PENDING) ================= */
    const assignedDesigns = await DesignAssigned.countDocuments({
      assigned_to: userId,
      is_active: true,
      mark_as_started: false,
      "current_plan.approval_status": "pending",
    });

    /* ================= COMPLETED ================= */
    const completedDesigns = await DesignAssigned.countDocuments({
      assigned_to: userId,
      mark_as_design_review_started: true,
    });

    /* ================= WAITING ================= */
    const waitingDesigns = await DesignAssigned.countDocuments({
      assigned_to: userId,
      is_active: true,
      mark_as_design_review_started: false,
      work_status: {
        $in: [
          "postponed_by_company",
          "postponed_by_client",
          "hold_by_company",
          "hold_by_client",
        ],
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        total_designs: totalDesigns,
        todays_designs: todaysDesigns,
        assigned_designs: assignedDesigns,
        completed_designs: completedDesigns,
        waiting_designs: waitingDesigns,
      },
    });
  } catch (error) {
    next(error instanceof ApiError ? error : new ApiError(500, error.message));
  }
};
