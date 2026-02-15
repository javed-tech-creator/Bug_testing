import mongoose from "mongoose";
import EmployeeProfile from "../../models/onboarding/employeeProfile.model.js";
import Candidate from "../../models/onboarding/candidate.model.js";
import ApiError from "../../../../utils/master/ApiError.js";
import {
  uploadFiles,
  deleteFile,
  deleteLocalFile,
} from "../../../../utils/master/cloudinary.js";

// Create EmployeeProfile
export const createEmployeeProfile = async (req, res, next) => {
  let uploadedFiles = []; // track uploaded files for rollback
  try {
    console.log("📌 CREATE EMPLOYEE REQ BODY --->", req.body);
    const {
      candidateId,
      name,
      email,
      workEmail,
      phone,
      alternateNo,
      whatsapp,
      dob,
      gender,
      qualification,
      maritalStatus,
      bloodGroup,
      currentAddress,
      permanentAddress,
      country,
      state,
      city,
      emergencyContact,
      joiningDate,
      employeeType,
      trainingPeriod,
      probationPeriod,
      workLocation,
      salary,
      bankDetail,
      pfAccountNo,
      uan,
      esicNo,
      branchId,
      departmentId,
      designationId,
      zoneId,
      stateId,
      cityId,
    } = req.body;

    // Normalize candidateId to null if empty string
    const sanitizedCandidateId = candidateId && String(candidateId).trim() !== "" ? candidateId : null;

    console.log()
    if (!name || !email || !phone || !joiningDate) {
      return next(
        new ApiError(400, "Name, email, phone and joiningDate are required")
      );
    }

    console.log("candidateId received --->", sanitizedCandidateId);
    if (sanitizedCandidateId && !mongoose.isValidObjectId(sanitizedCandidateId)) {
      return next(new ApiError(400, "Invalid Candidate ID"));
    }

    if (sanitizedCandidateId) {
      const candidateExists = await Candidate.findById(sanitizedCandidateId);
      console.log("📌 Candidate found --->", candidateExists);
      if (!candidateExists) return next(new ApiError(404, "Candidate not found"));
    } else {
      console.log("📌 No candidateId provided → Skipping Candidate lookup");
    }
    const refFields = {
      branchId: "Branch",
      departmentId: "Department",
      designationId: "Designation",
      zoneId: "Zone",
      stateId: "State",
      cityId: "City",
    };

    for (const [field, modelName] of Object.entries(refFields)) {
      const val = req.body[field];
      if (val) {
        if (!mongoose.isValidObjectId(val)) {
          return next(new ApiError(400, `Invalid ${field} ID`));
        }
        const exists = await mongoose.model(modelName).findById(val);
        if (!exists) {
          return next(new ApiError(404, `${modelName} not found`));
        }
      }
    }

    // --- Handle Photo Upload ---
    let photoData = null;
    if (req.files?.photo && req.files.photo[0]) {
      let result;
      if (process.env.USE_CLOUDINARY === "true") {
        result = await uploadFiles([req.files.photo[0]]);
        if (!result.success || !result.files[0].url) {
          return next(new ApiError(400, "Unable to upload photo"));
        }
      } else {
        result = {
          success: true,
          files: [
            {
              url: req.files.photo[0]?.path?.replace(/\\/g, "/"),
              public_url: null,
              public_id: null,
            },
          ],
        };
      }
      photoData = result.files[0];
      uploadedFiles.push(photoData);
    }

    // --- Handle Documents Upload ---
    let documentsData = [];
    if (req.files?.documents && req.files.documents.length > 0) {
      let result;
      if (process.env.USE_CLOUDINARY === "true") {
        result = await uploadFiles(req.files.documents);
        if (!result.success || !result.files.length) {
          return next(new ApiError(400, "Unable to upload documents"));
        }
      } else {
        result = {
          success: true,
          files: req.files.documents.map((f) => ({
            url: f?.path?.replace(/\\/g, "/"),
            public_url: null,
            public_id: null,
          })),
        };
      }
      documentsData = result.files.map((f, idx) => ({
        type: req.body.documentTypes?.[idx] || "Other", // client se aana chahiye
        ...f,
      }));
      uploadedFiles.push(...documentsData);
    }

    const employee = new EmployeeProfile({
      candidateId: sanitizedCandidateId ? sanitizedCandidateId : undefined,
      name,
      email,
      workEmail,
      phone,
      alternateNo,
      whatsapp,
      dob,
      gender,
      qualification,
      maritalStatus,
      bloodGroup,
      currentAddress,
      permanentAddress,
      country,
      state,
      city,
      emergencyContact,
      joiningDate,
      employeeType,
      trainingPeriod,
      probationPeriod,
      workLocation,
      salary,
      bankDetail,
      pfAccountNo,
      uan,
      esicNo,
      photo: photoData,
      documents: documentsData,
      branchId,
      departmentId,
      designationId,
      zoneId,
      stateId,
      cityId,
    });

    console.log("📌 Final employee payload --->", employee);
    const saved = await employee.save();
    return res.api(201, "Employee profile created successfully", saved);
  } catch (err) {
    console.error("❌ ERROR IN createEmployeeProfile --->", err);
    // --- Rollback uploaded files if save failed ---
    for (const file of uploadedFiles) {
      if (file?.public_id) await deleteFile(file.public_id).catch(() => {});
      if (file?.url) deleteLocalFile(file.url).catch(() => {});
    }
    return next(new ApiError(500, err?.message || "Internal Server Error"));
  }
};

