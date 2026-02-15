import express from "express";
import {
  createState,
  getAllStates,
  getStateById,
  updateState,
  softDeleteState,
  deleteStatePermanently,
  getStatesByZoneId
} from "../../controllers/masters/state.controller.js";

const router = express.Router();

router.post("/", createState);
router.get("/", getAllStates);
router.get("/:id", getStateById);
router.put("/:id", updateState);
router.delete("/:id", softDeleteState);
router.delete("/permanent/:id", deleteStatePermanently);
router.get("/zone/:id", getStatesByZoneId);

export default router;
