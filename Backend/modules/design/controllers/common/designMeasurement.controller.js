import mongoose from "mongoose";
import { DesignOptionsModel } from "../../models/common_schema/designOptions.model.js";
import ApiError from "../../../../utils/master/ApiError.js";
import {
  deleteFile,
  deleteLocalFile,
  uploadFiles,
} from "../../../../utils/master/cloudinary.js";
import { DesignAssigned } from "../../models/executive/designAssigned.base.model.js";
import { DesignMeasurementVersion } from "../../models/common_schema/designMeasurementVersion.model.js";
import { DesignMockupVersionModel } from "../../models/common_schema/designMockupVersion.model.js";

export const getMeasurementPendingList = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const role = req.user?.designation?.title.toLowerCase(); // designer / manager / admin

    if (!userId) {
      throw new ApiError(401, "Unauthorized access");
    }

    /* ---------------- QUERY PARAMS ---------------- */
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    /* ---------------- BASE MATCH ---------------- */
    const assignedMatch = {
      is_active: true,
      mark_as_measurement_started: true,
      work_status: "on_track",
    };

    // Designer will see only their tasks
    if (role === "manager" || role === "executive") {
      assignedMatch.assigned_to = new mongoose.Types.ObjectId(userId);
    }

    /* ---------------- AGGREGATION ---------------- */
    const pipeline = [
      { $match: assignedMatch },

      {
        $lookup: {
          from: "designmockupversions",
          localField: "_id",
          foreignField: "design_assigned_id",
          as: "mockup",
        },
      },

      { $unwind: "$mockup" },

      {
        $match: {
          "mockup.is_active": true,
          "mockup.mark_as_measurement_started": true,
          "mockup.measurement_uploaded": false,
        },
      },

      /* ------------ POPULATIONS ------------ */
      {
        $lookup: {
          from: "designrequesteds",
          localField: "design_request_id",
          foreignField: "_id",
          as: "design_request",
        },
      },
      { $unwind: "$design_request" },

      {
        $lookup: {
          from: "users",
          localField: "assigned_to",
          foreignField: "_id",
          as: "assigned_user",
        },
      },
      { $unwind: { path: "$assigned_user", preserveNullAndEmptyArrays: true } },

      /* ------------ SORT ------------ */
      { $sort: { createdAt: -1 } },

      /* ------------ PAGINATION ------------ */
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: "count" }],
        },
      },
    ];

    const result = await DesignAssigned.aggregate(pipeline);

    const data = result[0]?.data || [];
    const totalRecords = result[0]?.totalCount[0]?.count || 0;
    const totalPages = Math.ceil(totalRecords / limit);

    return res.status(200).json({
      message: "Measurement pending list fetched successfully",
      data,
      pagination: {
        totalRecords,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    return next(new ApiError(500, error.message));
  }
};

export const createDesignMeasurementVersion = async (req, res, next) => {
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
      design_mockup_id,
      design_option_id,
      design_request_id,
      design_assigned_id,
      board,
      letters,
      remark,
    } = req.body;

    const uploaded_by = req.user?._id.toString();

    /* ---------------- BASIC VALIDATION ---------------- */
    if (
      !design_mockup_id ||
      !design_option_id ||
      !design_request_id ||
      !design_assigned_id
    ) {
      throw new ApiError(400, "Required fields are missing");
    }

    const idsToValidate = [
      design_mockup_id,
      design_option_id,
      design_request_id,
      design_assigned_id,
    ];

    for (const id of idsToValidate) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid ObjectId provided");
      }
    }

    if (!board || !letters || !Array.isArray(letters)) {
      throw new ApiError(400, "Board and letters data is required");
    }

    /* ---------------- REQUIRED FILE ---------------- */
    const measurementFile = filesMap["upload_measuremnet_file"]?.[0];
    if (!measurementFile) {
      throw new ApiError(400, "upload_measuremnet_file is required");
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
    const upload_measuremnet_file = await uploadSingleFile(measurementFile);

    let upload_supporting_asset = null;
    if (filesMap["upload_supporting_asset"]?.[0]) {
      upload_supporting_asset = await uploadSingleFile(
        filesMap["upload_supporting_asset"][0],
      );
    }

    const media = [];
    if (Array.isArray(filesMap["media"])) {
      for (const file of filesMap["media"]) {
        media.push(await uploadSingleFile(file));
      }
    }

    const userRole = req.user?.designation?.title.toLowerCase(); // "manager", "designer", "executive" etc.

    /* ---------------- APPROVAL PANEL ---------------- */
    if (userRole === "manager") {
      // Auto approved
      approvalPanelData = {
        send_to_manager: false,
        send_to_manager_date: null,
        manager_status: "APPROVED_BY_MANAGER",
        manager_action_at: new Date(),
      };
    } else {
      // Send to manager for approval
      approvalPanelData = {
        send_to_manager: true,
        send_to_manager_date: new Date(),
        manager_status: "PENDING_BY_MANAGER",
        manager_action_at: null,
      };
    }
    /* ---------------- MEASUREMENT ITEM ---------------- */
    const measurementItem = {
      upload_measuremnet_file,
      upload_supporting_asset,
      media,
      board,
      letters,
      remark: remark || "",
      uploaded_at: new Date(),
      approval_panel: approvalPanelData,
    };

    /* ---------------- CREATE DOCUMENT ---------------- */
    const doc = await DesignMeasurementVersion.create(
      [
        {
          design_mockup_id,
          design_option_id,
          design_request_id,
          design_assigned_id,
          uploaded_by,
          designmeasurementVersion: [measurementItem],
        },
      ],
      { session },
    );

    /* ---------------- UPDATE ASSIGNMENT FLOW ---------------- */
    await DesignMockupVersionModel.findByIdAndUpdate(
      design_mockup_id,
      {
        $set: {
          measurement_uploaded: true,
        },
      },
      { session },
    );

    await DesignOptionsModel.findByIdAndUpdate(
      design_option_id,
      {
        $set: {
          measurement_uploaded: true,
        },
      },
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: "Design measurement uploaded successfully",
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

export const getDesignMeasurementForView = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const data = await DesignAssigned.aggregate([
      /* ---------------- STEP 1 ---------------- */
      {
        $match: {
          assigned_to: userId,
          is_active: true,
          work_status: "on_track",
          mark_as_measurement_started: true,
        },
      },

      /* ---------------- STEP 2 ---------------- */
      {
        $lookup: {
          from: "designoptionsmodels",
          let: { assignedId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$design_assigned_id", "$$assignedId"] },
                    { $eq: ["$is_active", true] },
                    { $eq: ["$mark_as_measurement_started", true] },
                    { $eq: ["$measurement_uploaded", true] },
                  ],
                },
              },
            },
          ],
          as: "design_option",
        },
      },

      { $unwind: "$design_option" },

      /* ---------------- STEP 3 ---------------- */
      {
        $lookup: {
          from: "designmeasurementversions",
          let: {
            optionId: "$design_option._id",
            assignedId: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$design_option_id", "$$optionId"] },
                    { $eq: ["$design_assigned_id", "$$assignedId"] },
                    { $eq: ["$is_active", true] },
                    { $eq: ["$mark_as_design_review_started", false] },
                  ],
                },
              },
            },
          ],
          as: "measurement",
        },
      },

      { $unwind: "$measurement" },

      /* ---------------- OPTIONAL POPULATES ---------------- */
      {
        $lookup: {
          from: "designrequesteds",
          localField: "design_request_id",
          foreignField: "_id",
          as: "design_request",
        },
      },
      { $unwind: "$design_request" },

      {
        $lookup: {
          from: "users",
          localField: "assigned_to",
          foreignField: "_id",
          as: "assigned_user",
        },
      },
      { $unwind: "$assigned_user" },

      /* ---------------- FINAL SHAPE ---------------- */
      {
        $project: {
          _id: 1,
          priority_number: 1,
          urgency: 1,
          deadline: 1,

          design_request: {
            _id: 1,
            client_name: 1,
            project_name: 1,
          },

          design_option: {
            _id: 1,
            approval_panel: 1,
          },

          measurement: {
            _id: 1,
            designmeasurementVersion: 1,
            uploaded_by: 1,
            createdAt: 1,
          },

          assigned_user: {
            _id: 1,
            name: 1,
          },
        },
      },

      { $sort: { createdAt: -1 } },
    ]);

    return res.status(200).json({
      success: true,
      message: "Design measurement review list fetched successfully",
      data,
    });
  } catch (error) {
    return next(
      error instanceof ApiError ? error : new ApiError(500, error.message),
    );
  }
};

