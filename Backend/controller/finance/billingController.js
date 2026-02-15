// controllers/billingController.js
import Quotation from '../../models/finance/Quotation.js';
import Invoice from '../../models/finance/Invoice.js';
import { generateInvoicePDF } from '../../utils/finance/pdfGenerator.js';
import { generateQuotationPDF } from '../../utils/finance/generateQuotationPDF.js'
// import { sendMail } from '../../util/finance/mailer.js';
import mongoose from 'mongoose'
import { normalizeInvoiceResponse } from '../../Helpers/finance/InvoiceQuatation.js'

import { uploadPDFToCloudinary } from "../../Helpers/finance/cloudinaryFinancePdf.js";

import fs from "fs";

function computeTotalsForDoc(doc) {
  let sub = 0;
  let taxes = { cgst: 0, sgst: 0, igst: 0 };
  for (const it of doc.items) {
    const line = it.qty * it.rate - (it.discount || 0);
    sub += line;
    taxes.cgst += (line * (it.taxRates?.cgst || 0)) / 100;
    taxes.sgst += (line * (it.taxRates?.sgst || 0)) / 100;
    taxes.igst += (line * (it.taxRates?.igst || 0)) / 100;
  }
  const shipping = doc.shippingCharges || 0;
  const discount = doc.discount || 0;
  const total = sub + taxes.cgst + taxes.sgst + taxes.igst + shipping - discount;
  return { subTotal: sub, taxes, total };
}

// export const computeTotalsForDoc = (doc) => {
//   let subTotal = 0;
//   let taxes = { cgst: 0, sgst: 0, igst: 0 };

//   for (const it of doc.items) {
//     const line = it.qty * it.rate - (it.discount || 0);
//     subTotal += line;
//     taxes.cgst += (line * (it.taxRates?.cgst || 0)) / 100;
//     taxes.sgst += (line * (it.taxRates?.sgst || 0)) / 100;
//     taxes.igst += (line * (it.taxRates?.igst || 0)) / 100;
//   }

//   const totalTaxAmount = taxes.cgst + taxes.sgst + taxes.igst;
//   const shippingCharges = doc.shippingCharges || 0;
//   const docLevelDiscount = doc.discount || 0;

//   const grandTotal = subTotal + totalTaxAmount + shippingCharges - docLevelDiscount;

//   // 💳 Payment Status Calculation
//   const amountPaid = doc.amountPaid || 0;
//   const paymentStatus =
//     amountPaid >= grandTotal
//       ? "Paid"
//       : amountPaid > 0
//       ? "Partial"
//       : "Pending";

//   const partialPaid =
//     amountPaid > 0 && amountPaid < grandTotal ? amountPaid : 0;

//   const paymentMode = doc.paymentMode || "Pending";

//   return {
//     subTotal,
//     taxes,
//     totalTaxAmount,
//     shippingCharges,
//     docLevelDiscount,
//     grandTotal,
//     paymentStatus,
//     partialPaid,
//     paymentMode,
//   };
// };

// Create quotation (Draft)
export const createQuotation = async (req, res) => {
  try {
    const payload = req.body;
    const quotationNumber = `Q-${Date.now()}`;

    // create quotation (initially without totals)
    let q = new Quotation({
      number: quotationNumber,
      client: payload.client,
      project: payload.project || null,
      items: payload.items || [],
      shippingCharges: payload.shippingCharges || 0,
      discount: payload.discount || 0,
      createdBy: req.user?._id || null,

      // payment fields
      amountPaid: payload.amountPaid || 0,
      paymentType: payload.paymentType || "Advance",
      paymentMode: payload.paymentMode || "UPI",
      dueDate: payload.dueDate || null,
    });

    // compute totals
    const computed = computeTotalsForDoc(q);
    q.subTotal = computed.subTotal;
    q.taxes = computed.taxes;
    q.total = computed.total;
    q.totalCGST = computed.totalCGST || 0;
    q.totalSGST = computed.totalSGST || 0;
    q.totalIGST = computed.totalIGST || 0;
    q.totalGSTPercent = computed.totalGSTPercent || 0;

    // 🆕 set paymentStatus (either from payload or auto-calc)
    if (payload.paymentStatus) {
      q.paymentStatus = payload.paymentStatus;
    } else {
      if (q.amountPaid >= q.total) {
        q.paymentStatus = "Paid";
      } else if (q.amountPaid > 0 && q.amountPaid < q.total) {
        q.paymentStatus = "Partially Paid";
      } else {
        q.paymentStatus = "Pending";
      }
    }

    await q.save();

    res.json({ success: true, message: "Quotation created", q });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error creating quotation",
      error: err.message,
    });
  }
};

