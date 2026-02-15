import React from "react";
import { useNavigate } from "react-router-dom";
import StatsCards from "./components/manager/StatsCards";
import TeamPerformancePanel from "./components/manager/TeamPerformancePanel";
import TeamPerformanceChart from "./components/manager/TeamPerformanceChart";
import RecceAnalytics from "./components/manager/RecceAnalytics";
import CompletionPerExecutive from "./components/manager/CompletionPerExecutive";
import RecceOverall from "./components/manager/RecceOverall";
import HeatMapChart from "./components/manager/HeatMapChart";

function RecceManagerDashboard() {
  const navigate = useNavigate();
  return (
    <div className="dashboard-content relative z-20 w-full px-6 py-4">
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border">
        <h2 className="text-2xl font-bold text-gray-800">Recce Manager Dashboard</h2>

        <div className="flex gap-3">
          <button
          onClick={() => navigate("/recce/recce-executive-funnel-dashboard")}
          className="px-4 py-2 bg-orange-500 text-white rounded-md">
            View Funnel
          </button>
          <button onClick={() => navigate('/recce/assigned-recce')} className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer">
            View Recce
          </button>
          {/* <button className="px-4 py-2 bg-green-600 text-white rounded-md">Assign Recce</button> */}
        </div>
      </div>
      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <div className="lg:col-span-2">
          <TeamPerformancePanel />
        </div>

        <TeamPerformanceChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <RecceAnalytics />
        <CompletionPerExecutive />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <RecceOverall />
        <HeatMapChart />
      </div>
    </div>
  );
}

export default RecceManagerDashboard;