export const updateDesignMeasurementItem = async (req, res, next) => {
  const session = await mongoose.startSession();
  const uploadedFiles = [];

  try {
    session.startTransaction();

    const { measurementId } = req.params;
    const { board, letters, remark } = req.body;

    if (!mongoose.Types.ObjectId.isValid(measurementId)) {
      throw new ApiError(400, "Invalid measurement version id");
    }

    const measurementDoc = await DesignMeasurementVersion.findOne(
      {
        _id: measurementId,
        is_active: true,
        mark_as_design_review_started: false,
      },
      null,
      { session },
    );

    if (!measurementDoc) {
      throw new ApiError(404, "Measurement version not found or locked");
    }

    /* ---------------- LAST ITEM (FOR COPY) ---------------- */
    const lastItem =
      measurementDoc.designmeasurementVersion.length > 0
        ? measurementDoc.designmeasurementVersion[
            measurementDoc.designmeasurementVersion.length - 1
          ]
        : null;

    /* ---------------- FILE UPLOAD HELPER ---------------- */
    const uploadSingleFile = async (file) => {
      let result;

      if (process.env.USE_CLOUDINARY === "true") {
        result = await uploadFiles([file]);
        if (!result?.success || !result?.files?.[0]) {
          throw new ApiError(400, "File upload failed");
        }
      } else {
        result = {
          files: [
            {
              url: file.path?.replace(/\\/g, "/"),
              public_id: null,
              public_url: null,
              name: file.originalname,
              type: file.mimetype,
            },
          ],
        };
      }

      uploadedFiles.push(result.files[0]);
      return result.files[0];
    };

    /* ---------------- FILE HANDLING ---------------- */

    // Mandatory file (new → upload, else copy)
    let upload_measuremnet_file = lastItem?.upload_measuremnet_file ?? null;
    if (req.files?.upload_measuremnet_file?.[0]) {
      upload_measuremnet_file = await uploadSingleFile(
        req.files.upload_measuremnet_file[0],
      );
    }

    if (!upload_measuremnet_file) {
      throw new ApiError(400, "Measurement file is required");
    }

    // Optional file (new → upload, else copy)
    let upload_supporting_asset = lastItem?.upload_supporting_asset ?? null;
    if (req.files?.upload_supporting_asset?.[0]) {
      upload_supporting_asset = await uploadSingleFile(
        req.files.upload_supporting_asset[0],
      );
    }

    //  media NEVER copied
    const media = [];
    if (Array.isArray(req.files?.media)) {
      for (const file of req.files.media) {
        media.push(await uploadSingleFile(file));
      }
    }

    /* ---------------- CREATE NEW MEASUREMENT ITEM ---------------- */
    const newMeasurementItem = {
      upload_measuremnet_file,
      upload_supporting_asset,
      media, // always fresh or empty

      board: board ? JSON.parse(board) : lastItem?.board,

      letters: letters ? JSON.parse(letters) : (lastItem?.letters ?? []),

      remark: remark ?? lastItem?.remark ?? "",

      approval_panel: {
        send_to_manager: true,
        send_to_manager_date: new Date(),
        manager_status: "PENDING_BY_MANAGER",
      },

      uploaded_at: new Date(),
    };

    /* ---------------- SAVE ---------------- */
    measurementDoc.designmeasurementVersion.push(newMeasurementItem);
    await measurementDoc.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: "Measurement version updated successfully",
      data: measurementDoc,
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

    next(error instanceof ApiError ? error : new ApiError(500, error.message));
  }
};

