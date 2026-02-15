import React from "react";
import StatsCards from "./components/manager/StatsCards";
import TeamPerformancePanel from "./components/manager/TeamPerformancePanel";
import TeamPerformanceChart from "./components/manager/TeamPerformanceChart";
import RecceAnalytics from "./components/manager/RecceAnalytics";
import CompletionPerExecutive from "./components/manager/CompletionPerExecutive";
import RecceOverall from "./components/manager/RecceOverall";
import HeatMapChart from "./components/manager/HeatMapChart";
import { useSelector } from "react-redux";
import ManagerDashboard from "./RecceManagerDashboard";
import SalesManagerDashboard from "../sales/SalesManagerDashboard";
import FunnelSalesDashboard from "../sales/FunnelSalesDashboard/FunnelSalesDashboard";
import SalesExecutiveDashboard from "../sales/SalesExecutiveDashboard";
import RecceExecutiveDashboard from "./RecceExecutiveDashboard";
import RecceManagerDashboard from "./RecceManagerDashboard";

function Dashboard() {
  const res = useSelector((state) => state.auth.userData);
  const user = res?.user || {};
  const designation = user?.designation?.title?.toLowerCase();
  console.log(designation);
  const managerRoles = ["manager", "recce manager", "manager", "hod"];
  const isManager = managerRoles.includes(designation);
  console.log("User Designation:", designation, "Is Manager:", isManager);

  return (
    <>{isManager ? <RecceManagerDashboard /> : <RecceExecutiveDashboard />}</>
  );
}

export default Dashboard;
