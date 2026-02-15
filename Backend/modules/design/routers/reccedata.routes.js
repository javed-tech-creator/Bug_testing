import express from "express";
import { createRecce, getAllRecce, getRecceById } from "../controllers/reccedata.controller.js";


const router = express.Router();

/* ================= ROUTES ================= */

// CREATE
router.post("/", createRecce);

// GET ALL
router.get("/", getAllRecce);

// GET BY ID
router.get("/:id", getRecceById);

export default router;
