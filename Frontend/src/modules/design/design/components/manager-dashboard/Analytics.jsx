import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const waitingReasonData = [
  { name: "Postponed By Company", value: 15 },
  { name: "Postponed By Client", value: 40 },
  { name: "Hold By Client", value: 28 },
  { name: "Hold By Company", value: 38 },
];

const lostReasonData = [
  { name: "Costly Design", value: 15 },
  { name: "Design Issues", value: 40 },
  { name: "Delay in Design", value: 28 },
  { name: "Design Not Feasible", value: 38 },
];

const flowData = [
  { name: "Planning Section", value: 10, color: "#ef4444" },
  { name: "Todays Section", value: 20, color: "#2563eb" },
  { name: "Design Options Section", value: 40, color: "#f59e0b" },
  { name: "Mockup Section", value: 30, color: "#525252" },
];

const Card = ({ title, children }) => (
  <div className="bg-white border-2 border-gray-200 rounded-sm p-4">
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <select className="border rounded px-2 py-1 text-sm">
        <option>Executive Name</option>
        <option> Rahul Yadav</option>
        <option> Shyam Lal Singh</option>
        <option> Jyoti kumar shukla</option>
      </select>
    </div>
    {children}
  </div>
);

export default function DesignManagerAnalytics() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
      {/* Waiting Designs By Reason */}
      <Card title="Waiting Designs By Reason">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={waitingReasonData} layout="vertical">
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" width={150} />
            <Tooltip />
            <Bar dataKey="value" fill="#2563eb" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Waiting Designs By Flow */}
      <Card title="Waiting Designs By Flow">
        <div className="flex items-center gap-6">
          <ResponsiveContainer width="60%" height={260}>
            <PieChart>
              <Pie
                data={flowData}
                dataKey="value"
                innerRadius={60}
                outerRadius={110}
                paddingAngle={2}
              >
                {flowData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="space-y-2 text-sm">
            {flowData.map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ background: f.color }}
                />
                <span className="font-semibold">
                  {f.name} - {f.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Lost Designs By Flow */}
      <Card title="Lost Designs By Flow">
        <div className="flex items-center gap-6">
          <ResponsiveContainer width="60%" height={260}>
            <PieChart>
              <Pie
                data={flowData}
                dataKey="value"
                innerRadius={60}
                outerRadius={110}
                paddingAngle={2}
              >
                {flowData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="space-y-2 text-sm">
            {flowData.map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ background: f.color }}
                />
                <span className="text-gray-700 font-semibold">
                  {f.name} - {f.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Lost Designs By Reason */}
      <Card title="Lost Designs By Reason">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={lostReasonData} layout="vertical">
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" width={160} />
            <Tooltip />
            <Bar dataKey="value" fill="#dc2626" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
