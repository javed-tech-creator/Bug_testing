import express from "express";

import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  softDeleteProduct,
  hardDeleteProduct,
} from "../../controllers/product.controller.js";
import Upload from "../../../../middlewares/master/multer.middleware.js";
import { fileValidator } from "../../../../middlewares/master/fileValidator.middleware.js";

const router = express.Router();

router.post(
  "/",
  Upload("image").fields([{ name: "productImage", maxCount: 1 }]),
  fileValidator({ types: ["image"], maxSizeMB: 5 }),
  createProduct
); // Create
router.get("/", getAllProducts); // Read All
router.get("/:id", getProductById); // Read One
router.put(
  "/:id",
  Upload("image").fields([{ name: "productImage", maxCount: 1 }]),
  fileValidator({ types: ["image"], maxSizeMB: 5 }),
  updateProduct
); // Update
router.delete("/:id", softDeleteProduct); // Delete
router.delete("/hard/:id", hardDeleteProduct); // Delete

export default router;
