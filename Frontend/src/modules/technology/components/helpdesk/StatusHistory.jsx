import React from "react";
import { X, Clock } from "lucide-react";

export const StatusHistoryModal = ({ history = [], onClose }) => {
  const getStatusColor = (status) => {
    const colors = {
      open: "bg-blue-100 text-blue-800 border-blue-200",
      "in-progress": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "on-hold": "bg-orange-100 text-orange-800 border-orange-200",
      resolved: "bg-green-100 text-green-800 border-green-200",
      closed: "bg-gray-200 text-gray-700 border-gray-300",
    };
    return (
      colors[status?.toLowerCase()] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

const formatReadableDate = (dateString) => {
  if (!dateString) return "—";

  // Handle dd/mm/yyyy or d/m/yyyy
  const match = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (match) {
    const [ , dd, mm, yyyy ] = match;
    const parsed = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    if (!isNaN(parsed)) {
      return parsed.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",   // 👉 "Aug"
        year: "numeric",
      });
    }
  }

  return "Invalid date";
};

const formatTime = (dateString) => {
  if (!dateString) return "—";
  const d = new Date(dateString);
  if (isNaN(d)) return "Invalid time";

  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,   // 👉 AM/PM format
  });
};


  // Utility function to group by date (sirf yyyy-mm-dd part compare karenge)
const groupByDate = (history) => {
  return history.reduce((acc, item) => {
    const date = new Date(item.updatedAt).toLocaleDateString(); // sirf date part
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});
};

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-black px-5 py-3 text-white flex justify-between items-center rounded-t-2xl">
          <h2 className="text-lg font-semibold">Status History</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <Clock className="w-14 h-14 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-700">
                No History Available
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Status updates will appear here once available.
              </p>
            </div>
          ) : (
          <div className="overflow-y-auto max-h-[70vh] border rounded-xl shadow-sm">
  <table className="w-full text-sm border-collapse">
    <thead className="bg-gray-100 sticky top-0 z-10">
      <tr className="text-gray-700 text-sm">
        <th className="px-5 py-3 text-left border-b">Date</th>
        <th className="px-5 py-3 text-left border-b">Status</th>
        <th className="px-5 py-3 text-left border-b">Notes</th>
        <th className="px-5 py-3 text-left border-b">Time</th>
        <th className="px-5 py-3 text-left border-b">Updated By</th>
      </tr>
    </thead>
    <tbody>
      {Object.entries(groupByDate(history)).map(([date, items], idx) => (
        <React.Fragment key={idx}>
          {[...items].reverse().map((item, i) => (
            <tr key={i} className="hover:bg-gray-50 transition-colors">
              {/* Date column → sirf pehli row me dikhana */}
              {i === 0 ? (
                <td
                  rowSpan={items.length}
                  className="px-5 py-3  border-b text-gray-500 align-center"
                >
                  {formatReadableDate(date)}
                </td>
              ) : null}

              <td className="px-5 py-3 border-l border-b">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${getStatusColor(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </td>

              <td className="px-5 py-3 border-b text-gray-700">
                {item.resolutionNotes || "—"}
              </td>

               <td className="px-5 py-3 border-b text-gray-600">
                {formatTime(item.updatedAt)}
                
              </td>

              <td className="px-5 py-3 border-b text-gray-600">
                {item.updatedBy?.name || "Unknown"}
              </td>
            </tr>
          ))}
        </React.Fragment>
      ))}
    </tbody>
  </table>
</div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-end rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2 cursor-pointer bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusHistoryModal;
