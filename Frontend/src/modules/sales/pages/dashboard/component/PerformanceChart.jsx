import React from "react";
import Chart from "react-apexcharts";
import PerformanceCard from "./PerformanceCard";
import { useGetMonthlyLeadPerformanceFYQuery } from "@/api/sales/dashboard.sales.api.js";
import Loader from "@/components/Loader";

const PerformanceChart = () => {
  const { data, isLoading } = useGetMonthlyLeadPerformanceFYQuery();

  // API payload
  const monthlyData = data?.data || [];

  // X-axis categories (order as API gives FY)
  const categories = monthlyData.map((item) => item.month);

  // Series mapping
  const series = [
    {
      name: "Lost",
      data: monthlyData.map((item) => item.lost),
      color: "#FF6B6B",
    },
    {
      name: "Won",
      data: monthlyData.map((item) => item.won),
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
      categories,
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

  if (isLoading) {
    return (
      <PerformanceCard>
        <div className="h-[320px] flex items-center justify-center">
         <Loader/>
        </div>
      </PerformanceCard>
    );
  }

  return (
    <PerformanceCard>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Lead Status Monthly
      </h2>

      <Chart
        options={options}
        series={series}
        type="bar"
        height={340}
        width="100%"
      />
    </PerformanceCard>
  );
};

export default PerformanceChart;
