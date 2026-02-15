import mongoose from "mongoose";

const draftCounterSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  seq: { type: Number, default: 0 },
});

draftCounterSchema.index({ createdBy: 1 , year: 1 });
const DraftCounterModel = mongoose.model("VendorModuleDraftsCounter", draftCounterSchema);

export default DraftCounterModel;
