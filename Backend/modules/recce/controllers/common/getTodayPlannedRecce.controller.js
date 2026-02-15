import { RecceAssigned } from "../../models/recceAssigned.base.model.js";


export const recceTodayList = async (req, res) => {
  try {
    const userId = req.user?._id?.toString();

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

    const todayList = await RecceAssigned.find({
      assigned_to: userId,
      work_status: "on_track",
      is_active: true,
      "current_plan.approval_status": "accepted",
      "current_plan.planned_for_date": {
        $gte: todayStart,
        $lte: todayEnd,
      },
    })
      .populate("recce_detail_id")
      .populate("assigned_by")
      .sort({ "current_plan.planned_slot": 1 });

    res.status(200).json({
      success: true,
      message: "Recce today's list fetched successfully",
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