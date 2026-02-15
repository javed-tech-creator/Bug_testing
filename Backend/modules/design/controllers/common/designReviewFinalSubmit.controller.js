import mongoose from "mongoose";
import { DesignMeasurementVersion } from "../../models/common_schema/designMeasurementVersion.model.js";
import { MeasurementSubmission } from "../../models/common_schema/designReportFinalSubmit.model.js";
import ApiError from "../../../../utils/master/ApiError.js";
import { DesignAssigned } from "../../models/executive/designAssigned.base.model.js";

/* =====================================================
   SUBMIT MEASUREMENT REVIEW (EXECUTIVE / MANAGER)
===================================================== */
export const submitMeasurementReview = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const role = req.user?.designation?.title?.toLowerCase(); // manager | executive

    const {
      measurement_version_id,
      checklist = [],
      declaration = true,
      feedback = {},
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(measurement_version_id)) {
      throw new ApiError(400, "Invalid measurement_version_id");
    }

    if (!["manager", "executive"].includes(role)) {
      throw new ApiError(403, "Unauthorized role");
    }

    /* =====================================================
       STEP 1: FIND MEASUREMENT VERSION
    ===================================================== */
    const measurementVersion = await DesignMeasurementVersion.findOne({
      _id: measurement_version_id,
      is_active: true,
    });

    if (!measurementVersion) {
      throw new ApiError(404, "Measurement version not found");
    }

    /* =====================================================
       STEP 2: UPDATE MEASUREMENT VERSION
    ===================================================== */
    if (!measurementVersion.mark_as_design_review_started) {
      measurementVersion.mark_as_design_review_started = true;
      measurementVersion.design_review_started_at = new Date();
      await measurementVersion.save();
    }

    /* =====================================================
       STEP 3: UPDATE DESIGN ASSIGNED
    ===================================================== */
    await DesignAssigned.updateOne(
      {
        _id: measurementVersion.design_assigned_id,
        is_active: true,
      },
      {
        $set: {
          mark_as_design_review_started: true,
          design_review_started_at: new Date(),
        },
      },
    );

    /* =====================================================
       STEP 4: FIND OR CREATE SUBMISSION
    ===================================================== */
    let submission = await MeasurementSubmission.findOne({
      measurement_quotation_id: measurement_version_id,
      is_active: true,
    });

    if (!submission) {
      submission = new MeasurementSubmission({
        measurement_quotation_id: measurement_version_id,
      });
    }

    /* =====================================================
       STEP 5: EXECUTIVE FLOW
    ===================================================== */
    if (role === "executive") {
      if (!declaration) {
        throw new ApiError(400, "Declaration is required");
      }

      submission.executive_submission = {
        checklist,
        declaration: true,
        submitted_by: userId,
        submitted_at: new Date(),
      };

      submission.workflow_status = "SUBMITTED_BY_EXECUTIVE";

      await submission.save();

      return res.status(200).json({
        success: true,
        role: "executive",
        message: "Measurement submitted by executive",
        data: submission,
      });
    }

    /* =====================================================
       STEP 6: MANAGER FLOW
    ===================================================== */
    if (role === "manager") {
      if (!declaration) {
        throw new ApiError(400, "Declaration is required");
      }

      submission.manager_submission = {
        checklist,
        declaration: true,
        feedback: {
          rating: feedback?.rating ?? null,
          final_decision: feedback?.final_decision ?? "approve",
          remark: feedback?.remark ?? "",
        },
        submitted_by: userId,
        submitted_at: new Date(),
      };

      submission.workflow_status =
        feedback?.final_decision === "flag"
          ? "FLAGGED_BY_MANAGER"
          : "APPROVED_BY_MANAGER";

      await submission.save();

      return res.status(200).json({
        success: true,
        role: "manager",
        message: "Measurement reviewed by manager",
        data: submission,
      });
    }
  } catch (error) {
    next(error instanceof ApiError ? error : new ApiError(500, error.message));
  }
};

export const getManagerPendingMeasurementReviews = async (req, res, next) => {
  try {
    const managerId = req.user?._id.toString();

    if (!managerId) {
      throw new ApiError(401, "Unauthorized");
    }

    /* =====================================================
       STEP 1: DESIGN ASSIGNED IDS
    ===================================================== */
    const assignedList = await DesignAssigned.find(
      {
        assigned_by: managerId,
        is_active: true,
        work_status: "on_track",
        mark_as_design_review_started: true,
      },
      { _id: 1 },
    ).lean();

    const assignedIds = assignedList.map((i) => i._id);

    if (!assignedIds.length) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No pending measurement reviews",
      });
    }

    /* =====================================================
       STEP 2: MEASUREMENT VERSION IDS
    ===================================================== */
    const measurementVersions = await DesignMeasurementVersion.find(
      {
        design_assigned_id: { $in: assignedIds },
        is_active: true,
        mark_as_design_review_started: true,
      },
      { _id: 1 },
    ).lean();

    const measurementVersionIds = measurementVersions.map((i) => i._id);

    if (!measurementVersionIds.length) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No measurement versions found",
      });
    }

    /* =====================================================
       STEP 3: MEASUREMENT SUBMISSIONS
    ===================================================== */
    const submissions = await MeasurementSubmission.find({
      measurement_quotation_id: { $in: measurementVersionIds },
      workflow_status: "SUBMITTED_BY_EXECUTIVE",
      is_active: true,
      "send_to_quotation.is_sent": false,
    })
      .populate({
        path: "measurement_quotation_id",
        select: "design_request_id design_assigned_id createdAt",
      })
      .populate({
        path: "executive_submission.submitted_by",
        select: "name email",
      })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (error) {
    next(error instanceof ApiError ? error : new ApiError(500, error.message));
  }
};

