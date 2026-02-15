import { Routes, Route } from "react-router-dom";
import PageNotFound from "@/pages/PageNotFound";
import DesignLogin from "../pages/login/DesignLogin";
import DesignDashboard from "../pages/dashboard/DesignDashboard";
import DesignLayouts from "../layouts/DesignLayouts";
import ProfilePage from "../pages/profile/ProfilePage";
import ExecutiveFunnel from "../pages/funnel/ExecutiveFunnel";
import DesignsPage from "../pages/designs/DesignsPage";
import WaitingViewPage from "../pages/designs/WaitingViewPage";
import AssignedViewPage from "../pages/designs/AssignedViewPage";
import TodaysViewPage from "../pages/designs/TodaysViewPage";
import FlagRaisViewPage from "../pages/designs/FlagRaisViewPage";
import DesignWorkFlow from "../pages/design-workflow/DesignWorkFlow";
import DesignStartedViewPage from "../pages/design-workflow/DesignStartedViewPage";
import DesignOptionForm from "../pages/design-workflow/DesignOptionForm";
import DesignOptionDetails from "../pages/design-workflow/DesignOptionDetails";
import DesignModificationDetails from "../pages/design-workflow/DesignModificationDetails";
import MockupDesign from "../pages/mockup-design/MockupDesign";
import MockupStartedView from "../pages/mockup-design/MockupStartedView";
import MockupModificationView from "../pages/mockup-design/MockupModificationView";
import QuotationPage from "../pages/quotation-design/QuotationPage";
import QuotationViewPage from "../pages/quotation-design/QuotationViewPage";
import ReviewDesignSubmitPage from "../pages/quotation-design/ReviewDesignSubmitPage";
import DeparmentProtectedRoute from "@/auth/DeparmentProtectedRoute";
import DesignViewPage from "../pages/designs/manager-designs/DesignViewPage";
import DesignWorkflow from "../pages/design-workflow/manager/DesignWorkflow";
import DesignReceivedPage from "../pages/designs/manager-designs/DesignReceivedPage";
import DesignWorkflowView from "../pages/design-workflow/manager/DesignWorkflowView";
import ManagerMockupDesign from "../pages/mockup-design/manager/ManagerMockupDesign";
import MockupDesignView from "../pages/mockup-design/manager/MockupDesignView";
import DesignOptionVersions from "../pages/design-workflow/manager/DesignOptionVersions";
import SharedDesignMockupVersion from "../pages/mockup-design/manager/SharedDesignMockupVersion";
import CreateQuotation from "../pages/quotation-design/manager/CreateQuotation";
import QuotationApprovalPage from "../pages/quotation-design/manager/QuotationApprovalPage";
import MorningReporting from "../pages/reporting/executive/MorningReporting";
import EveningReporting from "../pages/reporting/executive/EveningReporting";
import ManagerMorningReporting from "../pages/reporting/manager/MorningReporting";
import ManagerEveningReporting from "../pages/reporting/manager/EveningReporting";
import DesignReviews from "../pages/design-reviews/manager/DesignReviews";
import ReviewDetails from "../pages/design-reviews/manager/ReviewDetails";
import DesignInQuotation from "../pages/design-in-quotation/DesignInQuotation";
import DesignReview from "../pages/design-reviews/executive/DesignReview";
import ReviewDetail from "../pages/design-reviews/executive/ReviewDetail";
import AllExecutives from "../pages/design-executives/AllExecutives";
import ExecutivePersonalProfile from "../pages/profile/ExecutivePersonalProfile";

const DesignRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<DesignLogin />} />

      <Route
        element={
          <DeparmentProtectedRoute
            allowedDepartment="Design"
            allowedDesignations={["Manager", "Executive"]}
            allowedUserType="EMPLOYEE"
          />
        }
      >
        <Route element={<DesignLayouts />}>
          {/* COMMON ROUTES */}
          <Route path="dashboard" element={<DesignDashboard />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="funnel" element={<ExecutiveFunnel />} />

          {/* ================= MANAGER START HERE================= */}
          <Route
            element={
              <DeparmentProtectedRoute allowedDesignations={["Manager"]} />
            }
          >
            <Route path="manager/designs/:type" element={<DesignViewPage />} />
            <Route
              path="manager/designs/workflow/:type"
              element={<DesignWorkflow />}
            />
            <Route
              path="manager/designs/received/:type/:id"
              element={<DesignReceivedPage />}
            />
            <Route
              path="manager/designs/:type/:id"
              element={<TodaysViewPage />}
            />
            <Route
              path="manager/designs/workflow/option/:id"
              element={<DesignWorkflowView />}
            />
            <Route
              path="manager/designs/workflow/version/:id"
              element={<DesignOptionVersions />}
            />
            <Route
              path="manager/designs/mockup/:type"
              element={<ManagerMockupDesign />}
            />
            <Route
              path="manager/designs/mockup/view/:id"
              element={<MockupDesignView />}
            />
            <Route
              path="manager/designs/mockup/version/:id"
              element={<SharedDesignMockupVersion />}
            />
            <Route
              path="/manager/designs/measurement-quotation/:type"
              element={<CreateQuotation />}
            />
            <Route
              path="/manager/designs/measurement-quotation-view/:id"
              element={<QuotationApprovalPage />}
            />

            <Route
              path="manager/designs/reporting/morning"
              element={<ManagerMorningReporting />}
            />
            <Route
              path="manager/designs/reporting/evening"
              element={<ManagerEveningReporting />}
            />
            <Route path="manager/designs/reviews" element={<DesignReviews />} />
            <Route
              path="manager/designs/review-details/:id"
              element={<ReviewDetails />}
            />
            <Route
              path="manager/designs/quotation"
              element={<DesignInQuotation />}
            />
            <Route
              path="manager/designs/all-executives"
              element={<AllExecutives />}
            />
              <Route
              path="manager/designs/executive-profile/:id"
              element={<ExecutivePersonalProfile />}
            />
            
          </Route>
          {/* ================= MANAGER  END================= */}

          {/* ================= EXECUTIVE START HERE ================= */}
          <Route
            element={
              <DeparmentProtectedRoute
                allowedDesignations={["Executive", "Manager"]}
              />
            }
          >
            <Route path="executive/designs/:type" element={<DesignsPage />} />
            <Route
              path="executive/designs/waiting-view/:type/:id"
              element={<WaitingViewPage />}
            />
            <Route
              path="executive/designs/assigned-view/:type/:id"
              element={<AssignedViewPage />}
            />
            <Route
              path="executive/designs/assigned-flag/:type/:id"
              element={<AssignedViewPage />}
            />
            <Route
              path="executive/designs/assigned-reject/:type/:id"
              element={<AssignedViewPage />}
            />
            <Route
              path="executive/designs/assigned-accept/:type/:id"
              element={<AssignedViewPage />}
            />
            <Route
              path="executive/designs/:type/:id"
              element={<TodaysViewPage />}
            />
            <Route
              path="executive/designs/:type/:id"
              element={<TodaysViewPage />}
            />
            <Route
              path="executive/designs/flag-raised-view/:id"
              element={<FlagRaisViewPage />}
            />
            <Route
              path="executive/designs/workflow/:type"
              element={<DesignWorkFlow />}
            />
            <Route
              path="executive/designs/workflow/view/:id"
              element={<DesignStartedViewPage />}
            />
            <Route
              path="executive/designs/workflow/design-options-view/:id"
              element={<DesignOptionDetails />}
            />
            <Route
              path="executive/designs/workflow/design-option-form/:id"
              element={<DesignOptionForm />}
            />
            <Route
              path="executive/designs/workflow/design-modification-form/:id"
              element={<DesignModificationDetails />}
            />

            <Route
              path="executive/designs/mockup/:type"
              element={<MockupDesign />}
            />
            <Route
              path="executive/designs/mockup-option-form/:id"
              element={<MockupStartedView />}
            />
            <Route
              path="executive/designs/mockup-modification-view/:id"
              element={<MockupModificationView />}
            />

            <Route
              path="executive/designs/measurement-quotation/:type"
              element={<QuotationPage />}
            />
            <Route
              path="executive/designs/quotation-view/:status/:id"
              element={<QuotationViewPage />}
            />
            <Route
              path="executive/designs/review-design-submit/:id"
              element={<ReviewDesignSubmitPage />}
            />
            <Route
              path="executive/designs/reporting/morning"
              element={<MorningReporting />}
            />
            <Route
              path="executive/designs/reporting/evening"
              element={<EveningReporting />}
            />
            <Route
              path="executive/designs/reviews"
              element={<DesignReview />}
            />
            <Route
              path="executive/designs/review-details/:id"
              element={<ReviewDetail />}
            />
          </Route>
          {/* ================= EXECUTIVE END HERE ================= */}

          {/* Empanelment End  */}
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default DesignRoutes;
