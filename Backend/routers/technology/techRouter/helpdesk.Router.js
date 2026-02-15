import express from "express";
import { checkRole } from "../../../middlewares/asset.middleware/authMiddlware.js";
import { createTicket, getTickets, patchTicket, updateTicketStatus } from "../../../controller/technology/helpdesk.controller.js";
import upload from "../../../middlewares/asset.middleware/uploadMedia.js";

const helpDeskRouter = express.Router();


helpDeskRouter.post("/add", upload.single("attachment"), createTicket);
helpDeskRouter.get("/get", getTickets);
helpDeskRouter.patch("/assign/:id",  patchTicket);
helpDeskRouter.patch("/ticket-status/:id",  updateTicketStatus);

// helpDeskRouter.put("/update/:id",  updateAsset);
// helpDeskRouter.delete("/delete/:id",  deleteAsset);

export default helpDeskRouter;
