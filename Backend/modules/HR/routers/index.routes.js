import express from "express";
const router = express.Router();

import branchRoutes from "./masters/branch.routes.js";
router.use("/branch", branchRoutes);

import departmentRoutes from "./masters/department.routes.js";
router.use("/department", departmentRoutes);

import actionGroupRoutes from "./masters/actionGroup.routes.js";
router.use("/action-group", actionGroupRoutes);

import designationRoutes from "./masters/designation.routes.js";
router.use("/designation", designationRoutes);

import channelRoutes from "./channel.routes.js";
router.use("/channel", channelRoutes);

import verticalRoutes from "./vertical.routes.js";
router.use("/vertical", verticalRoutes);

import jobPostRoutes from "./onboarding/jobPost.routes.js";
router.use("/job-post", jobPostRoutes);

import candidateRoutes from "./onboarding/candidate.routes.js";
router.use("/candidate", candidateRoutes);

import employeeProfileRoutes from "./onboarding/employeeProfile.routes.js";
router.use("/employee-profile", employeeProfileRoutes);

import userRoutes from "./masters/user.routes.js";
router.use("/user", userRoutes);

import trainingRoutes from "./onboarding/training.routes.js";
router.use("/training", trainingRoutes);

import zoneRoutes from "./masters/zone.routes.js";
router.use("/zone", zoneRoutes);

import stateRoutes from "./masters/state.routes.js";
router.use("/state", stateRoutes);

import cityRoutes from "./masters/city.routes.js";
router.use("/city", cityRoutes);

import attendance from "./attendance/attendance.routes.js";
router.use("/attendance", attendance);

import leave from "./leave/leave.routes.js";
router.use("/leave", leave);

import payroll from "./payroll.routes.js";
router.use("/payroll", payroll);

import performance from "./performance.routes.js";
router.use("/performance", performance);

import sopRoutes from "./onboarding/sop.routes.js";
router.use("/sop", sopRoutes);

export default router;
