// Example: paymentRoutes.js
import express from "express";
import {uploadChallan } from "../../../controller/accounts/vendorTaxs/challanController.js";

 
const challanRoute = express.Router();
import multer from "multer";
const upload = multer({ dest: "temp/" });
// ✅ single file upload
challanRoute.post("/uploadchallan", upload.single("file"), uploadChallan);

export default challanRoute;
