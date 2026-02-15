import React, { useState, useMemo } from "react";
import Chart from "react-apexcharts";
import { Calendar, Filter, X, ChevronDown } from "lucide-react";
import { useGetLostLeadExpectedAmountQuery } from "@/api/sales/dashboard.sales.api.js";

const PERIOD_OPTIONS = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "This Year", value: "year" },
  { label: "Custom", value: "custom" },
];

const LABEL_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Hot", value: "HOT" },
  { label: "Warm", value: "WARM" },
  { label: "Cold", value: "COLD" },
];

const SOURCE_OPTIONS = [
  { label: "All Sources", value: "ALL" },
  { label: "Partner", value: "PARTNER" },
  { label: "Business Associate", value: "BUSINESS_ASSOCIATE" },
  { label: "Franchise", value: "FRANCHISE" },
  { label: "Vendor", value: "VENDOR" },
];

const MAX_RANGE_DAYS = 365;

const LostLeads = () => {
  const [period, setPeriod] = useState("week");
  const [leadLabel, setLeadLabel] = useState("all");
  const [source, setSource] = useState("ALL");
  const [showFilters, setShowFilters] = useState(false);

  const [customRange, setCustomRange] = useState({
    from: "",
    to: "",
  });

  const isCustom = period === "custom";

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const minDate = useMemo(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    return date.toISOString().split('T')[0];
  }, []);

  const isValidRange = useMemo(() => {
    if (!isCustom || !customRange.from || !customRange.to) return true;

    const fromDate = new Date(customRange.from);
    const toDate = new Date(customRange.to);

    if (fromDate > toDate) return false;

    const diffTime = Math.abs(toDate - fromDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays <= MAX_RANGE_DAYS;
  }, [customRange, isCustom]);

  const queryParams = useMemo(() => {
    const params = {
      period,
      label: leadLabel,
      source,
    };

    if (isCustom && isValidRange && customRange.from && customRange.to) {
      params.startDate = customRange.from;
      params.endDate = customRange.to;
    }

    return params;
  }, [period, leadLabel, source, isCustom, isValidRange, customRange]);

  const { data, isLoading, isError } = useGetLostLeadExpectedAmountQuery(queryParams, {
    skip: isCustom && (!isValidRange || !customRange.from || !customRange.to),
  });

  const categories = useMemo(
    () => data?.data?.data?.map(i => i.label) || [],
    [data]
  );

  const chartData = useMemo(
    () => data?.data?.data?.map(i => i.count) || [],
    [data]
  );



  const options = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: { enabled: true, speed: 800 },
    },
    plotOptions: {
      bar: {
        columnWidth: "42%",
        borderRadius: 6,
        dataLabels: { position: "top" },
      },
    },
    colors: ["#EF4444"],
    dataLabels: {
      enabled: false,
      formatter: (val) => `${val}`,
      offsetY: 20,
      style: { fontSize: "12px", colors: ["#6B7280"] },
    },
    grid: {
      borderColor: "#F3F4F6",
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    xaxis: {
      categories,
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px",
          fontFamily: "Inter, sans-serif",
        },
        rotate: -45,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (val) => `${val} Leads`,
      },
    },

    tooltip: {
      y: {
        formatter: (val) => `${val} Leads`,
      },
    },

    legend: { show: false },
    responsive: [
      {
        breakpoint: 640,
        options: {
          plotOptions: { bar: { columnWidth: "55%" } },
          xaxis: { labels: { rotate: -45 } },
        },
      },
    ],
  };

  const series = [
    {
      name: "Lost Leads",
      data: chartData,
    },
  ];


  const handleCustomDateChange = (type, value) => {
    setCustomRange(prev => ({
      ...prev,
      [type]: value,
    }));
  };

  const resetFilters = () => {
    setPeriod("week");
    setLeadLabel("all");
    setSource("ALL");
    setCustomRange({ from: "", to: "" });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (period !== "week") count++;
    if (leadLabel !== "all") count++;
    if (source !== "ALL") count++;
    if (customRange.from || customRange.to) count++;
    return count;
  };

  if (isLoading) {
    return (
      <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-5 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-10 bg-gray-200 rounded mb-6"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Lost Leads (Not Interested)
          </h2>

        </div>

        <div className="flex items-center gap-2">
          {getActiveFilterCount() > 0 && (
            <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
              {getActiveFilterCount()} filter{getActiveFilterCount() !== 1 ? 's' : ''} active
            </span>
          )}

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-sm transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      <div className={`mb-4 transition-all duration-300 ${showFilters ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2 bg-gray-50 rounded-sm border border-gray-200">
        
          {/* Period Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time Period
            </label>
            <div className="space-y-2">
              <select
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              >
                {PERIOD_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>


            </div>
          </div>

          {/* Source Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lead Source
            </label>
            <select
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            >
              {SOURCE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Label Filter */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lead Priority
            </label>
            <div className="relative">
              <select
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white appearance-none pr-10 cursor-pointer"
                value={leadLabel}
                onChange={(e) => setLeadLabel(e.target.value)}
              >
                {LABEL_OPTIONS.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    className="py-2"
                  >
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
        {isCustom && (
          <div className="space-y-2 mt-1">
            <div className="flex items-center gap-2 text-xs text-gray-700">
              <Calendar className="w-3 h-3" />
              Select date range (max 1 year)
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <input
                  type="date"
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  value={customRange.from}
                  max={today}
                  min={minDate}
                  onChange={(e) => handleCustomDateChange("from", e.target.value)}
                />
                <label className="block text-xs text-gray-500 mt-1">From</label>
              </div>
              <div>
                <input
                  type="date"
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  value={customRange.to}
                  max={today}
                  min={customRange.from || minDate}
                  onChange={(e) => handleCustomDateChange("to", e.target.value)}
                />
                <label className="block text-xs text-gray-500 mt-1">To</label>
              </div>
            </div>
          </div>
        )}
        {/* Validation Message */}
        {!isValidRange && (
          <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-sm">
            <p className="text-sm text-orange-600 flex items-center gap-2">
              <X className="w-4 h-4" />
              Date range must be within 1 year and "From" date should be before "To" date.
            </p>
          </div>
        )}

        {/* Active Filters & Actions */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {period !== "week" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                Period: {PERIOD_OPTIONS.find(p => p.value === period)?.label}
                <button onClick={() => setPeriod("week")} className="ml-1 hover:text-blue-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {leadLabel !== "all" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                Priority: {LABEL_OPTIONS.find(l => l.value === leadLabel)?.label}
                <button onClick={() => setLeadLabel("all")} className="ml-1 hover:text-green-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {source !== "ALL" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                Source: {SOURCE_OPTIONS.find(s => s.value === source)?.label}
                <button onClick={() => setSource("ALL")} className="ml-1 hover:text-purple-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {isCustom && customRange.from && customRange.to && (
              <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                <Calendar className="w-3 h-3" />
                {customRange.from} to {customRange.to}
                <button onClick={() => setCustomRange({ from: "", to: "" })} className="ml-1 hover:text-yellow-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={resetFilters}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 hover:border-gray-400 rounded-sm transition-colors"
            >
              Reset All
            </button>
            <button
              onClick={() => setShowFilters(false)}
              className="px-3 py-1.5 text-sm font-medium bg-orange-600 text-white hover:bg-orange-700 rounded-sm transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 ? (
        <Chart
          options={options}
          series={series}
          type="bar"
          height={320}
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No data available
          </h3>
          <p className="text-gray-500 text-sm max-w-md">
            Try adjusting your filters or select a different time period to view lost leads data.
          </p>
        </div>
      )}
    </div>
  );
};

export default LostLeads;