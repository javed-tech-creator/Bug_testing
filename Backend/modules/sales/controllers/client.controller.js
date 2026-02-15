import mongoose from "mongoose";
import Client from "../models/client.model.js";
import ApiError from "../../../utils/master/ApiError.js";
import Lead from "../models/lead.model.js";
import { sendNotification } from "../../notification/controllers/notification.controller.js";

export const createClient = async (req, res, next) => {
  try {
    if (!req || !req.body) {
      return next(new ApiError(400, "Client name is required"));
    }
    const {
      leadId,
      name,
      email,
      password,
      phone,
      altPhone,
      whatsapp,
      companyName,
      businessType,
      designation,
      address,
      city,
      state,
      pincode,
      revenue,
      satisfaction,
      repeatPotential,
      complexity,
      engagement,
      positiveAttitude,
      clientRating,
    } = req.body;

    if (!name || !name.trim()) {
      return next(new ApiError(400, "Client name is required"));
    }
    if (!phone || !phone.trim()) {
      return next(new ApiError(400, "Phone number is required"));
    }
    if (!password || password.length < 6) {
      return next(
        new ApiError(
          400,
          "Password is required and must be at least 6 characters"
        )
      );
    }
    if (!email || !email.trim()) {
      return next(new ApiError(400, "Email is required"));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return next(new ApiError(400, "Invalid email format"));
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.trim())) {
      return next(new ApiError(400, "Phone number must be exactly 10 digits"));
    }

    if (pincode && !/^[0-9]{6}$/.test(pincode.trim())) {
      return next(new ApiError(400, "Pincode must be exactly 6 digits"));
    }

    if (!leadId || !Array.isArray(leadId) || leadId.length === 0) {
      return next(new ApiError(400, "At least one lead ID is required"));
    }

    const invalidLeadIds = leadId.filter((id) => !mongoose.isValidObjectId(id));
    if (invalidLeadIds.length > 0) {
      return next(new ApiError(400, "One or more lead IDs are invalid"));
    }

    const existingPhone = await Client.findOne({
      phone: phone.trim(),
      status: { $in: ["Active", "Inactive"] },
    });
    if (existingPhone) {
      return next(new ApiError(400, "Phone number already exists"));
    }

    const existingEmail = await Client.findOne({
      email: email.trim().toLowerCase(),
      status: { $in: ["Active", "Inactive"] },
    });

    if (existingEmail) {
      return next(new ApiError(400, "Email already exists"));
    }
    const validLeadIds = leadId.map((id) => new mongoose.Types.ObjectId(id));
    const leads = await Lead.find({
      _id: { $in: validLeadIds },
      status: "Active",
    }).select("_id clientName phone email leadStatus");

    const existingClientWithLead = await Client.findOne({
      leadId: { $in: leadId },
      status: "Active",
    });
    if (existingClientWithLead) {
      return next(
        new ApiError(400, "One or more leads are already converted to clients")
      );
    }

    const client = new Client({
      leadId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password,
      phone: phone.trim(),
      altPhone: altPhone,
      whatsapp: whatsapp,
      companyName: companyName?.trim(),
      businessType: businessType?.trim(),
      designation: designation?.trim(),
      address: address?.trim(),
      city: city?.trim(),
      state: state?.trim(),
      pincode: pincode?.trim(),
      revenue: revenue || "LOW",
      satisfaction: satisfaction || "LOW",
      repeatPotential: repeatPotential || "LOW",
      complexity: complexity || "LOW",
      engagement: engagement || "LOW",
      positiveAttitude: positiveAttitude || "LOW",
      clientRating: clientRating || 0,
      status: "Active",
    });

    const savedClient = await client.save();

    await Lead.updateMany(
      { _id: { $in: leadId } },
      {
        $set: {
          leadStatus: "INTERESTED",
          status: "Inactive",
        },
        $push: {
          statusTimeline: {
            status: "INTERESTED",
            timestamp: new Date(),
            remark: "Converted to client",
          },
        },
      }
    );

    // try {
    //   const notificationUsers = await User.find({
    //     status: "Active",
    //   }).populate({
    //     path: "designation",
    //     match: {
    //       title: {
    //         $in: ["Sales Team Lead", "Sales Manager", "Relationship Manager"],
    //       },
    //     },
    //   });

    //   if (notificationUsers?.length > 0) {
    //     const userIds = notificationUsers.map((u) => u._id.toString());

    //     await sendNotification({
    //       channels: ["mobile", "web", "email"],
    //       data: {
    //         title: `New Client Created`,
    //         body: `Client: ${name}, Company: ${companyName || "N/A"}`,
    //       },
    //       userIds,
    //     });
    //   }
    // } catch (notificationError) {
    //   console.error("Notification error:", notificationError);
    // }

    const clientResponse = {
      _id: savedClient._id,
      clientId: savedClient.clientId,
      name: savedClient.name,
      email: savedClient.email,
      phone: savedClient.phone,
      altPhone: savedClient.altPhone,
      whatsapp: savedClient.whatsapp,
      companyName: savedClient.companyName,
      businessType: savedClient.businessType,
      designation: savedClient.designation,
      city: savedClient.city,
      state: savedClient.state,
      clientRating: savedClient.clientRating,
      status: savedClient.status,
      createdAt: savedClient.createdAt,
      updatedAt: savedClient.updatedAt,
    };

    return res.api(201, "Client created successfully!", clientResponse);
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return next(new ApiError(400, `${field} already exists`));
    }
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((error) => error.message);
      return next(new ApiError(400, errors.join(", ")));
    }

    return next(new ApiError(500, err.message));
  }
};

