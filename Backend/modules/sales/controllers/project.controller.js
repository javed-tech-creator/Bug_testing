import ApiError from "../../../utils/master/ApiError.js";
import { deleteFile, deleteLocalFile, uploadFiles } from "../../../utils/master/cloudinary.js";
import User from "../../HR/models/masters/user.model.js";
import Client from "../models/client.model.js";
import Project from "../models/project.model.js";
import SignageProduct from "../../admin/models/product.model.js";
import mongoose, { model } from "mongoose";
import ClientProduct from "../models/clientProduct.model.js";

const validateReferenceExists = async (Model, id, modelName) => {
  if (!id) return null;

  const doc = await Model.findById(id);
  if (!doc) {
    throw new ApiError(400, `${modelName} not found`);
  }
  return doc;
};


export const createProject = async (req, res, next) => {
  let uploadedFiles = [];
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!req.body) {
      return next(new ApiError(400, "Project data is required"));
    }
    let data = req.body;

    // If projectData arrives as a JSON string, parse it
    if (typeof req.body.projectData === "string") {
      data = JSON.parse(req.body.projectData);
    }

    const {
      clientId,
      projectName,
      projectDescription,
      discussionDone,
      requirement,
      instructionRecce,
      instructionDesign,
      instructionInstallation,
      instructionOther,
      address,
      siteLocation,
      sameAsAddress,
      expectedRevenue,
      remarks,
      totalAmount,
      discountPercent,
      discountAmount,
      payableAmount,
      products,
      timeline,
      projectManager,
      relationshipManager,
      dealBy,
      leadBy,
      status,
      overallProgress
    } = data;

    // 1. Validate all required fields
    const requiredFields = {
      clientId,
      projectName,
      projectDescription,
      siteLocation
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length) {
      return next(
        new ApiError(
          400,
          `Missing required fields: ${missingFields.join(", ")}`
        )
      );
    }

    // 2. Parse JSON fields if they are strings
    let parsedProducts = [];
    let parsedTimeline = [];

    try {
      parsedProducts = products ? (typeof products === 'string' ? JSON.parse(products) : products) : [];
      parsedTimeline = timeline ? (typeof timeline === 'string' ? JSON.parse(timeline) : timeline) : [];
    } catch (parseError) {
      return next(new ApiError(400, "Invalid JSON format in products or timeline"));
    }

    // 3. Validate field formats
    if (projectName && (projectName.length < 2 || projectName.length > 150)) {
      return next(new ApiError(400, "Project name must be between 2 and 150 characters"));
    }

    if (expectedRevenue && parseFloat(expectedRevenue) < 0) {
      return next(new ApiError(400, "Expected revenue cannot be negative"));
    }

    if (discountPercent && (parseFloat(discountPercent) < 0 || parseFloat(discountPercent) > 100)) {
      return next(new ApiError(400, "Discount percent must be between 0 and 100"));
    }

    // 4. Validate references exist
    await validateReferenceExists(Client, clientId, "Client");

    if (projectManager) {
      await validateReferenceExists(User, projectManager, "Project Manager");
    }

    if (relationshipManager) {
      await validateReferenceExists(User, relationshipManager, "Relationship Manager");
    }

    if (dealBy) {
      await validateReferenceExists(User, dealBy, "Deal By");
    }

    if (leadBy) {
      await validateReferenceExists(User, leadBy, "Lead By");
    }

    // 5. Validate products if provided
    if (parsedProducts && parsedProducts.length > 0) {
      for (const product of parsedProducts) {
        if (product.productId) {
          await validateReferenceExists(SignageProduct, product.productId, "Signage Product");
        }

        // Validate product data
        if (product.quantity && product.quantity < 0) {
          return next(new ApiError(400, "Product quantity cannot be negative"));
        }

        if (product.unitPrice && parseFloat(product.unitPrice) < 0) {
          return next(new ApiError(400, "Product unit price cannot be negative"));
        }
        if (!product.productName) {
          return next(new ApiError(400, "Product name is required"));
        }
      }
    }

    // 6. Check for duplicate project name for the same client
    const existingProject = await Project.findOne({
      clientId,
      projectName: { $regex: new RegExp(`^${projectName}$`, 'i') }
    });

    if (existingProject) {
      return next(
        new ApiError(
          400,
          "A project with the same name already exists for this client"
        )
      );
    }

    // --- Handle Documents Upload ---
    let documentsData = [];
    if (req.files?.documents && req.files.documents.length > 0) {
      let result;
      if (process.env.USE_CLOUDINARY === "true") {
        result = await uploadFiles(req.files.documents);
        if (!result.success || !result.files.length) {
          return next(new ApiError(400, "Unable to upload project documents"));
        }
      } else {
        result = {
          success: true,
          files: req.files.documents.map((f) => ({
            url: f?.path?.replace(/\\/g, "/"),
            public_url: null,
            public_id: null,
            originalName: f.originalname,
            mimetype: f.mimetype,
            size: f.size
          })),
        };
      }
      documentsData = result.files;
      uploadedFiles.push(...documentsData);
    }

    const finalSiteLocation = sameAsAddress ? address : siteLocation;

    // ✅ TRANSACTION START: PEHLE PROJECT CREATE KARO
    const project = new Project({
      clientId,
      projectName: projectName.trim(),
      projectDescription: projectDescription.trim(),
      discussionDone: discussionDone || "Pending",
      requirement: requirement?.trim() || null,
      instructionRecce: instructionRecce?.trim() || null,
      instructionDesign: instructionDesign?.trim() || null,
      instructionInstallation: instructionInstallation?.trim() || null,
      instructionOther: instructionOther?.trim() || null,
      address: address?.trim() || null,
      siteLocation: finalSiteLocation.trim(),
      sameAsAddress: sameAsAddress || false,
      expectedRevenue: expectedRevenue || 0.0,
      remarks: remarks?.trim() || null,
      documents: documentsData,
      totalAmount: totalAmount || 0.0,
      discountPercent: discountPercent || 0.0,
      discountAmount: discountAmount || 0.0,
      payableAmount: payableAmount || 0.0,
      products: [], // ✅ TEMPORARILY EMPTY - baad mein update karenge
      timeline: parsedTimeline,
      projectManager: projectManager || null,
      relationshipManager: relationshipManager || null,
      dealBy: dealBy || null,
      leadBy: leadBy || null,
      status: status || "Active",
      overallProgress: overallProgress || 0
    });

    const savedProject = await project.save({ session });

    // ✅ AB PRODUCTS CREATE KARO WITH PROJECT REFERENCE
    const createdProductIds = [];
    if (parsedProducts && parsedProducts.length > 0) {
      for (const productData of parsedProducts) {
        const product = new ClientProduct({
          ...productData,
          projectId: savedProject._id, // ✅ Project ID available
          clientId: clientId
        });
        const savedProduct = await product.save({ session });
        createdProductIds.push(savedProduct._id);
      }
    }

    // ✅ PROJECT UPDATE KARO WITH PRODUCT IDs
    savedProject.products = createdProductIds;
    await savedProject.save({ session });

    await Client.findByIdAndUpdate(
      clientId,
      { $push: { projectId: savedProject._id } },
      { session }
    );

    // ✅ COMMIT TRANSACTION - SAB KUCH EK SAATH SAVE HOGA
    await session.commitTransaction();

    // ✅ POPULATE REFERENCES FOR RESPONSE
    await savedProject.populate([
      { path: 'clientId', select: 'name email phone company' },
      { path: 'projectManager', select: 'name email phone' },
      { path: 'relationshipManager', select: 'name email phone' },
      { path: 'dealBy', select: 'name email phone' },
      { path: 'leadBy', select: 'name email phone' },
      {
        path: 'products',
        select: 'productName quantity unitPrice totalPrice status customId',
        populate: {
          path: 'productId',
          select: 'productName description category basePrice specifications'
        }
      }
    ]);

    // ✅ AUDIT LOG
    try {
      await AuditLog.create({
        action: 'PROJECT_CREATED',
        performedBy: req.user?._id,
        targetEntity: 'Project',
        targetId: savedProject._id,
        description: `Project "${projectName}" created for client`,
        metadata: {
          projectId: savedProject.projectId,
          clientId: clientId,
          projectManager: projectManager,
          documentsCount: documentsData.length,
          productsCount: createdProductIds.length
        },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });
    } catch (auditError) {
      console.error('Audit log error:', auditError);
    }

    return res.api(201, "Project created successfully", {
      project: {
        _id: savedProject._id,
        projectId: savedProject.projectId,
        projectName: savedProject.projectName,
        projectDescription: savedProject.projectDescription,
        clientId: savedProject.clientId,
        siteLocation: savedProject.siteLocation,
        status: savedProject.status,
        overallProgress: savedProject.overallProgress,
        payableAmount: savedProject.payableAmount,
        projectManager: savedProject.projectManager,
        relationshipManager: savedProject.relationshipManager,
        timeline: savedProject.timeline,
        products: savedProject.products,
        documents: savedProject.documents,
        createdAt: savedProject.createdAt
      }
    });

  } catch (err) {
    // ✅ ROLLBACK TRANSACTION AGAR KAHIN BHI ERROR AAYI
    await session.abortTransaction();

    // --- Rollback uploaded files if save failed ---
    for (const file of uploadedFiles) {
      if (file?.public_id) {
        try {
          await deleteFile(file.public_id);
        } catch { }
      }

      if (file?.url) {
        try {
          deleteLocalFile(file.url);
          console.log("Deleted local file:", file.url);
        } catch {
          console.log("Failed to delete local file:", file.url);
        }
      }
    }

    // Handle duplicate key errors
    if (err.code === 11000) {
      return next(new ApiError(400, "Project ID already exists"));
    }

    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return next(new ApiError(400, `Validation failed: ${errors.join(', ')}`));
    }

    return next(new ApiError(500, err?.message || "Internal Server Error"));
  } finally {
    // ✅ SESSION END KARO
    session.endSession();
  }
};


