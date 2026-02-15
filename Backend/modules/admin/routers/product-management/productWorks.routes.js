import express from "express";
import { createWorkStructure, getWorkByProductId, updateWorkStructure  } from "../../controllers/productWorks.controller.js";

const router = express.Router();

// Create new product work
router.post("/", createWorkStructure);

// Get by productId
router.get("/:productId", getWorkByProductId);

// Update work
router.put("/:productId", updateWorkStructure);

export default router;