import ApiError from "../../../utils/master/ApiError.js";
import {
  uploadFiles,
  deleteFile,
  deleteLocalFile,
} from "../../../utils/master/cloudinary.js";
import AdminProduct from "../models/product.model.js";

//  Create Product
export const createProduct = async (req, res, next) => {
  const uploadedFiles = [];

  try {
    // --- Basic Validation ---
    const { title, description, alias } = req.body;

    if (!title || title.trim() === "") {
      return next(new ApiError(400, "Product title is required"));
    }

    // Optional: prevent duplicate product by same title
    const existingProduct = await AdminProduct.findOne({
      title: { $regex: new RegExp(`^${title}$`, "i") },
    });

    if (existingProduct) {
      return next(
        new ApiError(400, "A product with this title already exists")
      );
    }

    // Find the last product (sorted by descending numeric part of productId)
    const lastProduct = await AdminProduct.findOne({})
      .sort({ createdAt: -1 }) // latest created first
      .lean();

    let newProductId = "PRD001";

    if (lastProduct?.productId) {
      // Extract numeric part from productId, e.g., PRD005 => 5
      const lastIdNum = parseInt(lastProduct.productId.replace("PRD", ""), 10);
      const nextIdNum = lastIdNum + 1;
      newProductId = `PRD${String(nextIdNum).padStart(3, "0")}`;
    }

    // --- Initialize Product ---
    const product = new AdminProduct({
      productId: newProductId,
      title: title.trim(),
      description: description?.trim() || "",
      alias: alias?.trim() || "",
    });

    // --- Handle Product Image Upload ---
    if (req.files?.productImage && req.files.productImage[0]) {
      let result;

      if (process.env.USE_CLOUDINARY === "true") {
        // Cloud Upload
        result = await uploadFiles([req.files.productImage[0]]);

        if (!result.success || !result.files?.[0]?.url) {
          return next(new ApiError(400, "Unable to upload product image"));
        }
      } else {
        // Local Upload (Fallback)
        const localPath = req.files.productImage[0]?.path?.replace(/\\/g, "/");

        result = {
          success: true,
          files: [
            {
              url: localPath,
              public_url: null,
              public_id: null,
            },
          ],
        };
      }

      const photoData = result.files[0];
      uploadedFiles.push(photoData);
      product.productImage = photoData;
    }

    // --- Save Product to Database ---
    await product.save();

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (err) {
    console.error("Error creating product:", err.message);

    // --- Rollback Uploaded Files if Save Failed ---
    for (const file of uploadedFiles) {
      try {
        if (file?.public_id) await deleteFile(file.public_id);
        if (file?.url) await deleteLocalFile(file.url);
      } catch {
        // ignore cleanup errors
      }
    }

    return next(new ApiError(500, err?.message || "Internal Server Error"));
  }
};

//  Get All Products
export const getAllProducts = async (req, res, next) => {
  try {
    const products = await AdminProduct.aggregate([
      {
        $match: { isDeleted: false },
      },
      {
        $lookup: {
          from: "productworks", // ProductWork collection ka actual name (lowercase plural)
          localField: "_id", // AdminProduct _id
          foreignField: "productId", // ProductWork me productId
          as: "matchedWork",
        },
      },
      {
        $addFields: {
          isWork: {
            $cond: {
              if: { $gt: [{ $size: "$matchedWork" }, 0] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $project: {
          matchedWork: 0, // unnecessary data hide
          updatedAt: 0,
          deletedAt: 0,
          deletedBy: 0,
          isDeleted: 0,
          "productImage.public_id": 0,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    const count = products.length;

    res.status(200).json({
      success: true,
      message: `${count} product(s) found`,
      count,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return next(new ApiError(500, error?.message || "Internal Server Error"));
  }
};


//  Get Single Product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await AdminProduct.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    res.status(200).json({ success: true, message:"Single product data fetched successfully", data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//  Update Product

export const updateProduct = async (req, res, next) => {
  const uploadedFiles = [];

  try {
    const { title, description, alias } = req.body;
    const id = req.params.id;

    // --- Fetch existing product ---
    const product = await AdminProduct.findById(id);
    if (!product) {
      return next(new ApiError(404, "Product not found"));
    }

    // --- Validate title ---
    if (title && title.trim() === "") {
      return next(new ApiError(400, "Product title cannot be empty"));
    }

    // --- Prevent duplicate title ---
    if (title && title.trim() !== product.title) {
      const existingProduct = await AdminProduct.findOne({
        title: { $regex: new RegExp(`^${title.trim()}$`, "i") },
        _id: { $ne: id },
      });

      if (existingProduct) {
        return next(
          new ApiError(400, "A product with this title already exists")
        );
      }
    }

    // --- Handle Product Image Upload ---
    if (req.files?.productImage && req.files.productImage[0]) {
      let result;

      if (process.env.USE_CLOUDINARY === "true") {
        result = await uploadFiles([req.files.productImage[0]]);
        if (!result.success || !result.files?.[0]?.url) {
          return next(new ApiError(400, "Unable to upload product image"));
        }
      } else {
        const localPath = req.files.productImage[0]?.path?.replace(/\\/g, "/");
        result = {
          success: true,
          files: [
            {
              url: localPath,
              public_url: null,
              public_id: null,
            },
          ],
        };
      }

      const photoData = result.files[0];
      uploadedFiles.push(photoData);

      // --- Delete old image if exists ---
      if (product.productImage) {
        try {
          if (product.productImage.public_id)
            await deleteFile(product.productImage.public_id);
          if (product.productImage.url)
            await deleteLocalFile(product.productImage.url);
        } catch {
          // ignore cleanup errors
        }
      }

      product.productImage = photoData;
    }

    // --- Update fields ---
    if (title) product.title = title.trim();
    if (description !== undefined) product.description = description.trim();
    if (alias !== undefined) product.alias = alias.trim();

    // --- Save updated product ---
    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (err) {
    console.error("Error updating product:", err.message);

    // --- Rollback newly uploaded files if save failed ---
    for (const file of uploadedFiles) {
      try {
        if (file?.public_id) await deleteFile(file.public_id);
        if (file?.url) await deleteLocalFile(file.url);
      } catch {
        // ignore cleanup errors
      }
    }

    return next(new ApiError(500, err?.message || "Internal Server Error"));
  }
};

//  SOFT DELETE
export const softDeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await AdminProduct.findById(id);
    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    if (product.isDeleted)
      return res.status(400).json({
        success: false,
        message: "Product already soft deleted",
      });

    product.isDeleted = true;
    product.deletedAt = new Date();

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product soft deleted successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//  HARD DELETE
export const hardDeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await AdminProduct.findByIdAndDelete(id);

    if (!deleted)
      return res.status(404).json({
        success: false,
        message: "Product not found or already deleted",
      });

    res.status(200).json({
      success: true,
      message: "Product permanently deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
