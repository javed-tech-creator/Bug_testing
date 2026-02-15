import express from "express";
import { assignMonthlyTarget, getTargetAchievementSummary, getTargetDetails, getTargetsByDepartment } from "../controllers/target/monthlyTarget.controller.js";
import { saveSlotTarget, updateSlotTarget } from "../controllers/target/slotTarget.controller.js";

const router = express.Router();

//slot target routes
router.post("/slot", saveSlotTarget);
router.put("/slot/:slotId", updateSlotTarget);


//monthly target routes
router.post("/assign", assignMonthlyTarget);
router.get("/details", getTargetDetails);
router.get("/department", getTargetsByDepartment);
router.get("/summary", getTargetAchievementSummary);

export default router;
