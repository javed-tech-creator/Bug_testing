import React, { useState, useMemo } from "react";
import { Clock, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";

const projectsData = [
  {
    id: "PRJ-001",
    name: "Office Digital Signage Rollout",
    client: "Acme Corp",
    startedAt: "2025-09-01T09:00:00Z",
    phases: [
      {
        key: "sales",
        title: "Sales",
        status: "completed",
        startedAt: "2025-09-01T09:00:00Z",
        finishedAt: "2025-09-03T15:00:00Z",
        percent: 100,
        subphases: [
          { id: "s1", name: "Client Briefing", status: "done", durationHrs: 8 },
          { id: "s2", name: "Proposal Sent", status: "done", durationHrs: 4 },
          { id: "s3", name: "Send to Recce", status: "done", durationHrs: 2 },
        ],
      },
      {
        key: "recce",
        title: "Recce",
        status: "completed",
        startedAt: "2025-09-04T10:00:00Z",
        finishedAt: "2025-09-05T12:00:00Z",
        percent: 100,
        subphases: [
          { id: "r1", name: "Site Visit", status: "done", durationHrs: 5 },
          { id: "r2", name: "Measurements", status: "done", durationHrs: 6 },
        ],
      },
      {
        key: "design",
        title: "Design",
        status: "inprogress",
        startedAt: "2025-09-06T09:00:00Z",
        finishedAt: null,
        percent: 65,
        subphases: [
          { id: "d1", name: "Initial Draft", status: "done", durationHrs: 10 },
          { id: "d2", name: "Client Review", status: "pending", durationHrs: 0 },
          { id: "d3", name: "Final Design (PR Manual)", status: "pending", durationHrs: 0 },
        ],
      },
    ],
  },
  {
    id: "PRJ-002",
    name: "Digital Signage Rollout",
    client: "Acme Corp",
    startedAt: "2025-10-01T09:00:00Z",
    phases: [
      {
        key: "sales",
        title: "Sales",
        status: "completed",
        startedAt: "2025-09-01T09:00:00Z",
        finishedAt: "2025-09-03T15:00:00Z",
        percent: 100,
        subphases: [
          { id: "s1", name: "Client Briefing", status: "done", durationHrs: 8 },
          { id: "s2", name: "Proposal Sent", status: "done", durationHrs: 4 },
          { id: "s3", name: "Send to Recce", status: "done", durationHrs: 2 },
        ],
      },
      {
        key: "recce",
        title: "Recce",
        status: "completed",
        startedAt: "2025-09-04T10:00:00Z",
        finishedAt: "2025-09-05T12:00:00Z",
        percent: 100,
        subphases: [
          { id: "r1", name: "Site Visit", status: "done", durationHrs: 5 },
          { id: "r2", name: "Measurements", status: "done", durationHrs: 6 },
        ],
      },
      {
        key: "design",
        title: "Design",
        status: "inprogress",
        startedAt: "2025-09-06T09:00:00Z",
        finishedAt: null,
        percent: 15,
        subphases: [
          { id: "d1", name: "Initial Draft", status: "done", durationHrs: 10 },
          { id: "d2", name: "Client Review", status: "pending", durationHrs: 0 },
          { id: "d3", name: "Final Design (PR Manual)", status: "pending", durationHrs: 0 },
        ],
      },
    ],
  },
];

const formatDuration = (hours) => {
  if (!hours && hours !== 0) return "-";
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  if (hours < 24) return `${Math.round(hours)}h`;
  const days = Math.floor(hours / 24);
  const rem = Math.round(hours % 24);
  return `${days}d ${rem}h`;
};

const ProjectTrackingMain = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activePhaseKey, setActivePhaseKey] = useState(null);
  const [openSubs, setOpenSubs] = useState({});

  const toggleSubs = (key) => setOpenSubs((p) => ({ ...p, [key]: !p[key] }));

  const project = selectedProject;
  const totalTimePerPhase = useMemo(() => {
    if (!project) return {};
    const map = {};
    project.phases.forEach((ph) => {
      const hrs = ph.subphases.reduce((s, sp) => s + (sp.durationHrs || 0), 0);
      map[ph.key] = hrs;
    });
    return map;
  }, [project]);

  // List view
  if (!project)
    return (
      <div className=" bg-white  -z-10">
        <div className="">
          <h1 className="text-xl font-semibold mb-3 text-gray-700">Project Tracking</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projectsData.map((proj) => (
              <div
                key={proj.id}
                className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
                onClick={() => {
                  setSelectedProject(proj);
                  setActivePhaseKey(
                    proj.phases.find((p) => p.status !== "completed")?.key ||
                      proj.phases[0].key
                  );
                }}
              >
               <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg text-gray-900">{proj.name}</h3>
              <span className="text-xs bg-black text-white px-2 py-0.5 rounded">
                {proj.id}
              </span>
            </div>

            <div className="font-medium mb-1">
             Project Started:  <span className="text-gray-700">{proj.startedAt}</span> 
            </div>
                <div className="w-full bg-gray-100 rounded h-2 overflow-hidden mb-2">
                  <div
                    className="h-full bg-orange-500"
                    style={{
                      width: `${Math.round(
                        proj.phases.reduce((s, p) => s + p.percent, 0) /
                          proj.phases.length
                      )}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Progress:{" "}
                  {Math.round(
                    proj.phases.reduce((s, p) => s + p.percent, 0) /
                      proj.phases.length
                  )}
                  %
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

  // Detail view
  return (
    <div className=" bg-white p-4 -z-10">
      <div className="">
        <button
          className="flex items-center text-sm text-gray-600 mb-4 hover:text-gray-700"
          onClick={() => setSelectedProject(null)}
        >
          <ArrowLeft size={16} className="mr-2" /> Back to Projects
        </button>

        {/* Header */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-700">{project.name}</h1>
              <p className="text-sm text-gray-700">
                Code: <span className="font-medium">{project.id}</span> · Client:{" "}
                <span className="font-medium">{project.client}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Started</p>
              <p className="text-sm font-medium text-gray-700">
                {new Date(project.startedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200 mb-6">
          <h2 className="text-lg font-medium text-gray-700 mb-3">Project Timeline</h2>
          <div className="flex items-center gap-4 overflow-x-auto py-2 px-1">
            {[
              { key: "sales", title: "Sales", status: "completed" },
              { key: "recce", title: "Recce", status: "completed" },
              { key: "design", title: "Design", status: "inprogress" },
              { key: "production", title: "Production", status: "pending" },
              { key: "warehouse", title: "Warehouse", status: "pending" },
              { key: "installation", title: "Installation", status: "pending" },
            ].map((ph, idx, arr) => {
              const isActive = ph.key === activePhaseKey;
              const next = arr[idx + 1];
              return (
                <div key={ph.key} className="flex justify-center items-center">
                  <button
                    onClick={() => setActivePhaseKey(ph.key)}
                    className="group flex flex-col items-center"
                  >
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center shadow-sm border transition-transform duration-200 group-hover:scale-105 ${
                        ph.status === "completed"
                          ? "bg-black text-white border-black"
                          : ph.status === "inprogress"
                          ? "bg-orange-500 text-white border-orange-500 animate-pulse"
                          : "bg-white text-gray-700 border-gray-300"
                      }`}
                    >
                      <span className="text-sm font-semibold">
                        {ph.title.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div
                      className={`mt-2 text-xs ${
                        isActive ? "text-orange-600 font-medium" : "text-gray-700"
                      }`}
                    >
                      {ph.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatDuration(totalTimePerPhase[ph.key])}
                    </div>
                  </button>
                  {next && (
                    <div className="w-16 h-0.5 bg-gray-200 mx-3">
                      <div
                        className={`h-0.5 ${
                          ph.status === "completed" ? "bg-black w-full" : "bg-gray-200 w-full"
                        }`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Phase */}
        {project && (
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-700">
                  {project.phases.find((p) => p.key === activePhaseKey)?.title}
                </h3>
                <p className="text-sm text-gray-700 mt-1">
                  Status:{" "}
                  <span className="font-medium text-gray-700">
                    {project.phases.find((p) => p.key === activePhaseKey)?.status}
                  </span>{" "}
                  · Completion:{" "}
                  <span className="font-medium text-gray-700">
                    {project.phases.find((p) => p.key === activePhaseKey)?.percent}%
                  </span>
                </p>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">Time spent</div>
                <div className="text-sm font-medium text-gray-700">
                  <Clock className="inline mr-2" size={14} />{" "}
                  {formatDuration(totalTimePerPhase[activePhaseKey])}
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                {project.phases
                  .find((p) => p.key === activePhaseKey)
                  ?.subphases.map((sp) => (
                    <div
                      key={sp.id}
                      className="border rounded-md p-3 flex justify-between items-center hover:shadow-sm transition"
                    >
                      <div>
                        <div className="text-sm font-medium text-gray-700">{sp.name}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {sp.status === "done"
                            ? "Completed"
                            : sp.status === "pending"
                            ? "Pending"
                            : "In progress"}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-700">
                          {formatDuration(sp.durationHrs)}
                        </div>
                        <div className="text-xs text-gray-500">time</div>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="space-y-3">
                <div className="p-3 border rounded-md">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleSubs(activePhaseKey)}
                  >
                    <div className="text-sm font-medium text-gray-700">
                      Detailed activity log
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      <span>{openSubs[activePhaseKey] ? "Hide" : "Show"}</span>
                      {openSubs[activePhaseKey] ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </div>
                  </div>

                  {openSubs[activePhaseKey] && (
                    <div className="mt-3 space-y-2 text-sm text-gray-700">
                      <div className="flex justify-between">
                        <div>Initial brief completed</div>
                        <div className="text-gray-500">2025-09-01 11:00</div>
                      </div>
                      <div className="flex justify-between">
                        <div>Site visit and measurements</div>
                        <div className="text-gray-500">2025-09-04 15:20</div>
                      </div>
                      <div className="flex justify-between">
                        <div>Design draft uploaded</div>
                        <div className="text-gray-500">2025-09-06 14:10</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 px-4 py-2 bg-white border rounded text-sm hover:bg-gray-50">
                    Add Note
                  </button>
                  <button className="px-4 py-2 bg-black text-white rounded text-sm hover:bg-orange-600 transition">
                    Mark Step Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Overall Progress */}
        <div className="mt-6 bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Overall project progress</div>
              <div className="text-lg font-medium text-gray-700 mt-1">
                {Math.round(
                  project.phases.reduce((s, p) => s + p.percent, 0) /
                    project.phases.length
                )}
                %
              </div>
            </div>
            <div className="w-2/3">
              <div className="h-3 bg-gray-200 rounded overflow-hidden">
                <div
                  style={{
                    width: `${Math.round(
                      project.phases.reduce((s, p) => s + p.percent, 0) /
                        project.phases.length
                    )}%`,
                  }}
                  className="h-full bg-orange-500 transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectTrackingMain;
