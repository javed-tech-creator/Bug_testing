import React, { useState, useEffect, useRef } from 'react';
import ProfileDropdown from './VendorProfileDropDown';
import { FiBell } from 'react-icons/fi';
import NotificationModel from './NotificationModel';
import { useGetNotificationsQuery } from '@/api/vendor/notification.api';
import { socket } from '@/socket';

export default function Navbar() {
  const [showNotification, setShowNotification] = useState(false);
    const [notifications, setNotifications] = useState([]);
  const bellRef = useRef();
  const modalRef = useRef();

    const { data, refetch } = useGetNotificationsQuery();


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

    //  API data ko local state me sync karna
  useEffect(() => {
    if (data?.notifications) {
      setNotifications(data.notifications); 
    }
  }, [data]);

    //  Socket listener
  useEffect(() => {
    socket.on("newNotification", (notif) => {
      console.log("New Notification aaya:", notif);
      setNotifications((prev) => [notif, ...prev]); // realtime add
    });

    return () => {
      socket.off("newNotification");
    };
  }, []);


  useEffect(() => {
    if (showNotification) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotification]);

  console.log("notifications DAta----", data);
  console.log("notifications----", notifications);

  return (
    <header className="bg-white z-10 shadow-sm border-b fixed  w-screen border-gray-200 px-6 py-[0.80rem] flex items-center justify-end">
    
      {/* Right Section */}
      <div className="flex items-center gap-1 ml-auto relative">
        {/* Bell Icon */}
        <button
          ref={bellRef}
          className="relative text-xl focus:outline-none bg-gray-200 rounded-full p-1.5 hover:text-blue-600 hover:bg-gray-300 cursor-pointer"
          onClick={() => setShowNotification((prev) => !prev)}
        >
          <FiBell className="w-5 h-5 text-black" />
         {/* ✅ Agar ek bhi unread hai to hi blink kare */}
  {notifications.some(n => !n.isRead) && (
    <>
      <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full z-10" />
      <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-green-400 opacity-75 animate-ping z-0" />
    </>
  )}
        </button>

        <ProfileDropdown />

        {/* Notification Panel */}
        <NotificationModel
          visible={showNotification}
          onClose={() => setShowNotification(false)}
          modalRef={modalRef}
          notifications={notifications}
          setNotifications={setNotifications}
          refetch={refetch}
        />
      </div>
    </header>
  );
}
