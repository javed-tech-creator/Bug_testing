import mongoose from "mongoose";
import EmployeeProfile from "../../models/onboarding/employeeProfile.model.js";
import ApiError from "../../../../utils/master/ApiError.js";
import { uploadFiles, deleteFile, deleteLocalFile } from "../../../../utils/master/cloudinary.js";
import Training from "../../models/onboarding/training.model.js";

// Create Training
export const createTraining = async (req, res, next) => {
  let uploadedFiles = [];
  try {
    const {
      employeeId,
      trainingName,
      trainingType,
      trainingPeriod,
      trainingStartDate,
      trainingEndDate,
      mentorName,
      remark,
      status,
      isMandatory
    } = req.body;

    if (!employeeId || !trainingName || !trainingPeriod) {
      return next(new ApiError(400, "EmployeeId, trainingName, trainingPeriod are required"));
    }

    if (!mongoose.isValidObjectId(employeeId)) {
      return next(new ApiError(400, "Invalid Employee ID"));
    }

    const employeeExists = await EmployeeProfile.findById(employeeId);
    if (!employeeExists) return next(new ApiError(404, "Employee not found"));

    // --- Handle Materials Upload ---
    let materialsData = [];
    if (req.files?.materials && req.files.materials.length > 0) {
      let result;
      if (process.env.USE_CLOUDINARY === "true") {
        result = await uploadFiles(req.files.materials);
        if (!result.success || !result.files.length) {
          return next(new ApiError(400, "Unable to upload training materials"));
        }
      } else {
        result = {
          success: true,
          files: req.files.materials.map((f) => ({
            url: f?.path?.replace(/\\/g, "/"),
            public_url: null,
            public_id: null,
          })),
        };
      }
      materialsData = result.files;
      uploadedFiles.push(...materialsData);
    }

    // --- Handle Certificate Upload ---
    // let certificateData = null;
    // if (req.files?.certificate && req.files.certificate[0]) {
    //   let result;
    //   if (process.env.USE_CLOUDINARY === "true") {
    //     result = await uploadFiles([req.files.certificate[0]]);
    //     if (!result.success || !result.files[0].url) {
    //       return next(new ApiError(400, "Unable to upload certificate"));
    //     }
    //   } else {
    //     result = {
    //       success: true,
    //       files: [
    //         {
    //           url: req.files.certificate[0]?.path?.replace(/\\/g, "/"),
    //           public_url: null,
    //           public_id: null,
    //         },
    //       ],
    //     };
    //   }
    //   certificateData = result.files[0];
    //   uploadedFiles.push(certificateData);
    // }

    const training = new Training({
      employeeId,
      trainingName,
      trainingType,
      trainingPeriod,
      trainingStartDate,
      trainingEndDate,
      mentorName,
      materials: materialsData,
      remark,
      status,
      isMandatory,
    });

    const saved = await training.save();
    return res.api(201, "Training created successfully", saved);
  } catch (err) {
    // --- Rollback uploaded files if save failed ---
    for (const file of uploadedFiles) {
      if (file?.public_id) await deleteFile(file.public_id).catch(() => {});
      if (file?.url) deleteLocalFile(file.url).catch(() => {});
    }
    return next(new ApiError(500, err?.message || "Internal Server Error"));
  }
};

// Get All Trainings
export const getAllTrainings = async (req, res, next) => {
  try {
    const trainings = await Training.find().populate("employeeId", "name email phone");
    if (!trainings.length) {
      return next(new ApiError(404, "No trainings found"));
    }
    return res.api(200, "Trainings fetched successfully", trainings);
  } catch (err) {
    return next(new ApiError(500, err?.message || "Internal Server Error"));
  }
};

// Get Training by ID
export const getTrainingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError(400, "Invalid Training ID"));
    }

    const training = await Training.findById(id).populate("employeeId", "name email phone");
    if (!training) return next(new ApiError(404, "Training not found"));

    return res.api(200, "Training fetched successfully", training);
  } catch (err) {
    return next(new ApiError(500, err?.message || "Internal Server Error"));
  }
};

