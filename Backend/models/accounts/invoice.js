import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    rate: { type: Number, required: true },
});

const noteSchema = new mongoose.Schema({
    type: { type: String, enum: ["credit", "debit", "advance", "payment"], required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    method: { type: String, enum: ["NEFT", "UPI", "Cash", "Cheque"] },
    client: { type: String },    
    project: { type: String },
});

const invoiceSchema = new mongoose.Schema({
    client: { type: String, required: true },
    clientPhone: { type: Number },
    clientEmail: { type: String, required: true },
    project: { type: String, required: true },
    items: [itemSchema],
    gst: { type: Number, required: true },
    subTotal: { type: Number, default: 0 },
    gstAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    remainingAmount: { type: Number, default: 0 },
    notes: [noteSchema],
    status: { type: String, enum: ["pending", "partial", "paid"], default: "pending" },
    dueDate: { type: Date },
    invoiceNumber: { type: String, unique: true },
}, { timestamps: true });

const InvoiceA = mongoose.models.InvoiceA || mongoose.model("InvoiceA", invoiceSchema);


export default InvoiceA
