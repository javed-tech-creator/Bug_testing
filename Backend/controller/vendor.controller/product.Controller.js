import mongoose from "mongoose";
import productModel from "../../models/vendor.model/product.Model.js";
import ApiError from "../../utils/master/ApiError.js";
// import { createAndEmit } from "../../util/vendor/notification.js";

// Create new product
export const createProduct = async (req, res, next) => {
  try {
    const {
      productName,
      productCode,
      brand,
      unitType,
      size,
      inStock,
      gstPercent,
      rateUnit,
      description,
      category,
    } = req.body;


    // 2 Create new product
    const newProduct = new productModel({
      productName,
      productCode,
      brand,
      unitType,
      size,
      inStock,
      totalStock: inStock, // by default = inStock
      gstPercent,
      rateUnit,
      description,
      category,
      importedBy: req.user._id,
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: " Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    next(error);
  }
};


//create new data in Bulk
export const bulkImportProducts = async (req, res, next) => {
  try {
    const products = req.body;

    if (!Array.isArray(products) || products.length === 0) {
       return next(new ApiError(400, "No products provided for import."));

    }

    //  Attach importedBy from logged-in vendor
    const vendorId = req.user._id;
    const productsWithVendor = products.map((p) => ({
      ...p,
      importedBy: vendorId,
      totalStock: p.inStock || 0,
    }));

    //  Check for duplicate product codes in DB
    const codes = productsWithVendor.map((p) => p.productCode);
    const existing = await productModel.find({
      importedBy: vendorId,
      productCode: { $in: codes },
    }).select("productCode");

    if (existing.length > 0) {
      const existingCodes = existing.map((e) => e.productCode);
             return next(new ApiError(400, `${existingCodes} product codes already exist.`));

    }

    //  Insert products
    await productModel.insertMany(productsWithVendor);

    res.status(201).json({
      success: true,
      message: `${productsWithVendor.length} products imported successfully.`,
    });
  } catch (error) {
    next(error)
    }
};



//  Get all products for the logged-in vendor
export const getProducts = async (req, res, next) => {
  try {
    // Ensure user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // Fetch products for this vendor
    const products = await productModel.find({ importedBy: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: [...products]
    });
  } catch (error) {
   next(error)
  }
};

//  Get Single Product by ID
export const getProductById = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const { id } = req.params;

    // Find product belonging to this vendor
    const product = await productModel.findOne({
      _id: id,
      importedBy: req.user._id, // ensure vendor can only access his product
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

// for delete db data 
// export const getProducts = async (req, res) => {
//   try {
//     // Ensure user is authenticated
//     if (!req.user || !req.user._id) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized access",
//       });
//     }

//     //  Delete all products of this vendor before fetching
//     await productModel.deleteMany({ importedBy: req.user._id });

//     // Now fetch (this will return empty array because sab delete ho gaya)
//     const products = await productModel.find({ importedBy: req.user._id }).sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       message: "Products deleted & fetched successfully",
//       data: products,
//     });
//   } catch (error) {
//     console.error(" Error in getProducts:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to delete & fetch products",
//       error: error.message,
//     });
//   }
// };

// import productModel from "../models/productModel.js";
// import orderModel from "../models/orderModel.js"; // import your order model

// export const getProducts = async (req, res) => {
//   try {
//     const vendorId = req.user._id;

//     // 1. Fetch all products for this vendor
//     const products = await productModel.find({ importedBy: vendorId });

//     // 2. Extract product IDs
//     const productIds = products.map(p => p._id);

//     // 3. Fetch all related orders with status != pending
//     const relevantOrders = await orderModel.find({
//       productId: { $in: productIds },
//       status: { $in: ["dispatched", "completed"] }
//     });

//     // 4. Prepare a map to count used stock per product
//     const usedStockMap = {};

//     for (const order of relevantOrders) {
//       const id = order.productId.toString();
//       const qty = order.quantity || 0;

//       usedStockMap[id] = (usedStockMap[id] || 0) + qty;
//     }

//     // 5. Prepare final product response
//     const finalData = products.map(product => {
//       const usedStock = usedStockMap[product._id.toString()] || 0;
//       const inStock = product.stock - usedStock;

//       return {
//         productCode: product.productCode,
//         productName: product.productName,
//         brand: product.brand,
//         unitType: product.unitType,
//         size: product.size,
//         stock: product.stock,
//         usedstock: usedStock,
//         instock: inStock,
//         rateUnit: product.rateUnit,
//         description: product.description
//       };
//     });

//     res.status(200).json(finalData);
//   } catch (error) {
//     console.error("Error in getProducts:", error);
//     res.status(500).json({ message: "Failed to fetch products", error: error.message });
//   }
// };


// Update Product by ID



export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params; // Product ID
    const updateFields = req.body;

    //  Validate MongoDB ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new ApiError(400, "Invalid product ID format"));
          }

    // Find the product first
    const product = await productModel.findOne({
      _id: id,
      importedBy: req.user._id,
    });

    if (!product) {
          return next(new ApiError(404, "Product not found or unauthorized"));
    }

     //  Duplicate check (only if productCode is being updated)
    if (updateFields.productCode) {
      const existingProduct = await productModel.findOne({
        _id: { $ne: id }, // exclude current product
        importedBy: req.user._id,
        productCode: { $regex: new RegExp(`^${updateFields.productCode}$`, "i") }, // case-insensitive
      });

      if (existingProduct) {
        return next(
          new ApiError(
            400,
            `Product with code "${updateFields.productCode}" already exists for this vendor`
          )
        );
      }
    }

    // Optional: limit fields that can be updated
    const allowedFields = [
      "productName",
      "productCode",
      "brand",
      "unitType",
      "size",
      "rateUnit",
      "gstPercent",
      "description",
      "category",
    ];

    // Prepare update object
    const updates = {};

    for (const key of allowedFields) {
      if (updateFields[key] !== undefined) {
        updates[key] = updateFields[key];
      }
    }

    // Handle `inStock` update logic
    if (updateFields.inStock !== undefined) {
      const addedStock = Number(updateFields.inStock);
      if (isNaN(addedStock)) {
                  return next(new ApiError(400, "Invalid stock value"));

      }

      //  Add new stock to existing inStock
      const newInStock = product.inStock + addedStock;

      updates.inStock = newInStock;

      //  Recalculate totalStock = instock + usedStock
      updates.totalStock = newInStock + (product.usedStock || 0);
    }

    //  Update the product with validation enabled
    const updatedProduct = await productModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true, //  Very Important for schema validation
      context: "query",    //  Needed for some validators
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    next(error); // global error handler
  }
};


//delete api product

//  Delete Product by ID
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ApiError(400, "Invalid product ID format"));
    }

    // Find and delete product that belongs to this vendor
    const deletedProduct = await productModel.findOneAndDelete({
      _id: id,
      importedBy: req.user._id,
    });

    if (!deletedProduct) {
      return next(new ApiError(404, "Product not found or unauthorized"));
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (error) {
    next(error);
  }
};