//update client
export const updateClient = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    if (!req || !req.body || !req.params || !req.params.id) {
      return next(new ApiError(400, "Client id and body are required"));
    }

    const clientId = req.params.id;
    if (!mongoose.isValidObjectId(clientId)) {
      return next(new ApiError(400, "Invalid client id"));
    }

    // extract fields allowed to update
    const allowed = [
      "leadId",
      "name",
      "email",
      "password",
      "phone",
      "altPhone",
      "whatsapp",
      "companyName",
      "businessType",
      "designation",
      "address",
      "city",
      "state",
      "pincode",
      "revenue",
      "satisfaction",
      "repeatPotential",
      "complexity",
      "engagement",
      "positiveAttitude",
      "clientRating",
      "status",
    ];

    const incoming = {};
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        incoming[key] = req.body[key];
      }
    }

    if (Object.keys(incoming).length === 0) {
      return next(new ApiError(400, "No updatable fields provided"));
    }

    // Basic validations
    if (incoming.name !== undefined && !String(incoming.name || "").trim()) {
      return next(new ApiError(400, "Client name cannot be empty"));
    }

    if (incoming.email !== undefined) {
      const email = String(incoming.email || "").trim();
      if (!email) return next(new ApiError(400, "Email is required"));
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email))
        return next(new ApiError(400, "Invalid email format"));
      incoming.email = email.toLowerCase();
    }

    if (incoming.phone !== undefined) {
      const phone = String(incoming.phone || "").trim();
      const phoneDigits = phone.replace(/\D/g, "");
      if (!/^[0-9]{10}$/.test(phoneDigits)) {
        return next(
          new ApiError(400, "Phone number must be exactly 10 digits")
        );
      }
      incoming.phone = phoneDigits;
    }

    if (incoming.pincode !== undefined) {
      const pincode = String(incoming.pincode || "").trim();
      if (pincode && !/^[0-9]{6}$/.test(pincode)) {
        return next(new ApiError(400, "Pincode must be exactly 6 digits"));
      }
      incoming.pincode = pincode;
    }

    if (incoming.password !== undefined) {
      if (String(incoming.password).length < 6) {
        return next(
          new ApiError(400, "Password must be at least 6 characters")
        );
      }
    }

    // leadId validations (if provided)
    if (incoming.leadId !== undefined) {
      if (!Array.isArray(incoming.leadId) || incoming.leadId.length === 0) {
        return next(new ApiError(400, "leadId must be a non-empty array"));
      }
      const invalid = incoming.leadId.filter(
        (id) => !mongoose.isValidObjectId(id)
      );
      if (invalid.length) {
        return next(new ApiError(400, "One or more lead IDs are invalid"));
      }
    }

    // fetch current client
    const existingClient = await Client.findById(clientId).lean();
    if (!existingClient) {
      return next(new ApiError(404, "Client not found"));
    }

    if (incoming.phone) {
      const dupPhone = await Client.findOne({
        phone: incoming.phone,
        _id: { $ne: clientId },
        status: { $in: ["Active", "Inactive"] },
      }).lean();
      if (dupPhone)
        return next(new ApiError(400, "Phone number already exists"));
    }

    if (incoming.email) {
      const dupEmail = await Client.findOne({
        email: incoming.email,
        _id: { $ne: clientId },
        status: { $in: ["Active", "Inactive"] },
      }).lean();
      if (dupEmail) return next(new ApiError(400, "Email already exists"));
    }

    let leadsToUpdate = [];
    if (incoming.leadId) {
      const validLeadIds = incoming.leadId.map(
        (id) => new mongoose.Types.ObjectId(id)
      );
      const leads = await Lead.find({
        _id: { $in: validLeadIds }
      })
        .select("_id clientName phone email leadStatus")
        .lean();
      if (leads.length !== validLeadIds.length) {
        return next(new ApiError(400, "lead IDs not found"));
      }

      const linkedClient = await Client.findOne({
        leadId: { $in: incoming.leadId },
        _id: { $ne: clientId },
      }).lean();

      if (linkedClient) {
        return next(
          new ApiError(
            400,
            "One or more leads are already converted to other clients"
          )
        );
      }

      leadsToUpdate = leads;
    }

    // Start transaction if lead updates or status changes require multi-doc writes
    let updatedClient = null;
    await session.withTransaction(async () => {
      // update client
      const updateDoc = {};
      for (const [k, v] of Object.entries(incoming)) {
        // keep falsy boolean fields (false) intact; only unset undefined which we already filtered out
        updateDoc[k] = v;
      }

      updateDoc.updatedAt = new Date();

      const saved = await Client.findByIdAndUpdate(clientId, updateDoc, {
        new: true,
        runValidators: true,
        session,
      });

      if (!saved) {
        throw new ApiError(500, "Failed to update client");
      }

      updatedClient = saved;

      // If leadIds are provided, mark leads as converted and set timelines
      if (leadsToUpdate.length > 0) {
        await Lead.updateMany(
          { _id: { $in: leadsToUpdate.map((l) => l._id) } },
          {
            $set: { leadStatus: "INTERESTED", status: "Inactive" },
            $push: {
              statusTimeline: {
                status: "INTERESTED",
                timestamp: new Date(),
                remark: `Converted to client ${saved._id}`,
              },
            },
          },
          { session }
        );
      }
    }); // end transaction

    // Send notifications outside critical transaction block (non-blocking best-effort)
    // (async () => {
    //   try {
    //     const notificationUsers = await User.find({
    //       status: "Active",
    //     }).populate({
    //       path: "designation",
    //       match: {
    //         title: {
    //           $in: ["Sales Team Lead", "Sales Manager", "Relationship Manager"],
    //         },
    //       },
    //     });

    //     if (notificationUsers?.length > 0) {
    //       const userIds = notificationUsers.map((u) => u._id.toString());
    //       await sendNotification({
    //         channels: ["mobile", "web", "email"],
    //         data: {
    //           title: `Client updated: ${updatedClient.name}`,
    //           body: `Client ${updatedClient.name} was updated.`,
    //         },
    //         userIds,
    //       });
    //     }
    //   } catch (notifyErr) {
    //     console.error("Notification error (updateClient):", notifyErr);
    //   }
    // })();

    // Build response
    const clientResponse = {
      _id: updatedClient._id,
      clientId: updatedClient.clientId,
      name: updatedClient.name,
      email: updatedClient.email,
      phone: updatedClient.phone,
      altPhone: updatedClient.altPhone,
      whatsapp: updatedClient.whatsapp,
      companyName: updatedClient.companyName,
      businessType: updatedClient.businessType,
      designation: updatedClient.designation,
      city: updatedClient.city,
      state: updatedClient.state,
      clientRating: updatedClient.clientRating,
      status: updatedClient.status,
      createdAt: updatedClient.createdAt,
      updatedAt: updatedClient.updatedAt,
    };

    return res.api(200, "Client updated successfully", clientResponse);
  } catch (err) {
    // handle mongoose unique error
    if (err && err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0] || "field";
      return next(new ApiError(400, `${field} already exists`));
    }
    if (err instanceof ApiError) {
      return next(err);
    }
    console.error("updateClient error:", err);
    return next(new ApiError(500, err.message || "Internal server error"));
  } finally {
    session.endSession();
  }
};

