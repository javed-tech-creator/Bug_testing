import React, { useEffect, useRef, useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { ChevronDown, User } from "lucide-react";
// import ConfirmDialog from "@/components/ConfirmationToastPopUp";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "@/store/slices/authSlice";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ProductionProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch()
  
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
  const userData = useSelector((state) => state.auth.userData);
console.log("user login data is",userData);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Toggle */}
      <div
        className="flex items-center gap-1 px-3 py-2 rounded-lg cursor-pointer 
               hover:bg-blue-100 hover:text-black transition-all duration-200"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center">
          <div className="p-1 bg-gray-200 rounded-full">
            <User className="w-5 h-5 text-black" />
          </div>
        </div>

        <ChevronDown
          className={`w-4 h-4 transition-transform duration-300 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>

      {/* Dropdown Panel */}
      <div
        className={`absolute top-14 -right-4 md:right-0 w-52 sm:w-64 
      bg-white/80 backdrop-blur-lg border border-gray-200 rounded-xl shadow-lg 
      z-50 transform origin-top-right transition-all duration-300 ease-out
      ${
        open
          ? "scale-100 opacity-100 pointer-events-auto"
          : "scale-95 opacity-0 pointer-events-none"
      }`}
      >
        {/* User Info */}
        <div className="p-4 border-b border-gray-200">
          <p className="font-semibold text-gray-900">{userData?.user?.name}</p>
          <p className="text-sm text-gray-500 truncate">
            {userData?.user?.email}
          </p>
        </div>

        {/* Actions */}
        <div
          className="px-4 py-2 flex items-center gap-3 text-sm font-medium 
                 text-red-600 hover:bg-red-50 hover:text-red-700 
                 cursor-pointer rounded-b-xl transition-colors"
          onClick={() =>handleLogout()}
        >
          <FaSignOutAlt /> Sign out
        </div>
      </div>
    </div>
  );
};

export default ProductionProfileDropdown;
