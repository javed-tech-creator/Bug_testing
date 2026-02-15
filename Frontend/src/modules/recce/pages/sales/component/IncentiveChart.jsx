import React, { useState } from "react";
import Chart from "react-apexcharts";

const IncentiveChart = () => {
  const [viewMode, setViewMode] = useState("Self");
  const [clientType, setClientType] = useState("All Clients");
  const [activityType, setActivityType] = useState("All Activities");
  const [timeFilter, setTimeFilter] = useState("Monthly");

  // Base data structure: timeFilter -> viewMode -> clientType -> activityType
  const dataStructure = {
    Monthly: {
      Self: {
        "All Clients": {
          "All Activities": [
            {
              name: "Expected Incentive",
              data: [50, 47, 49, 55, 60, 52, 58, 62, 65, 67, 70, 72],
            },
            {
              name: "Fixed Incentive",
              data: [22, 27, 30, 32, 34, 38, 40, 42, 45, 47, 49, 50],
            },
          ],
          Recce: [
            {
              name: "Expected Incentive",
              data: [20, 18, 22, 25, 28, 24, 26, 30, 32, 34, 36, 38],
            },
            {
              name: "Fixed Incentive",
              data: [8, 10, 12, 14, 15, 16, 18, 19, 20, 21, 22, 23],
            },
          ],
          "Site Visit": [
            {
              name: "Expected Incentive",
              data: [15, 14, 13, 16, 18, 15, 17, 18, 19, 20, 21, 22],
            },
            {
              name: "Fixed Incentive",
              data: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
            },
          ],
          "Follow Up": [
            {
              name: "Expected Incentive",
              data: [15, 15, 14, 14, 14, 13, 15, 14, 14, 13, 13, 12],
            },
            {
              name: "Fixed Incentive",
              data: [7, 9, 9, 8, 8, 10, 9, 9, 10, 10, 10, 9],
            },
          ],
        },
        New: {
          "All Activities": [
            {
              name: "Expected Incentive",
              data: [30, 28, 32, 35, 38, 33, 36, 40, 42, 44, 46, 48],
            },
            {
              name: "Fixed Incentive",
              data: [12, 15, 18, 20, 22, 24, 26, 28, 30, 32, 34, 35],
            },
          ],
          Recce: [
            {
              name: "Expected Incentive",
              data: [12, 11, 14, 16, 18, 15, 17, 20, 22, 24, 26, 28],
            },
            {
              name: "Fixed Incentive",
              data: [5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
            },
          ],
          "Site Visit": [
            {
              name: "Expected Incentive",
              data: [10, 9, 8, 11, 12, 10, 11, 12, 13, 14, 15, 16],
            },
            {
              name: "Fixed Incentive",
              data: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
            },
          ],
          "Follow Up": [
            {
              name: "Expected Incentive",
              data: [8, 8, 10, 8, 8, 8, 8, 8, 7, 6, 5, 4],
            },
            {
              name: "Fixed Incentive",
              data: [3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3],
            },
          ],
        },
        Existing: {
          "All Activities": [
            {
              name: "Expected Incentive",
              data: [20, 19, 17, 20, 22, 19, 22, 22, 23, 23, 24, 24],
            },
            {
              name: "Fixed Incentive",
              data: [10, 12, 12, 12, 12, 14, 14, 14, 15, 15, 15, 15],
            },
          ],
          Recce: [
            {
              name: "Expected Incentive",
              data: [8, 7, 8, 9, 10, 9, 9, 10, 10, 10, 10, 10],
            },
            {
              name: "Fixed Incentive",
              data: [3, 4, 4, 5, 5, 5, 6, 6, 6, 6, 6, 6],
            },
          ],
          "Site Visit": [
            {
              name: "Expected Incentive",
              data: [5, 5, 5, 5, 6, 5, 6, 6, 6, 6, 6, 6],
            },
            {
              name: "Fixed Incentive",
              data: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            },
          ],
          "Follow Up": [
            {
              name: "Expected Incentive",
              data: [7, 7, 4, 6, 6, 5, 7, 6, 7, 7, 8, 8],
            },
            {
              name: "Fixed Incentive",
              data: [4, 5, 5, 4, 4, 6, 5, 5, 6, 6, 6, 6],
            },
          ],
        },
      },
      Team: {
        "All Clients": {
          "All Activities": [
            {
              name: "Expected Incentive",
              data: [
                150, 141, 147, 165, 180, 156, 174, 186, 195, 201, 210, 216,
              ],
            },
            {
              name: "Fixed Incentive",
              data: [66, 81, 90, 96, 102, 114, 120, 126, 135, 141, 147, 150],
            },
          ],
          Recce: [
            {
              name: "Expected Incentive",
              data: [60, 54, 66, 75, 84, 72, 78, 90, 96, 102, 108, 114],
            },
            {
              name: "Fixed Incentive",
              data: [24, 30, 36, 42, 45, 48, 54, 57, 60, 63, 66, 69],
            },
          ],
          "Site Visit": [
            {
              name: "Expected Incentive",
              data: [45, 42, 39, 48, 54, 45, 51, 54, 57, 60, 63, 66],
            },
            {
              name: "Fixed Incentive",
              data: [21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54],
            },
          ],
          "Follow Up": [
            {
              name: "Expected Incentive",
              data: [45, 45, 42, 42, 42, 39, 45, 42, 42, 39, 39, 36],
            },
            {
              name: "Fixed Incentive",
              data: [21, 27, 27, 24, 24, 30, 27, 27, 30, 30, 30, 27],
            },
          ],
        },
        New: {
          "All Activities": [
            {
              name: "Expected Incentive",
              data: [90, 84, 96, 105, 114, 99, 108, 120, 126, 132, 138, 144],
            },
            {
              name: "Fixed Incentive",
              data: [36, 45, 54, 60, 66, 72, 78, 84, 90, 96, 102, 105],
            },
          ],
          Recce: [
            {
              name: "Expected Incentive",
              data: [36, 33, 42, 48, 54, 45, 51, 60, 66, 72, 78, 84],
            },
            {
              name: "Fixed Incentive",
              data: [15, 18, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51],
            },
          ],
          "Site Visit": [
            {
              name: "Expected Incentive",
              data: [30, 27, 24, 33, 36, 30, 33, 36, 39, 42, 45, 48],
            },
            {
              name: "Fixed Incentive",
              data: [12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45],
            },
          ],
          "Follow Up": [
            {
              name: "Expected Incentive",
              data: [24, 24, 30, 24, 24, 24, 24, 24, 21, 18, 15, 12],
            },
            {
              name: "Fixed Incentive",
              data: [9, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 9],
            },
          ],
        },
        Existing: {
          "All Activities": [
            {
              name: "Expected Incentive",
              data: [60, 57, 51, 60, 66, 57, 66, 66, 69, 69, 72, 72],
            },
            {
              name: "Fixed Incentive",
              data: [30, 36, 36, 36, 36, 42, 42, 42, 45, 45, 45, 45],
            },
          ],
          Recce: [
            {
              name: "Expected Incentive",
              data: [24, 21, 24, 27, 30, 27, 27, 30, 30, 30, 30, 30],
            },
            {
              name: "Fixed Incentive",
              data: [9, 12, 12, 15, 15, 15, 18, 18, 18, 18, 18, 18],
            },
          ],
          "Site Visit": [
            {
              name: "Expected Incentive",
              data: [15, 15, 15, 15, 18, 15, 18, 18, 18, 18, 18, 18],
            },
            {
              name: "Fixed Incentive",
              data: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
            },
          ],
          "Follow Up": [
            {
              name: "Expected Incentive",
              data: [21, 21, 12, 18, 18, 15, 21, 18, 21, 21, 24, 24],
            },
            {
              name: "Fixed Incentive",
              data: [12, 15, 15, 12, 12, 18, 15, 15, 18, 18, 18, 18],
            },
          ],
        },
      },
    },
    Weekly: {
      Self: {
        "All Clients": {
          "All Activities": [
            { name: "Expected Incentive", data: [12, 14, 13, 15] },
            { name: "Fixed Incentive", data: [5, 7, 6, 8] },
          ],
          Recce: [
            { name: "Expected Incentive", data: [5, 6, 5, 7] },
            { name: "Fixed Incentive", data: [2, 3, 2, 3] },
          ],
          "Site Visit": [
            { name: "Expected Incentive", data: [4, 5, 5, 5] },
            { name: "Fixed Incentive", data: [2, 2, 2, 3] },
          ],
          "Follow Up": [
            { name: "Expected Incentive", data: [3, 3, 3, 3] },
            { name: "Fixed Incentive", data: [1, 2, 2, 2] },
          ],
        },
        New: {
          "All Activities": [
            { name: "Expected Incentive", data: [8, 9, 8, 10] },
            { name: "Fixed Incentive", data: [3, 4, 4, 5] },
          ],
          Recce: [
            { name: "Expected Incentive", data: [3, 4, 3, 5] },
            { name: "Fixed Incentive", data: [1, 2, 1, 2] },
          ],
          "Site Visit": [
            { name: "Expected Incentive", data: [3, 3, 3, 3] },
            { name: "Fixed Incentive", data: [1, 1, 2, 2] },
          ],
          "Follow Up": [
            { name: "Expected Incentive", data: [2, 2, 2, 2] },
            { name: "Fixed Incentive", data: [1, 1, 1, 1] },
          ],
        },
        Existing: {
          "All Activities": [
            { name: "Expected Incentive", data: [4, 5, 5, 5] },
            { name: "Fixed Incentive", data: [2, 3, 2, 3] },
          ],
          Recce: [
            { name: "Expected Incentive", data: [2, 2, 2, 2] },
            { name: "Fixed Incentive", data: [1, 1, 1, 1] },
          ],
          "Site Visit": [
            { name: "Expected Incentive", data: [1, 2, 2, 2] },
            { name: "Fixed Incentive", data: [1, 1, 1, 1] },
          ],
          "Follow Up": [
            { name: "Expected Incentive", data: [1, 1, 1, 1] },
            { name: "Fixed Incentive", data: [0, 1, 0, 1] },
          ],
        },
      },
      Team: {
        "All Clients": {
          "All Activities": [
            { name: "Expected Incentive", data: [36, 42, 39, 45] },
            { name: "Fixed Incentive", data: [15, 21, 18, 24] },
          ],
          Recce: [
            { name: "Expected Incentive", data: [15, 18, 15, 21] },
            { name: "Fixed Incentive", data: [6, 9, 6, 9] },
          ],
          "Site Visit": [
            { name: "Expected Incentive", data: [12, 15, 15, 15] },
            { name: "Fixed Incentive", data: [6, 6, 6, 9] },
          ],
          "Follow Up": [
            { name: "Expected Incentive", data: [9, 9, 9, 9] },
            { name: "Fixed Incentive", data: [3, 6, 6, 6] },
          ],
        },
        New: {
          "All Activities": [
            { name: "Expected Incentive", data: [24, 27, 24, 30] },
            { name: "Fixed Incentive", data: [9, 12, 12, 15] },
          ],
          Recce: [
            { name: "Expected Incentive", data: [9, 12, 9, 15] },
            { name: "Fixed Incentive", data: [3, 6, 3, 6] },
          ],
          "Site Visit": [
            { name: "Expected Incentive", data: [9, 9, 9, 9] },
            { name: "Fixed Incentive", data: [3, 3, 6, 6] },
          ],
          "Follow Up": [
            { name: "Expected Incentive", data: [6, 6, 6, 6] },
            { name: "Fixed Incentive", data: [3, 3, 3, 3] },
          ],
        },
        Existing: {
          "All Activities": [
            { name: "Expected Incentive", data: [12, 15, 15, 15] },
            { name: "Fixed Incentive", data: [6, 9, 6, 9] },
          ],
          Recce: [
            { name: "Expected Incentive", data: [6, 6, 6, 6] },
            { name: "Fixed Incentive", data: [3, 3, 3, 3] },
          ],
          "Site Visit": [
            { name: "Expected Incentive", data: [3, 6, 6, 6] },
            { name: "Fixed Incentive", data: [3, 3, 3, 3] },
          ],
          "Follow Up": [
            { name: "Expected Incentive", data: [3, 3, 3, 3] },
            { name: "Fixed Incentive", data: [0, 3, 0, 3] },
          ],
        },
      },
    },
    Yearly: {
      Self: {
        "All Clients": {
          "All Activities": [
            { name: "Expected Incentive", data: [200, 220, 240, 260] },
            { name: "Fixed Incentive", data: [120, 140, 160, 180] },
          ],
          Recce: [
            { name: "Expected Incentive", data: [80, 90, 100, 110] },
            { name: "Fixed Incentive", data: [50, 60, 70, 80] },
          ],
          "Site Visit": [
            { name: "Expected Incentive", data: [60, 65, 70, 75] },
            { name: "Fixed Incentive", data: [35, 40, 45, 50] },
          ],
          "Follow Up": [
            { name: "Expected Incentive", data: [60, 65, 70, 75] },
            { name: "Fixed Incentive", data: [35, 40, 45, 50] },
          ],
        },
        New: {
          "All Activities": [
            { name: "Expected Incentive", data: [130, 145, 160, 175] },
            { name: "Fixed Incentive", data: [75, 90, 105, 120] },
          ],
          Recce: [
            { name: "Expected Incentive", data: [52, 58, 64, 70] },
            { name: "Fixed Incentive", data: [30, 36, 42, 48] },
          ],
          "Site Visit": [
            { name: "Expected Incentive", data: [39, 43, 48, 53] },
            { name: "Fixed Incentive", data: [23, 27, 32, 36] },
          ],
          "Follow Up": [
            { name: "Expected Incentive", data: [39, 44, 48, 52] },
            { name: "Fixed Incentive", data: [22, 27, 31, 36] },
          ],
        },
        Existing: {
          "All Activities": [
            { name: "Expected Incentive", data: [70, 75, 80, 85] },
            { name: "Fixed Incentive", data: [45, 50, 55, 60] },
          ],
          Recce: [
            { name: "Expected Incentive", data: [28, 32, 36, 40] },
            { name: "Fixed Incentive", data: [20, 24, 28, 32] },
          ],
          "Site Visit": [
            { name: "Expected Incentive", data: [21, 22, 22, 22] },
            { name: "Fixed Incentive", data: [12, 13, 13, 14] },
          ],
          "Follow Up": [
            { name: "Expected Incentive", data: [21, 21, 22, 23] },
            { name: "Fixed Incentive", data: [13, 13, 14, 14] },
          ],
        },
      },
      Team: {
        "All Clients": {
          "All Activities": [
            { name: "Expected Incentive", data: [600, 660, 720, 780] },
            { name: "Fixed Incentive", data: [360, 420, 480, 540] },
          ],
          Recce: [
            { name: "Expected Incentive", data: [240, 270, 300, 330] },
            { name: "Fixed Incentive", data: [150, 180, 210, 240] },
          ],
          "Site Visit": [
            { name: "Expected Incentive", data: [180, 195, 210, 225] },
            { name: "Fixed Incentive", data: [105, 120, 135, 150] },
          ],
          "Follow Up": [
            { name: "Expected Incentive", data: [180, 195, 210, 225] },
            { name: "Fixed Incentive", data: [105, 120, 135, 150] },
          ],
        },
        New: {
          "All Activities": [
            { name: "Expected Incentive", data: [390, 435, 480, 525] },
            { name: "Fixed Incentive", data: [225, 270, 315, 360] },
          ],
          Recce: [
            { name: "Expected Incentive", data: [156, 174, 192, 210] },
            { name: "Fixed Incentive", data: [90, 108, 126, 144] },
          ],
          "Site Visit": [
            { name: "Expected Incentive", data: [117, 129, 144, 159] },
            { name: "Fixed Incentive", data: [69, 81, 96, 108] },
          ],
          "Follow Up": [
            { name: "Expected Incentive", data: [117, 132, 144, 156] },
            { name: "Fixed Incentive", data: [66, 81, 93, 108] },
          ],
        },
        Existing: {
          "All Activities": [
            { name: "Expected Incentive", data: [210, 225, 240, 255] },
            { name: "Fixed Incentive", data: [135, 150, 165, 180] },
          ],
          Recce: [
            { name: "Expected Incentive", data: [84, 96, 108, 120] },
            { name: "Fixed Incentive", data: [60, 72, 84, 96] },
          ],
          "Site Visit": [
            { name: "Expected Incentive", data: [63, 66, 66, 66] },
            { name: "Fixed Incentive", data: [36, 39, 39, 42] },
          ],
          "Follow Up": [
            { name: "Expected Incentive", data: [63, 63, 66, 69] },
            { name: "Fixed Incentive", data: [39, 39, 42, 42] },
          ],
        },
      },
    },
  };

  // X-axis categories based on time filter
  const xCategories =
    timeFilter === "Weekly"
      ? ["Week 1", "Week 2", "Week 3", "Week 4"]
      : timeFilter === "Monthly"
      ? [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ]
      : ["Q1", "Q2", "Q3", "Q4"];

  // Get current series data
  const series = dataStructure[timeFilter][viewMode][clientType][activityType];

  const options = {
    chart: {
      type: "line",
      toolbar: { show: false },
      animations: {
        enabled: true,
        speed: 400,
      },
    },
    stroke: {
      curve: "smooth",
      width: 4,
    },
    markers: {
      size: 6,
      strokeWidth: 3,
      hover: { size: 8 },
    },
    colors: ["#F4A53C", "#3FAF7F"],

    xaxis: {
      categories: xCategories,
      labels: {
        style: { colors: "#6b7280", fontSize: "14px" },
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => `${value}K`,
        style: { colors: "#6b7280", fontSize: "14px" },
      },
    },

    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 4,
    },

    legend: {
      position: "bottom",
      markers: {
        width: 10,
        height: 10,
        radius: 12,
      },
    },

    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value) => `₹${value}K`,
      },
    },
  };

  return (
    <div className="p-6 rounded-xl border shadow-md bg-white">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Incentive</h2>
          <p className="text-xs text-gray-500 mt-1">
            {viewMode} • {clientType} • {activityType} • {timeFilter}
          </p>
        </div>

        <div className="flex items-center gap-3 text-gray-700 whitespace-nowrap">
          <select
            className="border rounded-md px-2 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
          >
            <option>Self</option>
            <option>Team</option>
          </select>

          <select
            className="border rounded-md px-2 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={clientType}
            onChange={(e) => setClientType(e.target.value)}
          >
            <option>All Clients</option>
            <option>New</option>
            <option>Existing</option>
          </select>

          <select
            className="border rounded-md px-2 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={activityType}
            onChange={(e) => setActivityType(e.target.value)}
          >
            <option>All Activities</option>
            <option>Recce</option>
            <option>Site Visit</option>
            <option>Follow Up</option>
          </select>

          <select
            className="border rounded-md px-2 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
          >
            <option>Monthly</option>
            <option>Weekly</option>
            <option>Yearly</option>
          </select>
        </div>
      </div>

      <Chart options={options} series={series} type="line" height={320} />
    </div>
  );
};

export default IncentiveChart;
