import express from "express";
import { authWithPermissions } from "../../../../middlewares/master/authMiddleware.js";
import {
  approveOrRejectPlanByManager,
  assignDesign,
  getManagerAssignedDesigns,
  getManagerNextDayPlanningList,
  getManagerTeamFlagOrDeclineDesigns,
  reassignDesign,
} from "../../controllers/manager/designAssigned.controller.js";
const router = express.Router();

router.post("/assign", authWithPermissions(), assignDesign);
router.post("/reassign", authWithPermissions(), reassignDesign);
router.get("/manager-self", authWithPermissions(), getManagerAssignedDesigns);
router.get(
  "/assigned/next-day-planning",
  authWithPermissions(),
  getManagerNextDayPlanningList,
);

router.patch(
  "/:id/plan-approval",
  authWithPermissions(),
  approveOrRejectPlanByManager,
);

router.get("/team-decline-lost", authWithPermissions(), getManagerTeamFlagOrDeclineDesigns);


export default router;
