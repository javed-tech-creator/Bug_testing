import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const branchSchema = new mongoose.Schema(
  {
    branchId: {
      type: String,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    zoneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Zone",
      required: true,
    },
    stateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
      required: true,
    },
    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    sequence_value: {
      type: Number,
    },
  },
  { timestamps: true }
);

branchSchema.plugin(AutoIncrement, {
  id: "branch_id_counter",
  inc_field: "sequence_value",
  start_seq: 1,
});

// Post-save hook to assign branchId formatted like BRN{year}{3-digit-number}
// e.g. BRN25001 for 2025 sequence 001
branchSchema.post("save", async function (doc, next) {
  if (!doc.branchId) {
    const year = new Date().getFullYear().toString().substring(2);
    const paddedNumber = String(doc.sequence_value).padStart(3, "0");
    doc.branchId = `BRN${year}${paddedNumber}`;
    await doc.constructor.findByIdAndUpdate(doc._id, { branchId: doc.branchId });
  }
  next();
});

const Branch = mongoose.model("Branch", branchSchema);

export default Branch;
