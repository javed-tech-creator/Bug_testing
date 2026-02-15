import mongoose from "mongoose";
import { DesignOptionsModel } from "../../models/common_schema/designOptions.model.js";
import { DesignAssigned } from "../../models/executive/designAssigned.base.model.js";
import ApiError from "../../../../utils/master/ApiError.js";
import { uploadFiles } from "../../../../utils/master/cloudinary.js";
import { DesignMockupVersionModel } from "../../models/common_schema/designMockupVersion.model.js";
import { resolveSendToFlow } from "./designOptions.controller.js";
import DesignRequested from "../../models/manager/designRequested.model.js";

export const getMockupUploadPendingList = async (req, res, next) => {
  const userId = req.user?._id.toString();

  if (!userId) {
    throw new ApiError(401, "Unauthorized access");
  }

  /* ---------------- STEP 1: Fetch DesignAssigned IDs ---------------- */
  const assignedList = await DesignAssigned.find(
    {
      assigned_to: userId,
      mark_as_mockup_started: true,
      mockup_uploaded: false,
      is_active: true,
      work_status: "on_track",
    },
    { _id: 1 },
  );

  if (!assignedList.length) {
    return res.status(200).json({
      success: true,
      message: "No mockup pending records found",
      count: 0,
      data: [],
    });
  }

  const designAssignedIds = assignedList.map((item) => item._id);

  /* ---------------- STEP 2: Fetch DesignOptions ---------------- */
  const mockupPendingList = await DesignOptionsModel.find({
    design_assigned_id: { $in: designAssignedIds },
    is_active: true,
    mark_as_mockup_started: true,
    mockup_uploaded: false,
  })
    .populate("design_request_id")
    .populate("design_assigned_id")
    .sort({ createdAt: -1 });

  /* ---------------- RESPONSE ---------------- */
  return res.status(200).json({
    success: true,
    message: "Mockup upload pending list fetched successfully",
    count: mockupPendingList.length,
    data: mockupPendingList,
  });
};

export const getDesignOptionDetailsById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Design Option ID is required");
  }

  const data = await DesignOptionsModel.findById(id)
    .populate("design_request_id")
    .populate("design_assigned_id");

  if (!data) {
    throw new ApiError(404, "Design Option not found");
  }

  return res.status(200).json({
    success: true,
    message: "Design option details fetched successfully",
    data,
  });
};

/* ---------------- CREATE MOCKUP VERSION ---------------- */
export const createDesignMockupVersion = async (req, res, next) => {
  const uploadedFiles = [];
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    /* ---------------- FILE MAP ---------------- */
    const filesMap = {};
    for (const file of req.files || []) {
      if (!filesMap[file.fieldname]) filesMap[file.fieldname] = [];
      filesMap[file.fieldname].push(file);
    }

    const {
      design_request_id,
      design_assigned_id,
      design_option_id,
      remark,
      send_to_manager,
      send_to_client,
    } = req.body;

    const uploaded_by = req.user?._id.toString();

    /* ---------------- BASIC VALIDATION ---------------- */
    if (!design_request_id || !design_assigned_id || !design_option_id) {
      throw new ApiError(400, "Required fields are missing");
    }

    if (
      !mongoose.Types.ObjectId.isValid(design_request_id) ||
      !mongoose.Types.ObjectId.isValid(design_assigned_id) ||
      !mongoose.Types.ObjectId.isValid(design_option_id)
    ) {
      throw new ApiError(400, "Invalid ObjectId provided");
    }

    /* ---------------- REQUIRED FILE ---------------- */
    const supportingAssetFile = filesMap["upload_supporting_asset"]?.[0];

    // if (!supportingAssetFile) {
    //   throw new ApiError(400, "upload_supporting_asset file is required");
    // }

    /* ---------------- SEND TO FLOW ---------------- */
    const approvalPanelData = resolveSendToFlow({
      send_to_manager,
      send_to_client,
    });

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
          files: [
            {
              url: localPath,
              public_id: null,
              public_url: null,
              name: file.originalname,
              type: file.mimetype,
            },
          ],
        };
      }

      const uploaded = result.files[0];
      uploadedFiles.push(uploaded);
      return uploaded;
    };

    /* ---------------- UPLOAD FILES ---------------- */
    const upload_supporting_asset = await uploadSingleFile(supportingAssetFile);

    let upload_mockup_version = null;
    if (filesMap["upload_mockup_version"]?.[0]) {
      upload_mockup_version = await uploadSingleFile(
        filesMap["upload_mockup_version"][0],
      );
    }

    const media = [];
    if (Array.isArray(filesMap["media"])) {
      for (const file of filesMap["media"]) {
        media.push(await uploadSingleFile(file));
      }
    }

    /* ---------------- FIND EXISTING DOCUMENT ---------------- */
    let doc = await DesignMockupVersionModel.findOne(
      {
        design_request_id,
        design_assigned_id,
        is_active: true,
      },
      null,
      { session },
    );

    let version_number = 1;
    if (doc) {
      version_number = doc.designmockupVersion.length + 1;
    }

    const newVersion = {
      version_number,
      upload_supporting_asset,
      upload_mockup_version,
      media,
      remark: remark || "",
      uploaded_at: new Date(),
      approval_panel: approvalPanelData,
    };

    /* ---------------- CREATE OR UPDATE ---------------- */
    if (!doc) {
      doc = await DesignMockupVersionModel.create(
        [
          {
            design_request_id,
            design_assigned_id,
            uploaded_by,
            designmockupVersion: [newVersion],
          },
        ],
        { session },
      );
    } else {
      doc.designmockupVersion.push(newVersion);
      await doc.save({ session });
    }

    /* ---------------- UPDATE DESIGN OPTION ---------------- */
    await DesignOptionsModel.findByIdAndUpdate(
      design_option_id,
      { $set: { mockup_uploaded: true } },
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: "Mockup version uploaded successfully",
      data: doc,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    /* ---------------- FILE ROLLBACK ---------------- */
    for (const file of uploadedFiles) {
      try {
        if (file?.public_id) await deleteFile(file.public_id);
        if (file?.url) await deleteLocalFile(file.url);
      } catch {
        // silent rollback
      }
    }

    return next(
      error instanceof ApiError ? error : new ApiError(500, error.message),
    );
  }
};

