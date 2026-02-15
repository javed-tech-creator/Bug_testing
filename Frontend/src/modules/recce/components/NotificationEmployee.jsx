import React, { useState } from "react";
import {
  Bell,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ArrowRight,
} from "lucide-react";
// Redux hook to access the store state
import { useSelector } from "react-redux";
// Import the RTK Query hook
import { useGetUserNotificationsQuery } from "../../../api/admin/notification.api";

// थीम के मुख्य रंग के लिए एक स्थिरांक (Constant) परिभाषित करें
// आपने ब्लैक कलर के लिए कहा है, इसलिए मैं इसे एक गहरे रंग के रूप में मान रहा हूँ
// यहाँ मैं एक गहरा थीम रंग इस्तेमाल कर रहा हूँ
const THEME_COLOR_CLASS = "bg-gray-900"; // या "bg-black"
const THEME_TEXT_COLOR_CLASS = "text-gray-900"; // या "text-black"
const THEME_BORDER_COLOR_CLASS = "border-gray-900"; // या "border-black"

const NotificationEmployee = () => {
  // --- 1. Get the userId from Redux State (Replacing localStorage) ---
  const userData = useSelector((state) => state.auth.userData);
  // Assuming the user ID is either directly under userData or nested under userData.user
  const userId = userData?.user?._id || userData?._id;

  // --- 2. Implement RTK Query hook with skip logic ---
  // Skip fetching if userId is undefined or null
  const skipFetching = !userId;

  const {
    data: fetchedData, // Rename data to fetchedData to avoid conflict
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetUserNotificationsQuery(
    { userId }, // Pass the userId as an object
    {
      skip: skipFetching, // Skip the query if userId is not available
    }
  );

  // --- Process the data from the query hook ---
  const notifications = React.useMemo(() => {
    if (fetchedData?.data && Array.isArray(fetchedData.data)) {
      return fetchedData.data.sort((a, b) => {
        return (
          new Date(b.createdAt || b.timestamp) -
          new Date(a.createdAt || a.timestamp)
        );
      });
    }
    return [];
  }, [fetchedData]);

  // Combined loading state: Initial load (isLoading) or background refresh (isFetching)
  const loading = isLoading || isFetching;

  // --- MODAL STATE ---
  const [selectedNotification, setSelectedNotification] = useState(null);

  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const closeModal = () => setSelectedNotification(null);

  // थीम के अनुसार बॉर्डर कलर को एडजस्ट किया गया
  const getBorderColorClass = (type) => {
    const normalizedType = type ? type.toLowerCase() : "info";
    switch (normalizedType) {
      case "success":
        return "border-l-green-600";
      case "warning":
        return "border-l-yellow-500";
      case "error":
      case "critical":
        return "border-l-red-600";
      default:
        // 'info' या default के लिए थीम कलर का उपयोग
        return `border-l-4 ${THEME_BORDER_COLOR_CLASS}`; // गहरा/ब्लैक बॉर्डर
    }
  };

  // सिर्फ left border के लिए className को एडजस्ट किया गया
  const getNotificationBorderClass = (type) => {
    const normalizedType = type ? type.toLowerCase() : "info";
    switch (normalizedType) {
      case "success":
        return "border-l-green-600";
      case "warning":
        return "border-l-yellow-500";
      case "error":
      case "critical":
        return "border-l-red-600";
      default:
        // 'info' या default के लिए थीम कलर का उपयोग
        return THEME_BORDER_COLOR_CLASS.replace("border-", "border-l-"); // e.g., "border-l-gray-900"
    }
  };

  const getDateTime = (timestamp) => {
    if (!timestamp) return { date: "", time: "" };
    const dateObj = new Date(timestamp);
    return {
      date: dateObj.toLocaleDateString(),
      time: dateObj.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  const stripHtml = (html) => (html ? html.replace(/<[^>]+>/g, "") : "");

  // --- PAGINATION LOGIC
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentNotifications = notifications.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(notifications.length / itemsPerPage);

  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  return (
    <div className="p-4 max-w-7xl mx-auto bg-gray-50 flex flex-col min-h-screen relative">
      {/* HEADER */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 mb-4">
        <div className="flex items-center gap-3">
          {/* नोटिफिकेशन आइकन का रंग थीम (ब्लैक) के अनुसार बदला गया */}
          <div className={`p-2 rounded-lg ${THEME_COLOR_CLASS}`}>
            <Bell className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Notifications
            </h1>
            <p className="text-sm text-gray-600">
              {loading
                ? "Checking..."
                : skipFetching
                ? "Login required to view notifications"
                : `Total ${notifications.length} updates`}
            </p>
          </div>
        </div>
      </div>

      {/* GRID CONTENT */}
      <div className="flex-1">
        {/* --- 3. Use RTK Query state for Loading/Error --- */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            {/* लोडर आइकन का रंग थीम (ब्लैक) के अनुसार बदला गया */}
            <Loader2
              className={`h-8 w-8 animate-spin mb-2 ${THEME_TEXT_COLOR_CLASS}`}
            />
            <p>Loading...</p>
          </div>
        ) : isError ? (
          // Display a better error message if available
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center text-red-700">
            <p>
              Error:{" "}
              {error?.data?.message ||
                error?.status ||
                "Failed to fetch notifications"}
            </p>
            <p className="mt-1 text-sm">Please ensure you are logged in.</p>
          </div>
        ) : skipFetching ? (
          // Display message if userId is missing from Redux
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center text-yellow-700">
            <p>
              User ID not found in Redux state. Please log in to view
              notifications.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentNotifications.length === 0 ? (
              <div className="bg-white col-span-full rounded-lg border border-gray-100 p-8 text-center">
                <p className="text-gray-600">No new notifications.</p>
              </div>
            ) : (
              currentNotifications.map((notification) => {
                const notifId = notification._id || notification.id;
                const { date, time } = getDateTime(
                  notification.createdAt || notification.timestamp
                );
                // Notification Border Class: getBorderColorClass से अपडेट किया गया
                const borderClass = getNotificationBorderClass(
                  notification.type
                );

                return (
                  <div
                    key={notifId}
                    // Border Color और बॉर्डर-एल-4 क्लास को getBorderColorClass से हटाकर यहां फिक्स किया गया
                    className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between overflow-hidden border border-gray-100 border-l-4 ${borderClass}`}
                  >
                    {/* Content Section */}
                    <div className="p-4 pb-2">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-[15px] font-bold text-gray-900 line-clamp-1">
                          {notification.title}
                        </h3>
                      </div>

                      <p className="text-[13px] text-gray-600 line-clamp-2 leading-snug">
                        {stripHtml(notification.body || notification.message)}
                      </p>
                    </div>

                    {/* Footer Section */}
                    <div className="px-4 py-3 border-t border-gray-50 bg-gray-50/50 flex items-end justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-black">
                          {date}
                        </span>
                        <span className="text-[11px] font-bold text-black">
                          {time}
                        </span>
                      </div>

                      <button
                        onClick={() => setSelectedNotification(notification)}
                        // 'View More' टेक्स्ट का रंग थीम के अनुसार (ब्लैक) किया गया
                        className={`text-xs font-bold ${THEME_TEXT_COLOR_CLASS} hover:text-gray-700 hover:underline flex items-center gap-1 transition-colors cursor-pointer`}
                      >
                        View More
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {!loading && !isError && !skipFetching && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6 pb-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* --- MODAL POPUP (remains the same) --- */}
      {selectedNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-200">
          <div
            className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header: थीम के अनुसार बॉर्डर कलर को एडजस्ट किया गया */}
            <div
              className={`px-6 py-4 border-b border-gray-100 flex justify-between items-start bg-gray-50 border-l-4 ${getNotificationBorderClass(
                selectedNotification.type
              )}`}
            >
              <h3 className="text-lg font-bold text-black pr-4 leading-tight">
                {selectedNotification.title}
              </h3>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-full bg-white border border-gray-200 hover:bg-gray-100 transition-colors text-gray-500 flex-shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="text-gray-800 text-[15px] leading-7 whitespace-pre-wrap">
                {stripHtml(
                  selectedNotification.body || selectedNotification.message
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col gap-4">
              <div className="flex justify-between items-center text-sm">
                <div>
                  <span className="text-gray-500 block text-xs">Received</span>
                  <span className="font-bold text-black">
                    {
                      getDateTime(
                        selectedNotification.createdAt ||
                          selectedNotification.timestamp
                      ).date
                    }{" "}
                    at{" "}
                    {
                      getDateTime(
                        selectedNotification.createdAt ||
                          selectedNotification.timestamp
                      ).time
                    }
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-gray-500 block text-xs">Type</span>
                  <span
                    className={`font-bold capitalize ${
                      selectedNotification.type === "error"
                        ? "text-red-600"
                        : selectedNotification.type === "success"
                        ? "text-green-600"
                        : THEME_TEXT_COLOR_CLASS // 'Info' या default के लिए थीम कलर
                    }`}
                  >
                    {selectedNotification.type || "Info"}
                  </span>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={closeModal}
                  // क्लोज बटन का बैकग्राउंड कलर थीम (ब्लैक) के अनुसार बदला गया
                  className={`px-5 py-2.5 ${THEME_COLOR_CLASS} text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationEmployee;
