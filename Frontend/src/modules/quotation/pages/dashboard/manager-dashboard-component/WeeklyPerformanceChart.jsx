import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const lineData = [
  { name: "Mon", completed: 2, pending: 3, revisit: 1 },
  { name: "Tue", completed: 3, pending: 2, revisit: 0 },
  { name: "Wed", completed: 4, pending: 3, revisit: 1 },
  { name: "Thu", completed: 2, pending: 1, revisit: 2 },
  { name: "Fri", completed: 5, pending: 2, revisit: 0 },
  { name: "Sat", completed: 3, pending: 1, revisit: 1 },
];

export default function WeeklyPerformanceChart() {
  return (
    <div className="xl:col-span-5 bg-white p-5 rounded-md shadow-sm border border-slate-100">
      <h3 className="font-semibold text-slate-800 text-sm mb-6">
        Weekly Performance
      </h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={lineData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e2e8f0"
            />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip />
            <Legend
              iconType="square"
              iconSize={8}
              wrapperStyle={{ fontSize: "10px", paddingTop: "20px" }}
            />
            <Line
              type="monotone"
              dataKey="completed"
              stroke="#16a34a"
              strokeWidth={2}
              dot={false}
              name="Completed"
            />
            <Line
              type="monotone"
              dataKey="pending"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={false}
              name="Pending"
            />
            <Line
              type="monotone"
              dataKey="revisit"
              stroke="#dc2626"
              strokeWidth={2}
              dot={false}
              name="Revisit"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}