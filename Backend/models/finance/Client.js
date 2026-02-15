import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email:{type: String,unique: true },
    phone: String,
    billingAddress: String,
    gstin: String, // optional
  },
  { timestamps: true }
);

const Client = mongoose.model("FinanceClient", clientSchema);

export default Client;
