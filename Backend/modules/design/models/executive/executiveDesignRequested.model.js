// executiveDesignRequest.schema.js
import mongoose from "mongoose";

export const executiveDesignRequestSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    remark: {
      type: String,
      required: true,
      trim: true,
    },

    requested_at: {
      type: Date,
      default: Date.now, // ✅ server se automatic date
    },
  },
  { _id: true },
);
