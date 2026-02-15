import express from "express";

import { authWithPermissions } from "../../../../middlewares/master/authMiddleware.js";
import {
  getDraftProductsList,
  saveClientInteraction,
  saveStep1,
  saveStep2,
  saveStep3,
  saveStep4,
  startRecceExecution,
} from "../../controllers/common/recceStepFormData.controller.js";
import Upload from "../../../../middlewares/master/multer.middleware.js";
import { fileValidator } from "../../../../middlewares/master/fileValidator.middleware.js";
const recceStepFormDataRouter = express.Router();

recceStepFormDataRouter.post(
  "/add",
  authWithPermissions(),
  Upload("recceClientInteraction").fields([
    { name: "upload_proof", maxCount: 1 },
  ]),

  //  File validation
  fileValidator({
    types: ["image", "video", "pdf", "audio"],
    maxSizeMB: 10,
  }),
  saveClientInteraction,
);

recceStepFormDataRouter.post(
  "/start",
  authWithPermissions(),
  // Multiple files under same field name
  Upload("raw_recce_files").any("raw_recce_files"),

  fileValidator({
    fieldName: "raw_recce_files", // important
    types: ["image", "video", "pdf", "audio"],
    maxSizeMB: 20,
  }),
  startRecceExecution,
);

recceStepFormDataRouter.get(
  "/draft",
  authWithPermissions(),
  getDraftProductsList,
);
recceStepFormDataRouter.post(
  "/step1",
  authWithPermissions(),
  Upload("recce/step1").fields([{ name: "compass_screenshot", maxCount: 1 }]),
  saveStep1,
);

recceStepFormDataRouter.post(
  "/step2",
  authWithPermissions(),
  Upload("recce/step2").any(),
  saveStep2,
);

recceStepFormDataRouter.post(
  "/step3",
  authWithPermissions(),
  saveStep3
);

recceStepFormDataRouter.post(
  "/step4",
  authWithPermissions(),
  Upload("recce/step4").any(),
  saveStep4
);


export default recceStepFormDataRouter;
