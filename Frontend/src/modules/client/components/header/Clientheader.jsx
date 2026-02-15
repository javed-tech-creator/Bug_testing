import React, { useState, useEffect, useRef } from "react";
import * as Icons from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/authSlice";

const Clientheader = () => {
  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const res = useSelector((state) => state.auth.userData);
  const user = res?.user;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log({user});
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    <div className="bg-white z-50 shadow-sm border-b fixed w-screen border-gray-200 px-6 py-[0.80rem] flex items-center justify-end">
      {/* Right Section - Notifications and Profile */}
      <div className="flex items-center space-x-3">
        {/* Notification Bell */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={toggleNotification}
            className="relative mr-3 text-xl focus:outline-none bg-gray-200 rounded-full p-1.5 hover:text-black/80 hover:bg-gray-300 cursor-pointer"
          >
            <Icons.Mail size={20} />

            {/* <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full z-10" />
            
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-blue-400 opacity-75 animate-ping z-0" /> */}
          </button>
          <button
            onClick={toggleNotification}
            className="relative text-xl focus:outline-none bg-gray-200 rounded-full p-1.5 hover:text-black/80 hover:bg-gray-300 cursor-pointer"
          >
            <Icons.Bell size={20} />

            {/* Static blue dot */}
            <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full z-10" />

            {/* Emitting blue radiation (pulsing circle) */}
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-blue-400 opacity-75 animate-ping z-0" />
          </button>

          {/* Notification Panel */}
          {isNotificationOpen && (
           <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">

              <div className="p-2 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800">
                  Notifications
                </h3>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-2 border-b border-gray-50 hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <Icons.DotIcon className="" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-1  border-t border-gray-100">
                <button className="w-full cursor-pointer text-center text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Section */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={toggleProfile}
            className="flex items-center space-x-3 p-1 rounded-full cursor-pointer hover:bg-gray-300 transition-colors duration-200"
          >
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              {user?.photo ? (
                <div className="">
                  <img src={user?.photo} className="rounded-full h-8 w-8" />
                </div>
              ) : (
                <div className="">
                  <Icons.User size={16} className="text-white" />
                </div>
              )}
            </div>
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
         <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">

              {/* Profile Info Section */}
              <div className="p-1 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                    {user?.photo ? (
                      <div className="rounded-full h-10 w-10">
                        <img
                          src={user?.photo}
                          className="rounded-full h-10 w-10"
                        />
                      </div>
                    ) : (
                      <div className="">
                        <Icons.User size={16} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.designation?.title}
                    </p>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <div className="p-1">
                <button
                  onClick={handleLogout}
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
    </div>
  );
};

export default Clientheader;
