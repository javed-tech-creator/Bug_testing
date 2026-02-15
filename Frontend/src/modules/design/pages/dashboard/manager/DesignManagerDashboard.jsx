import React, { useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Layers,
  PlusCircle,
  Loader,
  Flag,
  Clock,
  Pencil,
  CheckCircle,
  Hourglass,
  Coins,
} from "lucide-react";
import DesignSimpleHeader from "@/modules/design/components/designs/DesignSimpleHeader";
import DesignManagerAnalytics from "@/modules/design/components/manager-dashboard/Analytics";
import SectionHeader from "@/modules/design/components/manager-dashboard/SectionHeader";
import DesignTable from "@/modules/design/components/manager-dashboard/DesignTable";
import { useGetManagerDashboardDataQuery, useGetManagerDashModificationDataQuery } from "@/api/design/manager/manager-dashboard/manager-dashboard.api";



export default function DesignManagerDashboard() {

  const {
    data: statsData,
    isLoading: statsLoading,
    isFetching: statsFetching,
    error: statsError
  } = useGetManagerDashboardDataQuery();

  const {
    data: modificationData,
    isLoading: modificationLoading,
    isFetching: modificationFetching,
    error: modificationError
  } = useGetManagerDashModificationDataQuery();


  const stats = [
    {
      title: "Total Designs",
      value: statsData?.total_designs || 0,
      icon: <Layers className="w-6 h-6 text-blue-600" />,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "New Today",
      value: statsData?.new_today || 0,
      icon: <PlusCircle className="w-6 h-6 text-green-600" />,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "In Progress",
      value: statsData?.in_progress || 0,
      icon: <Loader className="w-6 h-6 text-orange-500" />,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
    {
      title: "Flag Raised",
      value: statsData?.flag_raised || 0,
      icon: <Flag className="w-6 h-6 text-red-600" />,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      title: "In Waiting",
      value: statsData?.in_waiting || 0,
      icon: <Clock className="w-6 h-6 text-gray-600" />,
      color: "text-gray-700",
      bg: "bg-gray-100",
    },
    {
      title: "Under Modification",
      value: modificationData?.under_modification_count || 0,
      icon: <Pencil className="w-6 h-6 text-orange-500" />,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
    {
      title: "Completed",
      value: statsData?.completed || 0,
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Delayed",
      value: statsData?.delayed || 0,
      icon: <Hourglass className="w-6 h-6 text-red-600" />,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  const workflowData = [
    { label: "Design Started", value: 10, color: "blue" },
    { label: "Option Created", value: 9, color: "green" },
    { label: "Modifications", value: 5, color: "orange" },
    { label: "Design Approved", value: 4, color: "green" },
    { label: "Mockup Started", value: 10, color: "blue" },
    { label: "Modifications", value: 10, color: "orange" },
    { label: "Mockup Approved", value: 10, color: "green" },
    { label: "Measurement Started", value: 10, color: "blue" },
    { label: "Approved", value: 10, color: "green" },
  ];

  const colorMap = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    orange: "bg-orange-500",
  };

  const timeTakenData = [
    { stage: "Option Selection", hours: 25 },
    { stage: "Design Modification", hours: 62 },
    { stage: "Design Approval", hours: 18 },
    { stage: "Mockup Modification", hours: 21 },
    { stage: "Mockup Approval", hours: 28 },
    { stage: "Measurement Approval", hours: 22 },
    { stage: "Design Completion", hours: 20 },
  ];

  const topPerformers = [
    {
      date: "09-08-2024",
      name: "Hemanth Raghava",
      email: "heamn@gmail.com",
      status: "Excellent",
      designs: 20,
    },
    {
      date: "02-08-2024",
      name: "Angel Arna",
      email: "arna@gmail.com",
      status: "Good",
      designs: 19,
    },
    {
      date: "15-07-2024",
      name: "Peter",
      email: "peter@gmail.com",
      status: "Good",
      designs: 15,
    },
    {
      date: "13-07-2024",
      name: "Rohit Singh",
      email: "rohit@gmail.com",
      status: "Bad",
      designs: 9,
    },
  ];

  const performanceData = [
    { name: "Good", value: 85, fill: "#10b981" },
    { name: "Bad", value: 15, fill: "#ff0000" },
  ];

  const teamPerformanceData = [
    { name: "Raj Singh", completed: 14, waiting: 12 },
    { name: "Neha", completed: 17, waiting: 11 },
    { name: "Ravi", completed: 6, waiting: 22 },
    { name: "Devika", completed: 16, waiting: 6 },
    { name: "Rahul", completed: 12, waiting: 11 },
    { name: "Manan", completed: 17, waiting: 13 },
    { name: "Suhel", completed: 21, waiting: 11 },
  ];

  const designData = [
    {
      id: "T-421",
      product: "Flex Sign Board",
      date: "11 Nov 25, 10:30AM",
      status: "Pending",
      deadline: "11 Nov 25, 11:30AM",
    },
    {
      id: "T-423",
      product: "LED Channel Letter Signage",
      date: "11 Nov 25, 10:30AM",
      status: "Pending",
      deadline: "11 Nov 25, 11:30AM",
    },
    {
      id: "T-424",
      product: "Acrylic Sign Board",
      date: "11 Nov 25, 10:30AM",
      status: "Pending",
      deadline: "11 Nov 25, 11:30AM",
    },
  ];


  useEffect(() => {
    console.log('statsData:>', statsData);
    console.log('modificationData:>', modificationData);
  }, [statsData, modificationData])


  return (
    <div className="px-5 min-h-screen bg-slate-50">
      <DesignSimpleHeader
        title="Design Manager Dashboard"
        funnel={true}
        assign={true}
      />

      {/* ===== STATS GRID ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white border-2 border-gray-200 rounded-sm p-5 flex justify-between items-center  hover:shadow-sm transition"
          >
            <div>
              <p className="text-sm text-gray-600 font-medium">{item.title}</p>
              <p className={`text-3xl font-bold mt-2 ${item.color}`}>
                {item.value}
              </p>
            </div>

            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center ${item.bg}`}
            >
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* workflow  */}
      <div className="bg-white border-2 border-gray-200 rounded-sm mt-5 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          Workflow Overview
        </h2>

        <div className="relative flex items-center justify-between">
          {workflowData.map((step, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center flex-1"
            >
              {/* DOTTED LINE */}
              {index !== 0 && (
                <div className="absolute top-6 left-[-50%] w-full border-t-2 border-dashed border-blue-400 z-0" />
              )}

              {/* CIRCLE */}
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold z-10 ${colorMap[step.color]
                  }`}
              >
                {step.value.toString().padStart(2, "0")}
              </div>

              {/* LABEL */}
              <p className="text-[10px]  font-bold mt-3 text-center whitespace-nowrap">
                {step.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics  */}
      <DesignManagerAnalytics />

      {/* time taken per stage  */}
      <div className="bg-white border-2 border-gray-200 rounded-sm p-5 mt-5">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-900">Time Taken Per Stage</h3>

          <div className="flex gap-4 text-sm text-gray-600">
            <select className="border rounded px-2 py-1">
              <option>Executive Name</option>
            </select>
            <select className="border rounded px-2 py-1">
              <option>Product Name</option>
            </select>
          </div>
        </div>

        {/* CHART */}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={timeTakenData}
            margin={{ top: 10, right: 20, left: 10, bottom: 40 }}
          >
            <XAxis
              dataKey="stage"
              tick={{ fontSize: 12 }}
              interval={0}
              angle={0}
            />

            <YAxis
              tick={{ fontSize: 12 }}
              label={{
                value: "Hours",
                angle: -90,
                position: "insideLeft",
                offset: 10,
              }}
            />

            <Tooltip />

            <Bar
              dataKey="hours"
              fill="#38a9ff"
              radius={[6, 6, 0, 0]}
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>

        {/* LEGEND */}
        <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
          <span className="w-3 h-3 rounded-full bg-blue-400" />
          Hours
        </div>
      </div>

      {/* Top and team performance  */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-5">
        {/* ================= LEFT : TOP PERFORMERS TABLE ================= */}
        <div className="lg:col-span-2 bg-white border-2 rounded-sm p-5">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Top Performers
            </h3>

            <select className="border rounded px-2 py-1 text-sm">
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-500 border-b">
                <tr>
                  <th className="text-left py-3">Date</th>
                  <th className="text-left py-3">Executive Name</th>
                  <th className="text-left py-3">Email</th>
                  <th className="text-left py-3">Status</th>
                  <th className="text-right py-3">Designs Completed</th>
                </tr>
              </thead>

              <tbody>
                {topPerformers.map((row, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-4">{row.date}</td>

                    <td className="py-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center font-semibold">
                        {row.name.charAt(0)}
                      </div>
                      {row.name}
                    </td>

                    <td className="py-4">{row.email}</td>

                    <td className="py-4">
                      <span
                        className={`px-4 py-1 rounded-full text-xs font-semibold
                        ${row.status === "Excellent"
                            ? "bg-green-100 text-green-700"
                            : row.status === "Good"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-600"
                          }`}
                      >
                        {row.status}
                      </span>
                    </td>

                    <td className="py-4 text-right font-semibold">
                      {row.designs}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= RIGHT : OVERALL PERFORMANCE ================= */}
        <div className="bg-white border-2 rounded-sm p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Overall Team Performance
          </h3>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={performanceData}>
              <XAxis dataKey="name" />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="value" radius={[0, 0, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          {/* LABELS */}
          <div className="flex justify-around mt-3 text-sm font-semibold">
            <span className="text-green-600">Good (85%)</span>
            <span className="text-red-600">Bad (15%)</span>
          </div>
        </div>
      </div>

      {/* Performance analytics  */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-5">
        {/* ================= LEFT : CHART ================= */}
        <div className="lg:col-span-2 bg-white border-2 rounded-sm p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Team Performance Analytics
            </h2>

            <div className="flex gap-3">
              <select className="border rounded px-2 py-1 text-sm">
                <option>Date</option>
              </select>
              <select className="border rounded px-2 py-1 text-sm">
                <option>Today</option>
              </select>
            </div>
          </div>

          {/* Chart */}
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={teamPerformanceData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="completed"
                name="Completed"
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

      <SectionHeader title="Designs Options (Pending)" actionText="View All" />
      <DesignTable data={designData} />

      <SectionHeader title="Options Versions (Pending)" actionText="View All" />
      <DesignTable data={designData} />

      <SectionHeader title="Mockup Versions (Pending)" actionText="View All" />
      <DesignTable data={designData} />

      <SectionHeader title="Design Measurements For Quotation (Pending)" actionText="View All" />
      <DesignTable data={designData} />

    </div>
  );
}
