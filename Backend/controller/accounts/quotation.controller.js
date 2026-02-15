import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import QuotationNewAccount from "../../models/accounts/quatation.js";
import InvoiceA from "../../models/accounts/invoice.js";

import { quatationInvoiceHtml } from "../../utils/account/quatationpdf.js"

const generatePdfBuffer = async (htmlContent) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();
    return pdfBuffer;
};


export const createQuotation = async (req, res) => {
    try {
        const { client, projects, items, gst } = req.body; // gst optional, default 18%
        const gstPercentage = gst || 18;

        // Subtotal calculate
        let subTotal = 0;
        items.forEach(item => {
            subTotal += item.quantity * item.rate;
        });

        // GST calculate
        const gstAmount = (subTotal * gstPercentage) / 100;

        // Total including GST
        const totalAmount = subTotal + gstAmount;

        // Generate unique quotation number
        const number = "Q-" + Date.now();

        const quotation = await QuotationNewAccount.create({
            client,
            projects,
            items,
            subTotal,
            gst: gstPercentage,
            totalAmount,
            number,
        });

        res.status(201).json({
            message: "create Quatation succesfully",
            status: 200,
            success: true,
            quotation
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};


// READ all
export const getQuotations = async (req, res) => {
    try {
        const quotations = await QuotationNewAccount.find();
        res.json({
            message: "get Quatation succesfully",
            status: 200,
            success: true,
            quotations
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// READ single
export const getQuotationById = async (req, res) => {
    try {
        const quotation = await QuotationNewAccount.findById(req.params.id);
        if (!quotation) return res.status(404).json({ error: "Not Found" });
        res.json({
            message: "get QuatationById succesfully",
            status: 200,
            success: true,
            quotation
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE
export const updateQuotation = async (req, res) => {
    try {
        const { items, gst } = req.body;

        // ✅ Calculate total amount
        const subtotal = items.reduce((acc, item) => acc + item.quantity * item.rate, 0);
        const totalAmount = subtotal + (gst ? (subtotal * gst) / 100 : 0);

        // ✅ Update quotation
        const quotation = await QuotationNewAccount.findByIdAndUpdate(
            req.params.id,
            { ...req.body, totalAmount }, // update totalAmount too
            { new: true }
        );

        res.json({
            message: "Updated successfully",
            status: 200,
            success: true,
            quotation,
        });
    } catch (err) {
        res.status(500).json({
            status: 500,
            success: false,
            error: err.message,
        });
    }
};


// DELETE
export const deleteQuotation = async (req, res) => {
    try {
        await QuotationNewAccount.findByIdAndDelete(req.params.id);
        res.json({ message: "Quotation deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const generateInvoice = async (req, res) => {
    try {
        const quotation = await QuotationNewAccount.findById(req.params.id);
        if (!quotation) return res.status(404).json({ error: "Quotation not found" });
  const { clientEmail, clientPhone } = req.body; // ✅ yaha se le rahe hain

        if (!clientEmail || !clientPhone) {
            return res.status(400).json({ error: "clientEmail and clientPhone are required" });
        }
        // Total calculate
        let subTotal = 0;
        quotation.items.forEach(item => {
            subTotal += item.quantity * item.rate;
        });

        const gstPercentage = quotation.gst || 18;
        const gstAmount = (subTotal * gstPercentage) / 100;
        const totalAmount = subTotal + gstAmount;

        // Create invoice in DB
        const invoice = await InvoiceA.create({
            client: quotation.client,
            project: quotation.projects,
            clientEmail,  // ✅ now defined
            clientPhone, // note: project, not projects
            items: quotation.items,
            invoiceNumber: "INV-" + Date.now(),
            gst: gstPercentage,
            subTotal,
            gstAmount,
            totalAmount,
            remainingAmount: totalAmount,
            paidAmount: 0,
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            status: "pending",
        });

        // Generate dynamic HTML
        const htmlContent = quatationInvoiceHtml(invoice);

        // Launch puppeteer and generate PDF
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: "networkidle0" });
        const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
        await browser.close();

        // Send PDF in response
        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `inline; filename=invoice-${invoice.invoiceNumber}.pdf`,
        });

        res.send(pdfBuffer);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


