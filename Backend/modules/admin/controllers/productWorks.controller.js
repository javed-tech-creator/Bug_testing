import mongoose from "mongoose";
import ProductWork from "../models/productWorks.model.js";
import ApiError from "../../../utils/master/ApiError.js";

/* ===========================================================
    Create Product Work Structure
   =========================================================== */
export const createWorkStructure = async (req, res, next) => {
  try {
    const { productId, phases } = req.body;

    if (!productId) {
      return next(new ApiError(400, "Product ID is required"));
    }

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return next(new ApiError(400, "Invalid Product ID format"));
    }

    // Check if work for this product already exists
    const existing = await ProductWork.findOne({ productId });
    if (existing) {
      return next(
        new ApiError(400, "Work structure already exists for this product")
      );
    }

    const newWork = await ProductWork.create({
      productId,
      phases,
    });

    res.status(201).json({
      success: true,
      message: "Product Work structure created successfully",
      data: newWork,
    });
  } catch (error) {
    console.error("Create ProductWork Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

/* ===========================================================
    Get Work Structure by Product ID (Only Non-Deleted)
   =========================================================== */
export const getWorkByProductId = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return next(new ApiError(400, "Product ID is required"));
    }

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return next(new ApiError(400, "Invalid Product ID format"));
    }
    

    const productWork = await ProductWork.findOne({
      productId,
    })
    .select("-isDeleted -deletedAt -updatedAt")
    .populate("productId","-productImage.public_id -isActive -isDeleted -deletedAt -updatedAt");

    if (!productWork) {
      return next(
        new ApiError(404, "No work structure found for this product")
      );
    }

    res.status(200).json({ success: true, message:"Product works fetched successfully", data: productWork });

  } catch (error) {
    console.error("Get ProductWork Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

/* ===========================================================
    Update Work Structure (Phases / nested data)
   =========================================================== */
export const updateWorkStructure = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const updates = req.body; // can include phases, etc.

        if (!productId) {
      return next(new ApiError(400, "Product ID is required"));
    }

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return next(new ApiError(400, "Invalid Product ID format"));
    }
    

    const updated = await ProductWork.findOneAndUpdate(
      { productId },
      { $set: updates },
      { new: true }
    );

    if (!updated) {
            return next(new ApiError(404, "No active work found for this product"));
    }

    res.status(200).json({
      success: true,
      message: "Work structure updated",
      data: updated,
    });
    
  } catch (error) {
    console.error("Update ProductWork Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
