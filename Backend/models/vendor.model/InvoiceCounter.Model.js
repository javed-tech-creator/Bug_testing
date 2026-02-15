import mongoose from "mongoose";

const invoiceCounterSchema = new mongoose.Schema(
  {
    year: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ya aapka vendor model
      required: true,
    },
    seq: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Unique index to prevent duplicate sequence for same vendor in same year
invoiceCounterSchema.index({ year: 1, createdBy: 1 });

const InvoiceCounterModel = mongoose.model("VendorModuleInvoiceCounter", invoiceCounterSchema);

export default InvoiceCounterModel;
