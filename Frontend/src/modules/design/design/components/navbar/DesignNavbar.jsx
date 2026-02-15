import React, { useEffect, useState } from "react";
import DesignProfileDropdown from "./DesignProfileDropdown";
import { setUserData } from "@/store/slices/authSlice";
import { useSelector } from "react-redux";
import { LiveClock } from "./LiveClock";
import { useNavigate } from "react-router-dom";

export default function DesignNavbar() {
  const userData = useSelector((state) => state.auth.userData);
      // console.log("userData",userData);

// const navigate = useNavigate();
//     useEffect(() => {
//         if (userData === undefined) return; // redux loading
//         if (userData === null) {
//           navigate("/design/login", { replace: true });
//         }
//       }, [userData, navigate]);
  
//     const userRole = userData?.user?.designation?.title?.trim()?.toLowerCase();
    // console.log("userRole",userRole);
    


  return (
    <header className="bg-white z-50 shadow-sm border-b fixed w-screen border-gray-200 px-6 py-[0.80rem] flex items-center">
      <div className="ml-64 w-[calc(100%-16rem)] flex items-center justify-between">
        {/* Name + Date Time */}
        <div className="flex flex-col text-left whitespace-nowrap">
          <span className="text-xl font-bold text-gray-900 leading-tight truncate max-w-[200px]">
            {userData?.user?.name}
          </span>

          <LiveClock />
        </div>

        {/* Profile Dropdown */}
        <div className="flex-shrink-0">
          <DesignProfileDropdown />
        </div>
      </div>
    </header>
  );
}
