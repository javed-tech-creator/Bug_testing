import express from "express";
import {
  createFreelancer,
  getAllFreelancers,
  getFreelancerById,
  updateFreelancer,
  deleteFreelancer,
} from "../../controllers/freelancer.controller.js";
import { fileValidator } from "../../../../middlewares/master/fileValidator.middleware.js";
import Upload from "../../../../middlewares/master/multer.middleware.js";

const router = express.Router();

router.post(
  "/",
  Upload("FreelancerDocs").fields([
    { name: "profileImage", maxCount: 1 },
    { name: "contractForm", maxCount: 1 },
    { name: "additionalDocs", maxCount: 10 },
  ]),
  fileValidator({ types: ["image", "pdf"], maxSizeMB: 10 }),
  createFreelancer
);

router.get("/", getAllFreelancers);
router.get("/:id", getFreelancerById);
router.put(
  "/:id",
  Upload("FreelancerDocs").fields([
    { name: "profileImage", maxCount: 1 },
    { name: "contractForm", maxCount: 1 },
    { name: "additionalDocs", maxCount: 10 },
  ]),
  fileValidator({ types: ["image", "pdf"], maxSizeMB: 10 }),
  updateFreelancer
);
router.delete("/:id", deleteFreelancer);

export default router;
