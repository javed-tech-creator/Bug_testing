import mongoose from "mongoose";
const { Schema } = mongoose;

/* --- SubActivity --- */
const SubActivitySchema = new Schema(
  {
    subActivityTitle: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    instructions: { type: [String], default: [] }, // or [SimpleStringSchema]
    checklist: { type: [String], default: [] },
  },
  { _id: false }
);

/* --- Activity --- */
const ActivitySchema = new Schema(
  {
    name: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    // type: { type: String, enum: ["subactivity", "direct", ""], default: "" },
    subActivities: { type: [SubActivitySchema], default: [] },
    instructions: { type: [String], default: [] },
    checklist: { type: [String], default: [] },
  },
  { _id: false }
);

/* --- SubTask (contains activities) --- */
const SubTaskSchema = new Schema(
  {
    subTaskTitle: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    // type: { type: String, enum: ["activity", ""], default: "" },
    activities: { type: [ActivitySchema], default: [] },
  },
  { _id: false }
);

/* --- Task (contains subTasks OR activities) --- */
const TaskSchema = new Schema(
  {
    taskTitle: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    // type: { type: String, enum: ["subtask", "activity", ""], default: "" },
    subTasks: { type: [SubTaskSchema], default: [] },
    activities: { type: [ActivitySchema], default: [] },
  },
  { _id: false }
);

/* --- Work (contains tasks) --- */
const WorkSchema = new Schema(
  {
    workTitle: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    tasks: { type: [TaskSchema], default: [] },
  },
  { _id: false }
);

/* --- Department (contains works) --- */
const DepartmentSchema = new Schema(
  {
    departmentName: { type: String, trim: true, required: true },
    works: { type: [WorkSchema], default: [] },
  },
  { _id: false }
);

/* --- Phase (contains departments) --- */
const PhaseSchema = new Schema(
  {
    phaseName: { type: String, trim: true, required: true },
    departments: { type: [DepartmentSchema], default: [] },
  },
  { _id: false }
);

/* --- Top-level Product --- */
const ProductSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "SignageProduct",
      required: true,
      unique: true,
    },
    // main nested structure:
    phases: { type: [PhaseSchema], default: [] },
    //  Soft delete fields
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// indexing for speed
ProductSchema.index({ productId: 1 });

const ProductWork = mongoose.model("ProductWork", ProductSchema);
export default ProductWork;
