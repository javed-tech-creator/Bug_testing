import React from "react";
import {
  BarChart3,
  FileCheck,
  Bell,
  TrendingDown,
  Clock,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import RecceFunnel from "../RecceFunnel";

const RecceExecutiveFunnelDashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen">
      {/* Header Section - Sticky added here */}
      <div className="sticky top-0  flex flex-col md:flex-row justify-between items-center mb-8 border border-gray-200 rounded-md p-4 bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-black mb-4 md:mb-0">
          Recce Funnel Dashboard
        </h1>

        <div className="flex space-x-3">
          <button
            onClick={() => navigate("/recce/dashboard")}
            className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-[4px] text-sm font-medium transition"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate("/recce/assigned-executive-recce")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-[4px] text-sm font-medium transition"
          >
            View Recce
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="border border-gray-200 rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard
            icon={<BarChart3 size={20} className="text-white" />}
            iconBg="bg-purple-600"
            cardBg="bg-purple-100"
            value="135"
            label="Assigned Recce"
            subtext="+8% from yesterday"
          />
          <StatCard
            icon={<FileCheck size={20} className="text-white" />}
            iconBg="bg-blue-600"
            cardBg="bg-blue-100"
            value="3000"
            label="Completed"
            subtext="+5% from yesterday"
          />
          <StatCard
            icon={<Bell size={20} className="text-white" />}
            iconBg="bg-orange-400"
            cardBg="bg-orange-50"
            value="20"
            label="Pending Recce"
            subtext="+1,2% from yesterday"
          />
          <StatCard
            icon={<TrendingDown size={20} className="text-white" />}
            iconBg="bg-rose-400"
            cardBg="bg-rose-100"
            value="8"
            label="Rejected Recce"
            subtext="0,5% from yesterday"
          />
          <StatCard
            icon={<Clock size={20} className="text-white" />}
            iconBg="bg-emerald-500"
            cardBg="bg-emerald-100"
            value="1.8 days"
            label="Avg. Time"
            subtext="+5% from yesterday"
          />
          <StatCard
            icon={<Star size={20} className="text-white" />}
            iconBg="bg-blue-500"
            cardBg="bg-blue-100"
            value="4.6 / 5"
            label="Performance"
            subtext="+5% from yesterday"
          />
        </div>
      </div>

      {/* Funnel Visualization Heading */}
      <div className="space-y-4">
      
        <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <RecceFunnel />
        </div>
      </div>
    </div>
  );
};

// Helper Component for the Cards
const StatCard = ({ icon, iconBg, cardBg, value, label, subtext }) => {
  return (
    <div
      className={`${cardBg} rounded-lg p-5 flex flex-col justify-between h-44`}
    >
      {/* Icon Circle */}
      <div
        className={`${iconBg} w-10 h-10 rounded-full flex items-center justify-center shadow-sm mb-3`}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="flex flex-col">
        <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
        <p className="text-gray-600 font-medium text-sm mb-2">{label}</p>
        <p className="text-xs text-blue-500 font-medium">{subtext}</p>
      </div>
    </div>
  );
};

export default RecceExecutiveFunnelDashboard;
