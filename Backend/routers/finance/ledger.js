import express from "express";
import * as ledgerController from "../../controller/finance/ledger.js";

const ledgerRoutes = express.Router();

 

// ===================== LEDGER ROUTES =====================
ledgerRoutes.post("/", ledgerController.createLedger);
ledgerRoutes.get("/", ledgerController.getLedgers); // can filter by ?type=
ledgerRoutes.get("/type", ledgerController.getLedgerByType); // optional
ledgerRoutes.delete("/del/:id", ledgerController.deleteLedger);
ledgerRoutes.put("/:id", ledgerController.updateLedger);

// ===================== CLIENT / VENDOR =====================
ledgerRoutes.get("/ledger/clients", ledgerController.getClients);
ledgerRoutes.get("/ledger/vendors", ledgerController.getVendors);

// ===================== EXPENSES =====================
ledgerRoutes.get("/expenses", ledgerController.getExpenseReports);

// ===================== OUTSTANDING / DASHBOARD =====================
ledgerRoutes.get("/outstanding", ledgerController.getOutstanding);
ledgerRoutes.get("/dashboard", ledgerController.getDashboard);

// ===================== EXPORT =====================
ledgerRoutes.get("/export/excel", ledgerController.exportExcel);
ledgerRoutes.get("/export/pdf", ledgerController.exportPDF);

export default ledgerRoutes;
 
 