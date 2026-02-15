import mongoose from "mongoose";
import ApiError from "../../../utils/master/ApiError.js";
import ClientQuotation from "../models/clientQuotation.model.js";
import Client from "../models/client.model.js";
import Project from "../models/project.model.js";
import {
  deleteFile,
  deleteLocalFile,
  uploadFiles,
} from "../../../utils/master/cloudinary.js";
import htmlToPdf from "../../../utils/master/htmlToPdf.js";
import sendEmail from "../../notification/services/email.service.js"
import fs from "fs/promises";

export const createQuotation = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!req.body) {
      return next(new ApiError(400, "Quotation data required"));
    }

    const {
      projectId,
      clientId,
      client,
      project,
      products,
      totalAmount,
      discountPercent = 0,
      discountAmount = 0,
      netAmount,
      remark,
      additionalNotes,
      termsConditions,
    } = req.body;

    // ---------- BASIC VALIDATION ----------
    if (!projectId || !mongoose.isValidObjectId(projectId)) {
      await session.abortTransaction();
      return next(new ApiError(400, "Valid projectId required"));
    }

    if (!clientId || !mongoose.isValidObjectId(clientId)) {
      await session.abortTransaction();
      return next(new ApiError(400, "Valid clientId required"));
    }

    if (!client?.name || !client?.contact) {
      await session.abortTransaction();
      return next(new ApiError(400, "Client name and contact required"));
    }

    if (!project?.title || !project?.code) {
      await session.abortTransaction();
      return next(new ApiError(400, "Project title and code required"));
    }

    if (!Array.isArray(products) || products.length === 0) {
      await session.abortTransaction();
      return next(new ApiError(400, "Products list required"));
    }

    if (totalAmount == null || netAmount == null) {
      await session.abortTransaction();
      return next(new ApiError(400, "Total amount and net amount required"));
    }

    // ---------- CHECK EXISTING QUOTATION ----------
    const existedClientQuotation = await ClientQuotation.findOne({
      projectId: projectId,
      clientId: clientId,
    }).session(session);

    if (existedClientQuotation) {
      await session.abortTransaction();
      return next(
        new ApiError(400, "Quotation for this project and client already exists")
      );
    }

    // ---------- DB REFERENCES VALIDATION ----------
    const [existingClient, existingProject] = await Promise.all([
      Client.findById(clientId).session(session),
      Project.findById(projectId).session(session),
    ]);

    if (!existingClient) {
      await session.abortTransaction();
      return next(new ApiError(404, "Client not found"));
    }

    if (!existingProject) {
      await session.abortTransaction();
      return next(new ApiError(404, "Project not found"));
    }

    // ---------- PRODUCT TOTAL CALCULATION ----------
    const finalProducts = products.map((p) => ({
      name: p.name || "Product",
      unit: p.unit || "pcs",
      qty: Number(p.qty) || 0,
      basePrice: Number(p.basePrice) || 0,
      total: (Number(p.qty) || 0) * (Number(p.basePrice) || 0),
    }));

    // ---------- AUTO CALCULATE GST ----------
    const gstPercent = 18; // Fixed as per requirements
    const gstAmount = (netAmount * gstPercent) / 100;
    const finalAmount = netAmount + gstAmount;

    // ---------- CREATE QUOTATION ----------
    const quotation = new ClientQuotation({
      projectId,
      clientId,
      client: {
        name: client.name,
        company: client.company || "",
        contact: client.contact,
        email: client.email || "",
        address: client.address || "",
      },
      project: {
        title: project.title,
        code: project.code,
        description: project.description || "",
      },
      products: finalProducts,
      pricing: {
        totalAmount: Number(totalAmount) || 0,
        discountPercent: Number(discountPercent) || 0,
        discountAmount: Number(discountAmount) || 0,
        netAmount: Number(netAmount) || 0,
        gstPercent,
        gstAmount,
        finalAmount,
      },
      remark: remark || "",
      additionalNotes: additionalNotes || "",
      termsConditions: termsConditions || "",
      createdBy: req.user?._id || null,
      status: "draft",
    });

    const savedQuotation = await quotation.save({ session });

    // ---------- UPDATE PROJECT FLAG ----------
    try {
      await Project.findByIdAndUpdate(
        projectId,
        {
          $set: {
            hasQuotation: true,
            quotationId: savedQuotation._id,
          },
        },
        { session, new: true, runValidators: true }
      );
    } catch (projErr) {
      console.error("Failed to update Project hasQuotation flag:", projErr);
      await session.abortTransaction();
      return next(new ApiError(500, "Failed to update project quotation status"));
    }

    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: "Quotation created successfully!",
      data: {
        quotationId: savedQuotation.quotationId,
        _id: savedQuotation._id,
        finalAmount: savedQuotation.pricing.finalAmount,
        netAmount: savedQuotation.pricing.netAmount,
        status: savedQuotation.status,
      },
    });
  } catch (err) {
    await session.abortTransaction();
    console.error("createQuotation error:", err);
    return next(new ApiError(500, err.message || "Failed to create quotation"));
  } finally {
    session.endSession();
  }
};

