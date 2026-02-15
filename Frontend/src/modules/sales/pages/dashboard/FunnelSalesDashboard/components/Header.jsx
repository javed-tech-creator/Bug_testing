import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate()
   const res = useSelector((state) => state.auth.userData);
  const user = res?.user || {}

  return (
    <div className="w-full bg-white shadow-sm border rounded-xl flex justify-between items-center px-6 py-4">
      <h1 className="text-2xl font-semi-bold text-gray-900">Funnel Dashboard</h1>

      <div className="flex gap-4">
        <button onClick={()=>navigate(`/sales/dashboard`)} className="cursor-pointer bg-orange-400 text-white font-medium px-6 py-3 rounded-lg hover:opacity-90 transition">
          Dashboard
        </button>

        <button onClick={()=>navigate('/sales/leads/add')} className="cursor-pointer bg-green-500 text-white font-medium px-6 py-3 rounded-lg hover:opacity-90 transition">
          Add New Lead
        </button>

        <button onClick={()=>navigate(`/sales/leads/sheet`)} className="cursor-pointer bg-blue-500 text-white font-medium px-6 py-3 rounded-lg hover:opacity-90 transition">
          View Leads
        </button>
      </div>
    </div>
  );
};

export default Header;
