import express from "express";
import {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  softDeleteDepartment,
  deleteDepartmentPermanently,
  getDepartmentsByBranchId,
} from "../../controllers/masters/department.controller.js";

const router = express.Router();

router.post("/", createDepartment);
router.get("/", getAllDepartments);
router.get("/:id", getDepartmentById);
router.put("/:id", updateDepartment);
router.delete("/:id", softDeleteDepartment);
router.delete("/permanent/:id", deleteDepartmentPermanently);
router.get("/branch/:id", getDepartmentsByBranchId);


export default router;
