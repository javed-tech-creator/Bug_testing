import { Calendar } from "lucide-react";
import React, { useMemo, useState } from "react";
import Chart from "react-apexcharts";

const DEPARTMENTS = [
  "Sales",
  "Recce",
  "Design",
  "Quotation",
  "Production",
  "Installation",
];

const PERIOD_OPTIONS = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "This Year", value: "year" },
  { label: "Custom", value: "custom" },
];

const LeadLostReason = () => {
  const [period, setPeriod] = useState("week");
  const [reason, setReason] = useState("ALL");
  const [customRange, setCustomRange] = useState({ from: "", to: "" });

  const isCustom = period === "custom";

  const today = useMemo(
    () => new Date().toISOString().split("T")[0],
    []
  );

  /* ---------------- API READY DATA ----------------
     Replace this with RTK Query / API response
  -------------------------------------------------- */
  const apiData = {
    departments: DEPARTMENTS,
    counts: [18, 10, 14, 7, 12, 9],
  };

  const series = [
    {
      name: "Lost Leads",
      data: apiData.counts,
    },
  ];

  const options = {
    chart: {
      type: "bar",
      toolbar: { show: false },
    },
    colors: ["#ea580c"], 
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "60%",
      },
    },
    xaxis: {
      categories: apiData.departments,
      labels: {
        style: { fontSize: "12px" },
      },
      title: {
        text: "Departments",
      },
    },
    yaxis: {
      title: {
        text: "Lead Count",
      },
    },
    grid: {
      strokeDashArray: 4,
    },
    dataLabels: {
      enabled: false,
    },
  };

  const handleDateChange = (key, value) => {
    setCustomRange((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-full bg-white border rounded-xl shadow-sm p-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-xl font-semibold text-gray-700">
          Lead Lost by Department
        </h2>

        <div className="flex flex-wrap gap-2">
          {/* Period */}
          <select
            className="px-2 py-1.5 text-sm border rounded focus:ring-2 focus:ring-orange-500"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            {PERIOD_OPTIONS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>

          {/* Reason */}
          <select
            className="px-2 py-1.5 text-sm border rounded focus:ring-2 focus:ring-orange-500"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          >
            <option value="ALL">All Reasons</option>
            {/* API driven reasons */}
            <option value="PRICING">Pricing Issue</option>
            <option value="DELAY">Delay</option>
            <option value="DESIGN">Design Issue</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
      </div>

      {/* Custom Date */}
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
              onChange={(e) => handleDateChange("from", e.target.value)}
              className="px-2 py-1.5 text-sm border rounded"
            />
            <input
              type="date"
              max={today}
              min={customRange.from}
              value={customRange.to}
              onChange={(e) => handleDateChange("to", e.target.value)}
              className="px-2 py-1.5 text-sm border rounded"
            />
          </div>
        </div>
      )}

      {/* Chart */}
      <Chart options={options} series={series} type="bar" height={340} />
    </div>
  );
};

export default LeadLostReason;
