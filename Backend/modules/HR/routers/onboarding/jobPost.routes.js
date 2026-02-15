import express from "express";
import {
  createJobPost,
  getAllJobPosts,
  getJobPostById,
  updateJobPost,
  closeJobPost,
  deleteJobPostPermanently,
} from "../../controllers/onboarding/jobPost.controller.js";

const router = express.Router();

router.post("/", createJobPost);
router.get("/", getAllJobPosts);
router.get("/:id", getJobPostById);
router.put("/:id", updateJobPost);
router.patch("/close/:id", closeJobPost);
router.delete("/permanent/:id", deleteJobPostPermanently);

export default router;
