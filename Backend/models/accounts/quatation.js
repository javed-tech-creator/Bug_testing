 
import mongoose from "mongoose";

const quotationSchema = new mongoose.Schema({

    number: {
        type: String,
        unique: true,
        required: true,
    },
    client: { type: String, required: true },
    projects: String,
    items: [
        {
            description: String,
            quantity: Number,
            rate: Number,
        },
    ],
    gst:Number,
    totalAmount: Number,
}, { timestamps: true });


const QuotationNewAccount = mongoose.models.QuotationNewAccount || mongoose.model("QuotationNewAccount", quotationSchema);
export default QuotationNewAccount