import express from "express";

import { authWithPermissions } from "../../../../middlewares/master/authMiddleware.js";
import { getDesignDashboardStats, getUnderModificationCount } from "../../controllers/manager/designDashboardData.controller.js";
const router = express.Router();

router.get("/stats-count", authWithPermissions(), getDesignDashboardStats);
router.get("/under-modification", authWithPermissions(), getUnderModificationCount);

export default router;