// Get All Employee Profiles
export const getAllEmployees = async (req, res, next) => {
  try {
    const employees = await EmployeeProfile.find()
      .populate("candidateId", "name email")
      .populate("branchId", "title name")
      .populate("departmentId", "title name")
      .populate("designationId", "title name")
      .populate("zoneId", "title name")
      .populate("stateId", "title name")
      .populate("cityId", "title name");

    if (!employees.length) {
      return next(new ApiError(404, "No employees found"));
    }

    return res.api(200, "Employees fetched successfully", employees);
  } catch (err) {
    return next(new ApiError(500, err?.message || "Internal Server Error"));
  }
};

// Get Employee Growth (Dynamic based on data)
export const getEmployeeGrowth = async (req, res, next) => {
  try {
    const employees = await EmployeeProfile.find({}, { joiningDate: 1 });

    if (!employees.length) {
      return res.api(200, "No employees found", []);
    }

    const monthMap = {};

    employees.forEach((emp) => {
      if (!emp.joiningDate) return;

      const d = new Date(emp.joiningDate);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

      if (!monthMap[key]) monthMap[key] = 0;
      monthMap[key]++;
    });

    const result = Object.keys(monthMap)
      .sort()
      .map((m) => ({
        month: m,
        count: monthMap[m],
      }));

    return res.api(200, "Employee growth fetched successfully", result);
  } catch (err) {
    return next(new ApiError(500, err?.message || "Internal Server Error"));
  }
};

// Get Employee by ID
export const getEmployeeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError(400, "Invalid Employee ID"));
    }

    const employee = await EmployeeProfile.findById(id)
      .populate("candidateId", "title email")
      .populate("branchId", "title")
      .populate("departmentId", "title")
      .populate("designationId", "title")
      .populate("zoneId", "title")
      .populate("stateId", "title")
      .populate("cityId", "title");

    if (!employee) return next(new ApiError(404, "Employee not found"));

    return res.api(200, "Employee fetched successfully", employee);
  } catch (err) {
    return next(new ApiError(500, err?.message || "Internal Server Error"));
  }
};

// Delete Employee Profile
export const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError(400, "Invalid Employee ID"));
    }

    const employee = await EmployeeProfile.findByIdAndDelete(id);
    if (!employee) return next(new ApiError(404, "Employee not found"));

    if (employee.photo?.public_id)
      await deleteFile(employee.photo.public_id).catch(() => {});
    if (employee.photo?.url)
      deleteLocalFile(employee.photo.url).catch(() => {});

    return res.api(200, "Employee profile deleted successfully");
  } catch (err) {
    return next(new ApiError(500, err?.message || "Internal Server Error"));
  }
};

