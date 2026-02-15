import express from "express";
import {
  getAssignedRecceByStatus,
  getWaitingDeclineByStatusList,
  updatePlanningRecceStatus,
  workPlanningForNextDayAndToday,
} from "../../controllers/projectModuleApi/projectModuleApi.controller.js";
import { authWithPermissions } from "../../../../middlewares/master/authMiddleware.js";
const projectRoute = express.Router();

projectRoute.get(
  "/get-active-assigned-recce",
  authWithPermissions(),
  getAssignedRecceByStatus,
);

projectRoute.patch(
  "/update-recce-planning-status/:id",
  authWithPermissions(),
  updatePlanningRecceStatus,
);

projectRoute.get(
  "/waiting-decline-list-by-status/:type",
  authWithPermissions(),
  getWaitingDeclineByStatusList,
);

projectRoute.post(
  "/work-planning-next-day-today",
  authWithPermissions(),
  workPlanningForNextDayAndToday,
);

export default projectRoute;
