import mongoose from "mongoose";

const SignageProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    alias: {
      type: String,
      required: false,
      trim: true,
    },
    productImage: {
      url: { type: String, default: null },
      public_url: { type: String, default: null },
      public_id: { type: String, default: null },
    },
    productId: {
      type: String,
      unique: true,
      index: true,
    },
    // Active/Inactive flag
    isActive: { type: Boolean, default: true },

    // --- Soft Delete Fields ---
    isDeleted: {
      type: Boolean,
      default: false,
      index: true, // optional: helps for queries like { isDeleted: false }
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Create and export model
const AdminProduct = mongoose.model("SignageProduct", SignageProductSchema);
export default AdminProduct;
