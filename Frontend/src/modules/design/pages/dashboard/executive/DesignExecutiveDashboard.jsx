import { useGetDashboardDataQuery } from "@/api/design/executive/next-day-planning/next-day-planning.api";
import DesignSimpleHeader from "@/modules/design/components/designs/DesignSimpleHeader";
import DesignTable from "@/modules/design/components/manager-dashboard/DesignTable";
import SectionHeader from "@/modules/design/components/manager-dashboard/SectionHeader";
import { Coins } from "lucide-react";
import React, { useEffect } from "react";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const DesignExecutiveDashboard = () => {

  const {
    data,
    isLoading,
    isFetching,
    error
  } = useGetDashboardDataQuery();

  useEffect(() => {
    console.log('data:>', data)
  }, [data])


  const stats = [
    {
      title: "Total Designs",
      value: data?.total_designs || 0,
      bg: "bg-blue-100",
      border: "border-blue-500",
      text: "text-blue-600",
    },
    {
      title: "Todays Designs",
      value: data?.todays_designs || 0,
      bg: "bg-purple-100",
      border: "border-purple-500",
      text: "text-purple-600",
    },
    {
      title: "Assigned Designs",
      value: data?.assigned_designs || 0,
      bg: "bg-yellow-100",
      border: "border-yellow-500",
      text: "text-yellow-600",
    },
    {
      title: "Completed Designs",
      value: data?.completed_designs || 0,
      bg: "bg-green-100",
      border: "border-green-500",
      text: "text-green-600",
    },
    {
      title: "Waiting Designs",
      value: data?.waiting_designs || 0,
      bg: "bg-red-100",
      border: "border-red-500",
      text: "text-red-600",
    },
  ];

  const performanceData = [
    { name: "Sunday", completed: 14, waiting: 12 },
    { name: "Monday", completed: 17, waiting: 11 },
    { name: "Tuesday", completed: 6, waiting: 22 },
    { name: "Wednesday", completed: 16, waiting: 6 },
    { name: "Thursday", completed: 12, waiting: 11 },
    { name: "Friday", completed: 17, waiting: 13 },
    { name: "Saturday", completed: 21, waiting: 11 },
  ];

  const designData = [
    {
      id: "T-421",
      product: "Flex Sign Board",
      date: "11 Nov 25, 10:30AM",
      status: "Modification Required",
      deadline: "11 Nov 25, 11:30AM",
    },
    {
      id: "T-423",
      product: "LED Channel Letter Signage",
      date: "11 Nov 25, 10:30AM",
      status: "Modification Required",
      deadline: "11 Nov 25, 11:30AM",
    },
    {
      id: "T-424",
      product: "Acrylic Sign Board",
      date: "11 Nov 25, 10:30AM",
      status: "Modification Required",
      deadline: "11 Nov 25, 11:30AM",
    },
  ];



  return (
    <div className="px-5 min-h-screen bg-slate-50">
      <DesignSimpleHeader title="Design Executive Dashboard" funnel={true} />

      <div className="grid grid-cols-5 gap-4">
        {stats.map((item, index) => (
          <div
            key={index}
            className={`p-4 text-center rounded-sm border-2 ${item.bg} ${item.border}`}
          >
            <p className="text-md  font-semibold text-gray-800">{item.title}</p>
            <p className={`mt-2 text-2xl font-bold ${item.text}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Performance analytics  */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mt-5">
        {/* ================= LEFT : CHART ================= */}
        <div className="lg:col-span-2 bg-white border-2 rounded-sm p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Weekly Productivity
            </h2>

            <div className="flex gap-3">
              <select className="border rounded px-2 py-1 text-sm">
                <option>This Week</option>
              </select>
            </div>
          </div>

          {/* Chart */}
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={performanceData}>
              <XAxis dataKey="name" interval={0} tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="completed"
                name="Task Completed"
                fill="#4CAF84"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="waiting"
                name="Waiting"
                fill="#F59E0B"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ================= RIGHT : CARDS ================= */}
        <div className="flex flex-col gap-6 w-full">
          {/* ================= COINS CARD ================= */}
          <div className="relative rounded-sm border-2 border-orange-300 bg-gradient-to-r from-yellow-100 to-orange-300 p-6">
            {/* Text */}
            <p className="text-lg font-semibold text-orange-500">
              Current Coins
            </p>

            <h1 className="text-5xl font-bold text-orange-500 mt-1">2,550</h1>

            {/* Coin Icon */}
            <div className="absolute top-4 right-4 w-14 h-14 rounded-full bg-orange-400 flex items-center justify-center shadow-md">
              <Coins size={28} className="text-white" />
            </div>
          </div>

          {/* ================= TASK INFO ================= */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between font-medium text-gray-700">
              <span>Daily Task</span>
              <span className="text-green-600">+50</span>
            </div>

            <div className="flex justify-between font-medium text-gray-700">
              <span>Fast Delivery</span>
              <span className="text-green-600">+100</span>
            </div>
          </div>

          {/* ================= BUTTON ================= */}
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Redeem Rewards
          </button>

          {/* ================= RATINGS CARD ================= */}
          <div className="rounded-sm border-2 border-orange-300 p-6 flex items-center gap-6">
            <h2 className="text-5xl font-bold text-gray-600">4.8</h2>

            <div>
              <p className="font-semibold text-gray-700 mb-1">Top Ratings</p>

              <div className="flex gap-1 text-orange-400 text-xl">
                ★ ★ ★ ★ ★
              </div>
            </div>
          </div>
        </div>
      </div>

      <SectionHeader
        title="Modification Required Designs"
        actionText="View All"
      />
      <DesignTable data={designData} />

      <SectionHeader
        title="Modification Required Mockups"
        actionText="View All"
      />
      <DesignTable data={designData} />
    </div>
  );
};

export default DesignExecutiveDashboard;
