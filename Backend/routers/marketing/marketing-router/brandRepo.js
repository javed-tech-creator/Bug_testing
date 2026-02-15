import express from "express";
import {
  createBrand,
  getBrands,
  updateBrand,
  softDeleteBrand,
  hardDeleteBrand,
  getBrandCategoryCounts,
  getAll,
} from "../../../controller/marketing/brandRepo.controller.js"
import upload from "../../../middlewares/asset.middleware/uploadMedia.js";

const brandRepoRouter = express.Router(); 

brandRepoRouter.post("/add",upload.single("file"),  createBrand);          // Create brand repo
brandRepoRouter.get("/get", getBrands);             // Read all (except deleted)
brandRepoRouter.get("/get-category-count", getBrandCategoryCounts);  
brandRepoRouter.get("/get-all", getAll);       // Read all including deleted
brandRepoRouter.put("/update/:id",upload.single("file"), updateBrand);        // Update
brandRepoRouter.delete("/delete/:id", softDeleteBrand); // Soft delete
brandRepoRouter.delete("/delete-hard/:id", hardDeleteBrand); // Hard delete


export default brandRepoRouter;
