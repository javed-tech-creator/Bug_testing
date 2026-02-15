import React, { useState } from "react";
import Chart from "react-apexcharts";

const TotalRevenue2 = () => {
  const [viewMode, setViewMode] = useState("All");
  const [timeFilter, setTimeFilter] = useState("Monthly");

  const dataMap = {
    Monthly: {
      All: [50, 48, 49, 55, 60, 53, 58, 62, 64, 66, 68, 70],
      Self: [40, 42, 45, 47, 48, 50, 51, 52, 53, 55, 57, 58],
      Team: [60, 58, 62, 64, 66, 68, 70, 72, 74, 75, 77, 80],
    },
    Weekly: {
      All: [10, 12, 15, 13, 18, 20, 22],
      Self: [7, 9, 10, 12, 13, 14, 15],
      Team: [14, 15, 17, 18, 20, 23, 25],
    },
    Yearly: {
      All: [200, 230, 250, 270],
      Self: [180, 200, 215, 230],
      Team: [220, 250, 280, 300],
    },
  };

  const categoriesMap = {
    Monthly: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    Weekly: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    Yearly: ["Q1", "Q2", "Q3", "Q4"],
  };

  const options = {
    chart: {
      type: "line",
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    },

    stroke: {
      curve: "smooth",
      width: 4,
    },

    markers: {
      size: 6,
      strokeWidth: 3,
      hover: { size: 8 },
    },

    colors: ["#4A78FF", "#2E9E59", "#F48FB1"], // Targeted, Collection, Business

    xaxis: {
      categories: categoriesMap[timeFilter] || [],
      labels: {
        style: { colors: "#6b7280", fontSize: "14px" },
      },
    },

    yaxis: {
      labels: {
        formatter: (value) => `${value}K`,
        style: { colors: "#6b7280", fontSize: "14px" },
      },
    },

    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 4,
    },

    legend: {
      position: "bottom",
      markers: {
        width: 10,
        height: 10,
        radius: 12,
      },
    },
  };

  const series = [
    {
      name: "Targeted",
      data: dataMap[timeFilter][viewMode],
    },
    {
      name: "Collection",
      data: dataMap[timeFilter][viewMode].map(v => Math.round(v * 0.6)),
    },
    {
      name: "Business",
      data: dataMap[timeFilter][viewMode].map(v => Math.round(v * 0.85)),
    },
  ];

  return (
    <div className=" p-6 rounded-xl border shadow-md bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Total Revenue</h2>

        <div className="flex items-center gap-4 text-gray-700">
          <select className="border rounded-md px-2 py-1 text-base text-gray-700"
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}>
            <option>All</option>
            <option>Self</option>
            <option>Team</option>
          </select>

          <select className="border rounded-md px-2 py-1 text-base text-gray-700"
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}>
            <option>Monthly</option>
            <option>Weekly</option>
            <option>Yearly</option>
          </select>
        </div>
      </div>

      <Chart options={options} series={series} type="line" height={320} />
    </div>
  );
};

export default TotalRevenue2;
