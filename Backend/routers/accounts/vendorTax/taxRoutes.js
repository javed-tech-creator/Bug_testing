// Example: paymentRoutes.js
import express from "express";
import * as Tax from "../../../controller/accounts/vendorTaxs/taxController.js";
const TaxRoute = express.Router();

 
TaxRoute.get("/", Tax.getTaxRecords);
TaxRoute.get("/:id", Tax.getTaxRecordById ); 
TaxRoute.put("/:id", Tax.updateTaxRecord );
TaxRoute.delete("/:id", Tax.deleteTaxRecord );
 

export default TaxRoute;
