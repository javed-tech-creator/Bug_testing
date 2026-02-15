import React, { useState } from "react";
import Chart from "react-apexcharts";

const TotalRevenue = () => {
  const [viewMode, setViewMode] = useState("Executive");
  const [timeFilter, setTimeFilter] = useState("This Week");

  const dataStructure = {
    "This Week": {
      Executive: [14, 17, 5, 15, 11, 15, 20],
      Self: [12, 15, 18, 10, 14, 19, 17],
      Team: [20, 19, 22, 18, 21, 25, 23],
    },
    "This Month": {
      Executive: [45, 48, 50, 52, 55, 57, 60, 62, 65, 67, 70, 72],
      Self: [40, 43, 45, 47, 49, 51, 53, 55, 57, 59, 61, 63],
      Team: [60, 63, 66, 69, 72, 75, 78, 81, 84, 87, 90, 93],
    },
    "This Year": {
      Executive: [180, 210, 240, 270],
      Self: [160, 190, 220, 250],
      Team: [220, 260, 300, 340],
    },
  };

  const xCategories =
    timeFilter === "This Week"
      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      : timeFilter === "This Month"
      ? [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ]
      : ["Q1", "Q2", "Q3", "Q4"];

  const options = {
    chart: {
      type: "bar",
      toolbar: { show: false },
    },
    colors: ["#3B82F6", "#65A989"], // Expected (blue), Business (green)
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        borderRadius: 6,
      },
    },
    dataLabels: { enabled: false },
    grid: {
      strokeDashArray: 4,
      borderColor: "#e5e7eb",
    },
    legend: {
      position: "bottom",
      markers: {
        width: 10,
        height: 10,
        radius: 12,
      },
    },
    xaxis: {
      categories: xCategories,
      labels: {
        style: { colors: "#6b7280", fontSize: "14px" },
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => `${value}k`,
        style: { colors: "#6b7280", fontSize: "14px" },
      },
    },
  };

  const series = [
    {
      name: "Expected",
      data: dataStructure[timeFilter][viewMode],
    },
    {
      name: "Business",
      data: dataStructure[timeFilter][viewMode].map((v) => Math.round(v * 0.8)),
    },
  ];

  return (
    <div className="w-full p-6 rounded-xl border shadow-md bg-white">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4 whitespace-nowrap">
        <h2 className="text-2xl font-bold text-gray-800">
          Total Revenue
        </h2>

        <div className="flex items-center gap-3 text-gray-700 whitespace-nowrap">
          <select
            className="border rounded-md px-2 py-1 text-base text-gray-700"
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
          >
            <option>Executive</option>
            <option>Self</option>
            <option>Team</option>
          </select>

          <select
            className="border rounded-md px-2 py-1 text-base text-gray-700"
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
          >
            <option>This Week</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      <Chart options={options} series={series} type="bar" height={320} width="100%" />
    </div>
  );
};

export default TotalRevenue;
