import { Schema, model } from 'mongoose';

const projectCounterSchema = new Schema({
  year: {
    type: String,
    required: true,
    unique: true
  },
  seq: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

const ProjectCounterModel = model("ProjectId", projectCounterSchema);

export default ProjectCounterModel;
