import mongoose from "mongoose";
import axios from "axios";
import ApiError from "../../../../utils/master/ApiError.js";
import { RecceAssigned } from "../../models/recceAssigned.base.model.js";
import RecceExecutionModel from "../../models/recceStepFormExecution.model.js";
import {
  deleteFile,
  deleteLocalFile,
  uploadFiles,
} from "../../../../utils/master/cloudinary.js";

export const getReviewRecceProducts = async (req, res, next) => {
  try {
    const { type } = req.query; // self | team
    const userId = req.user._id.toString();

    let filter = {
      is_active: true,
      work_status: "on_track",
      mark_as_recce_started: true,
    };

    if (type === "self") {
      filter.assigned_to = userId;
    }

    if (type === "team") {
      filter.assigned_by = userId;
      filter.assigned_to = { $ne: userId };
    }

    /* -----------------------------------------
       1️⃣ Get RecceAssigned IDs
    ------------------------------------------*/
    const recceAssignedDocs = await RecceAssigned.find(filter);

    if (!recceAssignedDocs.length) {
      return res.status(200).json({
        success: true,
        message: "No active started recce found",
        data: [],
      });
    }

    const recceAssignedIds = recceAssignedDocs.map((doc) => doc._id);

    /* -----------------------------------------
       2️⃣ Get RecceExecution Data
    ------------------------------------------*/
    const recceExecutions = await RecceExecutionModel.find({
      recce_assigned_id: { $in: recceAssignedIds },
    })
      .populate("recce_assigned_id", "assigned_to assigned_by")
      .populate("products.product_id");

    /* -----------------------------------------
       3️⃣ Flatten Product Wise
    ------------------------------------------*/
    const productWiseList = [];

    recceExecutions.forEach((execution) => {
      execution.products.forEach((product) => {
        productWiseList.push({
          recce_execution_id: execution._id,
          recce_assigned_id: execution.recce_assigned_id?._id,
          recce_detail_id: execution.recce_detail_id,

          assigned_to: execution.recce_assigned_id?.assigned_to,
          assigned_by: execution.recce_assigned_id?.assigned_by,

          product_execution_id: product._id,
          product_id: product.product_id?._id,
          product_name: product.product_id?.product_name || "",

          current_step: product.current_step,
          status: product.status,
          is_completed: product.is_completed,
          completed_at: product.completed_at,

          manager_approval: product.manager_approval,

          allData: execution,
        });
      });
    });

    return res.status(200).json({
      success: true,
      count: productWiseList.length,
      type: type || "all",
      data: productWiseList,
    });
  } catch (error) {
    return next(
      error instanceof ApiError ? error : new ApiError(500, error.message),
    );
  }
};

export const updateManagerApproval = async (req, res, next) => {
  const uploadedFiles = [];
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const files = req.files || [];

    const {
      product_execution_id,
      approval_status,
      manager_checklist,
      manager_remark,
    } = req.body;

    /* ---------------- VALIDATION ---------------- */

    if (!mongoose.Types.ObjectId.isValid(product_execution_id)) {
      throw new ApiError(400, "Invalid product_execution_id");
    }

    if (!approval_status) {
      throw new ApiError(400, "approval_status is required");
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

    /* ---------------- FIND PRODUCT ---------------- */

    const execution = await RecceExecutionModel.findOne(
      { "products._id": product_execution_id },
      null,
      { session },
    );

    if (!execution) {
      throw new ApiError(404, "Product not found");
    }

    const product = execution.products.id(product_execution_id);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    /* ---------------- FILE UPLOAD ---------------- */

    let uploadedMedia = [];

    for (const file of files) {
      const uploaded = await uploadSingleFile(file);
      uploadedMedia.push(uploaded);
    }

    /* ---------------- UPDATE APPROVAL ---------------- */

    product.manager_approval.approval_status = approval_status;

    product.manager_approval.manager_checklist =
      typeof manager_checklist === "string"
        ? JSON.parse(manager_checklist)
        : manager_checklist || [];

    product.manager_approval.manager_remark = manager_remark || "";

    product.manager_approval.action_by = req.user._id;
    product.manager_approval.action_at = new Date();

    if (uploadedMedia.length) {
      product.manager_approval.manager_media = uploadedMedia;
    }

    await execution.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Manager approval updated successfully",
      data: product.manager_approval,
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

export const sendToDesignDepartment = async (req, res) => {
  try {
    const branch_id = req.user.branch_id.toString();
    const user_id = req.user._id.toString();
    const role = req.user?.designation?.title?.toLowerCase() || "";

    const { recce_execution_id, product_id } = req.body;

    if (!recce_execution_id || !product_id) {
      return res.status(400).json({
        success: false,
        message: "recce_execution_id and product_id required",
      });
    }

    // 1️⃣ Update Product
    const updated = await RecceExecutionModel.findOneAndUpdate(
      {
        _id: recce_execution_id,
        "products._id": product_id,
      },
      {
        $set: {
          "products.$.send_to_design": true,
          "products.$.sent_to_design_at": new Date(),
        },
      },
      { new: true },
    ).populate({
      path: "recce_detail_id",
      select: "clientId projectId",
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 2️⃣ Get updated product
    const product = updated.products.find(
      (p) => p._id.toString() === product_id,
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found after update",
      });
    }

    // 3️⃣ Prepare Payload
    const payload = {
      recce_id: updated._id,
      client_id: updated.recce_detail_id?.clientId,
      project_id: updated.recce_detail_id?.projectId,
      product_id: product.product_id,
      branch_id: branch_id,
      send_by: user_id,
      role: role,
    };

    // 4️⃣ Send to Design Backend
    const designResponse = await axios.post(
      `${process.env.DESIGN_SERVICE_URL}/requested`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.INTERNAL_SERVICE_TOKEN}`, // optional security
        },
      },
    );

    // 4️⃣ If Design Service Success
    if (designResponse.data?.success) {
      return res.status(200).json({
        success: true,
        message: "Product sent to design successfully",
        design_data: designResponse.data.data, //  design_id etc
      });
    }

    // 5️⃣ If Design Service Responded But Failed
    return res.status(400).json({
      success: false,
      message: designResponse.data?.message || "Design service error",
    });
  } catch (error) {
    console.error("Send To Design Error:", error?.response?.data || error);

    return res.status(500).json({
      success: false,
      message: "Failed to send data to design department",
    });
  }
};

export const getApprovedAndSentToDesign = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    // 1️⃣ Get all RecceAssigned IDs
    const assignedData = await RecceAssigned.find({
      assigned_by: userId,
      mark_as_recce_started: true,
    }).select("_id");

    const assignedIds = assignedData.map((item) => item._id);

    if (!assignedIds.length) {
      return res.status(200).json({
        success: true,
        message: "No started recce found",
        data: [],
      });
    }

    // 2️⃣ Get RecceExecution records
    const executions = await RecceExecutionModel.find({
      recce_assigned_id: { $in: assignedIds },
    }).lean();

    // 3️⃣ Filter products
    const finalData = executions
      .map((recce) => {
        const filteredProducts = recce.products.filter(
          (product) =>
            product.manager_approval?.approval_status ===
              "approved_by_manager" && product.send_to_design === true,
        );

        if (filteredProducts.length > 0) {
          return {
            recce_execution_id: recce._id,
            recce_assigned_id: recce.recce_assigned_id,
            recce_detail_id: recce.recce_detail_id,
            products: filteredProducts,
          };
        }

        return null;
      })
      .filter(Boolean);

    return res.status(200).json({
      success: true,
      count: finalData.length,
      data: finalData,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
