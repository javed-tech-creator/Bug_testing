import React, { useState } from "react";
import * as Icons from "lucide-react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import { useGetUserNotificationsQuery } from "@/api/admin/notification.api";


const SalesHeader = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const res = useSelector((state) => state.auth.userData);
  const user = res?.user
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const userId = user?._id;
  const skipFetching = !isNotificationOpen || !userId;
  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsNotificationOpen(false);
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
  
  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsProfileOpen(false);
  };

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
    )

  const notifications = notificationData?.data?.slice(0, 5) || [];

const handleNotificationPage = () => {
  console.log("Navigating to notifications page");
  setIsNotificationOpen(false);
  navigate(`/${basePath}/notifications`);
}
  return (
    <div className="bg-white z-20 shadow-sm border-b fixed  w-screen border-gray-200 px-6 py-[0.80rem] flex items-center justify-end">
      {/* Right Section - Notifications and Profile */}
      <div className="flex items-center space-x-3">

        {/* Notification Bell */}
        <div className="relative">
         
          <button
            onClick={toggleNotification}
            className="relative text-xl focus:outline-none bg-gray-200 rounded-full p-1.5 hover:text-black/80 hover:bg-gray-300 cursor-pointer"
          >
            <Icons.Bell size={20} />

            {/* Static orange dot */}
            <span className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full z-10" />

            {/* Emitting orange radiation (pulsing circle) */}
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-orange-400 opacity-75 animate-ping z-0" />
          </button>



          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
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
              <div className="max-h-72  overflow-y-auto">
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
                    onClick={handleNotificationPage}
                      key={notification._id || notification.id}
                      className={`p-2 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${notification.isRead ? "bg-white" : "bg-orange-50/50"
                        }`}
                    // Add logic here to mark as read and navigate if clicked
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <Icons.DotIcon
                            className={
                              notification.isRead
                                ? "text-gray-400"
                                : "text-orange-600"
                            }
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium ${notification.isRead
                                ? "text-gray-700 font-normal"
                                : "text-gray-900 font-semibold"
                              } line-clamp-1`}
                          >
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-500 line-clamp-1">
                            {(
                              notification.body || notification.message || notification.description
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
              <div className="p-2 text-right border-t border-gray-100">
                <button onClick={handleNotificationPage} className="w-full cursor-pointer text-center text-sm text-orange-600 hover:text-orange-700 font-medium">
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Section */}
        <div className="relative">
          <button
            onClick={toggleProfile}
            className="flex items-center space-x-3 p-1 rounded-full cursor-pointer hover:bg-gray-300 transition-colors duration-200"
          >
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              {user?.photo ? (<div className=""><img src={user?.photo} className="rounded-full h-8 w-8" /></div>) : (<div className=""><Icons.User size={16} className="text-white" /></div>)}
            </div>
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute  right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 ">
              {/* Profile Info Section */}
              <div className="p-1 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                    {user?.photo ? (<div className="rounded-full h-10 w-10"><img src={user?.photo} className="rounded-full h-10 w-10" /></div>) : (<div className=""><Icons.User size={16} className="text-white" /></div>)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500">{user?.designation?.title}</p>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <div className="p-1">
                <button onClick={handleLogout} className=" cursor-pointer w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200 text-red-600">
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

export default SalesHeader;