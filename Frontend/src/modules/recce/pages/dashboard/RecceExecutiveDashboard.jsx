import React from "react";
import { useNavigate } from "react-router-dom";
import StatsCards from "./components/executive/StatsCards";
import ActiveReccesTable from "./components/executive/ActiveReccesTable";
import MapActivityPanel from "./components/executive/MapActivityPanel";
import ActivityFeed from "./components/executive/ActivityFeed";
const RecceExecutiveDashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border ">
        <h2 className="text-2xl font-bold text-gray-800">
          Recce Executive Dashboard
        </h2>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/recce/recce-executive-funnel-dashboard")}
            className="px-4 py-2 bg-orange-500 text-white rounded-md"
          >
            View Funnel
          </button>
          <button
            onClick={() => navigate("/recce/assigned-executive-recce")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer"
          >
            View Recce
          </button>
        </div>
      </div>

      <StatsCards />
      <div>
        <ActiveReccesTable />
      </div>
      <div className="flex gap-6 items-start pb-6">
        <div className="w-2/3">
          <MapActivityPanel />
        </div>
        <div className="w-1/3">
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
};

export default RecceExecutiveDashboard;
