import React from "react";
import { Routes, Route } from "react-router-dom";
import SalesLoginPage from "../pages/SalesLoginPage";
import SalesLayout from "../layouts/SalesLayout";
import SalesHomePage from "../pages/SalesHomePage";
import LeadCaptureForm from "../pages/leadManagement/LeadCaptureForm";
import LeadView from "../pages/leadManagement/LeadView";
import PendingLead from "../pages/leadManagement/PendingLead";
import LeadAssignPage from "../pages/leadManagement/LeadAssignPage";
import LeadSheet from "../pages/leadManagement/LeadSheet";
import LeadSheetUpdatePage from "../pages/leadManagement/LeadSheetUpdatePage";
import ClientBriefingFormPage from "../pages/clientBriefing/ClientBriefingFormPage";
import WorkingOnIt from "../components/WorkingOnIt";
import SalesInFormPage from "../pages/clientBriefing/SalesInFormPage";
import ClientBriefingList from "../pages/clientBriefing/ClientBriefingList";
import SalesManagementSheet from "../pages/saleManagement/SalesManagementSheet";
import SalesManagementFormWrapper from "../pages/saleManagement/SalesManagementFormWrapper";
import AssignLeadList from "../pages/leadManagement/AssignLeadList";
import ReportingPage from "../pages/reporting/manager/SalesDepartmentReporting";
import IndivisualLeadList from "../pages/leadManagement/IndivisualLeadList";
import SalesEmployeeReport from "../pages/reporting/salesEmployee/MorningReport";
import EveningReport from "../pages/reporting/salesEmployee/EveningReport";
import SalesEmployeeDashboard from "../pages/target/salesEmployee/SalesEmployee";
import SalesEmployeeIncentive from "../pages/incentive/SalesEmployee.incentive";
import EmployeeProfile from "../pages/overview/components/ProfilePage";
import DeparmentProtectedRoute from "../../../auth/DeparmentProtectedRoute";
import ClientProfileMain from "../pages/clientProfile/ClientProfileMain";
// import QuotationFormPage from "../pages/clientProfile/tabs/quotation/QuotationFormPage";
import QuotationPage from "../pages/clientProfile/tabs/quotation/QuotationPage";
import MainPayment from "../pages/clientProfile/tabs/payment/MainPayment";
import Dashboard from "../pages/dashboard/Dashboard";
import FunnelSalesDashboard from "../pages/dashboard/FunnelSalesDashboard/FunnelSalesDashboard";
import LostLeadsList from "../pages/leadManagement/LostLeadsList";
import SalesManager from "../pages/target/manager/SalesManager";
import SalesExecutiveProfile from "../pages/overview/SalesExecutiveProfile";
import EmployeeListPage from "../pages/overview/EmployeeListPage";
import ContractorProfileView from "../pages/overview/pages/ContractorProfileView";
import FranchiseProfileView from "../pages/overview/pages/FranchiseProfileView";
import FreelancerProfileView from "../pages/overview/pages/FreelancerProfileView";
import PartnerProfileView from "../pages/overview/pages/PartnerProfileView";
import MorningReportManager from "../pages/reporting/manager/MorningReportManager";
import EveningReportManager from "../pages/reporting/manager/EveningReportManager";
import NotificationPage from "@/components/notification/NotificationPage";
import OldClientList from "../pages/oldClient/OldClientList";
import OldClientDetail from "../pages/oldClient/OldClientDetail";
import QuotationSheet from "../pages/quotation/QuotationSheet";
import Quotation from "../pages/quotation/Quotation";
const SalesRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<SalesLoginPage />} />
      <Route
        element={
          <DeparmentProtectedRoute
            allowedDepartment="Sales"
            allowedDesignations={["HOD", "Sales Team Lead", "Sales Executive"]}
          />
        }
      >
        <Route element={<SalesLayout />}>
          <Route path="working" element={<WorkingOnIt />} />
          <Route path="home" element={<SalesHomePage />} />

          {/* dashboard routes start */}

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="feed" element={<FunnelSalesDashboard />} />

          {/* dashboard routes end */}
          <Route path="leads/add" element={<LeadCaptureForm />} />
          <Route path="leads/view" element={<LeadView />} />
          <Route path="leads/sheet" element={<LeadSheet />} />
          <Route path="leads/pending" element={<PendingLead />} />
          <Route path="leads/assign/:id" element={<LeadAssignPage />} />
          <Route
            path="leads/sheet/update/:id"
            element={<LeadSheetUpdatePage />}
          />
          <Route path="leads/client-briefing" element={<SalesInFormPage />} />
          <Route
            path="leads/client-briefing-list"
            element={<ClientBriefingList />}
          />
          <Route
            path="leads/client-briefing/:id"
            element={<ClientBriefingFormPage />}
          />
          <Route
            path="sales-management-sheet"
            element={<SalesManagementSheet />}
          />
          <Route
            path="sales-management-sheet/:id"
            element={<SalesManagementFormWrapper />}
          />
          <Route path="leads/assign-lead" element={<AssignLeadList />} />
          <Route
            path="leads/indivisual-list"
            element={<IndivisualLeadList />}
          />
          <Route path="leads/lost" element={<LostLeadsList />} />

          {/* reporting Routes */}
          <Route path="reporting" element={<ReportingPage />} />
          <Route
            path="reporting/manager/morning"
            element={<MorningReportManager />}
          />
          <Route
            path="reporting/manager/evening"
            element={<EveningReportManager />}
          />
          <Route path="reporting/morning" element={<SalesEmployeeReport />} />
          <Route path="reporting/evening" element={<EveningReport />} />

          {/* performance & targets routes */}
          <Route
            path="salesEmployee/performance/target/dashboard"
            element={<SalesEmployeeDashboard />}
          />
          <Route path="performance/target" element={<SalesManager />} />
          <Route
            path="salesEmployee/performance/incentive"
            element={<SalesEmployeeIncentive />}
          />

          {/* Quotation */}
          <Route path="quotation/sheet" element={<QuotationSheet />} />
          <Route path="quotation" element={<Quotation />} />

          {/* profile overview */}

          <Route path="salesEmployee/overview" element={<EmployeeProfile />} />
          <Route
            path="salesEmployee/profile/:id"
            element={<SalesExecutiveProfile />}
          />
          <Route path="salesEmployee/list" element={<EmployeeListPage />} />

          <Route
            path="profile/contractor/:id"
            element={<ContractorProfileView />}
          />
          <Route
            path="profile/franchise/:id"
            element={<FranchiseProfileView />}
          />
          <Route
            path="profile/business-assosiates/:id"
            element={<FreelancerProfileView />}
          />
          <Route path="profile/partner/:id" element={<PartnerProfileView />} />
          <Route path="profile/vender/:id" element={<PartnerProfileView />} />

          <Route path="/client-overview/:id" element={<ClientProfileMain />} />
          <Route path="/client-overview" element={<ClientProfileMain />} />
          <Route
            path="/project/:projectId/quotation"
            element={<QuotationPage />}
          />
          <Route
            path="/project/:projectId/quotation/:quotationId"
            element={<QuotationPage />}
          />
          {/* <Route path="/project/quotation" element={<QuotationFormPage />} /> */}
          {/*  payment */}
          <Route path="/project/:projectId/payment" element={<MainPayment />} />
          <Route path="/old-client" element={<OldClientList />} />
          <Route path="/old-client/detail/:id" element={<OldClientDetail />} />

          {/* notification routes */}
          <Route path="notifications" element={<NotificationPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default SalesRoutes;
