import React, { useState, useMemo } from "react";
import Chart from "react-apexcharts";
import { Calendar } from "lucide-react";
import { useGetChartRevenueQuery } from "@/api/sales/dashboard.sales.api";

/* ===================== CONSTANTS ===================== */

const PERIOD_OPTIONS = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "This Year", value: "year" },
  { label: "Custom", value: "custom" },
];

const SCOPE_OPTIONS = [
  { label: "Self", value: "self" },
  { label: "Team", value: "team" },
  { label: "All", value: "all" },
];

/* ===================== HELPERS ===================== */

const buildSeries = (arr = [], size = 0) => {
  const map = {};
  arr.forEach((i) => {
    map[i._id] = i.total;
  });
  return Array.from({ length: size }, (_, i) => map[i + 1] || 0);
};

const getCategories = (period) => {
  switch (period) {
    case "week":
      return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    case "year":
      return ["Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"];
    default:
      return ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  }
};

/* ===================== COMPONENT ===================== */

const TotalRevenue2 = () => {
  const [scope, setScope] = useState("self");
  const [period, setPeriod] = useState("month");
  const [customRange, setCustomRange] = useState({ from: "", to: "" });

  const isCustom = period === "custom";
  const today = new Date().toISOString().split("T")[0];

  const { data, isLoading } = useGetChartRevenueQuery({
    scope,
    period,
    from: customRange.from,
    to: customRange.to,
  });

  const categories = useMemo(() => getCategories(period), [period]);

  const series = useMemo(() => {
    return [
      {
        name: "Targeted",
        data: buildSeries(data?.targeted, categories.length),
      },
      {
        name: "Collection",
        data: buildSeries(data?.collection, categories.length),
      },
      {
        name: "Business",
        data: buildSeries(data?.business, categories.length),
      },
    ];
  }, [data, categories]);

  const options = {
    chart: {
      type: "line",
      toolbar: { show: false },
      animations: { enabled: true },
    },
    stroke: { curve: "smooth", width: 4 },
    markers: { size: 5 },
    colors: ["#4A78FF", "#2E9E59", "#F48FB1"],
    xaxis: { categories },
    yaxis: {
      labels: {
        formatter: (v) => `${Math.round(v / 1000)}K`,
      },
    },
    legend: { position: "bottom" },
    grid: { borderColor: "#e5e7eb" },
  };

  return (
    <div className="p-6 rounded-xl border shadow-md bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Total Revenue</h2>

        <div className="flex flex-wrap gap-2">
          {/* Scope */}
          <select
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            className="px-2 py-1.5 text-sm border rounded"
          >
            {SCOPE_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          {/* Period */}
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-2 py-1.5 text-sm border rounded"
          >
            {PERIOD_OPTIONS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
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
        <div className="h-[320px] flex items-center justify-center text-gray-500">
          Loading chart…
        </div>
      ) : (
        <Chart options={options} series={series} type="line" height={320} />
      )}
    </div>
  );
};

export default TotalRevenue2;