export const getClientById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // ------------------ Validate Client ID ------------------
    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid client ID"));
    }

    const client = await Client.findById(id)
      .populate({
        path: "leadId",
        populate: [
          { path: "leadBy", select: "name email phone" },
          { path: "dealBy", select: "name email phone" },
          { path: "relationshipManager", select: "name email phone" },
          { path: "assignTo", select: "name email phone" }
        ],
      })
      .select("-password -sequence_value")
      .lean();

    if (!client) {
      return next(new ApiError(404, "Client not found"));
    }

    if (client.status === "Deleted" || client.isDeleted) {
      return next(new ApiError(404, "Client not found"));
    }

    if (client.status === "Inactive") {
      return next(new ApiError(400, "Client is inactive"));
    }

    const formattedClient = {
      _id: client._id,
      clientId: client.clientId,
      name: client.name,
      email: client.email,
      phone: client.phone,
      altPhone: client.altPhone,
      whatsapp: client.whatsapp,
      companyName: client.companyName,
      businessType: client.businessType,
      designation: client.designation,
      address: client.address,
      city: client.city,
      state: client.state,
      pincode: client.pincode,

      // Boolean rating fields
      revenue: client.revenue || "LOW",
      satisfaction: client.satisfaction || "LOW",
      repeatPotential: client.repeatPotential || "LOW",
      complexity: client.complexity || "LOW",
      engagement: client.engagement || "LOW",
      positiveAttitude: client.positiveAttitude || "LOW",

      clientRating: client.clientRating || 0,
      status: client.status,
      isSentToManager: client.isSentToManager || false,
      isSentToProjectDepartment: client.isSentToProjectDepartment || false,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
      isSentToRecceDepartment: client.isSentToRecceDepartment || false,
      projectDepartmentId: client.projectDepartmentId || null,
      projectDepartmentManager: client.projectDepartmentManager || null,
      // All lead data
      leadData: client.leadId || [],
    };

    return res.api(
      200,
      "Client details fetched successfully!",
      formattedClient
    );
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

