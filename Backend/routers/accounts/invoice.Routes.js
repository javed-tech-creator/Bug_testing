import express from "express";
import {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  applyNote,
  InvoicePayment,
  DashboardSummary,
  getClientLedger,
  SMSREmainder
} from "../../controller/accounts/invoice.controller.js";

const InvoiceRoute = express.Router();

InvoiceRoute.get("/dashboardsummary",DashboardSummary)
InvoiceRoute.post("/", createInvoice);
InvoiceRoute.get("/", getInvoices);
InvoiceRoute.get("/:id", getInvoiceById);
InvoiceRoute.put("/:id", updateInvoice);
InvoiceRoute.delete("/:id", deleteInvoice);
InvoiceRoute.post("/:id/note", applyNote);
InvoiceRoute.get("/:id/pdf",InvoicePayment) 
InvoiceRoute.post('/remainder',SMSREmainder)
InvoiceRoute.get('/getClientLedger',getClientLedger)


export default InvoiceRoute;
