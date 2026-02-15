// routes/vendor.routes.js
import express from "express";
import { checkRole } from "../../../middlewares/asset.middleware/authMiddlware.js";
import { createVendor, deleteVendor, getVendors, updateVendor } from "../../../controller/technology/vendormanagement.controller.js";

const vendorManagementRouter = express.Router();

//  secure routes with token + role check
vendorManagementRouter.post("/add",  createVendor);
vendorManagementRouter.get("/get",  getVendors);
vendorManagementRouter.put("/update/:id",   updateVendor);
vendorManagementRouter.delete("/delete/:id",   deleteVendor);
// router.get("/:id",  checkRole(["Admin", "Manager", "Employee"]), getVendorById);


export default vendorManagementRouter;
