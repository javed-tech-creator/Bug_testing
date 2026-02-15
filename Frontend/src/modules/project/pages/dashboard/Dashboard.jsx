import React from "react";
import { useSelector } from "react-redux";
import CoOrdinatorDashboard from "./CoOrdinatorDashboard";
import ManagerDashboard from "./ManagerDashboard";

function Dashboard() {
    const res = useSelector((state) => state.auth.userData);
    const user = res?.user || {};
    const designation = user?.designation?.title?.toLowerCase();
    console.log(designation)
    const allowedRoles = ["manager", "coordinator"];
    // const isManager = allowedRoles.includes(designation);
    const isManager = designation == "manager";
    console.log({isManager})
    return <>{isManager ?  <ManagerDashboard />  : <CoOrdinatorDashboard />}</>;
}

export default Dashboard;

