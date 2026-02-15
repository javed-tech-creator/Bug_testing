import mongoose from "mongoose";

const productCategorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      match: [/^[a-zA-Z0-9\s\-]+$/, "Invalid category name"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Vendor-wise, case-insensitive unique check
productCategorySchema.pre("save", async function (next) {
  if (this.isModified("categoryName")) {
    const Model = this.constructor; // SAFE MODEL ACCESS

    const existing = await Model.findOne({
      categoryName: { $regex: new RegExp(`^${this.categoryName}$`, "i") },
      createdBy: this.createdBy,
    });

    if (existing) {
      return next(new Error("Category name must be unique (case-insensitive)"));
    }
  }
  next();
});

const ProductCategoryModel = mongoose.model(
  "ProductCategory",
  productCategorySchema
);

export default ProductCategoryModel;
