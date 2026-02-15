import express from "express";

import { authWithPermissions } from "../../../../middlewares/master/authMiddleware.js";
import { recceTodayList } from "../../controllers/common/getTodayPlannedRecce.controller.js";
const recceTodayRoute = express.Router();

recceTodayRoute.get("/today-planned-recce", authWithPermissions(), recceTodayList);

export default recceTodayRoute;
