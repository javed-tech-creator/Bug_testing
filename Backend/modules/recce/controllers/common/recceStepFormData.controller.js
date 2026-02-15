import mongoose from "mongoose";
import { RecceAssigned } from "../../models/recceAssigned.base.model.js";
import ApiError from "../../../../utils/master/ApiError.js";
import {
  deleteFile,
  deleteLocalFile,
  uploadFiles,
} from "../../../../utils/master/cloudinary.js";
import RecceExecutionModel from "../../models/recceStepFormExecution.model.js";
import Project from "../../../sales/models/project.model.js";

export const saveClientInteraction = async (req, res, next) => {
  const uploadedFiles = [];
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const userId = req.user?._id?.toString();

    const {
      _id,
      met_client_on_site,
      reason_for_not_meeting,
      reschedule_date,
      person_met,
      contact_number,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new ApiError(400, "Invalid ID");
    }

    const recce = await RecceAssigned.findById(_id).session(session);

    if (!recce) {
      throw new ApiError(404, "Record not found");
    }

    /* ---------------- FILE MAP ---------------- */
    const uploadFile = req.files?.upload_proof?.[0] || null;

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
      uploadedFiles.push(uploaded);
      return uploaded;
    };

    /* ---------------- PUSH OLD DATA TO HISTORY ---------------- */
    if (
      recce.client_interaction &&
      recce.client_interaction.met_client_on_site !== undefined
    ) {
      recce.client_interaction_history.push({
        ...recce.client_interaction.toObject(),
        updated_by: userId,
        updated_at: new Date(),
      });
    }

    /* ---------------- NEW INTERACTION ---------------- */
    const newInteraction = {
      met_client_on_site,
      reason_for_not_meeting: "",
      upload_proof: null,
      reschedule_date: null,
      person_met: "",
      contact_number: "",
    };

    if (met_client_on_site === true) {
      if (!person_met || !contact_number) {
        throw new ApiError(
          400,
          "person_met and contact_number required when met_client_on_site is true",
        );
      }

      newInteraction.person_met = person_met;
      newInteraction.contact_number = contact_number;

      // mark recce started
      recce.mark_as_started = true;
      recce.started_at = new Date();
    }

    if (met_client_on_site === false) {
      if (!reason_for_not_meeting) {
        throw new ApiError(
          400,
          "reason_for_not_meeting required when met_client_on_site is false",
        );
      }

      newInteraction.reason_for_not_meeting = reason_for_not_meeting;
      newInteraction.reschedule_date = reschedule_date || null;

      if (uploadFile) {
        const uploadedProof = await uploadSingleFile(uploadFile);
        newInteraction.upload_proof = uploadedProof;
      }
    }

    /* ---------------- REPLACE CURRENT DATA ---------------- */
    recce.client_interaction = newInteraction;

    await recce.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Client interaction updated successfully",
      data: recce,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    /* ---------------- ROLLBACK FILES ---------------- */
    for (const file of uploadedFiles) {
      try {
        if (file?.public_id) await deleteFile(file.public_id);
        if (file?.url) await deleteLocalFile(file.url);
      } catch {}
    }

    return next(new ApiError(500, error.message));
  }
};

