import express from "express";
import { authWithPermissions } from "../../../../middlewares/master/authMiddleware.js";
import { designTodayList } from "../../controllers/common/designPlanningList.controller.js";

const router = express.Router();

router.get("/", authWithPermissions(), designTodayList);

export default router;
