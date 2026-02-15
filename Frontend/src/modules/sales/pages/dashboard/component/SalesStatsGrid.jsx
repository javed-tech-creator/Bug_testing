import React from "react";
import {
  BarChart2,
  FileText,
  TrendingUp,
  TrendingDown,
  User,
} from "lucide-react";
import { useGetDashboardStatsQuery } from "@/api/sales/dashboard.sales.api.js";
import Loader from "@/components/Loader";

const cards = [
  {
    icon: <BarChart2 size={28} className="text-purple-600" />,
    value: "10k",
    label: "Assigned Leads",
    change: "+8% from yesterday",
    bg: "bg-purple-100",
  },
  {
    icon: <FileText size={28} className="text-blue-600" />,
    value: "3000",
    label: "Qualified Leads",
    change: "+5% from yesterday",
    bg: "bg-blue-100",
  },
  {
    icon: <TrendingUp size={28} className="text-orange-500" />,
    value: "59.3%",
    label: "Conversion Rate",
    change: "+1.2% from yesterday",
    bg: "bg-yellow-100",
  },
  {
    icon: <TrendingDown size={28} className="text-red-500" />,
    value: "800",
    label: "Lost Leads",
    change: "0.5% from yesterday",
    bg: "bg-red-100",
  },
  {
    icon: <span className="text-green-600 text-3xl font-bold">₹</span>,
    value: "₹1.2L",
    label: "Total Incentives",
    change: "+5% from yesterday",
    bg: "bg-green-100",
  },
  {
    icon: <span className="text-green-600 text-3xl font-bold">₹</span>,
    value: "₹12.3L",
    label: "Total Revenue",
    change: "+5% from yesterday",
    bg: "bg-green-100",
  },
  {
    icon: <span className="text-red-500 text-3xl font-bold">₹</span>,
    value: "₹14.8L",
    label: "Expect. Revenue",
    change: "0.5% from yesterday",
    bg: "bg-red-100",
  },
  {
    icon: <User size={28} className="text-blue-600" />,
    value: "3000",
    label: "Close Deals",
    change: "+5% from yesterday",
    bg: "bg-blue-100",
  },
  {
    icon: <span className="text-purple-600 text-3xl font-bold">₹</span>,
    value: "₹1.5L",
    label: "Expect. Incentive",
    change: "+8% from yesterday",
    bg: "bg-purple-100",
  },
  {
    icon: <TrendingUp size={28} className="text-orange-500" />,
    value: "15k",
    label: "Won Leads",
    change: "+1.2% from yesterday",
    bg: "bg-yellow-100",
  },
];

const StatsCard = ({ icon, value, label, change, bg }) => {
  return (
    <div
      className={`p-4 rounded-lg shadow-sm border ${bg} transition-all hover:shadow-md`}
    >
      <div className="flex gap-x-5">

        {/* Icon wrapper final design */}
        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white shadow-inner">
          {icon}
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mt-3">{value}</h2>
      </div>

      <p className="text-base font-medium text-gray-700 mt-1">{label}</p>
    </div>
  );
};

const SalesStatsGrid = () => {
  const { data, isLoading } = useGetDashboardStatsQuery();
  if (isLoading) return <div><Loader /></div>;

  const stats = data?.data || {};

  const cards = [
    {
      icon: <BarChart2 size={28} className="text-purple-600" />,
      value: stats.assignedLeads ?? 0,
      label: stats.assignedLeads ? "Assigned Leads" : "Total Leads",
      bg: "bg-purple-100",
    },
    {
      icon: <FileText size={28} className="text-blue-600" />,
      value: stats.qualifiedLeads ?? 0,
      label: "Qualified Leads",
      bg: "bg-blue-100",
    },
    {
      icon: <TrendingUp size={28} className="text-orange-500" />,
      value: stats.conversionRate ?? "0%",
      label: "Conversion Rate",
      bg: "bg-yellow-100",
    },
    {
      icon: <TrendingDown size={28} className="text-red-500" />,
      value: stats.lostLeads ?? 0,
      label: "Lost Leads",
      bg: "bg-red-100",
    },
    {
      icon: <span className="text-green-600 text-3xl font-bold">₹</span>,
      value: stats.totalIncentives ?? "₹0",
      label: "Total Incentives",
      bg: "bg-green-100",
    },
    {
      icon: <span className="text-green-600 text-3xl font-bold">₹</span>,
      value: stats.totalRevenue ?? "₹0",
      label: "Total Revenue",
      bg: "bg-green-100",
    },
    {
      icon: <span className="text-red-500 text-3xl font-bold">₹</span>,
      value: stats.expectedRevenue ?? "₹0",
      label: "Expected Revenue",
      bg: "bg-red-100",
    },
    {
      icon: <User size={28} className="text-blue-600" />,
      value: stats.closedDeals ?? 0,
      label: "Closed Deals",
      bg: "bg-blue-100",
    },
    {
      icon: <span className="text-purple-600 text-3xl font-bold">₹</span>,
      value: stats.expectedIncentive ?? "₹0",
      label: "Expected Incentive",
      bg: "bg-purple-100",
    },
    {
      icon: <TrendingUp size={28} className="text-orange-500" />,
      value: stats.wonLeads ?? 0,
      label: "Won Leads",
      bg: "bg-yellow-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
      {cards.map((card, index) => (
        <StatsCard key={index} {...card} />
      ))}
    </div>
  );
};

export default SalesStatsGrid;
