// models/invoiceDraftModel.js
import mongoose from "mongoose";

const invoiceItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", },
  productName: { type: String, },
  quantity: { type: Number, },
  rateUnit: { type: Number, },
  netAmount: { type: Number, },
  netAmountAfterDiscount: { type: Number, },
  taxPrice: { type: Number, },
   gstPercent: {type: Number,default: 0,validate: { validator: function (v) {  return [0, 5, 12, 18, 28].includes(v);},
    message: props => `${props.value} is not a valid GST percent`
  }
},
  discount: { type: Number, default: 0 },
  priceWithTax: { type: Number, },
});

const invoiceDraftSchema = new mongoose.Schema(
  {
     draftId: {
      type: String,
      required: true,
    },

    items: [invoiceItemSchema],
    grandTotal: { type: Number, },
    globalDiscount: { type: Number, default: 0 },
        globalDiscountType: { type: String, default: "" },
    invoiceDate: { type: Date, },
    dueDate: { type: Date, },
   bankDetailId: { type: mongoose.Schema.Types.ObjectId, ref: "Bank" },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, }, // Vendor/User
  },
  { timestamps: true }
);

invoiceDraftSchema.index({ createdBy: 1 });
const InvoiceDraft = mongoose.model("VendorModuleInvoicesDraft", invoiceDraftSchema);
export default InvoiceDraft