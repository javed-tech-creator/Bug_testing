import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  Search,
  Users,
  User,
  Target,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import MorningTeam from "./MorningTeam";

/* -------- SAME DATA AS MorningReport -------- */
const staticSites = [
  {
    id: 1,
    siteName: "Warehouse Complex A",
    location: "Industrial Area, Lucknow",
    phone: "+91 98765 43210",
    contact: "Rajesh Kumar",
    email: "rajesh@warehouse.com",
    area: 50000,
    lastVisit: "2 days ago",
  },
  {
    id: 2,
    siteName: "Commercial Space B",
    location: "Business Park, Lucknow",
    phone: "+91 87654 32109",
    contact: "Priya Sharma",
    email: "priya@commercial.com",
    area: 25000,
    lastVisit: "1 week ago",
  },
  {
    id: 3,
    siteName: "Retail Store C",
    location: "Shopping Mall, Lucknow",
    phone: "+91 76543 21098",
    contact: "Amit Singh",
    email: "amit@retail.com",
    area: 10000,
    lastVisit: "3 days ago",
  },
];

const durationOptions = Array.from({ length: 16 }, (_, i) => (i + 1) * 0.5);

/* -------- Component -------- */
const MorningRecceManager = () => {
  const [now, setNow] = useState(new Date());
  const [reportingMode, setReportingMode] = useState("self");
  const [selectedIds, setSelectedIds] = useState([]);
  const [planRows, setPlanRows] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [search, setSearch] = useState("");
  const [teamReportData, setTeamReportData] = useState(null);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  /* -------- Handlers -------- */
  const pickSite = (id, checked) => {
    if (checked) {
      const site = staticSites.find((s) => s.id === id);
      if (!site) return;

      setSelectedIds((p) => [...p, id]);
      setPlanRows((p) => [
        ...p,
        {
          ...site,
          category: "site_survey",
          type: "internal",
          timeSpentOnSite: 1,
          remark: "",
        },
      ]);
    } else {
      setSelectedIds((p) => p.filter((x) => x !== id));
      setPlanRows((p) => p.filter((r) => r.id !== id));
    }
  };

  const updateRow = (id, field, value) => {
    setPlanRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleSubmit = async () => {
    const submitPayload = {
      reportType: "morning",
      selfReport: planRows,
      teamReport: teamReportData,
      submittedAt: new Date().toISOString(),
    };

    console.log("Submitting Morning Recce Report:", submitPayload);

    try {
      // TODO: Replace with actual API endpoint
      // const response = await fetch('/api/recce/morning-report', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(submitPayload)
      // });
      // if (response.ok) {
      //   console.log('Report submitted successfully');
      // }

      alert("Morning recce report submitted successfully!");
    } catch (error) {
      console.error("Submit error:", error);
      alert("Error submitting report");
    }
  };

  /* -------- UI -------- */
  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader title="Recce Manager - Morning Planning" />

      {/* Toggle */}
      <div className="flex justify-center mb-4">
        <div className="relative flex w-96 bg-gray-100 rounded-md p-1">
          <div
            className={`absolute top-1 bottom-1 bg-black rounded-md transition-all ${
              reportingMode === "self"
                ? "left-1 right-1/2"
                : "left-1/2 right-1"
            }`}
          />
          <div className="relative flex w-full">
            <button
              onClick={() => setReportingMode("self")}
              className={`flex-1 py-2 text-sm font-medium flex items-center justify-center gap-2 ${
                reportingMode === "self" ? "text-white" : ""
              }`}
            >
              <User className="w-4 h-4" />
              Self
            </button>
            <button
              onClick={() => setReportingMode("team")}
              className={`flex-1 py-2 text-sm font-medium flex items-center justify-center gap-2 ${
                reportingMode === "team" ? "text-white" : ""
              }`}
            >
              <Users className="w-4 h-4" />
              Team
            </button>
          </div>
        </div>
      </div>

      {/* Time Bar */}
      <div className="bg-white border rounded-md p-4 mb-4 flex justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          {now.toLocaleDateString("en-IN")} •{" "}
          {now.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
        <div className="text-sm">{planRows.length} Sites Planned</div>
      </div>

      {reportingMode === "self" ? (
        <div className="grid grid-cols-12 gap-4">
          {/* LEFT: Sites */}
          <div className="col-span-5 bg-white border rounded-md p-4">
            <div className="flex justify-between mb-3">
              <h3 className="font-medium">Assigned Sites</h3>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  className="pl-8 border rounded-md text-sm px-2 py-1"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              {staticSites
                .filter(
                  (s) =>
                    s.siteName.toLowerCase().includes(search.toLowerCase()) ||
                    s.location.toLowerCase().includes(search.toLowerCase())
                )
                .map((site) => (
                  <div key={site.id} className="border rounded-md p-3 flex gap-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(site.id)}
                      onChange={(e) =>
                        pickSite(site.id, e.target.checked)
                      }
                    />
                    <div>
                      <div className="font-medium">{site.siteName}</div>
                      <div className="text-sm text-gray-500">
                        {site.location}
                      </div>
                      <div className="text-xs text-gray-400">
                        Last visit: {site.lastVisit}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* RIGHT: SAME AS MorningReport */}
          <div className="col-span-7 bg-white border rounded-md p-4">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Target className="w-4 h-4" /> Today’s Plan ({planRows.length})
            </h3>

            {planRows.length === 0 ? (
              <div className="text-center text-gray-400 py-16">
                No sites selected
              </div>
            ) : (
              <div className="space-y-4">
                {planRows.map((r) => (
                  <div key={r.id} className="border rounded-md p-3">
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() =>
                        setExpanded((p) => ({
                          ...p,
                          [r.id]: !p[r.id],
                        }))
                      }
                    >
                      <div>
                        <div className="font-medium">{r.siteName}</div>
                        <div className="text-sm text-gray-500">
                          {r.location}
                        </div>
                      </div>
                      {expanded[r.id] ? <ChevronUp /> : <ChevronDown />}
                    </div>

                    {expanded[r.id] && (
                      <div
                        className="mt-3 border rounded-md p-3 bg-gray-50"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <label className="block text-xs font-medium mb-1">
                              Category
                            </label>
                            <select
                              value={r.category}
                              onChange={(e) =>
                                updateRow(r.id, "category", e.target.value)
                              }
                              className="w-full border rounded px-2 py-1.5"
                            >
                              <option value="site_survey">Site Survey</option>
                              <option value="inspection">Inspection</option>
                              <option value="measurement">Measurement</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-medium mb-1">
                              Type
                            </label>
                            <select
                              value={r.type}
                              onChange={(e) =>
                                updateRow(r.id, "type", e.target.value)
                              }
                              className="w-full border rounded px-2 py-1.5"
                            >
                              <option value="internal">Internal</option>
                              <option value="external">External</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-medium mb-1">
                              Time Duration
                            </label>
                            <select
                              value={r.timeSpentOnSite}
                              onChange={(e) =>
                                updateRow(
                                  r.id,
                                  "timeSpentOnSite",
                                  Number(e.target.value)
                                )
                              }
                              className="w-full border rounded px-2 py-1.5"
                            >
                              {durationOptions.map((t) => (
                                <option key={t} value={t}>
                                  {t}h
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-medium mb-1">
                              Remark
                            </label>
                            <textarea
                              rows={1}
                              value={r.remark}
                              onChange={(e) =>
                                updateRow(r.id, "remark", e.target.value)
                              }
                              className="w-full border rounded px-2 py-1.5 resize-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <MorningTeam onDataChange={setTeamReportData} />
      )}

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          className="px-5 py-2 bg-black text-white rounded-md hover:bg-gray-900"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default MorningRecceManager;
