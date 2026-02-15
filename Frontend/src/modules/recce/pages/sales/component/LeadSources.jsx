import React from "react";
import Chart from "react-apexcharts";
import LegendItem from "./LegendItem";

const LeadSources = () => {
  const options = {
    chart: {
      type: "line",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    stroke: {
      curve: "smooth",
      width: 5,
    },
    colors: ["#A020F0", "#E66B5B", "#65A989"], // Marketing, Referral, Website
    markers: {
      size: [0, 8, 0], // Only Referral has dot
      colors: ["#A020F0", "#E66B5B", "#65A989"],
      strokeWidth: 3,
      hover: { size: 10 },
    },
    grid: {
      borderColor: "#f1f1f1",
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
      ],
      labels: {
        style: { colors: "#9CA3AF", fontSize: "13px" },
      },
    },
    yaxis: {
      labels: {
        style: { colors: "#9CA3AF", fontSize: "13px" },
      },
    },
    legend: { show: false },
  };

  const series = [
    {
      name: "Marketing",
      data: [320, 340, 260, 180, 200, 260, 320, 330, 300, 240, 180],
    },
    {
      name: "Referral",
      data: [260, 280, 200, 120, 150, 260, 360, 340, 300, 220, 150],
    },
    {
      name: "Website",
      data: [270, 340, 320, 260, 210, 260, 310, 320, 290, 240, 210],
    },
  ];

  return (
    <div className="w-full p-6 rounded-xl border shadow-md bg-white mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Lead Sources</h2>

      <Chart options={options} series={series} type="line" height={250} />

      {/* LEGENDS */}
      <div className="flex justify-center gap-10 mt-2 text-base text-gray-700">
        <LegendItem color="#A020F0" label="Marketing" />
        <LegendItem color="#E66B5B" label="Referral" />
        <LegendItem color="#65A989" label="Website" />
      </div>
    </div>
  );
};

export default LeadSources;