/* ---------------- Get MOCKUP VERSION List ---------------- */

export const getMeasurementUploadPendingList = async (req, res) => {
  const userId = req.user?._id.toString();

  console.log("hii");

  if (!userId) {
    throw new ApiError(401, "Unauthorized access");
  }

  const data = await DesignAssigned.aggregate([
    {
      $match: {
        is_active: true,
        assigned_to: new mongoose.Types.ObjectId(userId),
        work_status: "on_track",
        mark_as_mockup_started: true,
      },
    },
    {
      $lookup: {
        from: "designoptionsmodels",
        localField: "_id",
        foreignField: "design_assigned_id",
        as: "designOptions",
      },
    },
    { $unwind: "$designOptions" },
    {
      $match: {
        "designOptions.is_active": true,
        "designOptions.mark_as_mockup_started": true,
        "designOptions.mockup_uploaded": true,
        "designOptions.mark_as_measurement_started": false,
      },
    },
    {
      $lookup: {
        from: "designrequesteds",
        localField: "designOptions.design_request_id",
        foreignField: "_id",
        as: "designOptions.design_request_id",
      },
    },
    {
      $unwind: {
        path: "$designOptions.design_request_id",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        designOptions: 1,
      },
    },
    {
      $replaceRoot: {
        newRoot: "$designOptions",
      },
    },
    { $sort: { createdAt: -1 } },
  ]);

  return res.status(200).json({
    success: true,
    message: "Measurement upload pending list fetched successfully",
    count: data.length,
    data,
  });
};

export const getMeasurementDetailById = async (req, res) => {
  const { id } = req.params;

  /* ---- ObjectId validation (VERY IMPORTANT) ---- */
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid design option id",
    });
  }

  const data = await DesignOptionsModel.findOne({
    _id: id,
    is_active: true,
  })
    .populate("design_request_id")
    .populate("design_assigned_id");

  if (!data) {
    throw new ApiError(404, "Measurement detail not found");
  }

  return res.status(200).json({
    success: true,
    message: "Measurement detail fetched successfully",
    data,
  });
};

