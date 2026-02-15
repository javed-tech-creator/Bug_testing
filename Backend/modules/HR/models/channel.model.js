import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const channelSchema = new mongoose.Schema(
  {
    channelId: {
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
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

// auto increment sequence
channelSchema.plugin(AutoIncrement, {
  id: "channel_id_counter",
  inc_field: "sequence_value",
  start_seq: 1,
});

channelSchema.post("save", async function (doc, next) {
  if (!doc.channelId) {
    const year = new Date().getFullYear().toString().substring(2);
    const paddedNumber = String(doc.sequence_value).padStart(3, "0");
    doc.channelId = `CHN${year}${paddedNumber}`;
    await doc.constructor.findByIdAndUpdate(doc._id, {
      channelId: doc.channelId,
    });
  }
  next();
});

const Channel = mongoose.model("Channel", channelSchema);

export default Channel;
