import mongoose from "mongoose";

const invoiceItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  rateUnit: { type: Number, required: true },
  netAmount: { type: Number, required: true },
  netAmountAfterDiscount: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  taxRates: {
    cgst: { type: Number, default: 0 },
    sgst: { type: Number, default: 0 },
    igst: { type: Number, default: 0 },
  },
  taxPrice: { type: Number, default: 0 },
  priceWithTax: { type: Number, default: 0 }
});

const invoiceSchema = new mongoose.Schema(
  {
    invoiceId: { type: String, required: true, unique: true },
    number: { type: String, required: true, unique: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    quotation: { type: mongoose.Schema.Types.ObjectId, ref: "Quotation" },
    items: [invoiceItemSchema],
    status: { type: String, enum: ["Unpaid", "Paid", "Partially Paid"], default: "Unpaid" },
    subTotal: { type: Number, required: true },
    totalNetAmount: { type: Number, required: true },
    totalNetAmountAfterDiscount: { type: Number, required: true },
    totalDiscount: { type: Number, default: 0 },
    totalTaxAmount: { type: Number, default: 0 },

    // ✅ GST Totals added
    totalCGST: { type: Number, default: 0 },
    totalSGST: { type: Number, default: 0 },
    totalIGST: { type: Number, default: 0 },
    totalGSTPercent: { type: Number, default: 0 },
    invoiceDate: { type: Date, default: Date.now },

    taxes: { type: Object, default: {} },
    shippingCharges: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    total: { type: Number, required: true },
    amountPaid: { type: Number, default: 0 },
    partialPaid: { type: Number, default: 0 },
    paymentStatus: { type: String, default: "Pending" },
    paymentMode: { type: String, default: "Pending" },
    issuedAt: { type: Date, default: Date.now },
    notes: { type: String, default: "" }
  },
  { timestamps: true }
);

mongoose.models = {};
const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;


// import mongoose from "mongoose";

// const InvoiceSchema = new mongoose.Schema({
//   invoiceId: { type: String, required: true, unique: true },
//   number: { type: String, required: true },
//   client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
//   project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
//   quotation: { type: mongoose.Schema.Types.ObjectId, ref: "Quotation" },
//   invoiceDate: { type: Date, default: Date.now },

//   items: [
//     {
//       productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
//       productName: String,
//       quantity: Number,
//       rateUnit: Number,
//       netAmount: Number,
//       discount: Number,
//       netAmountAfterDiscount: Number,
//       taxPrice: Number,
//       gstPercent: Number,
//       priceWithTax: Number,
//       taxRates: {
//         cgst: Number,
//         sgst: Number,
//         igst: Number,
//       },
//     },
//   ],

//   subTotal: { type: Number, default: 0 },
//   totalNetAmount: { type: Number, default: 0 },
//   totalNetAmountAfterDiscount: { type: Number, default: 0 },
//   totalDiscount: { type: Number, default: 0 },
//   totalTaxAmount: { type: Number, default: 0 },

//   // ✅ GST breakdown
//   totalCGST: { type: Number, default: 0 },
//   totalSGST: { type: Number, default: 0 },
//   totalIGST: { type: Number, default: 0 },
//   totalGSTPercent: { type: Number, default: 0 },

//   shippingCharges: { type: Number, default: 0 },
//   grandTotal: { type: Number, default: 0 },
//   total: { type: Number, default: 0 },

//   taxes: { type: Object, default: {} },

//   amountPaid: { type: Number, default: 0 },
//   partialPaid: { type: Number, default: 0 },
//   paymentStatus: { type: String, default: "Pending" },
//   paymentMode: { type: String, default: "Pending" },
//   issuedAt: { type: Date, default: Date.now },
//   notes: { type: String, default: "" },

//   sendSMS: { type: Boolean, default: false },
//   paymentHistory: { type: Array, default: [] },
// }, { timestamps: true });

// const Invoice = mongoose.models.Invoice || mongoose.model("Invoice", InvoiceSchema);

// export default Invoice;