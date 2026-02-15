import mongoose from "mongoose";
import ApiError from "../../../../utils/master/ApiError.js";
import { DesignOptionsModel } from "../../models/common_schema/designOptions.model.js";

import DesignEventLog from "../../models/common_schema/EventsLogs.model.js";
import { DesignAssigned } from "../../models/executive/designAssigned.base.model.js";
import designOptionVersionModel from "../../models/common_schema/optionsVersions.model.js";
import DesignRequested from "../../models/manager/designRequested.model.js";
import {
  deleteFile,
  deleteLocalFile,
  uploadFiles,
} from "../../../../utils/master/cloudinary.js";

// get manager pending design option
export const getManagerPendingDesignOptions = async (req, res, next) => {
  try {
    const managerId = req.user?._id;

    if (!managerId || !mongoose.Types.ObjectId.isValid(managerId)) {
      return next(new ApiError(401, "Invalid manager id"));
    }

    /* ---------------------------------
     * STEP 1: FIND DESIGN ASSIGNED IDS
     * --------------------------------- */
    const assignedRecords = await DesignAssigned.find(
      {
        assigned_by: managerId,
        assignment_type: "executive",
        mark_as_mockup_started: false,
        design_option_uploaded: true,
        is_active: true,
      },
      { _id: 1 }, // only _id needed
    ).lean();

    if (!assignedRecords.length) {
      return res.status(200).json({
        success: true,
        message: "No pending design options for manager",
        data: [],
      });
    }

    const designAssignedIds = assignedRecords.map((item) => item._id);

    /* ---------------------------------
     * STEP 2: FIND DESIGN OPTIONS
     * --------------------------------- */
    const designOptions = await DesignOptionsModel.find({
      design_assigned_id: { $in: designAssignedIds },
      is_version_started: false,
      is_active: true,
      "approval_panel.send_to_manager": true,
      "approval_panel.manager_status": "PENDING_BY_MANAGER",
    })
      .populate({
        path: "design_request_id",
        select: "_id product_id",
      })
      .populate({
        path: "design_assigned_id",
        select: "_id assigned_to priority_number deadline",
      })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: designOptions.length,
      message: "Manager pending design options fetched successfully",
      data: designOptions,
    });
  } catch (error) {
    return next(new ApiError(500, error.message));
  }
};

