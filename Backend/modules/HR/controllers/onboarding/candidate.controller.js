import mongoose from "mongoose";
import Candidate from "../../models/onboarding/candidate.model.js";
import {
  uploadFiles,
  deleteFile,
  deleteLocalFile,
} from "../../../../utils/master/cloudinary.js";
import JobPost from "../../models/onboarding/jobPost.model.js";
import ApiError from "../../../../utils/master/ApiError.js";

// Create Candidate
export const createCandidate = async (req, res, next) => {
  let uploadedFileId = null;
  let uploadedFileUrl = null;

  try {
    const { jobId, name, email, phone, experience, skills, source } = req.body;

    if (!jobId || !name || !email || !phone) {
      return next(
        new ApiError(400, "JobId, name, email and phone are required")
      );
    }
    if (!mongoose.isValidObjectId(jobId)) {
      return next(new ApiError(400, "Invalid Job ID"));
    }

    const jobExists = await JobPost.findById(jobId);
    if (!jobExists) return next(new ApiError(404, "Job not found"));

    let resumeData = null;
    if (req.file) {
      let result = null;
      if (process.env.USE_CLOUDINARY === "true") {
        result = await uploadFiles([req.file]);
        if (!result.success || !result.files[0].url) {
          return next(new ApiError(400, "Unable to upload Resume"));
        }
      } else {
        result = {
          success: true,
          files: [
            {
              url: req.file?.path?.replace(/\\/g, "/"),
              public_url: null,
              public_id: null,
            },
          ],
        };
      }

      uploadedFileId = result.files[0].public_id || null;
      uploadedFileUrl = result.files[0].url || null;
      resumeData = result.files[0];
    }

    const candidate = new Candidate({
      jobId,
      name,
      email,
      phone,
      experience,
      skills: skills ? skills.split(",").map((s) => s.trim()) : [],
      source,
      resume: resumeData,
    });

    const saved = await candidate.save();

    return res.api(201, "Candidate created successfully", saved);
  }
  catch (err) {
  try {
    if (uploadedFileId) await deleteFile(uploadedFileId);
  } catch (e) {
    console.error("Failed to delete cloud file:", e.message);
  }

  try {
    if (uploadedFileUrl) await deleteLocalFile(uploadedFileUrl);
  } catch (e) {
    console.error("Failed to delete local file:", e.message);
  }

  return next(new ApiError(500, err?.message || "Internal Server Error"));
}
};

// Get All Candidates
export const getAllCandidates = async (req, res, next) => {
  try {
    const candidates = await Candidate.find().populate("jobId", "title");
    if (!candidates.length) {
      return next(new ApiError(404, "No candidates found"));
    }
    return res.api(200, "Candidates fetched successfully", candidates);
  } catch (err) {
    return next(new ApiError(500, err?.message || "Internal Server Error"));
  }
};

// Get Candidate by ID
export const getCandidateById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError(400, "Invalid Candidate ID"));
    }
    const candidate = await Candidate.findById(id).populate("jobId", "title");
    if (!candidate) return next(new ApiError(404, "Candidate not found"));

    return res.api(200, "Candidate fetched successfully", candidate);
  } catch (err) {
    return next(new ApiError(500, err?.message || "Internal Server Error"));
  }
};

// Delete Candidate
export const deleteCandidate = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError(400, "Invalid Candidate ID"));
    }

    const candidate = await Candidate.findByIdAndDelete(id);
    if (!candidate) return next(new ApiError(404, "Candidate not found"));

    if (candidate.resume?.public_id)
      await deleteFile(candidate.resume.public_id).catch(() => {
        return next(new ApiError(500, "Failed to delete resume from storage"));
      });
    if (candidate.resume?.url)
      await deleteLocalFile(candidate.resume.url).catch(() => {
        return next(new ApiError(500, "Failed to delete resume from storage"));
      });

    return res.api(200, "Candidate deleted successfully");
  } catch (err) {
    return next(new ApiError(500, err?.message || "Internal Server Error"));
  }
};

// Get Candidates by JobId
export const getCandidatesByJobId = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return next(new ApiError(400, "Invalid Job ID"));
    }

    const candidates = await Candidate.find({ jobId }).populate(
      "jobId",
      "title"
    );

    if (!candidates || candidates.length === 0) {
      return next(new ApiError(404, "No candidates found for this Job ID"));
    }

    return res.api(
      200,
      "Candidates fetched successfully for the Job",
      candidates
    );
  } catch (err) {
    return next(new ApiError(500, err?.message || "Internal Server Error"));
  }
};

