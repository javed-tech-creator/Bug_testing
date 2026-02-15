import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  FileInput,
  FileSearch,
  Clock,
  Flag,
  FilterX,
  Ban,
  Briefcase,
  Eye,
  Bell,
  Calendar,
  ChevronDown,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import PageHeader from "../../../../components/PageHeader.jsx";
// --- Mock Data ---

const topCards = [
  {
    label: "Assigned Quotations",
    value: 12,
    icon: User,
    color: "text-blue-600",
    border: "border-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "Received Quotations",
    value: 4,
    icon: FileInput,
    color: "text-green-600",
    border: "border-green-600",
    bg: "bg-green-50",
  },
  {
    label: "Quotation in Review",
    value: 2,
    icon: FileSearch,
    color: "text-blue-400",
    border: "border-blue-400",
    bg: "bg-blue-50",
  },
  {
    label: "Waiting Quotations",
    value: 8,
    icon: Clock,
    color: "text-orange-400",
    border: "border-orange-400",
    bg: "bg-orange-50",
  },
  {
    label: "Flag Raised Quotations",
    value: 26,
    icon: Flag,
    color: "text-red-600",
    border: "border-red-600",
    bg: "bg-red-50",
  },
  {
    label: "Lost Quotations",
    value: 13,
    icon: FilterX,
    color: "text-gray-600",
    border: "border-gray-600",
    bg: "bg-gray-50",
  },
  {
    label: "Declined Quotations",
    value: 112,
    icon: Ban,
    color: "text-red-500",
    border: "border-red-500",
    bg: "bg-red-50",
  },
  {
    label: "Quotations (Client)",
    value: 13,
    icon: Briefcase,
    color: "text-blue-500",
    border: "border-blue-500",
    bg: "bg-blue-50",
  },
];

const dailyStats = [
  { label: "Assigned Today", value: 80, color: "text-blue-600" },
  { label: "Received Today", value: 10, color: "text-green-600" },
  { label: "Moved to Review", value: 208, color: "text-blue-500" },
  { label: "Flags Raised Today", value: 190, color: "text-red-600" },
  { label: "Lost Today", value: 198, color: "text-gray-600" },
];

const initialBarData = [
  { name: "Assigned", count: 12, color: "#2563eb" },
  { name: "Received", count: 21, color: "#16a34a" },
  { name: "In Review", count: 5, color: "#f59e0b" },
  { name: "Waiting", count: 13, color: "#4b5563" },
  { name: "Flag Raised", count: 23, color: "#dc2626" },
  { name: "Lost", count: 18, color: "#374151" },
  { name: "Declined", count: 2, color: "#991b1b" },
];

const lineData = [
  { name: "Jan", modified: 400, accepted: 200, rejected: 100 },
  { name: "Feb", modified: 650, accepted: 600, rejected: 400 },
  { name: "Mar", modified: 1100, accepted: 780, rejected: 10 },
  { name: "Apr", modified: 700, accepted: 550, rejected: 300 },
  { name: "May", modified: 500, accepted: 1100, rejected: 650 },
  { name: "Jun", modified: 800, accepted: 700, rejected: 800 },
  { name: "July", modified: 550, accepted: 600, rejected: 1200 },
];

const tableData = [
  {
    id: 1,
    client: "GreenFields Co.",
    project: "Retails Store Signage",
    products: 12,
    date: "11 Nov 25, 10:30AM",
    priorityT: "High",
    priorityN: "High (1)",
    status: "Approved By Sales",
    deadline: "11 Nov 25, 11:30AM",
    actions: "send",
  },
  {
    id: 2,
    client: "AgriMart",
    project: "Mall Facade Design's",
    products: 23,
    date: "11 Nov 25, 10:30AM",
    priorityT: "High",
    priorityN: "High (2)",
    status: "Submitted to Sales",
    deadline: "11 Nov 25, 11:30AM",
    actions: "bell",
  },
  {
    id: 3,
    client: "SunHarvest",
    project: "Office Branding Survey",
    products: 32,
    date: "11 Nov 25, 10:30AM",
    priorityT: "Medium",
    priorityN: "Medium (3)",
    status: "Approved By Sales",
    deadline: "11 Nov 25, 11:30AM",
    actions: "send",
  },
  {
    id: 4,
    client: "FreshStore",
    project: "Retails Store Signage",
    products: 12,
    date: "11 Nov 25, 10:30AM",
    priorityT: "Medium",
    priorityN: "Medium (4)",
    status: "Approved By Sales",
    deadline: "11 Nov 25, 11:30AM",
    actions: "send",
  },
  {
    id: 5,
    client: "SunHarvest",
    project: "Mall Facade Design's",
    products: 32,
    date: "11 Nov 25, 10:30AM",
    priorityT: "Low",
    priorityN: "Low (5)",
    status: "Modification Needed By Sales",
    deadline: "11 Nov 25, 11:30AM",
    actions: "modify",
  },
  {
    id: 6,
    client: "AgroHub",
    project: "Office Branding Survey",
    products: 22,
    date: "11 Nov 25, 10:30AM",
    priorityT: "Low",
    priorityN: "Low (6)",
    status: "Submitted to Manager",
    deadline: "11 Nov 25, 11:30AM",
    actions: "bell",
  },
];

