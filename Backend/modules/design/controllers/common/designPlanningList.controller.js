import { DesignAssigned } from "../../models/executive/designAssigned.base.model.js";

export const designTodayList = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    //  Today start & end
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    /**
     * IMPORTANT:
     * planned_slot logic already controller me handle ho chuka hai
     * so yahan sirf planned_for_date = TODAY se filter hoga
     */

    const todayList = await DesignAssigned.find({
      assigned_to: userId,
      work_status: "on_track",
      is_active: true,
      "current_plan.approval_status": "accepted",
      "current_plan.planned_for_date": {
        $gte: todayStart,
        $lte: todayEnd,
      },
    })
      .populate("design_request_id")
      .populate("assigned_by")
      .populate("branch_id")
      .sort({ "current_plan.planned_slot": 1 });

    res.status(200).json({
      success: true,
      count: todayList.length,
      data: todayList,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
