import express from "express";
import {
  createVertical,
  getAllVerticals,
  getVerticalById,
  updateVertical,
  softDeleteVertical,
  deleteVerticalPermanently,
} from "../controllers/vertical.controller.js";

const router = express.Router();

router.post("/", createVertical);
router.get("/", getAllVerticals);
router.get("/:id", getVerticalById);
router.put("/:id", updateVertical);
router.delete("/:id", softDeleteVertical);
router.delete("/permanent/:id", deleteVerticalPermanently);

export default router;
