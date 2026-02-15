import React, { useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  User,
  Users,
} from "lucide-react";
import { Calendar, AlertCircle, Layers } from "lucide-react";
import DesignSimpleHeader from "@/modules/design/components/designs/DesignSimpleHeader";
import { LiveClock } from "@/modules/design/components/navbar/LiveClock";

const timeOptions = Array.from({ length: 17 }, (_, i) => {
  const half = i / 2;
  return half === Math.floor(half) ? half.toString() : half.toString();
}).slice(2); // 1 se 8 tak (0.5 steps)

const teamData = [
  {
    empId: "EMP-101",
    name: "Rahul",
    designs: [
      { id: "DES-001", product: "Kitchen" },
      { id: "DES-002", product: "Wardrobe" },
    ],
  },
  {
    empId: "EMP-102",
    name: "Aman",
    designs: [{ id: "DES-003", product: "3D Elevation" }],
  },
];

const executiveReports = {
  "EMP-101": [
    {
      designId: "DES-001",
      product: "Modular Kitchen",
      project: "Kitchen",
      duration: "2.5",
      remark: "Client discussion planned",
    },
    {
      designId: "DES-002",
      product: "Wardrobe",
      project: "Wardrobe",
      duration: "1.5",
      remark: "Material finalisation",
    },
  ],
  "EMP-102": [
    {
      designId: "DES-003",
      product: "3D Elevation",
      project: "Elevation",
      duration: "3",
      remark: "Initial draft",
    },
  ],
};

