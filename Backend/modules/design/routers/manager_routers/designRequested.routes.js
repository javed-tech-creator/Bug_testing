import express from "express";
import {
  createDesignRequested,
  getAllAssignedDesigns,
  getFilteredDesignRequests,
} from "../../controllers/manager/designRequested.controller.js";
import { authWithPermissions } from "../../../../middlewares/master/authMiddleware.js";
const router = express.Router();

router.post("/", authWithPermissions(), createDesignRequested);
router.get("/", authWithPermissions(), getFilteredDesignRequests);
router.get("/assigned", authWithPermissions(), getAllAssignedDesigns);

export default router;