// Update quotation
// export const updateQuotation = async (req, res) => {
//   try {
//     const q = await Quotation.findById(req.params.id);
//     if (!q) return res.status(404).json({ message: 'Quotation not found' });

//     Object.assign(q, req.body);
//     const computed = computeTotalsForDoc(q);
//     q.subTotal = computed.subTotal;
//     q.taxes = computed.taxes;
//     q.total = computed.total;
//     await q.save();

//     res.json({ success: true, message: 'Quotation updated', q });
//   } catch (err) {
//     res.status(500).json({ success: false, message: 'Error updating quotation', error: err.message });
//   }
// };

// Get single quotation

export const updateQuotation = async (req, res) => {
  try {
    const q = await Quotation.findById(req.params.id);
    if (!q) {
      return res.status(404).json({ success: false, message: "Quotation not found" });
    }

    // update allowed fields
    Object.assign(q, {
      client: req.body.client ?? q.client,
      project: req.body.project ?? q.project,
      items: req.body.items ?? q.items,
      shippingCharges: req.body.shippingCharges ?? q.shippingCharges,
      discount: req.body.discount ?? q.discount,
      amountPaid: req.body.amountPaid ?? q.amountPaid,
      paymentType: req.body.paymentType ?? q.paymentType,
      paymentMode: req.body.paymentMode ?? q.paymentMode,
      dueDate: req.body.dueDate ?? q.dueDate,
      status: req.body.status ?? q.status,
    });

    // recompute totals
    const computed = computeTotalsForDoc(q);
    q.subTotal = computed.subTotal;
    q.taxes = computed.taxes;
    q.total = computed.total;
    q.totalCGST = computed.totalCGST || 0;
    q.totalSGST = computed.totalSGST || 0;
    q.totalIGST = computed.totalIGST || 0;
    q.totalGSTPercent = computed.totalGSTPercent || 0;

    // auto-update paymentStatus based on amountPaid vs total
    if (q.amountPaid >= q.total) {
      q.paymentStatus = "Paid";
    } else if (q.amountPaid > 0 && q.amountPaid < q.total) {
      q.paymentStatus = "Partially Paid";
    } else {
      q.paymentStatus = "Pending";
    }

    await q.save();

    res.json({ success: true, message: "Quotation updated", q });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error updating quotation",
      error: err.message,
    });
  }
};

 
// Delete Quotation Controller
export const deleteQuotation = async (req, res) => {
  try {
    const { id } = req.params; // quotation id from URL

    // Check if quotation exists
    const quotation = await Quotation.findById(id);
    if (!quotation) {
      return res.status(404).json({
        success: false,
        message: "Quotation not found",
      });
    }

    // Delete the quotation
    await Quotation.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Quotation deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting quotation:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting quotation",
      error: error.message,
    });
  }
};

export const getQuotation = async (req, res) => {
  try {
    const q = await Quotation.findById(req.params.id).populate('client project items.product');
    res.json({ success: true, q });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching quotation', error: err.message });
  }
};

// List all quotations
export const listQuotations = async (req, res) => {
  try {
    const q = await Quotation.find().populate('client project');
    res.json({ success: true, message: 'Quotations fetched', q });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error listing quotations', error: err.message });
  }
};


// Send quotation
// export const sendQuotation = async (req, res) => {
//   try {
//     const q = await Quotation.findById(req.params.id).populate("client");
//     if (!q) return res.status(404).json({ message: "Quotation not found" });

