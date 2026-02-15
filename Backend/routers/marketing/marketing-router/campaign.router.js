import express from "express";
import {
  createCampaign,
  updateCampaign,
  getAllCampaigns,
  deleteCampaign,
  getCampaigns,
  hardDeleteCampaign,
  updateCampaignStatus,
  getCampaignLists,
} from "../../../controller/marketing/campaign.controller.js";

const campaignRouter = express.Router();

// Routes
campaignRouter.post("/create", createCampaign);
campaignRouter.put("/update/:id", updateCampaign);
campaignRouter.patch("/status/:id", updateCampaignStatus);
campaignRouter.get("/get-all", getAllCampaigns);
campaignRouter.get("/get", getCampaigns);
campaignRouter.get("/get-campaignlists", getCampaignLists);
campaignRouter.delete("/delete/:id", deleteCampaign);
campaignRouter.delete("/delete-hard/:id", hardDeleteCampaign);

export default campaignRouter;
