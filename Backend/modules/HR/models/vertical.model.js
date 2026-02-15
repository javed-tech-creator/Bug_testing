import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const verticalSchema = new mongoose.Schema(
  {
    verticalId: {
      type: String,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
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

// auto increment sequence
verticalSchema.plugin(AutoIncrement, {
  id: "vertical_id_counter",
  inc_field: "sequence_value",
  start_seq: 1,
});

verticalSchema.post("save", async function (doc, next) {
  if (!doc.verticalId) {
    const year = new Date().getFullYear().toString().substring(2);
    const paddedNumber = String(doc.sequence_value).padStart(3, "0");
    doc.verticalId = `VRT${year}${paddedNumber}`;
    await doc.constructor.findByIdAndUpdate(doc._id, {
      verticalId: doc.verticalId,
    });
  }
  next();
});

const Vertical = mongoose.model("Vertical", verticalSchema);

export default Vertical;
