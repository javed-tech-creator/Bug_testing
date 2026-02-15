import express from "express";
import { authWithPermissions } from "../../../../middlewares/master/authMiddleware.js";
import { designReceivedConfirmation } from "../../controllers/manager/designReceived.controller.js";

const router = express.Router();

router.post("/", authWithPermissions(), designReceivedConfirmation);

export default router;