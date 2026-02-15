// import mongoose from "mongoose";
// import {
//   remarkSchema,
//   feedbackSchema,
// } from "../../../design/models/common_schema/commonSubschema.model.js";


// const acceptQuotationSchema = new mongoose.Schema(
//   {
//     /* ================== BASIC REFERENCES ================== */
    
//        design_id: {
//          type: String,
//          unique: true,
//        },
//        sequence_value: {
//          type: Number, 
//        },
//        recce_id: {
//          type: mongoose.Schema.Types.ObjectId,
//          ref: "DummyRecce",
//          required: true,
//        },
//        product_id: {
//          type: mongoose.Schema.Types.ObjectId,
//          ref: "ClientProduct",
//          required: true,
//        },
//        project_id: {
//          type: mongoose.Schema.Types.ObjectId,
//          ref: "Project",
//          required: true,
//        },
//        client_id: {
//          type: mongoose.Schema.Types.ObjectId,
//          ref: "Client",
//          required: true,
//        },
//        branch_id: {
//          type: mongoose.Schema.Types.ObjectId,
//          ref: "Branch",
//          required: true,
//        },
//        send_by: {
//          type: mongoose.Schema.Types.ObjectId,
//          ref: "User",
//          required: true,
//        },
//        received_by: {
//          type: mongoose.Schema.Types.ObjectId,
//          ref: "User",
//          default: null,
//        },
   
//        received_date: {
//          type: Date,
//          default: null, //  initially null rahegi
//        },
   

//     /* ================== CHECKLIST (FROM RECCE / DESIGN) ================== */
//     checklist: {
//       environmentalConditions: { type: Boolean, default: false },
//       productRequirements: { type: Boolean, default: false },
//       uploadedImages: { type: Boolean, default: false },
//       uploadedVideos: { type: Boolean, default: false },
//       installationDetails: { type: Boolean, default: false },
//       rawRecce: { type: Boolean, default: false },
//       dataFromClient: { type: Boolean, default: false },
//       accurateMeasurementsTaken: { type: Boolean, default: false },
//       instructionsRemarks: { type: Boolean, default: false },
//       signageNameConfirmed: { type: Boolean, default: false },
//       submittedSameDay: { type: Boolean, default: false },
//     },

//     /* ================== FEEDBACK PANEL (COMMON SCHEMA) ================== */
//     feedback_panel: {
//       type: feedbackSchema,
//       default: () => ({}),
//     },

//     /* ================== DECLARATION ================== */
//     declarationAccepted: {
//       type: Boolean,
//       required: true,
//       validate: {
//         validator: (val) => val === true,
//         message: "Declaration must be accepted",
//       },
//     },

//     /* ================== META ================== */
//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     submittedAt: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   { timestamps: true },
// );

// /* ================== INDEXES ================== */
// acceptQuotationSchema.index({ recce_id: 1 });
// acceptQuotationSchema.index({ product_id: 1 });
// acceptQuotationSchema.index({
//   branch_id: 1,
//   "feedback_panel.final_decision": 1,
// });

// export default mongoose.model("AcceptQuotation", acceptQuotationSchema);
