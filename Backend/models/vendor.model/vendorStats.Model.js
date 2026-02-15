import mongoose from "mongoose";

// import mongoose from "mongoose"
const vendorStatsSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    totalSales: { type: Number, default: 0 },
    totalCustomers: { type: Number, default: 0 },
    totalInvoices: {
      type: Number,
      default: 0,
    },
    statusCount: {
      paid: { type: Number, default: 0 },
      partial: { type: Number, default: 0 },
      pending: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

const VendorStatsModel = mongoose.model("VendorStats", vendorStatsSchema);
export default VendorStatsModel;
