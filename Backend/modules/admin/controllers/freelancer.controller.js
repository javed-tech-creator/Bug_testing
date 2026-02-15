import mongoose from "mongoose";
import ApiError from "../../../utils/master/ApiError.js";
import {
  uploadFiles,
  deleteFile,
  deleteLocalFile,
} from "../../../utils/master/cloudinary.js";
import FreelancerProfile from "../models/freelancer.model.js";

/**
 @desc Create a new Freelancer
  @route POST /api/Freelancers
 */
export const createFreelancer = async (req, res, next) => {
  const uploadedFiles = [];

  try {
    const {
      contactPersonName,
      contactNumber,
      alternateContact,
      email,
      businessName,
      address,
      city,
      state,
      pincode,
      gstNumber,
      panNumber,
      aadharNumber,
      bankName,
      accountNumber,
      ifscCode,
      docTitles, // for additionalDocs titles (from frontend)
    } = req.body;

    console.log("req.body are", req.body);

    // ==================== AUTO GENERATE Freelancer ID ====================
    const count = await FreelancerProfile.countDocuments();
    const profileId= `FLR${1001 + count}`;

    // ==================== REQUIRED FIELD VALIDATION ====================
    const requiredFields = {
      profileId,
      contactPersonName,
      contactNumber,
      email,
      businessName,
      address,
      city,
      state,
      pincode,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value || value.toString().trim() === "")
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return next(
        new ApiError(
          400,
          `Missing required field${
            missingFields.length > 1 ? "s" : ""
          }: ${missingFields.join(", ")}`
        )
      );
    }

    // ==================== DUPLICATE CHECK ====================
    const filters = [
      { contactNumber },
      { email: email?.toLowerCase().trim() },
      { businessName },
    ];
    if (gstNumber) filters.push({ gstNumber });

    const existingFreelancer = await FreelancerProfile.findOne({
      $or: filters,
    }).lean();
    if (existingFreelancer) {
      return next(
        new ApiError(400, "Freelancer with given details already exists")
      );
    }

    // ==================== FILE UPLOAD SECTION ====================

    // ---- Profile Image ----
    let profileImageData = null;
    if (req.files?.profileImage?.[0]) {
      const file = req.files.profileImage[0];

      let result =
        process.env.USE_CLOUDINARY === "true"
          ? await uploadFiles([file])
          : {
              success: true,
              files: [
                {
                  url: file.path.replace(/\\/g, "/"),
                  public_url: null,
                  public_id: null,
                },
              ],
            };

      if (!result.success || !result.files[0]?.url)
        return next(new ApiError(400, "Unable to upload profile image"));

      const uploaded = result.files[0];
      profileImageData = {
        fileName: file.originalname,
        fileType: file.mimetype,
        url: uploaded.url,
        public_url: uploaded.public_url,
        public_id: uploaded.public_id,
      };

      uploadedFiles.push(profileImageData);
    }

    // ---- Contract Form ----
    let contractFormData = null;
    if (req.files?.contractForm?.[0]) {
      const file = req.files.contractForm[0];

      let result =
        process.env.USE_CLOUDINARY === "true"
          ? await uploadFiles([file])
          : {
              success: true,
              files: [
                {
                  url: file.path.replace(/\\/g, "/"),
                  public_url: null,
                  public_id: null,
                },
              ],
            };

      if (!result.success || !result.files[0]?.url)
        return next(new ApiError(400, "Unable to upload contract form"));

      const uploaded = result.files[0];
      contractFormData = {
        fileName: file.originalname,
        fileType: file.mimetype,
        url: uploaded.url,
        public_url: uploaded.public_url,
        public_id: uploaded.public_id,
      };

      uploadedFiles.push(contractFormData);
    }

    // ---- Additional Documents ----
    let additionalDocsData = [];
    if (req.files?.additionalDocs?.length > 0) {
      const files = req.files.additionalDocs;

      let result =
        process.env.USE_CLOUDINARY === "true"
          ? await uploadFiles(files)
          : {
              success: true,
              files: files.map((f) => ({
                url: f.path.replace(/\\/g, "/"),
                public_url: null,
                public_id: null,
              })),
            };

      if (!result.success)
        return next(new ApiError(400, "Unable to upload additional documents"));

      additionalDocsData = result.files.map((uploaded, idx) => ({
        docTitle: Array.isArray(docTitles)
          ? docTitles[idx] || docTitles
          : docTitles || `Document ${idx + 1}`,
        fileName: files[idx].originalname,
        fileType: files[idx].mimetype,
        url: uploaded.url,
        public_url: uploaded.public_url,
        public_id: uploaded.public_id,
      }));

      uploadedFiles.push(...result.files);
    }

    // ==================== SAVE TO DATABASE ====================
    const newFreelancer = new FreelancerProfile({
      profileId,
      contactPersonName,
      contactNumber,
      alternateContact,
      email,
      businessName,
      address,
      city,
      state,
      pincode,
      gstNumber,
      panNumber,
      aadharNumber,
      bankName,
      accountNumber,
      ifscCode,
      profileImage: profileImageData,
      contractForm: contractFormData,
      additionalDocs: additionalDocsData,
    });

    await newFreelancer.save();

    return res.status(201).json({
      success: true,
      message: "Freelancer created successfully!",
      data: newFreelancer,
    });
  } catch (err) {
    console.error("Error creating Freelancer:", err);

    // ==================== ROLLBACK ON FAILURE ====================
    for (const file of uploadedFiles) {
      try {
        if (file?.public_id) await deleteFile(file.public_id).catch(() => {});
        if (file?.url) await deleteLocalFile(file.url).catch(() => {});
      } catch {}
    }

    next(err);
  }
};

