import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const stateSchema = new mongoose.Schema(
  {
    stateId: {
      type: String,
      unique: true,
    },
    zoneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Zone",
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

stateSchema.plugin(AutoIncrement, {
  id: "state_id_counter",
  inc_field: "sequence_value",
  start_seq: 1,
});


stateSchema.post("save", async function (doc, next) {
  if (!doc.stateId) {
    const year = new Date().getFullYear().toString().substring(2);
    const paddedNumber = String(doc.sequence_value).padStart(3, "0");
    doc.stateId = `STA${year}${paddedNumber}`;
    await doc.constructor.findByIdAndUpdate(doc._id, { stateId: doc.stateId });
  }
  next();
});

const State = mongoose.model("State", stateSchema);

export default State;
