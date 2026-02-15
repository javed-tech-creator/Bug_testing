import React from "react";
import StatsCard from "./StatsCard";
import {
  BarChart2,
  FileText,
  TrendingUp,
  TrendingDown,
  User,
} from "lucide-react";

const cards = [
  {
    icon: (
      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-purple-200">
        <BarChart2 size={28} className="text-purple-600" />
      </div>
    ),
    value: "10k",
    label: "Assigned Leads",
    change: "+8% from yesterday",
    bg: "bg-purple-100",
  },
  {
    icon: (
      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-200">
        <FileText size={28} className="text-blue-600" />
      </div>
    ),
    value: "3000",
    label: "Qualified Leads",
    change: "+5% from yesterday",
    bg: "bg-blue-100",
  },
  {
    icon: (
      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-yellow-200">
        <TrendingUp size={28} className="text-orange-500" />
      </div>
    ),
    value: "59.3%",
    label: "Conversion Rate",
    change: "+1.2% from yesterday",
    bg: "bg-yellow-100",
  },
  {
    icon: (
      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-red-200">
        <TrendingDown size={28} className="text-red-500" />
      </div>
    ),
    value: "800",
    label: "Lost Leads",
    change: "0.5% from yesterday",
    bg: "bg-red-100",
  },
  {
    icon: (
      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-green-200">
        <span className="text-green-600 text-3xl font-bold">₹</span>
      </div>
    ),
    value: "₹1.2L",
    label: "Total Incentives",
    change: "+5% from yesterday",
    bg: "bg-green-100",
  },
  {
    icon: (
      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-green-200">
        <span className="text-green-600 text-3xl font-bold">₹</span>
      </div>
    ),
    value: "₹12.3L",
    label: "Total Revenue",
    change: "+5% from yesterday",
    bg: "bg-green-100",
  },
  {
    icon: (
      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-red-200">
        <span className="text-red-500 text-3xl font-bold">₹</span>
      </div>
    ),
    value: "₹14.8L",
    label: "Expect. Revenue",
    change: "0.5% from yesterday",
    bg: "bg-red-100",
  },
  {
    icon: (
      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-200">
        <User size={28} className="text-blue-600" />
      </div>
    ),
    value: "3000",
    label: "Total Executives",
    change: "+5% from yesterday",
    bg: "bg-blue-100",
  },
  {
    icon: (
      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-purple-200">
        <span className="text-purple-600 text-3xl font-bold">₹</span>
      </div>
    ),
    value: "₹1.5L",
    label: "Expect. Incentive",
    change: "+8% from yesterday",
    bg: "bg-purple-100",
  },
  {
    icon: (
      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-yellow-200">
        <TrendingUp size={28} className="text-orange-500" />
      </div>
    ),
    value: "15k",
    label: "Won Leads",
    change: "+1.2% from yesterday",
    bg: "bg-yellow-100",
  },
];

const SalesStatsGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
      {cards.map((card, index) => (
        <StatsCard key={index} {...card} />
      ))}
    </div>
  );
};

export default SalesStatsGrid;