// Upload Candidate resume
export const uploadOfferLetter = async (req, res, next) => {
  let uploadedFileId = null;
  let uploadedFileUrl = null;

  try {
    const { id } = req.params;
    console.log(id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError(400, "Invalid Candidate ID"));
    }

    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return next(new ApiError(404, "Candidate not found"));
    }

    if (!req.file) {
      return next(new ApiError(400, "Offer letter file is required"));
    }

    let result = null;
    if (process.env.USE_CLOUDINARY === "true") {
      result = await uploadFiles([req.file]);
      if (!result.success || !result.files[0].url) {
        return next(new ApiError(400, "Unable to upload Offer Letter"));
      }
    } else {
      result = {
        success: true,
        files: [
          {
            url: req.file?.path?.replace(/\\/g, "/"),
            public_url: null,
            public_id: null,
          },
        ],
      };
    }

    uploadedFileId = result.files[0].public_id || null;
    uploadedFileUrl = result.files[0].url || null;

    // Delete old file if exists
    if (candidate.offerLetter?.public_id) {
      try {
        await deleteFile(candidate.offerLetter.public_id);
      } catch {}
    }
    if (candidate.offerLetter?.url) {
      try {
        deleteLocalFile(candidate.offerLetter.url);
      } catch {}
    }

    candidate.offerLetter = result.files[0];
    candidate.offerLetterStatus = "Sent";
    await candidate.save();

    const { public_id, ...offerLetterWithoutId } =
      candidate.offerLetter.toObject();
    const responseData = {
      ...candidate.toObject(),
      offerLetter: offerLetterWithoutId,
    };

    return res.api(200, "Offer letter uploaded successfully", responseData);
  } catch (err) {
    console.log(err);
    if (uploadedFileId) {
      try {
        await deleteFile(uploadedFileId);
      } catch {}
    }
    if (uploadedFileUrl) {
      try {
        deleteLocalFile(uploadedFileUrl);
      } catch {}
    }

    return next(new ApiError(500, err?.message || "Internal Server Error"));
  }
};

// Change Candidate Status
export const changeCandidateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    if(!req?.body){
      return next(new ApiError(400, "Status and Remark in Required"))
    }
    const { status, remarks } = req.body;
    if(!req.body || !status || !remarks){
      return next(new ApiError(400, "Status and Remark in Required"))
    }
    if (!mongoose.Types.ObjectId.isValid(id))
      return next(new ApiError(400, "Invalid Candidate ID"));
    const candidate = await Candidate.findById(id);
    if (!candidate) return next(new ApiError(404, "Candidate not found"));
    candidate.status = status;
    candidate.remarks = remarks;
    await candidate.save();
    return res.api(200, "Status updated", candidate);
  } catch (err) {
    console.log(err)
    return next(new ApiError(500, err?.message || "Internal Server Error"));
  }
};

//scheduleInterview
export const scheduleInterview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { interviewDate, interviewer, feedback } = req.body;
    console.log(id , req.body);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError(400, "Invalid Candidate ID"));
    }

    const candidate = await Candidate.findById(id);
    if (!candidate) return next(new ApiError(404, "Candidate not found"));
    if(feedback){
      candidate.status = "Interviewed";
    }
    else{
      candidate.status= "Interview scheduled"
    }
    candidate.inerviewDate = interviewDate || candidate.inerviewDate;
    candidate.interviewer = interviewer || candidate.interviewer;
    candidate.feedback = feedback || candidate.feedback;

    await candidate.save();

    return res.api(200, "Interview scheduled successfully", candidate);
  } catch (err) {
    return next(new ApiError(500, err?.message || "Internal Server Error"));
  }
};
// Update Candidate Resume
export const updateResume = async (req, res, next) => {
  let uploadedFileId = null;
  let uploadedFileUrl = null;

  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError(400, "Invalid Candidate ID"));
    }

    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return next(new ApiError(404, "Candidate not found"));
    }

    if (!req.file) {
      return next(new ApiError(400, "Resume file is required"));
    }

    // Upload new resume
    let result = null;
    if (process.env.USE_CLOUDINARY === "true") {
      result = await uploadFiles([req.file]);
      if (!result.success || !result.files[0].url) {
        return next(new ApiError(400, "Unable to upload resume"));
      }
    } else {
      result = {
        success: true,
        files: [
          {
            url: req.file?.path?.replace(/\\/g, "/"),
            public_url: null,
            public_id: null,
          },
        ],
      };
    }

    uploadedFileId = result.files[0].public_id || null;
    uploadedFileUrl = result.files[0].url || null;

    // Delete old resume if exists
    if (candidate.resume?.public_id) {
      try {
        await deleteFile(candidate.resume.public_id);
      } catch {}
    }
    if (candidate.resume?.url) {
      try {
        await deleteLocalFile(candidate.resume.url);
      } catch {}
    }

    // Save new resume
    candidate.resume = result.files[0];
    await candidate.save();

    const { public_id, ...resumeWithoutId } = candidate.resume.toObject();
    const responseData = {
      ...candidate.toObject(),
      resume: resumeWithoutId,
    };

    return res.api(200, "Resume updated successfully", responseData);
  } catch (err) {
    // Cleanup new upload if save failed
    console.log(err);
    if (uploadedFileId) {
      try {
        await deleteFile(uploadedFileId);
      } catch {}
    }
    if (uploadedFileUrl) {
      try {
        await deleteLocalFile(uploadedFileUrl);
      } catch {}
    }

    return next(new ApiError(500, err?.message || "Internal Server Error"));
  }
};

export const hiredCandidation = async(req,res,next)=>{
   try {
    const candidates = await Candidate.find({status:'Hired'}).populate("jobId", "title");
    return res.api(200, 
      candidates.length ? "Hired Candidates fetched successfully" : "No hired candidates found", 
      candidates
    );
  } catch (err) {
    return next(new ApiError(500, err?.message || "Internal Server Error"));
  }
}