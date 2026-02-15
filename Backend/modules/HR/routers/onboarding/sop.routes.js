import express from "express";
import Upload from "../../../../middlewares/master/multer.middleware.js";
import { fileValidator } from "../../../../middlewares/master/fileValidator.middleware.js";
import {
  createSOP,
  getAllSOPs,
  getSOPById,
  updateSOP,
  deleteSOP,
  updateSOPStatus,
  deleteSopFile, 
} from "../../controllers/onboarding/sop.controller.js";

const router = express.Router();

// ✅ Setup multer for "sop" folder
const upload = Upload("sop");

// ✅ Routes

// 📁 Create SOP with file upload validation
router.post(
  "/",
  upload.array("files", 5),
  fileValidator({ types: ["image", "pdf"], maxSizeMB: 10 }),
  createSOP
);

// 📄 Get all SOPs
router.get("/", getAllSOPs);

// 🔍 Get SOP by ID
router.get("/:id", getSOPById);

// ✏️ Update SOP (with optional new files)
router.put(
  "/:id",
  upload.array("files", 5),
  fileValidator({ types: ["image", "pdf"], maxSizeMB: 10 }),
  updateSOP
);

// 🗑️ Delete entire SOP
router.delete("/:id", deleteSOP);

// ⚙️ Update SOP Status (Active / Inactive / Archived)
router.patch("/:id/status", updateSOPStatus);

// 🧹 Delete a specific file from an SOP (optional route)
router.delete("/:sopId/file/:fileId", deleteSopFile);

import { getSOPByDesignationId } from "../../controllers/onboarding/sop.controller.js";

router.get("/designation/:designationId", getSOPByDesignationId);

export default router;
