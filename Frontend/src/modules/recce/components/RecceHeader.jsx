import React, { useState, useEffect, useRef } from "react";
import * as Icons from "lucide-react";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/authSlice";

// Import the RTK Query hook
import { useGetUserNotificationsQuery } from "@/api/admin/notification.api";

const RecceHeader = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const user = userData?.user;
  const location = useLocation();

  // Gets the current role/base path (e.g., 'recce')
  const basePath = location.pathname.split("/")[1];

  // --- RTK Query Implementation ---
  const userId = user?._id;
  const skipFetching = !isNotificationOpen || !userId;

  // Use the query hook with conditional fetching (skip: skipFetching)
  const {
    data: notificationData,
    isFetching,
    isError,
    error,
  } = useGetUserNotificationsQuery(
    { userId },
    {
      skip: skipFetching,
    }
  );

  const notifications = notificationData?.data?.slice(0, 5) || [];
  // UNREAD COUNT VARIABLE REMOVED
  // const unreadCount = notificationData?.data?.filter((n) => !n.isRead).length || 0;

  // --- State Toggles ---
  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsNotificationOpen(false);
  };

  const toggleNotification = () => {
    // When opening the notification panel, this will trigger the RTK Query fetch
    setIsNotificationOpen(!isNotificationOpen);
    setIsProfileOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logout Successfully!");
    setTimeout(() => {
      // Use location.pathname to go to the login path of the current role
      navigate(`/${basePath}/login`);
    }, 500);
  };

  // --- Function to handle navigation to the full notification page ---
  const handleViewAll = () => {
    setIsNotificationOpen(false);
    navigate(`/${basePath}/notifications`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white fixed top-0 left-0 w-screen z-50 shadow-sm border-b border-gray-200 px-6 py-[0.80rem] flex items-center justify-end">
      {/* Right Section - Notifications and Profile */}
      <div className="flex items-center space-x-3">
        {/* Notification Bell */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={toggleNotification}
            className="relative mr-3 text-xl focus:outline-none bg-gray-200 rounded-full p-1.5 hover:text-black/80 hover:bg-gray-300 cursor-pointer"
          >
            <Icons.Mail size={20} />
            {/* You might want a count for unread messages here */}
          </button>

          <button
            onClick={toggleNotification}
            className="relative text-xl focus:outline-none bg-gray-200 rounded-full p-1.5 hover:text-black/80 hover:bg-gray-300 cursor-pointer"
          >
            <Icons.Bell size={20} />

            {/* Display Unread Count/Dot - REMOVED */}
            {/*
            {unreadCount > 0 && (
              <>
                <span className="absolute top-0 right-0 w-5 h-5 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center z-10 transform translate-x-1 -translate-y-1">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-400 opacity-75 animate-ping z-0 transform translate-x-1 translate-y-1" />
              </>
            )}
            */}
          </button>

          {/* Notification Panel */}
          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-40">
              <div className="p-2 border-b border-gray-100 flex justify-between items-center">
                {/* Unread count text removed from header */}
                <h3 className="text-lg font-semibold text-gray-800">
                  Notifications
                </h3>
                <Icons.X
                  size={20}
                  onClick={toggleNotification}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                />
              </div>
              <div className="max-h-72 overflow-y-auto">
                {isFetching ? (
                  <div className="p-4 text-center text-gray-500">
                    <Icons.Loader2
                      size={20}
                      className="animate-spin mx-auto mb-1"
                    />
                    Loading notifications...
                  </div>
                ) : isError ? (
                  <div className="p-4 text-center text-red-500">
                    Failed to load notifications.
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No new notifications.
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification._id || notification.id}
                      className={`p-2 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${
                        notification.isRead ? "bg-white" : "bg-blue-50/50"
                      }`}
                      // Add logic here to mark as read and navigate if clicked
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <Icons.DotIcon
                            className={
                              notification.isRead
                                ? "text-gray-400"
                                : "text-blue-600"
                            }
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium ${
                              notification.isRead
                                ? "text-gray-700 font-normal"
                                : "text-gray-900 font-semibold"
                            } line-clamp-1`}
                          >
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-500 line-clamp-2">
                            {(
                              notification.body || notification.message
                            )?.replace(/<[^>]+>/g, "")}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {/* Simple time difference logic */}
                            {new Date(
                              notification.createdAt
                            ).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-1 border-t border-gray-100">
                <button
                  onClick={handleViewAll}
                  className="w-full cursor-pointer text-center text-sm text-blue-600 hover:text-blue-800 font-medium py-2"
                >
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Section (No change needed) */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={toggleProfile}
            className="flex items-center space-x-3 p-1 rounded-full cursor-pointer hover:bg-gray-300 transition-colors duration-200"
          >
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              {user?.photo ? (
                <img
                  src={user.photo}
                  alt="Profile"
                  className="rounded-full h-8 w-8 object-cover"
                />
              ) : (
                <Icons.User size={16} className="text-white" />
              )}
            </div>
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-40">
              {/* Profile Info Section */}
              <div className="p-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                    {user?.photo ? (
                      <img
                        src={user.photo}
                        alt="Profile"
                        className="rounded-full h-10 w-10 object-cover"
                      />
                    ) : (
                      <Icons.User size={20} className="text-white" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {user?.designation?.title || "Employee"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <div className="p-1">
                <button
                  onClick={handleLogout}
                  className="cursor-pointer w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200 text-red-600"
                >
                  <Icons.LogOut size={16} />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecceHeader;
