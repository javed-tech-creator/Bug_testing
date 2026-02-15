import express from "express";
import { getAssignedDesignsByStatus, updatePlanningDesignStatus } from "../../controllers/projectmoduleapi/projectModuleApi.controller.js";
import { authWithPermissions } from "../../../../middlewares/master/authMiddleware.js";


const router = express.Router();

/**
 * @route   GET /api/designs/assigned
 * @query   status=on_track | not_on_track
 * @query   page, limit
 * @access  Protected
 */
router.get(
  "/active-product",
  authWithPermissions,
  getAssignedDesignsByStatus,
);

router.patch(
  "/:id/status",
  authWithPermissions,
  updatePlanningDesignStatus,
);


export default router;
