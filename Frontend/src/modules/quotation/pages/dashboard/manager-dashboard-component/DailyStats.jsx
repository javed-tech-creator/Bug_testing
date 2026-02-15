import React from "react";

const dailyStats = [
  { label: "Assigned Today", value: 5, color: "text-purple-600" },
  { label: "Completed Today", value: 3, color: "text-green-600" },
  { label: "In Progress Today", value: 2, color: "text-blue-500" },
  { label: "Revisit Required", value: 1, color: "text-red-600" },
  { label: "Approval Rate", value: "91%", color: "text-indigo-600" },
];

export default function DailyStats() {
  return (
    <div className="bg-white p-6 rounded-md shadow-sm mb-6 flex flex-wrap lg:flex-nowrap divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
      {dailyStats.map((stat, idx) => (
        <div
          key={idx}
          className={`flex-1 px-6 first:pl-0 ${idx > 0 ? "mt-4 lg:mt-0 pt-4 lg:pt-0" : ""}`}
        >
          <div className="text-sm font-medium text-slate-500 mb-2">
            {stat.label}
          </div>
          <div className={`text-4xl font-bold ${stat.color}`}>
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
}