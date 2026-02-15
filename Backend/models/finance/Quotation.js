import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  description: String,
  qty: { type: Number, default: 1 },
  rate: { type: Number, required: true },
  discount: { type: Number, default: 0 },  
  taxRates: {
    cgst: { type: Number, default: 0 },
    sgst: { type: Number, default: 0 },
    igst: { type: Number, default: 0 },
  },
});

const quotationSchema = new mongoose.Schema(
  {
    number: { type: String, required: true, unique: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    items: [itemSchema],
    status: {
      type: String,
      enum: ["Draft", "Sent", "Approved", "Rejected", "Pending"],
      default: "Draft",
    },
    shippingCharges: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    taxes: { type: Object, default: {} },
    subTotal: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    totalCGST: { type: Number, default: 0 },
    totalSGST: { type: Number, default: 0 },
    totalIGST: { type: Number, default: 0 },
    totalGSTPercent: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // 🔽 new fields added
    amountPaid: { type: Number, default: 0 },
    paymentType: { 
      type: String, 
      enum: ["Advance", "Partial", "Full"], 
      default: "Advance" 
    },
    paymentMode: { 
      type: String, 
      enum: ["UPI", "Cash", "Bank Transfer", "Cheque"], 
      default: "UPI" 
    },
    dueDate: { type: Date },
    paymentStatus:{type: String, required: true}

  },
  { timestamps: true }
);

const Quotation = mongoose.models.Quotation || mongoose.model("Quotation", quotationSchema);
export default Quotation;
