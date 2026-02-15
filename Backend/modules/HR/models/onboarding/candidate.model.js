import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    jobId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "JobPost", 
      required: true, 
      index: true 
    },

    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    phone: { type: String, required: true, trim: true },

    resume: {
      url: { type: String, default: null },
      public_url: { type: String, default: null },
      public_id: { type: String, default: null }
    },

    experience: { type: String, default: null }, 
    skills: { type: [String], default: [] },

    source: { 
      type: String, 
      enum: ["Referral", "LinkedIn", "Indeed", "Naukri", "Internal", "Other"], 
      default: "Other" 
    },

    appliedDate: { type: Date, default: Date.now },

    status: {
      type: String,
      enum: ["Applied", "Shortlisted", "Interview scheduled", "Interviewed", "Selected", "Rejected", "Offered", "Hired"],
      default: "Applied"
    },
    inerviewDate: { type: Date, default: null },
    interviewer: { type: String, default: null },
    feedback: { type: String, default: null },

    offerLetter: {
      url: { type: String, default: null },
      public_url: { type: String, default: null },
      public_id: { type: String, default: null }
    },

    offerLetterStatus: {
      type: String,
      enum: ["Pending", "Sent", "Accepted", "Declined"],
      default: "Pending"
    },
    remarks: { type: String, default: null },
  },
  { timestamps: true }
);

const Candidate = mongoose.model("Candidate", candidateSchema);

export default Candidate;