export const pushDesignMockupVersion = async (req, res, next) => {
  const uploadedFiles = [];
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    /* ---------------- FILE MAP ---------------- */
    const filesMap = {};
    for (const file of req.files || []) {
      if (!filesMap[file.fieldname]) filesMap[file.fieldname] = [];
      filesMap[file.fieldname].push(file);
    }

    /* ---------------- PARAMS & BODY ---------------- */
    const { id } = req.params; // DesignMockupVersion _id
    const { remark, send_to_manager, send_to_client } = req.body;
    const uploaded_by = req.user._id.toString();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid mockup version id");
    }

    /* ---------------- REQUIRED FILE ---------------- */
    const mockupFile = filesMap["upload_mockup_version"]?.[0];
    if (!mockupFile) {
      throw new ApiError(400, "upload_mockup_version file is required");
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
        result = {
          files: [
            {
              url: file.path.replace(/\\/g, "/"),
              public_id: null,
              public_url: null,
              name: file.originalname,
              type: file.mimetype,
            },
          ],
        };
      }

      const uploaded = result.files[0];
      uploadedFiles.push(uploaded);
      return uploaded;
    };

    /* ---------------- UPLOAD FILES ---------------- */
    const upload_mockup_version = await uploadSingleFile(mockupFile);

    const upload_supporting_asset = filesMap["upload_supporting_asset"]?.[0]
      ? await uploadSingleFile(filesMap["upload_supporting_asset"][0])
      : null;

    const media = [];
    if (Array.isArray(filesMap["media"])) {
      for (const file of filesMap["media"]) {
        media.push(await uploadSingleFile(file));
      }
    }

    /* ---------------- SEND TO FLOW ---------------- */
    const approvalFlow = resolveSendToFlow({
      send_to_manager,
      send_to_client,
    });

    /* ---------------- FIND DOCUMENT ---------------- */
    const doc = await DesignMockupVersionModel.findById(id).session(session);

    if (!doc || !doc.is_active) {
      throw new ApiError(404, "Design mockup document not found");
    }

    /* ---------------- VERSION NUMBER ---------------- */
    const version_number = doc.designmockupVersion.length + 1;

    /* ---------------- PUSH NEW VERSION ---------------- */
    doc.designmockupVersion.push({
      version_number,
      upload_mockup_version,
      upload_supporting_asset,
      media,
      remark: remark || "",
      uploaded_at: new Date(),
      approval_panel: {
        ...approvalFlow,
        manager_status: approvalFlow.send_to_manager
          ? "PENDING_BY_MANAGER"
          : "NA",
        client_status: approvalFlow.send_to_client ? "PENDING_BY_CLIENT" : "NA",
      },
    });

    await doc.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: `Mockup version ${version_number} uploaded successfully`,
      data: doc,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    /* ---------------- FILE ROLLBACK ---------------- */
    for (const file of uploadedFiles) {
      try {
        if (file?.public_id) await deleteFile(file.public_id);
        if (file?.url) await deleteLocalFile(file.url);
      } catch {}
    }

    return next(
      error instanceof ApiError ? error : new ApiError(500, error.message),
    );
  }
};

export const getManagerPendingMockups = async (req, res, next) => {
  try {
    const managerId = req.user?._id;

    if (!managerId) {
      throw new ApiError(401, "Unauthorized access");
    }

    const data = await DesignMockupVersionModel.aggregate([
      /* ---------------- BASE FILTER ---------------- */
      {
        $match: {
          is_active: true,
          mark_as_measurement_started: false,
        },
      },

      /* ---------------- DESIGN ASSIGNED LOOKUP ---------------- */
      {
        $lookup: {
          from: "designassigneds",
          localField: "design_assigned_id",
          foreignField: "_id",
          as: "designAssigned",
        },
      },
      { $unwind: "$designAssigned" },

      {
        $match: {
          "designAssigned.assigned_by": new mongoose.Types.ObjectId(managerId),
          "designAssigned.is_active": true,
          "designAssigned.work_status": "on_track",
        },
      },

      /* ---------------- GET LAST VERSION ---------------- */
      {
        $addFields: {
          lastVersion: {
            $arrayElemAt: ["$designmockupVersion", -1],
          },
        },
      },

      /* ---------------- MANAGER PENDING FILTER ---------------- */
      {
        $match: {
          "lastVersion.approval_panel.send_to_manager": true,
          "lastVersion.approval_panel.manager_status": "PENDING_BY_MANAGER",
        },
      },

      /* ---------------- DESIGN REQUEST LOOKUP ---------------- */
      {
        $lookup: {
          from: "designrequesteds",
          localField: "design_request_id",
          foreignField: "_id",
          as: "design_request",
        },
      },
      { $unwind: "$design_request" },

      /* ---------------- RESPONSE SHAPE ---------------- */
      {
        $project: {
          design_request_id: 1,
          design_option_id: 1,
          design_assigned_id: 1,
          lastVersion: 1,

          design_request: {
            design_id: 1,
            project_id: 1,
            client_id: 1,
            branch_id: 1,
          },

          designAssigned: {
            assigned_to: 1,
            assigned_by: 1,
          },

          createdAt: 1,
        },
      },

      { $sort: { createdAt: -1 } },
    ]);

    return res.status(200).json({
      success: true,
      message: "Manager pending mockups fetched successfully",
      count: data.length,
      data,
    });
  } catch (error) {
    return next(
      error instanceof ApiError ? error : new ApiError(500, error.message),
    );
  }
};

