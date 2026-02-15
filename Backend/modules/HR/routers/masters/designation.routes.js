import express from "express";
import {
  createDesignation,
  getAllDesignations,
  getDesignationById,
  updateDesignation,
  softDeleteDesignation,
  deleteDesignationPermanently,
  getDesignationsByDepartmentId
} from "../../controllers/masters/designation.controller.js";

const router = express.Router();

router.post("/", createDesignation);
router.get("/", getAllDesignations);
router.get("/:id", getDesignationById);
router.put("/:id", updateDesignation);
router.delete("/:id", softDeleteDesignation);
router.delete("/permanent/:id", deleteDesignationPermanently);
router.get("/department/:id", getDesignationsByDepartmentId);

export default router;
