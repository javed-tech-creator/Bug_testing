import mongoose from "mongoose";
import invoiceModel from "../../models/vendor.model/invoice.Model.js";
import InvoiceCounterModel from "../../models/vendor.model/InvoiceCounter.Model.js";
import productModel from "../../models/vendor.model/product.Model.js";
import InvoiceDraft from "../../models/vendor.model/invoiceDrafts.Model.js";
import { generateInvoicePDF } from "../../utils/vendor/invoicetemplate.js";
// import twilio from "twilio";
import { sendToSMS } from "../../utils/vendor/sendToSMS.js";
import { createAndEmit } from "../../utils/vendor/notification.js";
import { io } from "../../app.js";
import VendorStatsModel from "../../models/vendor.model/vendorStats.Model.js";

export const createInvoice = async (req, res, next) => {
  try {
    const currentYear = new Date().getFullYear();
    const userId = req.user._id;

    //  Step 1: Invoice Counter
    let counter = await InvoiceCounterModel.findOne({
      year: currentYear,
      createdBy: userId,
    });

    if (!counter) {
      counter = new InvoiceCounterModel({
        year: currentYear,
        createdBy: userId,
        seq: 1,
      });
      await counter.save();
    } else {
      counter.seq += 1;
      await counter.save();
    }

    const invoiceId = `INV-${currentYear}-${String(counter.seq).padStart(
      3,
      "0"
    )}`;

    //  Step 2: Validate and Update Stock
    const { items, draftId } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invoice must contain at least one product item",
      });
    }

    for (const item of items) {
      const product = await productModel.findOne({
        _id: item.productId,
        importedBy: userId,
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.productId}`,
        });
      }

      // Stock check
      if (product.inStock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.productName}. Available: ${product.inStock}, Required: ${item.quantity}`,
        });
      }

      // Update stock
      product.inStock -= item.quantity;
      product.usedStock += item.quantity;
      product.totalStock = product.inStock + product.usedStock;

      await product.save();

      //  Send Low Stock Notification
      if (product.inStock <= (product.lowStockThreshold || 50)) {
        await createAndEmit({
          io,
          vendorId: userId, // jis vendor/user ka product hai
          type: "STOCK_ALERT",
          message: ` ${product.productName} stock is running low! (Only ${product.inStock} left)`,
          meta: { productId: product._id, inStock: product.inStock },
        });
      }
    }

    //  Step 3: Save Invoice
    const invoiceData = {
      ...req.body,
      createdBy: userId,
      invoiceId,
    };

    const invoice = new invoiceModel(invoiceData);
    await invoice.save();

    //  Vendor stats update
    const statusKey = (invoice.paymentStatus || "").toLowerCase();
await VendorStatsModel.findOneAndUpdate(
  { vendorId: userId },
  { $inc: { totalSales: invoice.grandTotal || 0,
            totalInvoices: 1, 
             [`statusCount.${statusKey}`]: 1,
   } },
  { upsert: true, new: true }
);


    //  Step 4: Delete draft if exists
    if (draftId) {
      await InvoiceDraft.findOneAndDelete({ draftId, createdBy: userId });
    }

    //  Step 5: Send Realtime Notification (Socket.io)
    await createAndEmit({
      io,
      vendorId: userId, // yaha userId hi vendor ka id hai
      type: "INVOICE_CREATED",
      message: `🧾 New invoice ${invoice.invoiceId} created successfully.`,
      meta: { invoiceId: invoice._id },
    });

    res.status(201).json({
      success: true,
      message:
        "Invoice created successfully, stock updated" +
        (draftId ? " and draft deleted" : ""),
      data: invoice,
    });
  } catch (error) {
   next(error);
  }
};

// GET all invoices for the logged-in user
export const getInvoices = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, startDate, endDate } = req.query;

    const filter = { createdBy: new mongoose.Types.ObjectId(req.user._id) };

    //  Status filter
    if (status) {
      filter.paymentStatus = status; // e.g., Paid, Pending, Partial
    }

    //  Date filtering logic (only startDate & endDate)
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      filter.createdAt = { $gte: start, $lte: end };
    }

    //  Fetch invoices with pagination
    //  Aggregation pipeline
    const invoices = await invoiceModel.aggregate([
      { $match: filter },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * parseInt(limit) },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: "customers", // collection ka naam (CustomerModel ka collection)
          localField: "customerId",
          foreignField: "_id",
          as: "customer",
        },
      },
      { $unwind: { path: "$customer", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          invoiceId: 1,
          amountPaid: 1,
          grandTotal: 1,
          paymentStatus: 1,
          paymentMode: 1,
          createdAt: 1,
          customerName: "$customer.fullName",
          customerPhone: "$customer.phone",
        },
      },
    ]);

    const totalInvoices = await invoiceModel.countDocuments(filter);

    res.status(200).json({
      success: true,
      total: totalInvoices,
      page: parseInt(page),
      limit: parseInt(limit),
      data: invoices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching invoices",
      error: error.message,
    });
  }
};