export const updateProject = async (req, res, next) => {
  let uploadedFiles = [];
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    if (!req.body) {
      return next(new ApiError(400, "Project data is required"));
    }

    let data = req.body;

    // If projectData arrives as a JSON string, parse it
    if (typeof req.body.projectData === "string") {
      data = JSON.parse(req.body.projectData);
    }

    const {
      projectName,
      projectDescription,
      discussionDone,
      requirement,
      instructionRecce,
      instructionDesign,
      instructionInstallation,
      instructionOther,
      address,
      siteLocation,
      expectedRevenue,
      remarks,
      products
    } = data;

    // 1. Validate project exists
    const existingProject = await Project.findById(id).session(session);
    if (!existingProject) {
      return next(new ApiError(404, "Project not found"));
    }

    // 2. Validate project name uniqueness if being updated
    if (projectName && projectName !== existingProject.projectName) {
      const duplicateProject = await Project.findOne({
        clientId: existingProject.clientId,
        projectName: { $regex: new RegExp(`^${projectName}$`, 'i') },
        _id: { $ne: id }
      }).session(session);

      if (duplicateProject) {
        return next(new ApiError(400, "A project with the same name already exists for this client"));
      }
    }

    // 3. Validate required fields if provided
    if (projectName && (projectName.length < 2 || projectName.length > 150)) {
      return next(new ApiError(400, "Project name must be between 2 and 150 characters"));
    }

    if (expectedRevenue && parseFloat(expectedRevenue) < 0) {
      return next(new ApiError(400, "Expected revenue cannot be negative"));
    }

    // 4. Parse and validate products if provided
    let parsedProducts = [];
    if (products) {
      try {
        parsedProducts = typeof products === 'string' ? JSON.parse(products) : products;

        // Validate products
        if (parsedProducts && parsedProducts.length > 0) {
          for (const product of parsedProducts) {
            if (product.productId) {
              await validateReferenceExists(SignageProduct, product.productId, "Signage Product");
            }

            if (product.quantity && product.quantity < 0) {
              return next(new ApiError(400, "Product quantity cannot be negative"));
            }

            if (!product.productName) {
              return next(new ApiError(400, "Product name is required"));
            }
          }
        }
      } catch (parseError) {
        return next(new ApiError(400, "Invalid JSON format in products"));
      }
    }

    // 5. Prepare update data
    const updateData = {};
    const changes = [];

    // Track changes for audit log
    const trackChange = (field, oldValue, newValue) => {
      if (oldValue !== newValue) {
        changes.push({
          field,
          oldValue,
          newValue
        });
      }
    };

    // Basic fields
    if (projectName !== undefined) {
      trackChange('projectName', existingProject.projectName, projectName);
      updateData.projectName = projectName.trim();
    }

    if (projectDescription !== undefined) {
      trackChange('projectDescription', existingProject.projectDescription, projectDescription);
      updateData.projectDescription = projectDescription.trim();
    }

    if (discussionDone !== undefined) {
      trackChange('discussionDone', existingProject.discussionDone, discussionDone);
      updateData.discussionDone = discussionDone;
    }

    // Instructions
    if (requirement !== undefined) {
      trackChange('requirement', existingProject.requirement, requirement);
      updateData.requirement = requirement?.trim() || null;
    }

    if (instructionRecce !== undefined) {
      trackChange('instructionRecce', existingProject.instructionRecce, instructionRecce);
      updateData.instructionRecce = instructionRecce?.trim() || null;
    }

    if (instructionDesign !== undefined) {
      trackChange('instructionDesign', existingProject.instructionDesign, instructionDesign);
      updateData.instructionDesign = instructionDesign?.trim() || null;
    }

    if (instructionInstallation !== undefined) {
      trackChange('instructionInstallation', existingProject.instructionInstallation, instructionInstallation);
      updateData.instructionInstallation = instructionInstallation?.trim() || null;
    }

    if (instructionOther !== undefined) {
      trackChange('instructionOther', existingProject.instructionOther, instructionOther);
      updateData.instructionOther = instructionOther?.trim() || null;
    }

    // Location
    if (address !== undefined) {
      trackChange('address', existingProject.address, address);
      updateData.address = address?.trim() || null;
    }

    if (siteLocation !== undefined) {
      trackChange('siteLocation', existingProject.siteLocation, siteLocation);
      updateData.siteLocation = siteLocation?.trim();
    }

    // Financials
    if (expectedRevenue !== undefined) {
      trackChange('expectedRevenue', existingProject.expectedRevenue, expectedRevenue);
      updateData.expectedRevenue = expectedRevenue;
    }

    if (remarks !== undefined) {
      trackChange('remarks', existingProject.remarks, remarks);
      updateData.remarks = remarks?.trim() || null;
    }

    // --- Handle Documents Upload ---
    let newDocuments = [];
    if (req.files?.documents && req.files.documents.length > 0) {
      let result;
      if (process.env.USE_CLOUDINARY === "true") {
        result = await uploadFiles(req.files.documents);
        if (!result.success || !result.files.length) {
          return next(new ApiError(400, "Unable to upload project documents"));
        }
      } else {
        result = {
          success: true,
          files: req.files.documents.map((f) => ({
            url: f?.path?.replace(/\\/g, "/"),
            public_url: null,
            public_id: null,
            originalName: f.originalname,
            mimetype: f.mimetype,
            size: f.size
          })),
        };
      }
      newDocuments = result.files;
      uploadedFiles.push(...newDocuments);
    }

    // Handle documents - combine existing with new ones
    if (newDocuments.length > 0) {
      const updatedDocuments = [...existingProject.documents, ...newDocuments];
      trackChange('documents', existingProject.documents.length, updatedDocuments.length);
      updateData.documents = updatedDocuments;
    }

    // ✅ PRODUCTS HANDLING WITH TRANSACTION
    let productChanges = false;
    if (products !== undefined) {
      trackChange('products', existingProject.products.length, parsedProducts.length);
      productChanges = true;

      // ✅ DELETE EXISTING PRODUCTS AND CREATE NEW ONES
      // Pehle existing products delete karo
      await ClientProduct.deleteMany(
        { projectId: existingProject._id },
        { session }
      );

      // ✅ FIR NEW PRODUCTS CREATE KARO
      const createdProductIds = [];
      if (parsedProducts && parsedProducts.length > 0) {
        for (const productData of parsedProducts) {
          const product = new ClientProduct({
            ...productData,
            projectId: existingProject._id,
            clientId: existingProject.clientId
          });
          const savedProduct = await product.save({ session });
          createdProductIds.push(savedProduct._id);
        }
      }

      // ✅ UPDATE PROJECT WITH NEW PRODUCT IDs
      updateData.products = createdProductIds;
    }

    // 6. If no changes, return early
    if (Object.keys(updateData).length === 0 && newDocuments.length === 0 && !productChanges) {
      await session.abortTransaction();
      return res.api(200, "No changes detected", {
        project: existingProject
      });
    }

    // 7. Update project
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true, session }
    ).populate([
      { path: 'clientId', select: 'name email phone company' },
      { path: 'projectManager', select: 'name email phone' },
      { path: 'relationshipManager', select: 'name email phone' },
      { path: 'dealBy', select: 'name email phone' },
      { path: 'leadBy', select: 'name email phone' },
      {
        path: 'products',
        select: 'productName quantity unitPrice totalPrice status customId',
        populate: {
          path: 'productId',
          select: 'productName description category basePrice specifications'
        }
      }
    ]);

    // ✅ COMMIT TRANSACTION
    await session.commitTransaction();

    // 8. Send notifications for important changes
    try {
      const notificationPromises = [];

      // Notify about significant updates
      if (changes.length > 0) {
        notificationPromises.push(
          sendNotification({
            channels: ["inApp"],
            userIds: getProjectTeamUsers(updatedProject),
            data: {
              title: "Project Updated",
              body: `Project "${updatedProject.projectName}" has been updated.`,
              projectId: updatedProject._id
            },
            options: { type: "project_update" }
          })
        );
      }

      await Promise.allSettled(notificationPromises);
    } catch (notificationError) {
      console.error('Notification error:', notificationError);
    }

    // 9. Log the update
    try {
      await AuditLog.create({
        action: 'PROJECT_UPDATED',
        performedBy: req.user?._id,
        targetEntity: 'Project',
        targetId: updatedProject._id,
        description: `Project "${updatedProject.projectName}" updated`,
        metadata: {
          projectId: updatedProject.projectId,
          changes: changes,
          updatedFields: Object.keys(updateData),
          documentsAdded: newDocuments.length
        },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });
    } catch (auditError) {
      console.error('Audit log error:', auditError);
    }

    return res.api(200, "Project updated successfully", {
      project: {
        _id: updatedProject._id,
        projectId: updatedProject.projectId,
        projectName: updatedProject.projectName,
        projectDescription: updatedProject.projectDescription,
        clientId: updatedProject.clientId,
        siteLocation: updatedProject.siteLocation,
        status: updatedProject.status,
        overallProgress: updatedProject.overallProgress,
        expectedRevenue: updatedProject.expectedRevenue,
        projectManager: updatedProject.projectManager,
        relationshipManager: updatedProject.relationshipManager,
        products: updatedProject.products,
        documents: updatedProject.documents,
        discussionDone: updatedProject.discussionDone,
        requirement: updatedProject.requirement,
        instructionRecce: updatedProject.instructionRecce,
        instructionDesign: updatedProject.instructionDesign,
        instructionInstallation: updatedProject.instructionInstallation,
        instructionOther: updatedProject.instructionOther,
        address: updatedProject.address,
        remarks: updatedProject.remarks,
        updatedAt: updatedProject.updatedAt
      },
      changes: changes.length > 0 ? changes : undefined
    });

  } catch (err) {
    // ✅ ROLLBACK TRANSACTION AGAR KAHIN BHI ERROR AAYI
    await session.abortTransaction();

    // --- Rollback uploaded files if save failed ---
    for (const file of uploadedFiles) {
      if (file?.public_id) {
        try {
          await deleteFile(file.public_id);
        } catch { }
      }

      if (file?.url) {
        try {
          deleteLocalFile(file.url);
          console.log("Deleted local file:", file.url);
        } catch {
          console.log("Failed to delete local file:", file.url);
        }
      }
    }

    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return next(new ApiError(400, `Validation failed: ${errors.join(', ')}`));
    }

    if (err.code === 11000) {
      return next(new ApiError(400, "Project ID conflict occurred"));
    }

    return next(new ApiError(500, err?.message || "Internal Server Error"));
  } finally {
    // ✅ SESSION END KARO
    session.endSession();
  }
};


