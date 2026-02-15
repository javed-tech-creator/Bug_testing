import express from "express";
const recceAssignRoute = express.Router();

import recceController from "../../controllers/recceDetail.controller.js";
import { authWithPermissions } from "../../../../middlewares/master/authMiddleware.js";
import {
  approveOrRejectPlanByManager,
  assignRecce,
  getAssignedRecceList,
  getExecutivesListForAssignment,
  getManagerNextDayPlanningList,
  getManagerTeamFlagOrDeclineRecce,
} from "../../controllers/recceAssigned.controller.js";

recceAssignRoute.get(
  "/get-executives-list",
  authWithPermissions(),
  getExecutivesListForAssignment,
);

recceAssignRoute.post("/recce-assigned", authWithPermissions(), assignRecce);

recceAssignRoute.get(
  "/self-or-team",
  authWithPermissions(),
  getAssignedRecceList,
);

recceAssignRoute.get(
  "/manager-next-day-planning",
  authWithPermissions(),
  getManagerNextDayPlanningList,
);

recceAssignRoute.patch(
  "/approve-or-reject-plan/:id",
  authWithPermissions(),
  approveOrRejectPlanByManager,
);

recceAssignRoute.get(
  "/manager-team-flag-or-decline-recce",
  authWithPermissions(),
  getManagerTeamFlagOrDeclineRecce,
);

export default recceAssignRoute;