//     // Status update
//     q.status = "Sent";

//     // 🧾 Calculations
//     let subTotal = 0, totalDiscount = 0, totalCGST = 0, totalSGST = 0, totalIGST = 0;

//     q.items.forEach(it => {
//       const netAmount = it.qty * it.rate;
//       const discount = it.discount || 0;
//       const netAfterDiscount = netAmount - discount;

//       subTotal += netAmount;
//       totalDiscount += discount;

//       totalCGST += (netAfterDiscount * (it.taxRates?.cgst || 0)) / 100;
//       totalSGST += (netAfterDiscount * (it.taxRates?.sgst || 0)) / 100;
//       totalIGST += (netAfterDiscount * (it.taxRates?.igst || 0)) / 100;
//     });

//     const totalTaxAmount = totalCGST + totalSGST + totalIGST;
//     const totalGSTPercent = q.items.reduce(
//       (sum, it) =>
//         sum + ((it.taxRates?.cgst || 0) + (it.taxRates?.sgst || 0) + (it.taxRates?.igst || 0)),
//       0
//     );

//     const shippingCharges = q.shippingCharges || 0;
//     const grandTotal = subTotal - totalDiscount + totalTaxAmount + shippingCharges;

//     // Values update
//     q.subTotal = subTotal;
//     q.taxes = { cgst: totalCGST, sgst: totalSGST, igst: totalIGST };
//     q.total = grandTotal;

//     await q.save();


//     // 🖨 Generate PDF
//    const pdfPath = await generateQuotationPDF(
//   { ...q.toObject(), totalCGST, totalSGST, totalIGST, totalGSTPercent, totalTaxAmount, grandTotal },
//   q.client
// );


//     // 📧 Send Mail
//     await sendMail({
//       to: q.client.email,
//       subject: `Quotation ${q.number}`,
//       text: "Please find attached quotation",
//       attachments: [{ path: pdfPath }],
//     });

//     // API Response
//     res.json({
//       success: true,
//       message: "Quotation sent successfully",
//       quotation: {
//         ...q.toObject(),
//         totalCGST,
//         totalSGST,
//         totalIGST,
//         totalGSTPercent,
//         totalTaxAmount,
//         grandTotal
//       }
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: "Error sending quotation",
//       error: err.message,
//     });
//   }
// };



// controllers/quotation.controller.js
// export const sendQuotation = async (req, res) => {
//   try {
//     const q = await Quotation.findById(req.params.id).populate("client");
//     if (!q) return res.status(404).json({ message: "Quotation not found" });

//     q.status = "Sent";

//     // 🧾 Calculations
//     let subTotal = 0,
//       totalDiscount = 0,
//       totalCGST = 0,
//       totalSGST = 0,
//       totalIGST = 0;

//     q.items.forEach((it) => {
//       const netAmount = it.qty * it.rate;
//       const discount = it.discount || 0;
//       const netAfterDiscount = netAmount - discount;

//       subTotal += netAmount;
//       totalDiscount += discount;

//       totalCGST += (netAfterDiscount * (it.taxRates?.cgst || 0)) / 100;
//       totalSGST += (netAfterDiscount * (it.taxRates?.sgst || 0)) / 100;
//       totalIGST += (netAfterDiscount * (it.taxRates?.igst || 0)) / 100;
//     });

//     const totalTaxAmount = totalCGST + totalSGST + totalIGST;
//     const totalGSTPercent = q.items.reduce(
//       (sum, it) =>
//         sum +
//         ((it.taxRates?.cgst || 0) +
//           (it.taxRates?.sgst || 0) +
//           (it.taxRates?.igst || 0)),
//       0
//     );

//     const shippingCharges = q.shippingCharges || 0;
//     const grandTotal =
//       subTotal - totalDiscount + totalTaxAmount + shippingCharges;

//     q.subTotal = subTotal;
//     q.taxes = { cgst: totalCGST, sgst: totalSGST, igst: totalIGST };
//     q.total = grandTotal;

//     await q.save();

