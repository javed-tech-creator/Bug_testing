import React from "react";

export function Button({ children, className = "", variant = "solid", ...props }) {
  let baseStyle =
    "px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  let variantStyle = {
    solid:
      "bg-orange-500 text-white hover:bg-orange-600 focus:ring-blue-500 cursor-pointer",
    outline:
      "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-400",
  };

  return (
    <button
      className={`${baseStyle} ${variantStyle[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
