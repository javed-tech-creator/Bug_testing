 
import express from "express";
import {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  updatePaymentStage,
  getVendorLedger
} from '../../controller/finance/venderpaymentController.js';

const paymentRoute = express.Router();

paymentRoute.post("/", createPayment);
paymentRoute.get("/", getPayments);
paymentRoute.get("/:id", getPaymentById);
paymentRoute.put("/:id", updatePayment);
paymentRoute.delete("/:id", deletePayment);
paymentRoute.patch("/:id/stage", updatePaymentStage);
paymentRoute.get("/ledger/:vendorId", getVendorLedger);

export default paymentRoute;