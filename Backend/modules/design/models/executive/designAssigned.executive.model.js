import mongoose from "mongoose";
import { DesignAssigned } from "./designAssigned.base.model.js";
import {
  remarkSchema,
  feedbackSchema,
} from "../common_schema/commonSubschema.model.js";

const ExecutiveAssignmentSchema = new mongoose.Schema({
  decision_submitted_date: {
    type: Date,
    default: null,
  },
  environmental_conditions_remark: {
    type: remarkSchema,
    default: () => ({}),
  },
  product_requirement_remark: {
    type: remarkSchema,
    default: () => ({}),
  },

  upload_photos_remark: {
    type: remarkSchema,
    default: () => ({}),
  },
  upload_videos_remark: {
    type: remarkSchema,
    default: () => ({}),
  },
  installation_details_remark: {
    type: remarkSchema,
    default: () => ({}),
  },

  raw_recce_remark: {
    type: remarkSchema,
    default: () => ({}),
  },

  data_from_client_remark: {
    type: remarkSchema,
    default: () => ({}),
  },

  Additional_instruction_remark: {
    type: remarkSchema,
    default: () => ({}),
  },

  receiving_checklist: {
    type: [String],
    default: [],
  },

  feedback_panel: {
    type: feedbackSchema,
    default: () => ({}),
  },
});

export const ExecutiveDesignAssigned = DesignAssigned.discriminator(
  "executive",
  ExecutiveAssignmentSchema,
);
