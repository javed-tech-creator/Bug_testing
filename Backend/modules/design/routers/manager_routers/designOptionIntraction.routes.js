import express from "express";
import { authWithPermissions } from "../../../../middlewares/master/authMiddleware.js";
import { getManagerPendingDesignOptions, getManagerPendingDesignOptionVersion, managerActionOnDesignOptionVersion, managerDesignOptionAction } from "../../controllers/manager/designOptionsInteraction.controller.js";

const router = express.Router();

router.get("/option-pending", authWithPermissions(), getManagerPendingDesignOptions);
router.post("/manager-option-action", authWithPermissions(), managerDesignOptionAction);
router.get("/version-pending", authWithPermissions(), getManagerPendingDesignOptionVersion);
router.post("/manager-version-action", authWithPermissions(), managerActionOnDesignOptionVersion);

export default router;
