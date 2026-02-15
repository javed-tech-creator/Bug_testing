import express from "express"
import assetRouter from "./techRouter/asset.Router.js";
import licenseSoftwareRouter from "./techRouter/licensesoftware.router.js";
import { mockUser } from "../../middlewares/asset.middleware/authMiddlware.js";
import helpDeskRouter from "./techRouter/helpdesk.Router.js";
import networkInfrastructureRouter from "./techRouter/networkinfrastructure.router.js";
import vendorManagementRouter from "./techRouter/vendormanagement.router.js";
import dataAccessControlRouter from "./techRouter/accesscontrol.router.js";
import dashboardRouter from "./techRouter/dashboard.router.js";
import { errorHandler } from "../../middlewares/globalErrorHandler.js";

const techRouter = express.Router();

techRouter.use(mockUser);


techRouter.use("/asset",assetRouter)
techRouter.use("/license-software",licenseSoftwareRouter)
techRouter.use("/helpdesk",helpDeskRouter)
techRouter.use("/network-infrastructure",networkInfrastructureRouter)
techRouter.use("/vendor-management",vendorManagementRouter)
techRouter.use("/access-control",dataAccessControlRouter)
techRouter.use("/dashboard",dashboardRouter)

//  Global error middleware (must be last)
techRouter.use(errorHandler);

export default techRouter;