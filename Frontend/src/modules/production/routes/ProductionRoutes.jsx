import { Routes, Route } from "react-router-dom";
import PageNotFound from "@/pages/PageNotFound";
import ProductionLayouts from "../layouts/ProductionLayouts";
import ProductionLogin from "../pages/login/ProductionLogin";
import ProductionDashboard from "../pages/dashboard/ProductionDashboard";
import JobCard from "../pages/job-card/JobCard";


const ProductionRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<ProductionLogin />} />

      <Route element={<ProductionLayouts />}>
        <Route path="dashboard" element={<ProductionDashboard />} />
        <Route path="jobcard" element={<JobCard />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};

export default ProductionRoutes;
