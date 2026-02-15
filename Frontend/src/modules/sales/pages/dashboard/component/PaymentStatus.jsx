import React, { useState } from "react";
import Chart from "react-apexcharts";
import { Calendar, AlertCircle, RefreshCw } from "lucide-react";
import { useGetPaymentStatusChartQuery } from "@/api/sales/dashboard.sales.api";

const PaymentStatus = () => {
  const [viewMode, setViewMode] = useState("Executive");
  const [period, setPeriod] = useState("month");
  const [customRange, setCustomRange] = useState({ from: "", to: "" });
  const [retryCount, setRetryCount] = useState(0);

  const isCustom = period === "custom";
  const shouldSkip = isCustom && (!customRange.from || !customRange.to);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetPaymentStatusChartQuery(
    {
      period: shouldSkip ? "month" : period, // Fallback agar custom invalid hai
      scope: viewMode === "Executive" ? "all" : viewMode.toLowerCase(),
      startDate: customRange.from,
      endDate: customRange.to,
    },
    {
      skip: shouldSkip,
    }
  );

  // Loading state with better UI
  if (isLoading) {
    return (
      <div className="w-full p-4 rounded-xl border shadow-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Payment Status</h2>
          <div className="flex items-center gap-3">
            <select className="border rounded-md px-2 py-1 opacity-50" disabled>
              <option>Executive</option>
            </select>
            <select className="border rounded-md px-2 py-1 opacity-50" disabled>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading payment data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state with retry option
  if (isError) {
    return (
      <div className="w-full p-4 rounded-xl border shadow-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Payment Status</h2>
          <div className="flex items-center gap-3">
            <select
              className="border rounded-md px-2 py-1"
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
            >
              <option>Executive</option>
              <option>Self</option>
              <option>Team</option>
            </select>
            <select
              className="border rounded-md px-2 py-1"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center h-64 p-4">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Unable to load payment data
          </h3>
          <p className="text-gray-600 text-center mb-4 max-w-md">
            {error?.data?.message || "Something went wrong. Please try again."}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                refetch();
                setRetryCount(prev => prev + 1);
              }}
              disabled={isFetching}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isFetching ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </>
              )}
            </button>
            <button
              onClick={() => {
                setPeriod("month");
                setCustomRange({ from: "", to: "" });
                refetch();
              }}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Reset Filters
            </button>
          </div>
          {retryCount > 0 && (
            <p className="text-sm text-gray-500 mt-3">
              Retried {retryCount} time{retryCount > 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Invalid custom date range state
  if (isCustom && !customRange.from && !customRange.to) {
    return (
      <div className="w-full p-4 rounded-xl border shadow-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Payment Status</h2>
          <div className="flex items-center gap-3">
            <select
              className="border rounded-md px-2 py-1"
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
            >
              <option>Executive</option>
              <option>Self</option>
              <option>Team</option>
            </select>
            <select
              className="border rounded-md px-2 py-1"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
            <Calendar className="w-3 h-3" />
            Select date range
          </div>

          <div className="grid grid-cols-2 gap-2 max-w-sm">
            <input
              type="date"
              value={customRange.from}
              onChange={(e) =>
                setCustomRange((p) => ({ ...p, from: e.target.value }))
              }
              className="px-2 py-1.5 text-sm border rounded"
            />
            <input
              type="date"
              min={customRange.from}
              value={customRange.to}
              onChange={(e) =>
                setCustomRange((p) => ({ ...p, to: e.target.value }))
              }
              className="px-2 py-1.5 text-sm border rounded"
            />
          </div>
        </div>

        <div className="flex flex-col justify-center items-center h-48 p-4 border-2 border-dashed border-gray-300 rounded-lg">
          <Calendar className="w-12 h-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-semibold text-gray-700 mb-1">
            Select Date Range
          </h3>
          <p className="text-gray-500 text-center">
            Please select both "From" and "To" dates to view custom period data
          </p>
        </div>
      </div>
    );
  }

  // No data state
  const series = data
    ? [
        data.data?.pending || 0,
        data.data?.partial || 0,
        data.data?.completed || 0,
      ]
    : [0, 0, 0];

  const total = series.reduce((a, b) => a + b, 0);
  
  if (total === 0) {
    return (
      <div className="w-full p-4 rounded-xl border shadow-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Payment Status</h2>
          <div className="flex items-center gap-3">
            <select
              className="border rounded-md px-2 py-1"
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
            >
              <option>Executive</option>
              <option>Self</option>
              <option>Team</option>
            </select>
            <select
              className="border rounded-md px-2 py-1"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </div>

        {isCustom && (
          <div className="mb-4">
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
              <Calendar className="w-3 h-3" />
              Select date range
            </div>

            <div className="grid grid-cols-2 gap-2 max-w-sm">
              <input
                type="date"
                value={customRange.from}
                onChange={(e) =>
                  setCustomRange((p) => ({ ...p, from: e.target.value }))
                }
                className="px-2 py-1.5 text-sm border rounded"
              />
              <input
                type="date"
                min={customRange.from}
                value={customRange.to}
                onChange={(e) =>
                  setCustomRange((p) => ({ ...p, to: e.target.value }))
                }
                className="px-2 py-1.5 text-sm border rounded"
              />
            </div>
          </div>
        )}

        <div className="flex flex-col justify-center items-center h-64 p-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">
              No Payment Data
            </h3>
            <p className="text-gray-500">
              No payment records found for the selected {period === 'custom' ? 'date range' : period}
            </p>
            <button
              onClick={() => {
                setPeriod("month");
                setCustomRange({ from: "", to: "" });
              }}
              className="mt-4 px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
            >
              View This Month
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main render with data
  const options = {
    chart: { 
      type: "pie", 
      toolbar: { show: false },
      animations: {
        enabled: true,
        speed: 800,
      }
    },
    labels: [
      `${viewMode} Pending`,
      `${viewMode} Partial`,
      `${viewMode} Completed`,
    ],
    colors: ["#E1B463", "#6C7BFF", "#58B885"],
    legend: { 
      position: "right",
      fontSize: "14px",
      fontWeight: 600,
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val.toFixed(0)}%`,
      style: { 
        fontSize: "14px", 
        fontWeight: 600,
        colors: ["#fff"]
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 2,
        opacity: 0.8
      }
    },
    tooltip: {
      y: {
        formatter: (value) => `${value} payments`,
      }
    },
    responsive: [{
      breakpoint: 768,
      options: {
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  return (
    <div className="w-full p-4 rounded-xl border shadow-md bg-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <h2 className="text-xl font-bold">Payment Status</h2>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Scope */}
          <select
            className="border rounded-md px-2 py-1 text-sm min-w-[100px]"
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            disabled={isFetching}
          >
            <option>Executive</option>
            <option>Self</option>
            <option>Team</option>
          </select>

          {/* Period */}
          <select
            className="border rounded-md px-2 py-1 text-sm min-w-[120px]"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            disabled={isFetching}
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </div>

      {/* Custom date */}
      {isCustom && (
        <div className="mb-4">
          <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
            <Calendar className="w-3 h-3" />
            Select date range
          </div>

          <div className="grid grid-cols-2 gap-2 max-w-sm">
            <input
              type="date"
              value={customRange.from}
              onChange={(e) =>
                setCustomRange((p) => ({ ...p, from: e.target.value }))
              }
              className="px-2 py-1.5 text-sm border rounded"
              disabled={isFetching}
            />
            <input
              type="date"
              min={customRange.from}
              value={customRange.to}
              onChange={(e) =>
                setCustomRange((p) => ({ ...p, to: e.target.value }))
              }
              className="px-2 py-1.5 text-sm border rounded"
              disabled={isFetching}
            />
          </div>
        </div>
      )}

      {/* Loading indicator for refetch */}
      {isFetching && !isLoading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-xl">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Updating...</p>
          </div>
        </div>
      )}

      <div className="relative">
        <Chart options={options} series={series} type="pie" height={300} />
        
        {/* Summary */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="text-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#E1B463]"></div>
                <span className="font-medium">Pending</span>
              </div>
              <p className="text-2xl font-bold">{series[0]}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#6C7BFF]"></div>
                <span className="font-medium">Partial</span>
              </div>
              <p className="text-2xl font-bold">{series[1]}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#58B885]"></div>
                <span className="font-medium">Completed</span>
              </div>
              <p className="text-2xl font-bold">{series[2]}</p>
            </div>
            <div className="text-center">
              <div className="font-medium">Total</div>
              <p className="text-2xl font-bold text-blue-600">{total}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus;