import express from "express";
import { createZone, deleteZonePermanently, getAllZones, getZoneById, softDeleteZone, updateZone } from "../../controllers/masters/zone.controller.js";


const router = express.Router();

router.post("/", createZone);
router.get("/", getAllZones);
router.get("/:id", getZoneById);
router.put("/:id", updateZone);
router.delete("/:id", softDeleteZone);
router.delete("/permanent/:id", deleteZonePermanently);

export default router;
