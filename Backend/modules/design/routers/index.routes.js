import express from "express";
const router = express.Router();

import reccedataDummy from "../routers/reccedata.routes.js";
router.use("/recce-dummy", reccedataDummy);

import DesignRequested from "./manager_routers/designRequested.routes.js";
router.use("/requested", DesignRequested);

import DesignReceived from "./manager_routers/designReceived.routes.js";
router.use("/request-received", DesignReceived);

import DesignAllExecutives from "./manager_routers/designAllExecutives.routes.js";
router.use("/team-executives", DesignAllExecutives);

import DesignAssign from "./manager_routers/designAssignment.routes.js";
router.use("/assignment", DesignAssign);

import DesignLostWaiting from "./common_routers/designLostWaiting.routes.js";
router.use("/lost-or-waiting-list", DesignLostWaiting);

import DesignTodayList from "./common_routers/designTodaylist.routes.js";
router.use("/today-list", DesignTodayList);

import DesignMarkAsStarted from "./common_routers/designMarkAsStarted.routes.js";
router.use("/mark-as-started/:id", DesignMarkAsStarted);

import WorkflowDesignOptions from "./common_routers/workFlowDesignOptions.routes.js";
router.use("/get-workflow-upload", WorkflowDesignOptions);

import requestDesignAssignment from "./executive_routers/requestDesignForAssignment.routes.js";
router.use("/request-for-assignment", requestDesignAssignment);

import getAllExecutiveAssigned from "./executive_routers/getAllAssignedDesign.routes.js";
router.use("/executive", getAllExecutiveAssigned);

import designOptionsUpload from "./common_routers/designOptionsUpload.routes.js";
router.use("/design-upload", designOptionsUpload);

import DesignMarkAsMockupStarted from "./common_routers/designMarkAsMockupStarted.routes.js";
router.use("/mark-as-mockup-started", DesignMarkAsMockupStarted);

import DesignMockup from "./common_routers/designMockup.routes.js";
router.use("/mockup", DesignMockup);

import markMeasurementStarted from "./common_routers/designMarkAsMeasurement.routes.js";
router.use("/mark-as-measurement-started", markMeasurementStarted);

import designReviewSubmit from "./common_routers/designReviewFinalSubmit.routes.js";
router.use("/review-submit", designReviewSubmit);

import DesignMeasurement from "./common_routers/designMeasurement.routes.js";
router.use("/measurement-quotation", DesignMeasurement);

import ManagerPendingDesignOption from "./manager_routers/designOptionIntraction.routes.js";
router.use("/options", ManagerPendingDesignOption);

import ProjectModuleApi from "./projectmoduleapi/projectmodule.routes.js";
router.use("/project-module", ProjectModuleApi);

import designDashboardData from "./manager_routers/designDashboardData.routes.js";
router.use("/manager-dashboard", designDashboardData); 

import executiveDashboardData from "./executive_routers/designDashboardData.routes.js";
router.use("/executive-dashboard", executiveDashboardData);
export default router;
