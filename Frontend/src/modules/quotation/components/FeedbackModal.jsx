import React from "react";
import { X } from "lucide-react";

const FeedbackModal = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  // 1. Define the data based on your screenshot
  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-end items-center px-6 py-4 border-b border-gray-200">
          <button
            onClick={onClose}
            className="bg-[#C1272D] hover:bg-red-700 text-white p-1 rounded transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <div className="border border-gray-300 rounded-md overflow-hidden">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">
                    Date
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">
                    Name & Designation
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold w-1/2">
                    Feedback
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className="odd:bg-white even:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 text-sm">
                      {item.date}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">
                      <span
                        className={`font-medium ${
                          item.status === "Approved By Sales"
                            ? "bg-green-50 text-green-600 border-green-100"
                            : item.status === "Submitted to Manager"
                            ? "bg-blue-50 text-blue-600 border-blue-100"
                            : "text-gray-600"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">
                      {item.designation}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                      {item.feedback}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
