import React from "react";

const PerformanceCard = ({ children }) => {
  return (
    <div className="bg-white rounded-lg border shadow-sm p-4 min-h-[60vh]">
      {children}
    </div>
  );
};

export default PerformanceCard;
