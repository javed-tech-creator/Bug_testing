import express from "express";
import {
  createActionGroup,
  getAllActionGroups,
  getActionGroupById,
  updateActionGroup,
  deleteActionGroup,
  getActionGroupsByDepartment
} from "../../controllers/masters/actionGroup.controller.js";

const router = express.Router();

router.post("/", createActionGroup);
router.get("/", getAllActionGroups);
router.get("/:id", getActionGroupById);
router.put("/:id", updateActionGroup);
router.delete("/:id", deleteActionGroup);
router.get("/department/:id", getActionGroupsByDepartment);

export default router;