export const startRecceExecution = async (req, res, next) => {
  const session = await mongoose.startSession();
  const uploadedFiles = [];

  try {
    session.startTransaction();

    const {
      recce_detail_id,
      recce_assigned_id,
      projectId,
      checklist,
      raw_recce,
    } = req.body;

    /* ===============================
       1️⃣ Validate IDs
    =============================== */

    if (
      !mongoose.Types.ObjectId.isValid(recce_detail_id) ||
      !mongoose.Types.ObjectId.isValid(recce_assigned_id) ||
      !mongoose.Types.ObjectId.isValid(projectId)
    ) {
      throw new ApiError(400, "Invalid IDs provided");
    }

    /* ===============================
       2️⃣ Validate RecceAssigned
    =============================== */

    const recceAssigned =
      await RecceAssigned.findById(recce_assigned_id).session(session);

    if (!recceAssigned) throw new ApiError(404, "Recce assignment not found");

    if (!recceAssigned.mark_as_started)
      throw new ApiError(
        400,
        "Save client interaction before starting execution.",
      );

    if (!recceAssigned.client_interaction?.met_client_on_site)
      throw new ApiError(
        400,
        "Client was not met on site. Cannot start execution.",
      );

    /* ===============================
       3️⃣ Prevent Duplicate
    =============================== */

    const existingExecution = await RecceExecutionModel.findOne({
      recce_assigned_id,
    }).session(session);

    if (existingExecution)
      throw new ApiError(
        400,
        "Recce execution already exists for this assignment",
      );

    /* ===============================
       4️⃣ Get Project
    =============================== */

    const project = await Project.findById(projectId).session(session);

    if (!project) throw new ApiError(404, "Project not found");

    if (!project.products.length)
      throw new ApiError(400, "No products found in this project");

    /* ===============================
       5️⃣ FILE UPLOAD HELPER
    =============================== */

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
      uploadedFiles.push(uploaded); // track full object
      return uploaded;
    };

    /* ===============================
       6️⃣ Handle Raw Recce + Files
    =============================== */

    const parsedRawRecce = JSON.parse(raw_recce || "[]");
    const files = req.files || [];

    const mappedRawRecce = [];

    for (let i = 0; i < parsedRawRecce.length; i++) {
      let fileData = null;

      if (files[i]) {
        fileData = await uploadSingleFile(files[i]);
      }

      mappedRawRecce.push({
        product_name: parsedRawRecce[i].product_name,
        description: parsedRawRecce[i].description,
        product_file: fileData,
      });
    }

    /* ===============================
       7️⃣ Map Products
    =============================== */

    const mappedProducts = project.products.map((prodId) => ({
      product_id: prodId,
      step1: {},
      step2: {},
      step3: {},
      step4: {},
      current_step: 1,
      dss_compliance_checklist: [],
      declaration: false,
      is_completed: false,
      status: "draft",
    }));

    /* ===============================
       8️⃣ Create Execution
    =============================== */

    const execution = await RecceExecutionModel.create(
      [
        {
          recce_detail_id,
          recce_assigned_id,
          checklist: checklist ? JSON.parse(checklist) : [],
          raw_recce: mappedRawRecce,
          products: mappedProducts,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: "Recce execution started successfully",
      data: execution[0],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    /* ===============================
       ROLLBACK FILES
    =============================== */

    for (const file of uploadedFiles) {
      try {
        if (file?.public_id) await deleteFile(file.public_id);
        if (file?.url) await deleteLocalFile(file.url);
      } catch (err) {
        console.error("Error during file rollback:", err);
      }
    }

    return next(new ApiError(500, error.message));
  }
};

export const getDraftProductsList = async (req, res, next) => {
  try {
    const userId = req.user?._id?.toString();

    /* -----------------------------------------
       STEP 1: Get RecceAssigned IDs
    ----------------------------------------- */

    const assignedRecces = await RecceAssigned.find({
      assigned_to: userId,
      is_active: true,
      mark_as_recce_started: true,
    }).select("_id");

    const recceAssignedIds = assignedRecces.map((r) => r._id);

    if (recceAssignedIds.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No recce assigned found",
        data: [],
      });
    }

    /* -----------------------------------------
       STEP 2: Find RecceExecution records
    ----------------------------------------- */

    const executions = await RecceExecutionModel.find({
      recce_assigned_id: { $in: recceAssignedIds },
    }).populate("products.product_id", "_id productName");

    /* -----------------------------------------
       STEP 3: Filter draft products
    ----------------------------------------- */

    const draftProductsList = [];

    executions.forEach((execution) => {
      execution.products.forEach((product) => {
        if (product.status === "draft") {
          draftProductsList.push({
            recce_execution_id: execution._id,
            recce_assigned_id: execution.recce_assigned_id,
            recce_detail_id: execution.recce_detail_id,

            product_internal_id: product._id, // product array ka _id
            product_id: product.product_id?._id,
            product_name: product.product_id?.productName || "",

            current_step: product.current_step,
            status: product.status,
            is_completed: product.is_completed,
            createdAt: execution.createdAt,
          });
        }
      });
    });

    return res.status(200).json({
      success: true,
      total: draftProductsList.length,
      data: draftProductsList,
    });
  } catch (error) {
    return next(new ApiError(500, error.message));
  }
};

