// import InvoiceA from "../../models/accounts/invoice.js";


// // // CREATE Invoice (manual or auto) with calculation
// export const createInvoice = async (req, res) => {
//   try {
//     const { client, projects, items, gst = 18, dueDate } = req.body;

//     // Calculate subTotal
//     let subTotal = 0;
//     items.forEach(item => {
//       subTotal += item.quantity * item.rate;
//     });

//     const gstAmount = (subTotal * gst) / 100;
//     const totalAmount = subTotal + gstAmount;

//     // Generate invoiceNumber if not provided
//     const invoiceNumber = req.body.invoiceNumber || "INV-" + Date.now();

//     const invoice = await InvoiceA.create({
//       client,
//       projects,
//       items,
//       gst,
//       subTotal,
//       totalAmount,
//       invoiceNumber,
//       dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // default 7 days later
//       status: "unpaid",
//     });

//     res.status(201).json(invoice);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
// // export const createInvoice = async (req, res) => {
// //   try {
// //     const { client, projects, items, gst = 18, dueDate } = req.body;

// //     const subTotal = items.reduce((acc, item) => acc + item.quantity * item.rate, 0);
// //     const gstAmount = (subTotal * gst) / 100;
// //     const totalAmount = subTotal + gstAmount;
// //  const invoiceNumber = "INV-" + Date.now();
// //     const invoice = await InvoiceA.create({
// //       invoiceNumber,
// //       client,
// //       projects,
// //       items,
// //       gst,
// //       subTotal,
// //       gstAmount,
// //       totalAmount,
// //       remainingAmount: totalAmount,
// //       dueDate,
// //       status: "unpaid",
// //     });

// //     res.status(201).json(invoice);
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // };


// // READ all invoices
// export const getInvoices = async (req, res) => {
//   try {
//     const invoices = await InvoiceA.find().populate("payments");
//     res.json(invoices);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // READ single invoice
// export const getInvoiceById = async (req, res) => {
//   try {
//     const invoice = await InvoiceA.findById(req.params.id).populate("payments");
//     if (!invoice) return res.status(404).json({ error: "Invoice not found" });
//     res.json(invoice);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // UPDATE invoice
// export const updateInvoice = async (req, res) => {
//   try {
//     const { items, gst } = req.body;

//     let updatedData = { ...req.body };

//     if (items) {
//       let subTotal = 0;
//       items.forEach(item => {
//         subTotal += item.quantity * item.rate;
//       });
//       const gstAmount = (subTotal * (gst || 18)) / 100;
//       const totalAmount = subTotal + gstAmount;

//       updatedData.subTotal = subTotal;
//       updatedData.totalAmount = totalAmount;
//     }

//     const invoice = await InvoiceA.findByIdAndUpdate(req.params.id, updatedData, { new: true });
//     res.json(invoice);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // DELETE invoice
// export const deleteInvoice = async (req, res) => {
//   try {
//     await InvoiceA.findByIdAndDelete(req.params.id);
//     res.json({ message: "Invoice deleted" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // CREDIT/DEBIT NOTE
// export const applyNote = async (req, res) => {
//   try {
//     const { type, amount } = req.body; // type: 'credit', 'debit', 'advance', 'payment'

//     const invoice = await InvoiceA.findById(req.params.id);
//     if (!invoice) return res.status(404).json({ error: "Invoice not found" });

//     // Initialize notes array
//     if (!invoice.notes) invoice.notes = [];

//     // Add note/payment
//     invoice.notes.push({ type, amount, date: new Date() });

//     // Update amounts
//     if (type === "credit" || type === "advance") {
//       invoice.paidAmount += amount; // amount given by client
//     } else if (type === "debit") {
//       invoice.totalAmount += amount; // additional charge
//     } else if (type === "payment") {
//       invoice.paidAmount += amount; // direct payment
//     }

//     // Remaining amount
//     invoice.remainingAmount = invoice.totalAmount - invoice.paidAmount;

//     // Update status
//     invoice.status = invoice.remainingAmount <= 0 ? "paid" : "unpaid";

//     await invoice.save();
//     res.json(invoice);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
import puppeteer from "puppeteer";
import {sendPaymentReminders} from "../../Helpers/account/remainder.js"
import InvoiceA from "../../models/accounts/invoice.js";
import { generateInvoiceHTML } from "../../utils/account/generateInvoice.js"