export const getAllClients = async (req, res, next) => {
  try {
    const {
      search,
      city,
      state,
      businessType,
      clientRating,
      relationshipManager,
      status = "Active",
      sortBy = "createdAt",
      sortOrder = "desc",
      isSentToManager = false,
      isSentToProjectDepartment = false,
      isSentToRecceDepartment = false,
      page = 1,
      limit = 10,
    } = req.query;

    const filters = {};

    // Status filter - exclude deleted clients
    if (status && ["Active", "Inactive"].includes(status)) {
      filters.status = status;
    } else {
      filters.status = "Active"; // Default filter
    }

    // Exclude deleted clients
    filters.isDeleted = { $ne: true };

    // Text search
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      filters.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { companyName: searchRegex },
        { clientId: searchRegex },
        { designation: searchRegex },
        { businessType: searchRegex },
      ];
    }

    // Field filters
    if (city && city.trim()) {
      filters.city = new RegExp(city.trim(), "i");
    }
    if (state && state.trim()) {
      filters.state = new RegExp(state.trim(), "i");
    }
    if (businessType && businessType.trim()) {
      filters.businessType = new RegExp(businessType.trim(), "i");
    }
    if (clientRating) {
      filters.clientRating = parseInt(clientRating);
    }
    if (relationshipManager && mongoose.isValidObjectId(relationshipManager)) {
      filters.relationshipManager = relationshipManager;
    }
    if (isSentToManager) {
      filters.isSentToManager = true;
    }
    if (isSentToProjectDepartment) {
      filters.isSentToProjectDepartment = true;
    }
    if (isSentToRecceDepartment) {
      filters.isSentToRecceDepartment = true;
    }
    // Boolean rating filters
    const booleanFilters = [
      "revenue",
      "satisfaction",
      "repeatPotential",
      "complexity",
      "engagement",
      "positiveAttitude",
    ];

    booleanFilters.forEach((filter) => {
      if (req.query[filter] !== undefined) {
        filters[filter] = req.query[filter] === "true";
      }
    });

    // Pagination
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * pageSize;

    // Sorting
    const sortField = sortBy;
    const sortDirection = sortOrder === "asc" ? 1 : -1;

    // Build query with population
    const [clients, total] = await Promise.all([
      Client.find(filters)
        .populate("leadId") // Populate all lead data
        .select("-password -sequence_value")
        .sort({ [sortField]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      Client.countDocuments(filters),
    ]);

    // Format clients with lead data
    const formattedClients = clients.map((client) => ({
      _id: client._id,
      clientId: client.clientId,
      name: client.name,
      email: client.email,
      phone: client.phone,
      companyName: client.companyName,
      businessType: client.businessType,
      designation: client.designation,
      city: client.city,
      state: client.state,
      pincode: client.pincode,

      // Boolean rating fields
      revenue: client.revenue || "LOW",
      satisfaction: client.satisfaction || "LOW",
      repeatPotential: client.repeatPotential || "LOW",
      complexity: client.complexity || "LOW",
      engagement: client.engagement || "LOW",
      positiveAttitude: client.positiveAttitude || "LOW",

      clientRating: client.clientRating || 0,
      status: client.status,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
      isSentToManager: client.isSentToManager || false,
      isSentToProjectDepartment: client.isSentToProjectDepartment || false,
      isSentToRecceDepartment: client.isSentToRecceDepartment || false,
      // All lead data
      leadData: client.leadId || [],
    }));

    return res.api(200, "Clients fetched successfully!", {
      total,
      page: pageNumber,
      limit: pageSize,
      totalPages: Math.ceil(total / pageSize),
      clients: formattedClients,
    });
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};

export const getClientsMinimal = async (req, res, next) => {
  try {
    const { search, status = "Active", page = 1, limit = 50 } = req.query;

    const filters = {};

    // Status filter - exclude deleted clients
    if (status && ["Active", "Inactive"].includes(status)) {
      filters.status = status;
    } else {
      filters.status = "Active"; // Default filter
    }

    // Exclude deleted clients
    filters.isDeleted = { $ne: true };

    // Text search
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      filters.$or = [
        { name: searchRegex },
        { clientId: searchRegex },
        { phone: searchRegex },
      ];
    }

    // Pagination
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 50;
    const skip = (pageNumber - 1) * pageSize;

    // Build query - select only required fields
    const [clients, total] = await Promise.all([
      Client.find(filters)
        .sort({ name: 1 }) // Sort by name ascending
        .skip(skip)
        .limit(pageSize)
        .lean(),
      Client.countDocuments(filters),
    ]);

    return res.api(200, "Clients fetched successfully!", {
      total,
      page: pageNumber,
      limit: pageSize,
      totalPages: Math.ceil(total / pageSize),
      clients,
    });
  } catch (err) {
    return next(new ApiError(500, err.message));
  }
};
