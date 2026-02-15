import React, { useEffect, useRef, useState } from "react";
import { FaSearch, FaSignOutAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { Bell, ChevronDown, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "@/store/slices/authSlice";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import CoinsBadge from "./CoinsBadge";

const DesignProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const userData = useSelector((state) => state.auth.userData);
  // console.log("user login data is", userRole);
    // const showCoinsBadge = userRole === "executive";
// console.log(
//   "ROLE:",
//   userRole,
//   "LENGTH:",
//   userRole?.length,
//   "CHARS:",
//   [...(userRole || "")]
// );


  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const basePath = location.pathname.split("/")[1];

  // logout
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(setUserData(null));
        localStorage.removeItem("userData");
        toast.success("Logout Successfully!");
        navigate(`/${basePath}/login`);
      }
    });
  };

  return (
    <div className="relative flex items-center gap-2" ref={dropdownRef}>
      {/* {showCoinsBadge && <CoinsBadge />}{" "}   */}
      <CoinsBadge />
      {/* 🔍 Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-9 pr-3 py-2 text-sm rounded-xl
        border border-gray-300 focus:outline-none focus:ring-2
        focus:ring-indigo-400 focus:border-indigo-400"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <FaSearch size={18} />
        </span>
      </div>
      {/* 🔔 Notification Icon */}
      <button
        onClick={() => setIsNotificationOpen(!isNotificationOpen)}
        className="relative bg-gray-200 rounded-full p-2 hover:bg-gray-300 transition"
      >
        <Bell size={20} />

        {/* Notification Dot */}
        <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-75" />
      </button>
      {/* 👤 Profile Toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-3 py-2 rounded-lg 
             hover:bg-blue-100 transition cursor-pointer"
      >
        <div className="p-1 bg-gray-200 rounded-full">
          <User size={20} />
        </div>

        <ChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : "rotate-0"}`}
        />
      </button>
      {/* ⬇️ Dropdown */}
      <div
        className={`absolute right-0 top-12 w-52 bg-white/95 backdrop-blur-md
  border border-gray-200 rounded-2xl shadow-xl z-50
  transform transition-all duration-200 origin-top-right
  ${
    open
      ? "opacity-100 scale-100 translate-y-0"
      : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
  }`}
      >
        <div className="py-1">
          {/* My Profile */}
          <div
            onClick={() => {
              navigate(`/${basePath}/profile`);
              setOpen(false);
            }}
            className="mx-2 my-1 px-3 py-1.5 flex items-center gap-3 text-sm 
      rounded-xl text-slate-700 font-medium
      hover:bg-indigo-50 hover:text-indigo-600
      transition cursor-pointer"
          >
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <User size={16} />
            </div>
            My Profile
          </div>

          {/* Divider */}
          <div className="my-2 border-t border-gray-200" />

          {/* Logout */}
          <div
            onClick={handleLogout}
            className="mx-2 my-1 px-3 py-1.5 flex items-center gap-3 text-sm 
      rounded-xl font-medium text-red-600
      hover:bg-red-50 transition cursor-pointer"
          >
            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
              <FaSignOutAlt size={14} />
            </div>
            Logout
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignProfileDropdown;