export const updateQuotation = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      await session.abortTransaction();
      return next(new ApiError(400, "Invalid quotation ID"));
    }

    if (!req.body) {
      await session.abortTransaction();
      return next(new ApiError(400, "Update data required"));
    }

    const {
      client,
      project,
      products,
      totalAmount,
      discountPercent,
      discountAmount,
      netAmount,
      remark,
      additionalNotes,
      termsConditions,
      status,
    } = req.body;

    // ---------- FIND EXISTING QUOTATION ----------
    const existingQuotation = await ClientQuotation.findById(id).session(session);
    if (!existingQuotation) {
      await session.abortTransaction();
      return next(new ApiError(404, "Quotation not found"));
    }

    // ---------- PREPARE UPDATE DATA ----------
    const updateData = {};

    if (client) {
      updateData.client = {
        name: client.name || existingQuotation.client.name,
        company: client.company || existingQuotation.client.company,
        contact: client.contact || existingQuotation.client.contact,
        email: client.email || existingQuotation.client.email,
        address: client.address || existingQuotation.client.address,
      };
    }

    if (project) {
      updateData.project = {
        title: project.title || existingQuotation.project.title,
        code: project.code || existingQuotation.project.code,
        description: project.description || existingQuotation.project.description,
      };
    }

    if (products && Array.isArray(products)) {
      updateData.products = products.map((p) => ({
        name: p.name || "Product",
        unit: p.unit || "pcs",
        qty: Number(p.qty) || 0,
        basePrice: Number(p.basePrice) || 0,
        total: (Number(p.qty) || 0) * (Number(p.basePrice) || 0),
      }));
    }

    // ---------- RECALCULATE PRICING ----------
    if (products || totalAmount !== undefined || discountPercent !== undefined || 
        discountAmount !== undefined || netAmount !== undefined) {
      
      let calculatedTotal = totalAmount;
      let calculatedNet = netAmount;
      let calculatedDiscountAmount = discountAmount;
      let calculatedDiscountPercent = discountPercent;

      // If products are provided, recalculate from products
      if (products && Array.isArray(products)) {
        calculatedTotal = products.reduce((sum, p) => {
          const qty = Number(p.qty) || 0;
          const price = Number(p.basePrice) || 0;
          return sum + (qty * price);
        }, 0);

        // Calculate discount
        if (discountPercent > 0) {
          calculatedDiscountAmount = (calculatedTotal * discountPercent) / 100;
          calculatedDiscountPercent = discountPercent;
        } else if (discountAmount > 0) {
          calculatedDiscountAmount = discountAmount;
          calculatedDiscountPercent = (discountAmount / calculatedTotal) * 100;
        } else {
          calculatedDiscountAmount = 0;
          calculatedDiscountPercent = 0;
        }

        calculatedNet = calculatedTotal - calculatedDiscountAmount;
      }

      const gstPercent = 18;
      const gstAmount = (calculatedNet * gstPercent) / 100;
      const finalAmount = calculatedNet + gstAmount;

      updateData.pricing = {
        totalAmount: calculatedTotal || existingQuotation.pricing.totalAmount,
        discountPercent: calculatedDiscountPercent || existingQuotation.pricing.discountPercent,
        discountAmount: calculatedDiscountAmount || existingQuotation.pricing.discountAmount,
        netAmount: calculatedNet || existingQuotation.pricing.netAmount,
        gstPercent,
        gstAmount,
        finalAmount,
      };
    }

    if (remark !== undefined) updateData.remark = remark;
    if (additionalNotes !== undefined) updateData.additionalNotes = additionalNotes;
    if (termsConditions !== undefined) updateData.termsConditions = termsConditions;
    if (status) updateData.status = status;

    // ---------- UPDATE QUOTATION ----------
    const updatedQuotation = await ClientQuotation.findByIdAndUpdate(
      id,
      updateData,
      {
        session,
        new: true,
        runValidators: true,
      }
    );

    if (!updatedQuotation) {
      await session.abortTransaction();
      return next(new ApiError(404, "Quotation not found after update"));
    }

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "Quotation updated successfully!",
      data: {
        quotationId: updatedQuotation.quotationId,
        _id: updatedQuotation._id,
        status: updatedQuotation.status,
        finalAmount: updatedQuotation.pricing.finalAmount,
        netAmount: updatedQuotation.pricing.netAmount,
      },
    });
  } catch (err) {
    await session.abortTransaction();
    console.error("updateQuotation error:", err);
    return next(new ApiError(500, err.message || "Failed to update quotation"));
  } finally {
    session.endSession();
  }
};