export const managerApprovalAction = async (req, res, next) => {
  const uploadedFiles = [];
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { design_mockup_id, version_id, manager_status, manager_remark } =
      req.body;

    const userId = req.user?._id;
    const role = req.user?.designation?.title.toLowerCase() || "";

    /* ---------------- ROLE CHECK ---------------- */
    if (role !== "manager") {
      throw new ApiError(403, "Only manager can perform this action");
    }

    /* ---------------- STATUS MAP ---------------- */
    const statusMap = {
      approved: "APPROVED_BY_MANAGER",
      modification: "MODIFICATION_BY_MANAGER",
      rejected: "REJECTED_BY_MANAGER",
    };

    const mappedStatus = statusMap[manager_status?.toLowerCase()];

    if (!mappedStatus) {
      throw new ApiError(
        400,
        "Invalid manager_status. Allowed: approved, modification, rejected",
      );
    }

    /* ---------------- FILE MAP ---------------- */
    const filesMap = {};
    for (const file of req.files || []) {
      if (!filesMap[file.fieldname]) filesMap[file.fieldname] = [];
      filesMap[file.fieldname].push(file);
    }

    /* ---------------- FILE UPLOAD HELPER ---------------- */
    const uploadSingleFile = async (file) => {
      let result;

      if (process.env.USE_CLOUDINARY === "true") {
        result = await uploadFiles([file]);
        if (!result?.files?.[0]?.url) {
          throw new ApiError(400, "File upload failed");
        }
      } else {
        const localPath = file.path.replace(/\\/g, "/");
        result = {
          files: [
            {
              url: localPath,
              public_id: null,
              public_url: null,
              name: file.originalname,
              type: file.mimetype,
            },
          ],
        };
      }

      const uploaded = result.files[0];
      uploadedFiles.push(uploaded);
      return uploaded;
    };

    /* ---------------- UPLOAD MANAGER MEDIA ---------------- */
    let manager_media = [];

    if (Array.isArray(filesMap["manager_media"])) {
      for (const file of filesMap["manager_media"]) {
        const uploaded = await uploadSingleFile(file);
        manager_media.push(uploaded);
      }
    }

    /* ---------------- FIND DOCUMENT ---------------- */
    const doc = await DesignMockupVersionModel.findOne(
      {
        _id: design_mockup_id,
        "designmockupVersion._id": version_id,
        is_active: true,
      },
      null,
      { session },
    );

    if (!doc) {
      throw new ApiError(404, "Design mockup version not found");
    }

    const version = doc.designmockupVersion.id(version_id);

    /* ---------------- UPDATE APPROVAL PANEL ---------------- */
    version.approval_panel.manager_status = mappedStatus;
    version.approval_panel.manager_remark = manager_remark || "";
    version.approval_panel.manager_media = manager_media;
    version.approval_panel.manager_action_at = new Date();

    await doc.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Manager action updated successfully",
      data: version,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    /* ---------------- ROLLBACK FILES ---------------- */
    for (const file of uploadedFiles) {
      try {
        if (file?.public_id) await deleteFile(file.public_id);
        if (file?.url) await deleteLocalFile(file.url);
      } catch {
        // silent rollback
      }
    }

    return next(new ApiError(500, error.message));
  }
};

