import React from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  MapPin,
  PenTool,
  FileText,
  ShoppingBag,
  Factory,
  Wrench,
  Truck,
  AlertCircle,
  Hammer,
} from "lucide-react";

const DepartmentOverview = () => {
  const navigate = useNavigate();
  // --- Mock Data: Top Summary Metrics ---
  const summaryMetrics = [
    {
      title: "Total Projects (All Departments)",
      value: "132",
      subtext: "Across Recce, Design, Production, Inst...",
      valueColor: "text-blue-600",
    },
    {
      title: "Total Flags Raised",
      value: "18",
      subtext: "5 Critical • 7 At Risk • 6 Normal",
      valueColor: "text-red-600",
    },
    {
      title: "Waiting Projects",
      value: "41",
      subtext: "Vendor, client or inter-department...",
      valueColor: "text-orange-500",
    },
    {
      title: "Completed This Week",
      value: "27",
      subtext: "Closed projects & major milestones",
      valueColor: "text-green-600", // Dark red/brown per screenshot
    },
  ];

  // --- Mock Data: Department Cards ---
  const departments = [
    {
      id: 1,
      name: "Sales",
      icon: TrendingUp,
      iconBg: "bg-blue-50 text-blue-600",
      stats: { completed: 12, process: 8, pending: 3 },
    },
    {
      id: 2,
      name: "Recce",
      icon: MapPin,
      iconBg: "bg-amber-50 text-amber-600",
      stats: { completed: 24, process: 5, pending: 2 },
    },
    {
      id: 3,
      name: "Design",
      icon: PenTool,
      iconBg: "bg-green-50 text-green-600",
      stats: { completed: 31, process: 12, pending: 9 },
    },
    {
      id: 4,
      name: "Quotation",
      icon: FileText,
      iconBg: "bg-blue-50 text-blue-600",
      stats: { completed: 19, process: 5, pending: 2 },
    },
    {
      id: 5,
      name: "PR",
      icon: ShoppingBag,
      iconBg: "bg-green-50 text-green-600",
      stats: { completed: 16, process: 9, pending: 11 },
    },
    {
      id: 6,
      name: "Production",
      icon: Factory,
      iconBg: "bg-gray-50 text-gray-600",
      stats: { completed: 22, process: 10, pending: 7 },
    },
    {
      id: 7,
      name: "Installation",
      icon: Wrench,
      iconBg: "bg-red-50 text-red-500",
      stats: { completed: 14, process: 4, pending: 2 },
    },
    {
      id: 8,
      name: "Dispatch",
      icon: Truck,
      iconBg: "bg-orange-50 text-orange-500",
      stats: { completed: 11, process: 3, pending: 1 },
    },
    {
      id: 9,
      name: "Complaint",
      icon: AlertCircle,
      iconBg: "bg-red-50 text-red-600",
      stats: { completed: 11, process: 3, pending: 1 },
    },
    {
      id: 10,
      name: "Repair",
      icon: Hammer,
      iconBg: "bg-amber-50 text-amber-600",
      stats: { completed: 11, process: 3, pending: 1 },
    },
  ];

  return (
    <div className="">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-5 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Department Overview
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Monitor all signage departments, projects & next-day planning
            </p>
          </div>

          <div className="flex items-center gap-4">
            <select className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 bg-white focus:outline-none cursor-pointer">
              <option>All Departments</option>
            </select>

            <select className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 bg-white focus:outline-none cursor-pointer">
              <option>Any Status</option>
            </select>
          </div>
        </div>
      </div>
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryMetrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex flex-col justify-between h-32"
          >
            <div>
              <h3 className="text-xs font-medium text-gray-500 mb-1">
                {metric.title}
              </h3>
              <div className={`text-3xl font-bold ${metric.valueColor}`}>
                {metric.value}
              </div>
            </div>
            <p className="text-[10px] text-gray-400 leading-tight">
              {metric.subtext}
            </p>
          </div>
        ))}
      </div>

      {/* Department Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => {
          // Map department name to route (ensure matches ProjectRoutes.jsx)
          let route = null;
          switch (dept.name) {
            case "Sales":
              route = "/project/sales-department-table";
              break;
            case "Recce":
              route = "/project/recce-department-table";
              break;
            case "Design":
              route = "/project/design-department-table";
              break;
            case "Quotation":
              route = "/project/quotation-department-table";
              break;
            case "PR":
              route = "/project/pr-department-table";
              break;
            case "Production":
              route = "/project/production-department-table";
              break;
            case "Installation":
              route = "/project/installation-department-table";
              break;
            case "Dispatch":
              route = "/project/dispatch-department-table";
              break;
            case "Complaint":
              route = "/project/complaints-department-table";
              break;
            case "Repair":
              route = "/project/repairs-department-table";
              break;
            default:
              route = null;
          }
          return (
            <div
              key={dept.id}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                if (route) navigate(route);
              }}
            >
              {/* Card Header */}
              <div className="flex items-center gap-4 mb-8">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${dept.iconBg}`}
                >
                  <dept.icon size={24} />
                </div>
                <h2 className="text-base font-bold text-gray-900">
                  {dept.name}
                </h2>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4 border-t border-gray-50 pt-4">
                {/* Completed */}
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    COMPLETED
                  </span>
                  <span className="text-xl font-bold text-green-500">
                    {dept.stats.completed}
                  </span>
                </div>

                {/* Process */}
                <div className="flex flex-col border-l border-gray-100 pl-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    PROCESS
                  </span>
                  <span className="text-xl font-bold text-blue-500">
                    {dept.stats.process}
                  </span>
                </div>

                {/* Pending */}
                <div className="flex flex-col border-l border-gray-100 pl-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    PENDING
                  </span>
                  <span className="text-xl font-bold text-orange-400">
                    {dept.stats.pending}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DepartmentOverview;
