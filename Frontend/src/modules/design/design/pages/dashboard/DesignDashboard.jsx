import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DesignManagerDashboard from "./manager/DesignManagerDashboard";
import DesignExecutiveDashboard from "./executive/DesignExecutiveDashboard";

const DesignDashboard = () => {
  const navigate = useNavigate();

  const res = useSelector((state) => state.auth.userData);
  const userData = res?.user;
  console.log("userData", userData);

  useEffect(() => {
    if (userData === undefined) return; // redux loading
    if (userData === null) {
      navigate("/design/login", { replace: true });
    }
  }, [userData, navigate]);

  const userRole = userData?.designation?.title?.trim()?.toLowerCase();
  // console.log("userRole", userRole);

  return (
    <>

      {/* ROLE BASED DASHBOARD */}
      {userRole === "manager" && <DesignManagerDashboard />}
      {userRole === "executive" && <DesignExecutiveDashboard />}

      {/* Optional fallback */}
      {!userRole && (
        <p className="text-center mt-10 text-gray-500">Loading dashboard...</p>
      )}
    </>
  );
};

export default DesignDashboard;
