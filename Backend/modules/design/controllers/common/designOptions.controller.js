import mongoose from "mongoose";
import ApiError from "../../../../utils/master/ApiError.js";
import { DesignOptionsModel } from "../../models/common_schema/designOptions.model.js";
import {
  deleteFile,
  deleteLocalFile,
  uploadFiles,
} from "../../../../utils/master/cloudinary.js";
import DesignEventLog from "../../models/common_schema/EventsLogs.model.js";
import { DesignAssigned } from "../../models/executive/designAssigned.base.model.js";
import designOptionVersionModel from "../../models/common_schema/optionsVersions.model.js";
import DesignRequested from "../../models/manager/designRequested.model.js";

export const resolveSendToFlow = ({ send_to_manager, send_to_client }) => {
  const isSendToManager =
    send_to_manager === true || send_to_manager === "true";
  const isSendToClient = send_to_client === true || send_to_client === "true";

  // ❌ both true
  if (isSendToManager && isSendToClient) {
    throw new ApiError(
      400,
      "Only one of send_to_manager or send_to_client can be true",
    );
  }

  // ❌ both false
  if (!isSendToManager && !isSendToClient) {
    throw new ApiError(
      400,
      "Either send_to_manager or send_to_client must be true",
    );
  }

  return {
    send_to_manager: isSendToManager,
    send_to_manager_date: isSendToManager ? new Date() : null,

    send_to_client: isSendToClient,
    send_to_client_date: isSendToClient ? new Date() : null,
  };
};

