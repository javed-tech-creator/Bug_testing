import { useGetTotalRevenueQuery } from "@/api/sales/dashboard.sales.api.js";
import React, { useMemo, useState } from "react";
import Chart from "react-apexcharts";

const viewMap = {
  Executive: "executive",
  Self: "self",
  Team: "team",
};

const periodMap = {
  "This Week": "week",
  "This Month": "month",
  "This Year": "year",
};

const TotalRevenue = () => {
  const [viewMode, setViewMode] = useState("Executive");
  const [timeFilter, setTimeFilter] = useState("This Week");

  const { data, isLoading } = useGetTotalRevenueQuery({
    view: viewMap[viewMode],
    period: periodMap[timeFilter],
  });

  /* ---------- X AXIS ---------- */
  const categories = useMemo(() => {
    if (timeFilter === "This Week")
      return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    if (timeFilter === "This Month")
      return Array.from({ length: 31 }, (_, i) => i + 1);

    return [
      "Apr","May","Jun","Jul","Aug","Sep",
      "Oct","Nov","Dec","Jan","Feb","Mar"
    ];
  }, [timeFilter]);

  /* ---------- SERIES ---------- */
  const expectedSeries = useMemo(() => {
    return categories.map((_, index) => {
      const key = timeFilter === "This Week" ? index + 1 :
                  timeFilter === "This Month" ? index + 1 :
                  ((index + 4) % 12) + 1;

      const match = data?.data?.expected?.find(
        d => Object.values(d._id)[0] === key
      );

      return Math.round((match?.total || 0) / 1000);
    });
  }, [data, categories, timeFilter]);

  const businessSeries = useMemo(() => {
    return categories.map((_, index) => {
      const key = timeFilter === "This Week" ? index + 1 :
                  timeFilter === "This Month" ? index + 1 :
                  ((index + 4) % 12) + 1;

      const match = data?.data?.business?.find(
        d => Object.values(d._id)[0] === key
      );

      return Math.round((match?.total || 0) / 1000);
    });
  }, [data, categories, timeFilter]);

  const series = [
    { name: "Expected", data: expectedSeries },
    { name: "Business", data: businessSeries },
  ];

  const options = {
    chart: { type: "bar", toolbar: { show: false } },
    colors: ["#3B82F6", "#65A989"],
    plotOptions: {
      bar: { columnWidth: "45%", borderRadius: 6 },
    },
    dataLabels: { enabled: false },
    grid: { strokeDashArray: 4, borderColor: "#e5e7eb" },
    legend: { position: "bottom" },
    xaxis: {
      categories,
      labels: { style: { colors: "#6b7280", fontSize: "14px" } },
    },
    yaxis: {
      labels: {
        formatter: (v) => `₹${v}K`,
        style: { colors: "#6b7280", fontSize: "14px" },
      },
    },
  };

  if (isLoading) return null;

  return (
    <div className="p-4 rounded-xl border shadow-md bg-white">
      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          Total Revenue (Expected vs Bussiness)
        </h2>

        <div className="flex gap-3">
          <select
            className="border rounded-md px-2 py-1"
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
          >
            <option>Self</option>
            <option>Team</option>
          </select>

          <select
            className="border rounded-md px-2 py-1"
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
          >
            <option>This Week</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      <Chart options={options} series={series} type="bar" height={300} />
    </div>
  );
};

export default TotalRevenue;