/**
 * @desc Get all Freelancers
 * @route GET /api/Freelancers
 */
export const getAllFreelancers = async (req, res, next) => {
  try {
    // --- Extract query params ---
    let { page = 1, limit = 25, isActive = null } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    // --- Build filter query ---
   const filter = {};
    if (
      isActive !== null &&
      isActive !== undefined &&
      isActive !== "" &&
      isActive !== "null" &&
      isActive !== "undefined"
    ) {
      filter.isActive = isActive === "true";
    }


    // --- Count total Freelancers ---
    const total = await FreelancerProfile.countDocuments(filter);

    // --- Fetch Freelancers with pagination ---
    const Freelancers = await FreelancerProfile.find(filter)
      .select(
        "_id profileId contactPersonName contactNumber alternateContact email businessName address city state isActive"
      )
      .sort({ createdAt: -1 }) // latest first
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // --- Response ---
    res.status(200).json({
      success: true,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),

      data: Freelancers,
    });
  } catch (error) {
    console.error("Error fetching Freelancers:", error);
    next(error);
  }
};

/**
 * @desc Get Freelancer by ID
 * @route GET /api/Freelancers/:id
 */
export const getFreelancerById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError(400, "Invalid Freelancer ID format"));
    }

    const Freelancer = await FreelancerProfile.findById(id);

    if (!Freelancer) {
      return next(new ApiError(404, "Freelancer profile not found"));
    }

    res.status(200).json({
      success: true,
      data: Freelancer,
    });
  } catch (error) {
    console.error("Error fetching Freelancer by ID:", error);
    next(error);
  }
};

/**
 * @desc Update Freelancer
 * @route PUT /api/Freelancers/:id
 */

