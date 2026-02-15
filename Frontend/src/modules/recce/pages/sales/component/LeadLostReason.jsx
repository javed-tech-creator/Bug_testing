import React, { useState } from "react";
import Chart from "react-apexcharts";

const LeadLostReason = () => {
  const [timeFilter, setTimeFilter] = useState("This Week");

  const dataMap = {
    "This Week": [50, 15, 35],
    "Last Week": [40, 20, 40],
    "This Month": [45, 25, 30],
    "This Year": [30, 40, 30],
  };

  const options = {
    chart: {
      type: "donut",
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
    labels: ["Sales - Pricing", "Production - Delay", "Design - Design Issue"],
    colors: ["#7B83EB", "#EA6FA1", "#A678DD"],

    legend: {
      position: "right",
      fontSize: "14px",
      labels: { colors: "#333" },
      markers: {
        width: 10,
        height: 10,
        radius: 12,
      },
      itemMargin: {
        vertical: 6,
      },
    },

    dataLabels: {
      enabled: true,
      style: {
        colors: ["#fff"],
        fontSize: "14px",
        fontWeight: 600,
      },
      formatter: (val) => `${val.toFixed(0)}%`,
    },

    stroke: {
      width: 0,
    },

    plotOptions: {
      pie: {
        donut: {
          size: "60%",
        },
      },
    },
  };

  const series = dataMap[timeFilter] || [];

  return (
    <div className="w-full p-6 rounded-xl border shadow-md bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Lead Lost Reason</h2>

        <div className="flex items-center">
          <select
            className="border rounded-md px-2 py-1 text-base text-gray-700"
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

      {/* Chart */}
      <Chart options={options} series={series} type="donut" height={330} />
    </div>
  );
};

export default LeadLostReason;
