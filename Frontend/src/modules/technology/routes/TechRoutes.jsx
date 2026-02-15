import { Routes, Route } from "react-router-dom";
import TechLoginPage from "../pages/TechLoginPage";
import TechLayout from "../layouts/TechLayout";
import WorkingOnIt from "../../../components/WorkingOnIt";
import TechDashboard from "../pages/dashboard/TechDashboard";
import PageNotFound from "../../../pages/PageNotFound";
import AllAssetList from "../pages/asset/AllAssetList";
import AssetAddForm from "../pages/asset/AssetAddForm";
import AllSoftwareLicenseList from "../pages/SoftwareLicense.jsx/AllSoftwareLicenseList";
import LicenseAddForm from "../pages/SoftwareLicense.jsx/SoftwareLicenseAddForm";
import AllTickeLists from "../pages/helpdesk/AllTickeLists";
import NetworkInfrastructureList from "../pages/networkingInfrastructure/NetworkInfrastructureList";
import DeviceAddForm from "../pages/networkingInfrastructure/NetworkInfrastructureForm";
import VendorAmcManagementList from "../pages/vendorAmcManagment/VendorAmcManagementList";
import VendorAddForm from "../pages/vendorAmcManagment/VendorAmcManagementForm";
import DataAccessAndControl from "../pages/dataSecurityandAccessControl/DataAccessAndControl";
import AccessAddForm from "../pages/dataSecurityandAccessControl/dataSecurityandAccessForm";
import EmployeeAssetList from "../pages/asset/EmployeeAssetList";
import EmployeeTicketList from "../pages/helpdesk/EmployeeTicketList";
import AllSoftwareEmpoloyeeList from "../pages/SoftwareLicense.jsx/AllSoftwareEmpoloyeeList";
import DeparmentProtectedRoute from "@/auth/DeparmentProtectedRoute";
// import TicketAddForm from "../pages/helpdesk/TicketRaisForm";

const TechRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<TechLoginPage />} />

      <Route
        element={
          <DeparmentProtectedRoute
            allowedDepartment="Technology"
            allowedDesignations={["Manager", "Executive"]}
            allowedUserType="EMPLOYEE"
          />
        }
      >
        <Route element={<TechLayout />}>
          <Route path="working" element={<WorkingOnIt />} />
          <Route path="dashboard" element={<TechDashboard />} />
          <Route path="*" element={<PageNotFound />} />
          <Route path="assets/list" element={<AllAssetList />} />
          <Route path="employee-assets/list" element={<EmployeeAssetList />} />
          <Route path="assets/add" element={<AssetAddForm />} />
          <Route
            path="software-license/list"
            element={<AllSoftwareLicenseList />}
          />
          <Route
            path="software-license-employee/list"
            element={<AllSoftwareEmpoloyeeList />}
          />
          <Route path="software-license/add" element={<LicenseAddForm />} />
          <Route path="tickets-helpdesk/list" element={<AllTickeLists />} />
          <Route
            path="employee-tickets/list"
            element={<EmployeeTicketList />}
          />
          <Route
            path="network-infrastructure/list"
            element={<NetworkInfrastructureList />}
          />
          VendorAddForm
          <Route
            path="network-infrastructure/add"
            element={<DeviceAddForm />}
          />
          <Route
            path="vendor-amc-management/list"
            element={<VendorAmcManagementList />}
          />
          <Route path="vendor-amc-management/add" element={<VendorAddForm />} />
          <Route
            path="data-access-control/list"
            element={<DataAccessAndControl />}
          />
          <Route path="data-access-control/add" element={<AccessAddForm />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default TechRoutes;