export const updateFreelancer = async (req, res, next) => {
  const uploadedFiles = [];

  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError(400, "Invalid or missing Freelancer ID"));
    }

    const existingFreelancer = await FreelancerProfile.findById(id);
    if (!existingFreelancer) {
      return next(new ApiError(404, "Freelancer not found"));
    }

    const updateData = { ...req.body };

    // ============= PROFILE IMAGE =================
    if (req.body.removeProfileImage === "true") {
      // Delete existing profile image from storage
      if (existingFreelancer.profileImage?.public_id)
        await deleteFile(existingFreelancer.profileImage.public_id).catch(
          () => {}
        );
      else if (existingFreelancer.profileImage?.url)
        await deleteLocalFile(existingFreelancer.profileImage.url).catch(
          () => {}
        );

      updateData.profileImage = null;
    } else if (req.files?.profileImage?.[0]) {
      const file = req.files.profileImage[0];

      if (existingFreelancer.profileImage?.public_id)
        await deleteFile(existingFreelancer.profileImage.public_id).catch(
          () => {}
        );
      else if (existingFreelancer.profileImage?.url)
        await deleteLocalFile(existingFreelancer.profileImage.url).catch(
          () => {}
        );

      const result =
        process.env.USE_CLOUDINARY === "true"
          ? await uploadFiles([file])
          : {
              success: true,
              files: [
                {
                  url: file.path.replace(/\\/g, "/"),
                  public_url: null,
                  public_id: null,
                },
              ],
            };

      if (!result.success || !result.files[0]?.url)
        return next(new ApiError(400, "Unable to upload profile image"));

      const uploaded = result.files[0];
      updateData.profileImage = {
        fileName: file.originalname,
        fileType: file.mimetype,
        url: uploaded.url,
        public_url: uploaded.public_url,
        public_id: uploaded.public_id,
      };
      uploadedFiles.push(uploaded);
    }

    // ============= CONTRACT FORM =================

    if (req.body.removeContractForm === "true") {
      // Delete existing profile image from storage
      if (existingFreelancer.contractForm?.public_id)
        await deleteFile(existingFreelancer.contractForm.public_id).catch(
          () => {}
        );
      else if (existingFreelancer.contractForm?.url)
        await deleteLocalFile(existingFreelancer.contractForm.url).catch(
          () => {}
        );

      updateData.contractForm = null;
    } else if (req.files?.contractForm?.[0]) {
      const file = req.files.contractForm[0];

      if (existingFreelancer.contractForm?.public_id)
        await deleteFile(existingFreelancer.contractForm.public_id).catch(
          () => {}
        );
      else if (existingFreelancer.contractForm?.url)
        await deleteLocalFile(existingFreelancer.contractForm.url).catch(
          () => {}
        );

      const result =
        process.env.USE_CLOUDINARY === "true"
          ? await uploadFiles([file])
          : {
              success: true,
              files: [
                {
                  url: file.path.replace(/\\/g, "/"),
                  public_url: null,
                  public_id: null,
                },
              ],
            };

      if (!result.success || !result.files[0]?.url)
        return next(new ApiError(400, "Unable to upload contract form"));

      const uploaded = result.files[0];
      updateData.contractForm = {
        fileName: file.originalname,
        fileType: file.mimetype,
        url: uploaded.url,
        public_url: uploaded.public_url,
        public_id: uploaded.public_id,
      };
      uploadedFiles.push(uploaded);
    }

    // ============= ADDITIONAL DOCUMENTS =================

    console.log(" exist are", req.body.existingDocs);

    //  Step 1: Parse retained existing docs (they come as JSON strings)
    let existingDocs = [];
    if (req.body.existingDocs) {
      try {
        if (Array.isArray(req.body.existingDocs)) {
          existingDocs = req.body.existingDocs.map((d) =>
            typeof d === "string" ? JSON.parse(d) : d
          );
        } else if (typeof req.body.existingDocs === "string") {
          existingDocs = [JSON.parse(req.body.existingDocs)];
        }
      } catch (e) {
        console.warn("Failed to parse existingDocs");
      }
    }

    // Step 1.5: Find which old docs were removed and delete them
    if (existingFreelancer.additionalDocs?.length > 0) {
      const retainedIds = existingDocs.map((d) => d._id?.toString());
      const removedDocs = existingFreelancer.additionalDocs.filter(
        (doc) => !retainedIds.includes(doc._id?.toString())
      );

      for (const doc of removedDocs) {
        try {
          if (doc?.public_id) {
            await deleteFile(doc.public_id).catch(() => {});
          } else if (doc?.url) {
            await deleteLocalFile(doc.url).catch(() => {});
          }
        } catch (err) {
          console.warn("Failed to delete removed doc:", err);
        }
      }
    }

    //  Step 2: Add new uploaded documents
    let newDocs = [];
    if (req.files?.additionalDocs?.length > 0) {
      const files = req.files.additionalDocs;

      const result =
        process.env.USE_CLOUDINARY === "true"
          ? await uploadFiles(files)
          : {
              success: true,
              files: files.map((f) => ({
                url: f.path.replace(/\\/g, "/"),
                public_url: null,
                public_id: null,
              })),
            };

      if (!result.success)
        return next(new ApiError(400, "Unable to upload additional docs"));

      const docTitles = Array.isArray(req.body.docTitles)
        ? req.body.docTitles
        : [req.body.docTitles].filter(Boolean);

      newDocs = result.files.map((uploaded, idx) => ({
        docTitle: docTitles[idx] || `Document ${existingDocs.length + idx + 1}`,
        fileName: files[idx].originalname,
        fileType: files[idx].mimetype,
        url: uploaded.url,
        public_url: uploaded.public_url,
        public_id: uploaded.public_id,
      }));

      uploadedFiles.push(...result.files);
    }

    //  Step 3: Merge both (existing + new)
    updateData.additionalDocs = [...existingDocs, ...newDocs];

    // ============= UPDATE DATABASE =================
    const updatedFreelancer = await FreelancerProfile.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Freelancer updated successfully!",
      data: updatedFreelancer,
    });
  } catch (err) {
    console.error("Error updating Freelancer:", err);

    // Rollback newly uploaded files
    for (const file of uploadedFiles) {
      try {
        if (file?.public_id) await deleteFile(file.public_id);
        if (file?.url) await deleteLocalFile(file.url);
      } catch {}
    }

    next(err);
  }
};