//     // 🖨 Generate PDF once
//     const pdfPath = await generateQuotationPDF(
//       {
//         ...q.toObject(),
//         subTotal,
//         totalDiscount,
//         totalTaxAmount,
//         shippingCharges,
//         grandTotal,
//         totalCGST,
//         totalSGST,
//         totalIGST,
//         totalGSTPercent,
//       },
//       q.client
//     );

//     // ☁ Upload same PDF to Cloudinary
//     const pdfUrl = await uploadPDFToCloudinary(pdfPath, "finance_docs");

//     // 📧 Send Mail with same PDF
//     await sendMail({
//       to: q.client.email,
//       subject: `Quotation ${q.number}`,
//       text: "Please find attached quotation",
//       attachments: [{ path: pdfPath }], // ab local file exist karti hai
//     });

//     // 🔥 Clean up local file AFTER upload + mail
//     if (fs.existsSync(pdfPath)) {
//       fs.unlinkSync(pdfPath);
//     }

//     res.json({
//       success: true,
//       message: "Quotation sent successfully",
//       quotation: {
//         ...q.toObject(),
//         totalCGST,
//         totalSGST,
//         totalIGST,
//         totalGSTPercent,
//         totalTaxAmount,
//         grandTotal,
//         pdfUrl,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: "Error sending quotation",
//       error: err.message,
//     });
//   }
// };

