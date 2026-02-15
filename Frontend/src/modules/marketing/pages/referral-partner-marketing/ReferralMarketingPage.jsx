// ReferralMarketingPage.jsx
import React, { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  LabelList,
} from "recharts";
import TechnologyTable from "@/modules/technology/components/TechnologyTable";

// Dummy Data
const dummyReferralCodes = [
  {
    id: 1,
    code: "REF123",
    createdBy: "John Doe",
    campaign: "Summer Sale",
    clicks: 120,
    conversions: 15,
    revenue: 15000,
  },
  {
    id: 2,
    code: "PARTNER50",
    createdBy: "Jane Smith",
    campaign: "Winter Sale",
    clicks: 90,
    conversions: 8,
    revenue: 8000,
  },
];

const dummyPartners = [
  {
    id: 1,
    name: "Affiliate A",
    type: "Affiliate",
    assignedCampaign: "Summer Sale",
    status: "Active",
    earnings: 5000,
  },
  {
    id: 2,
    name: "Reseller B",
    type: "Reseller",
    assignedCampaign: "Winter Sale",
    status: "Inactive",
    earnings: 2000,
  },
];

const dummyRewardPrograms = [
  { id: 1, name: "Cashback 10%", description: "10% cashback for referrals" },
  { id: 2, name: "Commission 5%", description: "5% commission on sales" },
];

const dummyReferralReports = [
  { month: "Jan", clicks: 50, conversions: 5, revenue: 5000 },
  { month: "Feb", clicks: 80, conversions: 10, revenue: 10000 },
  { month: "Mar", clicks: 120, conversions: 15, revenue: 15000 },
];

// Column Configs
const referralColumns = [
   {
    key: "actions",
    label: "Actions",
    render: (row) => (
      <div className="flex gap-2 justify-center">
        <button className="p-2 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200">
          <FaEdit />
        </button>
        <button className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200">
          <FaTrash />
        </button>
      </div>
    ),
  },
  { key: "code", label: "Referral Code" },
  { key: "createdBy", label: "Created By" },
  { key: "campaign", label: "Campaign" },
  { key: "clicks", label: "Clicks" },
  { key: "conversions", label: "Conversions" },
  { key: "revenue", label: "Revenue (₹)" },
 
];

const partnerColumns = [
  {
    key: "actions",
    label: "Actions",
    render: (row) => (
      <div className="flex gap-2 justify-center">
        <button className="p-2 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200">
          <FaEdit />
        </button>
        <button className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200">
          <FaTrash />
        </button>
      </div>
    ),
  },
  { key: "name", label: "Partner Name" },
  { key: "type", label: "Type" },
  { key: "assignedCampaign", label: "Campaign" },
  { key: "status", label: "Status" },
  { key: "earnings", label: "Earnings (₹)" },
  
];

// Referral Marketing Page
const ReferralMarketingPage = () => {
    const [itemsPerPage] = useState(5);
      const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <PageHeader
        title="Referral & Partner Marketing"
        path="/marketing/referrals/form"
        btnTitle="Add New"
      />

{/* Referral Codes Section */}
<div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-5 mb-6">
  {/* Header */}
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
      <span className="p-2 rounded-full bg-green-100 text-green-600">🎟️</span>
      Referral Codes & Links
    </h2>
    {/* Action Button (optional) */}
    {/* <button className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700">
      + Add Code
    </button> */}
  </div>

  {/* Table */}
  <TechnologyTable
    columnArray={referralColumns}
    tableData={dummyReferralCodes}
    total={dummyReferralCodes.length}
    isLoading={false}
    itemsPerPage={itemsPerPage}
    currentPage={currentPage}
    setCurrentPage={setCurrentPage}
  />
</div>


{/* Partner Management Section */}
<div className="w-full bg-white border border-gray-200 rounded-xl shadow-sm p-5 mb-6">
  {/* Header */}
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
      <span className="p-2 rounded-full bg-indigo-100 text-indigo-600">👥</span>
      Partner Management
    </h2>
    {/* Future me button add karna ho toh yaha dal sakte ho */}
    {/* <button className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
      + Add Partner
    </button> */}
  </div>

  {/* Table */}
  <TechnologyTable
    columnArray={partnerColumns}
    tableData={dummyPartners}
    total={dummyPartners.length}
    isLoading={false}
    itemsPerPage={itemsPerPage}
    currentPage={currentPage}
    setCurrentPage={setCurrentPage}
  />
</div>


      {/* Reward Programs */}
   <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
    <span className="w-9 h-9 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
    🎁
  </span> Reward Programs
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {dummyRewardPrograms.map((r) => (
      <div
        key={r.id}
        className="p-5 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-gray-50 hover:from-indigo-50 hover:to-white"
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
            <span className="text-indigo-500">🏆</span> {r.name}  
          </h3>
          <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-600 font-medium">
            Active
          </span>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{r.description}</p>
      </div>
    ))}
  </div>
</div>


      {/* Referral Reports */}
   <div className="mt-8 bg-white p-6 rounded-2xl shadow-md border border-gray-100">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
      <span className="p-2 rounded-full bg-yellow-100 text-yellow-600">📊</span>
      Referral Reports
    </h2>
  </div>

  <div style={{ height: 380 }}>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={dummyReferralReports}
        margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
      >
        {/* Background grid */}
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />

        {/* X & Y Axis */}
        <XAxis
          dataKey="month"
          tick={{ fill: "#6b7280", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#6b7280", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />

        {/* Custom Tooltip */}
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            padding: "10px",
          }}
          formatter={(value, name) =>
            name === "Revenue (₹)"
              ? `₹${value.toLocaleString()}`
              : value.toLocaleString()
          }
        />

        {/* Legend */}
        <Legend verticalAlign="top" height={36} />

        {/* Bars with gradient + labels */}
        <Bar dataKey="clicks" name="Clicks" fill="url(#colorClicks)" radius={[6, 6, 0, 0]}>
          <LabelList dataKey="clicks" position="top" fill="#4f46e5" fontSize={12} />
        </Bar>
        <Bar dataKey="conversions" name="Conversions" fill="url(#colorConversions)" radius={[6, 6, 0, 0]}>
          <LabelList dataKey="conversions" position="top" fill="#059669" fontSize={12} />
        </Bar>
        <Bar dataKey="revenue" name="Revenue (₹)" fill="url(#colorRevenue)" radius={[6, 6, 0, 0]}>
          <LabelList
            dataKey="revenue"
            position="top"
            formatter={(val) => `₹${val / 1000}k`}
            fill="#d97706"
            fontSize={12}
          />
        </Bar>

        {/* Gradient defs */}
        <defs>
          <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.9} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0.3} />
          </linearGradient>
          <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.9} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0.3} />
          </linearGradient>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.9} />
            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.3} />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>

      
    </div>
  );
};

export default ReferralMarketingPage;
