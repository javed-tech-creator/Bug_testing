import React from "react";
import { FiEye } from "react-icons/fi";

const ClientsTable = ({ data }) => {
  return (
    <div className="w-full bg-white shadow rounded-lg border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-gray-800">
          <thead className="bg-black text-white">
            <tr>
              <th className="px-4 py-3 text-center font-medium">S.No</th>
              <th className="px-4 py-3 text-center font-medium">Client</th>
              <th className="px-4 py-3 text-center font-medium">Project</th>
              <th className="px-4 py-3 text-center font-medium">
                Total Products
              </th>
              <th className="px-4 py-3 text-center font-medium">Source</th>
              <th className="px-4 py-3 text-center font-medium">Lead Type</th>
              <th className="px-4 py-3 text-center font-medium">Department</th>
              <th className="px-4 py-3 text-center font-medium">Ex. Amt</th>
              <th className="px-4 py-3 text-center font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 !== 0 ? "bg-gray-100" : ""
                } hover:bg-blue-50 transition`}
              >
                <td className="px-4 py-3 text-center">{index + 1}</td>
                <td className="px-4 py-3 text-center">{row.client}</td>
                <td className="px-4 py-3 text-center">{row.project}</td>
                <td className="px-4 py-3 text-center">{row.total_products}</td>
                <td className="px-4 py-3 text-center">{row.source}</td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-[11px] ${
                      row.lead_type === "Hot"
                        ? "bg-[#DC2626]"
                        : row.lead_type === "Warm"
                        ? "bg-[#FB923C]"
                        : "bg-[#15803D]"
                    }`}
                  >
                    {row.lead_type}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="px-3 py-1 rounded-full bg-[#1D4ED8] text-white text-[11px]">
                    {row.department}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-[11px] ${
                      row.amount > 50000 ? "bg-[#EA580C]" : "bg-[#374151]"
                    }`}
                  >
                    ₹{row.amount}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded focus:outline-none">
                    <FiEye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientsTable;
