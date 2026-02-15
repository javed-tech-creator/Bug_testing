import express from "express";
import {
  createEmployeeProfile,
  getAllEmployees,
  getEmployeeById,
  deleteEmployee,
  updateEmployeeProfile,
  updateEmployeeDocuments,
  getEmployeeGrowth,
} from "../../controllers/onboarding/employeeProfile.controller.js";
import upload from "../../middlewares/multer.middleware.js";
import { fileValidator } from "../../middlewares/fileValidator.middleware.js";
const router = express.Router();
router.post(
  "/",
  upload("EmployeeProfile").fields([
    { name: "photo", maxCount: 1 },
    { name: "documents", maxCount: 10 },
  ]),
  fileValidator({ types: ["image", "pdf"], maxSizeMB: 10 }),
  createEmployeeProfile
);
router.get("/growth", getEmployeeGrowth);
router.get("/", getAllEmployees);
router.get("/:id", getEmployeeById);
router.put(
  "/:id",
  upload("EmployeeProfile").fields([{ name: "photo", maxCount: 1 }]),
  fileValidator({ types: ["image"], maxSizeMB: 5 }),
  updateEmployeeProfile
);

router.put(
  "/:id/documents",
  upload("EmployeeDocuments").array("documents", 10),
  fileValidator({ types: ["image", "pdf"], maxSizeMB: 10 }),
  updateEmployeeDocuments
);

router.delete("/:id", deleteEmployee);

export default router;
