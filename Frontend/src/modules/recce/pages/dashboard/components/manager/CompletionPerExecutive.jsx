import React, { useState } from "react";
import Chart from "react-apexcharts";

export default function CompletionPerExecutive() {
  const [timeFilter, setTimeFilter] = useState("This Week");

  const dataSet = {
    "This Week": {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      data: [20, 30, 25, 35, 40, 50],
    },
    "This Month": {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      data: [120, 150, 160, 180],
    },
    "This Year": {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      data: [300, 350, 400, 360, 380, 420, 450, 470, 430, 480, 500, 520],
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
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "45%",
      }
    },
    dataLabels: { enabled: false },
    colors: ["#64A9FF"],
    xaxis: {
      categories: selectedData.labels,
      labels: { style: { fontSize: "14px" } }
    },
    yaxis: {
      labels: { style: { fontSize: "14px" } }
    },
    grid: {
      strokeDashArray: 4
    },
    legend: {
      position: "bottom",
      fontSize: "14px"
    }
  };

  const series = [
    {
      name: "Recce Completion Per Executive",
      data: selectedData.data,
    },
  ];

  return (
    <div className="bg-white p-5 shadow rounded-xl border">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-semibold">Completion Per Executive</h2>
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
      <Chart options={options} series={series} type="bar" height={330} />
    </div>
  );
}
