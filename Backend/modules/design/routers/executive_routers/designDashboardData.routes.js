import express from "express";
import { getExecutiveDashboardStats } from "../../controllers/executive/designDashboardData.controller.js";

import { authWithPermissions } from "../../../../middlewares/master/authMiddleware.js";
const router = express.Router();

router.get("/stats-count", authWithPermissions(), getExecutiveDashboardStats);

export default router;
