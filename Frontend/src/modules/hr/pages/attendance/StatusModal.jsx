import React from "react";
import { toast } from "react-toastify";

const StatusModal = ({
  show,
  onClose,
  modalData,
  setModalData,
  remarks,
  setRemarks,
  updateAttendance,
  refetch,
  refetchTable,
}) => {
  if (!show) return null;

  const statusOptions = [
    {
      value: "P",
      label: "Present",
      color: "bg-black text-white border-black",
    },
    {
      value: "A",
      label: "Absent",
      color: "bg-black text-white border-black",
    },
    {
      value: "HD",
      label: "Half Day",
      color: "bg-black text-white border-black",
    },
    {
      value: "L",
      label: "Leave",
      color: "bg-black text-white border-black",
    },
    {
      value: "WFH",
      label: "Work From Home",
      color: "bg-black text-white border-black",
    },
    {
      value: "WO",
      label: "Weekly Off",
      color: "bg-black text-white border-black",
    },
    {
      value: "H",
      label: "Holiday",
      color: "bg-black text-white border-black",
    },
  ];

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[2px] transition-all duration-300 p-4 z-50"
      onClick={onClose}
    >
      <div
        className="relative bg-white text-black rounded-md w-full max-w-lg shadow-lg overflow-hidden border border-gray-300 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient Header */}
        <div className="bg-black px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white text-xl font-bold">
                Attendance Status for {modalData.employee?.name}
              </h2>
              <p className="text-white text-sm mt-0.5">{modalData.dateKey}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-white transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Status Grid */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Select Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    setModalData((prev) => ({ ...prev, status: option.value }))
                  }
                  className={`p-2 rounded-lg border text-sm font-medium transition-all ${
                    modalData.status === option.value
                      ? option.color + " ring-2 ring-offset-2 ring-gray-400"
                      : "bg-white border-gray-300 text-gray-700 hover:border-black"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Add Remarks
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-blue-400 transition-all outline-none resize-none"
              placeholder="Optional notes or reason..."
              rows="2"
            />
          </div>

          {!["A", "L", "WO", "H"].includes(modalData.status) && (
            <div className="flex gap-3 min-w-0">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Login Time
                </label>
                <input
                  type="datetime-local"
                  max={new Date().toISOString().slice(0, 16)}
                  value={modalData.loginTime || ""}
                  onChange={(e) =>
                    setModalData((prev) => ({
                      ...prev,
                      loginTime: e.target.value,
                    }))
                  }
                  className="w-full px-2 py-2 bg-white border border-gray-300 rounded-md text-sm focus:border-black outline-none transition-all overflow-hidden"
                />
              </div>

              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Logout Time
                </label>
                <input
                  type="datetime-local"
                  max={new Date().toISOString().slice(0, 16)}
                  value={modalData.logoutTime || ""}
                  onChange={(e) =>
                    setModalData((prev) => ({
                      ...prev,
                      logoutTime: e.target.value,
                    }))
                  }
                  className="w-full px-2 py-2 bg-white border border-gray-300 rounded-md text-sm focus:border-black outline-none transition-all overflow-hidden"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 pb-4 flex gap-2 pt-2 border-t border-gray-200/60 backdrop-blur-sm">
          <button
            onClick={onClose}
            className="flex-1 px-3 py-2 text-sm font-semibold text-black bg-gray-200 hover:bg-gray-300 rounded-lg transition-all"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              if (modalData.loginTime && modalData.logoutTime) {
                const login = new Date(modalData.loginTime);
                const logout = new Date(modalData.logoutTime);
                if (logout <= login) {
                  alert("Logout time must be after login time.");
                  return;
                }
              }
              try {
                const response = await updateAttendance({
                  employeeId: modalData.employee?._id,
                  date: modalData.dateKey,
                  status: modalData.status === "NA" || !modalData.status ? "" : modalData.status,
                  remarks,
                  loginTime: modalData.loginTime,
                  logoutTime: modalData.logoutTime,
                });
                console.log("✔ Attendance Updated Successfully:", response);
                toast.success("Attendance updated successfully!");

                if (typeof refetch === "function") {
                  console.log("🔄 Refetching Calendar...");
                  await refetch();
                }
                if (typeof refetchTable === "function") {
                  console.log("🔄 Refetching Table (By City Attendance)...");
                  await refetchTable();
                }
                onClose();
              } catch (error) {
                console.log("❌ Attendance Update Error:", error);
                toast.error("Error updating attendance. Check console for details.");
              }
            }}
            className="flex-1 px-3 py-2 text-sm font-semibold text-white bg-black hover:bg-gray-900 rounded-lg transition-all shadow-lg"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusModal;