export const getPendingMeasurementForManager = async (req, res, next) => {
  try {
    const userId = req.user?._id.toString();

    if (!userId) {
      throw new ApiError(401, "Unauthorized access");
    }

    /* ---------------- STEP 1: GET DESIGN ASSIGNED IDS ---------------- */
    const assignedList = await DesignAssigned.find(
      {
        assigned_by: userId,
        is_active: true,
        work_status: "on_track",
        mark_as_measurement_started: true,
        mark_as_design_review_started: false,
      },
      { _id: 1 },
    ).lean();

    const designAssignedIds = assignedList.map((d) => d._id);

    if (!designAssignedIds.length) {
      return res.status(200).json({
        success: true,
        message: "No pending measurements found",
        data: [],
      });
    }

    /* ---------------- STEP 2: AGGREGATION ---------------- */
    const data = await DesignMeasurementVersion.aggregate([
      {
        $match: {
          design_assigned_id: { $in: designAssignedIds },
          is_active: true,
          mark_as_design_review_started: false,
        },
      },

      /* --------- TAKE LAST MEASUREMENT ITEM --------- */
      {
        $addFields: {
          last_measurement: {
            $arrayElemAt: ["$designmeasurementVersion", -1],
          },
        },
      },

      /* --------- FILTER BY MANAGER APPROVAL --------- */
      {
        $match: {
          "last_measurement.approval_panel.send_to_manager": true,
          "last_measurement.approval_panel.manager_status":
            "PENDING_BY_MANAGER",
        },
      },

      /* --------- OPTIONAL LOOKUPS (REMOVE IF NOT NEEDED) --------- */
      {
        $lookup: {
          from: "designassigneds",
          localField: "design_assigned_id",
          foreignField: "_id",
          as: "design_assigned",
        },
      },
      { $unwind: "$design_assigned" },

      {
        $lookup: {
          from: "designrequesteds",
          localField: "design_request_id",
          foreignField: "_id",
          as: "design_request",
        },
      },
      { $unwind: "$design_request" },

      /* --------- FINAL SHAPE --------- */
      {
        $project: {
          designmeasurementVersion: 0, // full array hide
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    return next(new ApiError(500, error.message));
  }
};

export const managerMeasurementAction = async (req, res, next) => {
  const uploadedFiles = [];
  const role = req.user?.designation?.title?.toLowerCase();
  try {
    /* ---------------- ROLE CHECK ---------------- */
    if (role !== "manager") {
      throw new ApiError(403, "Only manager can perform this action");
    }

    const {
      measurement_item_id,
      manager_status,
      manager_remark = "",
    } = req.body;

    if (!measurement_item_id || !manager_status) {
      throw new ApiError(
        400,
        "measurement_item_id and manager_status required",
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
    /* ---------------- FILE UPLOAD HELPER ---------------- */
    const uploadSingleFile = async (file) => {
      let result;

      if (process.env.USE_CLOUDINARY === "true") {
        result = await uploadFiles([file]);
        if (!result?.success || !result?.files?.[0]) {
          throw new ApiError(400, "File upload failed");
        }
      } else {
        result = {
          files: [
            {
              url: file.path?.replace(/\\/g, "/"),
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

    if (Array.isArray(req.files?.manager_media)) {
      for (const file of req.files.manager_media) {
        const uploaded = await uploadSingleFile(file);
        manager_media.push(uploaded);
      }
    }

    /* ---------------- UPDATE LAST MEASUREMENT ITEM ---------------- */
    const updatedDoc = await DesignMeasurementVersion.findOneAndUpdate(
      {
        "designmeasurementVersion._id": new mongoose.Types.ObjectId(
          measurement_item_id,
        ),
        is_active: true,
        mark_as_design_review_started: false,
      },
      {
        $set: {
          "designmeasurementVersion.$[item].approval_panel.manager_status":
            mappedStatus,
          "designmeasurementVersion.$[item].approval_panel.manager_remark":
            manager_remark,
          "designmeasurementVersion.$[item].approval_panel.manager_media":
            manager_media,
          "designmeasurementVersion.$[item].approval_panel.manager_action_at":
            new Date(),
        },
      },
      {
        arrayFilters: [
          {
            "item._id": new mongoose.Types.ObjectId(measurement_item_id),
          },
        ],
        new: true,
      },
    );

    if (!updatedDoc) {
      throw new ApiError(
        404,
        "Measurement item not found or already processed",
      );
    }

    return res.status(200).json({
      success: true,
      message: `Measurement ${mappedStatus.replaceAll("_", " ").toLowerCase()}`,
      data: updatedDoc,
    });
  } catch (error) {
    /* ---------------- FILE ROLLBACK ---------------- */
    for (const file of uploadedFiles) {
      try {
        if (file?.public_id) await deleteFile(file.public_id);
        if (file?.url) await deleteLocalFile(file.url);
      } catch {
        // silent
      }
    }

    next(error instanceof ApiError ? error : new ApiError(500, error.message));
  }
};
