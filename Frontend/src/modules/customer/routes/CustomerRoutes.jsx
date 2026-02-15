import { Routes, Route } from "react-router-dom";
import CustomerDashboard from "../pages/CustomerDashboard";
import CustomerLayout from "../layouts/CustomerLayout";
import CustomerLoginPage from "../pages/CustomerLoginPage";
import CustomerHomePage from "../pages/CustomerHomePage";

const CustomerRoutes = () => {
  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<CustomerHomePage />} />
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="login" element={<CustomerLoginPage />} />
      </Route>
    </Routes>
  );
};

export default CustomerRoutes;
