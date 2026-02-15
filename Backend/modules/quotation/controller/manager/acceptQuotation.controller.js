// import acceptQuotationModel from "../../model/manager/acceptQuotation.model.js";

// /**
//  * =====================================
//  * CREATE / SUBMIT ACCEPT QUOTATION
//  * =====================================
//  */
// export const createAcceptQuotation = async (req, res) => {
//   try {
//     const { checklist, feedback, declarationAccepted } = req.body;

//     /* ======================
//        AUTH VALIDATION
//     ====================== */
//     if (!req.user || !req.user._id) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized access",
//       });
//     }

//     /* ======================
//        CHECKLIST VALIDATION
//     ====================== */
//     if (!checklist || typeof checklist !== "object") {
//       return res.status(400).json({
//         success: false,
//         message: "Checklist is required and must be an object",
//       });
//     }

//     const checklistValues = Object.values(checklist);
//     if (!checklistValues.some((val) => val === true)) {
//       return res.status(400).json({
//         success: false,
//         message: "At least one checklist item must be selected",
//       });
//     }

//     /* ======================
//        FEEDBACK VALIDATION
//     ====================== */
//     if (!feedback || typeof feedback !== "object") {
//       return res.status(400).json({
//         success: false,
//         message: "Feedback data is required",
//       });
//     }

//     const {
//       decision,
//       rating,
//       comment,
//       declineRemark,
//       flagType,
//       flagRemark,
//     } = feedback;

//     const ALLOWED_DECISIONS = ["accept", "decline", "flag"];
//     const FLAG_TYPES = ["High Impact", "Medium Impact", "Low Impact"];

//     if (!ALLOWED_DECISIONS.includes(decision)) {
//       return res.status(400).json({
//         success: false,
//         message: "Decision must be accept, decline, or flag",
//       });
//     }

//     if (!rating || rating < 1 || rating > 5) {
//       return res.status(400).json({
//         success: false,
//         message: "Rating must be between 1 and 5",
//       });
//     }

//     if (comment && comment.length > 500) {
//       return res.status(400).json({
//         success: false,
//         message: "Comment cannot exceed 500 characters",
//       });
//     }

//     /* ======================
//        DECISION BASED RULES
//     ====================== */
//     if (decision === "decline") {
//       if (!declineRemark || !declineRemark.trim()) {
//         return res.status(400).json({
//           success: false,
//           message: "Decline remark is required",
//         });
//       }

//       if (rating > 2) {
//         return res.status(400).json({
//           success: false,
//           message: "Declined quotation cannot have rating above 2",
//         });
//       }
//     }

//     if (decision === "flag") {
//       if (!FLAG_TYPES.includes(flagType)) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid flag type",
//         });
//       }

//       if (!flagRemark || !flagRemark.trim()) {
//         return res.status(400).json({
//           success: false,
//           message: "Flag remark is required",
//         });
//       }
//     }

//     /* ======================
//        DECLARATION VALIDATION
//     ====================== */
//     if (declarationAccepted !== true) {
//       return res.status(400).json({
//         success: false,
//         message: "Declaration must be accepted",
//       });
//     }

//     /* ======================
//        CLEAN UNUSED FIELDS
//     ====================== */
//     if (decision !== "decline") {
//       feedback.declineRemark = undefined;
//     }

//     if (decision !== "flag") {
//       feedback.flagType = undefined;
//       feedback.flagRemark = undefined;
//     }

//     /* ======================
//        DUPLICATE SUBMISSION
//     ====================== */
//     const alreadySubmitted = await acceptQuotationModel.findOne({
//       createdBy: req.user._id,
//     });

//     if (alreadySubmitted) {
//       return res.status(409).json({
//         success: false,
//         message: "You have already submitted a quotation decision",
//       });
//     }

//     /* ======================
//        SAVE TO DATABASE
//     ====================== */
//     const data = await acceptQuotationModel.create({
//       checklist,
//       feedback,
//       declarationAccepted,
//       createdBy: req.user._id,
//       submittedAt: new Date(),
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Quotation checklist submitted successfully",
//       data,
//     });
//   } catch (error) {
//     console.error("Create Accept Quotation Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Internal server error",
//     });
//   }
// };

// /**
//  * =====================================
//  * GET ACCEPT QUOTATIONS
//  * =====================================
//  * Query Params:
//  *  - decision=accept | decline | flag
//  *  - createdBy=userId
//  */
// export const getAcceptQuotation = async (req, res) => {
//   try {
//     const { decision, createdBy } = req.query;
//     const filter = {};

//     const ALLOWED_DECISIONS = ["accept", "decline", "flag"];

//     if (decision) {
//       if (!ALLOWED_DECISIONS.includes(decision)) {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid decision filter",
//         });
//       }
//       filter["feedback.decision"] = decision;
//     }

//     if (createdBy) {
//       filter.createdBy = createdBy;
//     }

//     const data = await acceptQuotationModel
//       .find(filter)
//       .sort({ createdAt: -1 })
//       .populate("createdBy", "name email");

//     return res.status(200).json({
//       success: true,
//       count: data.length,
//       data,
//     });
//   } catch (error) {
//     console.error("Get Accept Quotation Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Internal server error",
//     });
//   }
// };