// delete data api
// export const getInvoices = async (req, res) => {
//  try {
//     const currentYear = new Date().getFullYear();
//     const userId = req.user._id;
//     const resetCounter = await InvoiceCounterModel.findOneAndUpdate(
//       { year: currentYear },
//       { seq: 0 }, // reset sequence to 0
//       { new: true, upsert: true } // agar record nahi hai toh create kar de
//     );
//   // 1️⃣ Delete all invoices of current user
//     await invoiceModel.deleteMany({ createdBy: userId });
//  // 3️⃣ Reset invoice counter of current user
//     await InvoiceCounterModel.findOneAndUpdate(
//       { year: currentYear, createdBy: userId },
//       { $set: { seq: 0 } },
//       { new: true }
//     );
//     res.status(200).json({
//       success: true,
//       message: `Invoice counter for ${currentYear} has been reset.`,
//       data: resetCounter,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message || "Error resetting invoice counter",
//     });
//   }
// };

//  Sirf preview ke liye next invoice number return karega (save nahi karega)

export const getNextInvoiceNumber = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const userId = req.user._id; // Vendor/user specific

    // Current counter value fetch karo (increment nahi karna)
    const counter = await InvoiceCounterModel.findOne({
      year: currentYear,
      createdBy: userId,
    });

    const nextSeq = counter ? counter.seq + 1 : 1;

    // Infinite-friendly, minimum 3 digits
    const previewInvoiceId = `INV-${currentYear}-${String(nextSeq).padStart(
      3,
      "0"
    )}`;

    res.json({
      success: true,
      previewInvoiceId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting next invoice number",
      error: error.message,
    });
  }
};

// update invoice payment
export const updateInvoicePayment = async (req, res, next) => {
  try {
    const { invoiceId } = req.params; // invoiceId from URL
    const vendorId = req.user._id; // Auth middleware se vendor ka ID

    const {
      paymentAmount,
      paymentMode,
      paymentDate,
      notes,
      sendSMS,
      customer,
      phone,
    } = req.body;

    // Invoice ko find karo
    const invoice = await invoiceModel.findOne({
      invoiceId,
      createdBy: vendorId,
    });
    if (!invoice) {
      return res.status(404).json({ success:false, message: "Invoice not found" });
    }
         // vendorStatsModel ke liye use hoga
        const oldStatus = invoice.paymentStatus;

    // Already paid amount + new payment
    const newPaidAmount = (invoice.amountPaid || 0) + paymentAmount;

    //  Payment Status Decide
    let newStatus = "Pending";
    if (newPaidAmount === 0) {
      newStatus = "Pending";
    } else if (newPaidAmount < invoice.grandTotal) {
      newStatus = "Partial";
    } else if (newPaidAmount >= invoice.grandTotal) {
      newStatus = "Paid";
    }


    //  Update fields
    invoice.amountPaid = newPaidAmount;
    invoice.partialPaid =
      newPaidAmount < invoice.grandTotal ? newPaidAmount : 0;
    invoice.paymentStatus = newStatus;
    invoice.paymentMode = paymentMode || invoice.paymentMode;
    invoice.paymentDate = paymentDate || new Date(); // agar nahi bheja to abhi ka time
    invoice.notes = notes || invoice.notes;
    invoice.sendSMS = sendSMS ?? invoice.sendSMS;

    //  Push into payment history
    invoice.paymentHistory.push({
      amount: paymentAmount,
      mode: paymentMode,
      date: paymentDate || new Date(),
      notes: notes || "",
      sendSMS: sendSMS ?? false,
    });

    // Save updated invoice
    await invoice.save();

    //  Purana status ko store karo
if (oldStatus !== newStatus) {
  const oldKey = (oldStatus || "").toLowerCase();
  const newKey = (newStatus || "").toLowerCase();

  const updateQuery = {};
  if (oldKey) updateQuery[`statusCount.${oldKey}`] = -1; // decrease old
  if (newKey) updateQuery[`statusCount.${newKey}`] = 1;  // increase new

  await VendorStatsModel.findOneAndUpdate(
    { vendorId },
    { $inc: updateQuery },
    { new: true }
  );
}


    //  Socket Notification
    if (newStatus === "Paid") {
      await createAndEmit({
        io,
        vendorId,
        type: "PAYMENT_COMPLETED",
        message: `💰 Invoice ${invoice.invoiceId} fully paid (₹${invoice.amountPaid})`,
        meta: { invoiceId: invoice._id, amountPaid: invoice.amountPaid },
      });
    } else if (newStatus === "Partial") {
      await createAndEmit({
        io,
        vendorId,
        type: "PAYMENT_PARTIAL",
        message: `💳 Partial payment received for Invoice ${
          invoice.invoiceId
        } (₹${paymentAmount}). Remaining: ₹${
          invoice.grandTotal - invoice.amountPaid
        }`,
        meta: {
          invoiceId: invoice._id,
          paymentAmount,
          remaining: invoice.grandTotal - invoice.amountPaid,
        },
      });
    }

    // Agar SMS bhejna hai
    let smsResponse = null;
    // Agar SMS bhejna hai
    if (invoice.sendSMS) {
      console.log("📩 Sending SMS to customer...", customer);

      const customerNumber = `+91${phone.replace(/^(\+91)?/, "")}`;
      const message = `Dear ${customer}, 
We have received your payment of ₹${paymentAmount} via ${paymentMode} against
Invoice ID: ${invoiceId}.
Thank you for your prompt payment. – DSS UP`;

      smsResponse = await sendToSMS(customerNumber, message);

      return res.status(200).json({
        success:true,
        message: "Invoice payment updated successfully",
        data: invoice,
        sms: smsResponse || { success: false, message: "SMS not requested" },
      });
    }

    // Agar SMS send karna hi nahi tha
    return res.status(200).json({
      success:true,
      message: "Invoice payment updated successfully",
      data: invoice,
    });
  } catch (error) {
next(error)
  }
};


