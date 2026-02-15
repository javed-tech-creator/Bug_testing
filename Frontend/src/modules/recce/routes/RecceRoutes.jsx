import CompletedRecceDetail from "../pages/CompletedRecceDetail";
import React, { lazy, Suspense } from "react";
// Lazy load CompletedRecce
const CompletedRecceLazy = lazy(() => import("../pages/CompletedRecce.jsx"));
import { Routes, Route, Navigate } from "react-router-dom";
import RecceLoginPage from "../pages/RecceLoginPage";
import RecceLayout from "../layouts/RecceLayout";
import WorkingOnIt from "../../../components/WorkingOnIt";
import Dashboard from "../pages/dashboard/Dashboard";
import TotalProject from "../pages/projects/TotalProjects";
import AssignForRecce from "../pages/projects/AssignForRecce";
import PendingProject from "../pages/projects/PendingProject";
import AssignProjectList from "../pages/projects/AssignProjectList";
import RecceToDesignList from "../pages/projects/RecceToDesignList";
import RecceForApproval from "../pages/projects/RecceForApproval";
import AssignedRecce from "../pages/AssignedRecce";
import PendingRecceProjectList from "../pages/projects/submited/PendingRecceProjectList";
import SubmitedRecceProjectList from "../pages/projects/submited/RejectedRecceProjectList";
import RejectedRecceProjectList from "../pages/projects/submited/RejectedRecceProjectList";
import ApprovedRecceProjectList from "../pages/projects/submited/ApprovedRecceProjectList";
import RaiseComplainPage from "../pages/projects/complain/RaiseComplainPage";
import RaisedComplainList from "../pages/projects/complain/RaisedComplainList";
import TaskDashboard from "../pages/sales/task/TaskDashboard";
import ProfilePage from "../pages/ProfilePage";

// Import Recce Form Pages
import ReccePlanningDetail from "../pages/PlanningRecceDetails";
import ProductRequirements from "../pages/recce-form/step/ProductRequirements";
import VisualDocumentation from "../pages/recce-form/step/VisualDocumentation";
import InstallationStep from "../pages/recce-form/step/InstallationStep";
import DataAndInstruction from "../pages/recce-form/step/DataAndInstruction";
import ReviewSubmit from "../pages/recce-form/step/ReviewSubmit";
import DeparmentProtectedRoute from "@/auth/DeparmentProtectedRoute";

import MorningReport from "../pages/daily-report/MorningReport";
import EveningReport from "../pages/daily-report/EveningReport";

import TotalRecce from "../pages/TotalRecce";

// ** NEW IMPORT **
import NotificationEmployee from "../components/NotificationEmployee";
import RecceExecutiveFunnelDashboard from "../pages/dashboard/RecceExecutiveFunnelDashboard";
import WaitingRecce from "../pages/WaitingRecce";
import TodaysRecce from "../pages/TodaysRecce";
import AcceptedRecce from "../pages/AcceptedRecce";
import NextDayReccePlanning from "../pages/NextDayReccePlanning";
import PossibleRecce from "../pages/PossibleRecce";
import RecceIn from "../pages/RecceIn";
import RecceTimeReport from "../pages/RecceTimeReport";
import RecceReportProjectWise from "../pages/RecceReportProjectWise";
import RecceWaitingDetail from "../pages/WaitingRecceDetails";
import RecceDetails from "../pages/RecceDetails";
import AssignedRecceDetailPage from "../pages/AssignedRecceDetailPage";
import RecceFunnel from "../pages/RecceFunnel";
import RecceReceived from "../pages/RecceReceived";
import RecceFlagRaised from "../pages/RecceFlagRaised";
import RejectedRecce from "../pages/RejectedRecce";
import RecceReviewManager from "../pages/RecceReviewManager";
import RecceReviewClient from "../pages/RecceReviewClient";
import RecceWorkFlow from "../pages/RecceWorkFlow";
import UpcomingRecce from "../pages/UpcomingRecce";
import LostRecce from "../pages/LostRecce";
import Recommendation from "../pages/Recommendation";
import RecommendationTable from "../pages/RecommendationTable";
// import TotalRecce from "../pages/TotalRecce";
// import RecceDetailsPage from "../pages/RecceDetailsPage";
import AssignedExecutiveRecce from "../pages/AssignedExecutiveRecce";
import AssignedRecceDetailPageExecutive from "../pages/AssignedRecceDetailPageExecutive";
import ReceivedRecceDetailPage from "../pages/ReceivedRecceDetailPage";
import EveningRecceManager from "../pages/daily-report/Manager/EveningRecceManager";
// Recce Reporting Imports
import RecceReports from "../pages/RecceReports";
import RecceDrafts from "../pages/RecceDrafts";

