import mongoose from "mongoose";
import campaignModel from "../../models/marketing/campaign.model.js";
import ApiError from "../../utils/master/ApiError.js";
import { isURL } from "../../validator/lib/isURL.js";
import { getPaginationParams } from "../../utils/pageLimitValidation.js";

// Optional: Utility to check for valid ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createCampaign = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const {
      campaign_id,
      campaignName,
      type,
      platform,
      objective,
      targetAudience,
      budget,
      landingPage,
      startDate,
      endDate,
    } = req.body;

    // 1️ Basic request-level validation
    if (!isValidObjectId(userId)) {
      return next(new ApiError(400, "Invalid or missing user ID"));
    }

    // 1️ Basic request-level validation
    if (
      !campaign_id ||
      !campaignName ||
      !type ||
      !platform ||
      !objective ||
      !targetAudience ||
      !budget ||
      !startDate ||
      !endDate
    ) {
      return next(new ApiError(400, "All required fields must be provided"));
    }

    const duplicateCampaignId = await campaignModel.findOne({campaign_id:campaign_id, isDeleted:false});

    if(duplicateCampaignId){
  return next(new ApiError(400, "Campaign Id already exist "));
    }

    if (
      !targetAudience.region ||
      !targetAudience.demographics ||
      !Array.isArray(targetAudience.interests) ||
      targetAudience.interests.length === 0
    ) {
      return next(new ApiError(400, "Target audience details are invalid"));
    }

    if (budget <= 0) {
      return next(new ApiError(400, "Budget must be greater than 0"));
    }

    if (landingPage) {
      // optional URL validation (use validator package)
      if (!isURL(landingPage)) {
        return res.status(400).json({
          success: false,
          message: "Landing page must be a valid URL",
        });
      }
    }

    if (new Date(endDate) < new Date(startDate)) {
      return next(new ApiError(400, "End date must be after start date"));
    }

    // 2️ Save to database (Mongoose schema validation will also run)
    const campaign = new campaignModel({ ...req.body, createdBy: userId });
    await campaign.save();

    res.status(201).json({
      success: true,
      message: "Campaign created successfully",
      campaign,
    });
  } catch (error) {
    next(error);
  }
};

//  Update campaign
export const updateCampaign = async (req, res, next) => {
  try {
    const { id } = req.params;
 const {campaign_id} = req.body;

    // 1️ Validate ID format
    if (!isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid campaign ID format"));
    }

        const duplicateCampaignId = await campaignModel.findOne({campaign_id:campaign_id, isDeleted:false, _id: { $ne: id },});
        
  if(duplicateCampaignId){
  return next(new ApiError(400, "Campaign Id already exist "));
    }

    // 2️ Allowed fields to update (security)
    const allowedUpdates = [
      "campaign_id",
      "campaignName",
      "type",
      "platform",
      "objective",
      "targetAudience",
      "budget",
      "landingPage",
      "startDate",
      "endDate",
    ];

    const updates = {};
    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    if (Object.keys(updates).length === 0) {
      return next(new ApiError(400, "No valid fields provided for update"));
    }

    // 3️ Update campaign (only if not deleted)
    const campaign = await campaignModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!campaign) {
      return next(new ApiError(404, "Campaign not found or already deleted"));
    }

    res.status(200).json({
      success: true,
      message: "Campaign updated successfully",
      campaign,
    });
  } catch (error) {
    next(error);
  }
};

//  Get campaign data except deleted
export const getCampaigns = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);

    const campaigns = await campaignModel
      .find({
        isDeleted: false,
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-isDeleted -deletedBy ")
      .populate("createdBy", "name role")
      .populate("statusHistory.updatedBy", "name role");


    const total = await campaignModel.countDocuments({ isDeleted: false });

    res.status(200).json({
      success: true,
      message: "Campaigns Fetched Successfully",
      page: page,
      totalPages: Math.ceil(total / limit),
      totalCampaigns: total,
      campaigns,
    });
  } catch (error) {
    next(error);
  }
};

export const getCampaignLists = async (req, res, next) => {
  try {

    const campaigns = await campaignModel
      .find({
        isDeleted: false,
      })
      .select("_id campaignName")
      .sort({ createdAt: -1 })

    const total = await campaignModel.countDocuments({ isDeleted: false });

    res.status(200).json({
      success: true,
      message: "CampaignLists Fetched Successfully",
      total,
      campaigns,
    });
  } catch (error) {
    next(error);
  }
};


//  Get all campaigns
export const getAllCampaigns = async (req, res, next) => {
  try {
    const campaigns = await campaignModel.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      message: "All Campaign fethced successfully including deleted",
      campaigns,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCampaign = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 1️ Validate ID format
    if (!isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid campaign ID format"));
    }

    // 2️ Find campaign (not already deleted)
    const campaign = await campaignModel.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!campaign) {
      return next(new ApiError(404, "Campaign not found or already deleted"));
    }

    // 4️ Soft delete + audit trail
    campaign.isDeleted = true;
    campaign.deletedBy = id || null;

    await campaign.save();

    res.status(200).json({
      success: true,
      message: "Campaign deleted successfully",
      deletedBy: req.user?._id, // optional: frontend ko dikhane ke liye
    });
  } catch (error) {
    next(error);
  }
};

export const hardDeleteCampaign = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 1️ Validate ID format
    if (!isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid campaign ID format"));
    }

    // 2️ Find and delete campaign permanently
    const campaign = await campaignModel.findByIdAndDelete(id);

    if (!campaign) {
      return next(new ApiError(404, "Campaign not found or already deleted"));
    }

    res.status(200).json({
      success: true,
      message: "Campaign permanently deleted from database",
      deletedId: id,
    });
  } catch (error) {
    next(error);
  }
};

// Update campaign status
export const updateCampaignStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate ID
    if (!isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid campaign ID"));
    }

    // Validate status
    const validStatus = [
      "Running",
      "Paused",
      "Scheduled",
      "Completed",
      "Cancelled",
      "Failed",
    ];
    if (!validStatus.includes(status)) {
      return next(new ApiError(400, "Invalid status value"));
    }

    const campaign = await campaignModel.findById(id);

     if (!campaign) {
      return next(new ApiError(404, "Campaign not found"));
    }

     if(campaign.status === "Completed"){
      return next(new ApiError(400, "Cannot change status of a Completed campaign"));
     }

      if(campaign.status === status){
  return next(new ApiError(400, "Cannot update to the same status again"));
     }


 // Update status
    campaign.status = status;

    // Push to history
    campaign.statusHistory.push({
      status,
      updatedBy:req.user._id,
      updatedAt: new Date(),
    });

    await campaign.save();
   

    return res
      .status(200)
      .json({
        success: true,
        message: "Status Successfully Updated",
        data: campaign,
      });
  } catch (err) {
    next(err);
  }
};
