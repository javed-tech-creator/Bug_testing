import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, Phone, Mail, Star } from "lucide-react";

const ExecutiveProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [executive, setExecutive] = useState(location.state?.executive || null);

  useEffect(() => {
    // If executive not passed in state, fetch by id (simulate fetch here)
    if (!executive && id) {
      // TODO: Replace with real API call
      // Example: fetch(`/api/executives/${id}`).then(...)
      // For now, use dummy data
      setExecutive({
        _id: id,
        name: "Executive Name",
        empId: `EX-${id}`,
        phone: "0000000000",
        branch: "Unknown",
        attendance: "Present",
        currentDesigns: 0,
        performance: 0,
      });
    }
  }, [id, executive]);

  // --- Reusable Components for the Profile Page ---

  // 1. Stats Card Component
  const StatsCard = ({ title, value, colorClass, borderColorClass }) => (
    <div
      className={`${colorClass} p-4 rounded-lg border-t-4 ${borderColorClass} shadow-sm text-center`}
    >
      <p className="text-gray-700 text-sm font-medium mb-1">{title}</p>
      <h3
        className={`text-2xl font-bold ${borderColorClass.replace("border-", "text-")}`}
      >
        {value}
      </h3>
    </div>
  );

  // 2. Progress Bar Component
  const ProgressBar = ({ label, percentage, color = "bg-blue-600" }) => (
    <div className="mb-4">
      <div className="flex justify-between text-xs font-medium mb-1 text-gray-700">
        <span>{label}</span>
        <span>{percentage}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );

  if (!executive) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-gray-500 text-lg">
          Loading executive profile...
        </span>
      </div>
    );
  }

  return (
    <div className="">
      {/* --- Profile Header --- */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center border-2 border-blue-100">
            <span className="text-white font-bold text-xl">
              {executive?.name
                ? executive.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                : "EX"}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {executive.name || "Rajesh Kumar"}
            </h1>
            <p className="text-gray-500 text-sm mb-1">
              Recce Executive - Central Region
            </p>
            <div className="flex gap-4 text-xs text-gray-500 font-medium">
              <span className="flex items-center gap-1">
                <Phone size={12} /> 9876543210
              </span>
              <span className="flex items-center gap-1">
                <Mail size={12} /> rajeshkumar@dss.com
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <button className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded shadow-sm hover:bg-green-600">
            Export Full Report
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded shadow-sm hover:bg-blue-700"
          >
            Back to Manager's List
          </button>
        </div>
      </div>

      {/* --- Key Metrics Grid (2 Rows) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Row 1 */}
        <StatsCard
          title="Total Recce Tasks"
          value="32"
          colorClass="bg-blue-50"
          borderColorClass="border-blue-500"
        />
        <StatsCard
          title="Completed Recce"
          value="20"
          colorClass="bg-green-50"
          borderColorClass="border-green-500"
        />
        <StatsCard
          title="Active Recce"
          value="8"
          colorClass="bg-blue-50"
          borderColorClass="border-blue-500"
        />
        <StatsCard
          title="Pending Recce"
          value="4"
          colorClass="bg-yellow-50"
          borderColorClass="border-yellow-400"
        />

        {/* Row 2 */}
        <StatsCard
          title="Sites Visited"
          value="45 Sites"
          colorClass="bg-purple-50"
          borderColorClass="border-purple-500"
        />
        <StatsCard
          title="Monthly Output"
          value="38 Recce"
          colorClass="bg-indigo-50"
          borderColorClass="border-indigo-500"
        />
        <StatsCard
          title="Reports Submitted"
          value="28 Reports"
          colorClass="bg-teal-50"
          borderColorClass="border-teal-500"
        />
        <div className="bg-yellow-50 p-4 rounded-lg border-t-4 border-yellow-400 shadow-sm text-center">
          <p className="text-gray-700 text-sm font-medium mb-1">
            Client Feedback
          </p>
          <div className="flex justify-center items-center gap-1 text-yellow-600">
            <Star size={20} fill="currentColor" />
            <h3 className="text-2xl font-bold">4.8 / 5.0</h3>
          </div>
        </div>
      </div>

      {/* --- Active Recce Tasks Section --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
        <div className="px-6 py-4 flex justify-between items-center border-b border-gray-200">
          <h3 className="font-bold text-gray-800">Active Recce Tasks</h3>
          <a
            href="#"
            className="text-blue-600 text-xs font-semibold hover:underline"
          >
            View All
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="px-6 py-3 text-left border border-gray-700">
                  Project Name
                </th>
                <th className="px-6 py-3 text-left border border-gray-700">
                  Client
                </th>
                <th className="px-6 py-3 text-left border border-gray-700">
                  Location
                </th>
                <th className="px-6 py-3 text-left border border-gray-700">
                  Visit Date
                </th>
                <th className="px-6 py-3 text-left w-1/3 border border-gray-700">
                  Progress
                </th>
                <th className="px-6 py-3 text-left border border-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  project: "Mall Signage",
                  client: "Sharma Corp",
                  location: "Connaught Place",
                  date: "15 Nov 25",
                  progress: 75,
                  status: "In Progress",
                },
                {
                  project: "Retail Store",
                  client: "Fashion Hub",
                  location: "Saket",
                  date: "16 Nov 25",
                  progress: 40,
                  status: "Pending",
                },
                {
                  project: "Office Complex",
                  client: "Tech Solutions",
                  location: "Noida",
                  date: "17 Nov 25",
                  progress: 90,
                  status: "Final Review",
                },
              ].map((item, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium border border-gray-200">
                    {item.project}
                  </td>
                  <td className="px-6 py-3 text-gray-600 border border-gray-200">
                    {item.client}
                  </td>
                  <td className="px-6 py-3 text-gray-600 border border-gray-200">
                    {item.location}
                  </td>
                  <td className="px-6 py-3 text-gray-600 border border-gray-200">
                    {item.date}
                  </td>
                  <td className="px-6 py-3 border border-gray-200">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-gray-500">
                        {item.progress}%
                      </span>
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full">
                        <div
                          className={`h-full ${item.progress >= 70 ? "bg-green-500" : item.progress >= 40 ? "bg-blue-500" : "bg-yellow-500"} rounded-full`}
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 border border-gray-200">
                    <span
                      className={`${item.status === "In Progress" ? "text-blue-600" : item.status === "Pending" ? "text-orange-500" : "text-green-600"} font-bold text-xs`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Today's Recce Schedule --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
        <div className="px-6 py-4 flex justify-between items-center border-b border-gray-200">
          <h3 className="font-bold text-gray-800">Today's Recce Schedule</h3>
          <a
            href="#"
            className="text-blue-600 text-xs font-semibold hover:underline"
          >
            View All
          </a>
        </div>
        <table className="w-full text-sm border-collapse">
          <thead className="bg-black text-white">
            <tr>
              <th className="px-6 py-3 text-left border border-gray-700">
                Site Type
              </th>
              <th className="px-6 py-3 text-left border border-gray-700">
                Project
              </th>
              <th className="px-6 py-3 text-left border border-gray-700">
                Scheduled Time
              </th>
              <th className="px-6 py-3 text-left border border-gray-700">
                Priority
              </th>
              <th className="px-6 py-3 text-left border border-gray-700">
                Address
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-3 font-medium border border-gray-200">
                Commercial Building
              </td>
              <td className="px-6 py-3 text-gray-600 border border-gray-200">
                Corporate Signage
              </td>
              <td className="px-6 py-3 text-gray-600 border border-gray-200">
                28 Jan 26, 10:00 AM
              </td>
              <td className="px-6 py-3 border border-gray-200">
                <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-bold border border-red-200">
                  High
                </span>
              </td>
              <td className="px-6 py-3 text-gray-600 border border-gray-200">
                DLF Cyber City, Gurgaon
              </td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-3 font-medium border border-gray-200">
                Shopping Mall
              </td>
              <td className="px-6 py-3 text-gray-600 border border-gray-200">
                LED Display Setup
              </td>
              <td className="px-6 py-3 text-gray-600 border border-gray-200">
                28 Jan 26, 02:00 PM
              </td>
              <td className="px-6 py-3 border border-gray-200">
                <span className="bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded text-xs font-bold border border-yellow-200">
                  Medium
                </span>
              </td>
              <td className="px-6 py-3 text-gray-600 border border-gray-200">
                Select City Walk, Saket
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* --- Charts Section --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recce Output Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-bold text-gray-800 mb-4">
            Recce Output (Monthly)
          </h3>
          <div className="h-64 w-full bg-gradient-to-b from-blue-50 to-white relative rounded-lg border border-gray-200 flex items-end overflow-hidden p-4">
            {/* Bar Chart */}
            <div className="flex items-end justify-between w-full h-full gap-2">
              {[
                { month: "Jan", value: 65 },
                { month: "Feb", value: 78 },
                { month: "Mar", value: 55 },
                { month: "Apr", value: 85 },
                { month: "May", value: 72 },
                { month: "Jun", value: 90 },
                { month: "Jul", value: 68 },
                { month: "Aug", value: 74 },
                { month: "Sep", value: 81 },
                { month: "Oct", value: 69 },
                { month: "Nov", value: 88 },
                { month: "Dec", value: 76 },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center justify-end h-full"
                >
                  <div
                    className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t hover:from-blue-700 hover:to-blue-500 transition-all duration-300 shadow-lg relative group"
                    style={{ height: `${item.value}%` }}
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.value}
                    </span>
                  </div>
                  <span className="text-xs text-gray-600 font-medium mt-2">
                    {item.month}
                  </span>
                </div>
              ))}
            </div>
            {/* Grid lines */}
            <div className="absolute inset-0 grid grid-rows-5 w-full h-full pointer-events-none p-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="border-b border-gray-200 border-dashed w-full"
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Sites Visited by Type */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-bold text-gray-800 mb-4">
            Sites Visited by Type
          </h3>
          <div className="space-y-4">
            <ProgressBar
              label="Commercial Buildings"
              percentage={85}
              color="bg-blue-600"
            />
            <ProgressBar
              label="Shopping Malls"
              percentage={72}
              color="bg-purple-600"
            />
            <ProgressBar
              label="Retail Stores"
              percentage={65}
              color="bg-green-600"
            />
            <ProgressBar
              label="Residential Complex"
              percentage={48}
              color="bg-yellow-600"
            />
            <ProgressBar
              label="Industrial Sites"
              percentage={35}
              color="bg-orange-600"
            />
            <ProgressBar
              label="Healthcare Facilities"
              percentage={28}
              color="bg-pink-600"
            />
          </div>
        </div>
      </div>

      {/* --- Bottom Row: Attendance & Feedback --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Insights */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 flex justify-between items-center border-b border-gray-200">
            <h3 className="font-bold text-gray-800 text-sm">
              Attendance Insights
            </h3>
            <a href="#" className="text-blue-600 text-xs font-semibold">
              View All
            </a>
          </div>
          <table className="w-full text-xs border-collapse">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-4 py-2 text-left border border-gray-700">
                  Date
                </th>
                <th className="px-4 py-2 text-left border border-gray-700">
                  Check In
                </th>
                <th className="px-4 py-2 text-left border border-gray-700">
                  Check Out
                </th>
                <th className="px-4 py-2 text-left border border-gray-700">
                  Hrs.
                </th>
                <th className="px-4 py-2 text-left border border-gray-700">
                  Remark
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-2.5 border border-gray-200">27-01-26</td>
                <td className="px-4 py-2.5 border border-gray-200">9:00 AM</td>
                <td className="px-4 py-2.5 border border-gray-200">6:15 PM</td>
                <td className="px-4 py-2.5 border border-gray-200">9.2 Hrs</td>
                <td className="px-4 py-2.5 text-green-600 font-medium border border-gray-200">
                  Excellent
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-2.5 border border-gray-200">26-01-26</td>
                <td className="px-4 py-2.5 border border-gray-200">9:15 AM</td>
                <td className="px-4 py-2.5 border border-gray-200">6:00 PM</td>
                <td className="px-4 py-2.5 border border-gray-200">8.8 Hrs</td>
                <td className="px-4 py-2.5 text-blue-600 font-medium border border-gray-200">
                  Good
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-4 py-2.5 border border-gray-200">25-01-26</td>
                <td className="px-4 py-2.5 border border-gray-200">9:05 AM</td>
                <td className="px-4 py-2.5 border border-gray-200">5:50 PM</td>
                <td className="px-4 py-2.5 border border-gray-200">8.8 Hrs</td>
                <td className="px-4 py-2.5 text-blue-600 font-medium border border-gray-200">
                  Good
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Feedback & Review */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-bold text-gray-800 mb-4 text-sm">
            Feedback & Review
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-4 text-xs">
              <span className="w-28 font-medium text-gray-600">
                Site Assessment
              </span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full">
                <div className="w-[92%] h-full bg-green-500 rounded-full"></div>
              </div>
              <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">
                9.2
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="w-28 font-medium text-gray-600">
                Report Quality
              </span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full">
                <div className="w-[88%] h-full bg-green-500 rounded-full"></div>
              </div>
              <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">
                8.8
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="w-28 font-medium text-gray-600">
                Time Management
              </span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full">
                <div className="w-[75%] h-full bg-blue-500 rounded-full"></div>
              </div>
              <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">
                7.5
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="w-28 font-medium text-gray-600">
                Client Interaction
              </span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full">
                <div className="w-[90%] h-full bg-green-500 rounded-full"></div>
              </div>
              <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">
                9.0
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveProfile;
