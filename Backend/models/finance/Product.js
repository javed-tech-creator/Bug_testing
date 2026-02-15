import mongoose from "mongoose";

const productDbSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  hsn_sac: String,
  taxable: { type: Boolean, default: true },
});


const ProductDbSchema = mongoose.models.ProductDbSchema || mongoose.model("ProductDbSchema", productDbSchema);

export default ProductDbSchema;
