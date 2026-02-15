import React, { useState } from "react";
import Chart from "react-apexcharts";
import {
  Phone,
  Mail,
  ChevronDown,
  MoreHorizontal,
  Calendar,
  CheckCircle,
  MapPin,
  Users,
  Filter,
  Download,
} from "lucide-react";

const ManagerDashboard = () => {
  // --- MOCK DATA ---

  const metrics = [
    {
      label: "Monthly Sales",
      value: "₹2.2 Cr",
      bg: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-200",
    },
    {
      label: "Team Achievement",
      value: "85%",
      bg: "bg-green-50",
      text: "text-green-600",
      border: "border-green-200",
    },
    {
      label: "Total Leads",
      value: "920",
      bg: "bg-yellow-50",
      text: "text-yellow-600",
      border: "border-yellow-200",
    },
    {
      label: "Client Satisfaction",
      value: "4.6 / 10",
      bg: "bg-red-50",
      text: "text-red-500",
      border: "border-red-200",
    },
    {
      label: "Deals Closed",
      value: "406",
      bg: "bg-green-50",
      text: "text-green-600",
      border: "border-green-200",
    },
    {
      label: "Follow-Ups Pending",
      value: "105",
      bg: "bg-purple-50",
      text: "text-purple-600",
      border: "border-purple-200",
    },
    {
      label: "Monthly Incentive",
      value: "10.8K",
      bg: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-200",
    },
    {
      label: "Active Executives",
      value: "24",
      bg: "bg-yellow-50",
      text: "text-yellow-600",
      border: "border-yellow-200",
    },
  ];

  const teamOverview = [
    {
      name: "Suresh Kumar",
      branch: "Chinnhat",
      sales: "₹1.2 Cr",
      target: "85%",
      deals: 46,
      feedback: "4.6",
      status: "Active",
    },
    {
      name: "Pooja Singh",
      branch: "Azamgarh",
      sales: "₹0.9 Cr",
      target: "91%",
      deals: 38,
      feedback: "4.8",
      status: "Active",
    },
    {
      name: "Rohan Patel",
      branch: "Lucknow",
      sales: "₹1.5 Cr",
      target: "95%",
      deals: 52,
      feedback: "4.7",
      status: "Active",
    },
  ];

  const branchPerformance = [
    {
      branch: "Lucknow",
      execs: 3,
      sales: "₹2.8 Cr",
      target: "₹3.0 Cr",
      achieve: 93,
      performer: "Rohan Patel",
      color: "bg-green-500",
    },
    {
      branch: "Chinnhat",
      execs: 2,
      sales: "₹2.3 Cr",
      target: "₹2.6 Cr",
      achieve: 88,
      performer: "Suresh Kumar",
      color: "bg-yellow-500",
    },
    {
      branch: "Azamgarh",
      execs: 3,
      sales: "₹1.9 Cr",
      target: "₹2.0 Cr",
      achieve: 95,
      performer: "Pooja Singh",
      color: "bg-green-500",
    },
  ];

  const clientManagement = [
    {
      client: "ABC Builders",
      exec: "Suresh Kumar",
      value: "₹5L",
      stage: "Proposal Sent",
      status: "Pending",
      statusColor: "bg-orange-400",
      date: "10 Nov 25",
    },
    {
      client: "Bright Interiors",
      exec: "Komal Jain",
      value: "₹2.3L",
      stage: "Negotiation",
      status: "Ongoing",
      statusColor: "bg-green-500",
      date: "9 Nov 25",
    },
    {
      client: "DecorZone",
      exec: "Rohan Patel",
      value: "₹3.1L",
      stage: "Closed Won",
      status: "Completed",
      statusColor: "bg-green-600",
      date: "8 Nov 25",
    },
  ];

  const paymentMonitoring = [
    {
      id: "01",
      client: "ABC Builders",
      val: "₹5.0L",
      exec: "Suresh Kumar",
      status: "Pending",
      statusColor: "bg-orange-400",
      date: "10 Nov 25",
    },
    {
      id: "02",
      Dreamline: "Dreamline Interiors",
      val: "₹3.1L",
      exec: "Rohan Patel",
      status: "Cleared",
      statusColor: "bg-green-500",
      date: "9 Nov 25",
    },
    {
      id: "03",
      client: "Elegant Homes",
      val: "₹2.8L",
      exec: "Pooja Singh",
      status: "Partial",
      statusColor: "bg-blue-500",
      date: "8 Nov 25",
    },
  ];

  // --- CHART CONFIGURATIONS ---

  // 1. Sales vs Target (Bar Chart)
  const barChartOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    colors: ["#3b82f6", "#10b981"], // Blue, Green
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        endingShape: "rounded",
        borderRadius: 4,
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ["transparent"] },
    xaxis: {
      categories: [
        "Rohan",
        "Suresh",
        "Pooja",
        "Renu",
        "Rakesh",
        "Suhel",
        "Javed",
      ],
      labels: { style: { colors: "#6b7280" } },
    },
    yaxis: {
      labels: { style: { colors: "#6b7280" }, formatter: (val) => `${val}k` },
    },
    fill: { opacity: 1 },
    legend: { position: "bottom" },
    grid: { show: false },
  };
  const barChartSeries = [
    { name: "Target", data: [14, 17, 6, 16, 12, 17, 21] },
    { name: "Sales", data: [13, 12, 23, 7, 11, 14, 11] },
  ];

  // 2. Monthly Trend (Line Chart)
  const lineChartOptions = {
    chart: { type: "line", toolbar: { show: false }, zoom: { enabled: false } },
    colors: ["#3b82f6", "#10b981"],
    stroke: { curve: "smooth", width: 2 },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      labels: { style: { colors: "#6b7280" } },
    },
    yaxis: {
      labels: {
        style: { colors: "#6b7280" },
        formatter: (val) => `${val / 1000}K`,
      },
      min: 10000,
      max: 60000,
    },
    legend: { position: "bottom" },
    markers: { size: 4 },
    grid: { borderColor: "#f3f4f6" },
  };
  const lineChartSeries = [
    { name: "Targeted", data: [51000, 49000, 50000, 54000, 59000, 55000] },
    { name: "Sales", data: [22000, 25000, 27000, 28000, 29000, 31000] },
  ];

  // 3. Lead Source (Pie Chart)
  const pieChartOptions = {
    labels: ["Campaigns", "Referral", "Direct Visit"],
    colors: ["#6366f1", "#ec4899", "#8b5cf6"], // Indigo, Pink, Purple
    legend: { position: "right", fontSize: "14px", markers: { radius: 12 } },
    dataLabels: { enabled: true, formatter: (val) => `${val.toFixed(0)}%` },
    plotOptions: { pie: { donut: { size: "0%" } } },
  };
  const pieChartSeries = [50, 15, 35];

  // 4. Payment Status (Donut Chart)
  const donutChartOptions = {
    labels: ["Cleared", "Pending", "Partial"],
    colors: ["#22c55e", "#3b82f6", "#eab308"], // Green, Blue, Yellow
    legend: { position: "right", fontSize: "14px", markers: { radius: 12 } },
    dataLabels: { enabled: false },
    plotOptions: { pie: { donut: { size: "65%", labels: { show: false } } } },
    stroke: { show: true, width: 2, colors: ["#fff"] },
  };
  const donutChartSeries = [38.6, 22.5, 30.8];

  return (
    <div className="min-h-screen bg-white p-6 font-sans text-slate-800">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white mb-8">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-gray-100 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              Mr. Satya Prakash
            </h1>
            <p className="text-gray-600 font-medium mb-1">
              Sales Manager - North Zone
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-700 font-medium">
              <span className="flex items-center gap-2">
                <Phone size={14} className="fill-black text-black" /> 0987654321
              </span>
              <span className="flex items-center gap-2">
                <Mail size={14} className="fill-black text-black" />{" "}
                Er.Satya@dss.com
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <button className="px-5 py-2 bg-[#4caf50] hover:bg-green-700 text-white rounded shadow-sm text-sm font-semibold transition-colors">
            Export Full Report
          </button>
          <button className="px-5 py-2 bg-[#3b82f6] hover:bg-blue-600 text-white rounded shadow-sm text-sm font-semibold transition-colors">
            Back to Manager's List
          </button>
        </div>
      </div>

      {/* --- METRICS GRID --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((m, i) => (
          <div
            key={i}
            className={`flex flex-col items-center justify-center py-5 px-2 rounded-lg border ${m.border} ${m.bg}`}
          >
            <p className="text-gray-800 text-sm font-bold mb-1">{m.label}</p>
            <p className={`text-2xl font-bold ${m.text}`}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* --- TOP TABLES SECTION --- */}
      <div className="space-y-6 mb-8">
        {/* Team Overview */}
        <div className="border border-gray-200 rounded-lg bg-white overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center p-4 border-b border-gray-100">
            <h3 className="font-bold text-lg text-gray-900">Team Overview</h3>
            <a
              href="#"
              className="text-blue-500 text-xs font-bold hover:underline"
            >
              View All
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#1f2937] text-white">
                <tr>
                  <th className="p-3 font-medium">Executive</th>
                  <th className="p-3 font-medium">Branch</th>
                  <th className="p-3 font-medium">Monthly Sales</th>
                  <th className="p-3 font-medium">Target Achieved</th>
                  <th className="p-3 font-medium">Deals Closed</th>
                  <th className="p-3 font-medium">Feedback</th>
                  <th className="p-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {teamOverview.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-3 text-gray-700 font-medium">
                      {row.name}
                    </td>
                    <td className="p-3 text-gray-600">{row.branch}</td>
                    <td className="p-3 text-gray-800 font-semibold">
                      {row.sales}
                    </td>
                    <td className="p-3 text-gray-600">{row.target}</td>
                    <td className="p-3 text-gray-600">{row.deals}</td>
                    <td className="p-3 text-gray-600 flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      {row.feedback}
                    </td>
                    <td className="p-3 text-gray-600">{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Branch Performance Overview */}
        <div className="border border-gray-200 rounded-lg bg-white overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center p-4 border-b border-gray-100">
            <h3 className="font-bold text-lg text-gray-900">
              Branch Performance Overview
            </h3>
            <a
              href="#"
              className="text-blue-500 text-xs font-bold hover:underline"
            >
              View All
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#1f2937] text-white">
                <tr>
                  <th className="p-3 font-medium">Branch</th>
                  <th className="p-3 font-medium">Executives</th>
                  <th className="p-3 font-medium">Total Sales</th>
                  <th className="p-3 font-medium">Target</th>
                  <th className="p-3 font-medium w-1/4">Achievement</th>
                  <th className="p-3 font-medium">Top Performer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {branchPerformance.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-3 text-gray-700 font-medium">
                      {row.branch}
                    </td>
                    <td className="p-3 text-gray-600">{row.execs}</td>
                    <td className="p-3 text-gray-800 font-semibold">
                      {row.sales}
                    </td>
                    <td className="p-3 text-gray-600">{row.target}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs w-8">{row.achieve}%</span>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`${row.color} h-2.5 rounded-full`}
                            style={{ width: `${row.achieve}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-gray-600">{row.performer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- CHARTS ROW 1 --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bar Chart */}
        <div className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-gray-900">
              Sales vs Target (Team-Wise)
            </h3>
            <div className="flex items-center text-xs font-medium text-gray-600 border rounded px-2 py-1 bg-gray-50">
              Date <ChevronDown size={12} className="ml-1" />{" "}
              <span className="ml-2 font-bold">his Week</span>
            </div>
          </div>
          <Chart
            options={barChartOptions}
            series={barChartSeries}
            type="bar"
            height={250}
          />
        </div>

        {/* Line Chart */}
        <div className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm">
          <h3 className="font-bold text-lg text-gray-900 mb-4">
            Monthly Performance Trend
          </h3>
          <Chart
            options={lineChartOptions}
            series={lineChartSeries}
            type="line"
            height={250}
          />
        </div>
      </div>

      {/* --- CHARTS ROW 2 --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pie Chart */}
        <div className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm flex flex-col justify-center">
          <h3 className="font-bold text-lg text-gray-900 mb-4">
            Lead Source Distribution
          </h3>
          <Chart
            options={pieChartOptions}
            series={pieChartSeries}
            type="pie"
            height={260}
          />
        </div>

        {/* Donut Chart */}
        <div className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm flex flex-col justify-center">
          <h3 className="font-bold text-lg text-gray-900 mb-4">
            Payment Status Overview
          </h3>
          <Chart
            options={donutChartOptions}
            series={donutChartSeries}
            type="donut"
            height={260}
          />
        </div>
      </div>

      {/* --- BOTTOM TABLES --- */}
      <div className="space-y-6 mb-8">
        {/* Client & Lead Management */}
        <div className="border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm">
          <div className="flex justify-between items-center p-4 border-b border-gray-100">
            <h3 className="font-bold text-lg text-gray-900">
              Client & Lead Management Summary
            </h3>
            <a
              href="#"
              className="text-blue-500 text-xs font-bold hover:underline"
            >
              View All
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#1f2937] text-white">
                <tr>
                  <th className="p-3 font-medium">Client</th>
                  <th className="p-3 font-medium">Executive</th>
                  <th className="p-3 font-medium">Value</th>
                  <th className="p-3 font-medium">Stage</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium">Last Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {clientManagement.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-3 text-gray-600">{row.client}</td>
                    <td className="p-3 text-gray-600">{row.exec}</td>
                    <td className="p-3 text-gray-800 font-medium">
                      {row.value}
                    </td>
                    <td className="p-3 text-gray-600">{row.stage}</td>
                    <td className="p-3">
                      <span
                        className={`text-white text-[10px] px-2 py-0.5 rounded-full ${row.statusColor}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment & Revenue Monitoring */}
        <div className="border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm">
          <div className="flex justify-between items-center p-4 border-b border-gray-100">
            <h3 className="font-bold text-lg text-gray-900">
              Payment & Revenue Monitoring
            </h3>
            <div className="flex gap-2">
              <span className="bg-gray-600 text-white text-[10px] px-2 py-1 rounded font-bold">
                ₹11L Total
              </span>
              <span className="bg-green-600 text-white text-[10px] px-2 py-1 rounded font-bold">
                ₹6L Cleared
              </span>
              <a
                href="#"
                className="text-blue-500 text-xs font-bold hover:underline ml-2 pt-1"
              >
                View All
              </a>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#1f2937] text-white">
                <tr>
                  <th className="p-3 font-medium w-10">#</th>
                  <th className="p-3 font-medium">Client</th>
                  <th className="p-3 font-medium">Invoice Value</th>
                  <th className="p-3 font-medium">Executive</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium">Last Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paymentMonitoring.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="p-3 text-gray-600">{row.id}</td>
                    <td className="p-3 text-gray-600">
                      {row.client || row.Dreamline}
                    </td>
                    <td className="p-3 text-gray-800 font-medium">{row.val}</td>
                    <td className="p-3 text-gray-600">{row.exec}</td>
                    <td className="p-3">
                      <span
                        className={`text-white text-[10px] px-3 py-0.5 rounded-full ${row.statusColor}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- CONTACTS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {["Business Assoc.", "Freelancers", "Contactors"].map((title, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm"
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-gray-800">{title}</h4>
              <span className="bg-[#3b82f6] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                3
              </span>
            </div>
            <div className="space-y-4">
              {["Cheyenne Saris", "Aspen Stanton", "Talan Septimus"].map(
                (name, u) => (
                  <div key={u} className="flex items-center gap-3">
                    <img
                      src={`https://i.pravatar.cc/150?img=${20 + u + i * 5}`}
                      className="w-9 h-9 rounded-full object-cover"
                      alt="User"
                    />
                    <span className="text-sm font-medium text-gray-600">
                      {name}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        ))}
        <div className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-gray-800">Franchise's</h4>
            <span className="bg-[#3b82f6] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              2
            </span>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <img
                src="https://i.pravatar.cc/150?img=65"
                className="w-9 h-9 rounded-full"
                alt=""
              />
              <div>
                <p className="text-sm font-medium text-gray-800">
                  XYZ Signage Solutions
                </p>
                <p className="text-[10px] text-gray-400">Chinnhat - Lucknow</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <img
                src="https://i.pravatar.cc/150?img=66"
                className="w-9 h-9 rounded-full"
                alt=""
              />
              <div>
                <p className="text-sm font-medium text-gray-800">
                  ABC Signage Services
                </p>
                <p className="text-[10px] text-gray-400">
                  Sarai Meer - Azamgarh
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- BOTTOM SECTION --- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Attendance Table */}
        <div className="xl:col-span-2 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
          <div className="flex justify-between items-center p-5 bg-white">
            <h3 className="font-bold text-lg text-gray-900">
              Attendance Insights
            </h3>
            <div className="flex items-center gap-1 text-sm text-gray-500 font-medium cursor-pointer">
              Monthly <ChevronDown size={14} />
            </div>
          </div>
          <table className="w-full text-sm text-left border-t border-gray-100">
            <thead className="bg-[#1f2937] text-white">
              <tr>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Check In</th>
                <th className="p-4 font-medium">Check Out</th>
                <th className="p-4 font-medium">Hrs.</th>
                <th className="p-4 font-medium">Remark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                {
                  date: "10-11-25",
                  in: "9:01 AM",
                  out: "6:01 PM",
                  hrs: "9 Hrs.",
                  remark: "Good",
                  color: "text-orange-400",
                },
                {
                  date: "10-11-25",
                  in: "9:15 AM",
                  out: "6:16 PM",
                  hrs: "9 Hrs.",
                  remark: "Average",
                  color: "text-blue-400",
                },
                {
                  date: "10-11-25",
                  in: "9:00 AM",
                  out: "6:20 PM",
                  hrs: "9 Hrs.",
                  remark: "Good",
                  color: "text-orange-400",
                },
              ].map((row, idx) => (
                <tr key={idx} className="bg-white">
                  <td className="p-4 text-gray-600">{row.date}</td>
                  <td className="p-4 text-gray-600">{row.in}</td>
                  <td className="p-4 text-gray-600">{row.out}</td>
                  <td className="p-4 text-gray-600">{row.hrs}</td>
                  <td className={`p-4 font-medium ${row.color}`}>
                    {row.remark}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Feedback */}
        <div className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm">
          <h3 className="font-bold text-lg text-gray-900 mb-5">
            Feedback & Review
          </h3>
          <div className="space-y-5">
            {[
              {
                label: "Communication",
                score: 9.5,
                color: "bg-emerald-500",
                width: "95%",
              },
              {
                label: "Response Time",
                score: 9.5,
                color: "bg-emerald-500",
                width: "95%",
              },
              {
                label: "Target Achieve",
                score: 4.5,
                color: "bg-orange-400",
                width: "45%",
              },
              {
                label: "Punctuality",
                score: 8.5,
                color: "bg-emerald-500",
                width: "85%",
              },
              {
                label: "Leadership",
                score: 9.5,
                color: "bg-emerald-500",
                width: "95%",
              },
            ].map((r, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs font-semibold w-24 text-gray-700">
                  {r.label}
                </span>
                <div className="flex-grow h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${r.color}`}
                    style={{ width: r.width }}
                  ></div>
                </div>
                <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 font-bold">
                  {r.score}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
