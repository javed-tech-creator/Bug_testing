import express from "express";

import { authWithPermissions } from "../../../middlewares/master/authMiddleware.js";
import { getMorningReport, getTeamStatus, getTodayReportDetail, getTodayReportStatus, submitEveningReport, submitManagerReport, submitMorningReport } from "../controllers/reporting/dailyReport.controller.js";

const router = express.Router();
// Executive routes
router.post("/morning",  authWithPermissions(), submitMorningReport);
router.post("/evening", authWithPermissions(), submitEveningReport);
router.get("/status",  authWithPermissions(), getTodayReportStatus);
router.get("/morning", authWithPermissions(), getMorningReport);
router.get("/today",authWithPermissions(),getTodayReportDetail);

// Manager routes
router.get("/team/status", authWithPermissions(), getTeamStatus);
router.post("/manager", authWithPermissions(), submitManagerReport);

export default router;