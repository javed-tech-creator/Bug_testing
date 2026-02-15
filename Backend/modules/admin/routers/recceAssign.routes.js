import express from "express";
import { assignRecce } from "../controllers/recceAssign.controller.js";
import { errorHandler } from "../../../middlewares/globalErrorHandler.js";

const router = express.Router();

// POST /api/v1/admin/recce/assign
router.post("/assign", assignRecce);

// Local error handler for this router (optional)
router.use(errorHandler);

export default router;
