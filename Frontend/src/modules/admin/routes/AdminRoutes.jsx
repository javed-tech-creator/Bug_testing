import { Routes, Route } from "react-router-dom";
import AdminLogin from "../pages/login/AdminLogin";
import AdminLayouts from "../layouts/AdminLayouts";
import PageNotFound from "@/pages/PageNotFound";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import LocationHeirarchy from "../pages/department-management/location-heirarchy/LocationHeirarchy";
import DepartmentDesignationManagement from "../pages/department-management/department-designation/DepartmentDesignationManagement";
import UserManagement from "../pages/user-management/UserManagement";
import ProductManagement from "../pages/product-management/ProductManagement";
import ProductFormPage from "../pages/product-management/ProductFormPage";
import UserControl from "../pages/user-control/UserControl";
import ProductWorkDetailsPage from "../pages/product-management/ProductWorkDetailsPage";
import VendorManagement from "../pages/vendor-management/VendorManagement";
import ContractorManagement from "../pages/contractor-management/ContractorManagement";
import FreelancerManagement from "../pages/freelancer-management/FreelancerManagement";
import PartnerManagement from "../pages/partner-management/PartnerManagement";
import FranchiseManagement from "../pages/franchise-management/FranchiseManagement";
import VendorManagementForm from "../pages/vendor-management/VendorManagementForm";
import VendorProfileView from "../pages/vendor-management/VendorProfileView";
import ContractorManagementForm from "../pages/contractor-management/ContractorManagementForm";
import ContractorProfileView from "../pages/contractor-management/ContractorProfileView";
import FreelancerManagementForm from "../pages/freelancer-management/FreelancerManagementForm";
import FreelancerProfileView from "../pages/freelancer-management/FreelancerProfileView";
import PartnerManagementForm from "../pages/partner-management/PartnerManagementForm";
import PartnerProfileView from "../pages/partner-management/PartnerProfileView";
import FranchiseManagementForm from "../pages/franchise-management/FranchiseManagementForm";
import FranchiseProfileView from "../pages/franchise-management/FranchiseProfileView";
import UserProfileView from "../pages/user-management/UserProfileView";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />

      <Route element={<AdminLayouts />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="location-hierarchy" element={<LocationHeirarchy />} />
        <Route
          path="department-designation"
          element={<DepartmentDesignationManagement />}
        />
        <Route path="user-control" element={<UserControl />} />
        <Route path="user-management" element={<UserManagement />} />
        <Route path="user-management/profile/:id" element={<UserProfileView />} />
        <Route path="product-management" element={<ProductManagement />} />
        <Route
          path="product-management/view/:id"
          element={<ProductWorkDetailsPage />}
        />
        <Route
          path="product-management/add/:productId"
          element={<ProductFormPage mode="add" />}
        />
        <Route
          path="product-management/edit/:productId"
          element={<ProductFormPage mode="edit" />}
        />
        {/* Empanelment start  */}
        <Route path="vendor-management" element={<VendorManagement />} />
        <Route
          path="vendor-management/form"
          element={<VendorManagementForm />}
        />
        <Route
          path="vendor-management/form/:id"
          element={<VendorManagementForm />}
        />
        <Route
          path="vendor-management/profile/:id"
          element={<VendorProfileView />}
        />
        <Route
          path="contractor-management"
          element={<ContractorManagement />}
        />
        <Route
          path="contractor-management/form"
          element={<ContractorManagementForm />}
        />{" "}
        <Route
          path="contractor-management/form/:id"
          element={<ContractorManagementForm />}
        />{" "}
        <Route
          path="contractor-management/profile/:id"
          element={<ContractorProfileView />}
        />
        <Route
          path="freelancer-management"
          element={<FreelancerManagement />}
        />
        <Route
          path="freelancer-management/form"
          element={<FreelancerManagementForm />}
        />
        <Route
          path="freelancer-management/form/:id"
          element={<FreelancerManagementForm />}
        />{" "}
        <Route
          path="freelancer-management/profile/:id"
          element={<FreelancerProfileView />}
        />
        <Route path="partner-management" element={<PartnerManagement />} />
        <Route
          path="partner-management/form"
          element={<PartnerManagementForm />}
        />
        <Route
          path="partner-management/form/:id"
          element={<PartnerManagementForm />}
        />
        <Route
          path="partner-management/profile/:id"
          element={<PartnerProfileView />}
        />
        <Route path="franchise-management" element={<FranchiseManagement />} />
        <Route
          path="franchise-management/form"
          element={<FranchiseManagementForm />}
        />
        <Route
          path="franchise-management/form/:id"
          element={<FranchiseManagementForm />}
        />
        <Route
          path="franchise-management/profile/:id"
          element={<FranchiseProfileView />}
        />
        {/* Empanelment End  */}
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
