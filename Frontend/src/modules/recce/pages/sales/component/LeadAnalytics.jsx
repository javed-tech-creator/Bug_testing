import React from "react";
import Chart from "react-apexcharts";

const LeadAnalytics = () => {
  const chartOptions = {
    chart: {
      type: "donut",
      dropShadow: {
        enabled: true,
        top: 5,
        left: 0,
        blur: 6,
        opacity: 0.15,
      },
    },

    // ⭐ HOVER PAR COLOR HALKA LIGHT HOGA
    states: {
      hover: {
        filter: {
          type: "lighten", // highlight effect
          value: 0.15, // 15% lighten (best look)
        },
      },
      active: {
        filter: {
          type: "none",
        },
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
      formatter: (val) => `${val.toFixed(0)}%`,
    },

    colors: ["#62A98A", "#F7D97E", "#EF8A63"],

    legend: {
      show: false,
    },

    tooltip: {
      enabled: true,
      fillSeriesColor: false,
      custom: function ({ series, seriesIndex }) {
        const labels = ["Contacted", "Pending", "Cancel"];
        const value = series[seriesIndex];

        return `
          <div style="
            padding: 8px 12px;
            background: white;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
            font-size: 14px;
            color: #374151;
          ">
            <strong>${labels[seriesIndex]}</strong>: ${value}%
          </div>`;
      },
    },

    plotOptions: {
      pie: {
        donut: {
          size: "75%",
          startAngle: -90,
          endAngle: 270,
          stroke: { lineCap: "round" },
          labels: {
            show: true,
            name: {
              show: true,
              offsetY: 20,
              color: "#6b7280",
              fontSize: "16px",
            },
            value: {
              show: true,
              fontSize: "32px",
              fontWeight: 700,
              offsetY: -10,
              formatter: (value) => `${value}%`,
            },
            total: {
              show: true,
              label: "Leads",
              fontSize: "18px",
              fontWeight: 600,
              color: "#6b7280",
            },
          },
        },
      },
    },
  };

  const series = [60, 25, 15];

  return (
    <div className="w-full p-6 rounded-xl border shadow-md bg-white flex flex-col">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Lead Analytics
      </h2>
      <Chart
        options={chartOptions}
        series={series}
        type="donut"
        height={260}
      />
      <div className="mt-auto pt-4 flex justify-center gap-6 text-gray-600 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-md bg-[#62A98A]"></span> Contacted
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-md bg-[#F7D97E]"></span> Pending
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-md bg-[#EF8A63]"></span> Cancel
        </div>
      </div>
    </div>
  );
};

export default LeadAnalytics;
