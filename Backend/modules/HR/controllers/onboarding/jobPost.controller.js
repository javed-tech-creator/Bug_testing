import ApiError from "../../../../utils/master/ApiError.js";
import JobPost from "../../models/onboarding/jobPost.model.js";
import Branch from "../../models/masters/branch.model.js";
import Department from "../../models/masters/department.model.js";
import Designation from "../../models/masters/designation.model.js";
import User from "../../models/masters/user.model.js";
import mongoose from "mongoose";
import slugify from "slugify";

export const createJobPost = async (req, res, next) => {
  try {
    const {
      title,
      description,
      jobType,
      skills,
      employmentType,
      experience,
      experienceType,
      departmentId,
      branchId,
      designationId,
      salaryRange,
      openings,
      status,
      postedBy,
    } = req.body;

    console.log(req.body);

    if (!title || !description || !experience || !experienceType) {
      return next(
        new ApiError(
          400,
          "Title, description, experience andexperienceType are required"
        )
      );
    }

    if (departmentId && !mongoose.isValidObjectId(departmentId)) {
      return next(new ApiError(400, "Invalid Department ID"));
    }
    if (branchId && !mongoose.isValidObjectId(branchId)) {
      return next(new ApiError(400, "Invalid Branch ID"));
    }
    if (designationId && !mongoose.isValidObjectId(designationId)) {
      return next(new ApiError(400, "Invalid Designation ID"));
    }
    if (postedBy && !mongoose.isValidObjectId(postedBy)) {
      return next(new ApiError(400, "Invalid User ID"));
    }

    const slug = slugify(title, { lower: true, strict: true });
    const existing = await JobPost.findOne({ slug });
    if (existing) {
      return next(new ApiError(400, "Job post with this title already exists"));
    }

    if (departmentId && !(await Department.findById(departmentId))) {
      return next(new ApiError(404, "Department not found"));
    }
    if (branchId && !(await Branch.findById(branchId))) {
      return next(new ApiError(404, "Branch not found"));
    }
    if (designationId && !(await Designation.findById(designationId))) {
      return next(new ApiError(404, "Designation not found"));
    }
    if (postedBy && !(await User.findById(postedBy))) {
      return next(new ApiError(404, "User (postedBy) not found"));
    }

    // ✅ Create new job post
    const jobPost = new JobPost({
      title,
      slug,
      description,
      jobType,
      skills,
      employmentType,
      experience,
      experienceType,
      departmentId: departmentId || null,
      branchId: branchId || null,
      designationId: designationId || null,
      salaryRange,
      openings,
      status,
      postedBy: postedBy || null,
    });

    const savedJobPost = await jobPost.save();
    return res.api(201, "Job post created successfully", savedJobPost);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

// Get All JobPosts
export const getAllJobPosts = async (req, res, next) => {
  try {
    const jobPosts = await JobPost.find()
      .populate("branchId", "branchId title")
      .populate("departmentId", "departmentId title")
      .populate("designationId", "title")
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });

    return res.api(200, "JobPosts fetched successfully !!", jobPosts);
  } catch (err) {
    console.log(err);
    return next(new ApiError(500, err.message));
  }
};

// Get JobPost by ID
export const getJobPostById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid JobPost ID"));
    }

    const jobPost = await JobPost.findById(id)
      .populate("branchId", "branchId title")
      .populate("departmentId", "departmentId title")
      .populate("designationId", "title")
      .populate("postedBy", "name email");

    if (!jobPost) {
      return next(new ApiError(404, "JobPost not found"));
    }

    return res.api(200, "JobPost fetched successfully !!", jobPost);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

// Update JobPost
export const updateJobPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      jobType,
      skills,
      employmentType,
      experience,
      departmentId,
      branchId,
      designationId,
      salaryRange,
      openings,
      status,
      postedBy,
    } = req.body;

    // ✅ Validate JobPost ID
    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid JobPost ID"));
    }

    // ✅ Required field check
    if (title && !description && !experience) {
      return next(
        new ApiError(400, "Title, description, and experience are required")
      );
    }

    // ✅ ObjectId validations
    if (departmentId && !mongoose.isValidObjectId(departmentId)) {
      return next(new ApiError(400, "Invalid Department ID"));
    }
    if (branchId && !mongoose.isValidObjectId(branchId)) {
      return next(new ApiError(400, "Invalid Branch ID"));
    }
    if (designationId && !mongoose.isValidObjectId(designationId)) {
      return next(new ApiError(400, "Invalid Designation ID"));
    }
    if (postedBy && !mongoose.isValidObjectId(postedBy)) {
      return next(new ApiError(400, "Invalid User ID"));
    }

    // ✅ Slugify and check uniqueness if title updated
    const updateData = { ...req.body };
    if (title) {
      const slug = slugify(title, { lower: true, strict: true });
      const existing = await JobPost.findOne({ slug, _id: { $ne: id } });
      if (existing) {
        return next(
          new ApiError(400, "Another JobPost with this title already exists")
        );
      }
      updateData.slug = slug;
    }

    // ✅ Verify related entities if IDs are passed
    if (departmentId && !(await Department.findById(departmentId))) {
      return next(new ApiError(404, "Department not found"));
    }
    if (branchId && !(await Branch.findById(branchId))) {
      return next(new ApiError(404, "Branch not found"));
    }
    if (designationId && !(await Designation.findById(designationId))) {
      return next(new ApiError(404, "Designation not found"));
    }
    if (postedBy && !(await User.findById(postedBy))) {
      return next(new ApiError(404, "User (postedBy) not found"));
    }

    // ✅ Update and populate references
    const jobPost = await JobPost.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("branchId", "branchId title")
      .populate("departmentId", "departmentId title")
      .populate("designationId", "title")
      .populate("postedBy", "name email");

    if (!jobPost) {
      return next(new ApiError(404, "JobPost not found"));
    }

    return res.api(200, "JobPost updated successfully", jobPost);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

// Close JobPost (soft close)
export const closeJobPost = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid JobPost ID"));
    }

    const jobPost = await JobPost.findByIdAndUpdate(
      id,
      { status: "Closed", closedAt: Date.now() },
      { new: true }
    );

    if (!jobPost) {
      return next(new ApiError(404, "JobPost not found"));
    }

    return res.api(200, "JobPost closed successfully !!", jobPost);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

// Delete JobPost permanently
export const deleteJobPostPermanently = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid JobPost ID"));
    }

    const jobPost = await JobPost.findByIdAndDelete(id);

    if (!jobPost) {
      return next(new ApiError(404, "JobPost not found"));
    }

    return res.api(200, "JobPost permanently deleted successfully !!", jobPost);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};
