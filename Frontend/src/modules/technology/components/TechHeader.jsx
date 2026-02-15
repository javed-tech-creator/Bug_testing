import React, { useState } from "react";
import * as Icons from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import ConfirmDialog from "@/components/ConfirmationToastPopUp";
import { useGetExpiryNotificationsQuery } from "@/api/technology/dashboard.api";
import { FiRefreshCw } from "react-icons/fi";

const TechHeader = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const res = useSelector((state) => state.auth.userData);
    const userData = res?.user;
  const dispatch = useDispatch();
  // console.log("userdata is ", userData);
  const role = userData?.designation?.title; // "manager" ya "Executive"

  const {
    data,
    isLoading: notificationsLoading,
    refetch,
  } = useGetExpiryNotificationsQuery();

  const navigate = useNavigate();
  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsNotificationOpen(false);
  };

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsProfileOpen(false);
  };

  const basePath = location.pathname.split("/")[1];

    const handleLogout = () => {
      dispatch(logout());
      localStorage.clear();
      toast.success("Logout Successfully!");
      setTimeout(() => {
        navigate(`/${basePath}/login`);
      }, 500);
    };

  // Sample notifications
  const notifications = [
    {
      id: 1,
      title: "New Lead Added",
      message: "John Smith has been added to your pipeline",
      time: "2 min ago",
      type: "lead",
    },
    {
      id: 2,
      title: "Meeting Reminder",
      message: "Client call scheduled at 3:00 PM",
      time: "15 min ago",
      type: "meeting",
    },
    {
      id: 3,
      title: "Target Achieved",
      message: "Monthly sales target 85% completed",
      time: "1 hour ago",
      type: "achievement",
    },
  ];

  return (
    <div className="bg-white z-10 shadow-sm border-b fixed  w-screen border-gray-200 px-6 py-[0.80rem] flex items-center justify-end">
      {/* Right Section - Notifications and Profile */}
      <div className="flex items-center space-x-3">
        {/* Notification Bell */}

        {role === "Manager" && (
          <div className="relative">
            <button
              onClick={toggleNotification}
              className="relative text-xl focus:outline-none bg-gray-200 rounded-full p-1.5 hover:text-black/80 hover:bg-gray-300 cursor-pointer"
            >
              <Icons.Bell size={20} />

              {/* Static blue dot */}
              <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full z-10" />

              {/* Emitting blue radiation (pulsing circle) */}
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-green-400 opacity-75 animate-ping z-0" />
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 mt-4 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
                {/* Header */}
                <div className="sticky top-0 bg-white p-3 border-b border-gray-100 flex justify-between items-center rounded-t-xl">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Icons.Bell size={18} className="text-blue-500" />
                    Notifications
                    {/* Refresh Icon Button */}
                    <button
                      onClick={() => refetch()}
                      className="p-2 cursor-pointer rounded-full hover:bg-gray-200 transition"
                      title="Refresh"
                    >
                      <FiRefreshCw
                        className={`w-4 h-4 text-gray-600 ${
                          notificationsLoading ? "animate-spin" : ""
                        }`}
                        style={
                          notificationsLoading
                            ? { animationDuration: "1s" }
                            : {}
                        }
                      />
                    </button>{" "}
                  </h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {data?.notifications?.length || 0}
                  </span>
                </div>

                {/* List */}
                <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                  {(showAll
                    ? data?.notifications
                    : data?.notifications?.slice(0, 10)
                  )?.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-3 hover:bg-gray-50 transition-colors duration-150 cursor-pointer flex gap-3"
                    >
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-1">
                        <Icons.AlertCircle
                          size={20}
                          className={`${
                            notification.status === "Critical"
                              ? "text-red-500"
                              : "text-yellow-500"
                          }`}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.type}
                            <span
                              className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded-full ${
                                notification.status === "Critical"
                                  ? "bg-red-100 text-red-600"
                                  : "bg-yellow-100 text-yellow-600"
                              }`}
                            >
                              {notification.status}
                            </span>
                          </p>
                          <span className="text-[11px] text-gray-400 whitespace-nowrap">
                            {new Date(
                              notification.expiryDate
                            ).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600">
                          {notification.name}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Expiring in {notification.daysLeft} day
                          {notification.daysLeft > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Toggle Button */}
                {/* Toggle Button (Always Visible) */}
                <div className="p-2 border-t border-gray-100 bg-gray-50 rounded-b-xl">
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium py-1.5 transition-colors cursor-pointer"
                  >
                    {showAll ? "Show Less" : "View All Notifications"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {role === "Executive" && (
          <button
            disabled
            onClick={toggleNotification}
            className="relative text-xl focus:outline-none bg-gray-200 rounded-full p-1.5 hover:text-black/80 hover:bg-gray-300 cursor-pointer"
          >
            <Icons.Bell size={20} />

            {/* Static blue dot */}
            <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full z-10" />

            {/* Emitting blue radiation (pulsing circle) */}
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-green-400 opacity-75 animate-ping z-0" />
          </button>
        )}

        {/* Profile Section */}
        <div className="relative">
          <button
            onClick={toggleProfile}
            className="flex items-center space-x-3 p-1 rounded-full cursor-pointer hover:bg-gray-300 transition-colors duration-200"
          >
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <Icons.User size={16} className="text-white" />
            </div>
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-3.5 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              {/* Profile Info Section */}
              <div className="p-2 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                    <Icons.User size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {userData?.name}
                    </p>
                    <p className="text-xs text-gray-500">{userData?.designation?.title}</p>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <div className="p-1">
                <button
                  onClick={() => setOpenDialog(true)}
                  className=" cursor-pointer w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200 text-red-600"
                >
                  <Icons.LogOut size={16} />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={openDialog}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        onConfirm={() => {
          handleLogout();
          setOpenDialog(false);
        }}
        onCancel={() => setOpenDialog(false)}
      />
    </div>
  );
};

export default TechHeader;
