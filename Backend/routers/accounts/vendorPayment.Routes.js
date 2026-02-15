import express from "express";
import { 
  createPayment, 
  getAllPayments, 
  getPaymentById, 
  updatePayment, 
  deletePayment 
} from "../../controller/accounts/vendor.Paymentcontroller.js";
const vendorPayment = express.Router();
import multer from "multer";
const upload = multer({ dest: "temp/" });
vendorPayment.post("/",createPayment);
vendorPayment.get("/", getAllPayments);
vendorPayment.get("/:id", getPaymentById);
vendorPayment.put("/:id",upload.array("proofs", 5),  updatePayment);
vendorPayment.delete("/:id", deletePayment);

export default vendorPayment;
