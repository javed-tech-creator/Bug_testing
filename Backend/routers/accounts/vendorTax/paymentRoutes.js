// Example: paymentRoutes.js
import express from "express";
import * as pay from "../../../controller/accounts/vendorTaxs/paymentController.js";
const PaymentRoute = express.Router();
import multer from "multer";
const upload = multer({ dest: "temp/" });
PaymentRoute.post("/", pay.createPayment);
PaymentRoute.get("/", pay.getPayments);
PaymentRoute.get("/:id", pay.getPaymentById);
PaymentRoute.put("/:id", upload.single("paymentProof"), pay.updatePayment);
PaymentRoute.delete("/:id", pay.deletePayment);
PaymentRoute.put("/approve/:id", pay.approvePayment);

export default PaymentRoute;
