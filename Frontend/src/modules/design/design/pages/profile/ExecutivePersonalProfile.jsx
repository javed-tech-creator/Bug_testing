import React from "react";
import { Phone, Mail, Star } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import PaymentProjectCharts from "../../components/manager-profile/PaymentProjectCharts";
import DesignProfile from "../../components/manager-profile/DesignProfile";
import { useNavigate } from "react-router-dom";

export default function ExecutivePersonalProfile() {
  const navigate = useNavigate();
  const stats = [
    {
      title: "Total Designs",
      value: 28,
      bg: "bg-blue-100",
      border: "border-blue-500",
      text: "text-blue-600",
    },
    {
      title: "Completed Designs",
      value: 16,
      bg: "bg-green-100",
      border: "border-green-500",
      text: "text-green-600",
    },
    {
      title: "Active Designs",
      value: 9,
      bg: "bg-blue-50",
      border: "border-blue-600",
      text: "text-blue-600",
    },
    {
      title: "Pending Modifications",
      value: 5,
      bg: "bg-yellow-50",
      border: "border-yellow-500",
      text: "text-yellow-600",
    },
    {
      title: "Rejected Designs",
      value: "08 Designs",
      bg: "bg-red-50",
      border: "border-red-500",
      text: "text-red-600",
    },
    {
      title: "Monthly Output",
      value: "42 Designs",
      bg: "bg-purple-100",
      border: "border-purple-500",
      text: "text-purple-600",
    },
    {
      title: "Flag Raised Designs",
      value: "6 Designs",
      bg: "bg-red-50",
      border: "border-red-600",
      text: "text-red-600",
    },
    {
      title: "Client Feedback",
      value: "⭐ 4.7 / 10",
      bg: "bg-yellow-50",
      border: "border-yellow-500",
      text: "text-yellow-600",
    },
  ];

  const teamMembers = [
    {
      name: "Ananya Verma",
      role: "Graphics Designer",
      active: 9,
      completed: 16,
      rating: 4.7,
    },
    {
      name: "Deepak Patel",
      role: "3D Artist",
      active: 7,
      completed: 13,
      rating: 3.7,
    },
    {
      name: "Riya Joshi",
      role: "UI/UX Designer",
      active: 6,
      completed: 12,
      rating: 4.8,
    },
  ];

  const branchData = [
    { name: "Barabanki", value: -10 },
    { name: "Azamgarh", value: 20 },
    { name: "Chinhat", value: 40 },
  ];

  const performers = [
    {
      branch: "Lucknow",
      totalProjects: 43,
      designers: 3,
      target: 50,
      achievement: 33,
      topPerformer: "Rohan Patel",
      color: "bg-green-500",
    },
    {
      branch: "Chinhat",
      totalProjects: 62,
      designers: 2,
      target: 40,
      achievement: 55,
      topPerformer: "Suresh Kumar",
      color: "bg-yellow-500",
    },
    {
      branch: "Azamgarh",
      totalProjects: 58,
      designers: 3,
      target: 45,
      achievement: 95,
      topPerformer: "Pooja Singh",
      color: "bg-green-500",
    },
  ];
  const waitingDesigns = [
    {
      project: "Luxe Interiors",
      client: "Rajesh Sharma",
      product: "Brochure",
      deadline: "11 Nov 25",
      progress: 80,
      status: "Waiting",
    },
    {
      project: "ABC Signage",
      client: "Komal Jain",
      product: "Branding",
      deadline: "8 Nov 25",
      progress: 100,
      status: "Waiting",
    },
    {
      project: "Bright Homes",
      client: "Anita Patel",
      product: "3D Layout",
      deadline: "12 Nov 26",
      progress: 65,
      status: "Waiting",
    },
  ];

  const todaysTimeline = [
    {
      product: "Flex Sign Board",
      project: "Retails Store Signage",
      received: "11 Nov 25, 10:30AM",
      priority: "High",
      deadline: "11 Nov 25, 11:30AM",
    },
    {
      product: "LED Channel Letter Signage",
      project: "Mall Facade Design's",
      received: "11 Nov 25, 10:30AM",
      priority: "High",
      deadline: "11 Nov 25, 11:30AM",
    },
    {
      product: "Acrylic Sign Board",
      project: "Office Branding Survey",
      received: "11 Nov 25, 10:30AM",
      priority: "Medium",
      deadline: "11 Nov 25, 11:30AM",
    },
  ];

  const monthlyOutput = [
    { month: "Jan", value: 50 },
    { month: "Feb", value: 100 },
    { month: "Mar", value: 80 },
    { month: "Apr", value: 150 },
    { month: "May", value: 120 },
    { month: "Jun", value: 200 },
    { month: "Jul", value: 250 },
  ];

  const toolsUsage = [
    { name: "Adobe Illustrator", percent: 96 },
    { name: "Photoshop", percent: 70 },
    { name: "Figma", percent: 60 },
    { name: "Blender", percent: 40 },
    { name: "Canva", percent: 30 },
    { name: "AutoCAD", percent: 50 },
  ];

  const getAchievementColor = (value) => {
    if (value >= 80) return "bg-green-500";
    if (value >= 50) return "bg-yellow-400";
    return "bg-red-500";
  };

  const clients = [
    {
      client: "ABC Builders",
      executive: "Suresh Kumar",
      project: "Brochure",
      stage: "Review",
      status: "Pending",
      lastUpdate: "10 Nov 2025",
    },
    {
      client: "Bright Interiors",
      executive: "Komal Jain",
      project: "UI Design",
      stage: "Revision",
      status: "Ongoing",
      lastUpdate: "9 Nov 2025",
    },
    {
      client: "DecorZone",
      executive: "Rohan Patel",
      project: "3D Layout",
      stage: "Completed",
      status: "Approved",
      lastUpdate: "8 Nov 2025",
    },
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-400 text-black";
      case "Ongoing":
        return "bg-teal-500 text-white";
      case "Approved":
        return "bg-green-600 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 -mt-2">
      <div className="max-w-8xl mx-auto">
        {/* Header Section */}
        <div className="bg-white shadow-sm py-4 px-6 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
                alt="Priya Nair"
                className="w-28 h-28 rounded-full object-cover border-4 border-gray-200"
              />
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Priya Nair
                </h1>
                <p className="text-lg text-gray-600 mb-3">
                  Design Executive – Central Region
                </p>
                <div className="flex items-center gap-4 text-gray-700">
                  <div className="flex items-center gap-2 font-semibold text-gray-900">
                    <Phone className="w-4 h-4" />
                    <span>0987654321</span>
                  </div>
                  <div className="flex items-center gap-2 font-semibold text-gray-900">
                    <Mail className="w-4 h-4" />
                    <span>Priyanair@dss.com</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-sm transition-colors">
                Export Full Report
              </button>
              <button
                onClick={() => navigate(-1)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-sm transition-colors"
              >
                Back to Manager's List
              </button>
            </div>
          </div>
        </div>
        <div className="px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-4">
            {stats.map((item, index) => (
              <div
                key={index}
                className={`${item.bg} border-2 ${item.border} rounded-sm p-6 text-center`}
              >
                <h3 className="text-md font-semibold text-gray-800 mb-2">
                  {item.title}
                </h3>
                <p className={`text-xl font-bold ${item.text}`}>{item.value}</p>
              </div>
            ))}
          </div>

          {/* ================= Waiting Designs ================= */}
          <div className="bg-white p-5 rounded-md shadow border-2 border-gray-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Waiting Designs</h2>
              <button className="text-blue-600 font-medium hover:underline">
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-900 text-white text-left">
                    <th className="p-3 border border-gray-600">Project Name</th>
                    <th className="p-3 border border-gray-600">Client</th>
                    <th className="p-3 border border-gray-600">Products</th>
                    <th className="p-3 border border-gray-600">Deadline</th>
                    <th className="p-3 border border-gray-600">Progress</th>
                    <th className="p-3 border border-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {waitingDesigns.map((item, i) => (
                    <tr key={i}>
                      <td className="p-3 border border-gray-400">
                        {item.project}
                      </td>
                      <td className="p-3 border border-gray-400">
                        {item.client}
                      </td>
                      <td className="p-3 border border-gray-400">
                        {item.product}
                      </td>
                      <td className="p-3 border border-gray-400">
                        {item.deadline}
                      </td>
                      <td className="p-3 border border-gray-400">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium">
                            {item.progress}%
                          </span>
                          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-3 border border-gray-400 text-orange-500 font-semibold">
                        {item.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ================= Today's Design Timeline ================= */}
          <div className="bg-white p-5 rounded-md shadow mt-4 border-2 border-gray-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Todays Design Timeline</h2>
              <button className="text-blue-600 font-medium hover:underline">
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-900 text-white text-left">
                    <th className="p-3 border border-gray-600">Product</th>
                    <th className="p-3 border border-gray-600">Projects</th>
                    <th className="p-3 border border-gray-600">
                      Received Date
                    </th>
                    <th className="p-3 border border-gray-600">Priority (T)</th>
                    <th className="p-3 border border-gray-600">Deadline</th>
                  </tr>
                </thead>
                <tbody>
                  {todaysTimeline.map((item, i) => {
                    const isHigh = item.priority === "High";
                    return (
                      <tr key={i}>
                        <td className="p-3 border border-gray-400">
                          {item.product}
                        </td>
                        <td className="p-3 border border-gray-400">
                          {item.project}
                        </td>
                        <td className="p-3 border border-gray-400">
                          {item.received}
                        </td>
                        <td className="p-3 border border-gray-400">
                          <span
                            className={`px-3 py-1 rounded text-sm font-semibold ${
                              isHigh
                                ? "bg-red-100 text-red-600"
                                : "bg-yellow-100 text-yellow-600"
                            }`}
                          >
                            {item.priority}
                          </span>
                        </td>
                        <td className="p-3 border border-gray-400">
                          {item.deadline}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 mt-4 md:grid-cols-3 gap-6 ">
            {/* ================= Design Output ================= */}
            <div className="md:col-span-2 bg-white p-5 rounded-md shadow border-2 border-gray-300">
              <h2 className="text-xl font-semibold mb-4">
                Design Output (Monthly)
              </h2>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyOutput}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#2563eb"
                      fill="#93c5fd"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ================= Tools Usage ================= */}
            <div className="bg-white p-5 rounded-md shadow border-2 border-gray-300">
              <h2 className="text-xl font-semibold mb-6">Tools Usage</h2>

              <div className="space-y-5">
                {toolsUsage.map((tool, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1 font-medium">
                      <span>{tool.name}</span>
                      <span>{tool.percent}%</span>
                    </div>

                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${tool.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DesignProfile />
        </div>
      </div>
    </div>
  );
}
