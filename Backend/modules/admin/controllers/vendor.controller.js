import mongoose from "mongoose";
import ApiError from "../../../utils/master/ApiError.js";
import {
  uploadFiles,
  deleteFile,
  deleteLocalFile,
} from "../../../utils/master/cloudinary.js";
import VendorProfile from "../models/vendor.model.js";
import ContractorProfile from "../models/contractor.model.js";
import FreelancerProfile from "../models/freelancer.model.js";
import FranchiseProfile from "../models/franchise.model.js";
import PartnerProfile from "../models/partner.model.js";

/**
 @desc Create a new Vendor
  @route POST /api/vendors
 */
export const createVendor = async (req, res, next) => {
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

    // ==================== AUTO GENERATE VENDOR ID ====================
    const count = await VendorProfile.countDocuments();
    const profileId = `VND${1001 + count}`;

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

    const existingVendor = await VendorProfile.findOne({ $or: filters }).lean();
    if (existingVendor) {
      return next(
        new ApiError(400, "Vendor with given details already exists")
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
    const newVendor = new VendorProfile({
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

    await newVendor.save();

    return res.status(201).json({
      success: true,
      message: "Vendor created successfully!",
      data: newVendor,
    });
  } catch (err) {
    console.error("Error creating vendor:", err);

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
 * @desc Get all Vendors
 * @route GET /api/vendors
 */
export const getAllVendors = async (req, res, next) => {
  try {
    // --- Extract query params ---
    let { page = 1, limit = 25, isActive = null } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    console.log("isActive data is", isActive, "type of is", typeof isActive);

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

    // --- Count total vendors ---
    const total = await VendorProfile.countDocuments(filter);

    // --- Fetch vendors with pagination ---
    const vendors = await VendorProfile.find(filter)
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

      data: vendors,
    });
  } catch (error) {
    console.error("Error fetching vendors:", error);
    next(error);
  }
};

/**
 * @desc Get Vendor by ID
 * @route GET /api/vendors/:id
 */
export const getVendorById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError(400, "Invalid vendor ID format"));
    }

    const vendor = await VendorProfile.findById(id);

    if (!vendor) {
      return next(new ApiError(404, "Vendor profile not found"));
    }

    res.status(200).json({
      success: true,
      data: vendor,
    });
  } catch (error) {
    console.error("Error fetching vendor by ID:", error);
    next(error);
  }
};

/**
 * @desc Update Vendor
 * @route PUT /api/vendors/:id
 */

export const updateVendor = async (req, res, next) => {
  const uploadedFiles = [];

  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError(400, "Invalid or missing vendor ID"));
    }

    const existingVendor = await VendorProfile.findById(id);
    if (!existingVendor) {
      return next(new ApiError(404, "Vendor not found"));
    }

    const updateData = { ...req.body };

    // ============= PROFILE IMAGE =================
    if (req.body.removeProfileImage === "true") {
      // Delete existing profile image from storage
      if (existingVendor.profileImage?.public_id)
        await deleteFile(existingVendor.profileImage.public_id).catch(() => {});
      else if (existingVendor.profileImage?.url)
        await deleteLocalFile(existingVendor.profileImage.url).catch(() => {});

      updateData.profileImage = null;
    } else if (req.files?.profileImage?.[0]) {
      const file = req.files.profileImage[0];

      if (existingVendor.profileImage?.public_id)
        await deleteFile(existingVendor.profileImage.public_id).catch(() => {});
      else if (existingVendor.profileImage?.url)
        await deleteLocalFile(existingVendor.profileImage.url).catch(() => {});

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
      if (existingVendor.contractForm?.public_id)
        await deleteFile(existingVendor.contractForm.public_id).catch(() => {});
      else if (existingVendor.contractForm?.url)
        await deleteLocalFile(existingVendor.contractForm.url).catch(() => {});

      updateData.contractForm = null;
    } else if (req.files?.contractForm?.[0]) {
      const file = req.files.contractForm[0];

      if (existingVendor.contractForm?.public_id)
        await deleteFile(existingVendor.contractForm.public_id).catch(() => {});
      else if (existingVendor.contractForm?.url)
        await deleteLocalFile(existingVendor.contractForm.url).catch(() => {});

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
    if (existingVendor.additionalDocs?.length > 0) {
      const retainedIds = existingDocs.map((d) => d._id?.toString());
      const removedDocs = existingVendor.additionalDocs.filter(
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
    const updatedVendor = await VendorProfile.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Vendor updated successfully!",
      data: updatedVendor,
    });
  } catch (err) {
    console.error("Error updating vendor:", err);

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
 * @desc Hard Delete Vendor
 * @route DELETE /api/vendors/:id
 */
export const deleteVendor = async (req, res, next) => {
  try {
    const { id } = req.params;

    // --- Find Vendor ---
    const vendor = await VendorProfile.findById(id);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    const uploadedFiles = [];

    // ==================== COLLECT FILES TO DELETE ====================

    // --- Profile Image ---
    if (vendor.profileImage) uploadedFiles.push(vendor.profileImage);

    // --- Contract Form ---
    if (vendor.contractForm) uploadedFiles.push(vendor.contractForm);

    // --- Additional Docs ---
    if (
      Array.isArray(vendor.additionalDocs) &&
      vendor.additionalDocs.length > 0
    ) {
      vendor.additionalDocs.forEach((doc) => {
        if (doc) uploadedFiles.push(doc);
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

    // ==================== DELETE VENDOR DOCUMENT ====================
    await VendorProfile.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Vendor and all uploaded files deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting vendor:", error);
    next(error);
  }
};
