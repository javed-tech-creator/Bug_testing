import mongoose from "mongoose";
// import {
//   feedbackSchema,
//   remarkSchema,
// } from "../../common_schema/commonSubschema.model.js";

export const assignedExecutiveSchema = new mongoose.Schema({
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  assigned_design_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DesignAssigned",
    default: null,
  },
  assign_date: {
    type: Date,
    default: null,
  },
});
