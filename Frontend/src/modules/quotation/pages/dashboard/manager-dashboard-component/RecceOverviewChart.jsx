import React, { useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const initialBarData = [
  { name: "Assigned", count: 22, color: "#7c3aed" },
  { name: "Completed", count: 15, color: "#16a34a" },
  { name: "In Progress", count: 7, color: "#3b82f6" },
  { name: "Pending", count: 5, color: "#f59e0b" },
  { name: "Revisit", count: 3, color: "#dc2626" },
  { name: "Rejected", count: 2, color: "#991b1b" },
  { name: "Approved", count: 18, color: "#4f46e5" },
];

export default function RecceOverviewChart() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("This Week");
  const [barData, setBarData] = useState(initialBarData);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter);
    setIsDropdownOpen(false);
    // Simulate refreshing data
    const randomized = initialBarData.map((d) => ({
      ...d,
      count: Math.floor(Math.random() * 25) + 2,
    }));
    setBarData(randomized);
  };

  return (
    <div className="xl:col-span-4 bg-white p-5 rounded-md shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-slate-800 text-sm">
          Quotations Overview
        </h3>

        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-2 px-3 py-1 bg-white border border-purple-200 text-purple-600 rounded text-[11px] font-medium hover:bg-purple-50 transition-colors cursor-pointer"
          >
            <Calendar size={12} />
            {selectedFilter}
            <ChevronDown
              size={12}
              className={`transform transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-1 w-32 bg-white border border-slate-200 rounded shadow-lg z-20 py-1 cursor-pointer">
              {["Today", "This Week", "This Month"].map((option) => (
                <button
                  key={option}
                  onClick={() => handleFilterSelect(option)}
                  className="block w-full text-left px-3 py-1.5 text-[11px] text-slate-700 hover:bg-slate-50 hover:text-purple-600 cursor-pointer"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={barData}
            margin={{ top: 10, right: 0, left: -20, bottom: 45 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e2e8f0"
            />
            <XAxis
              dataKey="name"
              interval={0}
              tick={{
                fontSize: 9,
                fill: "#64748b",
                angle: -45,
                textAnchor: "end",
              }}
              tickMargin={10}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip cursor={{ fill: "transparent" }} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={35}>
              {barData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}