export const managerDesignOptionAction = async (req, res, next) => {
  const uploadedFiles = [];
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const managerId = req.user?._id;
    const role = req.user?.designation?.title || "manager";

    const {
      design_option_model_id,
      selected_design_option_item_id,
      action, // APPROVED | MODIFICATION | REJECTED
      remark,
    } = req.body;

    if (!design_option_model_id || !action) {
      return next(new ApiError(400, "design_option_id & action are required"));
    }

    if (!mongoose.Types.ObjectId.isValid(design_option_model_id)) {
      return next(new ApiError(400, "Invalid design_option_id"));
    }

    /* ---------------------------------
     * FIND DESIGN OPTION
     * --------------------------------- */
    const designOption = await DesignOptionsModel.findOne(
      {
        _id: design_option_model_id,
        is_active: true,
        "approval_panel.send_to_manager": true,
        "approval_panel.manager_status": "PENDING_BY_MANAGER",
      },
      null,
      { session },
    );

    if (!designOption) {
      return next(
        new ApiError(404, "No pending design option found for manager"),
      );
    }

    /* ---------------------------------
     * VALIDATE ACTION
     * --------------------------------- */
    const actionMap = {
      APPROVED: "APPROVED_BY_MANAGER",
      MODIFICATION: "MODIFICATION_BY_MANAGER",
      REJECTED: "REJECTED_BY_MANAGER",
    };

    const managerStatus = actionMap[action.toUpperCase()];

    if (!managerStatus) {
      return next(new ApiError(400, "Invalid action type"));
    }

    if (action === "APPROVED" && !selected_design_option_item_id) {
      return next(
        new ApiError(
          400,
          "selected_design_option_item_id required for approval",
        ),
      );
    }

    /* ---------------------------------
     * FILE UPLOAD (OPTIONAL)
     * --------------------------------- */
    let mediaArr = [];

    for (const file of req.files || []) {
      let uploaded;

      if (process.env.USE_CLOUDINARY === "true") {
        const result = await uploadFiles([file]);
        uploaded = result.files[0];
      } else {
        uploaded = {
          url: file.path.replace(/\\/g, "/"),
          public_url: null,
          public_id: null,
          name: file.originalname,
          type: file.mimetype,
        };
      }

      uploadedFiles.push(uploaded);
      mediaArr.push(uploaded);
    }

    /* ---------------------------------
     * UPDATE APPROVAL PANEL
     * --------------------------------- */
    designOption.approval_panel.manager_status = managerStatus;
    designOption.approval_panel.manager_remark = remark || "";
    designOption.approval_panel.manager_media = mediaArr;
    designOption.approval_panel.manager_action_at = new Date();
    designOption.approval_panel.design_option_id =
      selected_design_option_item_id;

    await designOption.save({ session });

    // .......................tracker.......................
    const designRequest = await DesignRequested.findById(
      designOption.design_request_id,
      { product_id: 1 },
      { session },
    );

    if (!designRequest) {
      throw new ApiError(404, "Design request not found");
    }

    const trackerMap = {
      APPROVED: {
        action_type: "design_option_approved_by_manager",
        message: "Design option approved by manager",
      },
      MODIFICATION: {
        action_type: "design_option_modification_by_manager",
        message: "Manager requested modification on design option",
      },
      REJECTED: {
        action_type: "design_option_rejected_by_manager",
        message: "Design option rejected by manager",
      },
    };

    const trackerData = trackerMap[action.toUpperCase()];

    await DesignEventLog.findOneAndUpdate(
      {
        design_id: designOption.design_request_id,
        product_id: designRequest.product_id,
      },
      {
        $push: {
          events: {
            performed_by: managerId,
            performed_role: role,
            action_type: trackerData.action_type,
            message: trackerData.message,
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

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: `Design option ${action.toLowerCase()} by manager successfully`,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    /* ---------- ROLLBACK FILES ---------- */
    for (const file of uploadedFiles) {
      try {
        if (file?.public_id) await deleteFile(file.public_id);
        if (file?.url) await deleteLocalFile(file.url);
      } catch {}
    }

    return next(new ApiError(500, error.message));
  }
};

// get manager pending design option version
export const getManagerPendingDesignOptionVersion = async (req, res, next) => {
  try {
    const managerId = req.user?._id;

    if (!managerId || !mongoose.Types.ObjectId.isValid(managerId)) {
      return next(new ApiError(401, "Invalid manager id"));
    }

    /* ---------------------------------
     * STEP 1: FIND DESIGN ASSIGNED IDS
     * --------------------------------- */
    const assignedRecords = await DesignAssigned.find(
      {
        assigned_by: managerId,
        assignment_type: "executive",
        mark_as_mockup_started: false,
        design_option_uploaded: true,
        is_active: true,
      },
      { _id: 1 }, // only _id needed
    ).lean();

    if (!assignedRecords.length) {
      return res.status(200).json({
        success: true,
        message: "No pending design options for manager",
        data: [],
      });
    }

    const designAssignedIds = assignedRecords.map((item) => item._id);

    /* ---------------------------------
     * STEP 2:  BASE DESIGN OPTIONS (VERSION STARTED)
     * --------------------------------- */
    const baseDesignOptions = await DesignOptionsModel.find(
      {
        design_assigned_id: { $in: designAssignedIds },
        is_version_started: true,
        is_active: true,
      },
      { _id: 1, design_request_id: 1, design_assigned_id: 1 },
    ).lean();

    if (!baseDesignOptions.length) {
      return res.api(200, "No design option versions found", []);
    }

    const designOptionIds = baseDesignOptions.map((d) => d._id);

    /* ---------------------------------
     * STEP 3: FIND LATEST VERSION WITH PENDING MANAGER
     * --------------------------------- */
    const versions = await designOptionVersionModel.aggregate([
      {
        $match: {
          design_option_id: { $in: designOptionIds },
        },
      },

      // take last (latest) version only
      {
        $addFields: {
          latest_version: {
            $arrayElemAt: ["$design_option_versions", -1],
          },
        },
      },

      // manager pending only
      {
        $match: {
          "latest_version.approval_panel.manager_status": "PENDING_BY_MANAGER",
        },
      },

      // optional lookup (nice for frontend)
      {
        $lookup: {
          from: "designoptionsmodels",
          localField: "design_option_id",
          foreignField: "_id",
          as: "design_option",
        },
      },
      { $unwind: "$design_option" },

      {
        $project: {
          design_option_id: 1,
          design_option_selected_id: 1,
          latest_version: 1,
          "design_option.design_request_id": 1,
          "design_option.design_assigned_id": 1,
        },
      },

      { $sort: { "latest_version.created_at": -1 } },
    ]);

    return res.status(200).json({
      success: true,
      message: "Manager pending design option versions fetched successfully",
      count: versions.length,
      data: versions,
    });
  } catch (error) {
    return next(new ApiError(500, error.message));
  }
};

export const managerActionOnDesignOptionVersion = async (req, res, next) => {
  const uploadedFiles = [];

  try {
    const managerId = req.user?._id;
    const role = req.user?.designation?.title || "manager";

    const {
      design_option_version_id,
      action, // APPROVED | MODIFICATION | REJECTED
      manager_remark = "",
    } = req.body;

    /* ---------------- VALIDATION ---------------- */
    if (
      !managerId ||
      !mongoose.Types.ObjectId.isValid(managerId) ||
      !mongoose.Types.ObjectId.isValid(design_option_version_id)
    ) {
      return next(new ApiError(400, "Invalid manager or version id"));
    }

    const actionMap = {
      APPROVED: "APPROVED_BY_MANAGER",
      MODIFICATION: "MODIFICATION_BY_MANAGER",
      REJECTED: "REJECTED_BY_MANAGER",
    };

    const managerStatus = actionMap[action?.toUpperCase()];

    if (!managerStatus) {
      return next(new ApiError(400, "Invalid action type"));
    }

    /* ---------------- FIND VERSION DOC ---------------- */
    const versionDoc = await designOptionVersionModel.findById(
      design_option_version_id,
    );

    if (!versionDoc || !versionDoc.design_option_versions.length) {
      return next(new ApiError(404, "Design option version not found"));
    }

    const versions = versionDoc.design_option_versions;
    const latestIndex = versions.length - 1;
    const latestVersion = versions[latestIndex];

    /* ---------------- STATE CHECK ---------------- */
    if (latestVersion.approval_panel.manager_status !== "PENDING_BY_MANAGER") {
      return next(
        new ApiError(400, "Manager action already taken on this version"),
      );
    }

    /* ---------------- FILE UPLOAD (OPTIONAL) ---------------- */
    let mediaArr = [];

    for (const file of req.files || []) {
      let uploaded;

      if (process.env.USE_CLOUDINARY === "true") {
        const result = await uploadFiles([file]);

        if (!result?.success || !result?.files?.[0]) {
          throw new ApiError(400, "Media upload failed");
        }

        uploaded = result.files[0];
      } else {
        uploaded = {
          url: file.path?.replace(/\\/g, "/"),
          public_url: null,
          public_id: null,
          name: file.originalname,
          type: file.mimetype,
        };
      }

      uploadedFiles.push(uploaded);
      mediaArr.push(uploaded);
    }

    /* ---------------- UPDATE LATEST VERSION ---------------- */
    latestVersion.approval_panel.manager_status = managerStatus;
    latestVersion.approval_panel.manager_remark = manager_remark;
    latestVersion.approval_panel.manager_media = mediaArr;
    latestVersion.approval_panel.manager_action_at = new Date();

    await versionDoc.save();

    /* ---------------- TRACKER ---------------- */
    // 1️⃣ FIND DESIGN OPTION (ROOT DOCUMENT)
    const designOption = await DesignOptionsModel.findById(
      versionDoc.design_option_id,
      { design_request_id: 1 },
    );

    if (!designOption) {
      throw new ApiError(404, "Design option not found");
    }

    // 2️⃣ FIND DESIGN REQUEST (FOR PRODUCT ID)
    const designRequest = await DesignRequested.findById(
      designOption.design_request_id,
      { product_id: 1 },
    );

    if (!designRequest) {
      throw new ApiError(404, "Design request not found");
    }

    const trackerMap = {
      APPROVED: {
        action_type: "design_option_version_approved_by_manager",
        message: "Design option version approved by manager",
      },
      MODIFICATION: {
        action_type: "design_option_version_modification_by_manager",
        message: "Manager requested modification on design option version",
      },
      REJECTED: {
        action_type: "design_option_version_rejected_by_manager",
        message: "Design option version rejected by manager",
      },
    };

    const trackerData = trackerMap[action.toUpperCase()];

    // 4️⃣ PUSH EVENT
    await DesignEventLog.findOneAndUpdate(
      {
        design_id: designOption.design_request_id,
        product_id: designRequest.product_id,
      },
      {
        $push: {
          events: {
            performed_by: managerId,
            performed_role: role,
            action_type: trackerData.action_type,
            message: trackerData.message,
          },
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );

    /* ---------------- RESPONSE ---------------- */
    return res.status(200).json({
      success: true,
      message: `Design option version ${managerStatus.replaceAll("_", " ")} successfully`,
      design_option_version_id,
      latest_version: latestVersion,
    });
  } catch (error) {
    /* ---------------- ROLLBACK FILES ---------------- */
    for (const file of uploadedFiles) {
      try {
        if (file?.public_id) await deleteFile(file.public_id);
        if (file?.url) await deleteLocalFile(file.url);
      } catch {}
    }

    console.error("Manager Version Action Error:", error);
    return next(new ApiError(500, error.message));
  }
};
