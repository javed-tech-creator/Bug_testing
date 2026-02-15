import React, { useState } from "react";
import { useGetExecutivePerformanceQuery } from "@/api/sales/dashboard.sales.api.js";
import Loader from "@/components/Loader";

const FILTER_MAP = {
  "This Week": "week",
  "This Month": "month",
  "This Year": "year",
};
const statusColor = {
  Excellent: "bg-green-100 text-green-700",
  Good: "bg-blue-100 text-blue-700",
  Bad: "bg-red-100 text-red-700",
};

const TopPerformerRow = ({ name, email, status, revenue, style }) => {
  return (
    <tr
      className="border-b last:border-b-0 hover:bg-gray-50 transition"
      style={style}
    >
      <td className="py-3 font-medium text-gray-800">
        {name}
      </td>

      <td className="py-3 text-gray-600">
        {email}
      </td>

      <td className="py-3">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            statusColor[status] || "bg-gray-100 text-gray-600"
          }`}
        >
          {status}
        </span>
      </td>

      <td className="py-3 font-semibold text-gray-800">
        {revenue}
      </td>
    </tr>
  );
};


const TopPerformerTable = () => {
  const [filter, setFilter] = useState("This Week");
  const type = FILTER_MAP[filter];

  const { data, isLoading, isError } =
    useGetExecutivePerformanceQuery({ type });

  const rows = data?.data || [];

  return (
    <div className="bg-white rounded-lg border h-[60vh]  overflow-auto shadow-sm p-4 w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold text-gray-800">
          Top Performers
        </h2>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-md px-3 py-1.5 text-sm text-gray-700 focus:outline-none"
        >
          <option>This Week</option>
          <option>This Month</option>
          <option>This Year</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-700">
          <thead>
            <tr className="border-b text-gray-500 uppercase text-xs">
              <th className="pb-3">Name</th>
              <th className="pb-3">Email</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Revenue</th>
            </tr>
          </thead>

          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={4} className="py-6 text-center">
                  <Loader/>
                </td>
              </tr>
            )}

            {isError && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-red-500">
                  Failed to load data
                </td>
              </tr>
            )}

            {!isLoading && rows.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center">
                  No records found
                </td>
              </tr>
            )}

            {rows.map((row, idx) => (
              <TopPerformerRow
                key={idx}
                {...row}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopPerformerTable;
