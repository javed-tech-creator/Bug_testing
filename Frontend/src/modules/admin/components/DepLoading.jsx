import React from "react";

const DepLoading = ({
  text = "Loading...",
  size = 10,
  className = "",
  textClass = "",
}) => {
  return (
    <div
      className={`flex items-center justify-center py-16 ${className}`}
    >
      <div className="flex flex-col items-center text-gray-500">
        <svg
          className={`w-${size} h-${size} animate-spin text-black mb-3`}
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
            d="M4 12a8 8 0 018-8v4l3.5-3.5A8 8 0 0120 12h-4l3.5 3.5A8 8 0 0112 20v-4l-3.5 3.5A8 8 0 014 12z"
          ></path>
        </svg>
        <p className={`text-sm font-medium text-gray-600 ${textClass}`}>
          {text}
        </p>
      </div>
    </div>
  );
};

export default DepLoading;
