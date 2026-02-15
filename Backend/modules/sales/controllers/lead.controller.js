import mongoose from "mongoose";
import campaignModel from "../../../models/marketing/campaign.model.js";
import ApiError from "../../../utils/master/ApiError.js";
import User from "../../HR/models/masters/user.model.js";
import Lead from "../models/lead.model.js";
import { sendNotification } from "../../notification/controllers/notification.controller.js";
import Client from "../models/client.model.js";
import { uploadFiles } from "../../../utils/master/cloudinary.js";

export const createLead = async (req, res, next) => {
  try {
    const {
      clientName,
      phone,
      leadSource,
      campaignId,
      leadBy,
      branch,
      leadLabel,
      leadType,
      clientId,
      companyName,
      designation,
      businessType,
      email,
      altPhone,
      whatsapp,
      city,
      state,
      pincode,
      address,
      requirement,
      expectedBusiness,
      clientRatingInBusiness,
      leadStatus,
      assignBy,
      assignTo,
      googleLocation,
    } = req.body;

    // ===================== 1. BASIC FIELD VALIDATION =====================
    if (!clientName?.trim())
      return next(new ApiError(400, "Client name is required"));

    if (!phone?.trim())
      return next(new ApiError(400, "Client phone number is required"));

    // ===================== 2. OBJECT ID VALIDATION =====================
    if (campaignId && !mongoose.isValidObjectId(campaignId))
      return next(new ApiError(400, "Invalid campaignId format"));

    if (leadBy && !mongoose.isValidObjectId(leadBy))
      return next(new ApiError(400, "Invalid leadBy userId format"));

    if (branch && !mongoose.isValidObjectId(branch))
      return next(new ApiError(400, "Invalid leadBy branch format"));

    if (assignBy && !mongoose.isValidObjectId(assignBy))
      return next(new ApiError(400, "Invalid assignBy userId format"));

    if (clientId && !mongoose.isValidObjectId(clientId))
      return next(new ApiError(400, "Invalid clientId format"));

    if (assignTo && Array.isArray(assignTo)) {
      const invalidIds = assignTo.filter((id) => !mongoose.isValidObjectId(id));
      if (invalidIds.length)
        return next(
          new ApiError(400, "One or more assignTo userIds are invalid"),
        );
    }

    // ===================== 3. LOGIC VALIDATION =====================
    // REPEAT leadType must have valid clientId
    if (leadType?.toUpperCase() === "REPEAT" && !clientId)
      return next(
        new ApiError(400, "clientId is required for REPEAT lead type"),
      );

    // ===================== 4. REFERENCE EXISTENCE CHECK =====================
    // 4.1 - Validate leadBy user
    if (leadBy) {
      const leadByUser = await User.findOne({ _id: leadBy });
      if (!leadByUser)
        return next(new ApiError(404, "LeadBy user not found or inactive"));
    }

    // 4.2 - Validate assignBy user
    if (assignBy) {
      const assignByUser = await User.findOne({ _id: assignBy });
      if (!assignByUser)
        return next(new ApiError(404, "AssignBy user not found or inactive"));
    }

    if (assignTo?.length) {
      const assignUsers = await User.find({
        _id: { $in: assignTo },
      });
      if (assignUsers.length !== assignTo.length)
        return next(
          new ApiError(404, "One or more assignTo users not found or inactive"),
        );
    }

    if (leadType?.toUpperCase() === "REPEAT" && clientId) {
      const clientExists = await Client.findOne({ _id: clientId });
      if (!clientExists)
        return next(new ApiError(404, "Referenced client not found"));
    }

    if (campaignId) {
      const campaign = await campaignModel.findOne({
        _id: campaignId,
      });
      if (!campaign)
        return next(new ApiError(404, "Active campaign not found"));
    }

    if (leadType?.toUpperCase() == "FRESH") {
      const existingPhone = await Lead.findOne({ phone: phone.trim() });
      if (existingPhone)
        return next(new ApiError(400, "Phone number already exists"));

      if (email) {
        const existingEmail = await Lead.findOne({
          email: email.trim().toLowerCase(),
        });
        if (existingEmail)
          return next(new ApiError(400, "Email already exists"));
      }
    }

    const getFileType = (mimeType = "") => {
      if (mimeType.startsWith("image/")) return "image";
      if (mimeType.startsWith("video/")) return "video";
      if (mimeType.startsWith("audio/")) return "audio";
      return "document";
    };

    let requirementFiles = [];

    if (req.files?.documents?.length > 0) {
      let result;

      if (process.env.USE_CLOUDINARY === "true") {
        result = await uploadFiles(req.files.documents);

        if (!result.success || !result.files.length) {
          return next(new ApiError(400, "Unable to upload requirement files"));
        }

        result.files = result.files.map((file, index) => ({
          ...file,
          type: getFileType(req.files.documents[index].mimetype),
          name: req.files.documents[index].originalname,
        }));
      } else {
        result = {
          success: true,
          files: req.files.documents.map((f) => ({
            url: f.path.replace(/\\/g, "/"),
            public_url: null,
            public_id: null,
            type: getFileType(f.mimetype),
            name: f.originalname,
          })),
        };
      }

      requirementFiles = result.files;
    }

    const lead = new Lead({
      clientName: clientName.trim(),
      phone: phone.trim(),
      leadSource: leadSource?.trim() || null,
      campaignId: campaignId || null,
      leadBy,
      leadLabel: leadLabel?.toUpperCase() || "COLD",
      leadType: leadType?.toUpperCase() || "FRESH",
      clientId: clientId || null,
      companyName: companyName?.trim() || null,
      designation: designation?.trim() || null,
      businessType: businessType?.trim() || null,
      email: email?.trim().toLowerCase() || null,
      altPhone: altPhone?.trim() || null,
      whatsapp: whatsapp?.trim() || null,
      city: city?.trim() || null,
      state: state?.trim() || null,
      pincode: pincode?.trim() || null,
      address: address?.trim() || null,
      requirement: requirement?.trim() || null,
      requirementFiles: requirementFiles || null,
      expectedBusiness: expectedBusiness || null,
      clientRatingInBusiness: clientRatingInBusiness || null,
      leadStatus: leadStatus?.toUpperCase() || "PENDING",
      assignBy: assignBy || null,
      branch: branch || null,
      googleLocation: googleLocation || null,
      assignTo:
        assignTo?.map((userId) => ({
          userId,
          assignedAt: new Date(),
        })) || [],
      statusTimeline: [
        {
          status: leadStatus?.toUpperCase() || "PENDING",
          timestamp: new Date(),
          remark: "Lead created successfully",
        },
      ],
    });

    const savedLead = await lead.save();
    return res.api(201, "Lead created successfully", savedLead);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

export const getAllLeads = async (req, res, next) => {
  try {
    const {
      city,
      assignBy,
      assignTo,
      leadBy,
      leadStatus,
      leadLabel,
      campaignId,
      businessType,
      pincode,
      isActive,
      search,
      sortBy,
      sortOrder,
      match = "and", // user can control matching
      page = 1,
      limit = 10,
    } = req.query;

    const baseFilter = {};
    const filters = [];
    const userOr = [];

    // 1. City
    if (city && typeof city === "string" && city.trim()) {
      filters.push({ city: new RegExp(city.trim(), "i") });
    }

    // 2. AssignBy (Id or Name)
    if (assignBy) {
      if (mongoose.isValidObjectId(assignBy)) {
        filters.push({ assignBy });
      } else {
        filters.push({ "assignBy.name": new RegExp(assignBy.trim(), "i") });
      }
    }

    // 3. LeadBy (Id or Name)
    if (leadBy) {
      if (mongoose.isValidObjectId(leadBy)) {
        userOr.push({ leadBy });
      } else {
        userOr.push({ "leadBy.name": new RegExp(leadBy.trim(), "i") });
      }
    }

    // 4. AssignTo (Id or Name)
    if (assignTo) {
      if (mongoose.isValidObjectId(assignTo)) {
        userOr.push({ "assignTo.userId": assignTo });
      } else {
        userOr.push({
          "assignTo.userId.name": new RegExp(assignTo.trim(), "i"),
        });
      }
    }

    if (leadStatus && typeof leadStatus === "string") {
      filters.push({ leadStatus: leadStatus.toUpperCase() });
    }

    // 6. Lead Type
    if (leadLabel && typeofleadLabel === "string") {
      const allowedTypes = ["HOT", "WARM", "COLD"];
      if (!allowedTypes.includes(leadLabel.toUpperCase())) {
        return next(new ApiError(400, "InvalidleadLabel value"));
      }
      filters.push({ leadLabel: leadLabel.toUpperCase() });
    }

    if (userOr.length > 0) {
      filters.push({ $or: userOr });
    }

    // 7. Campaign (Id or Name)
    if (campaignId) {
      if (mongoose.isValidObjectId(campaignId)) {
        filters.push({ campaignId });
      } else {
        filters.push({
          "campaignId.title": new RegExp(campaignId.trim(), "i"),
        });
      }
    }

    // 8. Business Type
    if (
      businessType &&
      typeof businessType === "string" &&
      businessType.trim()
    ) {
      filters.push({ businessType: new RegExp(businessType.trim(), "i") });
    }

    // 9. Pincode
    if (pincode && typeof pincode === "string" && pincode.trim()) {
      filters.push({ pincode: pincode.trim() });
    }

    // 10. Active/Inactive
    if (isActive !== undefined) {
      if (!["true", "false", true, false].includes(isActive)) {
        return next(
          new ApiError(400, "Invalid isActive value. Use true/false."),
        );
      }
      filters.push({
        status:
          isActive === "true" || isActive === true ? "Active" : "Inactive",
      });
    }

    // 11. Text Search
    if (search && typeof search === "string" && search.trim()) {
      filters.push({
        $or: [
          { clientName: new RegExp(search.trim(), "i") },
          { phone: new RegExp(search.trim(), "i") },
          { companyName: new RegExp(search.trim(), "i") },
        ],
      });
    }

    // Combine filters using match

    const query =
      filters.length > 0
        ? {
            ...baseFilter,
            ...(match.toLowerCase() === "or"
              ? { $or: filters }
              : { $and: filters }),
          }
        : baseFilter;
    console.log(query);
    // Pagination
    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * pageSize;

    // Sorting
    const sortField = sortBy || "createdAt";
    const sortDirection = sortOrder === "asc" ? 1 : -1;

    // Query DB
    const [leads, total] = await Promise.all([
      Lead.find(query)
        .populate("leadBy", "name email")
        .populate("assignBy", "name email")
        .populate("assignTo.userId", "name email")
        .populate("campaignId", "title")
        .sort({ [sortField]: sortDirection })
        // .skip(skip)
        // .limit(pageSize)
        .lean(),
      Lead.countDocuments(query),
    ]);

    // Response
    return res.api(200, "Leads fetched successfully", {
      total,
      page: pageNumber,
      limit: pageSize,
      totalPages: Math.ceil(total / pageSize),
      leads,
    });
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

export const getLeadById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // ------------------ Validate Lead ID ------------------
    if (!mongoose.isValidObjectId(id))
      return next(new ApiError(400, "Invalid lead ID"));

    // ------------------ Fetch Lead ------------------
    const lead = await Lead.findById(id)
      .populate("assignTo.userId", "name email phone status role")
      .populate("assignBy", "name email phone role status")
      .populate("campaignId", "title type status")
      .populate("leadBy", "name email phone role status")
      .populate("clientId", "name email phone status")
      .lean();

    if (!lead || lead.status === "Inactive")
      return next(new ApiError(404, "Active lead not found"));

    // ------------------ Reference Validation ------------------
    const sanitizeRef = (ref) => (ref && ref.status === "Active" ? ref : null);

    const formattedLead = {
      _id: lead._id,
      clientName: lead.clientName,
      phone: lead.phone,
      email: lead.email,
      leadSource: lead.leadSource,
      leadType: lead.leadType,
      leadLabel: lead.leadLabel,
      companyName: lead.companyName,
      businessType: lead.businessType,
      designation: lead.designation,
      address: lead.address,
      requirement: lead.requirement,
      requirementFiles: lead.requirementFiles,
      expectedBusiness: lead.expectedBusiness,
      clientRatingInBusiness: lead.clientRatingInBusiness,
      leadStatus: lead.leadStatus,
      city: lead.city,
      state: lead.state,
      pincode: lead.pincode,
      altPhone: lead.altPhone,
      whatsapp: lead.whatsapp,
      remark: lead.remark,
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt,
      clientDesignation: lead.clientDesignation,
      contactPersonName: lead.contactPersonName,
      contactPersonEmail: lead.contactPersonEmail,
      contactPersonPhone: lead.contactPersonPhone,
      contactPersonAltPhone: lead.contactPersonAltPhone,
      contactPersonWhatsapp: lead.contactPersonWhatsapp,
      googleLocation: lead.googleLocation,

      // Active populated data
      campaignId: sanitizeRef(lead.campaignId),
      assignBy: sanitizeRef(lead.assignBy),
      leadBy: sanitizeRef(lead.leadBy),
      clientId: sanitizeRef(lead.clientId),

      // AssignTo list
      assignTo:
        lead.assignTo?.map((a) => ({
          user: sanitizeRef(a.userId),
          assignedAt: a.assignedAt,
        })) || [],

      // Status timeline
      statusTimeline:
        lead.statusTimeline?.map((s) => ({
          status: s.status,
          timestamp: s.timestamp,
          updatedBy: s.updatedBy || null,
          remark: s.remark || null,
        })) || [],
    };

    return res.api(200, "Lead details fetched successfully !!", formattedLead);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

export const updateLead = async (req, res, next) => {
  try {
    const { leadId } = req.params;
    const {
      clientName,
      phone,
      leadSource,
      campaignId,
      leadBy,
      leadLabel,
      dealBy,
      companyName,
      designation,
      clientDesignation,
      googleLocation,
      businessType,
      email,
      altPhone,
      whatsapp,

      contactPersonName,
      contactPersonEmail,
      contactPersonPhone,
      contactPersonAltPhone,
      contactPersonWhatsapp,

      city,
      state,
      pincode,
      address,
      requirement,
      expectedBusiness,
      clientRatingInBusiness,
      leadStatus,
      assignBy,
      assignTo,
      remark,
      leadType,
      clientId,
      relationshipManager,
    } = req.body;

    // ------------------ Validate Lead ID ------------------
    if (!mongoose.isValidObjectId(leadId))
      return next(new ApiError(400, "Invalid leadId"));

    const lead = await Lead.findById(leadId);
    if (!lead || lead.status === "Inactive")
      return next(new ApiError(404, "Active lead not found"));

    // ------------------ Validate Foreign Keys ------------------
    const objectIds = {
      campaignId,
      leadBy,
      assignBy,
      clientId,
      relationshipManager,
    };
    for (const [key, value] of Object.entries(objectIds)) {
      if (value && !mongoose.isValidObjectId(value))
        return next(new ApiError(400, `Invalid ${key}`));
    }

    let requirementFiles = [];

    if (req.files?.documents?.length > 0) {
      let result;
      if (process.env.USE_CLOUDINARY === "true") {
        result = await uploadFiles(req.files.documents);
        if (!result.success || !result.files.length) {
          return next(new ApiError(400, "Unable to upload requirement files"));
        }
      } else {
        result = {
          success: true,
          files: req.files.documents.map((f) => ({
            url: f.path.replace(/\\/g, "/"),
            public_url: null,
            public_id: null,
          })),
        };
      }

      requirementFiles = result.files;
    }

    // ------------------ Validate assignTo ------------------
    if (assignTo) {
      if (!Array.isArray(assignTo))
        return next(new ApiError(400, "assignTo must be an array"));
      if (assignTo.length > 2)
        return next(new ApiError(400, "Only up to 2 assignees are allowed"));

      const invalidIds = assignTo.filter((id) => !mongoose.isValidObjectId(id));
      if (invalidIds.length)
        return next(
          new ApiError(400, "One or more assigned userIds are invalid"),
        );

      const activeUsers = await User.find({
        _id: { $in: assignTo },
        status: "Active",
      }).select("_id");

      if (activeUsers.length !== assignTo.length)
        return next(
          new ApiError(400, "Some assignTo users are inactive or missing"),
        );

      lead.assignTo = assignTo.map((userId) => ({
        userId,
        assignedAt: new Date(),
      }));
    }

    // ------------------ Campaign existence ------------------
    if (campaignId) {
      const campaign = await campaignModel.findOne({
        _id: campaignId,
        status: "Active",
      });
      if (!campaign)
        return next(new ApiError(400, "Active campaign not found"));
      lead.campaignId = campaignId;
    }

    // ------------------ LeadBy user check ------------------
    if (leadBy) {
      const user = await User.findOne({ _id: leadBy, status: "Active" });
      if (!user)
        return next(new ApiError(400, "LeadBy user not found or inactive"));
      lead.leadBy = leadBy;
    }
    // ------------------ LeadBy user check ------------------
    if (dealBy) {
      const user = await User.findOne({ _id: dealBy, status: "Active" });
      if (!user)
        return next(new ApiError(400, "LeadBy user not found or inactive"));
      lead.dealBy = dealBy;
    }

    // ------------------ AssignBy user check ------------------
    if (assignBy) {
      const user = await User.findOne({ _id: assignBy, status: "Active" });
      if (!user)
        return next(new ApiError(400, "AssignBy user not found or inactive"));
      lead.assignBy = assignBy;
    }

    if (relationshipManager) {
      const user = await User.findOne({
        _id: relationshipManager,
        status: "Active",
      });
      if (!user)
        return next(
          new ApiError(400, "Relationship Manager user not found or inactive"),
        );
      lead.relationshipManager = relationshipManager;
    }
    let clientExist = null;

    if (leadType?.toUpperCase() === "REPEAT") {
      if (!clientId) {
        return next(
          new ApiError(400, "clientId is required for REPEAT lead type"),
        );
      }

      if (!mongoose.isValidObjectId(clientId)) {
        return next(new ApiError(400, "Invalid clientId"));
      }

      clientExist = await Client.findById(clientId);

      if (!clientExist) {
        return next(new ApiError(400, "Referenced clientId not found"));
      }

      lead.clientId = clientId;
    }

    if (!clientExist && lead.clientId) {
      clientExist = await Client.findById(lead.clientId);
    }

    if (clientExist) {
      if (leadBy) clientExist.leadBy = leadBy;
      if (relationshipManager)
        clientExist.relationshipManager = relationshipManager;
      if (dealBy) clientExist.dealBy = dealBy;

      await clientExist.save();
      console.log("Client updated from lead", clientExist._id);
    }

    if (phone) {
      // const existingPhone = await Lead.findOne({
      //   phone: phone.trim(),
      //   _id: { $ne: leadId },
      // });
      // if (existingPhone)
      //   return next(new ApiError(400, "Phone number already exists"));
      lead.phone = phone;
    }

    if (email) {
      // const existingEmail = await Lead.findOne({
      //   email: email.trim().toLowerCase(),
      //   _id: { $ne: leadId },
      // });
      // if (existingEmail)
      //   return next(new ApiError(400, "Email already exists"));
      lead.email = email.trim().toLowerCase();
    }

    if (clientName) lead.clientName = clientName.trim();
    if (leadSource) lead.leadSource = leadSource.trim();
    if (relationshipManager) lead.relationshipManager = relationshipManager;
    if (leadLabel) {
      const validLabels = ["UNTOUCHED", "HOT", "WARM", "COLD"];
      if (!validLabels.includes(leadLabel.toUpperCase()))
        return next(new ApiError(400, "Invalid leadLabel value"));
      lead.leadLabel = leadLabel.toUpperCase();
    }
    if (companyName) lead.companyName = companyName.trim();
    if (designation) lead.designation = designation.trim();
    if (businessType) lead.businessType = businessType.trim();
    if (altPhone) lead.altPhone = altPhone;
    if (whatsapp) lead.whatsapp = whatsapp;
    if (city) lead.city = city.trim();
    if (state) lead.state = state.trim();
    if (pincode) lead.pincode = pincode.trim();
    if (address) lead.address = address.trim();
    if (requirement) lead.requirement = requirement.trim();
    if (expectedBusiness) lead.expectedBusiness = expectedBusiness;
    if (clientRatingInBusiness)
      lead.clientRatingInBusiness = clientRatingInBusiness;
    if (remark) lead.remark = remark.trim();
    if (leadType) lead.leadType = leadType.toUpperCase();
    if (clientDesignation) lead.clientDesignation = clientDesignation.trim();
    if (contactPersonName) lead.contactPersonName = contactPersonName.trim();
    if (contactPersonEmail)
      lead.contactPersonEmail = contactPersonEmail.trim().toLowerCase();
    if (contactPersonPhone) lead.contactPersonPhone = contactPersonPhone.trim();
    if (contactPersonAltPhone)
      lead.contactPersonAltPhone = contactPersonAltPhone.trim();
    if (contactPersonWhatsapp)
      lead.contactPersonWhatsapp = contactPersonWhatsapp.trim();
    if (googleLocation) lead.googleLocation = googleLocation.trim();
    if (requirementFiles) lead.requirementFiles = requirementFiles;

    // ------------------ Status Handling ------------------
    if (leadStatus) {
      const validStatuses = [
        "PENDING",
        "ASSIGNED",
        "IN PROGRESS",
        "FOLLOW UP",
        "INTERESTED",
        "NOT INTERESTED",
      ];
      const newStatus = leadStatus.toUpperCase();
      if (!validStatuses.includes(newStatus))
        return next(new ApiError(400, "Invalid leadStatus value"));

      if (lead.leadStatus !== newStatus) {
        lead.statusTimeline.push({
          status: newStatus,
          timestamp: new Date(),
          remark: remark || "Status updated",
        });
        lead.leadStatus = newStatus;
      }
    }

    // ------------------ Save ------------------
    const updatedLead = await lead.save();
    console.log(clientExist, updatedLead);
    return res.api(200, "Lead updated successfully !!", updatedLead);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

export const assignLead = async (req, res, next) => {
  try {
    const { leadId } = req.params;
    const { assignTo, assignBy } = req.body;

    // ------------------ Validate Lead ID ------------------
    if (!mongoose.isValidObjectId(leadId)) {
      return next(new ApiError(400, "Invalid leadId"));
    }

    const lead = await Lead.findById(leadId);
    if (!lead || lead.status === "Inactive") {
      return next(new ApiError(404, "Active lead not found"));
    }

    // ------------------ Validate assignBy ------------------
    if (assignBy) {
      if (!mongoose.isValidObjectId(assignBy)) {
        return next(new ApiError(400, "Invalid assignBy userId"));
      }

      const assignByUser = await User.findOne({
        _id: assignBy,
        status: "Active",
      });

      if (!assignByUser) {
        return next(new ApiError(400, "AssignBy user not found or inactive"));
      }
    }

    // ------------------ Validate assignTo ------------------
    if (!assignTo) {
      return next(new ApiError(400, "assignTo is required"));
    }

    if (!mongoose.isValidObjectId(assignTo)) {
      return next(new ApiError(400, "Invalid assignTo userId"));
    }

    const assignToUser = await User.findOne({
      _id: assignTo,
      status: "Active",
    });

    if (!assignToUser) {
      return next(new ApiError(400, "AssignTo user not found or inactive"));
    }

    // ------------------ Check existing assignments ------------------
    const currentAssignments = lead.assignTo || [];

    // Already assigned same user
    const alreadyAssigned = currentAssignments.some(
      (a) => a.userId.toString() === assignTo.toString(),
    );
    if (alreadyAssigned) {
      return next(new ApiError(400, "User already assigned to this lead"));
    }

    // Limit: Max 2 assignees
    if (currentAssignments.length >= 2) {
      return next(new ApiError(400, "Cannot assign more than 2 users"));
    }

    // ------------------ Push new assignment ------------------
    currentAssignments.push({
      userId: assignTo,
      assignedAt: new Date(),
    });

    lead.assignTo = currentAssignments;
    lead.isAssign = true;
    lead.leadStatus = "ASSIGNED";
    if (assignBy) lead.assignBy = assignBy;

    const updatedLead = await lead.save();

    // sendNotification({channels:["web", "mobile", "email"], data:{title:"New Lead Assigned", body:"New Lead Assigned"}, userIds:[`${assignTo}`]})
    // ------------------ Response ------------------
    return res.api(200, "Lead successfully assigned", updatedLead);
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

export const createFollowUp = async (req, res, next) => {
  try {
    const { leadId, type, remark, followUpDateTime } = req.body;

    // ------------------ 1. Basic Validation ------------------
    if (!leadId || !mongoose.isValidObjectId(leadId)) {
      return next(new ApiError(400, "Invalid or missing leadId"));
    }

    if (!type?.trim()) {
      return next(new ApiError(400, "Follow-up type is required"));
    }

    if (!remark?.trim()) {
      return next(new ApiError(400, "Remark is required"));
    }

    if (!followUpDateTime) {
      return next(new ApiError(400, "Follow-up date & time is required"));
    }

    const validTypes = ["Call", "Whatsapp", "Email", "SMS"];
    if (!validTypes.includes(type)) {
      return next(new ApiError(400, "Invalid follow-up type"));
    }

    // ------------------ 2. Lead Check ------------------
    const lead = await Lead.findById(leadId);
    if (!lead || lead.isDeleted) {
      return next(new ApiError(404, "Lead not found"));
    }

    // ------------------ 3. Push FollowUp ------------------
    lead.followUps.push({
      type,
      remark: remark.trim(),
      followUpDate: new Date(followUpDateTime),
      createdBy: req.user?._id.toString() || null,
      createdAt: new Date(),
    });

    // ------------------ 4. Auto Status Update ------------------
    // if (lead.leadStatus !== "FOLLOW UP") {
    //   lead.leadStatus = "FOLLOW UP";

    //   lead.statusTimeline.push({
    //     status: "FOLLOW UP",
    //     timestamp: new Date(),
    //     remark: `Follow-up scheduled: ${remark.trim()}`,
    //   });
    // }

    // ------------------ 5. Save ------------------
    await lead.save();

    return res.api(200, "Follow-up scheduled successfully");
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};
