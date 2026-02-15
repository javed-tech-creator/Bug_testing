import React, { useState } from "react";
import Chart from "react-apexcharts";

const ClientsChart = () => {
  const [viewMode, setViewMode] = useState("Self");
  const [timeFilter, setTimeFilter] = useState("This Week");

  // Data organized by time period (Y-axis values change with time)
  const dataByTime = {
    "This Week": {
      Self: [{ name: "You", data: [30, 45, 35, 50, 49, 60, 70] }],
      Team: [
        { name: "You", data: [30, 45, 35, 50, 49, 60, 70] },
        { name: "Alice", data: [40, 55, 45, 60, 59, 70, 80] },
        { name: "Bob", data: [25, 35, 30, 40, 39, 50, 55] },
        { name: "Charlie", data: [35, 50, 40, 55, 54, 65, 75] },
      ],
    },
    "Last Week": {
      Self: [{ name: "You", data: [25, 40, 30, 45, 44, 55, 65] }],
      Team: [
        { name: "You", data: [25, 40, 30, 45, 44, 55, 65] },
        { name: "Alice", data: [35, 50, 40, 55, 54, 65, 75] },
        { name: "Bob", data: [20, 30, 25, 35, 34, 45, 50] },
        { name: "Charlie", data: [30, 45, 35, 50, 49, 60, 70] },
      ],
    },
    "This Month": {
      Self: [{ name: "You", data: [120, 150, 140, 180] }],
      Team: [
        { name: "You", data: [120, 150, 140, 180] },
        { name: "Alice", data: [160, 190, 180, 220] },
        { name: "Bob", data: [100, 130, 120, 150] },
        { name: "Charlie", data: [140, 170, 160, 200] },
      ],
    },
    "This Year": {
      Self: [{ name: "You", data: [450, 520, 480, 580] }],
      Team: [
        { name: "You", data: [450, 520, 480, 580] },
        { name: "Alice", data: [580, 650, 610, 710] },
        { name: "Bob", data: [380, 450, 410, 490] },
        { name: "Charlie", data: [520, 590, 550, 650] },
      ],
    },
  };

  // X-axis categories based on time filter
  const xCategories =
    timeFilter === "This Week" || timeFilter === "Last Week"
      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      : timeFilter === "This Month"
      ? ["Week 1", "Week 2", "Week 3", "Week 4"]
      : ["Q1", "Q2", "Q3", "Q4"];

  // Get current series data
  const series = dataByTime[timeFilter][viewMode];

  const options = {
    chart: {
      type: "line",
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 700,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    },

    stroke: {
      curve: "smooth",
      width: 3,
    },

    markers: {
      size: 5,
      strokeWidth: 2,
      hover: { size: 7 },
    },

    colors: ["#4A78FF", "#A066DD", "#E06A85", "#FFA94D"],

    xaxis: {
      categories: xCategories,
      labels: {
        show: true,
        style: {
          fontSize: "12px",
          fontWeight: 500,
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },

    yaxis: {
      labels: {
        style: { colors: "#6b7280", fontSize: "14px" },
      },
      title: {
        text: "Number of Clients",
        style: {
          fontSize: "14px",
          fontWeight: 500,
          color: "#6b7280",
        },
      },
    },

    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 4,
      padding: {
        left: 20,
        right: 20,
      },
    },

    legend: {
      position: "bottom",
      horizontalAlign: "center",
      markers: {
        width: 10,
        height: 10,
        radius: 12,
      },
      fontSize: "14px",
    },

    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value) => `${value} clients`,
      },
    },
  };

  return (
    <div className="w-full p-6 rounded-xl border shadow-md bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Clients</h2>
          <p className="text-sm text-gray-500 mt-1">
            {viewMode === "Self" ? "Your performance" : "Team performance"} •{" "}
            {timeFilter}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 mb-1 font-medium">
              View
            </label>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
            >
              <option>Self</option>
              <option>Team</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-gray-600 mb-1 font-medium">
              Period
            </label>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
            >
              <option>This Week</option>
              <option>Last Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
        </div>
      </div>

      <Chart options={options} series={series} type="line" height={350} />
    </div>
  );
};

export default ClientsChart;
