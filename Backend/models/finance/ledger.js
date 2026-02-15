import mongoose from "mongoose";

// const LedgerSchema = new mongoose.Schema({
//   clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
//   vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
//   category: { type: String },
//   department: { type: String },
//   amount: { type: Number, required: true },
//   type: { type: String, enum: ["collection", "payout", "expense"], required: true },
//   status: { type: String, enum: ["Pending", "Paid"], default: "Pending" },
//   description: { type: String },
//   date: { type: Date, default: Date.now },
// });

// const Ledger = mongoose.model("Ledger", LedgerSchema);
// export default Ledger;import mongoose from "mongoose";

 
 const LedgerSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: "Client" }, 
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" }, 
  category: { type: String },
  department: { type: String },
  amount: { type: Number, required: true },
  type: { type: String, enum: ["collection", "payout", "expense"], required: true },
  status: { type: String, enum: ["Pending", "Paid"], default: "Pending" },
  description: { type: String },
  date: { type: Date, default: Date.now },
});
 

const Ledger = mongoose.model("Ledger", LedgerSchema);
export default Ledger; 