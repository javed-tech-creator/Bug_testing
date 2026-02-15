import express from "express";
import { authWithPermissions } from "../../../../middlewares/master/authMiddleware.js";
import {
  executiveSubmitFeedback,
  getApprovedMeasurementsListForManager,
  getExecutiveReviewList,
  getManagerPendingMeasurementReviews,
  managerSendToQuotation,
  managerSubmitMeasurementReview,
  submitMeasurementReview,
} from "../../controllers/common/designReviewFinalSubmit.controller.js";
const router = express.Router();

router.post("/", authWithPermissions(), submitMeasurementReview);
router.get(
  "/get-pending-review",
  authWithPermissions(),
  getManagerPendingMeasurementReviews,
);
router.post(
  "/manager-final-submit",
  authWithPermissions(),
  managerSubmitMeasurementReview,
);

router.get(
  "/get-approved-review",
  authWithPermissions(),
  getApprovedMeasurementsListForManager,
);

router.post(
  "/send-to-quotation",
  authWithPermissions(),
  managerSendToQuotation,
);

router.get(
  "/executive-review-list",
  authWithPermissions(),
  getExecutiveReviewList,
);

router.post(
  "/executive-submit-feedback",
  authWithPermissions(),
  executiveSubmitFeedback,
);

export default router;
