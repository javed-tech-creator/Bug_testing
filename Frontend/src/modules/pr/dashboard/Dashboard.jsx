import React from "react";
import { useSelector } from "react-redux";
import ExecutiveDashboard from "./ExecutiveDashboard/Pages/ExecutiveDashboard";
import ManagerDashboard from "./ManagerDashboard/Pages/ManagerDashboard";

function Dashboard() {
  const res = useSelector((state) => state.auth.userData);
  const user = res?.user || {};
  const designation = user?.designation?.title?.toLowerCase();
  const managerRoles = ["manager", "pr manager", "hod"];
  // Check if designation includes these roles or contains "manager"
  const isManager =
    managerRoles.includes(designation) || designation?.includes("manager");
  return <>{isManager ? <ManagerDashboard /> : <ExecutiveDashboard />}</>;
}
export default Dashboard;
