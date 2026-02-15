import React from "react";
import {
  LayoutGrid,
  FolderOpen,
  CheckCircle2,
  AlertCircle,
  Flag,
  Clock,
  MoreVertical,
  TrendingUp,
  AlertTriangle,
  XCircle,
  FileText,
  Truck,
  Wrench,
  MonitorPlay,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";

// --- Mock Data ---

const kpiData = [
  {
    title: "Total Active Projects",
    value: "84",
    subtext: "Across 7 departments",
    icon: FolderOpen,
    color: "border-l-4 border-blue-500",
    iconColor: "text-blue-500",
  },
  {
    title: "Projects On Track",
    value: "58",
    subtext: "69% of total volume",
    icon: CheckCircle2,
    color: "border-l-4 border-green-500",
    iconColor: "text-green-500",
  },
  {
    title: "Projects In Waiting",
    value: "14",
    subtext: "Delay probability > 60%",
    icon: AlertCircle,
    color: "border-l-4 border-amber-500",
    iconColor: "text-amber-500",
  },
  {
    title: "Critical Flags Open",
    value: "5",
    subtext: "Requires immediate action",
    icon: Flag,
    color: "border-l-4 border-red-500",
    iconColor: "text-red-500",
  },
  {
    title: "Completed Projects",
    value: "7",
    subtext: "Delivered To Client",
    icon: Clock,
    color: "border-l-4 border-gray-400",
    iconColor: "text-gray-500",
  },
];

const workloadData = [
  { name: "Sales", onTrack: 30, delayed: 5, critical: 0 },
  { name: "Recce", onTrack: 40, delayed: 8, critical: 0 },
  { name: "Design", onTrack: 35, delayed: 10, critical: 2 },
  { name: "Quotation", onTrack: 50, delayed: 15, critical: 0 },
  { name: "PR", onTrack: 20, delayed: 0, critical: 0 },
  { name: "Production", onTrack: 25, delayed: 10, critical: 8 },
  { name: "Installation", onTrack: 20, delayed: 10, critical: 5 },
  { name: "Dispatch", onTrack: 30, delayed: 10, critical: 10 },
  { name: "Complaint", onTrack: 40, delayed: 5, critical: 0 },
  { name: "Repair", onTrack: 35, delayed: 5, critical: 0 },
];

const escalationData = [
  { name: "Mon", raised: 8, resolved: 2 },
  { name: "Tue", raised: 10, resolved: 4 },
  { name: "Wed", raised: 14, resolved: 6 },
  { name: "Thu", raised: 9, resolved: 7 },
  { name: "Fri", raised: 14, resolved: 8 },
  { name: "Sat", raised: 12, resolved: 9 },
  { name: "Sun", raised: 11, resolved: 10 },
];

const projectRows = [
  {
    id: "#PRJ-2490",
    client: "Nexus Malls",
    dept: "Production",
    issue: "Material Shortage",
    pending: "2 Days",
    severity: "critical",
  },
  {
    id: "#PRJ-2388",
    client: "HDFC Bank",
    dept: "Purchasing",
    issue: "Vendor Delay",
    pending: "5 Days",
    severity: "critical",
  },
  {
    id: "#PRJ-2512",
    client: "Global Tech",
    dept: "Design",
    issue: "Approval Pending",
    pending: "3 Days",
    severity: "warning",
  },
  {
    id: "#PRJ-2495",
    client: "WeWork",
    dept: "Installation",
    issue: "Site Access",
    pending: "1 Day",
    severity: "warning",
  },
  {
    id: "#PRJ-2533",
    client: "Starbucks",
    dept: "Sales",
    issue: "Input Missing",
    pending: "3 Days",
    severity: "info",
  },
  {
    id: "#PRJ-2533",
    client: "Starbucks",
    dept: "Sales",
    issue: "Input Missing",
    pending: "3 Days",
    severity: "info",
  },
  {
    id: "#PRJ-2533",
    client: "Starbucks",
    dept: "Sales",
    issue: "Input Missing",
    pending: "3 Days",
    severity: "info",
  },
  {
    id: "#PRJ-2533",
    client: "Starbucks",
    dept: "Sales",
    issue: "Input Missing",
    pending: "3 Days",
    severity: "info",
  },
];

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active = false }) => (
  <div
    className={`flex items-center px-6 py-3 cursor-pointer hover:bg-gray-800 transition-colors ${active ? "text-white border-l-4 border-green-500 bg-gray-800" : "text-gray-400"}`}
  >
    <Icon size={18} className="mr-3" />
    <span className="text-sm font-medium">{label}</span>
  </div>
);