export const getAllProjects = async (req, res, next) => {
  try {
    const {
      clientId,
      page = 1,
      limit = 10,
      includeProducts = "false",
    } = req.query;

    console.log('📋 Query params:', req.query);

    const baseFilter = { isDeleted: false };
    const filters = [];

    if (clientId) {
      if (mongoose.isValidObjectId(clientId)) {
        filters.push({ clientId: new mongoose.Types.ObjectId(clientId) });
      } else {
        return next(new ApiError(400, "Invalid client ID format"));
      }
    }


    const query = filters.length > 0 ? { ...baseFilter, $and: filters } : baseFilter;

    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNumber - 1) * pageSize;

    // Sorting - default createdAt desc
    const sortField = "createdAt";
    const sortDirection = -1;

    // Population options
    const populateOptions = [
      { path: 'clientId', select: '-password' },
      { path: 'projectManager', select: 'name email phone' },
      { path: 'relationshipManager', select: 'name email phone' },
      { path: 'dealBy', select: 'name email phone' },
      { path: 'leadBy', select: 'name email phone' },
      { path: 'products' }
    ];

    let projects, total;

    try {
      [projects, total] = await Promise.all([
        Project.find(query)
          .populate(populateOptions)
          .sort({ [sortField]: sortDirection })
          .skip(skip)
          .limit(pageSize)
          .lean(),

        Project.countDocuments(query),
      ]);

      console.log(`✅ Found ${projects.length} projects, total: ${total}`);
    } catch (dbError) {
      console.error('❌ Database query error:', dbError);
      throw dbError;
    }

    // Helper function for number conversion
    const toNum = (v) => {
      if (!v) return 0;
      try {
        if (typeof v === 'number') return v;
        if (v.$numberDecimal) return parseFloat(v.$numberDecimal);
        return parseFloat(v.toString());
      } catch (err) {
        console.warn('⚠️ toNum conversion error:', err);
        return 0;
      }
    };

    // Transform projects
    const transformedProjects = projects.map(project => ({
      ...project,
      expectedRevenue: toNum(project.expectedRevenue),
      totalAmount: toNum(project.totalAmount),
      discountAmount: toNum(project.discountAmount),
      payableAmount: toNum(project.payableAmount),
      // Products transformation
      products: project.products?.map(product => ({
        ...product,
        unitPrice: toNum(product.unitPrice),
        totalPrice: toNum(product.totalPrice),
        // Product details from populated productId
        productDetails: product.productId ? {
          _id: product.productId._id,
          productName: product.productId.productName,
          description: product.productId.description,
          category: product.productId.category,
          basePrice: toNum(product.productId.basePrice),
          specifications: product.productId.specifications
        } : null
      })) || []
    }));

    // Simple stats - agar needed ho
    let stats = {};
    try {
      const statsResult = await Project.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: { $toDouble: "$expectedRevenue" } },
            totalPayable: { $sum: { $toDouble: "$payableAmount" } },
            avgProgress: { $avg: { $ifNull: ["$overallProgress", 0] } },
            projectCount: { $sum: 1 },
            activeProjects: {
              $sum: { $cond: [{ $eq: ["$status", "Active"] }, 1, 0] }
            },
            completedProjects: {
              $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] }
            }
          }
        }
      ]);

      stats = statsResult[0] || {
        totalRevenue: 0,
        totalPayable: 0,
        avgProgress: 0,
        projectCount: 0,
        activeProjects: 0,
        completedProjects: 0
      };
    } catch (statsError) {
      console.error('⚠️ Stats calculation error:', statsError);
      stats = {
        totalRevenue: 0,
        totalPayable: 0,
        avgProgress: 0,
        projectCount: total,
        activeProjects: 0,
        completedProjects: 0
      };
    }

    // Response
    const responseData = {
      total,
      page: pageNumber,
      limit: pageSize,
      totalPages: Math.ceil(total / pageSize),
      hasNextPage: pageNumber < Math.ceil(total / pageSize),
      hasPrevPage: pageNumber > 1,
      projects: transformedProjects,
      stats,
      filters: {
        applied: filters.length,
        clientId: clientId || 'all' // ✅ Batata hai kis client ke projects hain
      }
    };

    console.log('✅ Sending response');

    // Check if res.api exists, otherwise use standard response
    if (typeof res.api === 'function') {
      return res.api(200, "Projects fetched successfully", responseData);
    } else {
      return res.status(200).json({
        success: true,
        message: "Projects fetched successfully",
        data: responseData
      });
    }

  } catch (err) {
    console.error('❌ Get projects error:', err);
    return next(new ApiError(500, `Failed to fetch projects: ${err.message}`));
  }
};


