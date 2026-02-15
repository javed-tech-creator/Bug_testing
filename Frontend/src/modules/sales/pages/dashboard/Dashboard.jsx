import React from "react";
import { useSelector } from "react-redux";
import SalesManagerDashboard from "./SalesManagerDashboard";
import SalesExecutiveDashboard from "./SalesExecutiveDashboard";

function Dashboard() {
  const res = useSelector((state) => state.auth.userData);
  const user = res?.user || {};
  const designation = user?.designation?.title?.toLowerCase();
console.log(designation)
const managerRoles = ["team lead", "sales manager", "sales team lead"];
const isManager = managerRoles.includes(designation);
console.log(isManager)
  return <>{isManager ? <SalesManagerDashboard /> : <SalesExecutiveDashboard />}</>;
}

export default Dashboard;