export const sendQuotationToClient = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  let uploadedPdf = null;
  let transactionCommitted = false; // Track transaction status

  try {
    const { id } = req.params;
    const { html } = req.body;
    const userId = req.user?._id;

    if (!id || !mongoose.isValidObjectId(id)) {
      await session.abortTransaction();
      return next(new ApiError(400, "Valid quotation ID required"));
    }

    if (!html) {
      await session.abortTransaction();
      return next(new ApiError(400, "Quotation HTML content required"));
    }

    // ---------- FIND QUOTATION ----------
    const quotation = await ClientQuotation.findById(id).session(session);
    if (!quotation) {
      await session.abortTransaction();
      return next(new ApiError(404, "Quotation not found"));
    }

    const clientEmail = quotation.client?.email;
    if (!clientEmail) {
      await session.abortTransaction();
      return next(new ApiError(400, "Client email not found in quotation"));
    }

    // ---------- GENERATE PDF ----------
    const pdfBuffer = await htmlToPdf(html);
    if (!pdfBuffer) {
      await session.abortTransaction();
      return next(new ApiError(500, "PDF generation failed"));
    }
    let pdfUploadResult;

    if (process.env.USE_CLOUDINARY === "true") {
      pdfUploadResult = await uploadFiles([
        {
          buffer: pdfBuffer,
          originalname: `${quotation.quotationId}.pdf`,
          mimetype: "application/pdf",
        },
      ]);

      if (!pdfUploadResult.success || !pdfUploadResult.files.length) {
        await session.abortTransaction();
        return next(new ApiError(500, "PDF upload to cloud failed"));
      }

      uploadedPdf = pdfUploadResult.files[0];
    } else {
      // Save to local folder
      const fileName = `${quotation.quotationId}.pdf`;
      const localPath = `uploads/quotations/${fileName}`;
      
      // Ensure directory exists
      await fs.mkdir("uploads/quotations", { recursive: true });
      await fs.writeFile(localPath, pdfBuffer);

      uploadedPdf = {
        url: localPath,
        public_url: null,
        public_id: null,
        originalName: fileName,
        mimetype: "application/pdf",
        size: pdfBuffer.length,
      };
    }

    // ---------- SEND EMAIL ----------
    const EmailHtml = `<div style="width:100%; background:#f5f5f5; padding:20px 0; font-family:Arial, sans-serif;">
    <div style="max-width:650px; background:#ffffff; margin:0 auto; border-radius:8px; overflow:hidden; border:1px solid #e5e5e5;">
      
      <!-- Header -->
      <div style="background:#dc2626; padding:20px;">
        <h2 style="margin:0; color:#ffffff; font-size:20px; font-weight:bold;">
          3S Digital Signage Solutions
        </h2>
        <p style="margin:4px 0 0; color:#f9f9f9; font-size:12px;">
          Quotation Document Attached
        </p>
      </div>

      <!-- Body -->
      <div style="padding:20px; color:#333333; font-size:14px; line-height:1.6;">
        <p>Dear <strong>${quotation.client.name}</strong>,</p>

        <p>
          Please find attached the quotation for your project 
          <strong>${quotation.project.title}</strong>.
        </p>

        <p style="margin-top:10px;">
          <strong>Quotation ID:</strong> ${quotation.quotationId}<br/>
          <strong>Project Code:</strong> ${quotation.project.code}<br/>
          <strong>Total Amount:</strong> ₹${quotation.pricing.finalAmount?.toLocaleString("en-IN") || "0"}
        </p>

        <p>
          If you have any questions or require modifications, feel free to contact us.
        </p>

        <p style="margin-top:25px;">
          Best Regards,<br/>
          <strong>3S Digital Signage Solutions Team</strong>
        </p>
      </div>

      <!-- Footer -->
      <div style="background:#f0f0f0; padding:15px; text-align:center; font-size:12px; color:#666;">
        © ${new Date().getFullYear()} 3S Digital Signage Solutions  
      </div>

    </div>
  </div>`;

    try {
      await sendEmail({
        to: clientEmail,
        subject: `Quotation ${quotation.quotationId} - ${quotation.project.title}`,
        html: EmailHtml,
        attachments: [
          {
            filename: `${quotation.quotationId}.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf",
          },
        ],
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      await session.abortTransaction();
      return next(new ApiError(500, "Failed to send email"));
    }

    // ---------- UPDATE QUOTATION STATUS ----------
    // Debug logs to check quotation ID
    console.log("Quotation ID before update:", quotation.quotationId);

    quotation.status = "sent";
    quotation.quotationPdf = {
      url: uploadedPdf.url,
      public_url: uploadedPdf.public_url || null,
      public_id: uploadedPdf.public_id || null,
    };

    quotation.sentHistory.push({
      sentAt: new Date(),
      sentTo: clientEmail,
      sentBy: userId,
    });

    await quotation.save({ session });
    console.log("Quotation ID after save:", quotation.quotationId);

    await session.commitTransaction();
    transactionCommitted = true; // Mark transaction as committed

    return res.status(200).json({
      success: true,
      message: "Quotation sent successfully to client",
      data: {
        quotationId: quotation.quotationId,
        pdfUrl: quotation.quotationPdf.public_url || quotation.quotationPdf.url,
        status: quotation.status,
      },
    });
  } catch (err) {
    // Only abort transaction if not committed
    if (!transactionCommitted) {
      await session.abortTransaction();
    }

    // Cleanup uploaded file only if transaction failed
    if (uploadedPdf && !transactionCommitted) {
      if (uploadedPdf?.public_id) {
        try {
          await deleteFile(uploadedPdf.public_id);
        } catch (cleanupError) {
          console.error("Cloudinary cleanup failed:", cleanupError);
        }
      }
      
      if (uploadedPdf?.url && process.env.USE_CLOUDINARY !== "true") {
        try {
          await deleteLocalFile(uploadedPdf.url);
        } catch (cleanupError) {
          console.error("Local file cleanup failed:", cleanupError);
        }
      }
    }

    console.error("sendQuotationToClient error:", err);
    return next(new ApiError(500, err.message || "Failed to send quotation"));
  } finally {
    session.endSession();
  }
};

export const getQuotationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return next(new ApiError(400, "Invalid quotation ID"));
    }

    const quotation = await ClientQuotation.findById(id)
      .populate("clientId", "name companyName phone email address")
      .populate("projectId", "projectName projectId projectDescription")
      .populate("createdBy", "name email");

    if (!quotation) {
      return next(new ApiError(404, "Quotation not found"));
    }

    return res.status(200).json({
      success: true,
      message: "Quotation fetched successfully",
      data: quotation,
    });
  } catch (err) {
    console.error("getQuotationById error:", err);
    return next(new ApiError(500, err.message || "Failed to fetch quotation"));
  }
};

export const getQuotationsByProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    if (!mongoose.isValidObjectId(projectId)) {
      return next(new ApiError(400, "Invalid project ID"));
    }

    const quotations = await ClientQuotation.find({ projectId })
      .populate("clientId", "name companyName phone email")
      .populate("projectId", "projectName projectId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Quotations fetched successfully",
      data: quotations,
    });
  } catch (err) {
    console.error("getQuotationsByProject error:", err);
    return next(new ApiError(500, err.message || "Failed to fetch quotations"));
  }
};

export const deleteQuotation = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      await session.abortTransaction();
      return next(new ApiError(400, "Invalid quotation ID"));
    }

    const quotation = await ClientQuotation.findById(id).session(session);
    if (!quotation) {
      await session.abortTransaction();
      return next(new ApiError(404, "Quotation not found"));
    }

    // Delete associated PDF file
    if (quotation.quotationPdf?.public_id) {
      try {
        await deleteFile(quotation.quotationPdf.public_id);
      } catch (fileError) {
        console.error("Failed to delete PDF file:", fileError);
      }
    }

    if (quotation.quotationPdf?.url && process.env.USE_CLOUDINARY !== "true") {
      try {
        await deleteLocalFile(quotation.quotationPdf.url);
      } catch (fileError) {
        console.error("Failed to delete local PDF file:", fileError);
      }
    }

    // Update project to remove quotation reference
    await Project.findByIdAndUpdate(
      quotation.projectId,
      {
        $set: {
          hasQuotation: false,
          quotationId: null,
        },
      },
      { session }
    );

    // Delete quotation
    await ClientQuotation.findByIdAndDelete(id).session(session);

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      message: "Quotation deleted successfully",
      data: { _id: id },
    });
  } catch (err) {
    await session.abortTransaction();
    console.error("deleteQuotation error:", err);
    return next(new ApiError(500, err.message || "Failed to delete quotation"));
  } finally {
    session.endSession();
  }
};