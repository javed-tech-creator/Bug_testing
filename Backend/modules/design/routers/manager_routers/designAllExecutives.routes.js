import express from "express";
import { authWithPermissions } from "../../../../middlewares/master/authMiddleware.js";
import { getExecutivesForAssignment } from "../../controllers/manager/designAllExecutives.controller.js";
const router = express.Router();

router.get("/", authWithPermissions(), getExecutivesForAssignment);

export default router;
