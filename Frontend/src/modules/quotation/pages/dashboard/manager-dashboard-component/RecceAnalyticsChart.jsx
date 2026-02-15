import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const pieData = [
  { name: "Approved", value: 80, color: "#16a34a" },
  { name: "Revisit", value: 10, color: "#f59e0b" },
  { name: "Rejected", value: 10, color: "#dc2626" },
];

const COLORS = ["#16a34a", "#f59e0b", "#dc2626"];

export default function RecceAnalyticsChart() {
  return (
    <div className="xl:col-span-3 bg-white p-5 rounded-md shadow-sm border border-slate-100">
      <h3 className="font-semibold text-slate-800 text-sm mb-6">
        Quotations Analytics
      </h3>
      <div className="h-64 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              label={({ percent }) =>
                `${(percent * 100).toFixed(0)}%`
              }
              labelLine={true}
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name) => [`${value}%`, name]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-4 mt-4">
        {pieData.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: COLORS[idx] }}
            ></div>
            <span className="text-[10px] text-slate-600">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}