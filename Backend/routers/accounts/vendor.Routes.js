import express from "express";
import {
  createVendor,
  getVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
} from "../../controller/accounts/vendor.controller.js";

const vendorR = express.Router();

vendorR.post("/", createVendor);         
vendorR.get("/", getVendors);            
vendorR.get("/:id", getVendorById);     
vendorR.put("/:id", updateVendor);       
vendorR.delete("/:id", deleteVendor);    

export default vendorR;
