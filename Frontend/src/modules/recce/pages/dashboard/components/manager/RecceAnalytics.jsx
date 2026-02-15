import React from "react";
import Chart from "react-apexcharts";

export default function RecceAnalytics() {
  const options = {
    labels: ["Approved", "Revisit", "Rejected"],
    colors: ["#4CAF50", "#FFC107", "#F44336"],
    plotOptions: {
      pie: {
        donut: {
          size: "50%" // reduced radius
        }
      }
    },
  };

  const series = [80, 10, 10];

  return (
    <div className="bg-white p-5 shadow rounded-lg ">
      <h2 className="text-xl font-semibold mb-3">Recce Analytics</h2>
      <Chart options={options} series={series} type="donut" height={500} />
    </div>
  );
}
