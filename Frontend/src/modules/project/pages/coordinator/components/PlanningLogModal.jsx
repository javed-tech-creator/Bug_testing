import React from "react";
import { X } from "lucide-react";

const PlanningLogModal = ({
  isOpen,
  onClose,
  logs = [], // Pass dynamic data here
  onClientDiscussionClick = () => console.log("Client Discussion Clicked"),
}) => {
  // If 'logs' prop is empty, this will be used for demonstration
  const defaultLogs = [
    {
      id: 1,
      dateTime: "11-12-25 10:00 AM",
      plannerName: "Rahul Singh",
      designation: "Project Co-Ordinator",
      status: "On Track",
      remark:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore",
    },
    {
      id: 2,
      dateTime: "11-12-25 10:00 AM",
      plannerName: "Shivam Rai",
      designation: "Project Co-Ordinator",
      status: "On Track",
      remark:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore",
    },
    {
      id: 3,
      dateTime: "11-12-25 12:00 PM",
      plannerName: "Shivam Rai",
      designation: "Project Co-Ordinator",
      status: "On Track",
      remark:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore",
    },
  ];

  const displayLogs = logs.length > 0 ? logs : defaultLogs;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white shrink-0">
          <h2 className="text-xl font-bold text-gray-900">Planning Log</h2>

          <div className="flex items-center gap-3">
            {/* <button
              onClick={onClientDiscussionClick}
              className="px-4 py-2 bg-[#3B82F6] hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors cursor-pointer"
            >
              Client Discussion Logs
            </button> */}
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center bg-[#D32F2F] hover:bg-red-800 text-white rounded transition-colors shadow-sm cursor-pointer"
            >
              <X size={20} strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto">
          <div className="border border-gray-200 rounded-md overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#1C1C1C] text-white">
                <tr>
                  <th className="px-4 py-3 font-medium border-r border-gray-600 w-16 text-center">
                    S.NO
                  </th>
                  <th className="px-4 py-3 font-medium border-r border-gray-600 w-40">
                    Date/Time
                  </th>
                  <th className="px-4 py-3 font-medium border-r border-gray-600 w-40">
                    Planner Name
                  </th>
                  <th className="px-4 py-3 font-medium border-r border-gray-600 w-48">
                    Designation
                  </th>
                  <th className="px-4 py-3 font-medium border-r border-gray-600 w-32">
                    Status
                  </th>
                  <th className="px-4 py-3 font-medium">Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {displayLogs.map((log, index) => (
                  <tr
                    key={log.id || index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-4 border-r border-gray-200 text-center font-medium text-gray-900">
                      {String(index + 1).padStart(2, "0")}
                    </td>
                    <td className="px-4 py-4 border-r border-gray-200 text-gray-700">
                      {log.dateTime}
                    </td>
                    <td className="px-4 py-4 border-r border-gray-200 text-gray-700">
                      {log.plannerName}
                    </td>
                    <td className="px-4 py-4 border-r border-gray-200 text-gray-700">
                      {log.designation}
                    </td>
                    <td className="px-4 py-4 border-r border-gray-200">
                      <span className="inline-block px-3 py-1 rounded bg-blue-50 text-blue-600 text-xs font-medium">
                        {log.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-600 leading-relaxed min-w-[300px]">
                      {log.remark}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {displayLogs.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No logs available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanningLogModal;
