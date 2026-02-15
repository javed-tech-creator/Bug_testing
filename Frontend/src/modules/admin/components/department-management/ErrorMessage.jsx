import React from "react";

const ErrorMessage = ({ message = "Something went wrong!" }) => {
  return (
    <div className="flex justify-center items-center h-40">
      <p className="text-red-500 bg-red-50 border border-red-200 px-5 py-2 rounded-lg shadow-sm text-center">
        {message}
      </p>
    </div>
  );
};

export default ErrorMessage;
