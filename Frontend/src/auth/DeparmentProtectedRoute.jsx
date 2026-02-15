import React, { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { logout } from "@/store/slices/authSlice";
const DeparmentProtectedRoute = ({
  allowedDepartment,
  allowedDesignations = [],
  allowedUserType = "",
}) => {
  const location = useLocation();
  const basePath = location.pathname.split("/")[1];
  const toastShown = useRef(false);
  const dispatch = useDispatch();
  const [unauthorizedMsg, setUnauthorizedMsg] = useState(null);
  const [authError, setAuthError] = useState(null);

  const userData = useSelector((state) => state.auth.userData);
  const user = userData?.user;

  const userDept = user?.department?.title.trim();
  const userDesignation = user?.designation?.title?.toLowerCase()?.trim();

  // Use effect to handle authorization checks and side effects
  useEffect(() => {
    let errorMsg = null;

    if (!userDept || !userDesignation) {
      errorMsg = "Login required";
    } else if (allowedDepartment && userDept !== allowedDepartment) {
      errorMsg = "Access denied: department mismatch";
    } else if (allowedUserType && user?.type !== allowedUserType) {
      errorMsg = "Access denied: invalid Vendor";
    } else if (
      allowedDesignations.length > 0 &&
      !allowedDesignations.some((d) =>
        userDesignation.includes(d.toLowerCase())
      )
    ) {
      errorMsg = "Access denied: unauthorized designation";
    }

    setAuthError(errorMsg);
  }, [
    userDept,
    userDesignation,
    allowedDepartment,
    allowedUserType,
    allowedDesignations,
    user?.type,
  ]);

  // Use effect to handle unauthorized access side effects
  useEffect(() => {
    if (authError && !toastShown.current) {
      toast.error(authError);
      toastShown.current = true;
      dispatch(logout());
    }
  }, [authError, dispatch]);

  if (authError) {
    return <Navigate to={`/${basePath}/login`} replace />;
  }

  return <Outlet />;
};

export default DeparmentProtectedRoute;
