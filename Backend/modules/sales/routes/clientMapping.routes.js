import express from "express";
import { authWithPermissions } from "../../../middlewares/master/authMiddleware.js";
import {
  sendToManager,
  sendToProjectDepartment,
  getClientMappingByClientId,
} from "../controllers/clientMapping.controller.js";

const router = express.Router();

router.post(
  "/send-to-manager",
  authWithPermissions(),
  sendToManager
);

router.post(
  "/send-to-project-department",
  authWithPermissions(),
  sendToProjectDepartment
);

router.get(
  "/client/:clientId",
  authWithPermissions(),
  getClientMappingByClientId
);

export default router;
