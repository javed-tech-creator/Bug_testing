import express from "express";
import { authWithPermissions } from "../../../../middlewares/master/authMiddleware.js";
import { markAsMockupStarted } from "../../controllers/common/designMarkAsMockupStarted.controller.js";
const router = express.Router();

router.post("/:id", authWithPermissions(), markAsMockupStarted);

export default router;
