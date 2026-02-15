import React, { useState } from "react";
import Chart from "react-apexcharts";

const PaymentStatus = () => {
  const [viewMode, setViewMode] = useState("Executive");
  const [timeFilter, setTimeFilter] = useState("Monthly");

  const data = {
    Monthly: {
      Executive: [50, 15, 35],
      Self: [45, 20, 35],
      Team: [55, 25, 20],
    },
    Weekly: {
      Executive: [60, 10, 30],
      Self: [50, 15, 35],
      Team: [65, 20, 15],
    },
    Yearly: {
      Executive: [30, 30, 40],
      Self: [25, 35, 40],
      Team: [35, 25, 40],
    },
  };

  const labelOptions = {
    Executive: ["Executive Partial", "Executive Pending", "Executive Completed"],
    Self: ["Self Partial", "Self Pending", "Self Completed"],
    Team: ["Team Partial", "Team Pending", "Team Completed"],
  };

  const series = data[timeFilter][viewMode];

  const options = {
    chart: { type: "pie", toolbar: { show: false } },
    labels: labelOptions[viewMode],
    colors: ["#6C7BFF", "#E1B463", "#58B885"],
    legend: { position: "right" },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val.toFixed(0)}%`,
      style: { fontSize: "14px", fontWeight: 600 },
    },
  };

  return (
    <div className="w-full p-6 rounded-xl border shadow-md bg-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Payment Status</h2>

        <div className="flex items-center gap-3">
          <select
            className="border rounded-md px-2 py-1 text-base"
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
          >
            <option>Executive</option>
            <option>Self</option>
            <option>Team</option>
          </select>

          <select
            className="border rounded-md px-2 py-1 text-base"
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
          >
            <option>Monthly</option>
            <option>Weekly</option>
            <option>Yearly</option>
          </select>
        </div>
      </div>

      <Chart options={options} series={series} type="pie" height={330} />
    </div>
  );
};

export default PaymentStatus;
