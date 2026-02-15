import express from "express";
const router = express.Router();

import recceDetailRoute from "./manager/recceDetail.routes.js";

router.use("/request", recceDetailRoute);

import recceAssignRoute from "./manager/recceAssigned.routes.js";
router.use("/assign", recceAssignRoute);

import projectModuleApiRoute from "./projectModuleApi/projectModuleApi.routes.js";
router.use("/project-module-api", projectModuleApiRoute);

import recceTodayRoute from "./common/getTodayPlannedRecce.routes.js";
router.use("/common", recceTodayRoute);

import recceWaitingLostRoute from "./common/getRecceLostWaiting.routes.js";
router.use("/manager", recceWaitingLostRoute);

import recceExecutiveRoute from "./executive/getAssignRecce.routes.js";
router.use("/executive", recceExecutiveRoute);

import productAddRemoveRoute from "./common/newProductAddRemove.routes.js";
router.use("/new-product", productAddRemoveRoute);

import signageProductListRoute from "./common/signageProductList.routes.js";
router.use("/signage-products", signageProductListRoute);

import modifyPreviousDataRoute from "./common/modifyPreviousData.routes.js";
router.use("/modify-previous-data", modifyPreviousDataRoute);

import recceStepFormDataRoute from "./common/recceStepFormData.routes.js";
router.use("/step-form-data", recceStepFormDataRoute);

import recceReviewSubmitRoute from "./common/getReviewRecce.routes.js";
router.use("/review", recceReviewSubmitRoute);
export default router;
