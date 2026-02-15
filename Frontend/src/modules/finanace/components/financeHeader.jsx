import React, { useEffect, useState, useRef } from "react";
import * as Icons from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../store/AuthContext";
import { useGetQuotationsQuery } from "@/api/finance/Quatation_Billing/quatation.api";

const FinanceHeader = () => {
  const { data: quotations } = useGetQuotationsQuery();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  
  const [notifications, setNotifications] = useState([]);
  const notified = useRef(new Set());
  const modalRef = useRef(null);
  const profileRef=useRef(null)

  const navigate = useNavigate();
  const { setUserData, userData } = useAuth();
  const location = useLocation();
  const basePath = location.pathname.split("/")[1];

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsNotificationOpen(false);
  };

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsProfileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    setUserData(null);
    setTimeout(() => {
      navigate(`/${basePath}/login`);
    }, 500);
  };

  // ---------------- Relative Time Helper ----------------
  const getRelativeTime = (pastDate) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - new Date(pastDate)) / (1000 * 60));
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  };

  // ---------------- Load notifications from localStorage ----------------
  useEffect(() => {
    const savedNotifications = localStorage.getItem("notifications");
    if (savedNotifications) {
      const parsed = JSON.parse(savedNotifications);
      const today = new Date();
      // Filter out notifications older than 2 days
      const validNotifications = parsed.filter((n) => {
        const daysDiff = Math.ceil((today - new Date(n.timeStamp)) / (1000 * 60 * 60 * 24));
        return daysDiff < 2;
      });
      setNotifications(validNotifications);
      validNotifications.forEach((n) => notified.current.add(n.id));
      localStorage.setItem("notifications", JSON.stringify(validNotifications));
    }
  }, []);

  // ---------------- Close notification modal on outside click ----------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };
    if (isNotificationOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isNotificationOpen]);


   useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileOpen]);

  // ---------------- Notifications Effect ----------------
  useEffect(() => {
    if (!quotations) return;

    const today = new Date();
    let newNotifications = [];

    quotations.forEach((q) => {
      if (!q.dueDate) return;
      const dueDate = new Date(q.dueDate);
      const diffInDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

      // Sirf 2 din pehle, ya overdue/due today notifications
      if (diffInDays === 2 || diffInDays <= 0) {
        if (!notified.current.has(q._id)) {
          notified.current.add(q._id);

          let type = diffInDays === 2 ? "reminder" : "overdue";
          let title = diffInDays === 2 ? "Quotation Reminder" : "Overdue Quotation";
          let message =
            diffInDays === 2
              ? `⏰ Reminder: Quotation ${q.client?.name || "Client"} is due in 2 days!`
              : `⚠️ Overdue: Quotation ${q.client?.name || "Client"} is past due!`;

          newNotifications.push({
            id: q._id,
            title,
            message,
            timeStamp: new Date(),
            type,
          });
        }
      }
    });

    if (newNotifications.length > 0) {
      setNotifications((prev) => {
        // Remove notifications older than 2 days
        const filteredPrev = prev.filter((n) => {
          const daysDiff = Math.ceil((today - new Date(n.timeStamp)) / (1000 * 60 * 60 * 24));
          return daysDiff < 2;
        });

        const updated = [...newNotifications, ...filteredPrev];
        localStorage.setItem("notifications", JSON.stringify(updated));
        return updated;
      });
    }
  }, [quotations]);

  // ---------------- Real-time relative time update ----------------
  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications((prev) => [...prev]); // trigger re-render for relative time
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // ---------------- JSX ----------------
  return (
    <div className="bg-white z-10 shadow-sm border-b fixed w-screen border-gray-200 px-6 py-[0.80rem] flex items-center justify-end">
      <div className="flex items-center space-x-3">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={toggleNotification}
            className="relative text-xl focus:outline-none bg-gray-200 rounded-full p-1.5 hover:text-black/80 hover:bg-gray-300 cursor-pointer"
          >
            <Icons.Bell size={20} />
            {notifications.length > 0 && (
              <>
                <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full z-10 animate-ping" />
                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-blue-400 z-0" />
              </>
            )}
          </button>

          {/* Notification Panel */}
          {isNotificationOpen && (
            <div ref={modalRef} className="absolute right-0 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-2 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-2 border-b border-gray-50 hover:bg-gray-50 cursor-pointer flex items-start space-x-2"
                    >
                      <Icons.Bell size={16} className="text-blue-500 animate-ping" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{getRelativeTime(notification.timeStamp)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 p-4 text-center">No notifications yet</p>
                )}
              </div>
              <div className="p-1 border-t border-gray-100">
                <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium">
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
              <Icons.User size={16} className="text-white" />
            </div>
          </button>

          {isProfileOpen && (
            <div ref={profileRef}  className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-1 border-b border-gray-100 flex items-center space-x-3">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                  <Icons.User size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{userData?.allData?.name}</p>
                  <p className="text-xs text-gray-500">{userData?.role}</p>
                </div>
              </div>
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

export default FinanceHeader;
