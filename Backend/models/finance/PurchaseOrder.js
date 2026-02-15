import mongoose from 'mongoose';

const poSchema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
  poNumber: { type: String, required: true, unique: true },
  description: String,
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ["Open", "Closed"], default: "Open" }
}, { timestamps: true });
const PurchaseOrder = mongoose.models.PurchaseOrder || mongoose.model('PurchaseOrder', poSchema);

export default PurchaseOrder;
