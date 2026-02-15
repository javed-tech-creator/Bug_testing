import express from "express";
import { authWithPermissions } from "../../../../middlewares/master/authMiddleware.js";
import { getDesignsForOptionUpload } from "../../controllers/common/workflowDesignOptions.controller.js";
const router = express.Router();

router.get("/", authWithPermissions(), getDesignsForOptionUpload);

export default router;