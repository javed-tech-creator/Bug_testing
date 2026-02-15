import React, { useState } from "react";
import { FaBell, FaCheckCircle } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
// import { useMarkAllReadMutation, useMarkReadMutation } from "@/api/vendor/notification.api";

//  Dummy Hooks (replace RTK Query for now)
const useMarkAllReadMutation = () => {
  const fn = async () => {
    console.log("Dummy: markAllRead called");
    return { success: true };
  };
  return [fn];
};

const useMarkReadMutation = () => {
  const fn = async (id) => {
    console.log("Dummy: markRead called for id:", id);
    return { success: true };
  };
  return [fn];
};


const NotificationModal = ({ visible, onClose, modalRef,notifications = [], refetch,setNotifications }) => {

    const [markAllRead] = useMarkAllReadMutation();
  const [markRead] = useMarkReadMutation();

const markAllAsRead = async () => {
  //  Local state update pehle
  setNotifications((prev) => prev.map(n => ({ ...n, isRead: true })));

  try {
    await markAllRead(); // API call
    refetch(); // Optional: backend se fresh data
  } catch (err) {
    console.error(err);
    // agar error aaya to state rollback kar sakte ho
  }
};

const markAsRead = async (id) => {
  //  Local state update pehle
  setNotifications((prev) =>
    prev.map(n => n._id === id ? { ...n, isRead: true } : n)
  );

  try {
    await markRead(id); // API call
    refetch(); // Optional: backend se fresh data
  } catch (err) {
    console.error(err);
    // agar error aaya to rollback kar sakte ho
  }
};

  return (
   <div
      ref={modalRef}
      className={`fixed top-17 right-0 w-96 bg-white rounded-l-xl shadow-2xl z-50 overflow-hidden border border-gray-200 transition-transform duration-300 ease-in-out
      ${visible ? "translate-x-0" : "translate-x-full"} 
      max-h-[80vh]`}
    >
      <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-700">Notifications</h3>
        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-600 hover:underline hover:text-blue-800 cursor-pointer"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="max-h-[65vh] overflow-y-auto divide-y">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-gray-400 text-sm">
            No notifications
          </div>
        ) : (
          notifications.map((notif) => {
            const createdAt = notif?.createdAt ? new Date(notif.createdAt) : null;

            return (
              <div
                key={notif._id}
                onClick={() => markAsRead(notif._id)}
                className={`px-4 py-3 text-sm transition-all duration-200 cursor-pointer ${
                  notif.isRead ? "bg-white" : "bg-blue-50"
                } hover:bg-blue-100`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {notif.isRead ? (
                      <FaCheckCircle className="text-green-400" />
                    ) : (
                      <FaBell className="text-yellow-400 animate-pulse" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium text-gray-800">{notif.type}</p>
                    <p className="text-gray-600 text-xs">{notif.message}</p>
                    <small className="text-gray-500">
                      {createdAt
                        ? formatDistanceToNow(createdAt, { addSuffix: true })
                        : "No date"}
                    </small>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotificationModal;
