import express from "express";
import { authWithPermissions } from "../../../../middlewares/master/authMiddleware.js";
import {
  clientApprovalAction,
  createDesignMockupVersion,
  getClientPendingMockups,
  getDesignOptionDetailsById,
  getManagerPendingMockups,
  getMeasurementDetailById,
  getMeasurementUploadPendingList,
  getMockupUploadPendingList,
  managerApprovalAction,
  pushDesignMockupVersion,
} from "../../controllers/common/designMockup.controller.js";
import { fileValidator } from "../../../../middlewares/master/fileValidator.middleware.js";
import Upload from "../../../../middlewares/master/multer.middleware.js";
const router = express.Router();

router.get("/", authWithPermissions(), getMockupUploadPendingList);
router.get(
  "/view-lists",
  authWithPermissions(),
  getMeasurementUploadPendingList,
);
router.get("/view-lists/:id", authWithPermissions(), getMeasurementDetailById);

// manager action ( get pending and approved or reject)
router.get("/manager-get", authWithPermissions(), getManagerPendingMockups);
router.patch(
  "/manager-update",
  Upload("managerApproval").fields([
    { name: "manager_media", maxCount: 10 }, //  multiple files
  ]),
  authWithPermissions(),
  managerApprovalAction,
);

router.get("/client-get", authWithPermissions(), getClientPendingMockups);
router.patch(
  "/client-update",
  Upload("clientApproval").fields([
    { name: "client_media", maxCount: 10 }, //  multiple files
  ]),
  authWithPermissions(),
  clientApprovalAction,
);

router.get("/:id", authWithPermissions(), getDesignOptionDetailsById);
router.post(
  "/",
  authWithPermissions(),
  Upload("designmockupVersion").fields([
    { name: "upload_mockup_version", maxCount: 1 },
    { name: "upload_supporting_asset", maxCount: 1 },
    { name: "media", maxCount: 10 },
  ]),
  //  validate all uploaded files
  fileValidator({
    types: ["image", "video", "pdf", "audio"],
    maxSizeMB: 20,
  }),
  createDesignMockupVersion,
);

router.patch(
  "/:id",
  authWithPermissions(),
  Upload("designmockupVersion").fields([
    { name: "upload_mockup_version", maxCount: 1 },
    { name: "upload_supporting_asset", maxCount: 1 },
    { name: "media", maxCount: 10 },
  ]),
  //  validate all uploaded files
  fileValidator({
    types: ["image", "video", "pdf", "audio"],
    maxSizeMB: 20,
  }),
  pushDesignMockupVersion,
);

export default router;
