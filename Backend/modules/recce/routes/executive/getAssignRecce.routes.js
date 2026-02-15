import express from "express";

import { authWithPermissions } from "../../../../middlewares/master/authMiddleware.js";
import {
  executiveNextDayPlanningList,
  executiveRecceReceivedConfirmation,
  getExecutiveAssignedRecce,
  getUpcomingRecceList,
} from "../../controllers/executive/recceAssignmentRequest.controller.js";

const recceExecutiveRoute = express.Router();

recceExecutiveRoute.get(
  "/recce-all-by-decision",
  authWithPermissions(),
  getExecutiveAssignedRecce,
);

recceExecutiveRoute.post(
  "/recce-received-confirmation",
  authWithPermissions(),
  executiveRecceReceivedConfirmation,
);

recceExecutiveRoute.get(
  "/next-day-planning-list",
  authWithPermissions(),
  executiveNextDayPlanningList,
);

recceExecutiveRoute.get(
  "/upcoming-recce-list",
  authWithPermissions(),
  getUpcomingRecceList,
);

export default recceExecutiveRoute;
