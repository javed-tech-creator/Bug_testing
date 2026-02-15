import mongoose from "mongoose";
import slugify from "slugify";
const jobPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    description: { type: String, default: null },
    jobType: { type: String, enum: ["Internal", "Public"], default: "Public" },
    skills: { type: [String], default: [], required: true },
    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
      default: "Full-time",
    },
    experience: { type: String, default: null, required: true },
    experienceType: { type: String, default: null, required: true },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      default: null,
    },
    designationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Designation",
      default: null,
    },
    salaryRange: { type: String, default: null },
    openings: { type: Number, default: 1 },
    status: {
      type: String,
      enum: ["Open", "Closed", "On Hold"],
      default: "Open",
    },
    postedAt: { type: Date, default: Date.now },
    closedAt: { type: Date, default: null },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

const JobPost = mongoose.model("JobPost", jobPostSchema);
export default JobPost;

jobPostSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});
