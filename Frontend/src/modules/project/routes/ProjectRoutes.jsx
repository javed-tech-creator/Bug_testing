import React from "react";
import { Routes, Route } from "react-router-dom";

// import Dashboard from "../pages/coordinator/dashboard/Dashboard";
import WorkingOnIt from "@/components/WorkingOnIt";
import AssignedProjects from "../pages/coordinator/tables/AssignedProjects";
import LostProjectsPage from "../pages/coordinator/tables/LostProjectsPage";
import WaitingWorkPage from "../pages/coordinator/tables/WaitingWorkPage";
import FlagRaisedPage from "../pages/coordinator/tables/FlagRaisedPage";
import RepairsPage from "../pages/coordinator/tables/RepairsPage";
import ComplaintsPage from "../pages/coordinator/tables/ComplaintsPage";
import DispatchDepartment from "../pages/coordinator/tables/DispatchDepartment";
import InstallationDepartment from "../pages/coordinator/tables/InstallationDepartment";
import ProductionDepartment from "../pages/coordinator/tables/ProductionDepartment";
import PRDepartment from "../pages/coordinator/tables/PRDepartment";
import QuotationDepartment from "../pages/coordinator/tables/QuotationDepartment";
import DesignDepartment from "../pages/coordinator/tables/DesignDepartment";
import RecceDepartment from "../pages/coordinator/tables/RecceDepartment";

import DepartmentOverview from "../pages/coordinator/components/DepartmentOverview";
import ProjectLogin from "../pages/login/ProjectLogin";
import ProjectLayout from "../layouts/ProjectLayout";
import SalesDepartment from "../pages/coordinator/tables/SalesDepartment";
import FlagResolutionPage from "../pages/coordinator/components/FlagResolutionPage";
import FlexSignBoard from "../pages/coordinator/components/FlexSignBoard";
import RecceDepartmentTable from "../pages/coordinator/departmentoverviewtable/RecceDepartmentTable";
import SalesDepartmentTable from "../pages/coordinator/departmentoverviewtable/SalesDepartmentTable";
import PRDepartmentTable from "../pages/coordinator/departmentoverviewtable/PRDepartmentTable";
import ProductionDepartmentTable from "../pages/coordinator/departmentoverviewtable/ProductionDepartmentTable";
import InstallationDepartmentTable from "../pages/coordinator/departmentoverviewtable/InstallationDepartmentTable";
import ComplaintsDepartmentTable from "../pages/coordinator/departmentoverviewtable/ComplaintsDepartmentTable";
import DispatchDepartmentTable from "../pages/coordinator/departmentoverviewtable/DispatchDepartmentTable";
import DesignDepartmentTable from "../pages/coordinator/departmentoverviewtable/DesignDepartmentTable";
import QuotationDepartmentTable from "../pages/coordinator/departmentoverviewtable/QuotationDepartmentTable";
import RepairsDepartmentTable from "../pages/coordinator/departmentoverviewtable/RepairsDepartmentTable";
import DeparmentProtectedRoute from "@/auth/DeparmentProtectedRoute";

