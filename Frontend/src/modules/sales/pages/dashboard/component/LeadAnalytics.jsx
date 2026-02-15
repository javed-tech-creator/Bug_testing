import { useGetLeadAnalyticsQuery } from "@/api/sales/dashboard.sales.api.js";
import React from "react";
import Chart from "react-apexcharts";

const LeadAnalytics = () => {
  const { data } = useGetLeadAnalyticsQuery();

  const analytics = data?.data || [];

  const getCount = (label) =>
    analytics.find((i) => i.label === label)?.count || 0;

  const HOT = getCount("HOT");
  const WARM = getCount("WARM");
  const COLD = getCount("COLD");

  const total = HOT + WARM + COLD || 1;

  const series = [
  +((HOT / total) * 100).toFixed(2),
  +((WARM / total) * 100).toFixed(2),
  +((COLD / total) * 100).toFixed(2),
];


  const chartOptions = {
    chart: {
      type: "donut",
      dropShadow: {
        enabled: true,
        top: 5,
        blur: 6,
        opacity: 0.15,
      },
    },
    states: {
      hover: {
        filter: { type: "lighten", value: 0.15 },
      },
      active: {
        filter: { type: "none" },
      },
    },
    stroke: {
      width: 0,
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ["#fff"],
        fontSize: "14px",
        fontWeight: 600,
      },
      formatter:(val) => `${val.toFixed(2)}%`,
    },
    colors: ["#62A98A", "#F7D97E", "#EF8A63"],
    legend: {
      show: false,
    },
    tooltip: {
      custom: function ({ series, seriesIndex }) {
        const labels = ["HOT", "WARM", "COLD"];
        return `
          <div style="
            padding:8px 12px;
            background:white;
            border-radius:6px;
            border:1px solid #e5e7eb;
            font-size:14px;
            color:#374151;
          ">
            <strong>${labels[seriesIndex]}</strong>: ${series[seriesIndex]}%
          </div>
        `;
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "75%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Leads",
              formatter: () => total,
            },
          },
        },
      },
    },
  };

  return (
    <div className="w-full p-4 rounded-xl border shadow-md bg-white flex flex-col">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Lead Analytics
      </h2>

      <Chart
        options={chartOptions}
        series={series}
        type="donut"
        height={270}
      />

      <div className="mt-auto pt-4 flex justify-center gap-6 text-gray-600 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-md bg-[#62A98A]"></span>
          HOT
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-md bg-[#F7D97E]"></span>
          WARM
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-md bg-[#EF8A63]"></span>
          COLD
        </div>
      </div>
    </div>
  );
};

export default LeadAnalytics;