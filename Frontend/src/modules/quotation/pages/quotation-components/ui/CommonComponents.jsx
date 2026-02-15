import React from "react";

export const InputGroup = ({ label, value, onChange, ...props }) => (
  <div className="flex flex-col">
    <label className="text-[10px] sm:text-xs font-bold text-gray-900 mb-1">
      {label}
    </label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      className="border border-gray-200 bg-gray-50 rounded-md px-3 py-2 text-xs sm:text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all"
      {...props}
    />
  </div>
);

export const ToggleItem = ({ label, checked, onChange }) => (
  <div className="flex items-center gap-3">
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
      />
      <div
        className={`w-11 h-6 rounded-full peer transition-colors duration-200 ${
          checked ? "bg-blue-600" : "bg-gray-300"
        } after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full`}
      ></div>
    </label>
    <span className="text-xs sm:text-sm font-medium text-gray-700">
      {label}
    </span>
  </div>
);

export const Button = ({
  variant = "primary",
  children,
  onClick,
  className = "",
}) => {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 sm:px-5 py-2 font-semibold rounded-md text-xs sm:text-sm transition-colors cursor-pointer ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export const SectionHeader = ({ title }) => (
  <h2 className="font-bold text-gray-900 text-sm sm:text-base mb-4">{title}</h2>
);
