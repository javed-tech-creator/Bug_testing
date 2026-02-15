import mongoose from "mongoose";
import registrationModel from "../../models/registration/registration.model.js";
import assetModel from "../../models/technology/asset.model.js";
import ApiError from "../../utils/master/ApiError.js";
import { getPaginationParams } from "../../utils/pageLimitValidation.js";
import { getWarrantyStatus } from "../../utils/technology/expireTimeCalculate.js";
// import { getWarrantyStatus } from "../../util/technology/expireTimeCalculate.js";

// Create Asset
export const createAsset = async (req, res, next) => {
  try {

        //  User ID check
    if (!req.user || !req.user._id || !mongoose.Types.ObjectId.isValid(req.user._id)) {
      return next(new ApiError(400, "Invalid or missing user ID"));
    }

    const asset = new assetModel({
      ...req.body,
      createdBy: req.user._id, // jisne assets create kiya
    }
    );
    
    await asset.save();

    return res.status(201).json({
      success: true,
      data: asset,
      message: "Asset added successfully",
    });
  } catch (error) {
    next(error);
  }
};

//  Get Assets (sab dekh sakte hain, lekin employee sirf apna assigned asset dekh sakta hai)
export const getAssets = async (req, res, next) => {
  try {
        const { page, limit, skip } = getPaginationParams(req);

    let assets;
    let total;

    let query = {isDeleted: false };


  if (!req.user._id || !mongoose.Types.ObjectId.isValid(req.user._id)) {
          return next(new ApiError(400, "Invalid or missing user ID"));
      }

    if (req.user.role === "techEngineer") {
      query["assignedTo.employeeId"] = req.user._id;
      assets = await assetModel
        .find(query)  
        .select(
          "tag type brand model location status warranty_end assignedTo"
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      total = await assetModel.countDocuments(query);

    } else {
      assets = await assetModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      total = await assetModel.countDocuments(query);
    }

// Suppose assets is the array of Mongoose documents
const updatedAssets = assets.map((asset) => {
  const { status, diffDays } = getWarrantyStatus(asset.warranty_end);

  // Convert Mongoose doc to plain object
  const plainAsset = asset.toObject(); // or asset._doc

  return {
    ...plainAsset,
    expireIn: status,  // optional
  };
});

   
    res.status(200).json({
      success: true,
     total, page, limit,
          data: updatedAssets,
    });

  } catch (error) {
    next(error)
  }
};

// get All deleted and not deleted data 
export const getAllAssets = async (req, res, next) => {
  console.log("request is coming");
  
  try {
      const assets = await assetModel
        .find()
        .sort({ createdAt: -1 })
      const total = await assetModel.countDocuments();

    res.status(200).json({
      success: true,
      total,
      message:"All deleted and Not deleted asset data fetched successfully",
      data: assets,
    });
  } catch (error) {
    next(error)
  }
};

//  Update Asset (Manager, HOD, Coordinator)

// Update Asset
export const updateAsset = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { purchase_date, warranty_end } = req.body;

        const query = {_id:id, isDeleted:false};

     //  Validate ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError(400, "Invalid Asset ID"));
    }

    // Pehle existing asset fetch karo (taaki agar req.body me purchase_date na aaye to purani use karein)
    const existingAsset = await assetModel.findOne(query);
    if (!existingAsset) {
      return next(new ApiError(404, "Asset not found or Already deleted"));
    }

    // Purchase date nikal lo (agar nayi bheji hai to use lo, warna purani DB wali)
    const finalPurchaseDate = purchase_date
      ? new Date(purchase_date)
      : existingAsset.purchase_date;
    const finalValidity = warranty_end
      ? new Date(warranty_end)
      : existingAsset.warranty_end;

    //  Validation check: validity purchase_date se chhoti na ho
    if (
      finalValidity &&
      finalPurchaseDate &&
      finalValidity < finalPurchaseDate
    ) {
      return next(
        new ApiError(
          400,
          "Warranty End date cannot be earlier than Purchase date"
        )
      );
    }

    // Agar ID invalid hai to mongoose CastError throw karega → catch me jayega
    const asset = await assetModel.findByIdAndUpdate(id, req.body, {
      new: true, // updated document return kare
      runValidators: true, // schema validation enable
      context: "query", // validator me `this` kaam kare
    });

    return res.status(200).json({
      success: true,
      data: asset,
      message: "Asset updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/assets/:id/assign
export const patchAsset = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { department, role, name, employeeId } = req.body;

    const query = {_id:id, isDeleted:false};

    // 1. Required fields validation
    if (!employeeId || !name || !department || !role) {
      return next(
        new ApiError(400, "All fields (employeeId, name, department, role) are required")
      );
    }

    // 2. Asset exist karta hai ya nahi
    const asset = await assetModel.findOne(query);
    if (!asset || asset.isDeleted) {
      return next(new ApiError(404, "Asset not found or already deleted"));
    }

    // 3. Employee exist karta hai ya nahi
    const employee = await registrationModel.findById(employeeId);
    if (!employee) {
      return next(new ApiError(404, "Employee not found"));
    }

    // 4. Agar same employee already assigned hai → Block   if (asset.assignedTo?.employeeId?.toString() === employeeId)
    if (asset.assignedTo?.department === department && asset.assignedTo?.role === role && asset.assignedTo?.name === name) {
      return next(new ApiError(400, "This asset is already assigned to this employee"));
    }

    // 5. Naya assignment object
    const newAssignment = {
      department,
      role,
      name,
      employeeId,
      date: new Date(),
    };

    let statusCode;

    // 6. First assignment OR Reassignment
    if (!asset.assignedTo || !asset.assignedTo.employeeId) {
      // First time assign
      asset.assignedTo = newAssignment;
      statusCode = 201; // Created
    } else {
      // Move current to history (deep copy)
      asset.reassignments.push({
        department: asset.assignedTo.department,
        role: asset.assignedTo.role,
        name: asset.assignedTo.name,
        employeeId: asset.assignedTo.employeeId,
        date: asset.assignedTo.date || new Date(),
      });

      // Set new assignment
      asset.assignedTo = newAssignment;
      statusCode = 200; // Updated
    }

    // 7. Save changes
    const updatedAsset = await asset.save();

    return res.status(statusCode).json({
      success: true,
      message: statusCode === 201 ? "Asset assigned successfully" : "Asset reassigned successfully",
      data: updatedAsset,
    });
  } catch (error) {
    next(error);
  }
};