// CREATE invoice
// CREATE invoice
export const createInvoice = async (req, res) => {
  try {
    // Destructure clientEmail and clientPhone from req.body
    const { client, clientEmail, clientPhone, project, items, gst, dueDate } = req.body;

    // Calculate amounts
    const subTotal = items.reduce((acc, item) => acc + item.quantity * item.rate, 0);
    const gstAmount = (subTotal * gst) / 100;
    const totalAmount = subTotal + gstAmount;

    const invoiceNumber = `INV-${Date.now()}`; // unique number

    // Create invoice
    const invoice = await InvoiceA.create({
      client,
      clientEmail,  // ✅ now defined
      clientPhone,  // ✅ now defined
      project,
      items,
      gst,
      subTotal,
      gstAmount,
      totalAmount,
      remainingAmount: totalAmount,
      invoiceNumber,
      dueDate,
    });

    res.status(201).json(invoice); // ✅ send the created invoice
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getClientLedger = async (req, res) => {
  try {
    const { clientId } = req.params;

    // fetch all invoices of client
    const invoices = await InvoiceA.find({ client: clientId });

    // map into debit/credit entries
    const ledger = InvoiceA.flatMap(inv => [
      {
        date: inv.createdAt,
        particulars: `Invoice #${inv._id}`,
        debit: inv.totalAmount,
        credit: 0,
        balance: inv.remainingAmount, 
      },
      ...inv.notes.map(note => ({
        date: note.date,
        particulars: `Payment (${note.method})`,
        debit: 0,
        credit: note.amount,
        balance: inv.remainingAmount - note.amount,
      }))
    ]);

    res.json(ledger);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch ledger" });
  }
};

// GET all invoices
export const getInvoices = async (req, res) => {
  try {
    const invoices = await InvoiceA.find().sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single invoice by ID
export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await InvoiceA.findById(req.params.id);
    if (!invoice) return res.status(404).json({ error: "Invoice not found" });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE invoice (items, status, dueDate, etc.)
export const updateInvoice = async (req, res) => {
  try {
    const { client, project, items, gst, dueDate, status } = req.body;

    const invoice = await InvoiceA.findById(req.params.id);
    if (!invoice) return res.status(404).json({ error: "Invoice not found" });

    if (items) {
      invoice.items = items;
      invoice.subTotal = items.reduce((acc, item) => acc + item.quantity * item.rate, 0);
      invoice.gstAmount = (invoice.subTotal * (gst || invoice.gst)) / 100;
      invoice.totalAmount = invoice.subTotal + invoice.gstAmount;
      invoice.remainingAmount = invoice.totalAmount - invoice.paidAmount;
    }

    if (client) invoice.client = client;
    if (project) invoice.project = project;
    if (gst) invoice.gst = gst;
    if (dueDate) invoice.dueDate = dueDate;
    if (status) invoice.status = status;

    await invoice.save();
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE invoice
export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await InvoiceA.findByIdAndDelete(req.params.id);
    if (!invoice) return res.status(404).json({ error: "Invoice not found" });
    res.json({ message: "Invoice deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADD note/payment
export const applyNote = async (req, res) => {
  try {
    const { type, amount, method,client,project } = req.body;

    // Allowed enums
    const allowedTypes = ["credit", "debit", "advance", "payment"];
    const allowedMethods = ["NEFT", "UPI", "Cash", "Cheque"];

    // Validate type
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ error: `Invalid type. Allowed: ${allowedTypes.join(", ")}` });
    }

    // Validate amount
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ error: "Amount must be a positive number" });
    }

    // Normalize method
    const normalizedMethod = method.charAt(0).toUpperCase() + method.slice(1).toLowerCase();
    if (!allowedMethods.includes(normalizedMethod)) {
      return res.status(400).json({ error: `Invalid method. Allowed: ${allowedMethods.join(", ")}` });
    }

    // Find invoice
    const invoice = await InvoiceA.findById(req.params.id);
    if (!invoice) return res.status(404).json({ error: "Invoice not found" });

    // Initialize notes array
    if (!invoice.notes) invoice.notes = [];

    // Add note/payment
    invoice.notes.push({ type, amount: numAmount, method: normalizedMethod, date: new Date(), client:invoice.client,    // Invoice se le lo
    project: invoice.project,});

    // Update amounts
    if (type === "credit" || type === "advance" || type === "payment") {
      invoice.paidAmount += numAmount;
    } else if (type === "debit") {
      invoice.totalAmount += numAmount;
    }

    // Update remaining amount
    invoice.remainingAmount = invoice.totalAmount - invoice.paidAmount;

    // Update status
    if (invoice.remainingAmount <= 0) invoice.status = "paid";
    else if (invoice.paidAmount > 0) invoice.status = "partial";
    else invoice.status = "unpaid";

    await invoice.save();
    res.json(invoice);

  } catch (err) {
    console.error("Apply Note Error:", err);
    res.status(500).json({ error: err.message });
  }
};


export const InvoicePayment = async (req, res) => {
  try {
    const invoiceId = req.params.id;

    // Fetch invoice from DB
    const invoice = await InvoiceA.findById(invoiceId);
    if (!invoice) return res.status(404).send("Invoice not found");

    // Convert Mongoose doc to plain object
    const invoiceData = invoice.toObject();

    // Dynamically calculate totals
    invoiceData.subTotal = invoiceData.items?.reduce(
      (sum, item) => sum + item.quantity * item.rate,
      0
    ) || 0;

    invoiceData.gstAmount = invoiceData.gst
      ? (invoiceData.subTotal * invoiceData.gst) / 100
      : 0;

    invoiceData.totalAmount = invoiceData.subTotal + invoiceData.gstAmount;

    // Use `notes` for payments if your schema uses `notes` to store payment entries
    invoiceData.paidAmount = invoiceData.notes?.reduce(
      (sum, note) => sum + (note.type === "credit" ? note.amount : 0),
      0
    ) || 0;

    invoiceData.remainingAmount = invoiceData.totalAmount - invoiceData.paidAmount;

    // Determine status if not already set
    invoiceData.status = invoiceData.remainingAmount <= 0 ? "paid" : "pending";

    console.log(invoiceData, "invoice data");

    // Generate HTML
    const html = generateInvoiceHTML(invoiceData);

    // Launch Puppeteer browser
    const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20px", bottom: "20px", left: "20px", right: "20px" },
    });

    await browser.close();

    // Send PDF as response
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`
    );
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error generating PDF");
  }
};

export const DashboardSummary = async (req, res) => {
  try {
    const invoices = await InvoiceA.find(); // sab invoices fetch

    const totalAmount = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
    const totalPaid = invoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);
    const totalRemaining = invoices.reduce((sum, inv) => sum + (inv.remainingAmount || 0), 0);

    res.json({
      totalAmount,
      totalPaid,
      totalRemaining,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
}


 export const SMSREmainder=async (req, res) => {
    try {
        await sendPaymentReminders();
        res.json({ message: "Payment reminders sent successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