const CoOrdinatorDashboard = () => {
  return (
    <div className="">
      {/* Sidebar - Visual approximation based on Screenshot 1 */}

      {/* Main Content */}
      <main className="flex-1 p-6  min-h-screen">
        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {kpiData.map((kpi, idx) => (
            <div
              key={idx}
              className={`bg-white p-4 rounded-xl shadow-sm ${kpi.color}`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-medium text-gray-500">
                  {kpi.title}
                </h3>
                <kpi.icon size={20} className={kpi.iconColor} />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-1">
                {kpi.value}
              </div>
              <div className="text-xs text-gray-400">{kpi.subtext}</div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Stacked Bar Chart */}
          <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">
                Department Workload Distribution
              </h3>
              {/* <MoreVertical
                size={18}
                className="text-gray-400 cursor-pointer"
              /> */}
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={workloadData} barSize={20}>
                  <CartesianGrid vertical={false} stroke="#eee" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#666" }}
                    interval={0}
                  />
                  <Tooltip cursor={{ fill: "transparent" }} />
                  <Bar
                    dataKey="onTrack"
                    stackId="a"
                    fill="#4ade80"
                    name="On Track"
                    radius={[0, 0, 4, 4]}
                  />
                  <Bar
                    dataKey="delayed"
                    stackId="a"
                    fill="#fbbf24"
                    name="Delayed"
                  />
                  <Bar
                    dataKey="critical"
                    stackId="a"
                    fill="#ef4444"
                    name="Critical"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2 text-xs text-gray-500">
              <div className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                On Track
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-amber-400 mr-2"></span>
                Delayed
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                Critical
              </div>
            </div>
          </div>

          {/* Line Chart - Enhanced Version */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-800">
                Flags & Escalations
              </h3>
              <TrendingUp size={18} className="text-green-500" />
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-red-50 p-2 rounded-lg">
                <div className="text-xs text-red-600 font-medium">
                  Total Raised
                </div>
                <div className="text-xl font-bold text-red-700">69</div>
              </div>
              <div className="bg-green-50 p-2 rounded-lg">
                <div className="text-xs text-green-600 font-medium">
                  Resolved
                </div>
                <div className="text-xl font-bold text-green-700">44</div>
              </div>
            </div>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={escalationData}
                  margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
                >
                  <CartesianGrid
                    vertical={false}
                    stroke="#f0f0f0"
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#888" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#888" }}
                    domain={[0, 16]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={32}
                    iconType="line"
                    wrapperStyle={{ fontSize: "11px" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="raised"
                    stroke="#ef4444"
                    strokeWidth={2.5}
                    dot={{ fill: "#ef4444", r: 3 }}
                    activeDot={{ r: 5 }}
                    name="Raised"
                  />
                  <Line
                    type="monotone"
                    dataKey="resolved"
                    stroke="#22c55e"
                    strokeWidth={2.5}
                    dot={{ fill: "#22c55e", r: 3 }}
                    activeDot={{ r: 5 }}
                    name="Resolved"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Resolution Rate */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Resolution Rate</span>
                <span className="font-semibold text-green-600">63.8%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Project List & Planning Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Critical Projects Table */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-gray-900 text-base">
                  Flag Raised Projects
                </h3>
                <span className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full font-semibold">
                  5 Critical
                </span>
              </div>
              <button className="text-sm font-medium text-gray-700 border border-gray-200 px-4 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer">
                View All List
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border border-gray-200">
                <thead>
                  <tr className="bg-blue-50 text-gray-600 text-sm">
                    <th className="p-4 font-medium border-b border-gray-200">
                      Project ID
                    </th>
                    <th className="p-4 font-medium border-b border-gray-200">
                      Client Name
                    </th>
                    <th className="p-4 font-medium border-b border-gray-200">
                      Department
                    </th>
                    <th className="p-4 font-medium border-b border-gray-200">
                      Issue Type
                    </th>
                    <th className="p-4 font-medium border-b border-gray-200">
                      Pending
                    </th>
                    <th className="p-4 font-medium border-b border-gray-200">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {projectRows.map((row, i) => (
                    <tr
                      key={i}
                      className={
                        row.severity === "critical"
                          ? "bg-red-50"
                          : row.severity === "warning"
                            ? "bg-yellow-50"
                            : "bg-white"
                      }
                    >
                      <td className="p-4 font-bold text-gray-700 border-b border-gray-200">
                        {row.id}
                      </td>
                      <td className="p-4 text-gray-600 border-b border-gray-200">
                        {row.client}
                      </td>
                      <td className="p-4 text-gray-600 border-b border-gray-200">
                        {row.dept}
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            row.severity === "critical"
                              ? "bg-red-100 text-red-700"
                              : row.severity === "warning"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {row.issue}
                        </span>
                      </td>
                      <td
                        className={`p-4 font-semibold ${row.severity === "critical" ? "text-red-600" : "text-gray-800"}`}
                      >
                        {row.pending}
                      </td>
                      <td className="p-4 border-b border-gray-200">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded-lg font-medium cursor-pointer">
                          Resolve
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Sidebar Column */}
          <div className="flex flex-col gap-6">
            {/* Next Day Planning */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800">
                  Next Day Planning
                </h3>
                <span className="text-green-600 text-xs font-bold">
                  85% Ready
                </span>
              </div>
              <div className="space-y-3 mb-5">
                <div
                  className={`flex items-center justify-between p-3 rounded-lg bg-gray-50`}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-500" />
                    <span className="text-sm text-gray-700">Recce</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">
                    Submitted
                  </span>
                </div>
                <div
                  className={`flex items-center justify-between p-3 rounded-lg bg-gray-50`}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-500" />
                    <span className="text-sm text-gray-700">Design</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">
                    Submitted
                  </span>
                </div>
                <div
                  className={`flex items-center justify-between p-3 rounded-lg bg-yellow-50 border border-yellow-300`}
                >
                  <div className="flex items-center gap-2">
                    <XCircle size={16} className="text-red-500" />
                    <span className="text-sm text-gray-800 font-medium">
                      Production
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-red-600">
                    Pending
                  </span>
                </div>
                <div
                  className={`flex items-center justify-between p-3 rounded-lg bg-gray-50`}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-green-500" />
                    <span className="text-sm text-gray-700">Installation</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">
                    Submitted
                  </span>
                </div>
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-medium transition-colors cursor-pointer">
                Review & Make Plans
              </button>
            </div>
            {/* Recent Activity */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex-1">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800">Recent Activity</h3>
                <button className="text-xs border px-2 py-1 rounded text-gray-500 hover:bg-gray-50 cursor-pointer">
                  View Full Log
                </button>
              </div>
              <div className="relative border-l-2 border-gray-200 ml-3 space-y-8">
                <div className="ml-6 relative">
                  <div className="absolute -left-[31px] top-1 w-6 h-6 rounded-full bg-red-100 border border-red-200 flex items-center justify-center">
                    <Flag size={12} className="text-red-500" />
                  </div>
                  <h4 className="text-sm font-medium text-gray-800">
                    Critical Flag: PRJ-2490
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Production reported material shortage
                  </p>
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    10 mins ago
                  </span>
                </div>
                <div className="ml-6 relative">
                  <div className="absolute -left-[31px] top-1 w-6 h-6 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center">
                    <AlertTriangle size={12} className="text-amber-500" />
                  </div>
                  <h4 className="text-sm font-medium text-gray-800">
                    Design Escalation
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Client rejection rate &gt; 20%
                  </p>
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    2 hours ago
                  </span>
                </div>
                <div className="ml-6 relative">
                  <div className="absolute -left-[31px] top-1 w-6 h-6 rounded-full bg-green-100 border border-green-200 flex items-center justify-center">
                    <CheckCircle2 size={12} className="text-green-500" />
                  </div>
                  <h4 className="text-sm font-medium text-gray-800">
                    Handover Completed
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    PRJ-2501 moved to Installation
                  </p>
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    4 hours ago
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row - Dependency Insights */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
            <h3 className="font-semibold text-gray-800">
              Dependency & Waiting Insights
            </h3>
            <span className="text-xs text-gray-400 uppercase tracking-wider">
              Top Bottlenecks
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* List */}
            <div>
              <div className="text-xs text-gray-500 font-semibold mb-3 uppercase">
                Top 3 Reasons For Wait
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <span className="text-sm text-gray-700 flex items-center gap-2">
                    {/* Optionally add an icon here */}
                    Client Design Approval
                  </span>
                  <span className="text-xs font-bold bg-gray-200 px-2 py-1 rounded text-gray-600">
                    12 Projects
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <span className="text-sm text-gray-700 flex items-center gap-2">
                    Site Handover / Readiness
                  </span>
                  <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-600">
                    8 Projects
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <span className="text-sm text-gray-700 flex items-center gap-2">
                    Material / Vendor Delay
                  </span>
                  <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-600">
                    5 Projects
                  </span>
                </div>
              </div>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-1 gap-6 col-span-2 lg:col-span-2">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="bg-blue-50 p-8 rounded-2xl relative min-h-[220px] flex flex-col justify-between flex-1">
                  <div>
                    <div className="text-sm text-blue-600 font-semibold mb-2">
                      Avg Resolution Time
                    </div>
                    <div className="text-4xl font-bold text-gray-800 mb-2">
                      3.2 <span className="text-lg font-semibold">Days</span>
                    </div>
                    <p className="text-sm text-gray-500 max-w-xs">
                      Average time taken to resolve dependencies & waiting
                      blockers across all active projects.
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-blue-200/50">
                    <span className="text-xs text-gray-500">Last 30 days</span>
                    <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                      ↓ 12% Improved
                    </span>
                  </div>

                  <Clock
                    className="absolute top-6 right-6 text-blue-200"
                    size={26}
                  />
                </div>
                <div className="bg-amber-50 p-8 rounded-2xl relative min-h-[220px] flex flex-col justify-between flex-1">
                  <div>
                    <div className="text-sm text-amber-600 font-semibold mb-2">
                      Most Affected Dept
                    </div>
                    <div className="text-4xl font-bold text-gray-800 mb-2">
                      Design
                    </div>
                    <p className="text-sm text-gray-500 max-w-xs">
                      Highest number of delays caused due to approvals,
                      revisions, or client feedback loops.
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-amber-200/50">
                    <span className="text-xs text-gray-500">
                      Impacted Projects
                    </span>
                    <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
                      12 Projects
                    </span>
                  </div>

                  <AlertCircle
                    className="absolute top-6 right-6 text-amber-200"
                    size={26}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CoOrdinatorDashboard;
