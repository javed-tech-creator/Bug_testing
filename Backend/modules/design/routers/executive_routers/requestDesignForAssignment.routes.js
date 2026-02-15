import express from "express";
import { authWithPermissions } from "../../../../middlewares/master/authMiddleware.js";
import { getDesignAssignmentRequests, requestDesignAssignment } from "../../controllers/executive/requestedDesignForAssign.controller.js";
const router = express.Router();

router.post("/", authWithPermissions(), requestDesignAssignment);
router.get("/:id", authWithPermissions(), getDesignAssignmentRequests);


export default router;