import { useEffect } from "react";
import chartsConfig from "../configs/charts-config";

const useChartsData = () => {
  // const { data, isLoading, isError } = useGetChartDataQuery();
  const error = false
  const isLoading = false
  
  const data = {
    websiteViews: [50, 20, 10, 22, 50, 10, 40],
    dailySales: [50, 40, 300, 320, 500, 350, 200, 230, 500],
    completedTasks: [50, 40, 300, 220, 500, 250, 400, 230, 500],
  };
  const websiteViewsChart = {
    type: "bar",
    height: 220,
    series: [
      {
        name: "Views",
        data: data?.websiteViews || [], // Dynamic data
      },
    ],
    options: {
      ...chartsConfig,
      colors: "#388e3c",
      plotOptions: {
        bar: {
          columnWidth: "16%",
          borderRadius: 5,
        },
      },
      xaxis: {
        ...chartsConfig.xaxis,
        categories: ["M", "T", "W", "T", "F", "S", "S"],
      },
    },
  };

  const dailySalesChart = {
    type: "line",
    height: 220,
    series: [
      {
        name: "Sales",
        data: data?.dailySales || [], // Dynamic data
      },
    ],
    options: {
      ...chartsConfig,
      colors: ["#0288d1"],
      stroke: {
        lineCap: "round",
      },
      markers: {
        size: 5,
      },
      xaxis: {
        ...chartsConfig.xaxis,
        categories: [
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
      },
    },
  };

  const completedTasksChart = {
    type: "line",
    height: 220,
    series: [
      {
        name: "Tasks",
        data: data?.completedTasks || [], // Dynamic data
      },
    ],
    options: {
      ...chartsConfig,
      colors: ["#388e3c"],
      stroke: {
        lineCap: "round",
      },
      markers: {
        size: 5,
      },
      xaxis: {
        ...chartsConfig.xaxis,
        categories: [
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
      },
    },
  };

  const ChartsData = [
    {
      color: "white",
      title: "Website View",
      description: "Last Campaign Performance",
      footer: "campaign sent 2 days ago",
      chart: websiteViewsChart,
    },
    {
      color: "white",
      title: "Daily Sales",
      description: "15% increase in today sales",
      footer: "updated 4 min ago",
      chart: dailySalesChart,
    },
    {
      color: "white",
      title: "Completed Tasks",
      description: "Last Campaign Performance",
      footer: "just updated",
      chart: completedTasksChart,
    },
  ];

  return { ChartsData, isLoading, error };
};

export default useChartsData;
