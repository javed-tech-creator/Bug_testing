import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  FileInput,
  FileSearch,
  Flag,
  FilterX,
  Ban,
  Briefcase,
  Eye,
  Bell,
  Calendar,
  ChevronDown,
  Minus,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  AlertTriangle
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

// --- Mock Data ---


const topCards = [
  {
    title: "Sales Intake",
    value: 32,
    meta: "8% Increase",
    titleColor: "text-slate-500",
    valueColor: "text-green-600",
    metaColor: "text-green-600",
    icon: TrendingUp,
    iconBg: "bg-green-50",
  },
  {
    title: "Assigned",
    value: 28,
    meta: "Stable",
    titleColor: "text-slate-500",
    valueColor: "text-blue-600",
    metaColor: "text-slate-500",
    icon: Minus,
    iconBg: "bg-blue-50",
  },
  {
    title: "Planning Pending",
    value: 5,
    meta: "Needs Action",
    titleColor: "text-slate-500",
    valueColor: "text-orange-500",
    metaColor: "text-orange-500",
    icon: AlertCircle,
    iconBg: "bg-orange-50",
  },
  {
    title: "Waiting",
    value: 54,
    meta: "12% Increase",
    titleColor: "text-slate-500",
    valueColor: "text-orange-500",
    metaColor: "text-red-500",
    icon: Clock,
    iconBg: "bg-red-50",
  },
  {
    title: "Flag Raised",
    value: 3,
    meta: "1 Resolved",
    titleColor: "text-slate-500",
    valueColor: "text-red-600",
    metaColor: "text-green-600",
    icon: CheckCircle,
    iconBg: "bg-green-50",
  },
  {
    title: "Complaint",
    value: 4,
    meta: "Open",
    titleColor: "text-slate-500",
    valueColor: "text-red-600",
    metaColor: "text-red-600",
    icon: XCircle,
    iconBg: "bg-red-50",
  },
];

const smartInsights = [
  {
    title: "Avg Approval Time",
    value: "1.2 Days",
    meta: "Faster than last week",
    valueColor: "text-slate-900",
    metaColor: "text-green-600",
  },
  {
    title: "Escalation Ratio",
    value: "12%",
    meta: "High Risk",
    valueColor: "text-red-600",
    metaColor: "text-red-500",
  },
  {
    title: "Dispatch Delay",
    value: "4%",
    meta: "Within limits",
    valueColor: "text-slate-900",
    metaColor: "text-green-600",
  },
  {
    title: "Manager Overload",
    value: "1 User",
    meta: "Rebalance suggested",
    valueColor: "text-orange-500",
    metaColor: "text-orange-500",
  },
];


const planningQueue = [
  {
    project: "Skyline Plaza Signage",
    company: "Skyline Group",
    manager: "S. Jenkins",
    department: "Design",
    completion: "20 Oct 2025",
    urgency: "High",
    submittedOn: "Oct 20, 10:00 AM",
  },
  {
    project: "Retail POS Display",
    company: "Fashion Co",
    manager: "K. Lee",
    department: "Recce",
    completion: "20 Oct 2025",
    urgency: "Low",
    submittedOn: "Oct 21, 09:30 AM",
  },
  {
    project: "Corporate Lobby Branding",
    company: "FinTech Ltd",
    manager: "A. Okafor",
    department: "Quotation",
    completion: "20 Oct 2025",
    urgency: "Med",
    submittedOn: "Oct 21, 02:15 PM",
  },
];


const UrgencyBadge = ({ level }) => {
  const base =
    "px-2 py-0.5 rounded-full text-[11px] font-medium inline-flex items-center";

  if (level === "High")
    return <span className={`${base} bg-red-50 text-red-600`}>High</span>;

  if (level === "Med")
    return <span className={`${base} bg-amber-50 text-amber-600`}>Med</span>;

  return <span className={`${base} bg-green-50 text-green-600`}>Low</span>;
};


