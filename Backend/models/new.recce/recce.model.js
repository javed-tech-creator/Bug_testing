import mongoose from "mongoose";
const { Schema, model } = mongoose;
const ObjectId = Schema.Types.ObjectId;


const recceSchema = new Schema(
  {
    leadId: {
      type: ObjectId,
      ref: "Lead",
      required: true
    },

    clientBriefingId: {
      type: ObjectId,
      ref: "SalesClientBriefing",
      required: true
    },

    assignedTo: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Registration",
          required: true,
        },
        assignedAt: {
          type: Date,
          default: Date.now
        },

      }
    ],

    assignedBy: {
      type: ObjectId,
      ref: "Registration"
    },

    recceStatus: {
      type: String,
      enum: ["Pending", "Assigned", "In Progress", "Completed", "Cancelled"],
      default: "Pending"
    },

    recceDate: {
      type: Date,
      default: null
    },


    siteImages: [
      {
        url: String,
        public_id: String
      }
    ],

    measurements: {
      type: String,
      default: ""
    },

    assignedAt: {
      type: Date,
      default: null
    },

    completedAt: {
      type: Date,
      default: null
    },

    completedBy: {
      type: ObjectId,
      ref: "Registration"
    },

    approvedBy: {
      type: ObjectId,
      ref: "Registration",
      default: null
    },

    approvedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);
const recceModel = model("Recce", recceSchema);

export default recceModel;