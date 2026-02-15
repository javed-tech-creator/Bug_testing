import React from "react";
import SalesStatsGrid from "./component/SalesStatsGrid";
import TopPerformerTable from "./component/TopPerformerTable";
import PerformanceChart from "./component/PerformanceChart";
import LeadAnalytics from "./component/LeadAnalytics";
import LeadSources from "./component/LeadSources";
import LostLeads from "./component/LostLeads";
import LeadLostReason from "./component/LeadLostReason";
import PartialPayments from "./component/PartialPayments";
import TotalRevenue from "./component/TotalRevenue";
import TotalRevenue2 from "./component/TotalRevenue2";
import IncentiveChart from "./component/IncentiveChart";
import PaymentStatus from "./component/PaymentStatus";
import ClientsChart from "./component/ClientsChart";

const SalesExecutiveDashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border sticky -top-3 z-50">
        <h2 className="text-2xl font-bold text-gray-800">
          Sales Executive Dashboard
        </h2>

        <div className="flex gap-3">
          <button className="px-4 py-2 bg-orange-500 text-white rounded-md">
            View Funnel
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
            View Recce
          </button>
        </div>
      </div>

      {/* Top Stats Section */}
      <SalesStatsGrid />

      {/* Table + Chart Section Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Top Performers Table */}
        <div className="lg:col-span-2 max-w-[800px]">
          <TopPerformerTable />
        </div>

        {/* Right: Performance Chart */}
        <div className="lg:col-span-1">
          <PerformanceChart />
        </div>
      </div>

      {/* Lead Analytics + Lead Sources Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 h-[420px]">
          <LeadAnalytics />
        </div>
        <div className="lg:col-span-2 h-[420px]">
          <LeadSources />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LostLeads />
        <LeadLostReason />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-6">
        <PartialPayments />
        <TotalRevenue />
      </div>

      <div className="grid grid-cols-1  lg:grid-cols-[50%_50%]  gap-6">
        <TotalRevenue2 />
        <IncentiveChart />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PaymentStatus />
        <ClientsChart />
      </div>
    </div>
  );
};

export default SalesExecutiveDashboard;
