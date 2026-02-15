import React from "react";
import { useAuth } from "@/store/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import DataLoading from "@/modules/vendor/components/DataLoading";
import {
  useGetAssetsDistributionQuery,
  useGetDashboardSummaryQuery,
  useGetEmployeeDataQuery,
} from "@/api/technology/dashboard.api";
import {
  AlertCircle,
  CheckCircle,
  ClipboardList,
  Loader,
  PauseCircle,
  ToolCase,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";

// Recharts
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function EmployeeDashboard() {
  const { userData } = useAuth();
  const role = userData?.role;
  const navigate = useNavigate();

  // Call queries
  const { data: summary, isLoading } = useGetDashboardSummaryQuery();
  const { data: dataAssets, isLoading: assetsLoading } =
    useGetAssetsDistributionQuery();
  const { data: employeeData, isLoading: empLoading } =
    useGetEmployeeDataQuery();

  if (isLoading || assetsLoading || empLoading) {
    return (
      <div className="flex items-center justify-center h-[90%] w-full">
        <DataLoading />
      </div>
    );
  }

  const Summary = summary?.data || {};
  const assetArray = dataAssets?.data || [];
  const ticketTrend = employeeData?.data || []; // ✅ safe handling

  // Pie Chart colors
  const COLORS = ["#4CAF50", "#FFC107", "#2196F3", "#F44336"];

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title="Dashboard" />

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {[
          {
            title: "Assigned Assets",
            value: Summary.totalAssets,
            icon: <ClipboardList className="w-6 h-6 text-blue-700" />,
            bgColor: "bg-gradient-to-br from-blue-100 to-blue-200",
          },
          {
            title: "Assigned Licenses",
            value: Summary.licenses,
            icon: <AlertCircle className="w-6 h-6 text-red-700" />,
            bgColor: "bg-gradient-to-br from-red-100 to-red-200",
          },
          {
            title: "In-Progress Tickets",
            value: Summary.progressTickets,
            icon: <Loader className="w-6 h-6 text-blue-700" />,
            bgColor: "bg-gradient-to-br from-blue-100 to-blue-200",
          },
          {
            title: "On-Hold Tickets",
            value: Summary.onHoldTickets,
            icon: <PauseCircle className="w-6 h-6 text-yellow-700" />,
            bgColor: "bg-gradient-to-br from-yellow-100 to-yellow-200",
          },
          {
            title: "Resolved Tickets",
            value: Summary.resolvedTickets,
            icon: <CheckCircle className="w-6 h-6 text-green-700" />,
            bgColor: "bg-gradient-to-br from-green-100 to-green-200",
          },
        ].map((card, idx) => (
          <Card
  key={idx}
  className="rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 bg-gradient-to-br from-white to-blue-50 p-2"
>
  <CardContent className="flex justify-between items-center gap-4 p-4">
    {/* Left side: title + value */}
    <div>
      <p className="text-sm text-gray-500 font-medium">{card.title}</p>
      <p className="text-2xl font-extrabold text-gray-800">{card.value}</p>
    </div>

    {/* Right side: icon */}
    <div
      className={`p-4 rounded-xl ${card.bgColor} flex items-center justify-center shadow-inner`}
    >
      {card.icon}
    </div>
  </CardContent>
</Card>

        ))}
      </div>

      {/* graph  */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart Section */}
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Assets Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={assetArray}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                nameKey="name"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {assetArray.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Graph Section */}
        <Card className="rounded-xl shadow-md bg-gradient-to-br from-white to-blue-50">
          <CardContent className="p-4">
            <h2 className="text-lg font-bold text-gray-700 mb-4">
              Tickets Status Trend (Last 7 Days)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ticketTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="OnHold"
                  stackId="a"
                  fill="#f87171"
                  name="On-Hold"
                />
                <Bar
                  dataKey="InProgress"
                  stackId="a"
                  fill="#facc15"
                  name="In-Progress"
                />
                <Bar
                  dataKey="Resolved"
                  stackId="a"
                  fill="#4ade80"
                  name="Resolved"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