export const managerSubmitMeasurementReview = async (req, res, next) => {
  try {
    const managerId = req.user?._id.toString();
    const role = req.user?.designation?.title?.toLowerCase();

    if (!managerId || role !== "manager") {
      throw new ApiError(403, "Only manager can perform this action");
    }

    const {
      measurement_submission_id,
      checklist = [],
      declaration = false,
      feedback = {},
      design_option_remark = {},
      design_option_modification_remark = {},
      design_mockup_remark = {},
      design_measurement_remark = {},
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(measurement_submission_id)) {
      throw new ApiError(400, "Invalid measurement_submission_id");
    }

    if (!declaration) {
      throw new ApiError(400, "Declaration is required");
    }

    /* =====================================================
       FIND SUBMISSION
    ===================================================== */
    const submission = await MeasurementSubmission.findOne({
      _id: measurement_submission_id,
      is_active: true,
    });

    if (!submission) {
      throw new ApiError(404, "Measurement submission not found");
    }

    if (submission.workflow_status !== "SUBMITTED_BY_EXECUTIVE") {
      throw new ApiError(
        400,
        "Measurement is not pending for manager approval",
      );
    }

    /* =====================================================
       MANAGER SUBMISSION UPDATE
    ===================================================== */
    submission.manager_submission = {
      design_option_remark,
      design_option_modification_remark,
      design_mockup_remark,
      design_measurement_remark,
      checklist,
      declaration: true,
      feedback: {
        rating: feedback?.rating ?? null,
        final_decision: feedback?.final_decision ?? "approve",
        remark: feedback?.remark ?? "",
      },
      submitted_by: managerId,
      submitted_at: new Date(),
    };

    submission.workflow_status =
      feedback?.final_decision === "flag"
        ? "FLAGGED_BY_MANAGER"
        : "APPROVED_BY_MANAGER";

    await submission.save();

    return res.status(200).json({
      success: true,
      message:
        submission.workflow_status === "APPROVED_BY_MANAGER"
          ? "Measurement approved successfully"
          : "Measurement flagged for correction",
      data: submission,
    });
  } catch (error) {
    next(error instanceof ApiError ? error : new ApiError(500, error.message));
  }
};

export const getApprovedMeasurementsListForManager = async (req, res, next) => {
  try {
    const managerId = req.user?._id.toString();
    const role = req.user?.designation?.title?.toLowerCase();

    if (!managerId || role !== "manager") {
      throw new ApiError(403, "Only manager can access this list");
    }

    /* =====================================================
       PAGINATION
    ===================================================== */
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    /* =====================================================
       FILTER
    ===================================================== */
    const filter = {
      is_active: true,
      workflow_status: "APPROVED_BY_MANAGER",
      "manager_submission.feedback.final_decision": "approve",
    };

    /* =====================================================
       QUERY
    ===================================================== */
    const [list, total] = await Promise.all([
      MeasurementSubmission.find(filter)
        .populate({
          path: "measurement_quotation_id",
          select: "design_request_id design_assigned_id uploaded_by createdAt",
          populate: {
            path: "design_assigned_id",
            select: "assigned_to assigned_by branch_id",
          },
        })
        .populate({
          path: "executive_submission.submitted_by",
          select: "name email",
        })
        .populate({
          path: "manager_submission.submitted_by",
          select: "name email",
        })
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      MeasurementSubmission.countDocuments(filter),
    ]);

    /* =====================================================
       RESPONSE
    ===================================================== */
    return res.status(200).json({
      success: true,
      message: "Approved measurement list fetched successfully",
      meta: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
      data: list,
    });
  } catch (error) {
    next(error instanceof ApiError ? error : new ApiError(500, error.message));
  }
};