/**
 * @desc Hard Delete Freelancer
 * @route DELETE /api/Freelancers/:id
 */
export const deleteFreelancer = async (req, res, next) => {
  try {
    const { id } = req.params;

    // --- Find Freelancer ---
    const Freelancer = await FreelancerProfile.findById(id);
    if (!Freelancer) {
      return res.status(404).json({
        success: false,
        message: "Freelancer not found",
      });
    }

    const uploadedFiles = [];

    // ==================== COLLECT FILES TO DELETE ====================

    // --- Profile Image ---
    if (Freelancer.profileImage) uploadedFiles.push(Freelancer.profileImage);

    // --- Contract Form ---
    if (Freelancer.contractForm) uploadedFiles.push(Freelancer.contractForm);

    // --- Additional Docs ---
    if (
      Array.isArray(Freelancer.additionalDocs) &&
      Freelancer.additionalDocs.length > 0
    ) {
      Freelancer.additionalDocs.forEach((doc) => {
        if (doc) uploadedFiles.push(doc);
        console.log("Doc file are", doc);
      });
    }

    // ==================== DELETE FILES ====================
    for (const file of uploadedFiles) {
      try {
        if (file?.public_id) {
          // Cloudinary deletion
          await deleteFile(file.public_id).catch(() => {});
        }
        if (file?.url && !file.public_url) {
          // Local deletion
          await deleteLocalFile(file.url).catch(() => {});
        }
      } catch (fileErr) {
        console.error("Error deleting file:", file, fileErr);
      }
    }

    // ==================== DELETE Freelancer DOCUMENT ====================
    await FreelancerProfile.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Freelancer and all uploaded files deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting Freelancer:", error);
    next(error);
  }
};
