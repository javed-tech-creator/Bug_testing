import React, { useState, useMemo } from "react";
import {
  Bell,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ArrowRight,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Info,
  Eye
} from "lucide-react";
import { useSelector } from "react-redux";
import { useGetUserNotificationsQuery } from "@/api/admin/notification.api";
import Loader from "../Loader";

const NotificationPage = () => {
  const userData = useSelector((state) => state.auth.userData);
  const userId = userData?.user?._id || userData?._id;

  const skipFetching = !userId;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // fixed as requested

  const {
    data: fetchedData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetUserNotificationsQuery(
    {
      userId: userId || null,
      page: currentPage,
      limit: itemsPerPage,
    },
    { skip: skipFetching }
  );

  const notifications = useMemo(() => {
    if (fetchedData?.data?.notifications) {
      return fetchedData.data.notifications;
    }
    if (fetchedData?.data) {
      return [...fetchedData.data].sort((a, b) => {
        return (
          new Date(b.createdAt || b.timestamp) -
          new Date(a.createdAt || a.timestamp)
        );
      });
    }
    return [];
  }, [fetchedData]);

  const totalPages =
    fetchedData?.data?.totalPages ||
    Math.ceil((fetchedData?.data?.totalCount || notifications.length) / itemsPerPage);

  const totalItems =
    fetchedData?.data?.totalCount || notifications.length;

  const loading = isLoading || isFetching;

  const [selectedNotification, setSelectedNotification] = useState(null);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getTypeIcon = (type) => {
    switch ((type || "").toLowerCase()) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-emerald-600" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "error":
      case "critical":
        return <AlertCircle className="h-5 w-5 text-rose-600" />;
      default:
        return <Info className="h-5 w-5 text-slate-700" />;
    }
  };

  const getTypeColor = (type) => {
    switch ((type || "").toLowerCase()) {
      case "success":
        return "bg-emerald-50 border-emerald-200 text-emerald-700";
      case "warning":
        return "bg-amber-50 border-amber-200 text-amber-700";
      case "error":
      case "critical":
        return "bg-rose-50 border-rose-200 text-rose-700";
      default:
        return "bg-slate-50 border-slate-200 text-slate-700";
    }
  };

  const getDateTime = (ts) => {
    if (!ts) return { date: "", time: "", relative: "" };
    const d = new Date(ts);

    return {
      date: d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const stripHtml = (html) => html?.replace(/<[^>]+>/g, "") || "";

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* HEADER - BLACK */}
      <div className="bg-black text-white w-full py-3 rounded-lg border-b border-black shadow-md sticky -top-3 z-10">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-lg bg-white/20">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold ">Notifications</h1>
              <p className="text-white/70 text-sm">
                {loading
                  ? "Loading..."
                  : skipFetching
                  ? "Login required"
                  : `${totalItems} notifications`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto w-full py-4 flex-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-80">
            <Loader />
          </div>
        ) : isError ? (
          <div className="bg-white border border-rose-200 p-8 rounded-xl text-center max-w-md mx-auto">
            <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-3" />
            <h2 className="font-semibold text-lg">Error Loading</h2>
            <p className="text-gray-600 text-sm mt-1">
              {error?.data?.message || "Something went wrong."}
            </p>
          </div>
        ) : skipFetching ? (
          <div className="bg-white border p-8 rounded-xl text-center max-w-md mx-auto">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h2 className="font-semibold text-lg">Login Required</h2>
          </div>
        ) : (
          <>
            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {notifications.length === 0 ? (
                <div className="col-span-full bg-white rounded-xl border p-12 text-center">
                  <Bell className="h-16 w-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No notifications found</p>
                </div>
              ) : (
                notifications.map((n) => {
                  const { date, time } = getDateTime(
                    n.createdAt || n.timestamp
                  );

                  return (
                    <div
                      key={n._id}
                      className="bg-white rounded-md  border-l-4 border-black  shadow-sm hover:shadow-md cursor-pointer transition-all overflow-hidden"
                      onClick={() => setSelectedNotification(n)}
                    >
                      <div className="p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-1">
                            {getTypeIcon(n.type)}
                            <span
                              className={`px-2 py-1 text-xs font-bold rounded-full border ${getTypeColor(
                                n.type
                              )}`}
                            >
                              {n.type?.toUpperCase() || "INFO"}
                            </span>
                          </div>
                        </div>

                        <h3 className="font-semibold text-gray-800 line-clamp-1 mb-1">
                          {n.title}
                        </h3>

                        <p className="text-sm text-gray-600 line-clamp-1">
                          {stripHtml(n.body || n.message)}
                        </p>

                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                            <div className="flex gap-x-4">
                          <span className="text-xs flex items-center gap-1 text-gray-500">
                            <Calendar className="h-3.5 w-3.5" /> {date}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="h-3.5 w-3.5" />
                  {getDateTime(
                    n.createdAt ||
                      n.timestamp
                  ).time}
                </div>
                </div>

                          <div className="flex items-center gap-1 text-black font-medium text-sm">
                            <Eye className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* TABLE-STYLE PAGINATION */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-10 p-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Showing{" "}
                  <span className="font-semibold text-black">
                    {(currentPage - 1) * itemsPerPage + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-black">
                    {Math.min(currentPage * itemsPerPage, totalItems)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-black">{totalItems}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50 disabled:opacity-30"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                        currentPage === i + 1
                          ? "bg-black text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-50 disabled:opacity-30"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* MODAL */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-xl overflow-hidden">
            <div className="p-3 border-b flex justify-between items-center">
              <div className="flex items-center gap-3">
                {getTypeIcon(selectedNotification.type)}
                <span
                  className={`px-3 py-1.5 rounded-full border text-xs font-bold ${getTypeColor(
                    selectedNotification.type
                  )}`}
                >
                  {selectedNotification.type?.toUpperCase()}
                </span>
              </div>

              <button
                onClick={() => setSelectedNotification(null)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto">
              <h2 className="font-bold text-xl mb-2">
                {selectedNotification.title}
              </h2>

              <p className="text-gray-700 whitespace-pre-wrap mb-4">
                {stripHtml(selectedNotification.body || selectedNotification.message)}
              </p>

              <div className="flex items-center gap-3 border-t pt-3">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  {getDateTime(
                    selectedNotification.createdAt ||
                      selectedNotification.timestamp
                  ).date}
                </div>

                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  {getDateTime(
                    selectedNotification.createdAt ||
                      selectedNotification.timestamp
                  ).time}
                </div>
              </div>
            </div>

            <div className="p-2 bg-gray-50 border-t flex justify-end">
              <button
                onClick={() => setSelectedNotification(null)}
                className="px-6 py-2 bg-black text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPage;