export const createInvoiceTemplate = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const createdBy = req.user._id;

    // 1. Invoice find karo sirf logged-in vendor ke liye
    const invoice = await invoiceModel
      .findOne({ invoiceId, createdBy })
      .populate("customerId")
      .populate("bankDetailId")
      .populate("createdBy");

    if (!invoice) {
      return res
        .status(404)
        .json({ success:false, message: "Invoice not found or unauthorized" });
    }

    // 2. Customer Details
    const customer = invoice.customerId || {};
    const customerData = {
      customerName: customer.fullName || "-",
      customerCompanyName: customer.companyName || "-",
      customerPhone: customer.phone || "-",
      customerEmail: customer.email || "-",
      customerGSTIN: customer.gstin || "-",
      customerAddressLine1: customer.addressLine1 || "-",
      customerAddressLine2: customer.addressLine2 || "-",
      customerCity: customer.city || "-",
      customerPincode: customer.pincode || "-",
      customerState: customer.state || "-",
    };

    // 3. Bank Details
    const bank = invoice.bankDetailId || {};
    const bankData = {
      bank: bank.bankName || "-",
      accountNo: bank.accountNumber || "-",
      ifsc: bank.ifscCode || "-",
      branch: bank.branchName || "-",
      upiId: (bank.upiId || "7526074042@ybl").replace(/\s+/g, "").trim(),
    };

    // 4. Items + amounts
    const { items, taxableAmount } = (invoice.items || []).reduce(
      (acc, item) => {
        let discountValue = 0;

        if (item.discount) discountValue = item.discount;
        else if (invoice.globalDiscountType === "₹")
          discountValue = invoice.globalDiscount || 0;
        else if (invoice.globalDiscountType === "%") {
          discountValue =
            ((item.rateUnit || 0) *
              (item.quantity || 0) *
              (invoice.globalDiscount || 0)) /
            100;
        }

        const baseAmount = (item.rateUnit || 0) * (item.quantity || 0);
        const discountedAmount = baseAmount - discountValue;
        const gstAmount = (discountedAmount * (item.gstPercent || 0)) / 100;
        const amount = discountedAmount + gstAmount;

        acc.items.push({
          name: item.productName || "-",
          qty: item.quantity || 0,
          rate: item.rateUnit || 0,
          discount: discountValue.toFixed(2),
          discountedAmount,
          gstPercent: item.gstPercent || 0,
          gstAmount,
          amount,
        });

        acc.taxableAmount += amount;
        return acc;
      },
      { items: [], taxableAmount: 0 }
    );

    // 5. Payment logic
    const amountPaid = Number(invoice.amountPaid || 0);
    const amountPayable = Number(invoice.grandTotal || 0) - amountPaid;

    // 6. Prepare invoice data
    const invoiceData = {
      invoiceNo: invoice.invoiceId,
      invoiceDate:
        invoice.invoiceDate?.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }) || "-",
      dueDate:
        invoice.dueDate?.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }) || "-",
      companyName: invoice.createdB?.name || "3S Digital Signage Solutions",
      company: {
        gstin: "29ABCDE1234F1Z5",
        addressLines: [
          "No. 123, 4th Floor, Tech Park",
          "MG Road, Indiranagar",
          "Bengaluru - 560038",
          "Karnataka, India",
        ],
        phone: "+91 9876543210",
        email: "info@3sdss.com",
        website: "www.3sdss.com",
      },
      placeOfSupply: customerData.customerState,
      ...customerData,
      items,
      taxableAmount,
      totalAmount: Number(invoice.grandTotal || 0),
      taxAmount: Number(invoice.totalTaxAmount || 0),
      amountPayable,
      totalAmountWords: Number(invoice.grandTotal || 0),
      bankDetails: bankData,
      paymentStatus: invoice.paymentStatus || "Pending",
      amountPaid,
    };

    // 7. Generate PDF
    await generateInvoicePDF(invoiceData, res);
  } catch (error) {
    console.error("Error generating invoice:", error);
    res.status(500).json({ success:false, message: "Error generating invoice", error });
  }
};


