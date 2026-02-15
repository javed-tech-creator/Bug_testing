import { useEffect, useState } from "react";
import chartsConfig from "../../sales/configs/charts-config.js"
function useDashboardChartsData() {
  const [isLoading, setIsLoading] = useState(true);
  const [ChartsData, setChartsData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setChartsData([
        {
          color: "bg-gradient-to-r from-green-900 to-green-700",
          title: "Daily Site Visits",
          description: "Track daily site and survey activities",
          footer: "updated 2 hours ago",
          chart: {
            type: "line",
            height: 220,
            series: [
              {
                name: "Sites Visited",
                data: [12, 15, 8, 18, 22, 14, 16, 19, 25, 21, 28, 24],
              },
            ],
            options: {
                ...chartsConfig,
              colors: ["#16a34a"],
              
              dataLabels: {
                enabled: false,
              },
              stroke: {
                lineCap: "round",
                curve: "smooth",
              },
              markers: {
                size: 0,
              },
              xaxis: {
                axisTicks: {
                  show: false,
                },
                axisBorder: {
                  show: false,
                },
                labels: {
                  style: {
                    colors: "#616161",
                    fontSize: "12px",
                    fontFamily: "inherit",
                    fontWeight: 400,
                  },
                },
                categories: [
                  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
                ],
              },
              yaxis: {
                labels: {
                  style: {
                    colors: "#616161",
                    fontSize: "12px",
                    fontFamily: "inherit",
                    fontWeight: 400,
                  },
                },
              },
              grid: {
                show: true,
                borderColor: "#dddddd",
                strokeDashArray: 5,
                xaxis: {
                  lines: {
                    show: true,
                  },
                },
                padding: {
                  top: 5,
                  right: 20,
                },
              },
              fill: {
                opacity: 0.8,
              },
              tooltip: {
                theme: "dark",
              },
            },
          },
        },
        {
          color: "bg-gradient-to-r from-blue-900 to-blue-700",
          title: "Survey Types",
          description: "Distribution of different survey types completed",
          footer: "updated yesterday",
          chart: {
            type: "bar",
            height: 220,
            series: [
              {
                name: "Surveys Completed",
                data: [45, 12, 28, 18, 15,],
              },
            ],
            options: {
                 ...chartsConfig,
              colors: ["#2563eb"],
              chart: {
                toolbar: {
                  show: true,
                },
              },
              dataLabels: {
                enabled: false,
              },
              xaxis: {
                axisTicks: {
                  show: false,
                },
                axisBorder: {
                  show: false,
                },
                labels: {
                  style: {
                    colors: "#616161",
                    fontSize: "12px",
                    fontFamily: "inherit",
                    fontWeight: 400,
                  },
                },
                categories: ["Type1", "Type2", "Type3", "Type4", "Type5"],
              },
              yaxis: {
                labels: {
                  style: {
                    colors: "#616161",
                    fontSize: "12px",
                    fontFamily: "inherit",
                    fontWeight: 400,
                  },
                },
              },
              grid: {
                show: true,
                borderColor: "#dddddd",
                strokeDashArray: 5,
                xaxis: {
                  lines: {
                    show: true,
                  },
                },
                padding: {
                  top: 5,
                  right: 20,
                },
              },
              fill: {
                opacity: 0.8,
              },
              tooltip: {
                theme: "dark",
              },
            },
          },
        },
        {
          color: "bg-gradient-to-r from-purple-900 to-purple-700",
          title: "Project Status",
          description: "Current status of all reconnaissance projects",
          footer: "real-time data",
          chart: {
            type: "pie",
            height: 220,
            series: [35, 28, 22, 15],
            options: {
                 ...chartsConfig,
              colors: ["#16a34a", "#f59e0b", "#ef4444", "#6b7280"],
              chart: {
                toolbar: {
                  show: true,
                },
              },
              labels: ["Completed", "In Progress", "Pending", "On Hold"],
              dataLabels: {
                enabled: true,
              },
              legend: {
                show: true,
                fontSize: "12px",
                fontFamily: "inherit",
                fontWeight: 400,
                labels: {
                  colors: "#616161",
                },
              },
              tooltip: {
                theme: "dark",
              },
            },
          },
        },
      ]);
      setIsLoading(false);
    }, 1200);
  }, []);

  return { ChartsData, isLoading, error };
}
export default useDashboardChartsData