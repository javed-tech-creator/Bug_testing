import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const citySchema = new mongoose.Schema(
  {
    cityId: {
      type: String,
      unique: true,
    },
    stateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
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

citySchema.plugin(AutoIncrement, {
  id: "city_id_counter",
  inc_field: "sequence_value",
  start_seq: 1,
});

// Post-save hook to assign cityId in format: CIT{year}{3-digit-number}
// e.g. CIT25001 for 2025 sequence 001
citySchema.post("save", async function (doc, next) {
  if (!doc.cityId) {
    const year = new Date().getFullYear().toString().substring(2);
    const paddedNumber = String(doc.sequence_value).padStart(3, "0");
    doc.cityId = `CIT${year}${paddedNumber}`;
    await doc.constructor.findByIdAndUpdate(doc._id, { cityId: doc.cityId });
  }
  next();
});

const City = mongoose.model("City", citySchema);

export default City;
