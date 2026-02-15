import mongoose from "mongoose";

const taxRecordSchema = new mongoose.Schema({
  payment: { type: mongoose.Schema.Types.ObjectId, ref: "venderTaxPayment", required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "vendorTaxVendor", required: true },
  tds: { type: Number, default: 0 },
  gstType: { type: String, enum: ["B2B", "B2C"], required: true },
  gstr1Filed: { type: Boolean, default: false },
  gstr3BFiled: { type: Boolean, default: false },
  filingDate: Date,
  filingDueDate: Date,
  tdsDeposited: { type: Boolean, default: false },
  challanProof: { type: String, default: "" },
  autoEmailSent: { type: Boolean, default: false }, // cron email reminder
}, { timestamps: true });

taxRecordSchema.virtual("netPayment").get(function () {
  if (this.payment?.totalAmount != null) {
    return this.payment.totalAmount - this.tds;
  }
  return 0;
});

// Ensure virtuals are included in JSON responses
taxRecordSchema.set("toJSON", { virtuals: true });
taxRecordSchema.set("toObject", { virtuals: true });
export default mongoose.model("vendorTaxRecord", taxRecordSchema);