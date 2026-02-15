import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
    description: String,
  },
  { timestamps: true }
);

const Project = mongoose.models.Project || mongoose.model("FiProject", projectSchema);

export default Project;
