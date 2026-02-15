import mongoose from "mongoose";
import { DesignAssigned } from "./designAssigned.base.model";

/**
 * SELF assignment
 *  No remarks
 *  No checklist
 *  No feedback
 */

const SelfAssignmentSchema = new mongoose.Schema({});

export const SelfDesignAssigned =
  DesignAssigned.discriminator("self", SelfAssignmentSchema);
