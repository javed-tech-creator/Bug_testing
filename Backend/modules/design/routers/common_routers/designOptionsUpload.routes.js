import express from "express";
import { authWithPermissions } from "../../../../middlewares/master/authMiddleware.js";
import {
  createDesignOptions,
  createOrPushDesignOptionVersion,
  getClientPendingDesignOptions,
  getManagerPendingDesignOptions,
  getUploadedDesignOptions,
  getUploadedDesignOptionsForModificationView,
  managerUpdateDesignOptionStatus,
} from "../../controllers/common/designOptions.controller.js";
import Upload from "../../../../middlewares/master/multer.middleware.js";
import { fileValidator } from "../../../../middlewares/master/fileValidator.middleware.js";

const router = express.Router();

router.post(
  "/options",
  //  dynamic multiple files
  Upload("designOptions").array("designOptions"),

  //  validate all uploaded files
  fileValidator({
     fieldName: "designOptions",
    types: ["image", "video", "pdf", "audio"],
    maxSizeMB: 20,
  }),
  authWithPermissions(),
  createDesignOptions,
);

router.get("/get", getUploadedDesignOptions);
router.get("/modify-view/:id", getUploadedDesignOptionsForModificationView);
router.post(
  "/version",
  //  dynamic multiple files
  Upload("designOptionVersion").array("designOptionVersion"),

  //  validate all uploaded files
  fileValidator({
    fieldName: "designOptionVersion",
    types: ["image", "video", "pdf", "audio"],
    maxSizeMB: 20,
  }),
  createOrPushDesignOptionVersion,
);

router.get(
  "/manager-options-version/:status", // status = option || version
  authWithPermissions(),
  getManagerPendingDesignOptions,
);

router.patch(
  "/manager-options-version-action/:status", // status = option || version
  authWithPermissions(),
  Upload("designOptionVersion").fields([
    { name: "manager_media", maxCount: 10 }, // manager_media
  ]),
  fileValidator({
    types: ["image", "video", "pdf", "audio"],
    maxSizeMB: 20,
  }),
  managerUpdateDesignOptionStatus,
);

router.get(
  "/client-options-version/:status", // status = option || version
  authWithPermissions(),
  getClientPendingDesignOptions,
);

router.patch(
  "/client-options-version-action/:status", // status = option || version
  authWithPermissions(),
  Upload("designOptionVersion").fields([
    { name: "client_media", maxCount: 10 }, // client_media
  ]),
  fileValidator({
    types: ["image", "video", "pdf", "audio"],
    maxSizeMB: 20,
  }),
  // managerUpdateDesignOptionStatus,
);

export default router;
