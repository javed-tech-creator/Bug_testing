import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productCode: {
      type: String,
      required: [true, "Product code is required"],
      trim: true,
      minlength: [2, "Product code must be at least 2 characters"],
      maxlength: [20, "Product code cannot exceed 20 characters"],
      match: [
        /^[A-Za-z0-9\-]+$/,
        "Product code must be alphanumeric (letters, numbers, -) only",
      ],
      set: (v) => v.toUpperCase(), // Always store as uppercase
    },
    productName: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [2, "Product name must be at least 2 characters"],
      maxlength: [50, "Product name cannot exceed 50 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      minlength: [2, "Category must be at least 2 characters"],
      maxlength: [30, "Category cannot exceed 30 characters"],
    },
    brand: {
      type: String,
      required: [true, "brand name is required"],
      trim: true,
      maxlength: [50, "Brand cannot exceed 50 characters"],
    },
    size: {
      type: String,
      required: [true, "size  is required"],
      trim: true,
      maxlength: [30, "Size cannot exceed 30 characters"],
    },
    unitType: {
      type: String,
      required: [true, "Unit type is required"],
      trim: true,
      minlength: [1, "Unit type must not be empty"],
      maxlength: [20, "Unit type cannot exceed 20 characters"],
    },
    inStock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      max: [10000000, "Stock cannot exceed 1000000 units"],
    },
    rateUnit: {
      type: Number,
      required: [true, "Rate per unit is required"],
      min: [0, "Rate cannot be negative"],
      max: [1000000, "Rate per unit cannot exceed 1,000,000"],
    },
    gstPercent: {
      type: Number,
      required: [true, "GST percent is required"],
      enum: {
        values: [0, 5, 12, 18, 28],
        message: "GST percent must be one of 0, 5, 12, 18, 28",
      },
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    lowStockThreshold: {
      type: Number,
      default: 50,
      min: [0, "Threshold cannot be negative"],
      max: [10000000, "Threshold cannot exceed 10000000"],
    },
    usedStock: {
      type: Number,
      default: 0, // no validation here
    },
    totalStock: {
      type: Number,
      default: 0,
      min: [0, "Total stock cannot be negative"],
      max: [10000000, "Total stock cannot exceed 10000000"],
    },
    importedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "ImportedBy (user) is required"],
    },
  },
  { timestamps: true }
);

// Index for vendor-specific queries
productSchema.index({ importedBy: 1 });

const productModel = mongoose.model("Product", productSchema);
export default productModel;
