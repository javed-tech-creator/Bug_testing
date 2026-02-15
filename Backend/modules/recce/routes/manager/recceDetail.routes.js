import express from "express";
const recceDetailRoute = express.Router();

import recceController from "../../controllers/recceDetail.controller.js";
import { authWithPermissions } from "../../../../middlewares/master/authMiddleware.js";

recceDetailRoute.post(
  "/create",
  authWithPermissions(),
  recceController.createRecceByCoordinator,
);
recceDetailRoute.get(
  "/all-list",
  authWithPermissions(),
  recceController.getAllRecceByDecision,
);
recceDetailRoute.post(
  "/decision-response",
  authWithPermissions(),
  recceController.recceDecisionResponse,
);
export default recceDetailRoute;
