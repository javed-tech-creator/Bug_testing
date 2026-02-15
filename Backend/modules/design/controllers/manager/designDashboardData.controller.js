import ApiError from "../../../../utils/master/ApiError.js";
import { DesignMeasurementVersion } from "../../models/common_schema/designMeasurementVersion.model.js";
import { DesignOptionsModel } from "../../models/common_schema/designOptions.model.js";
import { DesignAssigned } from "../../models/executive/designAssigned.base.model.js";
import DesignRequested from "../../models/manager/designRequested.model.js";
import { DesignMockupVersionModel } from "../../models/common_schema/designMockupVersion.model.js";

// Dashboard stats for manager ( Total Designs, New Today, In Progress, Flag Raised, In Waiting, Completed, Delayed)
export const getDesignDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user?._id.toString();
    const branchId = req.user?.branch?._id.toString();

    if (!userId || !branchId) {
      throw new ApiError(400, "User or Branch not found");
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    /* =====================================================
       DESIGN REQUEST COUNTS
    ===================================================== */

    const totalDesigns = await DesignRequested.countDocuments({
      received_by: userId,
      branch_id: branchId,
    });

    const newToday = await DesignRequested.countDocuments({
      received_by: userId,
      branch_id: branchId,
      createdAt: { $gte: todayStart, $lte: todayEnd },
    });

    const flagRaised = await DesignRequested.countDocuments({
      received_by: userId,
      branch_id: branchId,
      "feedback_panel.final_decision": "flag",
    });

    const completed = await DesignAssigned.countDocuments({
      assigned_by: userId,
      "feedback_panel.final_decision": "accepted",
      mark_as_design_review_started: true,
    });

    const inWaiting = await DesignAssigned.countDocuments({
      assigned_by: userId,
      work_status: {
        $in: [
          "postponed_by_company",
          "postponed_by_client",
          "hold_by_company",
          "hold_by_client",
        ],
      },
    });

    /* =====================================================
       DESIGN ASSIGNED COUNTS
    ===================================================== */

    const inProgress = await DesignAssigned.countDocuments({
      assigned_by: userId,
      is_active: true,
      mark_as_design_review_started: false,
    });

    const delayed = await DesignAssigned.countDocuments({
      assigned_by: userId,
      is_active: true,
      deadline: { $lt: new Date() },
      work_status: "on_track",
    });

    return res.status(200).json({
      success: true,
      data: {
        total_designs: totalDesigns,
        new_today: newToday,
        in_progress: inProgress,
        flag_raised: flagRaised,
        in_waiting: inWaiting,
        completed: completed,
        delayed: delayed,
      },
    });
  } catch (error) {
    next(error instanceof ApiError ? error : new ApiError(500, error.message));
  }
};

// Modification count for designs under modification (version started but not yet accepted, mockup uploaded but not yet accepted, measurement started but not yet accepted) for manager dashboard
export const getUnderModificationCount = async (req, res, next) => {
  try {
    const userId = req.user?._id.toString();

    if (!userId) {
      throw new ApiError(400, "User not found");
    }

    const uniqueIds = new Set();

    /* =====================================================
       1️⃣ DESIGN ASSIGNED BASE
    ===================================================== */
    const assigned = await DesignAssigned.find({
      assigned_by: userId,
      is_active: true,
    }).select("_id");

    assigned.forEach((doc) => uniqueIds.add(doc._id.toString()));

    /* =====================================================
       2️⃣ DESIGN OPTIONS (Version Started)
    ===================================================== */
    const optionsStage1 = await DesignOptionsModel.find({
      is_version_started: true,
      mark_as_mockup_started: false,
      is_active: true,
    }).select("design_assigned_id");

    optionsStage1.forEach((doc) =>
      uniqueIds.add(doc.design_assigned_id.toString()),
    );

    /* =====================================================
       3️⃣ MOCKUP UPLOADED
    ===================================================== */
    const optionsStage2 = await DesignOptionsModel.find({
      mark_as_mockup_started: true,
      mockup_uploaded: true,
      is_active: true,
    }).select("_id");

    const optionIds = optionsStage2.map((doc) => doc._id);

    /* =====================================================
       4️⃣ MOCKUP VERSION CHECK
    ===================================================== */
    const mockups = await DesignMockupVersionModel.find({
      design_option_id: { $in: optionIds },
      is_active: true,
      mark_as_measurement_started: false,
      $expr: { $gte: [{ $size: "$designmockupVersion" }, 2] },
    }).select("design_assigned_id");

    mockups.forEach((doc) => uniqueIds.add(doc.design_assigned_id.toString()));

    /* =====================================================
       5️⃣ MEASUREMENT STARTED
    ===================================================== */
    const measurementStartedMockups = await DesignMockupVersionModel.find({
      mark_as_measurement_started: true,
      measurement_uploaded: true,
      is_active: true,
    }).select("_id");

    const mockupIds = measurementStartedMockups.map((doc) => doc._id);

    /* =====================================================
       6️⃣ MEASUREMENT VERSION CHECK
    ===================================================== */
    const measurementVersions = await DesignMeasurementVersion.find({
      design_mockup_id: { $in: mockupIds },
      is_active: true,
      mark_as_design_review_started: false,
      $expr: { $gte: [{ $size: "$designmeasurementVersion" }, 2] },
    }).select("design_assigned_id");

    measurementVersions.forEach((doc) =>
      uniqueIds.add(doc.design_assigned_id.toString()),
    );

    return res.status(200).json({
      success: true,
      under_modification_count: uniqueIds.size,
    });
  } catch (error) {
    next(error instanceof ApiError ? error : new ApiError(500, error.message));
  }
};
