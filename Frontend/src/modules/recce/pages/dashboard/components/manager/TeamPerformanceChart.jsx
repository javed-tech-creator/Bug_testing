import React, { useState } from "react";
import Chart from "react-apexcharts";
import { ChevronDown } from "lucide-react";

export default function TeamPerformanceChart() {
  const [timeFilter, setTimeFilter] = useState("This Week");

  const dataSet = {
    "This Week": {
      labels: ["Excellent", "Good", "Bad"],
      data: [35, 50, 15],
    },
    "This Month": {
      labels: ["Excellent", "Good", "Bad"],
      data: [45, 40, 15],
    },
    "This Year": {
      labels: ["Excellent", "Good", "Bad"],
      data: [50, 35, 15],
    },
  };

  const selectedData = dataSet[timeFilter];

  const options = {
    chart: {
      type: "donut",
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
    },
    labels: selectedData.labels,
    colors: ["#8A5CF6", "#6C7BFF", "#F076A1"],
    dataLabels: {
      enabled: true,
      formatter: (val) => `${Math.round(val)}%`,
      style: { fontSize: "16px", fontWeight: "bold" },
    },
    legend: { show: false },
    stroke: { width: 0 },
    plotOptions: {
      pie: {
        donut: {
          size: "50%", // reduced radius
        },
      },
    },
  };

  const series = selectedData.data;

  return (
    <div
      className="bg-white p-5 shadow rounded-xl border"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Team Performance</h2>

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

      <Chart options={options} series={series} type="donut" height={300} />
    </div>
  );
}