export const getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const project = await Project.findOne({
      _id: id,
      isDeleted: false
    })
      .populate("clientId", "-password")
      .populate("clientId.leadId")
      .populate("projectManager", "name email phone designation avatar")
      .populate("relationshipManager", "name email phone designation avatar")
      .populate("dealBy", "name email phone designation avatar")
      .populate("leadBy", "name email phone designation avatar")
      .populate("products", "productName quantity unitPrice totalPrice status customId productId")
      .populate("products.productId", "productName description category basePrice specifications warrantyTerms images")
      .populate({
        path: "timeline.tasks",
        select: "title status durationHrs remark"
      });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }



    // Check if res.api exists, otherwise use standard response
    if (typeof res.api === 'function') {
      return res.api(200, "Project fetched successfully", project);
    } else {
      return res.status(200).json(transformedProject);
    }

  } catch (err) {
    console.error('❌ Get project by ID error:', err);
    return next(new ApiError(500, `Failed to fetch project: ${err.message}`));
  }
};


export const deleteProject = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    // ✅ 1. Pehle project check karo
    const project = await Project.findOne({
      _id: id,
      isDeleted: false
    }).session(session);

    if (!project) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Project not found" });
    }

    // ✅ 2. Transaction mein dono operations karo
    // Project soft delete
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        status: "Cancelled", // Optional: Status bhi update kar sakte hain
        deletedAt: new Date()
      },
      { new: true, session }
    );

    // ✅ 3. Associated products bhi soft delete karo (Optional)
    await ClientProduct.updateMany(
      { projectId: id },
      {
        isDeleted: true,
        deletedAt: new Date()
      },
      { session }
    );

    // ✅ 4. Commit transaction
    await session.commitTransaction();

    // ✅ 5. Audit log
    try {
      await AuditLog.create({
        action: 'PROJECT_DELETED',
        performedBy: req.user?._id,
        targetEntity: 'Project',
        targetId: project._id,
        description: `Project "${project.projectName}" deleted`,
        metadata: {
          projectId: project.projectId,
          clientId: project.clientId,
          projectName: project.projectName
        },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });
    } catch (auditError) {
      console.error('Audit log error:', auditError);
    }

    // Response
    const responseMessage = "Project and associated products deleted successfully";

    if (typeof res.api === 'function') {
      return res.api(200, responseMessage, {
        projectId: updatedProject._id,
        projectName: updatedProject.projectName,
        deletedAt: updatedProject.deletedAt
      });
    } else {
      return res.status(200).json({
        message: responseMessage,
        projectId: updatedProject._id,
        projectName: updatedProject.projectName,
        deletedAt: updatedProject.deletedAt
      });
    }

  } catch (err) {
    // ✅ Rollback transaction if error
    await session.abortTransaction();

    console.error('❌ Delete project error:', err);

    if (err.name === 'ValidationError') {
      return next(new ApiError(400, `Validation failed: ${err.message}`));
    }

    return next(new ApiError(500, `Failed to delete project: ${err.message}`));
  } finally {
    // ✅ Session end karo
    session.endSession();
  }
};

