import React from "react";
import { FaSpinner } from "react-icons/fa";

const ConfirmDialog = ({ open, title, message, onConfirm, onCancel,isLoading }) => {
  if (!open) return null; // agar open false hai to kuch render na kare

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-40 z-50">
      <div className="bg-white rounded-xl shadow-lg w-96 p-6">
        <h2 className="text-lg font-semibold mb-3">{title || "Are you sure?"}</h2>
        <p className="text-gray-600 mb-5">{message || "Do you want to continue?"}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            No
          </button>
         {/* Confirm Button */}
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg text-white flex items-center justify-center gap-2
              ${isLoading ? "bg-red-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"}
            `}
          >
            {isLoading ? (
              <FaSpinner className="animate-spin text-white" />
            ) : (
              "Yes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
