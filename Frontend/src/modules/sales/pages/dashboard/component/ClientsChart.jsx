import { useGetClientsChartQuery, useGetPaymentStatusChartQuery } from "@/api/sales/dashboard.sales.api";
import React, { useState, useMemo } from "react";
import Chart from "react-apexcharts";
import { Calendar } from "lucide-react";
import Loader from "@/components/Loader";

const ClientsChart = () => {
  const [viewMode, setViewMode] = useState("Self");
  const [timeFilter, setTimeFilter] = useState("This Week");
  const [customRange, setCustomRange] = useState({ from: "", to: "" });

  const today = new Date().toISOString().split("T")[0];
  const isCustom = timeFilter === "Custom";

  const view = viewMode === "Self" ? "self" : "team";

  const period =
    timeFilter === "Today"
      ? "today"
      : timeFilter === "Yesterday"
      ? "yesterday"
      : timeFilter === "This Week"
      ? "week"
      : timeFilter === "This Month"
      ? "month"
      : timeFilter === "This Year"
      ? "year"
      : "custom";


  const { data, isLoading } = useGetClientsChartQuery({
    view,
    period,
    ...(isCustom && {
      from: customRange.from,
      to: customRange.to,
    }),
  });


  const options = useMemo(
    () => ({
      chart: {
        type: "line",
        toolbar: { show: false },
      },
      stroke: { curve: "smooth", width: 3 },
      markers: { size: 5 },
      colors: ["#4A78FF", "#A066DD", "#E06A85", "#FFA94D"],
      xaxis: {
        categories: data?.labels || [],
      },
      yaxis: {
        title: {
          text: "Number of Clients",
        },
      },
      legend: { position: "bottom" },
      tooltip: {
        shared: true,
        y: {
          formatter: (v) => `${v} clients`,
        },
      },
    }),
    [data]
  );

  const series = data?.series || [];

  return (
    <div className="w-full p-4 rounded-xl border shadow-md bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Clients</h2>
          <p className="text-sm text-gray-500 mt-1">
            {viewMode === "Self" ? "Your performance" : "Team performance"} •{" "}
            {timeFilter}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View */}
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 mb-1 font-medium">
              View
            </label>
            <select
              className="border rounded-lg px-3 py-2 text-sm"
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
            >
              <option>Self</option>
              <option>Team</option>
            </select>
          </div>

          {/* Period */}
          <div className="flex flex-col">
            <label className="text-xs text-gray-600 mb-1 font-medium">
              Period
            </label>
            <select
              className="border rounded-lg px-3 py-2 text-sm"
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
            >
              <option>Today</option>
              <option>Yesterday</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
              <option>Custom</option>
            </select>
          </div>
        </div>
      </div>

      {/* Custom Date Range */}
      {isCustom && (
        <div className="mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
            <Calendar className="w-3 h-3" />
            Select date range
          </div>

          <div className="grid grid-cols-2 gap-2 max-w-sm">
            <input
              type="date"
              max={today}
              value={customRange.from}
              onChange={(e) =>
                setCustomRange({ ...customRange, from: e.target.value })
              }
              className="px-2 py-1.5 text-sm border rounded"
            />
            <input
              type="date"
              max={today}
              min={customRange.from}
              value={customRange.to}
              onChange={(e) =>
                setCustomRange({ ...customRange, to: e.target.value })
              }
              className="px-2 py-1.5 text-sm border rounded"
            />
          </div>
        </div>
      )}

      {/* Chart */}
      {isLoading ? (
        <div className="h-[300px] flex items-center justify-center text-gray-500">
          <Loader/>
        </div>
      ) : (
        <Chart options={options} series={series} type="line" height={300} />
      )}
    </div>
  );
};

export default ClientsChart;