// add product (updateProjectProducts)
export const updateProjectProducts = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    let { products } = req.body;

    // Parse JSON if needed
    if (typeof products === "string") {
      products = JSON.parse(products);
    }

    // Validate array
    if (!Array.isArray(products)) {
      return next(new ApiError(400, "Products must be an array"));
    }

    // Validate project
    const project = await Project.findById(id).session(session);
    if (!project) {
      return next(new ApiError(404, "Project not found"));
    }

    // Validate products
    for (const p of products) {
      if (!p.productName) {
        return next(new ApiError(400, "Product name is required"));
      }

      if (p.quantity < 0) {
        return next(new ApiError(400, "Quantity cannot be negative"));
      }

      if (p.productId) {
        await validateReferenceExists(SignageProduct, p.productId, "Signage Product");
      }
    }

    // 1. Delete old products for this project
    await ClientProduct.deleteMany(
      { projectId: project._id },
      { session }
    );

    // 2. Insert new products
    const newProductIds = [];
    for (const p of products) {
      const productDoc = new ClientProduct({
        ...p,
        projectId: project._id,
        clientId: project.clientId
      });

      const saved = await productDoc.save({ session });
      newProductIds.push(saved._id);
    }

    // 3. Update project.products array
    project.products = newProductIds;
    await project.save({ session });

    await session.commitTransaction();

    // Fetch updated list
    const updated = await Project.findById(id)
      .populate({
        path: "products",
        select: "productName quantity unitPrice totalPrice status customId",
        populate: {
          path: "productId",
          select: "productName description category basePrice specifications"
        }
      });

    return res.api(200, "Products updated", { products: updated.products });

  } catch (error) {
    await session.abortTransaction();
    return next(new ApiError(500, error.message));
  } finally {
    session.endSession();
  }
}