//  soft Delete Asset (sirf Manager aur HOD kar sakte hain)
export const softDeleteAsset = async (req, res, next) => {
  try {
    const { id } = req.params;

    const query = {_id:id, isDeleted:false};

    //  Validate ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError(400, "Invalid Asset ID"));
    }

    //  Check asset exists
    const asset = await assetModel.findOne(query);
    if (!asset) {
      return next(new ApiError(404, "Asset not found or already deleted"));
    }

    // Perform soft delete (recommended)
    asset.isDeleted = true;
    await asset.save();

    return res.status(200).json({
      success: true,
      message: "Asset deleted successfully (soft delete)",
    });


  } catch (error) {
    console.error(error);
    next(error);
  }
};

//  hard Delete Asset (sirf Manager aur HOD kar sakte hain)
export const hardDeleteAsset = async (req, res, next) => {
  try {
    const { id } = req.params;

    //  Validate ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError(400, "Invalid Asset ID"));
    }

    //  Check asset exists
    const asset = await assetModel.findById(id);
    if (!asset) {
      return next(new ApiError(404, "Asset not found"));
    }

    //  Hard delete
     await assetModel.findByIdAndDelete(id);
     return res.status(200).json({ success: true, message: "Asset Permanent deleted successfully" });

  } catch (error) {
    console.error(error);
    next(error);
  }
};