// --- Components ---

const PriorityBadge = ({ label }) => {
  let styles = "px-2 py-1 rounded text-[11px] font-medium block w-fit ";
  if (label.includes("High"))
    styles += "bg-red-50 text-red-600 border border-red-100";
  else if (label.includes("Medium"))
    styles += "bg-amber-50 text-amber-600 border border-amber-100";
  else styles += "bg-green-50 text-green-600 border border-green-100";
  return <span className={styles}>{label}</span>;
};

const StatusBadge = ({ status }) => {
  let styles = "px-2 py-1 rounded text-[11px] font-medium ";
  if (status.includes("Approved")) styles += "bg-green-100 text-green-700";
  else if (status.includes("Submitted")) styles += "bg-blue-50 text-blue-600";
  else if (status.includes("Modification"))
    styles += "bg-orange-50 text-orange-600";
  else styles += "bg-gray-100 text-gray-600";
  return <span className={styles}>{status}</span>;
};

export default function Dashboard() {
  // --- State for Dropdown ---
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Date");
  const [barData, setBarData] = useState(initialBarData);

  const navigate = useNavigate();

  const handleRowClick = (row) => {
    if (row.status === "Approved By Sales") {
      navigate("/quotation/quotation-page");
    } else if (row.status === "Modification Needed By Sales") {
      navigate(`/quotation/form/${row.id}`);
    } else if (row.status === "Submitted to Manager") {
      navigate(`/quotation/assigned-quotations/${row.id}`);
    }
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter);
    setIsDropdownOpen(false);
    // Optional: Simulate refreshing data
    const randomized = initialBarData.map((d) => ({
      ...d,
      count: Math.floor(Math.random() * 30) + 2,
    }));
    setBarData(randomized);
  };

  return (
    <div className="">
      <PageHeader title="Dashboard" />

      {/* 1. Top Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4 mb-6">
        {topCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`bg-white border-t-4 ${card.border} p-3 rounded-md shadow-sm flex flex-col justify-between h-[130px]`}
            >
              <div className={`p-2 rounded-full w-fit mb-2 ${card.bg}`}>
                <Icon size={18} className={card.color} strokeWidth={2.5} />
              </div>
              <div>
                <div className={`text-2xl font-bold ${card.color}`}>
                  {card.value}
                </div>
                <div className="text-[11px] font-medium text-slate-500 leading-tight mt-1">
                  {card.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Daily Stats Row */}
      <div className="bg-white p-6 rounded-md shadow-sm mb-6 flex flex-wrap lg:flex-nowrap divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        {dailyStats.map((stat, idx) => (
          <div
            key={idx}
            className={`flex-1 px-6 first:pl-0 ${idx > 0 ? "mt-4 lg:mt-0 pt-4 lg:pt-0" : ""}`}
          >
            <div className="text-sm font-medium text-slate-500 mb-2">
              {stat.label}
            </div>
            <div className={`text-4xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Charts & Action Section */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6">
        {/* Bar Chart (Quotation Overview) - UPDATED with Working Dropdown & Slanted Labels */}
        <div className="xl:col-span-4 bg-white p-5 rounded-md shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-slate-800 text-sm">
              Quotation Overview
            </h3>

            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 px-3 py-1 bg-white border border-blue-200 text-blue-600 rounded text-[11px] font-medium hover:bg-blue-50 transition-colors"
              >
                <Calendar size={12} />
                {selectedFilter}
                <ChevronDown
                  size={12}
                  className={`transform transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-1 w-32 bg-white border border-slate-200 rounded shadow-lg z-20 py-1">
                  {["Today", "This Week", "This Month"].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleFilterSelect(option)}
                      className="block w-full text-left px-3 py-1.5 text-[11px] text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 10, right: 0, left: -20, bottom: 45 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="name"
                  interval={0}
                  tick={{
                    fontSize: 9,
                    fill: "#64748b",
                    angle: -45,
                    textAnchor: "end",
                  }}
                  tickMargin={10}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip cursor={{ fill: "transparent" }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={35}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart */}
        <div className="xl:col-span-5 bg-white p-5 rounded-md shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-800 text-sm mb-6">
            Quotation Status (Client)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={lineData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip />
                <Legend
                  iconType="square"
                  iconSize={8}
                  wrapperStyle={{ fontSize: "10px", paddingTop: "20px" }}
                />
                <Line
                  type="linear"
                  dataKey="modified"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                  name="Modified"
                />
                <Line
                  type="linear"
                  dataKey="accepted"
                  stroke="#16a34a"
                  strokeWidth={2}
                  dot={false}
                  name="Accpted"
                />
                <Line
                  type="linear"
                  dataKey="rejected"
                  stroke="#dc2626"
                  strokeWidth={2}
                  dot={false}
                  name="Rejected"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Required Panel */}
        <div className="xl:col-span-3 bg-white rounded-md shadow-sm overflow-hidden border border-slate-200">
          <div className="bg-[#c53030] text-white p-3 font-semibold text-sm">
            Action Required
          </div>
          <div className="p-0">
            {[
              {
                title: "Quotation waiting for Modification",
                sub: "HQ Signage • 2h ago",
              },
              {
                title: "Quotation waiting for Modification",
                sub: "Retail Store • 5h ago",
              },
              {
                title: "Quotation waiting for Modification",
                sub: "Due Today • 1d ago",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50"
              >
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 flex-shrink-0"></div>
                  <div className="w-full">
                    <div className="text-[13px] font-medium text-slate-700">
                      {item.title}
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-[11px] text-slate-400">
                        {item.sub}
                      </span>
                      <button className="text-orange-500 border border-orange-200 bg-white text-[10px] font-medium px-2 py-1 rounded hover:bg-orange-50">
                        Modify Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Active Quotations Table */}
      <div className="bg-white rounded-md shadow-sm overflow-hidden border border-slate-200">
        <div className="bg-[#3b82f6] text-white px-5 py-3 font-semibold text-sm">
          My Active Quotations
        </div>
        <div>
          <table className="w-full mx-auto text-left border-collapse border border-black">
            <thead className="bg-[#1a1a1a] text-white text-[11px] uppercase tracking-wider">
              <tr className="border-b border-black text-center">
                <th className="px-3 py-2 font-medium whitespace-nowrap w-[60px] border-r border-black">S. No</th>
                <th className="px-3 py-2 font-medium whitespace-nowrap border-r border-black">Client Name</th>
                <th className="px-3 py-2 font-medium whitespace-nowrap border-r border-black">Project Name</th>
                <th className="px-3 py-2 font-medium whitespace-nowrap w-[90px] text-center border-r border-black">Products</th>
                <th className="px-3 py-2 font-medium whitespace-nowrap border-r border-black">Date</th>
                <th className="px-3 py-2 font-medium whitespace-nowrap border-r border-black">Priority (T)</th>
                <th className="px-3 py-2 font-medium whitespace-nowrap border-r border-black">Priority (N)</th>
                <th className="px-3 py-2 font-medium whitespace-nowrap border-r border-black">Status</th>
                <th className="px-3 py-2 font-medium whitespace-nowrap border-r border-black">Deadline</th>
                <th className="px-3 py-2 font-medium whitespace-nowrap border-r border-black">Feedback</th>
                <th className="px-3 py-2 font-medium whitespace-nowrap w-[160px] text-center border-r border-black">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-[12px] text-slate-700">
              {tableData.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50 transition-colors text-center"
                >
                  <td className="px-3 py-2 font-medium whitespace-nowrap border-r border-b border-black">0{row.id}</td>
                  <td className="px-3 py-2 whitespace-normal break-words border-r border-b border-black">
                    {row.client}
                  </td>
                  <td className="px-3 py-2 whitespace-normal break-words border-r border-b border-black">
                    {row.project}
                  </td>
                  <td className="px-3 py-2 text-center whitespace-nowrap w-[90px] border-r border-b border-black">
                    {row.products}
                  </td>
                  <td className="px-3 py-2 text-slate-500 whitespace-nowrap border-r border-b border-black">{row.date}</td>
                  <td className="px-3 py-2 whitespace-nowrap border-r border-b border-black">
                    <PriorityBadge label={row.priorityT} />
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap border-r border-b border-black">
                    <PriorityBadge label={row.priorityN} />
                  </td>
                  <td className="px-3 py-2 whitespace-normal break-words border-r border-b border-black">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-3 py-2 text-slate-500 whitespace-nowrap border-r border-b border-black">{row.deadline}</td>
                  <td className="px-3 py-2 whitespace-nowrap border-r border-b border-black">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(row);
                      }}
                      className="bg-blue-600 text-white p-1.5 rounded hover:bg-blue-700 transition cursor-pointer"
                    >
                      <Eye size={14} />
                    </button>
                  </td>
                  <td className="px-3 py-2 w-[160px] border-r border-b border-black">
                    <div className="flex justify-center items-center gap-2">
                      {row.actions === "bell" ? (
                        <button className="w-9 h-9 flex items-center justify-center bg-[#f59e0b] text-white rounded hover:bg-amber-600 transition">
                          <Bell size={14} />
                        </button>
                      ) : row.actions === "modify" ? (
                        <button className="w-full bg-orange-50 text-orange-600 border border-orange-200 px-3 py-1 rounded text-[11px] font-medium hover:bg-orange-100 transition">
                          Make Modification
                        </button>
                      ) : (
                        <button className="w-full bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1 rounded text-[11px] font-medium hover:bg-blue-100 transition">
                          Send to Manager
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
