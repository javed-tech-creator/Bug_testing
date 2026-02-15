import express from "express";

import { authWithPermissions } from "../../../../middlewares/master/authMiddleware.js";
import { getRecceStatusList } from "../../controllers/common/getRecceLostWaiting.controller.js";

const recceWaitingLostRoute = express.Router();

recceWaitingLostRoute.get("/waiting-or-lost-recce", authWithPermissions(), getRecceStatusList);

export default recceWaitingLostRoute;
