import mongoose from "mongoose";
import { RecceAssigned } from "./recceAssigned.base.model.js";
import { feedbackSchema, remarkSchema } from "./recceDetail.model.js";

const ExecutiveAssignmentSchema = new mongoose.Schema({
  decision_submitted_date: {
    type: Date,
    default: null,
  },
  basicClientRemark: { type: remarkSchema, default: () => ({}) },
  projectInformationRemark: { type: remarkSchema, default: () => ({}) },
  sideAddressRemark: { type: remarkSchema, default: () => ({}) },
  designAssetsRemark: { type: remarkSchema, default: () => ({}) },
  reccefeedback: { type: remarkSchema, default: () => ({}) },
  receiving_checklist: {
    type: [String], //  SIMPLE ARRAY
    default: [],
  },
  Additional_instruction_remark: {
    type: remarkSchema,
    default: () => ({}),
  },

  feedback_panel: {
    type: feedbackSchema,
    default: () => ({}),
  },
});

export const ExecutiveRecceAssigned = RecceAssigned.discriminator(
  "executive",
  ExecutiveAssignmentSchema,
);
