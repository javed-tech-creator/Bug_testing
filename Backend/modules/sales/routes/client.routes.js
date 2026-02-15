import express from "express";
import { createClient, getAllClients, getClientById, getClientsMinimal, updateClient } from "../controllers/client.controller.js";


const router = express.Router();

router.post("/", createClient);
router.get("/", getAllClients);
router.get("/:id", getClientById);
router.put("/:id", updateClient);

export default router;
