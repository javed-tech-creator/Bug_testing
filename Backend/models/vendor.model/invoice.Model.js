// models/invoice.model.js
import mongoose from "mongoose";


const paymentHistorySchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    mode: { 
      type: String, 
      enum: ["Cash", "UPI", "Card", "Net Banking", "Cheque",], 
      required: true 
    },
    date: { type: Date, default: Date.now },
    notes: { type: String, default: "" },
     sendSMS: { type: Boolean, default: false }, // default false


  },
  { _id: false }
);


const invoiceSchema = new mongoose.Schema(
  {
     // Custom Invoice ID
    invoiceId: { type: String, required: true},
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        productName: { type: String, required: true },
        quantity: { type: Number, required: true },
        rateUnit: { type: Number, required: true },
        netAmount: { type: Number, required: true },
        netAmountAfterDiscount: { type: Number, required: true },
        taxPrice: { type: Number, default: 0 },
         gstPercent: {type: Number,default: 0,validate: { validator: function (v) {  return [0, 5, 12, 18, 28].includes(v);},
    message: props => `${props.value} is not a valid GST percent`
  }
},
        discount: { type: Number, default: 0 },
        priceWithTax: { type: Number, default: 0 },
      },
    ],
    gst: { type: Number, default: 0 },

    // Totals
    totalNetAmount: { type: Number, required: true },
    totalNetAmountAfterDiscount: { type: Number, required: true },
    totalDiscount: { type: Number, default: 0 },
    totalTaxAmount: { type: Number, default: 0 },
    globalDiscount: { type: Number, default: 0 },
    globalDiscountType: { type: String, default: "" },

    // Round-off
    roundOff: { type: Boolean, default: false },
    roundOffAmount: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },

    // Payment
    amountPaid: { type: Number, default: 0 },
    partialPaid: { type: Number, default: 0 },
    paymentStatus: { 
      type: String, 
      enum: ["Pending", "Paid", "Partial"], 
      default: "Pending" 
    },
    paymentMode: { 
      type: String, 
      enum: ["Cash", "UPI", "Card", "Net Banking", "Cheque","Pending"], 
      default: "Pending" 
    },

      // ✅ Payment History (installments tracking)
    paymentHistory: [paymentHistorySchema],

    // Dates
    invoiceDate: { type: Date, required: true },
    dueDate: { type: Date },

     // ✅ New fields with default
    paymentDate: { type: Date, default: null }, // by default empty
    notes: { type: String, trim: true, default: "" }, // default empty string
    sendSMS: { type: Boolean, default: false }, // default false

  // bank details id 
    bankDetailId: { type: mongoose.Schema.Types.ObjectId, ref: "Bank" },
  // Branch
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer",required:true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  
  },
  { timestamps: true }
);

// Add index
invoiceSchema.index({ createdBy: 1, createdAt: 1 });
invoiceSchema.index({ createdBy: 1, paymentStatus: 1 });
const invoiceModel = mongoose.model("VendorModuleInvoice", invoiceSchema);

export default invoiceModel;