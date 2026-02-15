import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { 
  ArrowLeft, Phone, Mail, Star, TrendingUp, Calendar, Clock, Award, 
  BarChart3, CheckCircle2, MapPin, Briefcase, Target, AlertCircle,
  FileText, Activity, Users, Settings, Download, MoreVertical,
  ChevronRight, DollarSign
} from "lucide-react";

const ManagerProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [manager, setManager] = useState(location.state?.manager || null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!manager && id) {
      setManager({
        _id: id,
        name: "Executive Name",
        empId: `MG-${id}`,
        phone: "0000000000",
        branch: "Unknown",
        attendance: "Present",
        currentDesigns: 0,
        performance: 0,
      });
    }
  }, [id, manager]);

  if (!manager) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="text-gray-500 text-lg">Loading Executive profile...</span>
      </div>
    );
  }

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
        activeTab === id
          ? "bg-blue-600 text-white shadow-sm"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Executive Profile</h1>
                <p className="text-xs text-gray-500">Quotation Executive Profile</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2">
                <Download size={16} />
                Export
              </button>
              <button className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Edit Profile
              </button>
              
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Left Sidebar - Profile Summary */}
        <div className="w-80 bg-white border-r border-gray-200 min-h-screen p-6">
          {/* Profile Card */}
          <div className="text-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white font-bold text-3xl">
                {manager?.name
                  ? manager.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
                  : "MG"}
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              {manager.name || "Rajesh Kumar"}
            </h2>
            <p className="text-sm text-gray-600 mb-3">Quotation Executive Profile</p>
            <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Active
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-start gap-3">
              <Mail className="text-gray-400 mt-0.5" size={16} />
              <div>
                <p className="text-xs text-gray-500 mb-1">Email</p>
                <p className="text-sm text-gray-900">rajeshkumar@dss.com</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="text-gray-400 mt-0.5" size={16} />
              <div>
                <p className="text-xs text-gray-500 mb-1">Phone</p>
                <p className="text-sm text-gray-900">9876543210</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="text-gray-400 mt-0.5" size={16} />
              <div>
                <p className="text-xs text-gray-500 mb-1">Region</p>
                <p className="text-sm text-gray-900">Central Region</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Briefcase className="text-gray-400 mt-0.5" size={16} />
              <div>
                <p className="text-xs text-gray-500 mb-1">Employee ID</p>
                <p className="text-sm text-gray-900">MG-2024-458</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Quick Stats
            </h3>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Target className="text-blue-600" size={16} />
                <span className="text-sm text-gray-700">Total Tasks</span>
              </div>
              <span className="text-lg font-bold text-blue-600">32</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-green-600" size={16} />
                <span className="text-sm text-gray-700">Completed</span>
              </div>
              <span className="text-lg font-bold text-green-600">20</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="text-yellow-600" size={16} />
                <span className="text-sm text-gray-700">Pending</span>
              </div>
              <span className="text-lg font-bold text-yellow-600">4</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Star className="text-purple-600" size={16} />
                <span className="text-sm text-gray-700">Rating</span>
              </div>
              <span className="text-lg font-bold text-purple-600">4.8</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6">
          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex items-center gap-2 overflow-x-auto">
              <TabButton id="overview" label="Overview" icon={BarChart3} />
              <TabButton id="activity" label="Activity" icon={Activity} />
              <TabButton id="tasks" label="Tasks" icon={FileText} />
              <TabButton id="performance" label="Performance" icon={Award} />
              <TabButton id="attendance" label="Attendance" icon={Calendar} />
            </div>
          </div>

          {/* Overview Tab Content */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Key Metrics Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="text-blue-600" size={20} />
                    </div>
                    <span className="text-xs font-semibold text-green-600">+12%</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">38</h3>
                  <p className="text-sm text-gray-600">Monthly Output</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle2 className="text-green-600" size={20} />
                    </div>
                    <span className="text-xs font-semibold text-gray-500">96%</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">28</h3>
                  <p className="text-sm text-gray-600">Reports Submitted</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <TrendingUp className="text-purple-600" size={20} />
                    </div>
                    <span className="text-xs font-semibold text-green-600">+8%</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">62.5%</h3>
                  <p className="text-sm text-gray-600">Completion Rate</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Users className="text-yellow-600" size={20} />
                    </div>
                    <div className="flex items-center gap-0.5">
                      <Star className="text-yellow-500" size={12} fill="currentColor" />
                      <Star className="text-yellow-500" size={12} fill="currentColor" />
                      <Star className="text-yellow-500" size={12} fill="currentColor" />
                      <Star className="text-yellow-500" size={12} fill="currentColor" />
                      <Star className="text-yellow-500" size={12} fill="currentColor" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">4.8</h3>
                  <p className="text-sm text-gray-600">Client Feedback</p>
                </div>
              </div>

              {/* Active Tasks & Schedule */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Active Tasks - 2 columns */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">Active Quotation Tasks</h3>
                      <p className="text-xs text-gray-500 mt-0.5">8 tasks in progress</p>
                    </div>
                    <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                      View All
                    </button>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {[
                      { project: "Mall Signage", client: "Sharma Corp", location: "Connaught Place", progress: 75, status: "In Progress", priority: "High" },
                      { project: "Retail Store", client: "Fashion Hub", location: "Saket", progress: 40, status: "Pending", priority: "Medium" },
                      { project: "Office Complex", client: "Tech Solutions", location: "Noida", progress: 90, status: "Final Review", priority: "Low" },
                    ].map((item, i) => (
                      <div key={i} className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900">{item.project}</h4>
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                item.priority === "High" ? "bg-red-100 text-red-700" :
                                item.priority === "Medium" ? "bg-yellow-100 text-yellow-700" :
                                "bg-gray-100 text-gray-700"
                              }`}>
                                {item.priority}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-600">
                              <span className="flex items-center gap-1">
                                <Users size={12} />
                                {item.client}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin size={12} />
                                {item.location}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="text-gray-400" size={20} />
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                item.progress >= 70 ? "bg-green-500" :
                                item.progress >= 40 ? "bg-blue-500" :
                                "bg-yellow-500"
                              }`}
                              style={{ width: `${item.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold text-gray-700 w-12 text-right">
                            {item.progress}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Today's Schedule - 1 column */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">Today's Schedule</h3>
                    <p className="text-xs text-gray-500 mt-0.5">28 January 2026</p>
                  </div>
                  <div className="p-6 space-y-4">
                    {[
                      { time: "10:00 AM", project: "Corporate Signage", location: "DLF Cyber City", priority: "High" },
                      { time: "02:00 PM", project: "LED Display Setup", location: "Select City Walk", priority: "Medium" },
                      { time: "04:30 PM", project: "Client Meeting", location: "Connaught Place", priority: "Low" },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                            {item.time.split(' ')[0]}
                          </div>
                          {i < 2 && <div className="w-0.5 h-8 bg-gray-200 my-1"></div>}
                        </div>
                        <div className="flex-1 pb-3">
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="text-sm font-semibold text-gray-900">{item.project}</h4>
                            <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                              item.priority === "High" ? "bg-red-100 text-red-700" :
                              item.priority === "Medium" ? "bg-yellow-100 text-yellow-700" :
                              "bg-gray-100 text-gray-700"
                            }`}>
                              {item.priority}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 flex items-center gap-1">
                            <MapPin size={12} />
                            {item.location}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Performance & Monthly Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance Metrics */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900">Performance Review</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Based on recent evaluations</p>
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: "Site Assessment", score: 9.2, color: "green" },
                      { label: "Report Quality", score: 8.8, color: "green" },
                      { label: "Time Management", score: 7.5, color: "blue" },
                      { label: "Client Interaction", score: 9.0, color: "green" },
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">{item.label}</span>
                          <span className="text-sm font-bold text-gray-900">{item.score}/10</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              item.color === "green" ? "bg-green-500" : "bg-blue-500"
                            }`}
                            style={{ width: `${(item.score / 10) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Overall Score</span>
                    <span className="text-3xl font-bold text-green-600">8.6</span>
                  </div>
                </div>

                {/* Monthly Output Chart */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900">Monthly Output</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Quotations completed per month</p>
                  </div>
                  <div className="h-64 flex items-end justify-between gap-2">
                    {[
                      { month: "Jan", value: 65 },
                      { month: "Feb", value: 78 },
                      { month: "Mar", value: 55 },
                      { month: "Apr", value: 85 },
                      { month: "May", value: 72 },
                      { month: "Jun", value: 90 },
                    ].map((item, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center h-full justify-end group">
                        <div
                          className="w-full bg-blue-600 rounded-t-lg hover:bg-blue-700 transition-colors cursor-pointer relative"
                          style={{ height: `${(item.value / 100) * 100}%` }}
                        >
                          <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {item.value}
                          </span>
                        </div>
                        <span className="text-xs text-gray-600 font-medium mt-2">{item.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Attendance */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">Recent Attendance</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Last 7 days</p>
                  </div>
                  <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                    View Full Report
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Check In</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Check Out</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Hours</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        { date: "27 Jan 2026", checkIn: "9:00 AM", checkOut: "6:15 PM", hours: "9.2", status: "Excellent", color: "green" },
                        { date: "26 Jan 2026", checkIn: "9:15 AM", checkOut: "6:00 PM", hours: "8.8", status: "Good", color: "blue" },
                        { date: "25 Jan 2026", checkIn: "9:05 AM", checkOut: "5:50 PM", hours: "8.8", status: "Good", color: "blue" },
                      ].map((item, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.date}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{item.checkIn}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{item.checkOut}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">{item.hours} Hrs</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.color === "green" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Activity Tab Placeholder */}
          {activeTab === "activity" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <Activity className="mx-auto text-gray-400 mb-3" size={48} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Activity Timeline</h3>
              <p className="text-sm text-gray-600">Activity feed content coming soon</p>
            </div>
          )}

          {/* Other tabs placeholders */}
          {activeTab !== "overview" && activeTab !== "activity" && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <FileText className="mx-auto text-gray-400 mb-3" size={48} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h3>
              <p className="text-sm text-gray-600">Content for this section coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerProfile;