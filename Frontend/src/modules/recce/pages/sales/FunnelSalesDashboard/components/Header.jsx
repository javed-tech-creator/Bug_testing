import React from "react";

const Header = () => {
  return (
    <div className="w-full bg-white shadow-sm border rounded-xl flex justify-between items-center px-6 py-4">
      <h1 className="text-2xl font-semi-bold text-gray-900">Funnel Dashboard</h1>

      <div className="flex gap-4">
        <button className="bg-orange-400 text-white font-medium px-6 py-3 rounded-lg hover:opacity-90 transition">
          Dashboard
        </button>

        <button className="bg-green-500 text-white font-medium px-6 py-3 rounded-lg hover:opacity-90 transition">
          Add New Lead
        </button>

        <button className="bg-blue-500 text-white font-medium px-6 py-3 rounded-lg hover:opacity-90 transition">
          View Leads
        </button>
      </div>
    </div>
  );
};

export default Header;
