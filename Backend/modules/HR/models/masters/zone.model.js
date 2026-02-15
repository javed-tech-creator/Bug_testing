import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const zoneSchema = new mongoose.Schema(
  {
    zoneId: {
      type: String,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

zoneSchema.plugin(AutoIncrement, {
  id: "zone_id_counter",
  inc_field: "sequence_value",
  start_seq: 1,
});

// Post-save hook to assign auto zoneId
zoneSchema.post("save", async function (doc, next) {
  if (!doc.zoneId) {
    const year = new Date().getFullYear().toString().substring(2);
    const paddedNumber = String(doc.sequence_value).padStart(3, "0");
    doc.zoneId = `ZON${year}${paddedNumber}`;
    await doc.constructor.findByIdAndUpdate(doc._id, { zoneId: doc.zoneId });
  }
  next();
});

const Zone = mongoose.model("Zone", zoneSchema);

export default Zone;
