import express from "express";
import { authWithPermissions } from "../../../middlewares/master/authMiddleware.js";
import {
  assignCoordinator,
  getClientProjectMapByClientId,
  getAssignedClients,
} from "../controllers/clientProjectMap.controller.js";

const router = express.Router();

router.post("/assign-coordinator", authWithPermissions(), assignCoordinator);

router.get("/client/:clientId", authWithPermissions(), getClientProjectMapByClientId);
router.get("/assigned", authWithPermissions(), getAssignedClients);

export default router;
