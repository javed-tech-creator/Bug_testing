import mongoose from "mongoose";
import { RecceAssigned } from "./recceAssigned.base.model.js";

/**
 * SELF assignment
 *  No remarks
 *  No checklist
 *  No feedback
 */

const SelfAssignmentSchema = new mongoose.Schema({});

export const SelfRecceAssigned =
  RecceAssigned.discriminator("self", SelfAssignmentSchema);
