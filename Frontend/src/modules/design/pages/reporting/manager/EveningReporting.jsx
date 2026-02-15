import React, { useState } from "react";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Users,
  User,
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

const teamEveningReports = {
  "EMP-101": [
    {
      designId: "DES-001",
      product: "Modular Kitchen",
      project: "Kitchen",
      status: "Completed",
      actualTime: 4.5,
      remark: "All modules finalized",
    },
    {
      designId: "DES-002",
      product: "Wardrobe Design",
      project: "Wardrobe",
      status: "Pending",
      actualTime: "",
      remark: "Client feedback awaited",
    },
  ],
  "EMP-102": [
    {
      designId: "DES-003",
      product: "3D Elevation",
      project: "Elevation",
      status: "Completed",
      actualTime: 5,
      remark: "Rendered & shared",
    },
  ],
};
const teamMembers = {
  "EMP-101": {
    name: "Rohit Sharma",
    role: "Senior Designer",
  },
  "EMP-102": {
    name: "Aman Verma",
    role: "3D Designer",
  },
};

const timeOptions = Array.from({ length: 17 }, (_, i) => {
  const half = i / 2;
  return half === Math.floor(half) ? half.toString() : half.toString();
}).slice(2); // 1 se 8 tak (0.5 steps)

const EveningReporting = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [mode, setMode] = useState("self");
  const [activeEmp, setActiveEmp] = useState(null);

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

  const getTeamStats = () => {
    if (!activeEmp) {
      // OVERALL TEAM
      const allReports = Object.values(teamEveningReports).flat();

      return {
        planned: allReports.length,
        completed: allReports.filter((r) => r.status === "Completed").length,
        pending: allReports.filter((r) => r.status === "Pending").length,
      };
    }

    // SINGLE EXECUTIVE
    const empReports = teamEveningReports[activeEmp] || [];

    return {
      planned: empReports.length,
      completed: empReports.filter((r) => r.status === "Completed").length,
      pending: empReports.filter((r) => r.status === "Pending").length,
    };
  };

  const teamStats = getTeamStats();

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

      <div className="flex w-full items-center justify-center mb-4">
        <div className="relative flex w-96 bg-emerald-50 rounded-lg p-1">
          <div
            className={`absolute top-1 bottom-1 rounded-md transition-all duration-300
      ${
        mode === "self"
          ? "left-1 right-1/2 bg-emerald-600"
          : "left-1/2 right-1 bg-teal-600"
      }`}
          />

          <div className="relative flex w-full">
            <button
              onClick={() => setMode("self")}
              className={`flex-1 px-4 py-2 text-sm font-semibold flex items-center justify-center gap-2
        ${mode === "self" ? "text-white" : "text-emerald-800"}`}
            >
              <User className="w-4 h-4" />
              Self
            </button>

            <button
              onClick={() => setMode("team")}
              className={`flex-1 px-4 py-2 text-sm font-semibold flex items-center justify-center gap-2
        ${mode === "team" ? "text-white" : "text-teal-800"}`}
            >
              <Users className="w-4 h-4" />
              Team
            </button>
          </div>
        </div>
      </div>

      {/* HEADER STATS CARD */}
      <div className="bg-white border border-gray-200 rounded-lg px-6 py-4 shadow-sm mb-6">
        {/* TOP ROW */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* DATE SECTION */}
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-lg flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-blue-600" />
            </div>

            <div className="leading-tight">
              <p className="text-[11px] text-gray-500 uppercase tracking-wide">
                Today's Date
              </p>
              <LiveClock size="sm" colorvalue={900} />
            </div>
          </div>

          {/* STATS SECTION */}
          <div className="flex items-center gap-6 sm:gap-8 flex-wrap justify-start sm:justify-end">
            <StatItem
              icon={<Clock className="w-4 h-4" />}
              value={
                mode === "self" ? morningPayload.length : teamStats.planned
              }
              label={mode === "self" ? "Planned" : "Planned"}
              color="blue"
            />

            <StatItem
              icon={<CheckCircle2 className="w-4 h-4" />}
              value={mode === "self" ? completedCount : teamStats.completed}
              label="Completed"
              color="green"
            />

            <StatItem
              icon={<AlertCircle className="w-4 h-4" />}
              value={mode === "self" ? pendingCount : teamStats.pending}
              label="Pending"
              color="orange"
            />
          </div>
        </div>

        {/* CONTEXT LABEL */}
        {mode === "team" && (
          <div className="mt-3 pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              {activeEmp
                ? `Showing evening report for ${activeEmp}`
                : "Showing overall team evening report"}
            </p>
          </div>
        )}
      </div>

      {/* MAIN REPORTING SECTION */}
      {mode === "self" && (
        <>
          {" "}
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
                            {design.projects} • {design.plannedDuration}h
                            planned
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
                    const design = morningPayload.find(
                      (d) => d.id === expandedId
                    );
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
                              Actual Time Spent{" "}
                              <span className="text-red-500">*</span>
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
                              Remark{" "}
                              <span className="text-red-500">
                                {report.status === "Pending" && "*"}
                              </span>
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
                {morningPayload.length - completedCount - pendingCount} not
                updated
              </p>
            </div>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-sm hover:shadow-md flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Submit Evening Report
            </button>
          </div>
        </>
      )}

      {mode === "team" && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 my-5">
            {/* ================= LEFT : TEAM MEMBERS ================= */}
            <div className="bg-white border rounded-md flex flex-col h-[520px]">
              <h3 className="font-semibold p-4 border-b shrink-0">
                Team Members
              </h3>

              <div className="flex-1 overflow-y-auto divide-y">
                {Object.keys(teamEveningReports).map((empId) => (
                  <div
                    key={empId}
                    onClick={() => setActiveEmp(empId)}
                    className={`p-4 cursor-pointer
                ${
                  activeEmp === empId
                    ? "bg-blue-50 border-l-4 border-blue-500"
                    : "hover:bg-gray-50"
                }`}
                  >
                    <p className="font-semibold text-gray-800">
                      {teamMembers[empId]?.name || empId}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      {teamEveningReports[empId].length} Reports Submitted
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ================= RIGHT : READ ONLY REPORT ================= */}
            <div className="lg:col-span-2 bg-white border rounded-md flex flex-col h-[520px] p-4">
              {!activeEmp ? (
                <p className="text-gray-500 text-sm">
                  Select a team member to view evening report
                </p>
              ) : (
                <>
                  <h3 className="font-semibold mb-4 shrink-0">
                    {teamMembers[activeEmp]?.name}'s Evening Report
                    <span className="block text-xs text-gray-500 font-normal">
                      {activeEmp}
                    </span>
                  </h3>

                  <div className="flex-1 overflow-y-auto pr-1">
                    {teamEveningReports[activeEmp].map((item) => (
                      <div
                        key={item.designId}
                        className="border rounded-md p-4 mb-4 bg-gray-50"
                      >
                        <div className="mb-2">
                          <h4 className="font-semibold">{item.product}</h4>
                          <p className="text-sm text-gray-600">
                            Design ID: {item.designId}
                          </p>
                          <p className="text-sm text-gray-600">
                            Project: {item.project}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                          <div>
                            <p className="text-gray-500">Status</p>
                            <p
                              className={`font-medium ${
                                item.status === "Completed"
                                  ? "text-green-600"
                                  : "text-orange-600"
                              }`}
                            >
                              {item.status}
                            </p>
                          </div>

                          <div>
                            <p className="text-gray-500">Actual Time</p>
                            <p className="font-medium">
                              {item.actualTime
                                ? `${item.actualTime} hours`
                                : "—"}
                            </p>
                          </div>

                          <div className="col-span-2">
                            <p className="text-gray-500">Remark</p>
                            <p className="font-medium">{item.remark || "—"}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ================= FOOTER ================= */}
          <div className="bg-white border border-gray-200 rounded-md px-6 py-3 shadow-sm flex justify-end mt-5">
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-md font-medium transition">
              Submit Team Evening Report
            </button>
          </div>
        </>
      )}
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
