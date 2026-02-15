import express from "express";
import { authWithPermissions } from "../../../../middlewares/master/authMiddleware.js";
import { markDesignAsStarted } from "../../controllers/common/designMarkAsStarted.controller.js";
const router = express.Router();

router.post("/", authWithPermissions(), markDesignAsStarted);

export default router;