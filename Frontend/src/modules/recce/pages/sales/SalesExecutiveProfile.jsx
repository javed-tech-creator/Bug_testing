import React, { useState } from "react";
import Chart from "react-apexcharts";
import {
  Phone,
  Mail,
  ChevronDown,
  MapPin,
  Users,
  CheckCircle,
  Search,
  Target,
  Briefcase,
} from "lucide-react";

const SalesExecutiveProfile = () => {
  // --- Data Configuration (Matching Screenshot Exactly) ---

  const metrics = [
    {
      label: "Monthly Sales",
      value: "₹1.2 Cr",
      bg: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-100",
    },
    {
      label: "Target Achievement",
      value: "85%",
      bg: "bg-green-50",
      text: "text-green-600",
      border: "border-green-100",
    },
    {
      label: "Leads Assigned",
      value: "120",
      bg: "bg-yellow-50",
      text: "text-yellow-600",
      border: "border-yellow-100",
    },
    {
      label: "Feedback Rating",
      value: "4.6 / 10",
      bg: "bg-red-50",
      text: "text-red-500",
      border: "border-red-100",
    },
    {
      label: "Deals Closed",
      value: "46",
      bg: "bg-green-50",
      text: "text-green-600",
      border: "border-green-100",
    },
    {
      label: "Follow-Ups Pending",
      value: "18",
      bg: "bg-purple-50",
      text: "text-purple-600",
      border: "border-purple-100",
    },
    {
      label: "Monthly Incentive",
      value: "1.8K",
      bg: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-100",
    },
    {
      label: "Active Clients",
      value: "24",
      bg: "bg-yellow-50",
      text: "text-yellow-600",
      border: "border-yellow-100",
    },
  ];

  const leads = [
    {
      name: "ABC Builders",
      client: "Rajesh Sharma",
      stage: "Proposal Sent",
      value: "₹5L",
      status: "Pending",
      statusColor: "text-orange-400",
    },
    {
      name: "Bright Interiors",
      client: "Komal Jain",
      stage: "Negotiation",
      value: "₹2.3L",
      status: "In Progress",
      statusColor: "text-blue-500",
    },
    {
      name: "ABC Builders",
      client: "Rajesh Sharma",
      stage: "Proposal Sent",
      value: "₹5L",
      status: "Pending",
      statusColor: "text-orange-400",
    },
  ];

  const payments = [
    {
      id: "01",
      name: "Home Decor Range",
      val: "45%",
      color: "text-blue-500 border-blue-200 bg-blue-50",
    },
    {
      id: "02",
      name: "Disney Princess Pink Bag 18'",
      val: "29%",
      color: "text-green-500 border-green-200 bg-green-50",
    },
    {
      id: "03",
      name: "Bathroom Essentials",
      val: "18%",
      color: "text-purple-500 border-purple-200 bg-purple-50",
    },
    {
      id: "04",
      name: "Apple Smartwatches",
      val: "25%",
      color: "text-orange-500 border-orange-200 bg-orange-50",
    },
  ];

  const attendance = [
    {
      date: "10-11-25",
      in: "9:01 AM",
      out: "6:01 PM",
      hrs: "9 Hrs.",
      remark: "Good",
      remarkColor: "text-orange-400",
    },
    {
      date: "10-11-25",
      in: "9:15 AM",
      out: "6:16 PM",
      hrs: "9 Hrs.",
      remark: "Average",
      remarkColor: "text-blue-500",
    },
    {
      date: "10-11-25",
      in: "9:00 AM",
      out: "6:20 PM",
      hrs: "9 Hrs.",
      remark: "Good",
      remarkColor: "text-orange-400",
    },
  ];

  const reviews = [
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
    { label: "Punctuality", score: 8.5, color: "bg-emerald-500", width: "85%" },
  ];

  // --- Chart Config ---
  const chartOptions = {
    chart: { type: "line", toolbar: { show: false }, zoom: { enabled: false } },
    colors: ["#8b5cf6", "#10b981"], // Violet (Target) & Emerald (Sales)
    stroke: { curve: "smooth", width: 2 },
    dataLabels: { enabled: false },
    grid: {
      borderColor: "#f3f4f6",
      strokeDashArray: 0,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: true } },
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "#9ca3af", fontSize: "11px" } },
    },
    yaxis: {
      min: 10,
      max: 70,
      tickAmount: 3,
      labels: {
        style: { colors: "#9ca3af", fontSize: "11px" },
        formatter: (val) => (val >= 1000 ? `${val / 1000}k` : val),
      },
    },
    legend: {
      position: "bottom",
      horizontalAlign: "left",
      markers: { radius: 12 },
      fontSize: "12px",
      itemMargin: { horizontal: 10, vertical: 0 },
    },
    tooltip: { y: { formatter: (val) => `${val}` } },
  };

  const chartSeries = [
    { name: "Targeted", data: [50, 48, 52, 62, 65, 54] },
    { name: "Sales", data: [28, 35, 40, 42, 45, 52] },
  ];

  return (
    <div className="min-h-screen bg-white p-4 font-sans text-slate-800">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white mb-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              Suresh Kumar
            </h1>
            <p className="text-gray-500 text-sm mb-1">
              Sale Executive - Chinnhat Branch
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-800 font-medium">
              <span className="flex items-center gap-2">
                <Phone size={14} fill="black" className="text-black" />{" "}
                0987654321
              </span>
              <span className="flex items-center gap-2">
                <Mail size={14} fill="black" className="text-black" />{" "}
                sureshkumar@dss.com
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <button className="px-5 py-2.5 bg-[#4caf50] hover:bg-green-600 text-white rounded shadow-sm text-sm font-semibold transition-colors">
            Export Full Report
          </button>
          <button className="px-5 py-2.5 bg-[#3b82f6] hover:bg-blue-600 text-white rounded shadow-sm text-sm font-semibold transition-colors">
            View Monthly report
          </button>
        </div>
      </div>

      <hr className="border-gray-200 mb-6" />

      {/* METRICS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {metrics.map((m, i) => (
          <div
            key={i}
            className={`flex flex-col items-center justify-center p-6 rounded-lg border ${m.border} ${m.bg}`}
          >
            <p className="text-gray-800 text-sm font-medium mb-1">{m.label}</p>
            <p className={`text-2xl font-bold ${m.text}`}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* TRACKER & TIMELINE */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Lead Tracker */}
        <div className="xl:col-span-2 border border-gray-200 rounded-lg p-0 overflow-hidden">
          <div className="flex justify-between items-center p-4 bg-white">
            <h3 className="font-bold text-lg text-gray-900">
              Lead & Opportunity Tracker
            </h3>
            <div className="flex gap-3">
              <button className="flex items-center gap-1 border border-gray-300 rounded px-3 py-1 text-sm text-gray-600">
                Product <ChevronDown size={14} />
              </button>
              <button className="flex items-center gap-1 border border-gray-300 rounded px-3 py-1 text-sm text-gray-600">
                Date range <ChevronDown size={14} />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#111827] text-white">
                <tr>
                  <th className="p-4 font-medium">Lead Name</th>
                  <th className="p-4 font-medium">Client</th>
                  <th className="p-4 font-medium">Stage</th>
                  <th className="p-4 font-medium">Value</th>
                  <th className="p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leads.map((r, idx) => (
                  <tr key={idx} className="bg-gray-50/50">
                    <td className="p-4 text-gray-800">{r.name}</td>
                    <td className="p-4 text-gray-600">{r.client}</td>
                    <td className="p-4 text-gray-600">{r.stage}</td>
                    <td className="p-4 font-semibold text-gray-800">
                      {r.value}
                    </td>
                    <td className={`p-4 font-medium ${r.statusColor}`}>
                      {r.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="border border-gray-200 rounded-lg p-5 bg-white">
          <h3 className="font-bold text-lg text-gray-900 mb-6">
            Activity Timeline
          </h3>
          <div className="relative pl-2">
            <div className="absolute left-[19px] top-2 bottom-4 w-[2px] bg-gray-200"></div>
            {[
              {
                icon: Target,
                text: 'Follow-up call with "ABC"',
                time: "10:30 AM",
              },
              { icon: Users, text: "Sent design proposal", time: "11:45 AM" },
              {
                icon: Briefcase,
                text: "Site visit scheduled",
                time: "2:00 PM",
              },
              {
                icon: CheckCircle,
                text: "Client feedback received",
                time: "4:30 PM",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 mb-6 last:mb-0 relative z-10"
              >
                <div className="bg-white p-1.5 rounded-full border border-gray-300 shadow-sm text-gray-500">
                  <item.icon size={16} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {item.text}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CONTACTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {["Business Assoc.", "Freelancers", "Contactors"].map((title, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-lg p-5 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.02)]"
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
                      src={`https://i.pravatar.cc/150?img=${10 + u + i * 5}`}
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
        <div className="border border-gray-200 rounded-lg p-5 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-gray-800">Franchise's</h4>
            <span className="bg-[#3b82f6] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              2
            </span>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <img
                src="https://i.pravatar.cc/150?img=60"
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
                src="https://i.pravatar.cc/150?img=61"
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

      {/* CHART & PAYMENTS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {/* Sales Chart */}
        <div className="border border-gray-200 rounded-lg p-5 bg-white">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg text-gray-900">Sales vs Target</h3>
            <div className="flex items-center text-sm text-gray-500 font-medium">
              Monthly <ChevronDown size={14} className="ml-1" />
            </div>
          </div>
          <div className="-ml-2">
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="line"
              height={250}
              width="100%"
            />
          </div>
        </div>

        {/* Pending Payments */}
        <div className="border border-gray-200 rounded-lg p-5 bg-white">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-gray-900">
              Partial / Pending Payments
            </h3>
            <button className="text-blue-500 text-xs font-bold hover:underline">
              View All
            </button>
          </div>
          <div className="space-y-0">
            <div className="grid grid-cols-12 text-xs font-medium text-gray-400 mb-4 px-2">
              <div className="col-span-1">#</div>
              <div className="col-span-8">Name</div>
              <div className="col-span-3 text-right">Payment</div>
            </div>
            {payments.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-12 items-center text-sm py-3 border-b border-gray-50 last:border-0 px-2"
              >
                <div className="col-span-1 text-gray-400 font-medium">
                  {item.id}
                </div>
                <div className="col-span-8 text-gray-600 font-medium">
                  {item.name}
                </div>
                <div className="col-span-3 text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold border ${item.color}`}
                  >
                    {item.val}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Attendance Table */}
        <div className="xl:col-span-2 border border-gray-200 rounded-lg overflow-hidden bg-white">
          <div className="flex justify-between items-center p-5 bg-white">
            <h3 className="font-bold text-lg text-gray-900">
              Attendance & Activity
            </h3>
            <div className="flex items-center gap-1 text-sm text-gray-500 font-medium cursor-pointer">
              Monthly <ChevronDown size={14} />
            </div>
          </div>
          <table className="w-full text-sm text-left border-t border-gray-100">
            <thead className="bg-[#111827] text-white">
              <tr>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Check In</th>
                <th className="p-4 font-medium">Check Out</th>
                <th className="p-4 font-medium">Hrs.</th>
                <th className="p-4 font-medium">Remark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {attendance.map((row, idx) => (
                <tr key={idx} className="bg-white">
                  <td className="p-4 text-gray-600">{row.date}</td>
                  <td className="p-4 text-gray-600">{row.in}</td>
                  <td className="p-4 text-gray-600">{row.out}</td>
                  <td className="p-4 text-gray-600">{row.hrs}</td>
                  <td className={`p-4 font-bold ${row.remarkColor}`}>
                    {row.remark}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Feedback & Actions */}
        <div className="flex flex-col gap-5">
          <div className="border border-gray-200 rounded-lg p-5 bg-white flex-grow">
            <h3 className="font-bold text-lg text-gray-900 mb-5">
              Feedback & Review
            </h3>
            <div className="space-y-5">
              {reviews.map((r, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs font-semibold w-24 text-gray-600">
                    {r.label}
                  </span>
                  <div className="flex-grow h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${r.color}`}
                      style={{ width: r.width }}
                    ></div>
                  </div>
                  <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-bold">
                    {r.score}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button className="w-full py-3 bg-[#3b82f6] hover:bg-blue-600 text-white rounded font-semibold text-sm transition-colors shadow-sm">
              Back to Sales Team
            </button>
            <button className="w-full py-3 bg-[#529e56] hover:bg-green-700 text-white rounded font-semibold text-sm transition-colors shadow-sm">
              Export Report (PDF)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesExecutiveProfile;