//get product by project id
export const getProjectProducts = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate project
    const project = await Project.findById(id)
      .populate({
        path: "products",
        select: "productName quantity unitPrice totalPrice status customId productId",
        populate: {
          path: "productId",
          select: "productName description category basePrice specifications"
        }
      });

    if (!project) {
      return next(new ApiError(404, "Project not found"));
    }

    return res.api(200, "Products fetched", {
      products: project.products
    });

  } catch (error) {
    return next(new ApiError(500, error.message));
  }
};

//delete products
export const deleteProjectProduct = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id: projectId, productId } = req.params;

    // Validate project
    const project = await Project.findById(projectId).session(session);
    if (!project) {
      return next(new ApiError(404, "Project not found"));
    }

    // Validate product exists
    const product = await ClientProduct.findOne({
      _id: productId,
      projectId: projectId
    }).session(session);

    if (!product) {
      return next(new ApiError(404, "Product not found in this project"));
    }

    // Delete the product
    await ClientProduct.deleteOne({ _id: productId }, { session });

    // Remove productId from project.products array
    await Project.findByIdAndUpdate(
      projectId,
      { $pull: { products: productId } },
      { session }
    );

    await session.commitTransaction();

    return res.api(200, "Product deleted successfully");

  } catch (error) {
    await session.abortTransaction();
    return next(new ApiError(500, error.message));
  } finally {
    session.endSession();
  }
};

