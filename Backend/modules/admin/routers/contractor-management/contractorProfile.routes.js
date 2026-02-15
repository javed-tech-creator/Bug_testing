import express from "express";
import {
  createContractor,
  getAllContractors,
  getContractorById,
  updateContractor,
  deleteContractor,
} from "../../controllers/contractor.controller.js";
import { fileValidator } from "../../../../middlewares/master/fileValidator.middleware.js";
import Upload from "../../../../middlewares/master/multer.middleware.js";

const router = express.Router();

router.post(
  "/",
  Upload("ContractorDocs").fields([
    { name: "profileImage", maxCount: 1 },
    { name: "contractForm", maxCount: 1 },
    { name: "additionalDocs", maxCount: 10 },
  ]),
  fileValidator({ types: ["image", "pdf"], maxSizeMB: 10 }),
  createContractor
);

router.get("/", getAllContractors);
router.get("/:id", getContractorById);
router.put(
  "/:id",
  Upload("ContractorDocs").fields([
    { name: "profileImage", maxCount: 1 },
    { name: "contractForm", maxCount: 1 },
    { name: "additionalDocs", maxCount: 10 },
  ]),
  fileValidator({ types: ["image", "pdf"], maxSizeMB: 10 }),
  updateContractor
);
router.delete("/:id", deleteContractor);

export default router;
