import express from "express";
const router = express.Router();

import productRouter from "./product-management/productManagement.routes.js";
router.use("/product", productRouter);

import productWorksRouter from "./product-management/productWorks.routes.js";
router.use("/product-works", productWorksRouter);

import vendorRouter from "./vendor-management/vendorProfile.routes.js";
router.use("/vendor", vendorRouter);

import contractorRouter from "./contractor-management/contractorProfile.routes.js";
router.use("/contractor", contractorRouter);

import freelancerRouter from "./freelancer-management/freelancerProfile.routes.js";
router.use("/freelancer", freelancerRouter);

import partnerRouter from "./partner-management/partnerProfile.routes.js";
router.use("/partner", partnerRouter);

import franchiseRouter from "./franchise-management/franchiseProfile.routes.js";
router.use("/franchise", franchiseRouter);

import flagRaiseRouter from "./flag/flagRaise.router.js";
router.use("/flag-raise", flagRaiseRouter);

// Recce assignment (admin)
import recceAssignRouter from "./recceAssign.routes.js";
router.use("/recce", recceAssignRouter);

import { errorHandler } from "../../../middlewares/globalErrorHandler.js";
//  Global error middleware (must be last)
router.use(errorHandler);

export default router;
