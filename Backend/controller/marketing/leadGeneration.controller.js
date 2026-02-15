import mongoose from "mongoose";
import MarketingLeadModel from "../../models/marketing/leadGenerationCapture.model.js";
import ApiError from "../../utils/master/ApiError.js";
import { getPaginationParams } from "../../utils/pageLimitValidation.js";

//  CREATE LEAD
export const createLead = async (req, res, next) => {
  try {
    const { email, phone } = req.body;

    if (!email || !phone) {
      return next(new ApiError(400, "email or phone required"));
    }

    // lowercase normalize email
    const normalizedEmail = email.toLowerCase();

    // Duplicate phone/email check
    const existingLead = await MarketingLeadModel.findOne({
      $or: [{ phone }, { email: normalizedEmail }],
    });

    if (existingLead) {
      return next(
        new ApiError(400, "Lead already exists with same phone or email")
      );
    }

    const newLead = new MarketingLeadModel({
      ...req.body,
      createdBy: req.user._id,
    });

    await newLead.save();

    return res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: newLead,
    });
  } catch (error) {
    next(error);
  }
};

//  GET ALL LEADS (Pagination + Filters)
export const getLeads = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const { source, isForwarded } = req.query;

    const filters = {};
    if (source) filters.source = source;

    let includeForwardedAt = false;
    if (isForwarded !== undefined) {
      filters.isForwarded = isForwarded === "true";
      if (filters.isForwarded) includeForwardedAt = true; // true hone par show karo
    }

    // Build select dynamically
    let selectFields = "-updatedAt -createdAt -__v"; // common excludes
    if (!includeForwardedAt) {
      selectFields += " -forwardedAt"; // forwardedAt exclude kar do
    }

    const leads = await MarketingLeadModel.find(filters)
      .select(selectFields)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await MarketingLeadModel.countDocuments(filters);

    return res.status(200).json({
      success: true,
      message: "Leads Fetched Successfully",
      total,
      page,
      limit,
      data: leads,
    });
  } catch (error) {
    next(error);
  }
};

// ASSIGN LEAD to Sale Department (Forwarding)
export const assignLead = async (req, res, next) => {
  try {
    const { leadId } = req.body;

    // Validation
    if (!leadId) {
      return next(new ApiError(400, "Lead ID is required"));
    }

    // Find lead by ID
    const lead = await MarketingLeadModel.findById(leadId);
    if (!lead) {
      return next(new ApiError(404, "Lead not found"));
    }

    // Already forwarded check
    if (lead.isForwarded) {
      return next(new ApiError(400, "Lead is already forwarded"));
    }

    // Update lead
    lead.isForwarded = true;
    lead.forwardedAt = new Date();

    await lead.save();

    return res.status(200).json({
      success: true,
      message: "Lead forwarded successfully",
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllLeads = async (req, res, next) => {
  try {

    const leads = await MarketingLeadModel.find()
      .sort({ createdAt: -1 });

    const total = await MarketingLeadModel.countDocuments();

    return res.status(200).json({
      success: true,
      message: "All Leads Fetched Successfully",
      total,
      data: leads,
    });
  } catch (error) {
    next(error);
  }
};

//  UPDATE LEAD
export const updateLead = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new ApiError(400, "Invalid Lead ID"));

    }

        const existLead = await MarketingLeadModel.findById(id)

  if (!existLead) {
            return next(new ApiError(404, "Lead not found or Already deleted"));

    }
    const updatedLead = await MarketingLeadModel.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );


    return res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      data: updatedLead,
    });
  } catch (error) {
   next(error)
  }
};

//  SOFT DELETE LEAD
export const deleteLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedBy = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError(400, "Invalid Lead ID"));
    }

    const existLead = await MarketingLeadModel.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!existLead) {
      return next(new ApiError(404, "Lead not found or Already deleted"));
    }

    const lead = await MarketingLeadModel.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedBy },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
      data: lead,
    });
  } catch (error) {
  next(error)
  }
};

export const hardDeleteLead = async (req, res, next) => {
  try {
    const { id } = req.params;

    // ID validation
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError(400, "Invalid Lead ID"));
    }

    // Check if lead exists
    const existLead = await MarketingLeadModel.findById(id);
    if (!existLead) {
      return next(new ApiError(404, "Lead not found"));
    }

    // Hard delete
    await MarketingLeadModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Lead deleted permanently",
    });
  } catch (error) {
    next(error);
  }
};