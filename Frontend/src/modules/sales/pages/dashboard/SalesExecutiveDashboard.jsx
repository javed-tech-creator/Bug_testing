import React from "react";
import SalesStatsGrid from "./component/SalesStatsGrid";
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
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const SalesExecutiveDashboard = () => {

  const res = useSelector((state) => state.auth.userData);
  const user = res?.user || {}
  const navigate = useNavigate()

  const handleFunnelView = () => {
    navigate(`/sales/feed`)
  }

  return (
    <div className="">
      <div className="w-full z-10 mb-6 sticky -top-3">
        <div className="border-l-4 border-black rounded-lg shadow-md bg-white p-1.5 hover:shadow-lg transition duration-300 sticky -top-3 ">
          <div className="flex items-center justify-between bg-gray-50 p-1.5 border border-gray-200 rounded-md">

            <h2 className="text-xl font-bold text-gray-800 px-2">
              !! Welcome Back {user?.name || ""} !!
            </h2>

            <div className="flex gap-3">

              <button
                onClick={handleFunnelView}
                className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white px-2 py-1.5 rounded-sm cursor-pointer font-medium transition duration-200 shadow-sm hover:shadow-md"
              >
                View Funnel
              </button>

              <button
                onClick={() => navigate('/sales/leads/add')}
                className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-2 py-1.5 rounded-sm cursor-pointer font-medium transition duration-200 shadow-sm hover:shadow-md"
              >
                Add New Lead
              </button>

              <button
                onClick={() => navigate('/sales/leads/sheet')}
                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1.5 rounded-sm cursor-pointer font-medium transition duration-200 shadow-sm hover:shadow-md"
              >
                View Leads
              </button>

            </div>

          </div>
        </div>
      </div>
      <div className="-z-10 space-y-4">

        <SalesStatsGrid />
        {/* Top Stats Section */}


        {/* Lead Analytics + Lead Sources Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-1 ">
            <LeadAnalytics />
          </div>
          <div className="lg:col-span-2">
            <LeadSources />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LostLeads />
          <LeadLostReason />
        </div>
        <div className="grid grid-cols-1  gap-6">
          <div className="">
            <PartialPayments />
          </div>

          <div className="">
            {/* <TotalRevenue /> */}
            <IncentiveChart />
          </div>
        </div>


        <div className="grid grid-cols-1  lg:grid-cols-2  gap-6">
          {/* <TotalRevenue2 /> */}

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PaymentStatus />
          <ClientsChart />
        </div>
      </div>
    </div>
  );
};

export default SalesExecutiveDashboard;
