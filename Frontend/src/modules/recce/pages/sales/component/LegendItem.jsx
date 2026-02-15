import React from "react";

const LegendItem = ({ color, label }) => {
  return (
    <div className="flex items-center gap-2">
      <span
        className="w-3 h-3 rounded-md"
        style={{ backgroundColor: color }}
      ></span>
      <span className="text-base text-gray-700">{label}</span>
    </div>
  );
};

export default LegendItem;