// Update Training
export const updateTraining = async (req, res, next) => {
  let uploadedFiles = [];
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid Training ID"));
    }

    const training = await Training.findById(id);
    if (!training) {
      return next(new ApiError(404, "Training not found"));
    }

    const updateData = { ...req.body };

    // --- Materials Upload Handling ---
    if (req.files?.materials && req.files.materials.length > 0) {
      let result;
      if (process.env.USE_CLOUDINARY === "true") {
        result = await uploadFiles(req.files.materials);
        if (!result.success || !result.files.length) {
          return next(new ApiError(400, "Unable to upload materials"));
        }
      } else {
        result = {
          success: true,
          files: req.files.materials.map((f) => ({
            url: f?.path?.replace(/\\/g, "/"),
            public_url: null,
            public_id: null,
          })),
        };
      }
      uploadedFiles.push(...result.files);

      // Replace old materials if flag given
      if (req.body.replaceMaterials === "true") {
        for (const doc of training.materials) {
          if (doc?.public_id) await deleteFile(doc.public_id).catch(() => {});
          if (doc?.url) await deleteLocalFile(doc.url).catch(() => {});
        }
        updateData.materials = result.files;
      } else {
        updateData.materials = [...training.materials, ...result.files];
      }
    }

    // --- Certificate Upload Handling ---
    // if (req.files?.certificate && req.files.certificate[0]) {
    //   let result;
    //   if (process.env.USE_CLOUDINARY === "true") {
    //     result = await uploadFiles([req.files.certificate[0]]);
    //     if (!result.success || !result.files[0].url) {
    //       return next(new ApiError(400, "Unable to upload certificate"));
    //     }
    //   } else {
    //     result = {
    //       success: true,
    //       files: [
    //         {
    //           url: req.files.certificate[0]?.path?.replace(/\\/g, "/"),
    //           public_url: null,
    //           public_id: null,
    //         },
    //       ],
    //     };
    //   }
    //   uploadedFiles.push(result.files[0]);

    //   // Delete old certificate
    //   if (training.certificate?.public_id) await deleteFile(training.certificate.public_id).catch(() => {});
    //   if (training.certificate?.url) await deleteLocalFile(training.certificate.url).catch(() => {});

    //   updateData.certificate = result.files[0];
    // }

    const updatedTraining = await Training.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedTraining) {
      // rollback
      for (const file of uploadedFiles) {
        if (file?.public_id) await deleteFile(file.public_id).catch(() => {});
        if (file?.url) deleteLocalFile(file.url).catch(() => {});
      }
      return next(new ApiError(500, "Failed to update Training"));
    }

    return res.api(200, "Training updated successfully", updatedTraining);
  } catch (err) {
    for (const file of uploadedFiles) {
      if (file?.public_id) await deleteFile(file.public_id).catch(() => {});
      if (file?.url) deleteLocalFile(file.url).catch(() => {});
    }
    return next(new ApiError(500, err?.message || "Internal Server Error"));
  }
};

// Delete Training
export const deleteTraining = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid Training ID"));
    }

    const training = await Training.findByIdAndDelete(id);
    if (!training) return next(new ApiError(404, "Training not found"));

    // Delete attached files
    for (const doc of training.materials) {
      if (doc?.public_id) await deleteFile(doc.public_id).catch(() => {});
      if (doc?.url) deleteLocalFile(doc.url).catch(() => {});
    }
    if (training.certificate?.public_id) await deleteFile(training.certificate.public_id).catch(() => {});
    if (training.certificate?.url) deleteLocalFile(training.certificate.url).catch(() => {});

    return res.api(200, "Training deleted successfully");
  } catch (err) {
    return next(new ApiError(500, err?.message || "Internal Server Error"));
  }
};

// Get Training by EmployeeId
export const getTrainingByEmployeeId = async (req, res, next) => {
  try {
    const { employeeId } = req.params;

    if (!mongoose.isValidObjectId(employeeId)) {
      return next(new ApiError(400, "Invalid Employee ID"));
    }

    const training = await Training.findOne({ employeeId })
      .populate("employeeId", "name email phone");

    if (!training) {
      return next(new ApiError(404, "No training found for this employee"));
    }

    return res.api(200, "Training fetched successfully", training);
  } catch (err) {
    return next(new ApiError(500, err?.message || "Internal Server Error"));
  }
};
