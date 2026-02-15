import React, { useState, useEffect, useRef } from "react";
import { FiBell } from "react-icons/fi";
import { socket } from "@/socket"; // agar dummy me bhi rakhna hai realtime ke liye
import ProfileDropdown from "./ProfileDropdown";
import NotificationModal from "./NotificationModal";

export default function MarketingNavbar() {
  const [showNotification, setShowNotification] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      _id: "1",
      type: "Order Update",
      message: "Your order #1234 has been shipped.",
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 min ago
    },
    {
      _id: "2",
      type: "Payment",
      message: "Payment of ₹500 has been received.",
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hr ago
    },
    {
      _id: "3",
      type: "Reminder",
      message: "Update your KYC details.",
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    },
  ]);
  const bellRef = useRef();
  const modalRef = useRef();

  //  Dummy data (initial load)
  useEffect(() => {
    const dummyNotifications = [
      { id: 1, message: "Welcome to DSS Marketing Module!", isRead: false },
      { id: 2, message: "Your campaign report is ready.", isRead: true },
      { id: 3, message: "New lead assigned to you.", isRead: false },
    ];
    setNotifications(dummyNotifications);
  }, []);

  //  Socket listener (dummy ke saath bhi use ho sakta hai)
  useEffect(() => {
    socket.on("newNotification", (notif) => {
      console.log("📩 New Notification aaya:", notif);
      setNotifications((prev) => [notif, ...prev]);
    });

    return () => {
      socket.off("newNotification");
    };
  }, []);

  //  Click outside to close
  const handleClickOutside = (e) => {
    if (
      modalRef.current &&
      !modalRef.current.contains(e.target) &&
      bellRef.current &&
      !bellRef.current.contains(e.target)
    ) {
      setShowNotification(false);
    }
  };

  useEffect(() => {
    if (showNotification) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotification]);

  return (
    <header className="bg-white z-10 shadow-sm border-b fixed w-screen border-gray-200 px-6 py-[0.80rem] flex items-center justify-end">
      {/* Right Section */}
      <div className="flex items-center gap-1 ml-auto relative">
        {/* Bell Icon */}
        <button
          ref={bellRef}
          className="relative text-xl focus:outline-none bg-gray-200 rounded-full p-1.5 hover:text-blue-600 hover:bg-gray-300 cursor-pointer"
          onClick={() => setShowNotification((prev) => !prev)}
        >
          <FiBell className="w-5 h-5 text-black" />
          {/*  Agar ek bhi unread hai to hi blink kare */}
          {notifications.some((n) => !n.isRead) && (
            <>
              <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full z-10" />
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-green-400 opacity-75 animate-ping z-0" />
            </>
          )}
        </button>

        <ProfileDropdown />

        {/* Notification Panel */}
        <NotificationModal
          visible={showNotification}
          onClose={() => setShowNotification(false)}
          modalRef={modalRef}
          notifications={notifications}
          setNotifications={setNotifications}
          refetch={() => {
            //  Dummy refetch (reset to initial dummy data)
            const dummyNotifications = [
              { id: 1, message: "Welcome to DSS Marketing Module!", isRead: false },
              { id: 2, message: "Your campaign report is ready.", isRead: true },
              { id: 3, message: "New lead assigned to you.", isRead: false },
            ];
            setNotifications(dummyNotifications);
          }}
        />
      </div>
    </header>
  );
}
