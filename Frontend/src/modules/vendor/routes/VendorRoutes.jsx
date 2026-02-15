import { Routes, Route } from "react-router-dom";
import VendorDashboard from "../pages/VendorDashboard";
import VendorLayout from "../layouts/VendorLayout";
import VendorLoginPage from "../components/VendorLoginPage";
import VendorProductPage from "../pages/VendorProductPage";
import VendorProfilePage from "../pages/VendorProfilePage";
import VendorPurchaseOrderPage from "../pages/VendorPurchaseOrderPage";
import GenerateInvoice from "../pages/GenerateInvoice";
// import PrivateRoute from "./PrivateRoute";  // import the wrapper
import VendorProductCategory from "../pages/VendorProductCategory";
import VendorAnalytics from "../pages/VendorAnalytics";
import DeparmentProtectedRoute from "@/auth/DeparmentProtectedRoute";
const VendorRoutes = () => {
  return (
    <>
   
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<VendorLoginPage />} />

  <Route
  element={
    <DeparmentProtectedRoute
      allowedUserType="VENDOR"
    />
  }
>   
   {/* <Route element={<PrivateRoute />}> */}
        <Route path="/" element={<VendorLayout />}>
          <Route path="dashboard" element={<VendorDashboard />} />
          <Route path="product" element={<VendorProductPage />} />
          <Route path="category" element={<VendorProductCategory />} />
          <Route path="profile" element={<VendorProfilePage />} />
          <Route path="analytics" element={<VendorAnalytics />} />
          <Route path="purchaseOrder/:drafts?" element={<VendorPurchaseOrderPage />} />
          <Route path="generateinvoice/:draftId?" element={<GenerateInvoice />} />
        </Route>
      {/* </Route> */}
      </Route>
    </Routes>
     </>
  );
};

export default VendorRoutes;
