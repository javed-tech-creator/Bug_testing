import { mockUser } from "../../middlewares/asset.middleware/authMiddlware.js";
import { errorHandler } from "../../middlewares/globalErrorHandler.js";
import campaignRouter from "./marketing-router/campaign.router.js";
import express from "express";
import leadGenerateRouter from "./marketing-router/leadGenerate.router.js";
import brandRepoRouter from "./marketing-router/brandRepo.js";


const marketingRouter = express.Router();

marketingRouter.use(mockUser);

marketingRouter.use("/campaign",campaignRouter)
marketingRouter.use("/lead-generate",leadGenerateRouter)
marketingRouter.use("/brand-repo",brandRepoRouter)


//  Global error middleware (must be last)
marketingRouter.use(errorHandler);

export default marketingRouter;