export const createDesignOptions = async (req, res, next) => {
  const uploadedFiles = []; // 🔥 rollback ke liye
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    /* ---------------- FILE MAP (for .any()) ---------------- */
    const filesMap = {};

    for (const file of req.files || []) {
      if (!filesMap[file.fieldname]) {
        filesMap[file.fieldname] = [];
      }
      filesMap[file.fieldname].push(file);
    }

    const {
      design_request_id,
      design_assigned_id,
      designoptions,
      send_to_manager,
      send_to_client,
    } = req.body;

    const executiveId = req.user?._id?.toString();
    const role = req.user?.designation?.title || "";

    /* ---------------- BASIC VALIDATION ---------------- */
    if (!design_request_id || !design_assigned_id) {
      return next(
        new ApiError(400, "design_request_id & design_assigned_id required"),
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(design_request_id) ||
      !mongoose.Types.ObjectId.isValid(design_assigned_id)
    ) {
      return next(new ApiError(400, "Invalid ObjectId"));
    }

    /* ---------------- SEND TO VALIDATION ---------------- */
    const isSendToManager =
      send_to_manager === "true" || send_to_manager === true;
    const isSendToClient = send_to_client === "true" || send_to_client === true;

    if (isSendToManager && isSendToClient) {
      return next(
        new ApiError(
          400,
          "Only one of send_to_manager or send_to_client allowed",
        ),
      );
    }

    if (!isSendToManager && !isSendToClient) {
      return next(
        new ApiError(
          400,
          "Either send_to_manager or send_to_client must be true",
        ),
      );
    }

    /* ---------------- PARSE DESIGN OPTIONS ---------------- */
    const optionsArray =
      typeof designoptions === "string"
        ? JSON.parse(designoptions)
        : designoptions;

    if (!Array.isArray(optionsArray) || optionsArray.length === 0) {
      return next(new ApiError(400, "designoptions must be a non-empty array"));
    }

    /* ---------------- DUPLICATE CHECK ---------------- */
    const exists = await DesignOptionsModel.findOne(
      {
        design_request_id,
        design_assigned_id,
        is_active: true,
      },
      null,
      { session },
    );

    if (exists) {
      return next(new ApiError(409, "Design options already exist"));
    }

    /* ---------------- FILE UPLOAD HELPER ---------------- */
    const uploadSingleFile = async (file) => {
      let result;

      if (process.env.USE_CLOUDINARY === "true") {
        result = await uploadFiles([file]);
        if (!result?.success || !result?.files?.[0]?.url) {
          throw new ApiError(400, "File upload failed");
        }
      } else {
        const localPath = file.path?.replace(/\\/g, "/");
        result = {
          success: true,
          files: [
            {
              url: localPath,
              public_url: null,
              public_id: null,
              name: file.originalname,
              type: file.mimetype,
            },
          ],
        };
      }

      const uploaded = result.files[0];
      uploadedFiles.push(uploaded); // 🔥 rollback track
      return uploaded;
    };

    /* ---------------- PREPARE DESIGN OPTIONS ---------------- */
    const preparedDesignOptions = [];

    for (let index = 0; index < optionsArray.length; index++) {
      const item = optionsArray[index];

      /* ---- DESIGN OPTION (MANDATORY) ---- */
      const designFile = filesMap[`upload_design_option_${index}`]?.[0];
      if (!designFile) {
        throw new ApiError(400, `upload_design_option_${index} is required`);
      }

      const uploadedDesign = await uploadSingleFile(designFile);

      /* ---- SUPPORTING ASSET (OPTIONAL) ---- */
      let uploadedSupporting = null;
      const supportingFile = filesMap[`upload_supporting_asset_${index}`]?.[0];

      if (supportingFile) {
        uploadedSupporting = await uploadSingleFile(supportingFile);
      }

      /* ---- MEDIA (ARRAY OF FILES) ---- */
      let mediaArr = [];
      const mediaFiles = filesMap[`media_${index}`];

      if (Array.isArray(mediaFiles) && mediaFiles.length > 0) {
        for (const file of mediaFiles) {
          const uploadedMedia = await uploadSingleFile(file);
          mediaArr.push(uploadedMedia);
        }
      }

      preparedDesignOptions.push({
        option_number: index + 1,
        title: item.title,
        font_name: item.font_name || "",

        upload_design_option: uploadedDesign,
        upload_supporting_asset: uploadedSupporting,

        colors_name: item.colors_name || "",
        lit_colors_name: item.lit_colors_name || "",

        size_specification: {
          width_in_inch: item.size_specification?.width_in_inch ?? null,
          height_in_inch: item.size_specification?.height_in_inch ?? null,
          thickness_in_mm: item.size_specification?.thickness_in_mm ?? null,
        },

        remark: item.remark || "",
        media: mediaArr,
      });
    }

    /* ---------------- APPROVAL PANEL ---------------- */
    const approval_panel = {
      design_option_id: null,
      send_to_manager: isSendToManager,
      send_to_manager_date: isSendToManager ? new Date() : null,
      manager_status: isSendToManager ? "PENDING_BY_MANAGER" : "NA",
      send_to_client: isSendToClient,
      send_to_client_date: isSendToClient ? new Date() : null,
      client_status: isSendToClient ? "PENDING_BY_CLIENT" : "NA",
    };

    /* ---------------- CREATE DOCUMENT ---------------- */
    const doc = await DesignOptionsModel.create(
      [
        {
          design_request_id,
          design_assigned_id,
          designoptions: preparedDesignOptions,
          approval_panel,
          is_active: true,
          is_version_started: false,
        },
      ],
      { session },
    );

    const populatedDoc = await DesignOptionsModel.findById(doc[0]._id)
      .populate({
        path: "design_request_id",
        select: "_id product_id",
      })
      .session(session);

    /* ---------------- UPDATE DESIGN ASSIGNED ---------------- */
    const updatedAssigned = await DesignAssigned.findOneAndUpdate(
      {
        _id: design_assigned_id,
        design_request_id,
        is_active: true,
        mark_as_started: true,
        design_option_uploaded: false,
      },
      {
        $set: {
          design_option_uploaded: true,
          design_option_uploaded_at: new Date(),
        },
      },
      {
        new: true,
        session,
      },
    );

    if (!updatedAssigned) {
      throw new ApiError(404, "DesignAssigned record not found or inactive");
    }

    /* ---------------- Event Log PANEL ---------------- */

    await DesignEventLog.findOneAndUpdate(
      {
        design_id: populatedDoc.design_request_id._id,
        product_id: populatedDoc.design_request_id.product_id,
      },
      {
        $push: {
          events: {
            performed_by: executiveId,
            performed_role: role,
            action_type: "design_options_Uploaded",
            message: `${role} uploaded design options`,
            created_at: new Date(),
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

    return res.status(201).json({
      success: true,
      message: "Design options created successfully",
      data: doc[0],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    /* ---------------- ROLLBACK ---------------- */
    for (const file of uploadedFiles) {
      try {
        if (file?.public_id) await deleteFile(file.public_id);
        if (file?.url) await deleteLocalFile(file.url);
      } catch {
        // ignore rollback errors
      }
    }

    return next(new ApiError(500, error.message));
  }
};

export const getUploadedDesignOptions = async (req, res, next) => {
  try {
    const userId = req.user?._id?.toString();
    const branchId = req.user?.branch?._id?.toString();
    const role = req.user?.designation?.title?.toLowerCase() || "";

    const assignmentType = role === "manager" ? "self" : "executive";

    /* ---------------- FIND DESIGN ASSIGNED IDS ---------------- */
    const assignedList = await DesignAssigned.find(
      {
        assigned_to: userId,
        branch_id: branchId,
        is_active: true,
        design_option_uploaded: true,
        assignment_type: assignmentType,
      },
      { _id: 1 },
    );

    if (!assignedList.length) {
      return res.status(200).json({
        success: true,
        message: "No design options found",
        data: [],
      });
    }

    const assignedIds = assignedList.map((d) => d._id);

    /* ---------------- FETCH DESIGN OPTIONS ---------------- */
    const designOptionsDocs = await DesignOptionsModel.find({
      design_assigned_id: { $in: assignedIds },
      is_active: true,
      mark_as_mockup_started: false,
    })
      .populate({
        path: "design_assigned_id",
      })
      .sort({ createdAt: -1 })
      .lean();

    /* ---------------- HANDLE VERSION LOGIC + STATUS ---------------- */
    const finalResponse = [];

    for (const doc of designOptionsDocs) {
      // 🟢 DEFAULT STATUS (from DesignOptionsModel)
      let managerStatus = doc.approval_panel?.manager_status || "NA";
      let managerActionAt = doc.approval_panel?.manager_action_at || null;
      let clientStatus = doc.approval_panel?.client_status || "NA";
      let clientActionAt = doc.approval_panel?.client_action_at || null;

      let selectedDesignOption = null;

      // 🔵 IF VERSION STARTED
      if (doc.is_version_started) {
        const versionDoc = await designOptionVersionModel
          .findOne({ design_option_id: doc._id })
          .lean();

        if (versionDoc && versionDoc.design_option_versions.length > 0) {
          // ✅ Latest version
          const latestVersion =
            versionDoc.design_option_versions[
              versionDoc.design_option_versions.length - 1
            ];

          // 🔥 STATUS FROM VERSION
          managerStatus = latestVersion.approval_panel?.manager_status || "NA";
          managerActionAt =
            latestVersion.approval_panel?.manager_action_at || null;
          clientStatus = latestVersion.approval_panel?.client_status || "NA";
          clientActionAt =
            latestVersion.approval_panel?.client_action_at || null;

          // 🔎 Selected design option from main model
          const selectedId = versionDoc.design_option_selected_id?.toString();

          selectedDesignOption =
            doc.designoptions.find(
              (opt) => opt._id?.toString() === selectedId,
            ) || null;
        }
      }

      finalResponse.push({
        ...doc,

        // 🔥 Unified approval status
        approval_status: {
          manager_status: managerStatus,
          manager_action_at: managerActionAt,
          client_status: clientStatus,
          client_action_at: clientActionAt,
        },

        // 🔥 Selected option (only when version exists)
        selected_design_option: selectedDesignOption,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Design options fetched successfully",
      data: finalResponse, // ✅ FIXED
    });
  } catch (error) {
    return next(new ApiError(500, error.message));
  }
};

export const getUploadedDesignOptionsForModificationView = async (
  req,
  res,
  next,
) => {
  try {
    const { id: design_option_id } = req.params;

    if (!design_option_id) {
      return res.status(400).json({
        success: false,
        message: "design_option_id is required",
      });
    }

    /* ---------------- FIND DESIGN OPTION ---------------- */
    const designOptionDoc = await DesignOptionsModel.findById(design_option_id)
      .populate({
        path: "design_request_id",
        populate: {
          path: "product_id",
        },
      })
      .lean();

    if (!designOptionDoc) {
      return res.status(404).json({
        success: false,
        message: "Design option not found",
      });
    }

    /* ---------------- DEFAULT STATUS ---------------- */
    let managerStatus = designOptionDoc.approval_panel?.manager_status || "NA";
    managerRemark = designOptionDoc.approval_panel?.manager_remark || "";
    managerMedia = designOptionDoc.approval_panel?.manager_media || [];
    let managerActionAt =
      designOptionDoc.approval_panel?.manager_action_at || null;

    let clientStatus = designOptionDoc.approval_panel?.client_status || "NA";
    clientRemark = designOptionDoc.approval_panel?.manager_remark || "";
    clientMedia = designOptionDoc.approval_panel?.manager_media || [];
    let clientActionAt =
      designOptionDoc.approval_panel?.client_action_at || null;

    let selectedDesignOption = null;
    let latestVersion = null;

    /* ---------------- VERSION LOGIC ---------------- */
    if (designOptionDoc.is_version_started) {
      const versionDoc = await designOptionVersionModel
        .findOne({ design_option_id })
        .lean();

      if (versionDoc && versionDoc.design_option_versions.length > 0) {
        // ✅ latest version
        latestVersion =
          versionDoc.design_option_versions[
            versionDoc.design_option_versions.length - 1
          ];

        // 🔥 override status from version
        managerStatus = latestVersion.approval_panel?.manager_status || "NA";
        managerRemark = latestVersion.approval_panel?.manager_remark || "";
        managerMedia = latestVersion.approval_panel?.manager_media || [];
        managerActionAt =
          latestVersion.approval_panel?.manager_action_at || null;

        clientStatus = latestVersion.approval_panel?.client_status || "NA";
        clientRemark = latestVersion.approval_panel?.manager_remark || "";
        clientMedia = latestVersion.approval_panel?.manager_media || [];
        clientActionAt = latestVersion.approval_panel?.client_action_at || null;

        // 🔎 selected design option
        const selectedId = versionDoc.design_option_selected_id?.toString();

        selectedDesignOption =
          designOptionDoc.designoptions.find(
            (opt) => opt._id?.toString() === selectedId,
          ) || null;
      }
    }

    /* ---------------- FINAL RESPONSE ---------------- */
    return res.status(200).json({
      success: true,
      message: "Design option details fetched successfully",
      data: {
        design_option_id: designOptionDoc._id,

        design_request_id: designOptionDoc.design_request_id, // populated
        design_assigned_id: designOptionDoc.design_assigned_id,

        approval_status: {
          manager_status: managerStatus,
          manager_remark: managerRemark,
          manager_media: managerMedia,
          manager_action_at: managerActionAt,
          client_status: clientStatus,
          client_remark: clientRemark,
          client_media: clientMedia,
          client_action_at: clientActionAt,
        },

        selected_design_option: selectedDesignOption, // ✅
        latest_version: latestVersion, // ✅

        is_version_started: designOptionDoc.is_version_started,
      },
    });
  } catch (error) {
    return next(new ApiError(500, error.message));
  }
};

export const createOrPushDesignOptionVersion = async (req, res, next) => {
  const uploadedFiles = []; // 🔥 rollback ke liye
  let isFirstVersionCreated = false;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    /* ---------------- FILE MAP (for .any()) ---------------- */
    const filesMap = {};
    for (const file of req.files || []) {
      if (!filesMap[file.fieldname]) {
        filesMap[file.fieldname] = [];
      }
      filesMap[file.fieldname].push(file);
    }

    const { design_option_id, design_option_selected_id, version_payload } =
      req.body;
    const userId = req.user?._id?.toString();
    const role = req.user?.designation?.title?.toLowerCase() || "";

    if (!design_option_id || !design_option_selected_id) {
      return next(
        new ApiError(
          400,
          "design_option_id & design_option_selected_id required",
        ),
      );
    }

    /* ---------------- FILE UPLOAD HELPER ---------------- */
    const uploadSingleFile = async (file) => {
      let result;

      if (process.env.USE_CLOUDINARY === "true") {
        result = await uploadFiles([file]);
        if (!result?.success || !result?.files?.[0]?.url) {
          return next(new ApiError(400, "File upload failed"));
        }
      } else {
        const localPath = file.path?.replace(/\\/g, "/");
        result = {
          success: true,
          files: [
            {
              url: localPath,
              public_url: null,
              public_id: null,
              name: file.originalname,
              type: file.mimetype,
            },
          ],
        };
      }

      const uploaded = result.files[0];
      uploadedFiles.push(uploaded); // 🔥 rollback track
      return uploaded;
    };

    /* ---------------- FIND DESIGN OPTION ---------------- */
    const designOption =
      await DesignOptionsModel.findById(design_option_id).session(session);

    if (!designOption) {
      return next(new ApiError(404, "Design option not found"));
    }

    /* ---------------- BASE VERSION OBJECT ---------------- */
    const sendFlow = resolveSendToFlow({
      send_to_manager: version_payload.send_to_manager,
      send_to_client: version_payload.send_to_client,
    });

    /* ---------------- FILE HANDLING ---------------- */
    let uploadedDesign = null;
    let uploadedSupporting = null;
    let mediaArr = [];

    const designFile = filesMap["upload_design_option"]?.[0];
    if (designFile) {
      uploadedDesign = await uploadSingleFile(designFile);
    }

    const supportingFile = filesMap["upload_supporting_asset"]?.[0];
    if (supportingFile) {
      uploadedSupporting = await uploadSingleFile(supportingFile);
    }

    const mediaFiles = filesMap["media"];
    if (Array.isArray(mediaFiles)) {
      for (const file of mediaFiles) {
        const uploadedMedia = await uploadSingleFile(file);
        mediaArr.push(uploadedMedia);
      }
    }

    const baseVersionItem = {
      ...sendFlow,

      title: version_payload.title,
      font_name: version_payload.font_name || "",
      upload_design_option: uploadedDesign,
      upload_supporting_asset: uploadedSupporting,
      colors_name: version_payload.colors_name || "",
      lit_colors_name: version_payload.lit_colors_name || "",
      size_specification: version_payload.size_specification || {},
      remark: version_payload.remark || "",
      media: mediaArr,

      approval_panel: {
        manager_status: sendFlow.send_to_manager ? "PENDING_BY_MANAGER" : "NA",
        manager_remark: "",
        manager_media: [],
        manager_action_at: null,

        client_status: sendFlow.send_to_client ? "PENDING_BY_CLIENT" : "NA",
        client_remark: "",
        client_media: [],
        client_action_at: null,
      },
    };

    /* ---------------- CASE 1: VERSION ALREADY EXISTS ---------------- */
    if (designOption.is_version_started) {
      const versionDoc = await designOptionVersionModel
        .findOne({ design_option_id })
        .session(session);

      if (!versionDoc) {
        return next(
          new ApiError(500, "Version started but version document missing"),
        );
      }

      const newVersionItem = {
        ...baseVersionItem,
        version_number: versionDoc.design_option_versions.length + 1,
      };

      versionDoc.design_option_selected_id = design_option_selected_id;

      versionDoc.design_option_versions.push(newVersionItem);

      await versionDoc.save({ session });
    } else {
      /* ---------------- CASE 2: FIRST TIME VERSION ---------------- */
      const firstVersionItem = {
        ...baseVersionItem,
        version_number: 1,
      };

      await designOptionVersionModel.create(
        [
          {
            design_option_id,
            design_option_selected_id,
            design_option_versions: [firstVersionItem],
          },
        ],
        { session },
      );

      designOption.is_version_started = true;
      await designOption.save({ session });

      isFirstVersionCreated = true;
    }

    /* ---------------- EVENT LOG PANEL ---------------- */
    const designRequest = await DesignRequested.findById(
      designOption.design_request_id,
      { _id: 1, product_id: 1 },
    ).session(session);

    if (!designRequest) {
      return next(new ApiError(404, "Design request not found for event log"));
    }

    const actionType = isFirstVersionCreated
      ? "design_option_version_created"
      : "design_option_version_updated";

    const message = isFirstVersionCreated
      ? `${role} created first design option version`
      : `${role} added a new version to existing design option`;

    await DesignEventLog.findOneAndUpdate(
      {
        design_id: designRequest._id,
        product_id: designRequest.product_id,
      },
      {
        $push: {
          events: {
            performed_by: userId,
            performed_role: role,
            action_type: actionType,
            message,
            created_at: new Date(),
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
      message: "Design option version processed successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    /* ---------------- ROLLBACK ---------------- */
    for (const file of uploadedFiles) {
      try {
        if (file?.public_id) await deleteFile(file.public_id);
        if (file?.url) await deleteLocalFile(file.url);
      } catch {
        // ignore rollback errors
      }
    }

    return next(new ApiError(500, error.message));
  }
};

// manager get list for design option approval & design option version approval
export const getManagerPendingDesignOptions = async (req, res, next) => {
  try {
    const managerId = req.user?._id.toString();
    const { type } = req.query; // option | version

    if (!managerId) {
      throw new ApiError(401, "Unauthorized");
    }

    if (!["option", "version"].includes(type)) {
      throw new ApiError(400, "Invalid type. Allowed values: option | version");
    }

    /* ---------------- STEP 1: GET DESIGN ASSIGNED IDS ---------------- */
    const assignedDocs = await DesignAssigned.find(
      {
        assigned_by: managerId,
        is_active: true,
        work_status: "on_track",
        design_option_uploaded: true,
        mark_as_mockup_started: false,
      },
      { _id: 1 },
    ).lean();

    const designAssignedIds = assignedDocs.map((d) => d._id);

    if (!designAssignedIds.length) {
      return res.json({ success: true, data: [] });
    }

    /* ---------------- STEP 2: BASE DESIGN OPTIONS ---------------- */
    const pendingOptions = await DesignOptionsModel.find({
      design_assigned_id: { $in: designAssignedIds },
      "approval_panel.send_to_manager": true,
      "approval_panel.manager_status": "PENDING_BY_MANAGER",
      is_active: true,
      is_version_started: false,
    })
      .populate("design_request_id")
      .populate("design_assigned_id")
      .lean();

    /* ================= OPTION ONLY ================= */
    if (type === "option") {
      return res.status(200).json({
        success: true,
        type: "option",
        data: pendingOptions,
      });
    }

    /* ================= VERSION ================= */

    const pendingOptionVersionsId = await DesignOptionsModel.find(
      {
        design_assigned_id: { $in: designAssignedIds },
        is_active: true,
        is_version_started: true,
      },
      { _id: 1 }, //  sirf _id explicitly
    ).lean();

    if (!pendingOptionVersionsId.length) {
      return res.json({ success: true, type: "version", data: [] });
    }

    const versions = await designOptionVersionModel.aggregate([
      {
        $match: {
          design_option_id: { $in: pendingOptionVersionsId },
        },
      },
      {
        $addFields: {
          lastVersion: { $arrayElemAt: ["$design_option_versions", -1] },
        },
      },
      {
        $match: {
          "lastVersion.send_to_manager": true,
          "lastVersion.approval_panel.manager_status": "PENDING_BY_MANAGER",
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      type: "version",
      data: versions,
    });
  } catch (error) {
    next(error instanceof ApiError ? error : new ApiError(500, error.message));
  }
};

// manager action for design option approval & design option version approval
export const managerUpdateDesignOptionStatus = async (req, res, next) => {
  const uploadedFiles = []; //  rollback tracking

  try {
    const managerId = req.user?._id?.toString();
    const role = req.user?.designation?.title?.toLowerCase();

    if (!managerId || role !== "manager") {
      throw new ApiError(403, "Only manager can perform this action");
    }

    const {
      type, // option | version
      design_option_id,
      version_item_id,
      manager_status, // accepted | modification | rejected
      manager_remark = "",
    } = req.body;

    if (!["option", "version"].includes(type)) {
      throw new ApiError(400, "type must be option or version");
    }

    if (!design_option_id || !manager_status) {
      throw new ApiError(
        400,
        "design_option_id and manager_status are required",
      );
    }

    const statusMap = {
      accepted: "APPROVED_BY_MANAGER",
      modification: "MODIFICATION_BY_MANAGER",
      rejected: "REJECTED_BY_MANAGER",
    };

    if (!statusMap[manager_status]) {
      throw new ApiError(
        400,
        "Invalid manager_status. Allowed: accepted | modification | rejected",
      );
    }

    const mappedStatus = statusMap[manager_status];

    /* ============================================================
       ================= MEDIA UPLOAD =============================
       ============================================================ */
    const filesMap = req.files || {};
    let mediaArr = [];

    const uploadSingleFile = async (file) => {
      let result;

      if (process.env.USE_CLOUDINARY === "true") {
        result = await uploadFiles([file]);
        if (!result?.success || !result?.files?.[0]?.url) {
          throw new ApiError(400, "File upload failed");
        }
      } else {
        const localPath = file.path?.replace(/\\/g, "/");
        result = {
          success: true,
          files: [
            {
              url: localPath,
              public_url: null,
              public_id: null,
              name: file.originalname,
              type: file.mimetype,
            },
          ],
        };
      }

      const uploaded = result.files[0];
      uploadedFiles.push(uploaded); // 🔥 rollback support
      return uploaded;
    };

    const mediaFiles = filesMap["media"];
    if (Array.isArray(mediaFiles)) {
      for (const file of mediaFiles) {
        const uploadedMedia = await uploadSingleFile(file);
        mediaArr.push(uploadedMedia);
      }
    }

    /* ============================================================
       ================= OPTION (NO VERSION) ======================
       ============================================================ */
    if (type === "option") {
      const updatedOption = await DesignOptionsModel.findOneAndUpdate(
        {
          _id: design_option_id,
          is_active: true,
          "approval_panel.manager_status": "PENDING_BY_MANAGER",
        },
        {
          $set: {
            "approval_panel.manager_status": mappedStatus,
            "approval_panel.manager_remark": manager_remark,
            "approval_panel.manager_action_at": new Date(),
          },
          ...(mediaArr.length && {
            $push: { manager_media: { $each: mediaArr } },
          }),
        },
        { new: true },
      );

      if (!updatedOption) {
        throw new ApiError(404, "Design option not found or already processed");
      }

      return res.status(200).json({
        success: true,
        type: "option",
        message: `Option ${mappedStatus.replaceAll("_", " ").toLowerCase()}`,
        data: updatedOption,
      });
    }

    /* ============================================================
       ================= VERSION ================================
       ============================================================ */
    if (type === "version") {
      if (!version_item_id) {
        throw new ApiError(400, "version_item_id is required for version");
      }

      const updatedVersion = await designOptionVersionModel.findOneAndUpdate(
        {
          design_option_id,
          "design_option_versions._id": version_item_id,
          "design_option_versions.approval_panel.manager_status":
            "PENDING_BY_MANAGER",
        },
        {
          $set: {
            "design_option_versions.$.approval_panel.manager_status":
              mappedStatus,
            "design_option_versions.$.approval_panel.manager_remark":
              manager_remark,
            "design_option_versions.$.approval_panel.manager_action_at":
              new Date(),
          },
          ...(mediaArr.length && {
            $push: {
              "design_option_versions.$.manager_media": {
                $each: mediaArr,
              },
            },
          }),
        },
        { new: true },
      );

      if (!updatedVersion) {
        throw new ApiError(404, "Version item not found or already processed");
      }

      return res.status(200).json({
        success: true,
        type: "version",
        message: `Version ${mappedStatus.replaceAll("_", " ").toLowerCase()}`,
        data: updatedVersion,
      });
    }
  } catch (error) {
    /* ================= ROLLBACK ================= */
    if (uploadedFiles.length && process.env.USE_CLOUDINARY === "true") {
      for (const file of uploadedFiles) {
        try {
          if (file?.public_id) await deleteFile(file.public_id);
          if (file?.url) await deleteLocalFile(file.url);
        } catch {
          // ignore rollback errors
        }
      }
    }
    next(error instanceof ApiError ? error : new ApiError(500, error.message));
  }
};

// client get list for design option approval & design option version approval
export const getClientPendingDesignOptions = async (req, res, next) => {
  try {
    const clientId = req.user?._id.toString();
    const { type } = req.query; // option | version

    if (!clientId) {
      throw new ApiError(401, "Unauthorized");
    }

    /* ================= STEP 1: DesignRequested ================= */

    const designRequests = await DesignRequested.find(
      {
        client_id: clientId,
        mark_as_started: true,
      },
      { _id: 1 },
    ).lean();

    if (!designRequests.length) {
      return res.json({
        success: true,
        message: "No data Available",
        data: [],
      });
    }

    const designRequestIds = designRequests.map((d) => d._id);

    /* ================= STEP 2: DesignAssigned ================= */

    const designAssigned = await DesignAssigned.find(
      {
        design_request_id: { $in: designRequestIds },
        is_active: true,
        design_option_uploaded: true,
        mark_as_mockup_started: false,
      },
      { _id: 1 },
    ).lean();

    if (!designAssigned.length) {
      return res.json({
        success: true,
        message: "No data Available",
        data: [],
      });
    }

    const designAssignedIds = designAssigned.map((d) => d._id);

    /* ================= STEP 3: OPTION ================= */

    const pendingOptions = await DesignOptionsModel.find({
      design_assigned_id: { $in: designAssignedIds },
      "approval_panel.send_to_client": true,
      "approval_panel.client_status": "PENDING_BY_CLIENT",
      is_active: true,
      is_version_started: false,
    })
      .populate("design_request_id")
      .populate("design_assigned_id")
      .lean();

    if (type === "option") {
      return res.status(200).json({
        success: true,
        type: "option",
        data: pendingOptions,
      });
    }

    /* ================= STEP 4: VERSION ================= */

    const optionIds = await DesignOptionsModel.find(
      {
        design_assigned_id: { $in: designAssignedIds },
        is_active: true,
        is_version_started: true,
      },
      { _id: 1 },
    ).lean();

    if (!optionIds.length) {
      return res.json({ success: true, type: "version", data: [] });
    }

    const versions = await designOptionVersionModel.aggregate([
      {
        $match: {
          design_option_id: { $in: optionIds.map((o) => o._id) },
        },
      },
      {
        $addFields: {
          lastVersion: { $arrayElemAt: ["$design_option_versions", -1] },
        },
      },
      {
        $match: {
          "lastVersion.send_to_client": true,
          "lastVersion.approval_panel.client_status": "PENDING_BY_CLIENT",
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      type: "version",
      data: versions,
    });
  } catch (error) {
    next(error instanceof ApiError ? error : new ApiError(500, error.message));
  }
};

// client action for design option approval & design option version approval
export const clientUpdateDesignOptionStatus = async (req, res, next) => {
  const uploadedFiles = []; // rollback tracking

  try {
    const clientId = req.user?._id?.toString();
    const role = req.user?.designation?.title?.toLowerCase();

    if (!clientId || role !== "client") {
      throw new ApiError(403, "Only client can perform this action");
    }

    const {
      type, // option | version
      design_option_id,
      version_item_id,
      client_status, // accepted | modification | rejected
      client_remark = "",
    } = req.body;

    if (!["option", "version"].includes(type)) {
      throw new ApiError(400, "type must be option or version");
    }

    if (!design_option_id || !client_status) {
      throw new ApiError(
        400,
        "design_option_id and client_status are required",
      );
    }

    const statusMap = {
      accepted: "APPROVED_BY_CLIENT",
      modification: "MODIFICATION_BY_CLIENT",
      rejected: "REJECTED_BY_CLIENT",
    };

    if (!statusMap[client_status]) {
      throw new ApiError(
        400,
        "Invalid client_status. Allowed: accepted | modification | rejected",
      );
    }

    const mappedStatus = statusMap[client_status];

    /* ============================================================
       ================= MEDIA UPLOAD =============================
       ============================================================ */
    const filesMap = req.files || {};
    let mediaArr = [];

    const uploadSingleFile = async (file) => {
      let result;

      if (process.env.USE_CLOUDINARY === "true") {
        result = await uploadFiles([file]);
        if (!result?.success || !result?.files?.[0]?.url) {
          throw new ApiError(400, "File upload failed");
        }
      } else {
        const localPath = file.path?.replace(/\\/g, "/");
        result = {
          success: true,
          files: [
            {
              url: localPath,
              public_url: null,
              public_id: null,
              name: file.originalname,
              type: file.mimetype,
            },
          ],
        };
      }

      const uploaded = result.files[0];
      uploadedFiles.push(uploaded); // rollback support
      return uploaded;
    };

    const mediaFiles = filesMap["media"];
    if (Array.isArray(mediaFiles)) {
      for (const file of mediaFiles) {
        const uploadedMedia = await uploadSingleFile(file);
        mediaArr.push(uploadedMedia);
      }
    }

    /* ============================================================
       ================= OPTION (NO VERSION) ======================
       ============================================================ */
    if (type === "option") {
      const updatedOption = await DesignOptionsModel.findOneAndUpdate(
        {
          _id: design_option_id,
          is_active: true,
          "approval_panel.client_status": "PENDING_BY_CLIENT",
        },
        {
          $set: {
            "approval_panel.client_status": mappedStatus,
            "approval_panel.client_remark": client_remark,
            "approval_panel.client_action_at": new Date(),
          },
          ...(mediaArr.length && {
            $push: { client_media: { $each: mediaArr } },
          }),
        },
        { new: true },
      );

      if (!updatedOption) {
        throw new ApiError(404, "Design option not found or already processed");
      }

      return res.status(200).json({
        success: true,
        type: "option",
        message: `Option ${mappedStatus.replaceAll("_", " ").toLowerCase()}`,
        data: updatedOption,
      });
    }

    /* ============================================================
       ================= VERSION ================================
       ============================================================ */
    if (type === "version") {
      if (!version_item_id) {
        throw new ApiError(400, "version_item_id is required for version");
      }

      const updatedVersion = await designOptionVersionModel.findOneAndUpdate(
        {
          design_option_id,
          "design_option_versions._id": version_item_id,
          "design_option_versions.approval_panel.client_status":
            "PENDING_BY_CLIENT",
        },
        {
          $set: {
            "design_option_versions.$.approval_panel.client_status":
              mappedStatus,
            "design_option_versions.$.approval_panel.client_remark":
              client_remark,
            "design_option_versions.$.approval_panel.client_action_at":
              new Date(),
          },
          ...(mediaArr.length && {
            $push: {
              "design_option_versions.$.client_media": {
                $each: mediaArr,
              },
            },
          }),
        },
        { new: true },
      );

      if (!updatedVersion) {
        throw new ApiError(404, "Version item not found or already processed");
      }

      return res.status(200).json({
        success: true,
        type: "version",
        message: `Version ${mappedStatus.replaceAll("_", " ").toLowerCase()}`,
        data: updatedVersion,
      });
    }
  } catch (error) {
    /* ================= ROLLBACK ================= */
    if (uploadedFiles.length && process.env.USE_CLOUDINARY === "true") {
      for (const file of uploadedFiles) {
        try {
          if (file?.public_id) await deleteFile(file.public_id);
          if (file?.url) await deleteLocalFile(file.url);
        } catch {
          // ignore rollback errors
        }
      }
    }
    next(error instanceof ApiError ? error : new ApiError(500, error.message));
  }
};
