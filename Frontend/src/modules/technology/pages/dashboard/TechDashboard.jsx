import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Building2,
  FileText,
  AlertCircle,
  Shield,
  TrendingUp,
  PlusCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetAssetsDistributionQuery, useGetDashboardSummaryQuery, useGetTicketsByDepartmentQuery } from "@/api/technology/dashboard.api";
import DataLoading from "@/modules/vendor/components/DataLoading";
import { useAuth } from "@/store/AuthContext";
import EmployeeDashboard from "./EmployeeDashboard";

export default function ManagerDashboard() {

  const navigate = useNavigate();

    const { userData } = useAuth();
  const role = userData?.role; // "manager" ya "employee"

    // Call queries
  const { data: summary, isLoading: summaryLoading, error: summaryError } =
    useGetDashboardSummaryQuery();

  const { data: assets, isLoading: assetsLoading, error: assetsError } =
    useGetAssetsDistributionQuery();

  const { data: tickets, isLoading: ticketsLoading, error: ticketsError } =
    useGetTicketsByDepartmentQuery();    

    // Color mapping object
const colorMap = {
  "In Use": "#10b981",   // green
  "Repair": "#f59e0b",   // yellow
  "Spare": "#3b82f6",    // blue
  "Scrap": "#ef4444",    // red
};
// Merge color dynamically
const chartData = assets?.data.map(item => ({
  ...item,
  color: colorMap[item.name] || "#6b7280", // default gray if not found
}));

  const ticketData = [
    { department: "IT", open: 12, resolved: 20 },
    { department: "Finance", open: 5, resolved: 8 },
    { department: "HR", open: 2, resolved: 4 },
  ]; // it will replace with real data 


  const summaryData = [
    { 
      title: "Total Assets", 
      value: 0, 
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    { 
      title: "Licenses", 
      value: 0, 
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    { 
      title: "Tickets (Open)", 
      value: 0, 
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    { 
      title: "Active AMC", 
      value: 0, 
      icon: Shield,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  
const mergedSummary = summaryData.map(item => {
  if (!summary?.data) return item;
  switch(item.title) {
    case "Total Assets":
      return { ...item, value: summary.data.totalAssets };
    case "Licenses":
      return { ...item, value: summary.data.licenses };
    case "Tickets (Open)":
      return { ...item, value: summary.data.openTickets };
    case "Active AMC":
      return { ...item, value: summary.data.activeAmc };
    default:
      return item;
  }
});

  const actions = [
    {
      title: "Add Asset",
      icon: <PlusCircle className="w-6 h-6 text-blue-600" />,
      bg: "from-blue-50 to-white",
      iconBg: "bg-blue-100",
      path: "/tech/assets/add",
    },
    {
      title: "Software & License",
      icon: <PlusCircle className="w-6 h-6 text-blue-600" />,
      bg: "from-green-50 to-white",
      iconBg: "bg-green-100",
      path: "/tech/software-license/add",
    },
    {
      title: "Network & Infrastructure",
      icon: <PlusCircle className="w-6 h-6 text-blue-600" />,
      bg: "from-yellow-50 to-white",
      iconBg: "bg-yellow-100",
      path: "/tech/network-infrastructure/add",
    },
    {
      title: "Add Vendor",
      icon: <PlusCircle className="w-6 h-6 text-blue-600" />,
      bg: "from-purple-50 to-white",
      iconBg: "bg-purple-100",
      path: "/tech/vendor-amc-management/add",
    }, {
      title: "Access Control",
      icon: <PlusCircle className="w-6 h-6 text-blue-600" />,
      bg: "from-purple-50 to-white",
      iconBg: "bg-red-100",
      path: "/tech/data-access-control/add",
    },
  ];

  const COLORS = ["#10b981", "#f59e0b", "#3b82f6", "#ef4444"];
  
if (summaryLoading || assetsLoading || ticketsLoading) {
  return (
    <div className="flex items-center justify-center h-[90%] w-full">
      <DataLoading />
    </div>
  );
}

// Agar role employee hai to sirf simple view dikhao
  if (role !== "Manager") {
    return (
       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 ">
      <div className=" mx-auto space-y-6">

        <EmployeeDashboard/>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 ">
      <div className=" mx-auto space-y-6">

        {/* Top Summary Cards */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Key Metrics Overview
            </h2>
          </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
  {mergedSummary.map((item, index) => {
    const IconComponent = item.icon;
    return (
      <div 
        key={index} 
        className="flex items-center justify-between p-6 bg-gradient-to-br from-white to-blue-50
 border rounded-xl shadow-sm"
      >
        <div>
          <p className="text-sm text-gray-600 font-medium">{item.title}</p>
          <p className="text-2xl font-bold text-gray-900">{item.value}</p>
        </div>
        <div className={`p-3 rounded-lg ${item.bgColor}`}>
          <IconComponent className={`w-6 h-6 ${item.color}`} />
        </div>
      </div>
    );
  })}
</div>

        </div>

<div className="bg-white rounded-xl shadow-sm border border-gray-200  p-6">
         <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        ⚡ Quick Actions
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        {actions.map((action, index) => (
          <div
            key={index}
            onClick={() => navigate(action.path)}
            className={`cursor-pointer p-6 rounded-xl border bg-gradient-to-br ${action.bg} 
                        flex flex-col items-center justify-center gap-3 
                        shadow-sm hover:shadow-md hover:scale-105 transition`}
          >
            <div className={`p-3 rounded-full ${action.iconBg} flex items-center justify-center`}>
              {action.icon}
            </div>
            <p className="text-sm font-medium text-gray-700 text-center">{action.title}</p>
          </div>
        ))}
      </div>
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Assets Distribution */}
<Card className="bg-gradient-to-r from-white via-purple-50 to-indigo-50 border rounded-xl shadow hover:shadow-md transition-shadow">
  <CardContent className="p-6">
    {/* Title */}
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <Building2 className="w-5 h-5 text-blue-600" />
        Assets Distribution
      </h2>
    </div>

    {/* Chart + Legend side by side */}
    <div className="flex items-center justify-between">
      {/* Pie Chart */}
      <div className="flex-1">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={45}
              dataKey="value"
              paddingAngle={5}
              labelLine={true}
              label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Vertical Legend on Right */}
      <div className="ml-6 space-y-3">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <span
              className="w-3 h-3 rounded-full"
              style={{ background: item.color }}
            ></span>
            <span className="text-gray-700 font-medium">{item.name}</span>
            <span className="ml-auto font-semibold text-gray-800">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  </CardContent>
</Card>


  {/* Tickets by Department */}
<Card className="bg-gradient-to-r from-white via-purple-50 to-indigo-50 border rounded-xl shadow hover:shadow-md transition-shadow">
  <CardContent className="p-6">
    {/* Title + Legend Row */}
    <div className="flex items-start justify-between mb-4">
      {/* Title */}
      <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-orange-600" />
        Tickets by Department
      </h2>

      {/* Legend (Right Side - Vertical with Line) */}
      <div className="flex flex-col gap-3 border-l pl-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-orange-500"></span>
          <span className="text-sm text-gray-700">Open</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span className="text-sm text-gray-700">Resolved</span>
        </div>
      </div>
    </div>

    {/* Chart */}
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={tickets.data || ticketData} barGap={12}>
        {/* Grid lines (vertical + horizontal) */}
        <CartesianGrid strokeDasharray="3 3"  vertical={true} horizontal={true} />

        {/* X Axis with bottom line visible */}
        <XAxis 
          dataKey="department" 
          axisLine={true}   // line enable
          tickLine={false} 
        />

        {/* Y Axis with visible line */}
        <YAxis 
          axisLine={true}   // line enable (0 se 20 tak dikhega)
          tickLine={false} 
          domain={[0, 20]}  // 0 se 20 tak fix karne ke liye
        />

        <Tooltip />
        <Bar dataKey="open" fill="#f97316" radius={[6, 6, 0, 0]} />
        <Bar dataKey="resolved" fill="#10b981" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </CardContent>
</Card>


</div>


      </div>
    </div>
  );
}