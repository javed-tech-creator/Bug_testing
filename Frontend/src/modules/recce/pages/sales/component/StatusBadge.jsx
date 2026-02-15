import React from "react";

const statusColors = {
  Excellent: "bg-green-100 text-green-700",
  Good: "bg-green-100 text-green-600",
  Bad: "bg-red-100 text-red-500",
};

const StatusBadge = ({ status }) => {
  return (
    <span
      className={`px-2 py-[2px] rounded-full text-base font-medium ${statusColors[status]}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
