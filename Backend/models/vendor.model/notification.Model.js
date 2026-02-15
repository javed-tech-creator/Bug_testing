import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
{
vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
type: {
type: String,
enum: ["STOCK_ALERT", "INVOICE_CREATED", "PAYMENT_COMPLETED","PAYMENT_PARTIAL"],
required: true,
},
message: { type: String, required: true },
isRead: { type: Boolean, default: false },
meta: { type: Object, default: {} }, // optional details (invoiceId, productId, etc.)
},
{ timestamps: true }
);


const notificationModel = mongoose.model("Notification", notificationSchema);
export default notificationModel;
