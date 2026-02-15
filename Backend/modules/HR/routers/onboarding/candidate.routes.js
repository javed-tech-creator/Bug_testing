import express from "express";
import {
  createCandidate,
  getAllCandidates,
  getCandidateById,
  deleteCandidate,
  getCandidatesByJobId,
  uploadOfferLetter,
  scheduleInterview,
  changeCandidateStatus,
  updateResume,
  hiredCandidation,
} from "../../controllers/onboarding/candidate.controller.js";
import upload from "../../middlewares/multer.middleware.js";
import { fileValidator } from "../../middlewares/fileValidator.middleware.js";
const router = express.Router();

router.post("/", upload("CandidateResume").single("resume"), fileValidator({ types: ["image", "pdf"], maxSizeMB: 5 }) ,createCandidate);

router.get("/", getAllCandidates);
router.get("/hired",hiredCandidation)
router.get("/:id", getCandidateById);
router.get("/job/:jobId", getCandidatesByJobId);
router.put("/offer-letter/:id", upload("OfferLatter").single("offerLatter"), uploadOfferLetter);
router.delete("/:id", deleteCandidate);
router.put("/interview/:id",scheduleInterview)
router.put("/status/:id",changeCandidateStatus)
router.put("/resume/:id", upload("CandidateResume").single("resume"), fileValidator({ types: ["image", "pdf"], maxSizeMB: 5 }) , updateResume)

export default router;
