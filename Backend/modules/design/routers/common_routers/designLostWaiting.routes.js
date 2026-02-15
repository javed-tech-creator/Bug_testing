
import express from "express";
import { getDesignStatusList } from "../../controllers/common/designLostWaiting.controller.js";
import { authWithPermissions } from "../../../../middlewares/master/authMiddleware.js";

const router = express.Router();

router.get("/", authWithPermissions(), getDesignStatusList);

export default router;
