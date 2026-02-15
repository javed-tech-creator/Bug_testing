import express from "express";

import { authWithPermissions } from "../../../../middlewares/master/authMiddleware.js";
import { getApprovedAndSentToDesign, getReviewRecceProducts, sendToDesignDepartment, updateManagerApproval } from "../../controllers/common/recceReviewSubmit.controller.js";
import Upload from "../../../../middlewares/master/multer.middleware.js";
const recceReviewSubmitRoute = express.Router();

recceReviewSubmitRoute.get(
  "/manager-or-executive-list",
  authWithPermissions(),
  getReviewRecceProducts,
);

recceReviewSubmitRoute.post(
  "/manager-action",
  authWithPermissions(),
  Upload("manager_media").any(),
  updateManagerApproval,
);

recceReviewSubmitRoute.post("/send-to-design",authWithPermissions(), sendToDesignDepartment);
recceReviewSubmitRoute.get("/get-sent-to-design-list", getApprovedAndSentToDesign);

export default recceReviewSubmitRoute;
