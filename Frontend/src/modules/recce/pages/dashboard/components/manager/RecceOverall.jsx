import React, { useState } from "react";
import Chart from "react-apexcharts";

export default function RecceOverall() {
  const [timeFilter, setTimeFilter] = useState("This Week");

  const dataSet = {
    "This Week": {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      data: [20, 18, 25, 40, 55, 30],
    },
    "This Month": {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      data: [30, 45, 25, 60],
    },
    "This Year": {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      data: [100, 120, 80, 140, 160, 130, 150, 170, 145, 180, 200, 190],
    },
  };

  const selectedData = dataSet[timeFilter];

  const options = {
    chart: {
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
    },
    stroke: { curve: "smooth", width: 2 },
    markers: { size: 6, colors: "#648CFF" },
    colors: ["#648CFF"],
    grid: { strokeDashArray: 4 },
    xaxis: {
      categories: selectedData.labels,
      labels: { style: { fontSize: "14px" } },
    },
    yaxis: {
      labels: { style: { fontSize: "14px" } },
    },
  };

  const series = [
    {
      name: "Recce",
      data: selectedData.data,
    },
  ];

  return (
    <div className="bg-white p-5 shadow rounded-xl border">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Recce (Overall)</h2>
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="flex items-center gap-2 text-gray-600 border px-3 py-1 rounded-lg text-sm cursor-pointer bg-white"
        >
          <option>This Week</option>
          <option>This Month</option>
          <option>This Year</option>
        </select>
      </div>
      <Chart options={options} series={series} type="line" height={300} />
    </div>
  );
}
