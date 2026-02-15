 
import Ledger from "../../models/finance/ledger.js";
import Expense2 from "../../models/finance/expence/expence.js";
import Client from "../../models/finance/Client.js";
import Vendor from "../../models/finance/vendor.js";
import XLSX from "xlsx"; 
import path from "path";
import fs from "fs";
import PDFDocument from "pdfkit-table";
 

// ===================== CREATE LEDGER =====================
export const createLedger = async (req, res) => {
  try {
    const { clientId, vendorId, ...rest } = req.body;

    const ledger = new Ledger({
      client: clientId || null,
      vendor: vendorId || null,
      ...rest
    });

    await ledger.save();
    res.status(201).json({ success: true, data: ledger });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// ===================== DELETE LEDGER =====================
export const deleteLedger = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLedger = await Ledger.findByIdAndDelete(id);

    if (!deletedLedger)
      return res.status(404).json({ success: false, message: "Ledger not found" });

    res.status(200).json({ success: true, message: "Ledger deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ===================== GET LEDGERS =====================
export const getLedgers = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};

    const ledgers = await Ledger.find(filter)
      .populate("client", "name")
      .populate("vendor", "name")
      .sort({ date: -1 });

    res.json({ success: true, data: ledgers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ===================== GET LEDGERS BY TYPE (optional) =====================
export const getLedgerByType = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};

    const ledgers = await Ledger.find(filter)
      .populate("client", "name")
      .populate("vendor", "name")
      .sort({ date: -1 });

    res.json({ success: true, data: ledgers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ===================== GET CLIENTS =====================
export const getClients = async (req, res) => {
  try {
    const clients = await Client.find({}, "_id name");
    res.json({ success: true, data: clients });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ===================== GET VENDORS =====================
export const getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({}, "_id name");
    res.json({ success: true, data: vendors });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ===================== OUTSTANDING =====================
 
export const getOutstanding = async (req, res) => {
  try {
    const credit = await Ledger.aggregate([
      { $match: { type: "collection" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const payoutLedger = await Ledger.aggregate([
      { $match: { type: "payout" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const expense = await Expense2.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const totalDebit = (payoutLedger[0]?.total || 0) + (expense[0]?.total || 0);

    res.json({
      success: true,
      totalCredit: credit[0]?.total || 0,
      totalDebit: totalDebit,
      balance: (credit[0]?.total || 0) - totalDebit,
      totalExpense: expense[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===================== DASHBOARD =====================
export const getDashboard = async (req, res) => {
  try {
    const totalCollection = await Ledger.aggregate([
      { $match: { type: "collection" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalPayout = await Ledger.aggregate([
      { $match: { type: "payout" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalExpense = await Ledger.aggregate([
      { $match: { type: "expense" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    res.json({
      success: true,
      totalCollection: totalCollection[0]?.total || 0,
      totalPayout: totalPayout[0]?.total || 0,
      totalExpense: totalExpense[0]?.total || 0
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ===================== EXPENSE REPORTS =====================
export const getExpenseReports = async (req, res) => {
  try {
    const { category, startDate, endDate } = req.query;

    let filter = {};

    if (category) {
      filter.category = category;
    }

    if (startDate && endDate) {
      filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate) {
      filter.createdAt = { $gte: new Date(startDate) };
    } else if (endDate) {
      filter.createdAt = { $lte: new Date(endDate) };
    }

    const expenses = await Expense2.find(filter).sort({ createdAt: -1 });

    res.json({ success: true, data: expenses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===================== EXPORT PLACEHOLDERS =====================

export const exportExcel = async (req, res) => {
  try {
    const ledgers = await Ledger.find()
      .populate("client", "name")
      .populate("vendor", "name")
      .sort({ date: -1 });

    if (!ledgers.length) {
      return res.status(404).json({ success: false, message: "No ledger data found" });
    }

    // Data convert
    const data = ledgers.map(l => ({
      Client: l.client?.name || "-",
      Vendor: l.vendor?.name || "-",
      Category: l.category || "-",
      Department: l.department || "-",
      Amount: l.amount,
      Type: l.type,
      Status: l.status,
      Description: l.description || "-",
      Date: l.date ? l.date.toISOString().split("T")[0] : "-"
    }));

    // Workbook + Sheet
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ledger Report");

    // Buffer me convert
    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    // Headers set (inline view)
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "inline; filename=Ledger_Report.xlsx");

    // Send buffer
    res.send(buffer);

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
// ===================== EXPORT PDF =====================


export const exportPDF = async (req, res) => {
  try {
    const ledgers = await Ledger.find({})
      .populate("client", "name")
      .populate("vendor", "name")
      .sort({ date: -1 });

    if (!ledgers.length) {
      return res.status(404).json({ success: false, message: "No ledger data found" });
    }

    const doc = new PDFDocument({ margin: 30, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=Ledger_Report.pdf");

    doc.pipe(res);

    // Title
    doc.fontSize(18).text("Ledger Report", { align: "center" });
    doc.moveDown(2);

    // Table data
    const table = {
      headers: [
        "Date",
        "Client",
        "Vendor",
        "Category",
        "Department",
        "Amount",
        "Type",
        "Status",
        "Description",
      ],
      rows: ledgers.map((l) => [
        new Date(l.date).toLocaleDateString(),
        l.client?.name || "-",
        l.vendor?.name || "-",
        l.category || "-",
        l.department || "-",
        l.amount,
        l.type,
        l.status,
        l.description || "-",
      ]),
    };

    await doc.table(table, { width: 530 });

    doc.end();
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};



export const updateLedger = async (req, res) => {
  try {
    const { id } = req.params;
    const { clientId, vendorId, ...rest } = req.body;

    const updatedLedger = await Ledger.findByIdAndUpdate(
      id,
      {
        client: clientId || null,
        vendor: vendorId || null,
        ...rest
      },
      { new: true } // return updated document
    );

    if (!updatedLedger)
      return res.status(404).json({ success: false, message: "Ledger not found" });

    res.status(200).json({ success: true, data: updatedLedger });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};