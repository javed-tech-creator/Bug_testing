import React, { useMemo, useState } from "react";
import Chart from "react-apexcharts";
import LegendItem from "./LegendItem";
import { useGetLeadSourceMonthlyFYQuery } from "@/api/sales/dashboard.sales.api.js";

const LeadSources = () => {
  const [userType, setUserType] = useState("all");

  const { data } = useGetLeadSourceMonthlyFYQuery({type:userType});

  const colorPalette = [
    "#A020F0", "#E66B5B", "#65A989", "#4169E1", "#FF6B6B",
    "#4ECDC4", "#FFD166", "#06D6A0", "#118AB2", "#EF476F"
  ];

  const { categories, series, sourcesWithData } = useMemo(() => {
    if (!data?.data?.data) {
      return { categories: [], series: [], sourcesWithData: [] };
    }

    const apiData = data.data.data;
    const sources = data.data.sources || [];

    const categories = apiData.map(item => item.month);

    // Calculate which sources have non-zero data
    const sourcesWithNonZeroData = sources.filter(source => {
      const total = apiData.reduce((sum, month) => sum + (month[source] || 0), 0);
      return total > 0;
    });

    // If no sources have data, show all sources
    const displaySources = sourcesWithNonZeroData.length > 0
      ? sourcesWithNonZeroData
      : sources.slice(0, 3); // Show first 3 if all zeros

    const series = displaySources.map((source, index) => ({
      name: source,
      data: apiData.map(monthData => monthData[source] || 0)
    }));

    return {
      categories,
      series,
      sourcesWithData: displaySources
    };
  }, [data]);

  const options = {
    chart: {
      type: "line",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    stroke: {
      curve: "smooth",
      width: 5,
    },
    colors: series.map((_, index) => colorPalette[index % colorPalette.length]),
    markers: {
      size: 6,
      strokeWidth: 3,
      hover: { size: 10 },
    },
    grid: {
      borderColor: "#f1f1f1",
    },
    xaxis: {
      categories,
      labels: {
        style: { colors: "#9CA3AF", fontSize: "13px" },
      },
    },
    yaxis: {
      labels: {
        style: { colors: "#9CA3AF", fontSize: "13px" },
      },
    },
    legend: { show: false },
  };

  return (
    <div className="w-full p-4 rounded-xl border shadow-md bg-white">
      <div className="flex justify-between" >
      <h2 className="text-xl font-semibold mb-2 text-gray-800">Lead Sources</h2>
      <select
        className="border rounded-md px-3 py-1.5 text-sm"
        value={userType}
        onChange={e => setUserType(e.target.value)}
      >
        <option value={"all"}>ALL</option>
        <option value={"self"}>SELF</option>
        <option value={"assigned"}>ASSIGNED</option>
      </select>
    </div>

      {
    series.length > 0 ? (
      <>
        <Chart options={options} series={series} type="line" height={255} />

        {/* LEGENDS */}
        <div className="flex flex-wrap justify-center gap-4 mt-4 text-base text-gray-700">
          {sourcesWithData.map((source, index) => (
            <LegendItem
              key={source}
              color={colorPalette[index % colorPalette.length]}
              label={source}
            />
          ))}
        </div>
      </>
    ) : (
    <div className="h-[255px] flex items-center justify-center text-gray-500">
      No data available
    </div>
  )
  }
    </div >
  );
};

export default LeadSources;