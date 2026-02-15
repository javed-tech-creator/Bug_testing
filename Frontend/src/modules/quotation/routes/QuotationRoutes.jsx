import React from "react";
import { Routes, Route } from "react-router-dom";
import QuotationLoginPage from "../pages/login/QuotationLogin";
import QuatationLayout from "../layouts/QuatationLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import WorkingOnIt from "@/components/WorkingOnIt";
import QuotationTable from "../pages/QuotationTable";
import PaymentReceipt from "../components/PaymentReceipt";
import AssignedQuotations from "../components/AssignedQuotations";
import AssignedQuotationDetailPage from "../pages/AssignedQuotationDetailPage";
import FlagRaisedQuotations from "../components/FlagRaisedQuotations";
import DeclinedQuotations from "../components/DeclinedQuotations";
import FlagRaisedDetail from "../pages/FlagRaisedDetail";
import LostQuotations from "../components/LostQuotations";
import WaitingQuotations from "../components/WaitingQuotations";
import ReceivedQuotations from "../components/ReceivedQuotations";
import QuotationsInReview from "../components/QuotationsInReview";
import QuotationPage from "../pages/QuotationPage";
import QuotationFormPage from "../pages/QuotationFormPage";
import AcceptedQuotationPage from "../pages/AcceptedQuotationPage";
import QuotationForm from "../pages/QuotationForm";
import MorningReport from "../pages/daily-report/MorningReport";
import EveningReport from "../pages/daily-report/EveningReport";
import PSLUpdatePage from "../pages/PSLUpdatePage";
import PSLPage from "../pages/PSLPage";
import TodaysQuotations from "../components/tables/TodaysQuotations";
import UpcomingQuotations from "../pages/UpcomingQuotations";
import NextDayPlanningQuotations from "../components/tables/NextDayPlanningQuotations";
import UpcomingQuotationDetailPage from "../pages/UpcomingQuotationDetailPage";
import DeparmentProtectedRoute from "@/auth/DeparmentProtectedRoute";
import DesignInQuotation from "../pages/DesignInQuotation";
import TeamManagement from "../pages/TeamManagement";
import ManagerProfile from "../pages/ManagerProfile";
import EveningQuotationManager from "../pages/daily-report/manager/EveningQuotationManager";
import MorningQuotationManager from "../pages/daily-report/manager/MorningQuotationManager";
import EveningQuotationTeam from "../pages/daily-report/manager/EveningQuotationTeam";
import MorningQuotationTeam from "../pages/daily-report/manager/MorningQuotationTeam";
const QuotationRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<QuotationLoginPage />} />
      <Route
        element={
          <DeparmentProtectedRoute
            allowedDepartment="Quotation"
            allowedDesignations={["HOD", "Manager", "Executive"]}
          />
        }
      >
        <Route element={<QuatationLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="team-management" element={<TeamManagement />} />
          <Route path="manager-profile/:id" element={<ManagerProfile />} />
          <Route path="table" element={<QuotationTable />} />
          <Route path="design-in-quotation" element={<DesignInQuotation />} />  
          <Route path="payment-receipt" element={<PaymentReceipt />} />
          <Route path="assigned-quotations" element={<AssignedQuotations />} />
          <Route path="flag-raised" element={<FlagRaisedQuotations />} />
          <Route path="flag-escalate/:id" element={<FlagRaisedDetail />} />
          <Route path="declined" element={<DeclinedQuotations />} />
          <Route path="lost" element={<LostQuotations />} />
          <Route path="waiting" element={<WaitingQuotations />} />
          <Route path="received" element={<ReceivedQuotations />} />
          <Route path="review" element={<QuotationsInReview />} />
          <Route path="quotation-page" element={<QuotationPage />} />
          <Route path="quotation-form-page" element={<QuotationFormPage />} />
          <Route path="psl" element={<PSLPage />} />
          <Route path="psl-update/:id" element={<PSLUpdatePage />} />
          <Route
            path="accepted-quotation-page/:id"
            element={<AcceptedQuotationPage />}
          />
          <Route path="form/:id" element={<QuotationForm />} />
          <Route
            path="assigned-quotations/:id"
            element={<AssignedQuotationDetailPage />}
          />
          <Route
            path="quotation-detail/:id"
            element={<AssignedQuotationDetailPage />}
          />
          <Route path="todays-quotations" element={<TodaysQuotations />} />
          <Route path="upcoming-quotations" element={<UpcomingQuotations />} />
          <Route path="next-quotations" element={<NextDayPlanningQuotations />} />
          <Route path="morning-report" element={<MorningReport />} />
          <Route path="evening-report" element={<EveningReport />} />
          <Route path="upcoming-quotations/:id" element={<UpcomingQuotationDetailPage />} />
          <Route path="morning-quotation-manager" element={<MorningQuotationManager />} />
          <Route path="evening-quotation-manager" element={<EveningQuotationManager />} />
          <Route path="morning-quotation-team" element={<MorningQuotationTeam />} />
          <Route path="evening-quotation-team" element={<EveningQuotationTeam />} />
          <Route path="*" element={<WorkingOnIt />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default QuotationRoutes;