export const sendQuotation = async (req, res) => {
  try {
    const q = await Quotation.findById(req.params.id).populate("client");
    if (!q) return res.status(404).json({ message: "Quotation not found" });

    q.status = "Sent";

    // 🧾 Calculations
    let subTotal = 0,
      totalDiscount = 0,
      totalCGST = 0,
      totalSGST = 0,
      totalIGST = 0;

    q.items.forEach((it) => {
      const netAmount = it.qty * it.rate;
      const discount = it.discount || 0;
      const netAfterDiscount = netAmount - discount;

      subTotal += netAmount;
      totalDiscount += discount;

      totalCGST += (netAfterDiscount * (it.taxRates?.cgst || 0)) / 100;
      totalSGST += (netAfterDiscount * (it.taxRates?.sgst || 0)) / 100;
      totalIGST += (netAfterDiscount * (it.taxRates?.igst || 0)) / 100;
    });

    const totalTaxAmount = totalCGST + totalSGST + totalIGST;
    const totalGSTPercent = q.items.reduce(
      (sum, it) =>
        sum +
        ((it.taxRates?.cgst || 0) +
          (it.taxRates?.sgst || 0) +
          (it.taxRates?.igst || 0)),
      0
    );

    const shippingCharges = q.shippingCharges || 0;
    const grandTotal =
      subTotal - totalDiscount + totalTaxAmount + shippingCharges;

    // 📝 Update totals
    q.subTotal = subTotal;
    q.taxes = { cgst: totalCGST, sgst: totalSGST, igst: totalIGST };
    q.total = grandTotal;

    // ✅ Ensure payment fields exist (fallback defaults)
    q.amountPaid = q.amountPaid || 0;
    q.paymentType = q.paymentType || "Advance";
    q.paymentMode = q.paymentMode || "UPI";
    if (!q.dueDate) {
      const defaultDueDate = new Date();
      defaultDueDate.setDate(defaultDueDate.getDate() + 7);
      q.dueDate = defaultDueDate;
    }
    q.paymentStatus = q.paymentStatus || "Pending";

    await q.save();

    // 🖨 Generate PDF
    const pdfPath = await generateQuotationPDF(
      {
        ...q.toObject(),
        subTotal,
        totalDiscount,
        totalTaxAmount,
        shippingCharges,
        grandTotal,
        totalCGST,
        totalSGST,
        totalIGST,
        totalGSTPercent,
      },
      q.client
    );

    // ☁ Upload PDF
    const pdfUrl = await uploadPDFToCloudinary(pdfPath, "finance_docs");

    // // 📧 Send Mail
    // await sendMail({
    //   to: q.client.email,
    //   subject: `Quotation ${q.number}`,
    //   text: "Please find attached quotation",
    //   attachments: [{ path: pdfPath }],
    // });

    // 🔥 Cleanup
    if (fs.existsSync(pdfPath)) {
      fs.unlinkSync(pdfPath);
    }

    res.json({
      success: true,
      message: "Quotation sent successfully",
      quotation: {
        ...q.toObject(),
        totalCGST,
        totalSGST,
        totalIGST,
        totalGSTPercent,
        totalTaxAmount,
        grandTotal,
        pdfUrl,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error sending quotation",
      error: err.message,
    });
  }
};

export const approveQuotation = async (req, res) => {
  try {
    const q = await Quotation.findById(req.params.id)
      .populate("client")
      .populate("project");

    if (!q) return res.status(404).json({ message: "Quotation not found" });

    // 1. Status update
    q.status = "Approved";
    await q.save();

    // 2. Invoice items
    const invoiceItems = q.items.map(it => {
      const netAmount = it.qty * it.rate;
      const discount = it.discount || 0;
      const netAfterDiscount = netAmount - discount;
      const cgstPercent = it.taxRates?.cgst || 0;
      const sgstPercent = it.taxRates?.sgst || 0;
      const igstPercent = it.taxRates?.igst || 0;

      const cgstAmount = (netAfterDiscount * cgstPercent) / 100;
      const sgstAmount = (netAfterDiscount * sgstPercent) / 100;
      const igstAmount = (netAfterDiscount * igstPercent) / 100;
      const totalTax = cgstAmount + sgstAmount + igstAmount;
      const priceWithTax = netAfterDiscount + totalTax;

      return {
        productId: it.product ? new mongoose.Types.ObjectId(it.product) : null,
        productName: it.description || "Unnamed Product",
        quantity: it.qty,
        rateUnit: it.rate,
        netAmount,
        discount,
        netAmountAfterDiscount: netAfterDiscount,
        taxPrice: totalTax,
        gstPercent: cgstPercent + sgstPercent + igstPercent,
        priceWithTax,
        taxRates: { cgst: cgstPercent, sgst: sgstPercent, igst: igstPercent },
      };
    });

    // 3. Totals
    const subTotal = invoiceItems.reduce((sum, it) => sum + it.netAmount, 0);
    const totalDiscount = invoiceItems.reduce((sum, it) => sum + it.discount, 0);
    const totalNetAmountAfterDiscount = invoiceItems.reduce(
      (sum, it) => sum + it.netAmountAfterDiscount,
      0
    );
    const totalTaxAmount = invoiceItems.reduce((sum, it) => sum + it.taxPrice, 0);

    const totalCGST = invoiceItems.reduce(
      (sum, it) => sum + (it.netAmountAfterDiscount * it.taxRates.cgst) / 100,
      0
    );
    const totalSGST = invoiceItems.reduce(
      (sum, it) => sum + (it.netAmountAfterDiscount * it.taxRates.sgst) / 100,
      0
    );
    const totalIGST = invoiceItems.reduce(
      (sum, it) => sum + (it.netAmountAfterDiscount * it.taxRates.igst) / 100,
      0
    );
    const totalGSTPercent = invoiceItems.reduce((sum, it) => sum + it.gstPercent, 0);

    const shippingCharges = q.shippingCharges || 0;
    const grandTotal = totalNetAmountAfterDiscount + totalTaxAmount + shippingCharges;
 
    // 4. Invoice create
    const invoice = await Invoice.create({
      invoiceId: `INV-${Date.now()}`,
      number: `I-${Date.now()}`,
      client: q.client._id,
      project: q.project?._id,
      quotation: q._id,
      invoiceDate: new Date(),
      items: invoiceItems,
      subTotal,
      totalNetAmount: subTotal,
      totalNetAmountAfterDiscount,
      totalDiscount,
      totalTaxAmount,
      totalCGST,
      totalSGST,
      totalIGST,
      totalGSTPercent,
      shippingCharges,
      grandTotal,
      total: grandTotal,
      taxes: q.taxes || {},
      amountPaid: q.amountPaid || 0,
      // partialPaid:q.amountPaid > 0 && q.amountPaid < grandTotal ? q.amountPaid : 0,
      partialPaid:grandTotal - q.amountPaid ,
      paymentStatus: q.paymentStatus || "Pending",
      paymentType: q.paymentType || "Advance",
      paymentMode: q.paymentMode || "Pending",
      dueDate: q.dueDate || null, 
      issuedAt: new Date(),
      notes: "",
    });

    // 5. Populate invoice
    const populatedInvoice = await Invoice.findById(invoice._id)
      .populate({ path: "client", strictPopulate: false })
      .populate({ path: "project", strictPopulate: false })
      .populate({ path: "quotation", strictPopulate: false })
      .lean();

    // 6. Generate PDF
    const pdfPath = await generateInvoicePDF(populatedInvoice, q.client);

    // 7. Upload PDF to Cloudinary
    const pdfUrl = await uploadPDFToCloudinary(pdfPath, "finance_docs");

    // 8. Send Mail (optional attachment)
    // await sendMail({
    //   to: q.client.email,
    //   subject: `Invoice ${populatedInvoice.number}`,
    //   text: "Please find your invoice",
    //   attachments: [{ path: pdfPath }],
    // });

    // 9. Compute dynamic payment fields
   const dynamicPaymentStatus =
  populatedInvoice.amountPaid >= populatedInvoice.grandTotal
    ? "Paid"
    : populatedInvoice.amountPaid > 0
      ? "Partial"
      : "Pending";

// Amount already paid (partialPaid)
const dynamicPartialPaid =
  populatedInvoice.amountPaid > 0 && populatedInvoice.amountPaid < populatedInvoice.grandTotal
    ? populatedInvoice.grandTotal - populatedInvoice.amountPaid 
    : 0;

// Remaining / Due amount
const dueAmount = populatedInvoice.grandTotal - populatedInvoice.amountPaid;

// Payment mode
const dynamicPaymentMode = populatedInvoice.paymentMode || "Pending";

// 10. Final Response
res.json({
  success: true,
  message: "Quotation approved, invoice created & PDF uploaded",
  invoice: normalizeInvoiceResponse({
    ...populatedInvoice,
    shippingCharges,
    grandTotal: populatedInvoice.grandTotal,
    pdfUrl,
    paymentStatus: dynamicPaymentStatus,
    partialPaid: dynamicPartialPaid,
    due: dueAmount,          // yaha remaining amount
    paymentMode: dynamicPaymentMode,
  }),
});
  } catch (err) {
    console.error("❌ Approve Quotation Error:", err);
    res.status(500).json({
      success: false,
      message: "Error approving quotation",
      error: err.message,
    });
  }
};



// export const approveQuotation = async (req, res) => {
//   try {
//     const q = await Quotation.findById(req.params.id)
//       .populate("client")
//       .populate("project");

//     if (!q) return res.status(404).json({ message: "Quotation not found" });

//     // 1. Status update
//     q.status = "Approved";
//     await q.save();

//     // 2. Invoice items
//     const invoiceItems = q.items.map(it => {
//       const netAmount = it.qty * it.rate;
//       const discount = it.discount || 0;
//       const netAfterDiscount = netAmount - discount;
//       const cgstPercent = it.taxRates?.cgst || 0;
//       const sgstPercent = it.taxRates?.sgst || 0;
//       const igstPercent = it.taxRates?.igst || 0;

//       const cgstAmount = (netAfterDiscount * cgstPercent) / 100;
//       const sgstAmount = (netAfterDiscount * sgstPercent) / 100;
//       const igstAmount = (netAfterDiscount * igstPercent) / 100;
//       const totalTax = cgstAmount + sgstAmount + igstAmount;
//       const priceWithTax = netAfterDiscount + totalTax;

//       return {
//         productId: it.product ? new mongoose.Types.ObjectId(it.product) : null,
//         productName: it.description || "Unnamed Product",
//         quantity: it.qty,
//         rateUnit: it.rate,
//         netAmount,
//         discount,
//         netAmountAfterDiscount: netAfterDiscount,
//         taxPrice: totalTax,
//         gstPercent: cgstPercent + sgstPercent + igstPercent,
//         priceWithTax,
//         taxRates: {
//           cgst: cgstPercent,
//           sgst: sgstPercent,
//           igst: igstPercent,
//         },
//       };
//     });

//     // 3. Totals
//     const subTotal = invoiceItems.reduce((sum, it) => sum + it.netAmount, 0);
//     const totalDiscount = invoiceItems.reduce((sum, it) => sum + it.discount, 0);
//     const totalNetAmountAfterDiscount = invoiceItems.reduce(
//       (sum, it) => sum + it.netAmountAfterDiscount,
//       0
//     );
//     const totalTaxAmount = invoiceItems.reduce((sum, it) => sum + it.taxPrice, 0);

//     const totalCGST = invoiceItems.reduce((sum, it) => sum + (it.netAmountAfterDiscount * it.taxRates.cgst) / 100, 0);
//     const totalSGST = invoiceItems.reduce((sum, it) => sum + (it.netAmountAfterDiscount * it.taxRates.sgst) / 100, 0);
//     const totalIGST = invoiceItems.reduce((sum, it) => sum + (it.netAmountAfterDiscount * it.taxRates.igst) / 100, 0);
//     const totalGSTPercent = invoiceItems.reduce((sum, it) => sum + it.gstPercent, 0);

//     const shippingCharges = q.shippingCharges !== undefined ? q.shippingCharges : 0;
//     const grandTotal = totalNetAmountAfterDiscount + totalTaxAmount + shippingCharges;

//     // 4. Invoice create
//     const invoice = await Invoice.create({
//       invoiceId: `INV-${Date.now()}`,
//       number: `I-${Date.now()}`,
//       client: q.client._id,
//       project: q.project?._id,
//       quotation: q._id,
//       invoiceDate: new Date(),
//       items: invoiceItems,
//       subTotal,
//       totalNetAmount: subTotal,
//       totalNetAmountAfterDiscount,
//       totalDiscount,
//       totalTaxAmount,
//       totalCGST,
//       totalSGST,
//       totalIGST,
//       totalGSTPercent,
//       shippingCharges,
//       grandTotal,
//       total: grandTotal,
//       taxes: q.taxes || {},
//       amountPaid: 0,
//       partialPaid: 0,
//       paymentStatus: "Pending",
//       paymentMode: "Pending",
//       issuedAt: new Date(),
//       notes: ""
//     });

//     // 5. Populate
//     const populatedInvoice = await Invoice.findById(invoice._id)
//       .populate({ path: "client", strictPopulate: false })
//       .populate({ path: "project", strictPopulate: false })
//       .populate({ path: "quotation", strictPopulate: false })
//       .lean();


//     // 6. PDF
//     const pdfPath = await generateInvoicePDF(populatedInvoice, q.client);

//     await sendMail({
//       to: q.client.email,
//       subject: `Invoice ${populatedInvoice.number}`,
//       text: "Please find your invoice",
//       attachments: [{ path: pdfPath }],
//     });

//     // 7. Response
//     res.json({
//       success: true,
//       message: "Quotation approved & invoice created",
//       invoice: normalizeInvoiceResponse({
//         ...populatedInvoice,
//         shippingCharges,
//         grandTotal,
//       }),
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: "Error approving quotation",
//       error: err.message,
//     });
//   }
// };

export const getInvoicePDF = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('client');
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    const pdfPath = await generateInvoicePDF(invoice, invoice.client);
    res.download(pdfPath);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error generating invoice PDF', error: err.message });
  }
};

export const listInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().populate('client project');
    res.json({ success: true, invoices });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error listing invoices', error: err.message });
  }
};




export const getInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ quotation: req.params.id })
      .populate("client project quotation");

    if (!invoice) return res.status(404).json({ success: false, message: "Invoice not found" });

    const pdfPath = await generateInvoicePDF(invoice, invoice.client); // client data pass
    res.sendFile(pdfPath);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};