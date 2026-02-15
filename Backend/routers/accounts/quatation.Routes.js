import express from "express";
import {
  createQuotation,
  getQuotations,
  getQuotationById,
  updateQuotation,
  deleteQuotation,
  generateInvoice
} from "../../controller/accounts/quotation.controller.js";

const quatatione = express.Router();

quatatione.post("/", createQuotation);
quatatione.get("/get", getQuotations);
quatatione.get("/:id", getQuotationById);
quatatione.put("/:id", updateQuotation);
quatatione.delete("/:id", deleteQuotation);
quatatione.post("/:id/Account-invoice", generateInvoice);

export default quatatione;
