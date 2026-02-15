import React, { useState } from "react";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";
import DesignSimpleHeader from "@/modules/design/components/designs/DesignSimpleHeader";
import { LiveClock } from "@/modules/design/components/navbar/LiveClock";


/* ===== Dummy Morning Payload (API se aayega later) ===== */
const morningPayload = [
  {
    id: "DES-001",
    product: "Modular Kitchen",
    projects: "Kitchen",
    plannedDuration: 4,
  },
  {
    id: "DES-002",
    product: "Wardrobe Design",
    projects: "Wardrobe",
    plannedDuration: 3,
  },
  {
    id: "DES-003",
    product: "3D Elevation",
    projects: "Elevation",
    plannedDuration: 5,
  },

];

const timeOptions = Array.from({ length: 17 }, (_, i) => {
  const half = i / 2;
  return half === Math.floor(half) ? half.toString() : half.toString();
}).slice(2); // 1 se 8 tak (0.5 steps)

const EveningReporting = () => {
  const [expandedId, setExpandedId] = useState(null);

  const [reports, setReports] = useState(
    morningPayload.reduce((acc, d) => {
      acc[d.id] = {
        status: "",
        actualTime: "",
        remark: "",
      };
      return acc;
    }, {})
  );

  const completedCount = Object.values(reports).filter(
    (r) => r.status === "Completed"
  ).length;
  const pendingCount = Object.values(reports).filter(
    (r) => r.status === "Pending"
  ).length;

  const payload = morningPayload.map((d) => ({
    ...d,
    ...reports[d.id],
  }));

  console.log("Evening Payload:", payload);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-5">
      <DesignSimpleHeader title="Evening Reporting" />

      {/* HEADER STATS CARD */}
      <div className="bg-white border border-gray-200 rounded-lg px-6 py-4 shadow-sm mb-6">
        <div className="flex justify-between items-center">
          {/* Date */}
          <div className="flex items-center gap-3 text-gray-700">
            <div className="bg-blue-50 p-2 rounded-lg">
              <CalendarDays className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Today's Date
              </p>
              <LiveClock size="sm" colorvalue={900} />
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8">
            <StatItem
              icon={<Clock className="w-4 h-4" />}
              value={morningPayload.length}
              label="Planned"
              color="blue"
            />
            <StatItem
              icon={<CheckCircle2 className="w-4 h-4" />}
              value={completedCount}
              label="Completed"
              color="green"
            />
            <StatItem
              icon={<AlertCircle className="w-4 h-4" />}
              value={pendingCount}
              label="Pending"
              color="orange"
            />
          </div>
        </div>
      </div>

      {/* MAIN REPORTING SECTION */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Design Reports
          </h2>
        </div>

{/* ===== HALF / HALF LAYOUT ===== */}
<div className="grid grid-cols-1 md:grid-cols-2 h-[480px] border rounded-lg">

  {/* ================= LEFT : DESIGN LIST ================= */}
  <div className="border-r border-gray-200 p-4 space-y-3 h-full overflow-y-auto">
    {morningPayload.map((design) => {
      const report = reports[design.id];
      const isActive = expandedId === design.id;

      return (
        <div
          key={design.id}
          onClick={() => setExpandedId(design.id)}
          className={`p-4 rounded-lg cursor-pointer border transition-all
            ${
              isActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:bg-gray-50"
            }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-800">
                {design.product}
              </h3>
              <p className="text-sm text-gray-600">
                {design.projects} • {design.plannedDuration}h planned
              </p>
            </div>

            {report.status && (
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium
                  ${
                    report.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
              >
                {report.status}
              </span>
            )}
          </div>
        </div>
      );
    })}
  </div>

  {/* ================= RIGHT : REPORT FORM ================= */}
  <div className="p-6 h-full overflow-y-auto">
            {!expandedId ? (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                Select a design from left to update report
              </div>
            ) : (
              (() => {
                const design = morningPayload.find((d) => d.id === expandedId);
                const report = reports[expandedId];

                return (
                  <div className="space-y-5">
                    <div className="border-b-2 pb-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {design.product}
                      </h3>
                      <p className="text-sm text-gray-500">
                        ID: {design.id} • {design.projects}
                      </p>
                    </div>

                    {/* STATUS */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Work Status <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={report.status}
                        onChange={(e) =>
                          setReports((r) => ({
                            ...r,
                            [expandedId]: {
                              status: e.target.value,
                              actualTime: "",
                              remark: "",
                            },
                          }))
                        }
                        className="w-full border rounded-lg px-4 py-2.5"
                      >
                        <option value="">Select status</option>
                        <option value="Completed">Completed</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </div>

                    {/* TIME */}
                    {report.status === "Completed" && (
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Actual Time Spent <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={report.actualTime}
                          onChange={(e) =>
                            setReports((r) => ({
                              ...r,
                              [expandedId]: {
                                ...r[expandedId],
                                actualTime: e.target.value,
                              },
                            }))
                          }
                          className="w-full border rounded-lg px-4 py-2.5"
                        >
                          <option value="">Select time</option>
                          {timeOptions.map((t) => (
                            <option key={t} value={t}>
                              {t} hour
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* REMARK */}
                    {report.status && (
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Remark <span className="text-red-500">{report.status === "Pending" && "*"}</span>
                        </label>
                        <textarea
                          rows={4}
                          value={report.remark}
                          onChange={(e) =>
                            setReports((r) => ({
                              ...r,
                              [expandedId]: {
                                ...r[expandedId],
                                remark: e.target.value,
                              },
                            }))
                          }
                          className="w-full border rounded-lg px-4 py-2.5 resize-none"
                          placeholder={
                            report.status === "Pending"
                              ? "Why is it pending?"
                              : "Additional notes"
                          }
                        />
                      </div>
                    )}
                  </div>
                );
              })()
            )}
          </div>
        </div>
      </div>

      {/* SUBMIT FOOTER */}
      <div className="bg-white border border-gray-200 rounded-lg px-6 py-4 shadow-sm mt-6 flex justify-between items-center">
        <div>
          <p className="font-semibold text-gray-800">
            {morningPayload.length} Design Reports
          </p>
          <p className="text-sm text-gray-500 mt-0.5">
            {completedCount} completed • {pendingCount} pending •{" "}
            {morningPayload.length - completedCount - pendingCount} not updated
          </p>
        </div>
        <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-sm hover:shadow-md flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Submit Evening Report
        </button>
      </div>
    </div>
  );
};

// Stats Component
const StatItem = ({ icon, value, label, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`p-2 rounded-lg ${colorClasses[color]}`}>{icon}</div>
      <div>
        <p className="text-lg font-bold text-gray-800">{value}</p>
        <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      </div>
    </div>
  );
};

export default EveningReporting;
