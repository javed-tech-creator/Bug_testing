import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const departmentSchema = new mongoose.Schema(
  {
    departmentId: {
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
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

// auto increment sequence
departmentSchema.plugin(AutoIncrement, {
  id: "department_id_counter",
  inc_field: "sequence_value",
  start_seq: 1,
});

departmentSchema.post("save", async function (doc, next) {
  if (!doc.departmentId) {
    const year = new Date().getFullYear().toString().substring(2);
    const paddedNumber = String(doc.sequence_value).padStart(3, "0");
    doc.departmentId = `DPT${year}${paddedNumber}`;
    await doc.constructor.findByIdAndUpdate(doc._id, {
      departmentId: doc.departmentId,
    });
  }
  next();
});

const Department = mongoose.model("Department", departmentSchema);

export default Department;
