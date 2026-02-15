import express from "express";
import {
  createBranch,
  getAllBranches,
  getBranchById,
  updateBranch,
  softDeleteBranch,
  deleteBranchPermanently,
  getBranchesByCityId,
} from "../../controllers/masters/branch.controller.js";

const router = express.Router();

router.post("/", createBranch);
router.get("/", getAllBranches);
router.get("/:id", getBranchById);
router.put("/:id", updateBranch);
router.delete("/:id", softDeleteBranch);
router.get("/city/:id",getBranchesByCityId)
router.delete("/permanent/:id", deleteBranchPermanently);

export default router;
