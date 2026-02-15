// routes/flagRaise.routes.js
import express from "express";
import { createFlagRaise, getFlagById, getFlagsByProject, updateFlagStatus } from "../../controllers/flag/flagRaise.controller.js";


const router = express.Router();

router.post("/",  createFlagRaise);
router.get("/:id", getFlagById);
router.patch("/:id/status", updateFlagStatus);
router.get("/project/:projectId", getFlagsByProject);

export default router;