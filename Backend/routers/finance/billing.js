import express from "express";
// import auth from "../../middlewares/finance/auth.js";
import * as billing from "../../controller/finance/billingController.js";

const billingRoutes = express.Router();

// billingRoutes.use(auth);

// Quotation Routes
billingRoutes.post("/quotations", billing.createQuotation);
billingRoutes.put("/quotations/:id", billing.updateQuotation);
billingRoutes.get("/quotations", billing.listQuotations);
billingRoutes.get("/quotations/:id", billing.getQuotation);
billingRoutes.post("/quotations/:id/send", billing.sendQuotation);
billingRoutes.post("/quotations/:id/approve", billing.approveQuotation); 
billingRoutes.delete("/quotations/:id", billing.deleteQuotation);

// Invoice Routes
billingRoutes.get("/quatationinv", billing.listInvoices);
billingRoutes.get("/quatationinv/:id/pdf", billing.getInvoice);
billingRoutes.get("/quatationinv/:id", billing.getInvoicePDF);

export default billingRoutes;
