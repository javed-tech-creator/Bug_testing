import React from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../../components/PageHeader.jsx";
import StatsCards from "./manager-dashboard-component/StatsCards";
import DailyStats from "./manager-dashboard-component/DailyStats";
import RecceOverviewChart from "./manager-dashboard-component/RecceOverviewChart";
import WeeklyPerformanceChart from "./manager-dashboard-component/WeeklyPerformanceChart";
import RecceAnalyticsChart from "./manager-dashboard-component/RecceAnalyticsChart";

import ActiveRecceTable from "./manager-dashboard-component/ActiveRecceTable";


export default function ManagerDashboard() {
  const navigate = useNavigate();

  return (
    <div className="">
      <PageHeader title="Manager Dashboard" />

      {/* 1. Top Stats Cards */}
      <StatsCards />

      {/* 2. Daily Stats Row */}
      <DailyStats />

      {/* 3. Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6">
        <RecceOverviewChart />
        <WeeklyPerformanceChart />
        <RecceAnalyticsChart />
      </div>

      {/* 4. Active Recce Table */}
      <ActiveRecceTable navigate={navigate} />
    </div>
  );
}