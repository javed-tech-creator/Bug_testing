import express from "express";
import {
  createVendor,
  getAllVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
} from "../../controllers/vendor.controller.js";
import { fileValidator } from "../../../../middlewares/master/fileValidator.middleware.js";
import Upload from "../../../../middlewares/master/multer.middleware.js";

const router = express.Router();

router.post(
  "/",
  Upload("VendorDocs").fields([
    { name: "profileImage", maxCount: 1 },
    { name: "contractForm", maxCount: 1 },
    { name: "additionalDocs", maxCount: 10 },
  ]),
  fileValidator({ types: ["image", "pdf"], maxSizeMB: 10 }),
  createVendor
);

router.get("/", getAllVendors);
router.get("/:id", getVendorById);
router.put(
  "/:id",
  Upload("VendorDocs").fields([
    { name: "profileImage", maxCount: 1 },
    { name: "contractForm", maxCount: 1 },
    { name: "additionalDocs", maxCount: 10 },
  ]),
  fileValidator({ types: ["image", "pdf"], maxSizeMB: 10 }),
  updateVendor
);
router.delete("/:id", deleteVendor);

export default router;