export const getClientPendingMockups = async (req, res, next) => {
  try {
    const clientId = new mongoose.Types.ObjectId(req.user._id);

    const data = await DesignMockupVersionModel.aggregate([
      /* ---------------- MOCKUP FILTER ---------------- */
      {
        $match: {
          is_active: true,
          mark_as_mockup_started: true,
          mark_as_measurement_started: false,
          "designmockupVersion.approval_panel.send_to_client": true,
          "designmockupVersion.approval_panel.client_status":
            "PENDING_BY_CLIENT",
        },
      },

      /* ---------------- DESIGN ASSIGNED LOOKUP ---------------- */
      {
        $lookup: {
          from: "designassigneds",
          localField: "design_assigned_id",
          foreignField: "_id",
          as: "designAssigned",
        },
      },
      { $unwind: "$designAssigned" },

      {
        $match: {
          "designAssigned.is_active": true,
          "designAssigned.work_status": "on_track",
          "designAssigned.current_plan.approval_status": "accepted",
          "designAssigned.mark_as_mockup_started": true,
          "designAssigned.mark_as_measurement_started": false,
        },
      },

      /* ---------------- DESIGN REQUEST LOOKUP ---------------- */
      {
        $lookup: {
          from: "designrequesteds",
          localField: "designAssigned.design_request_id",
          foreignField: "_id",
          as: "designRequest",
        },
      },
      { $unwind: "$designRequest" },

      {
        $match: {
          "designRequest.client_id": clientId,
          "designRequest.feedback_panel.final_decision": "accepted",
        },
      },

      /* ---------------- OPTIONAL POPULATES ---------------- */
      {
        $lookup: {
          from: "users",
          localField: "uploaded_by",
          foreignField: "_id",
          as: "uploadedBy",
        },
      },
      {
        $unwind: {
          path: "$uploadedBy",
          preserveNullAndEmptyArrays: true,
        },
      },

      /* ---------------- RESPONSE SHAPE ---------------- */
      {
        $project: {
          is_active: 1,
          createdAt: 1,
          designmockupVersion: 1,

          "designAssigned._id": 1,
          "designAssigned.assigned_to": 1,

          "designRequest._id": 1,
          "designRequest.design_id": 1,

          uploadedBy: {
            _id: 1,
            name: 1,
            email: 1,
          },
        },
      },

      { $sort: { createdAt: -1 } },
    ]);

    return res.status(200).json({
      success: true,
      message: "Client mockups fetched successfully",
      data,
    });
  } catch (error) {
    return next(new ApiError(500, error.message));
  }
};

export const clientApprovalAction = async (req, res, next) => {
  const uploadedFiles = [];
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { design_mockup_id, version_id, client_status, client_remark } =
      req.body;

    const role = req.user?.designation?.title?.toLowerCase() || "";

    /* ---------------- ROLE CHECK ---------------- */
    if (role !== "client") {
      throw new ApiError(403, "Only client can perform this action");
    }

    /* ---------------- STATUS MAP ---------------- */
    const statusMap = {
      approved: "APPROVED_BY_CLIENT",
      modification: "MODIFICATION_BY_CLIENT",
      rejected: "REJECTED_BY_CLIENT",
    };

    const mappedStatus = statusMap[client_status?.toLowerCase()];

    if (!mappedStatus) {
      throw new ApiError(
        400,
        "Invalid client_status. Allowed: approved, modification, rejected",
      );
    }

    /* ---------------- FILE MAP ---------------- */
    const filesMap = {};
    for (const file of req.files || []) {
      if (!filesMap[file.fieldname]) filesMap[file.fieldname] = [];
      filesMap[file.fieldname].push(file);
    }

    /* ---------------- FILE UPLOAD HELPER ---------------- */
    const uploadSingleFile = async (file) => {
      let result;

      if (process.env.USE_CLOUDINARY === "true") {
        result = await uploadFiles([file]);
        if (!result?.files?.[0]?.url) {
          throw new ApiError(400, "File upload failed");
        }
      } else {
        const localPath = file.path.replace(/\\/g, "/");
        result = {
          files: [
            {
              url: localPath,
              public_id: null,
              public_url: null,
              name: file.originalname,
              type: file.mimetype,
            },
          ],
        };
      }

      const uploaded = result.files[0];
      uploadedFiles.push(uploaded);
      return uploaded;
    };

    /* ---------------- UPLOAD CLIENT MEDIA ---------------- */
    let client_media = [];

    if (Array.isArray(filesMap["client_media"])) {
      for (const file of filesMap["client_media"]) {
        const uploaded = await uploadSingleFile(file);
        client_media.push(uploaded);
      }
    }

    /* ---------------- FIND DOCUMENT ---------------- */
    const doc = await DesignMockupVersionModel.findOne(
      {
        _id: design_mockup_id,
        "designmockupVersion._id": version_id,
        is_active: true,
      },
      null,
      { session },
    );

    if (!doc) {
      throw new ApiError(404, "Design mockup version not found");
    }

    const version = doc.designmockupVersion.id(version_id);

    /* ---------------- UPDATE CLIENT PANEL ---------------- */
    version.approval_panel.client_status = mappedStatus;
    version.approval_panel.client_remark = client_remark || "";
    version.approval_panel.client_media = client_media;
    version.approval_panel.client_action_at = new Date();

    await doc.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Client action updated successfully",
      data: version,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    /* ---------------- ROLLBACK FILES ---------------- */
    for (const file of uploadedFiles) {
      try {
        if (file?.public_id) await deleteFile(file.public_id);
        if (file?.url) await deleteLocalFile(file.url);
      } catch {
        // silent rollback
      }
    }

    return next(
      error instanceof ApiError ? error : new ApiError(500, error.message),
    );
  }
};

