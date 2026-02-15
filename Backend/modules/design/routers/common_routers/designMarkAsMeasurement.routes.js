import express from "express";
import { authWithPermissions } from "../../../../middlewares/master/authMiddleware.js";
import { markMeasurementStarted } from "../../controllers/common/designMarkAsMeasurementStarted.controller.js";
const router = express.Router();

router.post("/:id", authWithPermissions(), markMeasurementStarted);

export default router;

