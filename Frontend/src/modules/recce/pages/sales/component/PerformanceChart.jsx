import React from "react";
import Chart from "react-apexcharts";
import PerformanceCard from "./PerformanceCard";

const PerformanceChart = () => {
  const series = [
    {
      name: "Lost",
      data: [45, 40, 55, 37, 70, 75, 78, 65, 60, 72, 80, 85],
      color: "#FF6B6B",
    },
    {
      name: "Won",
      data: [38, 32, 30, 40, 50, 52, 48, 55, 58, 60, 62, 65],
      color: "#6ECF8A",
    },
  ];

  const options = {
    chart: {
      type: "bar",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        borderRadius: 8,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: false,
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"],
      labels: {
        style: {
          fontSize: "14px",
          colors: "#666",
        },
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      markers: {
        width: 14,
        height: 14,
        radius: 4,
      },
      itemMargin: { horizontal: 10 },
    },
    grid: {
      show: false,
    },
  };

  return (
    <PerformanceCard>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Performance</h2>
      <Chart
        options={options}
        series={series}
        type="bar"
        height={320}
        width="100%"
      />
    </PerformanceCard>
  );
};

export default PerformanceChart;
