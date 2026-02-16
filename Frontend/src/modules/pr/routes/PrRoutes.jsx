import React from "react";
import { Routes, Route } from "react-router-dom";
import PrLayout from "../layouts/PrLayout";
import Dashboard from "../dashboard/Dashboard";
import WorkingOnIt from "../../../components/WorkingOnIt";
import DeparmentProtectedRoute from "../../../auth/DeparmentProtectedRoute";
import PrLogin from "../login/PrLogin";
import PRDetailPage from "../common/pages/PRDetailPage";
import TodaysPR from "../common/table/TodaysPR";
const PrRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<PrLogin />} />
      <Route
        element={
              <DeparmentProtectedRoute
            allowedDepartment="Design PR"
            allowedDesignations={["HOD", "Manager", "Executive"]}
          />
        }
      >
        <Route element={<PrLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="todays-pr" element={<TodaysPR />} />
          <Route path="pr-detail/:id" element={<PRDetailPage />} />
          <Route path="*" element={<WorkingOnIt />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default PrRoutes;