// Update Employee Profile
export const updateEmployeeProfile = async (req, res, next) => {
  let uploadedFiles = [];
  try {
    const { id } = req.params;
    console.log(id);
    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid Employee ID"));
    }

    const employee = await EmployeeProfile.findById(id);
    if (!employee) {
      return next(new ApiError(404, "Employee not found"));
    }

    const updateData = { ...req.body };
    // Normalize empty strings to undefined to prevent ObjectId casting errors
    for (const key in updateData) {
      if (updateData[key] === "") {
        updateData[key] = undefined;
      }
    }
    const refFields = {
      branchId: "Branch",
      departmentId: "Department",
      designationId: "Designation",
      zoneId: "Zone",
      stateId: "State",
      cityId: "City",
    };

    // Validate & verify references
    for (const [field, modelName] of Object.entries(refFields)) {
      if (updateData[field]) {
        if (!mongoose.isValidObjectId(updateData[field])) {
          return next(new ApiError(400, `Invalid ${field} ID`));
        }

        const exists = await mongoose
          .model(modelName)
          .findById(updateData[field]);
        if (!exists) {
          return next(new ApiError(404, `${modelName} not found`));
        }
      }
    }

    // --- Photo Upload Handling ---
    if (req.files?.photo && req.files.photo[0]) {
      let result;
      if (process.env.USE_CLOUDINARY === "true") {
        result = await uploadFiles([req.files.photo[0]]);
        if (!result.success || !result.files[0].url) {
          return next(new ApiError(400, "Unable to upload new photo"));
        }
      } else {
        result = {
          success: true,
          files: [
            {
              url: req.files.photo[0]?.path?.replace(/\\/g, "/"),
              public_url: null,
              public_id: null,
            },
          ],
        };
      }

      uploadedFiles.push(result.files[0]);
      updateData.photo = result.files[0];
      try {
        if (employee.photo?.public_id)
          await deleteFile(employee.photo.public_id);
        if (employee.photo?.url) await deleteLocalFile(employee.photo.url);
      } catch (e) {
        console.error("Delete old photo error:", e.message);
      }
    }

    const updatedEmployee = await EmployeeProfile.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedEmployee) {
      // rollback
      for (const file of uploadedFiles) {
        if (file?.public_id) await deleteFile(file.public_id).catch(() => {});
        if (file?.url) deleteLocalFile(file.url).catch(() => {});
      }
      return next(new ApiError(500, "Failed to update Employee Profile"));
    }

    return res.api(
      200,
      "Employee profile updated successfully",
      updatedEmployee
    );
  } catch (err) {
    console.log(err);
    for (const file of uploadedFiles) {
      if (file?.public_id) await deleteFile(file.public_id).catch(() => {});
      if (file?.url) deleteLocalFile(file.url).catch(() => {});
    }
    return next(new ApiError(500, err?.message || "Internal Server Error"));
  }
};

// Update Employee Documents
export const updateEmployeeDocuments = async (req, res, next) => {
  let uploadedFiles = [];
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid Employee ID"));
    }

    const employee = await EmployeeProfile.findById(id);
    if (!employee) {
      return next(new ApiError(404, "Employee not found"));
    }

    console.log(req.files);

    if (!req.files || req.files.length === 0) {
      return next(new ApiError(400, "At least one document file is required"));
    }

    // Handle upload (Cloudinary or local)
    let result;
    if (process.env.USE_CLOUDINARY === "true") {
      result = await uploadFiles(req.files);
      if (!result.success || !result.files.length) {
        return next(new ApiError(400, "Unable to upload documents"));
      }
    } else {
      result = {
        success: true,
        files: req.files.map((f) => ({
          url: f?.path?.replace(/\\/g, "/"),
          public_url: null,
          public_id: null,
        })),
      };
    }

    uploadedFiles.push(...result.files);

    // Map uploaded files to their types from request (normalize type to lowercase)
    const newDocs = result.files.map((f, idx) => ({
      type: (req.body.documentTypes?.[idx]?.trim()?.toLowerCase()) || "other",
      ...f,
    }));

    if (req.body.replace === "true") {

      const uploadedTypes = newDocs.map((d) =>
        d.type?.trim()?.toLowerCase()
      );

      const remainingDocs = employee.documents.filter((doc) => {
        const existingType = doc.type?.trim()?.toLowerCase();
        return !uploadedTypes.includes(existingType);
      });

      // delete old docs with same types
      for (const doc of employee.documents) {
        const existingType = doc.type?.trim()?.toLowerCase();

        if (uploadedTypes.includes(existingType)) {
          if (doc?.public_id) await deleteFile(doc.public_id).catch(() => {});
          if (doc?.url) await deleteLocalFile(doc.url).catch(() => {});
        }
      }

      employee.documents = [...remainingDocs, ...newDocs];
    } else {
      // Append new documents
      employee.documents.push(...newDocs);
    }

    await employee.save();

    return res.api(200, "Employee documents updated successfully", employee);
  } catch (err) {
    // Cleanup uploaded files if error occurs
    for (const file of uploadedFiles) {
      if (file?.public_id) await deleteFile(file.public_id).catch(() => {});
      if (file?.url) await deleteLocalFile(file.url).catch(() => {});
    }
    return next(new ApiError(500, err?.message || "Internal Server Error"));
  }
};
