// ShowFileUploadModal.jsx
import React from "react";
import {
  XMarkIcon,
  ArrowUturnLeftIcon,
  CloudArrowUpIcon,
} from "@heroicons/react/24/outline";

const ShowFileUpload = ({ uploadFile, onClose, onSubmit,isLoading }) => {
  if (!uploadFile || uploadFile.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white w-[90%] max-w-6xl p-6 rounded-xl shadow-xl relative overflow-auto max-h-[90vh]">

        {/* Close Icon (Top-Right) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-300 p-1 cursor-pointer"
          title="Close"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-semibold mb-4">📋 Preview Uploaded Data</h2>

        {/* Preview Table */}
        <div className="overflow-auto max-h-[60vh] border rounded-md">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                {Object.keys(uploadFile[0]).map((key) => (
                  <th key={key} className="border px-3 py-2 text-left">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {uploadFile.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  {Object.values(row).map((val, i) => (
                    <td key={i} className="border px-3 py-2">{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          {/* Cancel Button */}
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 cursor-pointer"
          >
            <ArrowUturnLeftIcon className="w-5 h-5" />
            Cancel
          </button>

          {/* Upload Button */}
       <button
  onClick={() => onSubmit(uploadFile)}
  disabled={isLoading}
  className={`flex items-center gap-2 px-4 py-2 rounded text-white transition justify-center
    ${isLoading ? "bg-orange-300 cursor-not-allowed" : "bg-orange-400 hover:bg-orange-500"}
  `}
  style={{ minWidth: "140px" }} // keeps width same
>
  {isLoading ? (
    <>
      <svg
        className="animate-spin h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
      Upload
    </>
  ) : (
    <>
      <CloudArrowUpIcon className="w-5 h-5" />
      Upload
    </>
  )}
</button>


        </div>
      </div>
    </div>
  );
};

export default ShowFileUpload;
