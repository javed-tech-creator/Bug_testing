import express from "express";
import {
  createFranchise,
  getAllFranchises,
  getFranchiseById,
  updateFranchise,
  deleteFranchise,
} from "../../controllers/franchise.controller.js";
import { fileValidator } from "../../../../middlewares/master/fileValidator.middleware.js";
import Upload from "../../../../middlewares/master/multer.middleware.js";

const router = express.Router();

router.post(
  "/",
  Upload("FranchiseDocs").fields([
    { name: "profileImage", maxCount: 1 },
    { name: "contractForm", maxCount: 1 },
    { name: "additionalDocs", maxCount: 10 },
  ]),
  fileValidator({ types: ["image", "pdf"], maxSizeMB: 10 }),
  createFranchise
);

router.get("/", getAllFranchises);
router.get("/:id", getFranchiseById);
router.put(
  "/:id",
  Upload("FranchiseDocs").fields([
    { name: "profileImage", maxCount: 1 },
    { name: "contractForm", maxCount: 1 },
    { name: "additionalDocs", maxCount: 10 },
  ]),
  fileValidator({ types: ["image", "pdf"], maxSizeMB: 10 }),
  updateFranchise
);
router.delete("/:id", deleteFranchise);

export default router;