export const managerSendToQuotation = async (req, res, next) => {
  try {
    const managerId = req.user?._id?.toString();
    const role = req.user?.designation?.title?.toLowerCase();

    if (!managerId || role !== "manager") {
      throw new ApiError(403, "Only manager can perform this action");
    }

    const { measurement_submission_id, remark = "" } = req.body;

    if (!mongoose.Types.ObjectId.isValid(measurement_submission_id)) {
      throw new ApiError(400, "Invalid measurement submission id");
    }

    /* =====================================================
       FIND SUBMISSION
    ===================================================== */
    const submission = await MeasurementSubmission.findOne({
      _id: measurement_submission_id,
      is_active: true,
    });

    if (!submission) {
      throw new ApiError(404, "Measurement submission not found");
    }

    /* =====================================================
       CHECK APPROVED STATUS
    ===================================================== */
    if (submission.workflow_status !== "APPROVED_BY_MANAGER") {
      throw new ApiError(
        400,
        "Only approved measurements can be sent to quotation",
      );
    }

    if (submission.send_to_quotation?.is_sent) {
      throw new ApiError(400, "Already sent to quotation department");
    }

    /* =====================================================
       UPDATE SEND TO QUOTATION
    ===================================================== */
    submission.send_to_quotation = {
      is_sent: true,
      sent_by: managerId,
      sent_at: new Date(),
      remark,
    };

    await submission.save();

    return res.status(200).json({
      success: true,
      message: "Measurement sent to quotation department successfully",
      data: submission,
    });
  } catch (error) {
    next(error instanceof ApiError ? error : new ApiError(500, error.message));
  }
};

export const getExecutiveReviewList = async (req, res, next) => {
  try {
    const executiveId = req.user?._id.toString();
    const role = req.user?.designation?.title?.toLowerCase();

    if (!executiveId || role !== "executive") {
      throw new ApiError(403, "Only executive can access this list");
    }

    /* =====================================================
       PAGINATION PARAMS
    ===================================================== */
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    /* =====================================================
       STEP 1: DESIGN ASSIGNED IDS
    ===================================================== */
    const designAssignedIds = await DesignAssigned.find({
      assigned_to: executiveId,
      mark_as_design_review_started: true,
    }).distinct("_id");

    if (!designAssignedIds.length) {
      return res.status(200).json({
        success: true,
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
        },
        data: [],
      });
    }

    /* =====================================================
       STEP 2: MEASUREMENT VERSION IDS
    ===================================================== */
    const measurementVersionIds = await DesignMeasurementVersion.find({
      design_assigned_id: { $in: designAssignedIds },
      mark_as_design_review_started: true,
    }).distinct("_id");

    if (!measurementVersionIds.length) {
      return res.status(200).json({
        success: true,
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
        },
        data: [],
      });
    }

    /* =====================================================
       STEP 3: COUNT
    ===================================================== */
    const total = await MeasurementSubmission.countDocuments({
      measurement_quotation_id: { $in: measurementVersionIds },
    });

    /* =====================================================
       STEP 4: FETCH PAGINATED DATA
    ===================================================== */
    const submissions = await MeasurementSubmission.find({
      measurement_quotation_id: { $in: measurementVersionIds },
    })
      .populate({
        path: "measurement_quotation_id",
        populate: {
          path: "design_assigned_id",
          select: "assigned_to priority_number urgency deadline",
        },
      })
      .populate("executive_submission.submitted_by")
      .populate("manager_submission.submitted_by")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      data: submissions,
    });
  } catch (error) {
    next(error instanceof ApiError ? error : new ApiError(500, error.message));
  }
};

export const executiveSubmitFeedback = async (req, res, next) => {
  try {
    const userId = req.user?._id.toString();
    const role = req.user?.designation?.title?.toLowerCase();

    if (!userId || role !== "executive") {
      throw new ApiError(403, "Only executive can submit this feedback");
    }

    const { measurement_submission_id, rating = null, remark = "" } = req.body;

    if (!mongoose.Types.ObjectId.isValid(measurement_submission_id)) {
      throw new ApiError(400, "Invalid measurement_submission_id");
    }

    /* =====================================================
       FIND SUBMISSION
    ===================================================== */
    const submission = await MeasurementSubmission.findOne({
      _id: measurement_submission_id,
    });

    if (!submission) {
      throw new ApiError(404, "Measurement submission not found");
    }

    if (
      submission.workflow_status !== "SUBMITTED_BY_EXECUTIVE" &&
      submission.workflow_status !== "DRAFT"
    ) {
      throw new ApiError(400, "Submission is not editable");
    }

    /* =====================================================
       UPDATE EXECUTIVE FIELDS
    ===================================================== */
    submission.executive_submission.rating = rating;
    submission.executive_submission.remark = remark;

    await submission.save();

    return res.status(200).json({
      success: true,
      message: "Executive rating & remark saved successfully",
      data: {
        _id: submission._id,
        rating: submission.executive_submission.rating,
        remark: submission.executive_submission.remark,
      },
    });
  } catch (error) {
    next(error instanceof ApiError ? error : new ApiError(500, error.message));
  }
};
