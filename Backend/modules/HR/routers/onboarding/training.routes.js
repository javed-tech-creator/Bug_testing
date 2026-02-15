import express from "express";

import upload from "../../middlewares/multer.middleware.js";
import { fileValidator } from "../../middlewares/fileValidator.middleware.js";
import { createTraining, deleteTraining, getAllTrainings, getTrainingByEmployeeId, getTrainingById, updateTraining } from "../../controllers/onboarding/training.controller.js";

const router = express.Router();

// Create Training
router.post(
  "/",
  upload("Training").fields([
    { name: "materials", maxCount: 10 },
    // { name: "certificate", maxCount: 1 },
  ]),
  fileValidator({ types: ["image", "pdf"], maxSizeMB: 15 }),
  createTraining
);

// Get all trainings
router.get("/", getAllTrainings);

// Get training by ID
router.get("/:id", getTrainingById);

// Get training by EmployeeId
router.get("/employee/:employeeId", getTrainingByEmployeeId);
router.put(
  "/:id",
  upload("Training").fields([
    { name: "materials", maxCount: 10 },
    // { name: "certificate", maxCount: 1 },
  ]),
  fileValidator({ types: ["image", "pdf"], maxSizeMB: 15 }),
  updateTraining
);

// Delete training
router.delete("/:id", deleteTraining);

export default router;
