import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const sopSchema = new mongoose.Schema(
  {
    sopId: { type: String, unique: true },

    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },

    designationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Designation",
      required: true,
      index: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    uploadedByName: { type: String }, // ⭐ added missing

    files: [
      {
        url: { type: String },
        name: { type: String },
        type: { type: String },
        public_id: { type: String },
        public_url: { type: String },
      },
    ],

    status: {
      type: String,
      enum: ["Active", "Inactive", "Archived"],
      default: "Active",
    },

    sequence_value: { type: Number },
  },
  { timestamps: true }
);

// Auto increment
sopSchema.plugin(AutoIncrement, {
  id: "sop_id_counter",
  inc_field: "sequence_value",
  start_seq: 1,
});

// ⭐ Auto-generate SOP unique ID
sopSchema.post("save", async function (doc, next) {
  try {
    if (!doc.sopId) {
      const year = new Date().getFullYear().toString().slice(-2);
      const paddedNumber = String(doc.sequence_value).padStart(3, "0");

      doc.sopId = `SOP${year}${paddedNumber}`;

      await mongoose
        .model("SOP")
        .findByIdAndUpdate(doc._id, { sopId: doc.sopId });
    }
    next();
  } catch (err) {
    next(err);
  }
});

const SOP = mongoose.model("SOP", sopSchema);
export default SOP;