import Dashboard from "../pages/dashboard/Dashboard";
import ManagerDepartmentOverView from "../pages/manager/department-overview/DepartmentOverView";
import ManagerSalesIntake from "../pages/manager/components/ManagerSalesIntake";
import ManagerAssignedProjects from "../pages/manager/components/ManagerAssignedProjects";
import ManagerRecceDepartment from "../pages/manager/components/ManagerRecceDepartment";
import ManagerDesignDepartment from "../pages/manager/components/DesignDepartment";
import ManagerQuotationDepartment from "../pages/manager/components/QuotationDepartment";
import ManagerPrDepartment from "../pages/manager/components/PrDepartment";
import ManagerProductionDepartment from "../pages/manager/components/ProductionDepartment";
import ManagerInstallationDepartment from "../pages/manager/components/InstallationDepartment";
import ManagerDispatchDepartment from "../pages/manager/components/DispatchDepartment";
import ManagerComplaints from "../pages/manager/components/Complaints";
import ManagerRepair from "../pages/manager/components/Repair";
import ManagerFlagRaised from "../pages/manager/components/FlagRaised";
import FlagResolution from "../pages/manager/components/FlagResolution";
import CoOrdinator from "../pages/manager/components/CoOrdinator";
import CoOrdinatorProfile from "../pages/manager/components/CoOrdinatorProfile";
import NewFlexPage from "../pages/coordinator/components/NewFlexPage";
import SalesDepartmentPage from "../pages/manager/components/SalesDepartment";
import RecceDepartmentPage from "../pages/manager/components/RecceDepartment";
import DesignDepartmentPage from "../pages/manager/components/DesignDepartmentPage";
import QuotationDepartmentPage from "../pages/manager/components/QuotationDepartmentPage";
import PrDepartmentPage from "../pages/manager/components/PrDepartmentPage";
import ProductionDepartmentPage from "../pages/manager/components/ProductionDepartmentPage";
import InstallationDepartmentPage from "../pages/manager/components/InstallationDepartmentPage";
import DispatchDepartmentPage from "../pages/manager/components/DispatchDepartmentPage";
import ComplaintDepartmentPage from "../pages/manager/components/ComplaintDepartmentPage";
import RepairDepartmentPage from "../pages/manager/components/RepairDepartmentPage";
import RecceDetailPage from "../pages/coordinator/detailpages/RecceDetailPage";
import QuotationDetailPages from "../pages/coordinator/detailpages/QuotationDetailPages";
import DesignDetailPage from "../pages/coordinator/detailpages/DesignDetailPage";
import PSLPage from "../pages/psl/PSLPage";
import PSLUpdatePage from "../pages/psl/PSLUpdatePage";
export default function ProjectRoutes() {
  return (
    <Routes>
      <Route path="login" element={<ProjectLogin />} />

      <Route
        element={
          <DeparmentProtectedRoute
            allowedDepartment="Project"
            allowedDesignations={["Manager", "CoOrdinator"]}
            allowedUserType="EMPLOYEE"
          />
        }
      >
        <Route element={<ProjectLayout />}>
          {/* ================ COMMON ROUTES ============= */}
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="waiting-works" element={<WaitingWorkPage />} />
          <Route path="lost-projects" element={<LostProjectsPage />} />

          {/* ================= Co-Ordinator START HERE================= */}
          <Route
            element={
              <DeparmentProtectedRoute allowedDesignations={["CoOrdinator"]} />
            }
          >
            <Route
              path="department-overview"
              element={<DepartmentOverview />}
            />
            <Route path="assigned-projects" element={<AssignedProjects />} />
            <Route path="next-day/recce" element={<RecceDepartment />} />
            <Route path="next-day/design" element={<DesignDepartment />} />
            <Route
              path="next-day/quotation"
              element={<QuotationDepartment />}
            />
            <Route path="next-day/pr" element={<PRDepartment />} />
            <Route
              path="next-day/production"
              element={<ProductionDepartment />}
            />
            <Route
              path="next-day/installation"
              element={<InstallationDepartment />}
            />
            <Route path="next-day/dispatch" element={<DispatchDepartment />} />
            <Route path="next-day/complaint" element={<ComplaintsPage />} />
            <Route path="next-day/repair" element={<RepairsPage />} />

            <Route path="flag-raised" element={<FlagRaisedPage />} />
            <Route
              path="flag-raised/flag-resolution/:flagId"
              element={<FlagResolutionPage />}
            />
            <Route path="recce-detail" element={<RecceDetailPage />} />
            <Route path="recce-detail/:id" element={<RecceDetailPage />} />
            <Route path="quotation-detail" element={<QuotationDetailPages />} />
            <Route
              path="quotation-detail/:id"
              element={<QuotationDetailPages />}
            />
            <Route path="flex-sign-board" element={<FlexSignBoard />} />
            <Route path="new-flex-sign-board" element={<NewFlexPage />} />
            <Route path="psl" element={<PSLPage />} />
            <Route path="psl-update/:id" element={<PSLUpdatePage />} />
            <Route path="design-detail" element={<DesignDetailPage />} />
            <Route path="design-detail/:id" element={<DesignDetailPage />} />
            <Route
              path="recce-department-table"
              element={<RecceDepartmentTable />}
            />
            <Route
              path="sales-department-table"
              element={<SalesDepartmentTable />}
            />
            <Route path="pr-department-table" element={<PRDepartmentTable />} />
            <Route
              path="production-department-table"
              element={<ProductionDepartmentTable />}
            />
            <Route
              path="installation-department-table"
              element={<InstallationDepartmentTable />}
            />
            <Route
              path="complaints-department-table"
              element={<ComplaintsDepartmentTable />}
            />
            <Route
              path="repairs-department-table"
              element={<RepairsDepartmentTable />}
            />
            <Route
              path="dispatch-department-table"
              element={<DispatchDepartmentTable />}
            />
            <Route
              path="design-department-table"
              element={<DesignDepartmentTable />}
            />
            <Route
              path="quotation-department-table"
              element={<QuotationDepartmentTable />}
            />
            <Route path="lost-projects" element={<LostProjectsPage />} />
            <Route path="sales-department" element={<SalesDepartment />} />
            <Route path="*" element={<WorkingOnIt />} />
          </Route>

          {/* ================= Manager START HERE================= */}
          <Route
            element={
              <DeparmentProtectedRoute allowedDesignations={["Manager"]} />
            }
          >
            {/* <Route path="/dashboard" element={<ManagerDashboard />} /> */}
            <Route
              path="manager/department"
              element={<ManagerDepartmentOverView />}
            />
            <Route
              path="manager/department/sales"
              element={<SalesDepartmentPage />}
            />
            <Route
              path="manager/department/recce"
              element={<RecceDepartmentPage />}
            />
            <Route
              path="manager/department/design"
              element={<DesignDepartmentPage />}
            />
            <Route
              path="manager/department/quotation"
              element={<QuotationDepartmentPage />}
            />
            <Route
              path="manager/department/pr"
              element={<PrDepartmentPage />}
            />
            <Route
              path="manager/department/production"
              element={<ProductionDepartmentPage />}
            />
            <Route
              path="manager/department/installation"
              element={<InstallationDepartmentPage />}
            />
            <Route
              path="manager/department/dispatch"
              element={<DispatchDepartmentPage />}
            />
            <Route
              path="manager/department/complaint"
              element={<ComplaintDepartmentPage />}
            />
            <Route
              path="manager/department/repair"
              element={<RepairDepartmentPage />}
            />

            <Route
              path="manager/sales-intake"
              element={<ManagerSalesIntake />}
            />
            <Route
              path="manager/assigned-projects"
              element={<ManagerAssignedProjects />}
            />
            <Route path="manager/recce" element={<ManagerRecceDepartment />} />
            <Route
              path="manager/design"
              element={<ManagerDesignDepartment />}
            />
            <Route
              path="manager/quotation"
              element={<ManagerQuotationDepartment />}
            />
            <Route path="manager/pr" element={<ManagerPrDepartment />} />
            <Route
              path="manager/production"
              element={<ManagerProductionDepartment />}
            />
            <Route
              path="manager/installation"
              element={<ManagerInstallationDepartment />}
            />
            <Route
              path="manager/dispatch"
              element={<ManagerDispatchDepartment />}
            />
            <Route path="manager/complaint" element={<ManagerComplaints />} />
            <Route path="manager/repair" element={<ManagerRepair />} />
            <Route path="manager/flag-raised" element={<ManagerFlagRaised />} />
            <Route
              path="manager/flag-resolution/:id"
              element={<FlagResolution />}
            />
            <Route path="/co-ordinator" element={<CoOrdinator />} />
            <Route path="/co-ordinator/:id" element={<CoOrdinatorProfile />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