export const saveStep1 = async (req, res, next) => {
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

    const { recce_detail_id, recce_assigned_id, product_id, step1 } = req.body;

    /* ---------------- VALIDATION ---------------- */

    if (!recce_detail_id || !recce_assigned_id || !product_id) {
      throw new ApiError(400, "Required fields missing");
    }

    if (
      !mongoose.Types.ObjectId.isValid(recce_detail_id) ||
      !mongoose.Types.ObjectId.isValid(recce_assigned_id) ||
      !mongoose.Types.ObjectId.isValid(product_id)
    ) {
      throw new ApiError(400, "Invalid ObjectId provided");
    }

    /* ---------------- FILE HELPER ---------------- */

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

    /* ---------------- HANDLE COMPASS FILE ---------------- */

    let parsedStep1 = typeof step1 === "string" ? JSON.parse(step1) : step1;

    const compassFile = filesMap["compass_screenshot"]?.[0];

    if (compassFile) {
      const uploadedCompass = await uploadSingleFile(compassFile);

      parsedStep1.environmental_conditions =
        parsedStep1.environmental_conditions || {};

      parsedStep1.environmental_conditions.compass_screenshot = uploadedCompass;
    }

    /* ---------------- FIND EXECUTION ---------------- */

    let execution = await RecceExecutionModel.findOne(
      { recce_assigned_id },
      null,
      { session },
    );

    if (!execution) {
      execution = new RecceExecutionModel({
        recce_detail_id,
        recce_assigned_id,
        products: [
          {
            product_id,
            step1: parsedStep1,
            current_step: 1,
            status: "draft",
          },
        ],
      });

      await execution.save({ session });
    } else {
      const productIndex = execution.products.findIndex(
        (p) => p.product_id.toString() === product_id,
      );

      if (productIndex === -1) {
        execution.products.push({
          product_id,
          step1: parsedStep1,
          current_step: 1,
          status: "draft",
        });
      } else {
        execution.products[productIndex].step1 = parsedStep1;
        execution.products[productIndex].current_step = 1;
        execution.products[productIndex].status = "draft";
      }

      await execution.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Step1 saved successfully",
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

export const saveStep2 = async (req, res, next) => {
  const uploadedFiles = [];
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    /* ---------------- FILE MAP (.any()) ---------------- */
    const filesMap = {};
    for (const file of req.files || []) {
      if (!filesMap[file.fieldname]) {
        filesMap[file.fieldname] = [];
      }
      filesMap[file.fieldname].push(file);
    }

    const { recce_detail_id, recce_assigned_id, product_id, step2 } = req.body;

    /* ---------------- BASIC VALIDATION ---------------- */
    if (!recce_detail_id || !recce_assigned_id || !product_id) {
      throw new ApiError(400, "Required fields missing");
    }

    if (
      !mongoose.Types.ObjectId.isValid(recce_detail_id) ||
      !mongoose.Types.ObjectId.isValid(recce_assigned_id) ||
      !mongoose.Types.ObjectId.isValid(product_id)
    ) {
      throw new ApiError(400, "Invalid ObjectId provided");
    }

    /* ---------------- PARSE STEP2 ---------------- */
    let parsedStep2 = typeof step2 === "string" ? JSON.parse(step2) : step2;

    if (!parsedStep2) {
      throw new ApiError(400, "step2 data required");
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
      uploadedFiles.push(uploaded); //  rollback tracking
      return uploaded;
    };

    /* ---------------- AUTO FILE MAPPING ---------------- */

    const mapFilesToArray = async (fieldName) => {
      const arr = [];
      const files = filesMap[fieldName] || [];

      for (const file of files) {
        const uploaded = await uploadSingleFile(file);
        arr.push(uploaded);
      }

      return arr;
    };

    parsedStep2.image_section = parsedStep2.image_section || {};
    parsedStep2.video_section = parsedStep2.video_section || {};

    /*  Map All Needed Fields */

    parsedStep2.image_section.upload_mockup =
      await mapFilesToArray("upload_mockup");

    parsedStep2.image_section.size_images = {
      height_image: await mapFilesToArray("height_image"),
      length_image: await mapFilesToArray("length_image"),
      thickness_image: await mapFilesToArray("thickness_image"),
    };

    parsedStep2.image_section.other_images = {
      front_image: await mapFilesToArray("front_image"),
      left_image: await mapFilesToArray("left_image"),
      right_image: await mapFilesToArray("right_image"),
      back_image: await mapFilesToArray("back_image"),
      top_image: await mapFilesToArray("top_image"),
      bottom_image: await mapFilesToArray("bottom_image"),
      connection_point_image: await mapFilesToArray("connection_point_image"),
      nearby_area_image: await mapFilesToArray("nearby_area_image"),
      bottom_to_top_image: await mapFilesToArray("bottom_to_top_image"),
      viewing_area_image: await mapFilesToArray("viewing_area_image"),
    };

    parsedStep2.video_section.walkaround_360 =
      await mapFilesToArray("walkaround_360");

    parsedStep2.video_section.other_videos = {
      mockup_video: await mapFilesToArray("mockup_video"),
      combined_video: await mapFilesToArray("combined_video"),
      far_to_near_video: await mapFilesToArray("far_to_near_video"),
      connection_point_video: await mapFilesToArray("connection_point_video"),
    };

    parsedStep2.video_section.size_videos = {
      height_videos: await mapFilesToArray("height_videos"),
      length_videos: await mapFilesToArray("length_videos"),
      thickness_videos: await mapFilesToArray("thickness_videos"),
    };

    /* ---------------- FIND EXECUTION ---------------- */

    const execution = await RecceExecutionModel.findOne(
      { recce_assigned_id },
      null,
      { session },
    );

    if (!execution) {
      throw new ApiError(
        404,
        "Execution not found. Please complete Step1 first",
      );
    }

    const productIndex = execution.products.findIndex(
      (p) => p.product_id.toString() === product_id,
    );

    if (productIndex === -1) {
      throw new ApiError(404, "Product not found in execution");
    }

    /* ---------------- UPDATE STEP2 ---------------- */

    execution.products[productIndex].step2 = parsedStep2;
    execution.products[productIndex].current_step = 2;
    execution.products[productIndex].status = "draft";

    await execution.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Step2 saved successfully",
      data: execution.products[productIndex],
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

export const saveStep3 = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { recce_detail_id, recce_assigned_id, product_id, step3 } = req.body;

    /* ---------------- VALIDATION ---------------- */

    if (!recce_detail_id || !recce_assigned_id || !product_id) {
      throw new ApiError(400, "Required fields missing");
    }

    if (
      !mongoose.Types.ObjectId.isValid(recce_detail_id) ||
      !mongoose.Types.ObjectId.isValid(recce_assigned_id) ||
      !mongoose.Types.ObjectId.isValid(product_id)
    ) {
      throw new ApiError(400, "Invalid ObjectId provided");
    }

    let parsedStep3 = typeof step3 === "string" ? JSON.parse(step3) : step3;

    if (!parsedStep3) {
      throw new ApiError(400, "step3 data required");
    }

    /* ---------------- FIND EXECUTION ---------------- */

    const execution = await RecceExecutionModel.findOne(
      { recce_assigned_id, recce_detail_id },
      null,
      { session },
    );

    if (!execution) {
      throw new ApiError(404, "Execution not found");
    }

    const productIndex = execution.products.findIndex(
      (p) => p.product_id.toString() === product_id,
    );

    if (productIndex === -1) {
      throw new ApiError(404, "Product not found");
    }

    const product = execution.products[productIndex];

    /* ---------------- STEP LOCK ---------------- */
    if (product.current_step < 2) {
      throw new ApiError(400, "Complete Step2 before proceeding to Step3");
    }

    /* ---------------- UPDATE STEP3 ---------------- */

    product.step3 = parsedStep3;
    product.current_step = 3;
    product.status = "draft";

    await execution.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Step3 saved successfully",
      data: product,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return next(
      error instanceof ApiError ? error : new ApiError(500, error.message),
    );
  }
};

export const saveStep4 = async (req, res, next) => {
  const uploadedFiles = [];
  const session = await mongoose.startSession();
  const role = req.user?.designation?.title?.toLowerCase() || "";
  const userId = req.user?._id;
  try {
    session.startTransaction();

    const filesMap = {};
    for (const file of req.files || []) {
      filesMap[file.fieldname] = file;
    }

    const {
      recce_detail_id,
      recce_assigned_id,
      product_id,
      step4,
      dss_compliance_checklist,
      declaration,
    } = req.body;

    /* ---------------- VALIDATION ---------------- */

    if (!recce_detail_id || !recce_assigned_id || !product_id) {
      throw new ApiError(400, "Required fields missing");
    }

    if (!declaration || declaration !== "true") {
      throw new ApiError(400, "Declaration must be accepted");
    }

    let parsedStep4 = typeof step4 === "string" ? JSON.parse(step4) : step4;

    if (!parsedStep4) {
      throw new ApiError(400, "step4 data required");
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
      uploadedFiles.push(uploaded);
      return uploaded;
    };

    /* ---------------- FILE MAPPING ---------------- */

    if (filesMap.content_file)
      parsedStep4.data_from_client.content_file = await uploadSingleFile(
        filesMap.content_file,
      );

    if (filesMap.logo_cdr_file)
      parsedStep4.data_from_client.logo_cdr_file = await uploadSingleFile(
        filesMap.logo_cdr_file,
      );

    if (filesMap.upload_font)
      parsedStep4.data_from_client.upload_font = await uploadSingleFile(
        filesMap.upload_font,
      );

    if (filesMap.light_color_ref)
      parsedStep4.light_option.light_color_ref = await uploadSingleFile(
        filesMap.light_color_ref,
      );

    if (filesMap.signage_sample)
      parsedStep4.light_option.signage_sample = await uploadSingleFile(
        filesMap.signage_sample,
      );

    /* Color combination reference files */
    if (parsedStep4.color_combinations?.length) {
      for (let i = 0; i < parsedStep4.color_combinations.length; i++) {
        const key = `color_reference_${i}`;
        if (filesMap[key]) {
          parsedStep4.color_combinations[i].color_reference =
            await uploadSingleFile(filesMap[key]);
        }
      }
    }

    /* ---------------- FIND EXECUTION ---------------- */

    const execution = await RecceExecutionModel.findOne(
      { recce_assigned_id, recce_detail_id },
      null,
      { session },
    );

    if (!execution) {
      throw new ApiError(404, "Execution not found");
    }

    const productIndex = execution.products.findIndex(
      (p) => p.product_id.toString() === product_id,
    );

    if (productIndex === -1) {
      throw new ApiError(404, "Product not found");
    }

    const product = execution.products[productIndex];

    if (product.current_step < 3) {
      throw new ApiError(400, "Complete Step3 before proceeding to Step4");
    }

    /* ---------------- FINAL UPDATE ---------------- */

    product.step4 = parsedStep4;
    product.dss_compliance_checklist =
      typeof dss_compliance_checklist === "string"
        ? JSON.parse(dss_compliance_checklist)
        : dss_compliance_checklist || [];

    product.declaration = true;
    product.current_step = 4;
    product.status = "final";
    product.is_completed = true;
    product.completed_at = new Date();
    /* ---------------- MANAGER / EXECUTIVE FLOW ---------------- */

    const isManager = role.includes("manager");

    if (isManager) {
      //  Manager → auto approved
      product.manager_approval = {
        approval_status: "approved_by_manager",
        action_by: userId,
        action_at: new Date(),
        manager_media: [],
        manager_checklist: [],
        manager_remark: "",
      };
    } else {
      //  Executive → pending for approval
      product.manager_approval = {
        approval_status: "pending",
        action_by: null,
        action_at: null,
        manager_media: [],
        manager_checklist: [],
        manager_remark: "",
      };
    }

    await execution.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Step4 submitted successfully",
      data: product,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    /* ----------- ROLLBACK FILES ----------- */
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
