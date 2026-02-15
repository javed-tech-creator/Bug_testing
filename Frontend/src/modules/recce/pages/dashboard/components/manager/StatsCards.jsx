import React from "react";
import * as Icons from "lucide-react";

const stats = [
  {
    label: "Assigned Recce",
    value: "135",
    change: "+8% from yesterday",
    color: "bg-purple-300",
    icon: <Icons.BarChart2 className="w-6 h-6 text-purple-600" />,
  },
  {
    label: "Completed Recce",
    value: "3000",
    change: "+5% from yesterday",
    color: "bg-blue-300",
    icon: <Icons.FileText className="w-6 h-6 text-blue-600" />,
  },
  {
    label: "Pending Recce",
    value: "800",
    change: "+1.2% from yesterday",
    color: "bg-orange-300",
    icon: <Icons.Bell className="w-6 h-6 text-orange-600" />,
  },
  {
    label: "Rejected Recce",
    value: "5",
    change: "0.5% from yesterday",
    color: "bg-red-300",
    icon: <Icons.TrendingDown className="w-6 h-6 text-red-600" />,
  },
  {
    label: "Total Executives",
    value: "3000",
    change: "+5% from yesterday",
    color: "bg-indigo-300",
    icon: <Icons.User className="w-6 h-6 text-indigo-600" />,
  },
  {
    label: "Revisit Required",
    value: "5",
    change: "0.5% from yesterday",
    color: "bg-pink-300",
    icon: <Icons.RotateCw className="w-6 h-6 text-pink-600" />,
  },
  {
    label: "Avg. Time / Recce",
    value: "1.8 days",
    change: "+8% from yesterday",
    color: "bg-purple-400",
    icon: <Icons.Clock className="w-6 h-6 text-purple-600" />,
  },
  {
    label: "Team Performance",
    value: "4.6 / 5",
    change: "+5% from yesterday",
    color: "bg-green-300",
    icon: <Icons.Star className="w-6 h-6 text-green-600" />,
  },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
      {stats.map((card, idx) => (
        <div key={idx} className={`p-6 rounded-xl shadow h-40 ${card.color}`}>
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm mb-3">
            {card.icon}
          </div>
          <h3 className="text-lg font-medium">{card.value}</h3>
          <p className="text-sm text-gray-800">{card.label}</p>
          <p className="text-xs text-gray-500 mt-1">{card.change}</p>
        </div>
      ))}
    </div>
  );
}
