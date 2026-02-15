import express from "express";
import {
  createPartner,
  getAllPartners,
  getPartnerById,
  updatePartner,
  deletePartner,
} from "../../controllers/partner.controller.js";
import { fileValidator } from "../../../../middlewares/master/fileValidator.middleware.js";
import Upload from "../../../../middlewares/master/multer.middleware.js";

const router = express.Router();

router.post(
  "/",
  Upload("PartnerDocs").fields([
    { name: "profileImage", maxCount: 1 },
    { name: "contractForm", maxCount: 1 },
    { name: "additionalDocs", maxCount: 10 },
  ]),
  fileValidator({ types: ["image", "pdf"], maxSizeMB: 10 }),
  createPartner
);

router.get("/", getAllPartners);
router.get("/:id", getPartnerById);
router.put(
  "/:id",
  Upload("PartnerDocs").fields([
    { name: "profileImage", maxCount: 1 },
    { name: "contractForm", maxCount: 1 },
    { name: "additionalDocs", maxCount: 10 },
  ]),
  fileValidator({ types: ["image", "pdf"], maxSizeMB: 10 }),
  updatePartner
);
router.delete("/:id", deletePartner);

export default router;
