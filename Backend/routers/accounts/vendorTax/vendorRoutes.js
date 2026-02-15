 
import express from "express";
import  * as Vender from "../../../controller/accounts/vendorTaxs/vendorController.js";
const VenderRoute = express.Router();

VenderRoute.post("/",Vender.createVendor);
VenderRoute.get("/", Vender.getVendors );
VenderRoute.get("/:id", Vender.getVendorById);
VenderRoute.put("/:id", Vender.updateVendor );
VenderRoute.delete("/:id",Vender.deleteVendor );
 

export default VenderRoute;
