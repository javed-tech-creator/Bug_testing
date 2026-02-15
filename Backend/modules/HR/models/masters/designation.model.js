import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose);

const designationSchema = new mongoose.Schema(
  {
    designationId: {
      type: String,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    depId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    branchId: {
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

designationSchema.plugin(AutoIncrement, {
  id: "designation_id_counter",
  inc_field: "sequence_value",
  start_seq: 1,
});


designationSchema.post("save", async function (doc, next) {
  if (!doc.designationId) {
    const year = new Date().getFullYear().toString().substring(2);
    const paddedNumber = String(doc.sequence_value).padStart(3, "0");
    doc.designationId = `DSG${year}${paddedNumber}`;
    await doc.constructor.findByIdAndUpdate(doc._id, {
      designationId: doc.designationId,
    });
  }
  next();
});

const Designation = mongoose.model("Designation", designationSchema);

export default Designation;
