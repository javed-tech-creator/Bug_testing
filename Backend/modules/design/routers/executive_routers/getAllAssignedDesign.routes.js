import express from "express";
import { authWithPermissions } from "../../../../middlewares/master/authMiddleware.js";
import { executiveDesignReceivedConfirmation, executiveNextDayPlanningList, getExecutiveAssignedDesigns, getUpcomingDesignRequests } from "../../controllers/executive/getExecutiveAssignedDesigns.controller.js";
const router = express.Router();

router.get(
  "/all-assigned",
  authWithPermissions(),
  getExecutiveAssignedDesigns,
);

router.post(
  "/received-confirmation",
  authWithPermissions(),
  executiveDesignReceivedConfirmation,
);

router.get(
  "/next-day-planning",
  authWithPermissions(),
  executiveNextDayPlanningList,
);

router.get(
  "/upcoming-designs",
  authWithPermissions(),
  getUpcomingDesignRequests,
);

export default router;
