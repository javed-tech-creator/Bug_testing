import express from "express";
import { assignLead, createLead, deleteLead, getAllLeads, getLeads, hardDeleteLead, updateLead } from "../../../controller/marketing/leadGeneration.controller.js";


const leadGenerateRouter = express.Router();

leadGenerateRouter.post('/add',createLead)
leadGenerateRouter.post('/assign-lead',assignLead)
leadGenerateRouter.get('/get',getLeads)
leadGenerateRouter.get('/get-all',getAllLeads)  // extra api no use in code only dev and recovery purpose
leadGenerateRouter.put('/update/:id',updateLead)
leadGenerateRouter.delete('/delete/:id',deleteLead)
leadGenerateRouter.delete('/delete-hard/:id',hardDeleteLead)  // extra api no use in code only dev and hard deleted purpose

export default leadGenerateRouter;