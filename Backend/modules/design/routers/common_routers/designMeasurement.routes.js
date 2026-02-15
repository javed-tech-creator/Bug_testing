import express from "express";
import { authWithPermissions } from "../../../../middlewares/master/authMiddleware.js";
import {
  createDesignMeasurementVersion,
  getDesignMeasurementForView,
  getMeasurementPendingList,
  getPendingMeasurementForManager,
  managerMeasurementAction,
  updateDesignMeasurementItem,
} from "../../controllers/common/designMeasurement.controller.js";
import Upload from "../../../../middlewares/master/multer.middleware.js";
import { fileValidator } from "../../../../middlewares/master/fileValidator.middleware.js";
const router = express.Router();

router.get("/get-list", authWithPermissions(), getMeasurementPendingList);
router.post(
  "/create",
  Upload("designMeasurement").fields([
    { name: "upload_measurement_version", maxCount: 1 },
    { name: "upload_supporting_asset", maxCount: 1 },
    { name: "media", maxCount: 10 },
  ]),
  //  validate all uploaded files
  fileValidator({
    types: ["image", "video", "pdf", "audio"],
    maxSizeMB: 20,
  }),
  authWithPermissions(),
  createDesignMeasurementVersion,
);
router.get("/view-list", authWithPermissions(), getDesignMeasurementForView);
router.put(
  "/update/:id",
  Upload("designMeasurement").fields([
    { name: "upload_measurement_version", maxCount: 1 },
    { name: "upload_supporting_asset", maxCount: 1 },
    { name: "media", maxCount: 10 },
  ]),
  //  validate all uploaded files
  fileValidator({
    types: ["image", "video", "pdf", "audio"],
    maxSizeMB: 20,
  }),
  authWithPermissions(),
  updateDesignMeasurementItem,
);

router.get(
  "/manager-list-for-approval",
  authWithPermissions(),
  getPendingMeasurementForManager,
);

router.patch(
  "/manager-action",
  Upload("designMeasurement").fields([
    { name: "manager_media", maxCount: 10 }, // optional multiple files
  ]),
  fileValidator({
    types: ["image", "video", "pdf", "audio"],
    maxSizeMB: 20,
  }),
  authWithPermissions(),
  managerMeasurementAction,
);

export default router;
