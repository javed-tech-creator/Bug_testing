import BrandRepoUploadModel from "../../models/marketing/brandRepo.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import ApiError from "../../utils/master/ApiError.js";
import mongoose from "mongoose";
import { getPaginationParams } from "../../utils/pageLimitValidation.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// CREATE
export const createBrand = async (req, res, next) => {
  try {
    const { title, category, campaignId } = req.body;

    // 1. Required field validation
    if (!title || title.trim().length < 3) {
      return next(new ApiError(400, "Title is required (min 3 chars)"));
    }

    const allowedCategories = [
      "Photo",
      "Video",
      "Logo",
      "Brochure",
      "Creative",
    ];

    if (!category || !allowedCategories.includes(category)) {
      return next(
        new ApiError(
          400,
          `Category must be one of: ${allowedCategories.join(", ")}`
        )
      );
    }

    if (!campaignId || !isValidObjectId(campaignId)) {
      return next(new ApiError(400, "Valid Campaign ID is required"));
    }

    if (!req.file) {
      return next(new ApiError(400, "File is required"));
    }

    // Upload new image
    const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
      folder: "campaign-brand-repository",
      public_id: `file${Date.now()}`,
      use_filename: true,
      resource_type: "auto", // image/video auto detect
    });

    //  Remove local temp file safely
    try {
      fs.unlinkSync(req.file.path);
    } catch (err) {
      console.warn(" Temp file delete failed:", err.message);
    }

    //  Save to DB
    const upload = new BrandRepoUploadModel({
      title,
      category,
      campaignId,
      file: {
        name: req.file.originalname, // original filename
        size: req.file.size, // in bytes
        type: req.file.mimetype, // MIME type
        url: cloudinaryResponse.secure_url, // cloudinary ka URL
      },
    });

    await upload.save();

    res.status(201).json({
      message: "Upload successfully",
      data: upload,
    });
  } catch (err) {
    next(err);
  }
};

// fetch (all - except deleted data)
export const getBrands = async (req, res, next) => {
  try {
    const { campaignId, category } = req.query; // params query se aayenge
    const { page, limit, skip } = getPaginationParams(req);

    const filter = { isDeleted: false };

    //  filter by campaignId (if provided)
    if (campaignId) {
      if (!isValidObjectId(campaignId)) {
        return next(new ApiError(400, "Valid Campaign ID is required"));
      }
      filter.campaignId = campaignId;
    }

    //  filter by category (if provided)
    if (category) {
      filter.category = category;
    }

        // Total count (for pagination UI)
    const total = await BrandRepoUploadModel.countDocuments(filter);

    //  Fetch data
    const brandRepo = await BrandRepoUploadModel.find(filter)
      .populate("campaignId", "campaignName") // sirf required fields populate karo
      .select("-isDeleted -deletedBy -updatedAt -__v")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "Brands fetched successfully",
      total,
      data: brandRepo,
    });
  } catch (err) {
    next(err);
  }
};

// READ (All including deleted)
export const getAll = async (req, res) => {
  try {
    const data = await BrandRepoUploadModel.find();
    const total = await BrandRepoUploadModel.countDocuments();
 
    res.status(200).json({message:"fetched all data", total, data});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getBrandCategoryCounts = async (req, res, next) => {
  try {
    // Bas deleted data hata do
    const matchFilter = { isDeleted: false };

    // Aggregation pipeline
    const categoryCounts = await BrandRepoUploadModel.aggregate([
      { $match: matchFilter }, // filter only active docs
      {
        $group: {
          _id: "$category", // group by category field
          count: { $sum: 1 }, // count each group
        },
      },
      {
        $project: {
          _id: 0, // _id remove
          category: "$_id",
          count: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Category counts fetched successfully",
      data: categoryCounts,
    });
  } catch (err) {
    next(err);
  }
};

// UPDATE
export const updateBrand = async (req, res, next) => {
  try {
    const { title, category, campaignId } = req.body;
    const { id } = req.params;

    // 1. Validate ID
    if (!isValidObjectId(id)) {
      return next(new ApiError(400, "Valid Brand ID is required"));
    }

    // 2. Check if brand exists
    const existingBrand = await BrandRepoUploadModel.findById(id);
    if (!existingBrand) {
      return next(new ApiError(404, "Brand not found"));
    }

    // 3. Validate title if provided
    if (title && title.trim().length < 3) {
      return next(new ApiError(400, "Title must be at least 3 characters"));
    }

    // 4. Validate category if provided
    const allowedCategories = ["Photo", "Video", "Logo", "Brochure", "Creative"];
    if (category && !allowedCategories.includes(category)) {
      return next(
        new ApiError(
          400,
          `Category must be one of: ${allowedCategories.join(", ")}`
        )
      );
    }

    // 5. Validate campaignId if provided
    if (campaignId && !isValidObjectId(campaignId)) {
      return next(new ApiError(400, "Valid Campaign ID is required"));
    }

    // 6. File handling (optional update)
    let updatedFile = existingBrand.file;
    if (req.file) {
      // upload new file to cloudinary
      const cloudinaryResponse = await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: "campaign-brand-repository",
          public_id: `file${Date.now()}`,
          use_filename: true,
          resource_type: "auto", // auto detect image/video
        }
      );

      try {
        fs.unlinkSync(req.file.path); // remove temp file
      } catch (err) {
        console.warn("Temp file delete failed:", err.message);
      }

      updatedFile = {
        name: req.file.originalname,
        size: req.file.size,
        type: req.file.mimetype,
        url: cloudinaryResponse.secure_url,
      };
    }

    // 7. Update DB
    const updatedBrand = await BrandRepoUploadModel.findByIdAndUpdate(
      id,
      {
        ...(title && { title }),
        ...(category && { category }),
        ...(campaignId && { campaignId }),
        file: updatedFile,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Brand updated successfully",
      data: updatedBrand,
    });
  } catch (err) {
    next(err);
  }
};

// SOFT DELETE
export const softDeleteBrand = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 1. Validate ID
    if (!isValidObjectId(id)) {
      return next(new ApiError(400, "Valid Asset ID is required"));
    }

    // 2. Check if record exists
    const existingBrand = await BrandRepoUploadModel.findById(id);
    if (!existingBrand) {
      return next(new ApiError(404, "Asset not found"));
    }

    // 3. Already deleted check
    if (existingBrand.isDeleted) {
      return next(new ApiError(400, "Asset is already deleted"));
    }

    // 4. Perform soft delete
    existingBrand.isDeleted = true;
    existingBrand.deletedBy = req.user?._id || null; // agar aap login user ka track rakhna chahte ho
    await existingBrand.save();

    res.status(200).json({
      success: true,
      message: "Asset deleted successfully",
      data: existingBrand,
    });
  } catch (err) {
    next(err);
  }
};

// HARD DELETE
export const hardDeleteBrand = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 1. Validate ID
    if (!isValidObjectId(id)) {
      return next(new ApiError(400, "Valid Brand ID is required"));
    }

    // 2. Find record
    const brand = await BrandRepoUploadModel.findById(id);
    if (!brand) {
      return next(new ApiError(404, "Brand not found"));
    }

    // 3. Delete file from Cloudinary (agar file hai)
    try {
      if (brand.file?.url) {
        // url se public_id extract karna hoga
        const publicId = brand.file.url.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`campaign-brand-repository/${publicId}`);
      }
    } catch (err) {
      console.warn("⚠️ Cloudinary delete failed:", err.message);
    }

    // 4. Delete record from DB
    await BrandRepoUploadModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Brand permanently deleted",
    });
  } catch (err) {
    next(err);
  }
};