// Team Management Imports
import TeamManagement from "../pages/TeamManagement";
import ExecutiveProfileDetail from "../pages/ExecutiveProfileDetail";
import RecceModification from "../pages/RecceModification";
import SelfAssignedRecce from "../pages/SelfAssignedRecce";
import RecceReport from "../pages/recceReport";
import ExecutiveProfile from "../pages/ExecutiveProfile";
import RecceInDesign from "../pages/RecceInDesign";
import SalesInRecce from "../pages/SalesInRecce";
import SalesInRecceDetailPage from "../pages/SalesInRecceDetailPage";
import MorningRecceManager from "../pages/daily-report/Manager/MorningRecceManager";
import PSLPage from "../pages/PSL/PSLPage";
import PSLUpdatePage from "../pages/PSL/PSLUpdatePage";
import SendToManager from "../pages/recce-form/step/SendToManager";
const SalesRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<RecceLoginPage />} />
      <Route
        element={
          <DeparmentProtectedRoute
            allowedDepartment="Recce"
            allowedDesignations={["HOD", "Manager", "Executive"]}
          />
        }
      >
        <Route element={<RecceLayout />}>
          <Route path="working" element={<WorkingOnIt />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route
            path="recce-executive-funnel-dashboard"
            element={<RecceExecutiveFunnelDashboard />}
          />
          <Route path="executive-profile" element={<ExecutiveProfile />} />
          <Route path="waiting-recce" element={<WaitingRecce />} />
          <Route
            path="next-day-recce-planning"
            element={<NextDayReccePlanning />}
          />
          <Route path="todays-recce" element={<TodaysRecce />} />
          <Route path="received-accepted-recce" element={<AcceptedRecce />} />
          <Route path="received-recce" element={<RecceReceived />} />
          <Route path="received-recce-details/:id" element={<ReceivedRecceDetailPage />} />
          <Route path="rejected-recce" element={<RejectedRecce />} />
          <Route path="flag-raised-recce" element={<RecceFlagRaised />} />
          <Route path="possible-recce" element={<PossibleRecce />} />
          <Route path="recce-in" element={<RecceIn />} />
          <Route path="recce-evening-manager" element={<EveningRecceManager />} />
          <Route path="recce-morning-manager" element={<MorningRecceManager />} />
          <Route path="psl-page" element={<PSLPage />} />
          <Route path="psl-update/:id" element={<PSLUpdatePage />} />
          <Route path="send-to-manager" element={<SendToManager />} />
          <Route
            path="recce-report-project-wise"
            element={<RecceReportProjectWise />}
          />
          <Route path="sales-in-recce" element={<SalesInRecce />} />
          <Route path="sales-in-recce-details/:id" element={<SalesInRecceDetailPage />} />

          {/* <Route path="total-recce-dashboard" element={<TotalRecce />} /> */}
          {/* ** NEW ROUTE ADDED HERE ** */}
          <Route path="notifications" element={<NotificationEmployee />} />

          <Route path="tasks" element={<TaskDashboard />} />
          <Route path="profilepage" element={<ProfilePage />} />
          <Route path="assigned-recce" element={<AssignedRecce />} />
          <Route path="project/list" element={<TotalProject />} />
          <Route path="project/pending" element={<PendingProject />} />
          <Route path="project/assign/:id" element={<AssignForRecce />} />
          <Route path="project/assign" element={<AssignProjectList />} />
          <Route path="recce-time-report" element={<RecceTimeReport />} />
          <Route
            path="recce-planning-detail"
            element={<ReccePlanningDetail />}
          />
          <Route path="recce-waiting-detail" element={<RecceWaitingDetail />} />
          <Route path="recce-detail" element={<RecceDetails />} />
          <Route
            path="assigned-recce-details/:id"
            element={<AssignedRecceDetailPage />}
          />
          <Route path="recce-review-manager" element={<RecceReviewManager />} />
          <Route
            path="recce-review-manager/:id"
            element={<RecceReviewManager />}
          />
          <Route path="recce-in-design" element={<RecceInDesign />} />
          <Route path="recce-review-client" element={<RecceReviewClient />} />
          <Route path="workings" element={<RecceWorkFlow />} />
          <Route path="upcoming-recce" element={<UpcomingRecce />} />
          <Route path="lost-recce" element={<LostRecce />} />
          <Route path="assigned-executive-recce" element={<AssignedExecutiveRecce />} />
          <Route
            path="assigned-executive-recce-details/:id"
            element={<AssignedRecceDetailPageExecutive />}
          />
          <Route path="recommendation" element={<Recommendation />} />
          <Route
            path="recommendation-table"
            element={<RecommendationTable />}
          />
          <Route path="recommendation/form/:id" element={<Recommendation />} />
          <Route path="recommendation/form/new" element={<Recommendation />} />
          <Route path="funnel" element={<RecceFunnel />} />
          <Route
            path="project/pending-recce-to-design-list"
            element={<ReccePlanningDetail />}
          />
          <Route
            path="project/recce-to-design-list"
            element={<RecceToDesignList />}
          />
          <Route
            path="project/recce-for-approval-list"
            element={<RecceForApproval />}
          />

          {/* Recce Form Flow Routes */}
          <Route path="recce-details/:id" element={<RecceDetails />} />
          <Route
            path="product-requirements"
            element={<ProductRequirements />}
          />
          <Route
            path="visual-documentation"
            element={<VisualDocumentation />}
          />
          <Route path="installation-step" element={<InstallationStep />} />
          <Route path="data-instruction" element={<DataAndInstruction />} />
          <Route path="review-submit" element={<ReviewSubmit />} />
          <Route path="review-submit/:id" element={<ReviewSubmit />} />

          {/* Submitted recce project routes */}
          <Route
            path="project/pending-recce-project-list"
            element={<PendingRecceProjectList />}
          />
          <Route
            path="project/approved-recce-project-list"
            element={<ApprovedRecceProjectList />}
          />
          <Route
            path="project/rejected-recce-project-list"
            element={<RejectedRecceProjectList />}
          />

          {/* Complain routes */}
          <Route
            path="project/raise-complain"
            element={<RaiseComplainPage />}
          />
          <Route
            path="project/raised-complain-list"
            element={<RaisedComplainList />}
          />
          <Route path="morning-report" element={<MorningReport />} />
          <Route path="evening-report" element={<EveningReport />} />

          {/* Completed Recce Route */}
          <Route
            path="completed-recce"
            element={
              <Suspense fallback={null}>
                <CompletedRecceLazy />
              </Suspense>
            }
          />
          <Route path="recce/:id" element={<CompletedRecceDetail />} />
          <Route path="total-recce" element={<TotalRecce />} />

          <Route
            path="/recce/next-day-planning"
            element={<NextDayReccePlanning />}
          />
          <Route path="/recce/possible-recce" element={<PossibleRecce />} />
          {/* Recce Reporting Routes */}
          <Route path="recce-started" element={<RecceReports />} />
          <Route path="recce-drafts" element={<RecceDrafts />} />
          <Route path="report/:id" element={<RecceReport />} />
          <Route path="self-assigned-recce" element={<SelfAssignedRecce />} />
          <Route
            path="/recce/recommendation/form/:id"
            element={<Recommendation />}
          />
          {/* Backward compatibility: open Total Recce when hitting new-recce */}
          <Route
            path="new-recce"
            element={<Navigate to="/recce/total-recce" replace />}
          />

          {/* Team Management Routes */}
          <Route path="team" element={<TeamManagement />} />
          <Route path="team/profile/:id" element={<ExecutiveProfile />} />
          <Route path="recce-modification" element={<RecceModification />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default SalesRoutes;
