import React from "react";

const StatsCard = ({ icon, value, label, change, bg }) => {
  return (
    <div
      className={`p-6 rounded-2xl shadow-sm border ${bg} transition-all hover:shadow-md`}
    >
      <div>{icon}</div>

      <h2 className="text-2xl font-bold text-gray-800 mt-3">{value}</h2>

      <p className="text-base font-medium text-gray-700 mt-1">{label}</p>

      <p className="text-sm text-gray-600 mt-2">{change}</p>
    </div>
  );
};

export default StatsCard;
