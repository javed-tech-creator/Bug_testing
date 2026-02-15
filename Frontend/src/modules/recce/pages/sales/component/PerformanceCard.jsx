import React from "react";

const PerformanceCard = ({ children }) => {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-6 min-h-[480px]">
      {children}
    </div>
  );
};

export default PerformanceCard;