const MorningReporting = () => {
  const designData = [
    {
      id: "DES-001",
      product: "Modular Kitchen",
      projects: "Kitchen",
      receivedDate: "12 Nov 2025",
      priority: "High",
      deadline: "20 Nov 2025",
    },
    {
      id: "DES-002",
      product: "Wardrobe Design",
      projects: "Wardrobe",
      receivedDate: "14 Nov 2025",
      priority: "Medium",
      deadline: "25 Nov 2025",
    },
    {
      id: "DES-003",
      product: "3D Elevation",
      projects: "Elevation",
      receivedDate: "10 Nov 2025",
      priority: "Low",
      deadline: "30 Nov 2025",
    },
    {
      id: "DES-004",
      product: "3D Elevation",
      projects: "Elevation",
      receivedDate: "10 Nov 2025",
      priority: "Low",
      deadline: "30 Nov 2025",
    },
  ];
  const [search, setSearch] = React.useState("");
  const [selectedDesigns, setSelectedDesigns] = React.useState([]);
  const [expandedId, setExpandedId] = React.useState(null);
  const [reports, setReports] = React.useState({});
  // const timeOptions = Array.from({ length: 8 }, (_, i) => i + 1);

  const [mode, setMode] = useState("self");
  const [teamReports, setTeamReports] = useState({});
  const [activeEmp, setActiveEmp] = useState(null);

  const teamSummary = React.useMemo(() => {
    const totalMembers = teamData.length;

    let reported = 0;
    let totalHours = 0;
    let totalDesigns = 0;

    teamData.forEach((emp) => {
      const reports = executiveReports[emp.empId] || [];

      if (reports.length > 0) reported++;

      reports.forEach((r) => {
        totalDesigns++;
        totalHours += Number(r.duration || 0);
      });
    });

    return {
      totalMembers,
      reported,
      pending: totalMembers - reported,
      totalHours,
      totalDesigns,
    };
  }, []);

  const filteredDesignData = designData.filter((item) =>
    `${item.product} ${item.id} ${item.projects}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const payload = selectedDesigns.map((d) => ({
    ...d,
    duration: reports[d.id]?.duration,
    remark: reports[d.id]?.remark,
  }));

  console.log(payload);

  return (
    <div className="px-5">
      <DesignSimpleHeader title="Morning Reporting" />

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

      <div className="bg-white border border-gray-200 rounded-md px-6 py-3 shadow-sm flex items-center justify-between">
        {/* LEFT : DATE (SAME FOR BOTH) */}
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

        {/* RIGHT : STATS */}
        <div className="flex items-center gap-10">
          {mode === "self" && (
            <>
              <StatBlock value={designData.length} label="TOTAL LEADS" />
              <StatBlock value={selectedDesigns.length} label="SELECTED" />
            </>
          )}

          {mode === "team" && (
            <>
              <StatBlock
                value={teamSummary.totalMembers}
                label="TEAM MEMBERS"
              />
              <StatBlock value={teamSummary.reported} label="REPORTED" />
              <StatBlock value={teamSummary.pending} label="PENDING" />
              <StatBlock
                value={`${teamSummary.totalHours}h`}
                label="PLANNED HOURS"
              />
            </>
          )}
        </div>
      </div>

      {mode === "self" && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-5">
            {/* LEFT SIDE – DESIGN LIST */}
            <div className=" bg-white rounded-md border shadow-sm">
              {/* HEADER */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="font-semibold text-lg">
                  Design Tasks ({designData.length})
                </h2>

                <input
                  type="text"
                  placeholder="Search by product / ID / project"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border rounded-md px-3 py-1 text-sm outline-none w-56"
                />
              </div>

              {/* LIST */}
              <div className="max-h-[500px] overflow-y-auto divide-y">
                {filteredDesignData.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-6">
                    No design found
                  </p>
                )}

                {filteredDesignData.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedDesigns((prev) => {
                        const exists = prev.find((d) => d.id === item.id);

                        if (exists) {
                          // remove
                          const updated = prev.filter((d) => d.id !== item.id);
                          const newReports = { ...reports };
                          delete newReports[item.id];
                          setReports(newReports);
                          return updated;
                        } else {
                          // add
                          setReports((r) => ({
                            ...r,
                            [item.id]: { duration: "", remark: "" },
                          }));
                          return [...prev, item];
                        }
                      });
                    }}
                    className={`p-4 cursor-pointer transition flex justify-between gap-4
    ${
      selectedDesigns.some((d) => d.id === item.id)
        ? "bg-blue-50 border-l-4 border-blue-500"
        : "hover:bg-gray-50"
    }`}
                  >
                    {/* LEFT */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedDesigns.some(
                            (d) => d.id === item.id
                          )}
                          readOnly
                        />

                        <h3 className="font-semibold">{item.product}</h3>
                      </div>

                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Design ID:</span>{" "}
                        {item.id}
                      </p>

                      <p className="text-sm flex items-center gap-2 text-gray-600">
                        <Layers size={14} /> Projects: {item.projects}
                      </p>

                      <p className="text-sm flex items-center gap-2 text-gray-600">
                        <Calendar size={14} /> Received: {item.receivedDate}
                      </p>
                      <p className="text-sm flex items-center justify-end gap-2 text-gray-600">
                        <AlertCircle size={14} />
                        Deadline: {item.deadline}
                      </p>
                    </div>

                    {/* RIGHT */}
                    <div className="text-right space-y-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold
                  ${
                    item.priority === "High"
                      ? "bg-red-100 text-red-700"
                      : item.priority === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                      >
                        {item.priority} Priority
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT SIDE – DETAILS / SUMMARY */}
            <div className="bg-white rounded-md border shadow-sm p-4 space-y-4">
              <h3 className="font-semibold text-lg border-b pb-4">
                Today's Plan ({selectedDesigns.length})
              </h3>

              <div className="max-h-[500px] overflow-y-auto">
                {selectedDesigns.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    Select design tasks from left to add report
                  </p>
                ) : (
                  selectedDesigns.map((design) => (
                    <div key={design.id} className="space-y-2">
                      {/* BASIC CARD */}
                      <div
                        onClick={() =>
                          setExpandedId(
                            expandedId === design.id ? null : design.id
                          )
                        }
                        className="border rounded-md p-4 cursor-pointer hover:bg-gray-50 mb-2"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold">{design.product}</h4>
                            <p className="text-sm text-gray-600">
                              Design ID: {design.id}
                            </p>
                          </div>

                          <span className="text-blue-600">
                            {expandedId === design.id ? (
                              <ChevronUp size={18} />
                            ) : (
                              <ChevronDown size={18} />
                            )}
                          </span>
                        </div>
                      </div>

                      {/* EXPAND */}
                      {expandedId === design.id && (
                        <div className="border rounded-md p-4 bg-gray-50 space-y-4 mb-2">
                          <div>
                            <label className="text-sm font-medium text-gray-700">
                              Time Duration (Hours)
                            </label>

                            <select
                              value={reports[design.id]?.duration || ""}
                              onChange={(e) =>
                                setReports((r) => ({
                                  ...r,
                                  [design.id]: {
                                    ...r[design.id],
                                    duration: e.target.value,
                                  },
                                }))
                              }
                              className="w-full border rounded-md px-3 py-2 text-sm mt-1 bg-white"
                            >
                              <option value="">Select hours</option>

                              {timeOptions.map((hour) => (
                                <option key={hour} value={hour}>
                                  {hour} hour{hour > 1 ? "s" : ""}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-gray-700">
                              Remark
                            </label>
                            <textarea
                              rows={3}
                              value={reports[design.id]?.remark || ""}
                              onChange={(e) =>
                                setReports((r) => ({
                                  ...r,
                                  [design.id]: {
                                    ...r[design.id],
                                    remark: e.target.value,
                                  },
                                }))
                              }
                              className="w-full border rounded-md px-3 py-2 text-sm mt-1 resize-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-md px-6 py-3 shadow-sm flex items-center justify-between">
            <span className="">{selectedDesigns.length} Designs selected</span>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-sm font-medium transition cursor-pointer">
              Submit Report
            </button>
          </div>
        </>
      )}

      {mode === "team" && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 my-5">
            {/* LEFT : EXECUTIVE LIST */}
            <div className="bg-white border rounded-md flex flex-col h-[520px]">
              <h3 className="font-semibold p-4 border-b shrink-0">
                Team Members
              </h3>

              <div className="flex-1 overflow-y-auto divide-y">
                {teamData.map((emp) => (
                  <div
                    key={emp.empId}
                    onClick={() => setActiveEmp(emp)}
                    className={`p-4 cursor-pointer
          ${
            activeEmp?.empId === emp.empId
              ? "bg-blue-50 border-l-4 border-blue-500"
              : "hover:bg-gray-50"
          }`}
                  >
                    <p className="font-medium">{emp.name}</p>
                    <p className="text-xs text-gray-500">
                      {executiveReports[emp.empId]?.length || 0} Submitted
                      Designs
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT : READ-ONLY EXECUTIVE REPORT */}
            <div className="lg:col-span-2 bg-white border rounded-md flex flex-col h-[520px] p-4">
              {!activeEmp ? (
                <p className="text-gray-500 text-sm">
                  Select a team member to view submitted report
                </p>
              ) : (
                <>
                  <h3 className="font-semibold mb-4 shrink-0">
                    {activeEmp.name}'s Submitted Morning Report
                  </h3>

                  <div className="flex-1 overflow-y-auto pr-1">
                    {(executiveReports[activeEmp.empId] || []).length === 0 ? (
                      <p className="text-sm text-gray-500">
                        No report submitted by this executive
                      </p>
                    ) : (
                      executiveReports[activeEmp.empId].map((item) => (
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
                              <p className="text-gray-500">Planned Time</p>
                              <p className="font-medium">
                                {item.duration} hours
                              </p>
                            </div>

                            <div>
                              <p className="text-gray-500">Remark</p>
                              <p className="font-medium">
                                {item.remark || "—"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* TEAM SUBMIT (ONLY THIS BUTTON) */}
          <div className="bg-white border border-gray-200 rounded-md px-6 py-3 shadow-sm flex justify-end mt-5">
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-sm font-medium transition">
              Submit Team Report
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MorningReporting;

/* ---------- Small Components ---------- */

function StatBlock({ value, label, highlight }) {
  return (
    <div className="text-center">
      <p
        className={`text-lg font-semibold ${
          highlight ? "text-gray-900" : "text-gray-800"
        }`}
      >
        {value}
      </p>
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
    </div>
  );
}
