import mongoose from "mongoose";
import licenseModel from "../../models/technology/licensesoftware.model.js";
import ApiError from "../../utils/master/ApiError.js";
import registrationModel from "../../models/registration/registration.model.js";
import { getPaginationParams } from "../../utils/pageLimitValidation.js";
import { getWarrantyStatus } from "../../utils/technology/expireTimeCalculate.js";

//  Create License (sirf Manager aur HOD kar sakte hain)
// Create License
export const createLicense = async (req, res, next) => {
  try {
    if (
      !req.user ||
      !req.user._id ||
      !mongoose.Types.ObjectId.isValid(req.user._id)
    ) {
      return next(new ApiError(400, "Invalid or missing user ID"));
    }

    const license = new licenseModel({
      ...req.body,
      createdBy: req.user._id, // jisne license create kiya
    });

    await license.save();

    return res.status(201).json({
      success: true,
      message: "License created successfully",
      data: license,
    });
  } catch (error) {
    next(error);
  }
};

//  Get Licenses (sab dekh sakte hain, Employee sirf apna assigned license dekh sakta hai)
export const getLicenses = async (req, res, next) => {
  try {
        const { page, limit, skip } = getPaginationParams(req);

    let query = { isDeleted: false };
     let selected="";
    // agar employee hai to sirf uske hi licenses
    if (req.user.role === "techEngineer") {
      query["assignedTo.employeeId"] = req.user._id;
      selected = "-reassignments -validityStart -seats -renewalAlert -vendorDetails -createdBy -isDeleted -createdAt -updatedAt"
    }

    const total = await licenseModel.countDocuments(query);

    const licenses = await licenseModel
      .find(query)
      .select(selected)
      .sort({ createdAt: -1 }) // latest first
      .skip(skip)
      .limit(limit);

      // Suppose assets is the array of Mongoose documents
      const updatedLicense = licenses.map((license) => {
        const { status, diffDays } = getWarrantyStatus(license.validityEnd);
      
        // Convert Mongoose doc to plain object
        const plainLicense= license.toObject(); // or asset._doc
      
        return {
          ...plainLicense,
          expireIn: status,  // optional
        };
      });

    res.status(200).json({
      success: true,
      message: "license & software fetched successfully",
       total, page, limit,
      totalPages: Math.ceil(total / limit),
      data: updatedLicense,
    });
  } catch (error) {
    next(error);
  }
};

//  Get Licenses including soft deleted
export const getAllLicenses = async (req, res, next) => {
  try {
    const total = await licenseModel.countDocuments();

    const licenses = await licenseModel.find().sort({ createdAt: -1 }); // latest first

    res.status(200).json({
      success: true,
      message: "license & software including deleted fetched successfully",
      total,
      data: licenses,
    });
  } catch (error) {
    next(error);
  }
};

// Update License
export const updateLicense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { validityStart, validityEnd } = req.body;

     //  Validate ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError(400, "Invalid License ID"));
    }

    // Pehle existing asset fetch karo (taaki agar req.body me purchase_date na aaye to purani use karein)
    const existingLicense = await licenseModel.findOne({ _id: id, isDeleted: false });
    if (!existingLicense) {
      return next(new ApiError(404, "License not found or has been deleted"));
    }

    // Purchase date nikal lo (agar nayi bheji hai to use lo, warna purani DB wali)
    const finalValidityStart = validityStart
      ? new Date(validityStart)
      : existingLicense.validityStart;
    const finalValidityEnd = validityEnd
      ? new Date(validityEnd)
      : existingLicense.validityEnd;

    //  Validation check: validity purchase_date se chhoti na ho
    if (
      finalValidityStart &&
      finalValidityEnd &&
      finalValidityStart > finalValidityEnd
    ) {
      return next(
        new ApiError(
          400,
          "Validity End date cannot be earlier than Validity Start date"
        )
      );
    }

    const license = await licenseModel.findOneAndUpdate(
       { _id: id, isDeleted: false },
      req.body,
      {
        new: true,
        runValidators: true, // ensures schema validation is applied
        context: "query",    // custom validators me `this` kaam kare
      }
    );

    return res.status(200).json({
      success: true,
      message: "License updated successfully",
      data: license,
    });
  } catch (error) {
    next(error);
  }
};

//  Patch License (sirf Manager aur HOD kar sakte hain)
export const patchLicense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { department, role, name, employeeId } = req.body;

    const query = { _id: id, isDeleted: false };

    // 1. Required fields validation
    if (!employeeId || !name || !department || !role) {
      return next(
        new ApiError(400, "All fields (employeeId, name, department, role) are required")
      );
    }

    // 2. License exist karta hai ya nahi
    const license = await licenseModel.findOne(query);
    if (!license) {
      return next(new ApiError(404, "License not found or already deleted"));
    }

    // 3. Employee exist karta hai ya nahi
    const employee = await registrationModel.findById(employeeId);
    if (!employee) {
      return next(new ApiError(404, "Employee not found"));
    }

    // 4. Agar same employee already assigned hai → Block  license.assignedTo?.employeeId?.toString() === employeeId &&
    if (
      license.assignedTo?.department === department &&
      license.assignedTo?.role === role &&
      license.assignedTo?.name === name
    ) {
      return next(new ApiError(400, "This license is already assigned to this employee"));
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
    if (!license.assignedTo || !license.assignedTo.employeeId) {
      // First time assign
      license.assignedTo = newAssignment;
      statusCode = 201; // Created
    } else {
      // Move current to history (deep copy)
      license.reassignments.push({
        department: license.assignedTo.department,
        role: license.assignedTo.role,
        name: license.assignedTo.name,
        employeeId: license.assignedTo.employeeId,
        date: license.assignedTo.date || new Date(),
      });

      // Set new assignment
      license.assignedTo = newAssignment;
      statusCode = 200; // Updated
    }

    // 7. Save changes
    const updatedLicense = await license.save();

    return res.status(statusCode).json({
      success: true,
      message:
        statusCode === 201
          ? "License assigned successfully"
          : "License reassigned successfully",
      data: updatedLicense,
    });
  } catch (error) {
    next(error);
  }
};


// Soft Delete License
export const softDeleteLicense = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError(400, "Invalid License ID"));
    }

    // Check if license exists and not already deleted
    const license = await licenseModel.findOne({ _id: id, isDeleted: false });
    if (!license) {
      return next(new ApiError(404, "License not found or already deleted"));
    }

    // Soft delete: set isDelete = true
    license.isDeleted = true;
    await license.save();

    res.status(200).json({
      success: true,
      message: "License soft deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Hard Delete License
export const hardDeleteLicense = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError(400, "Invalid License ID"));
    }

    const license = await licenseModel.findByIdAndDelete(id);
    if (!license) {
      return next(new ApiError(404, "License not found or has been deleted already"));
    }

    res.status(200).json({
      success: true,
      message: "License permanently deleted",
    });
  } catch (error) {
    next(error);
  }
};

