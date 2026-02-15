import React, { useState } from "react";
import Chart from "react-apexcharts";
import LegendItem from "./LegendItem";

const LostLeads = () => {
  const [dateFilter, setDateFilter] = useState("This Week");
  const [leadType, setLeadType] = useState("Hot");
  const [quotationFilter, setQuotationFilter] = useState("Pending");

  const dataStructure = {
    "Today": {
      categories: ["10 AM", "12 PM", "2 PM", "4 PM"],
      Hot: [10, 12, 15, 9],
      Warm: [7, 9, 11, 8],
      Cold: [4, 5, 6, 5],
    },
    "Yesterday": {
      categories: ["10 AM", "12 PM", "2 PM", "4 PM"],
      Hot: [8, 10, 12, 7],
      Warm: [6, 8, 9, 6],
      Cold: [3, 5, 6, 4],
    },
    "This Week": {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      Hot: [22, 28, 33, 40, 30, 28, 20],
      Warm: [18, 22, 26, 30, 28, 26, 22],
      Cold: [12, 15, 17, 20, 18, 15, 10],
    },
    "This Month": {
      categories: ["W1", "W2", "W3", "W4"],
      Hot: [33, 40, 30, 28],
      Warm: [26, 30, 28, 26],
      Cold: [17, 20, 18, 15],
    },
  };

  const options = {
    chart: {
      type: "bar",
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
    grid: {
      borderColor: "#f1f1f1",
    },
    plotOptions: {
      bar: {
        columnWidth: "45%",
        borderRadius: 4,
      },
    },
    colors: ["#E66B5B"], // red bar color
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: dataStructure[dateFilter]?.categories || [],
      labels: {
        style: { colors: "#6b7280", fontSize: "14px" },
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => `${value}k`,
        style: { colors: "#9CA3AF", fontSize: "14px" },
      },
    },
    legend: { show: false },
  };

  const series = [
    {
      name: "Lost Lead",
      data: dataStructure[dateFilter]?.[leadType] || [],
    },
  ];

  return (
    <div className="w-full p-6 rounded-xl border shadow-md bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Lost Leads</h2>

        <div className="flex items-center gap-4 text-gray-700">
          <select className="border rounded-md px-2 py-1 text-base text-gray-700"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}>
            <option value="Today">Today</option>
            <option value="Yesterday">Yesterday</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
          </select>

          <select className="border rounded-md px-2 py-1 text-base text-gray-700"
            value={leadType}
            onChange={(e) => setLeadType(e.target.value)}>
            <option>Hot</option>
            <option>Warm</option>
            <option>Cold</option>
          </select>

          <select className="border rounded-md px-2 py-1 text-base text-gray-700"
            value={quotationFilter}
            onChange={(e) => setQuotationFilter(e.target.value)}>
            <option>Quotation</option>
            <option>Pending</option>
            <option>Sent</option>
            <option>Approved</option>
          </select>
        </div>
      </div>

      {/* Chart */}
      <Chart options={options} series={series} type="bar" height={320} />

      {/* Legend */}
      <div className="mt-4">
        <LegendItem color="#E66B5B" label="Lost Lead" />
      </div>
    </div>
  );
};

export default LostLeads;