const departmentWorkload = [
  { name: "Sales", onTrack: 12, delayed: 3, critical: 0 },
  { name: "Recce", onTrack: 10, delayed: 3, critical: 0 },
  { name: "Design", onTrack: 9, delayed: 2, critical: 0 },
  { name: "Quotation", onTrack: 14, delayed: 5, critical: 0 },
  { name: "PR", onTrack: 7, delayed: 0, critical: 0 },
  { name: "Production", onTrack: 12, delayed: 5, critical: 2 },
  { name: "Installation", onTrack: 11, delayed: 4, critical: 2 },
  { name: "Dispatch", onTrack: 11, delayed: 4, critical: 2 },
  { name: "Complaint", onTrack: 10, delayed: 3, critical: 0 },
  { name: "Repair", onTrack: 9, delayed: 2, critical: 0 },
];

const flagsEscalations = [
  { day: "Mon", raised: 8, resolved: 5 },
  { day: "Tue", raised: 11, resolved: 7 },
  { day: "Wed", raised: 14, resolved: 9 },
  { day: "Thu", raised: 9, resolved: 10 },
  { day: "Fri", raised: 13, resolved: 11 },
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

export default function ManagerDashboard() {
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
    <div className="min-h-screen p-6">
      {/* <PageHeader title="Dashboard" /> */}

      {/* 1. Top Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {topCards.map((card, idx) => {
          const Icon = card.icon;

          return (
            <div
              key={idx}
              className="bg-white rounded-lg border border-slate-200 px-4 py-3 shadow-sm hover:shadow transition"
            >
              {/* Title */}
              <div className={`text-[12px] font-medium mb-2 ${card.titleColor}`}>
                {card.title}
              </div>

              {/* Value + Icon */}
              <div className="flex items-center justify-between">
                <div className={`text-3xl font-bold ${card.valueColor}`}>
                  {card.value}
                </div>

                <div className={`p-2 rounded-full ${card.iconBg}`}>
                  <Icon size={16} className={card.valueColor} />
                </div>
              </div>

              {/* Meta */}
              <div className={`text-[11px] font-medium mt-2 ${card.metaColor}`}>
                {card.meta}
              </div>
            </div>
          );
        })}
      </div>

      {/*2. Smart Decision Insights */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">
          Smart Decision Insights
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {smartInsights.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg border border-slate-200 px-4 py-4 shadow-sm hover:shadow transition"
            >
              {/* Title */}
              <div className="text-[12px] font-medium text-slate-500 mb-2">
                {item.title}
              </div>

              {/* Value */}
              <div className={`text-2xl font-bold ${item.valueColor}`}>
                {item.value}
              </div>

              {/* Meta */}
              <div className={`text-[11px] font-medium mt-2 ${item.metaColor}`}>
                {item.meta}
              </div>
            </div>
          ))}
        </div>
      </div>


      {/*3. Planning Approval Queue */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-semibold text-slate-900">
              Planning Approval Queue
            </h3>

            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-orange-50 text-orange-600">
              5 Pending
            </span>
          </div>

          <button className="text-[12px] px-3 py-1 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50">
            Filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            {/* <thead className="bg-slate-50 text-slate-600 border-t border-b border-slate-200"> */}
            <thead className="bg-[#F1F5F9] text-slate-600 border-t border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-medium text-left">Project</th>
                <th className="px-4 py-3 font-medium text-left">Manager</th>
                <th className="px-4 py-3 font-medium text-left">Departments</th>
                <th className="px-4 py-3 font-medium text-left">Completion</th>
                <th className="px-4 py-3 font-medium text-left">Urgency</th>
                <th className="px-4 py-3 font-medium text-left">Submitted On</th>
                <th className="px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {planningQueue.map((row, idx) => (
                <tr
                  key={idx}
                  // className="group bg-white hover:bg-amber-50/40 transition-colors"
                  className="group bg-white hover:bg-[#FFFBEB] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">
                      {row.project}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {row.company}
                    </div>
                  </td>

                  <td className="px-4 py-4 text-slate-700">
                    {row.manager}
                  </td>

                  <td className="px-4 py-4 text-slate-700">
                    {row.department}
                  </td>

                  <td className="px-4 py-4 text-slate-700">
                    {row.completion}
                  </td>

                  <td className="px-4 py-4">
                    <UrgencyBadge level={row.urgency} />
                  </td>

                  <td className="px-4 py-4 text-slate-500">
                    {row.submittedOn}
                  </td>

                  {/* ACTION */}
                  <td className="px-6 py-4 text-right">
                    <button
                      className="
            px-3 py-1.5 text-[12px] font-medium rounded-md
            border border-slate-200
            text-slate-600 bg-white
            transition
            group-hover:bg-blue-600
            group-hover:text-white
            group-hover:border-blue-600
          "
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>


          </table>
        </div>
      </div>


      {/* 4. Department Workload + Flags Row */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 mt-8 mb-6">


        {/* LEFT: Department Workload Distribution */}
        <div className="xl:col-span-8">
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 h-[330px]">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">
              Department Workload Distribution
            </h3>

            <div className="h-[220px]">
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={departmentWorkload}
                    barCategoryGap={18}
                    barGap={2}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e5e7eb"
                    />

                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: "#64748b" }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      tick={{ fontSize: 11, fill: "#64748b" }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <Tooltip />

                    {/* BOTTOM STACK */}
                    <Bar
                      dataKey="critical"
                      stackId="a"
                      fill="#dc2626"
                      barSize={26}
                    />

                    {/* MIDDLE STACK */}
                    <Bar
                      dataKey="delayed"
                      stackId="a"
                      fill="#f59e0b"
                      barSize={26}
                    />

                    <Bar
                      dataKey="onTrack"
                      stackId="a"
                      fill="#16a34a"
                      barSize={26}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>



            </div>

            {/* Legend */}
            <div className="flex justify-center gap-5 mt-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-green-600" />
                On Track
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-amber-500" />
                Delayed
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-red-600" />
                Critical
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Flags & Escalations */}
        <div className="xl:col-span-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 h-[330px]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-800">
                Flags & Escalations
              </h3>
              {/* <ChevronUpRight className="w-4 h-4 text-slate-400" /> */}
            </div>

            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={flagsEscalations}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e7eb"
                  />

                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="raised"
                    stroke="#dc2626"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="resolved"
                    stroke="#16a34a"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-5 mt-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-4 h-1 rounded bg-red-600" />
                Raised
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-1 rounded bg-green-600" />
                Resolved
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5th. row */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 mt-6 mb-6">

        {/* LEFT: Risk & Escalation Control */}
        <div className="xl:col-span-8">
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 h-[230px]">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-800">
                Risk & Escalation Control
              </h3>
              <button className="text-[11px] px-3 py-1 rounded bg-slate-100 text-slate-600 hover:bg-slate-200">
                Detailed Report
              </button>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">

              {/* LEFT: Flags by Dept */}
              <div>
                <p className="text-[12px] font-medium text-slate-500 mb-3">
                  Flags by Dept
                </p>

                {[
                  { label: "Production", value: 8, color: "bg-red-500" },
                  { label: "Design", value: 5, color: "bg-orange-400" },
                  { label: "Install", value: 3, color: "bg-blue-500" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[90px_1fr_24px] items-center gap-3 mb-3"
                  >
                    {/* Label */}
                    <span className="text-[12px] text-slate-600">
                      {item.label}
                    </span>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-100 rounded">
                      <div
                        className={`h-2 rounded ${item.color}`}
                        style={{ width: `${item.value * 10}%` }}
                      />
                    </div>

                    {/* Count */}
                    <span className="text-[12px] text-slate-500 text-right">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>


              {/* VERTICAL DIVIDER */}
              <div className="hidden md:block absolute left-1/2 top-0 h-full w-px bg-slate-200" />

              {/* RIGHT: Critical Flags */}
              <div className="pl-0 md:pl-6">
                <p className="text-[12px] font-medium text-slate-500 mb-3">
                  Critical Flags
                </p>

                {[
                  { project: "Airport Lounge", type: "Material" },
                  { project: "Grand Hotel", type: "Complaint" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[1fr_120px_auto] items-center py-2 border-b last:border-0 gap-4"
                  >
                    {/* Project */}
                    <span className="text-[12px] font-medium text-red-600">
                      {item.project}
                    </span>

                    {/* Type (Material / Complaint) */}
                    <span className="text-[11px] text-slate-500 text-center">
                      {item.type}
                    </span>

                    {/* Action */}
                    <button className="text-[11px] px-3 py-1 border rounded text-slate-600 hover:bg-slate-50">
                      Act
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Manager Load */}
        <div className="xl:col-span-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 h-[230px]">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">
              Manager Load
            </h3>

            {[
              { name: "Sarah", load: 95, color: "bg-red-500" },
              { name: "Ken", load: 60, color: "bg-green-500" },
              { name: "Amara", load: 80, color: "bg-orange-400" },
            ].map((item, i) => (
              <div
                key={i}
                className="grid grid-cols-[28px_80px_1fr_80px] items-center gap-3 mb-4"
              >
                {/* Avatar */}
                <div className="w-7 h-7 rounded-full bg-slate-300 flex items-center justify-center text-xs text-white">
                  {item.name.charAt(0)}
                </div>

                {/* Name */}
                <span className="text-[12px] font-medium text-slate-700">
                  {item.name}
                </span>

                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-slate-100 rounded">
                  <div
                    className={`h-1.5 rounded ${item.color}`}
                    style={{ width: `${item.load}%` }}
                  />
                </div>

                {/* Percentage */}
                <span className="text-[12px] text-slate-500 text-right">
                  {item.load}% Utilized
                </span>
              </div>
            ))}
          </div>
        </div>



        {/* <div className="xl:col-span-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 h-[230px]">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">
              Manager Load
            </h3>

            {[
              { name: "Sarah", load: 95, color: "bg-red-500" },
              { name: "Ken", load: 60, color: "bg-green-500" },
              { name: "Amara", load: 80, color: "bg-orange-400" },
            ].map((item, i) => (
              <div
                key={i}
                className="grid grid-cols-[120px_1fr] items-start gap-4 mb-4"
              >
             
                <div className="flex items-center gap-3 self-center">
                  <div className="w-7 h-7 rounded-full bg-slate-300 flex items-center justify-center text-xs text-white">
                    {item.name.charAt(0)}
                  </div>
                  <span className="text-[12px] font-medium text-slate-700">
                    {item.name}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-500 text-right mb-1">
                    {item.load}% Utilized
                  </span>

                  <div className="w-full h-1.5 bg-slate-100 rounded">
                    <div
                      className={`h-1.5 rounded ${item.color}`}
                      style={{ width: `${item.load}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div> */}



      </div>


      {/* 6th. row */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 mb-6">

        {/* LEFT: Complaint Monitoring */}
        <div className="xl:col-span-8">
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center px-5 py-4 border-b">
              <h3 className="text-sm font-semibold text-slate-800">
                Complaint Monitoring
              </h3>
              <button className="text-[11px] px-2 py-0.5 bg-blue-50 rounded-full text-blue-600 hover:underline">
                View All
              </button>
            </div>

            <table className="w-full text-[12px]">
              {/* <thead className="bg-slate-50 text-slate-500"> */}
              <thead className="bg-[#F1F5F9] text-slate-500">
                <tr>
                  <th className="px-5 py-3 text-left">S.No</th>
                  <th className="px-4 py-3 text-left">Project</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Ageing</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    id: "01",
                    project: "Grand Hotel",
                    type: "Complaint",
                    age: "2 Days",
                    status: "Critical",
                    color: "bg-red-50 text-red-600",
                  },
                  {
                    id: "02",
                    project: "City Bank ATM",
                    type: "Repair",
                    age: "5 Days",
                    status: "In Progress",
                    color: "bg-orange-50 text-orange-600",
                  },
                ].map((row, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-5 py-3">{row.id}</td>
                    <td className="px-4 py-3">{row.project}</td>
                    <td className="px-4 py-3">{row.type}</td>
                    <td className="px-4 py-3">{row.age}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-[11px] ${row.color}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>


        {/* RIGHT: Recent Activity */}

        {/* RIGHT: Recent Activity */}
        <div className="xl:col-span-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 h-[330px]">

            {/* Header */}
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-sm font-semibold text-slate-800">
                Recent Activity
              </h3>
              <button className="text-[11px] px-3 py-1 border rounded text-slate-600 hover:bg-slate-50">
                View Full Log
              </button>
            </div>


            {/* Timeline */}
            <div className="space-y-6">
              {[
                {
                  title: "Critical Flag: PRJ-2490",
                  desc: "Production reported material shortage",
                  time: "10 mins ago",
                  icon: Flag,
                  iconBg: "bg-red-100",
                  iconColor: "text-red-600",
                },
                {
                  title: "Design Escalation",
                  desc: "Client rejection rate > 20%",
                  time: "2 hours ago",
                  icon: AlertCircle,
                  iconBg: "bg-orange-100",
                  iconColor: "text-orange-600",
                },
                {
                  title: "Handover Completed",
                  desc: "PRJ-2501 moved to Installation",
                  time: "4 hours ago",
                  icon: CheckCircle,
                  iconBg: "bg-green-100",
                  iconColor: "text-green-600",
                },
              ].map((item, i, arr) => {
                const Icon = item.icon;

                return (
                  <div key={i} className="flex gap-4 items-start">
                    {/* ICON + LINE COLUMN */}
                    <div className="relative flex flex-col items-center">
                      {/* Icon */}
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center z-10 ${item.iconBg}`}
                      >
                        <Icon size={14} className={item.iconColor} />
                      </div>

                      {/* Vertical line — TOUCHING ICON */}
                      {i !== arr.length - 1 && (
                        <div className="w-px h-6 bg-slate-200" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-1">
                      <p className="text-[13px] font-medium text-slate-800">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {item.desc}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {item.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>



          </div>
        </div>


        {/* <div className="xl:col-span-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 h-[330px]">


            <div className="flex justify-between items-center pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-sm font-semibold text-slate-800">
                Recent Activity
              </h3>
              <button className="text-[11px] px-3 py-1 border rounded text-slate-600 hover:bg-slate-50">
                View Full Log
              </button>
            </div>


            <div className="space-y-5">
              {[
                {
                  title: "Critical Flag: PRJ-2490",
                  desc: "Production reported material shortage",
                  time: "10 mins ago",
                  iconBg: "bg-red-100",
                  iconColor: "text-red-600",
                  icon: "!",
                },
                {
                  title: "Design Escalation",
                  desc: "Client rejection rate > 20%",
                  time: "2 hours ago",
                  iconBg: "bg-orange-100",
                  iconColor: "text-orange-600",
                  icon: "!",
                },
                {
                  title: "Handover Completed",
                  desc: "PRJ-2501 moved to Installation",
                  time: "4 hours ago",
                  iconBg: "bg-green-100",
                  iconColor: "text-green-600",
                  icon: "✓",
                },
              ].map((item, i, arr) => (
                <div key={i} className="flex gap-4 items-start relative">


                  <div className="relative flex flex-col items-center">

                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold z-10 ${item.iconBg} ${item.iconColor}`}
                    >
                      {item.icon}
                    </div>

                    {i !== arr.length - 1 && (
                      <div className="w-px bg-slate-200 flex-1 mt-1" />
                    )}
                  </div>


                  <div className="flex-1 pb-1">
                    <p className="text-[13px] font-medium text-slate-800">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {item.desc}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div> */}


      </div>

    </div>
  );
}
