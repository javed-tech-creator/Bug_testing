import express from "express";
// import { authWithPermissions } from "../../../../middlewares/master/authMiddleware.js";
import { assignLead, createFollowUp, createLead, getAllLeads, getLeadById, updateLead } from "../controllers/lead.controller.js";
import Upload from "../../../middlewares/master/multer.middleware.js";
import { authWithPermissions } from "../../../middlewares/master/authMiddleware.js";

const router = express.Router();
router.post("/", Upload("ClientRequirement").fields([{ name: "documents", maxCount: 10 }]), createLead);
router.get("/", getAllLeads);
router.post("/schedule-followup",authWithPermissions(), createFollowUp);

router.get("/:id", getLeadById);
router.put("/:leadId",Upload("ClientRequirement").fields([{ name: "documents", maxCount: 10 }]),  updateLead);
router.patch("/assign/:leadId",  assignLead);


export default router;
