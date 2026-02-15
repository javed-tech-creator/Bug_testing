import express from "express";
import { getAssetsDistribution, getExpiryNotifications, getSummary, getTicketsByDepartment, getTicketTrends } from "../../../controller/technology/dashboard.controller.js";


const dashboardRouter = express.Router();

//  Dashboard summary (Top cards)
dashboardRouter.get("/summary", getSummary);

//  Assets distribution (Pie chart)
dashboardRouter.get("/assets-distribution", getAssetsDistribution);

//  Tickets by department (Bar chart)
dashboardRouter.get("/tickets-by-department", getTicketsByDepartment);

// expire notification
dashboardRouter.get("/expiry-notifications", getExpiryNotifications);

// employee data
dashboardRouter.get("/employee-data", getTicketTrends);


export default dashboardRouter;
