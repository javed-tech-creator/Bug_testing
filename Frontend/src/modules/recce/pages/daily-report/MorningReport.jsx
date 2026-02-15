import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Target,
  Search,
} from "lucide-react";
import PageHeader from "../../../../components/PageHeader";
import SelfTeamToggle from "../../components/SelfTeamToggle";
import { useSelector } from "react-redux";
import DesignSimpleHeader from "@/modules/design/components/designs/DesignSimpleHeader";


const fmt = (n) =>
  typeof n === "number"
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(n)
    : n;

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
  {
    id: 4,
    siteName: "Office Tower D",
    location: "CBD Area, Lucknow",
    phone: "+91 65432 10987",
    contact: "Sunita Gupta",
    email: "sunita@office.com",
    area: 75000,
    lastVisit: "5 days ago",
  },
  {
    id: 5,
    siteName: "Factory Space E",
    location: "Industrial Zone, Lucknow",
    phone: "+91 54321 09876",
    contact: "Vikash Yadav",
    email: "vikash@factory.com",
    area: 100000,
    lastVisit: "1 day ago",
  },
  {
    id: 6,
    siteName: "Service Center F",
    location: "Downtown, Lucknow",
    phone: "+91 43210 98765",
    contact: "Neha Agarwal",
    email: "neha@service.com",
    area: 5000,
    lastVisit: "4 days ago",
  },
];


const durationOptions = Array.from({ length: 16 }, (_, i) => (i + 1) * 0.5);

const completionReasons = [
  "Site inspection complete",
  "Measurements done",
  "Photos captured",
  "Client approval received",
  "Documents collected",
  "Survey finalized",
  "Ready for proposal",
];

const issueReasons = [
  "Access denied",
  "Bad weather",
  "Client unavailable",
  "Equipment issue",
  "Incomplete info",
  "Safety concern",
  "Rescheduled",
];

const MorningReport = () => {
  // Role-based toggle logic
  const res = useSelector((state) => state.auth.userData);
  const user = res?.user || {};
  const role = user?.designation?.title?.toLowerCase();
  const normalizedRole =
    {
      executive: "executive",
      "recce executive": "executive",
      manager: "manager",
      "recce manager": "manager",
      hod: "manager",
      "recce hod": "manager",
    }[role] || "executive";
  const isManager = normalizedRole === "manager";

  const [viewType, setViewType] = useState("self");
  const selfSites = staticSites.filter((_, i) => i % 2 === 0);
  const teamSites = staticSites.filter((_, i) => i % 2 !== 0);
  const visibleSites = isManager ? (viewType === "self" ? selfSites : teamSites) : selfSites;

  const [now, setNow] = useState(new Date());
  const [expanded, setExpanded] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);
  const [planRows, setPlanRows] = useState([]);
  const [siteSearch, setSiteSearch] = useState("");

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);


  const pickSite = (siteId, checked) => {
    if (checked) {
      const site = visibleSites.find((s) => s.id === siteId);
      if (!site) return;

      const area = site.area || 0;
      const derived = {
        photosTarget: Number((area * 0.001).toFixed(2)),
        measurementTarget: Number((area * 0.001).toFixed(2)),
        docsTarget: Number((area * 0.001).toFixed(2)),
      };

      setSelectedIds((p) => [...p, siteId]);
      setPlanRows((p) => [
        ...p,
        {
          ...site,
          category: "site_survey",
          type: "internal",
          area,
          actualArea: area,
          photosTaken: derived.photosTarget,
          measurementDone: derived.measurementTarget,
          documentsCollected: derived.docsTarget,
          timeAllocated: 1,
          timeSpent: 1,
          timeSpentOnSite: 1,
          status: "progress",
          actionRequired: "survey",
          remark: "",
          completionReason: "",
          issueReason: "",
          progressNotes: "",
          nextAction: "",
          followUpDate: new Date().toISOString().split("T")[0],
          expand: true,
        },
      ]);
    } else {
      setSelectedIds((p) => p.filter((id) => id !== siteId));
      setPlanRows((p) => p.filter((r) => r.id !== siteId));
    }
  };

  const updateRow = (id, field, value) => {
    setPlanRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    );
  };

  const totalArea = planRows.reduce((s, r) => s + Number(r.area || 0), 0);
  const totalPhotos = planRows.reduce(
    (s, r) => s + Number(r.photosTarget || 0),
    0,
  );

  return (
    <div className="">
      <DesignSimpleHeader title="Morning Reporting" />
      {isManager && (
        <div className="flex justify-center mb-3">
          <SelfTeamToggle value={viewType} onChange={setViewType} />
        </div>
      )}

      {/* Header Stats */}
      <div className="">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <span className="text-sm font-medium">
              {now.toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="flex gap-6">
            <div className="text-center">
              <div className="text-lg font-semibold">{visibleSites.length}</div>
              <div className="text-xs text-gray-500">TOTAL SITES</div>
            </div>

            <div className="text-center">
              <div className="text-lg font-semibold">{planRows.length}</div>
              <div className="text-xs text-gray-500">SELECTED</div>
            </div>

            {/* <div className="text-center">
              <div className="text-lg font-semibold">
                {fmt(totalArea)} sq.ft
              </div>
              <div className="text-xs text-gray-500">TOTAL AREA</div>
            </div> */}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Sites */}
        <div className="col-span-5 bg-white border rounded-md p-3">
          <div className="flex justify-between mb-3">
            <h3 className="font-medium">
              Available Sites ({visibleSites.length})
            </h3>

            <div className="relative">
              <input
                value={siteSearch}
                onChange={(e) => setSiteSearch(e.target.value)}
                placeholder="Search..."
                className="border rounded-md pl-8 pr-2 py-1 text-sm"
              />
              <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2 max-h-[36rem] overflow-y-auto">
            {visibleSites
              .filter(
                (s) =>
                  s.siteName.toLowerCase().includes(siteSearch.toLowerCase()) ||
                  s.location.toLowerCase().includes(siteSearch.toLowerCase()) ||
                  s.phone.includes(siteSearch),
              )
              .map((site) => (
                <div key={site.id} className="border rounded-md p-2 flex gap-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(site.id)}
                    onChange={(e) => pickSite(site.id, e.target.checked)}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{site.siteName}</div>
                    <div className="text-sm text-gray-500">{site.location}</div>
                    <div className="text-xs text-gray-400">
                      {site.lastVisit}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Plan */}
        <div className="col-span-7 bg-white border rounded-md p-3">
          <h3 className="font-medium mb-2">Today’s Plan ({planRows.length})</h3>

          {planRows.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No sites selected
            </div>
          ) : (
            <div className="space-y-3">
              {planRows.map((r) => (
                <div key={r.id} className="border p-3 rounded-md">
                  <div
                    className="flex justify-between items-center cursor-pointer select-none"
                    onClick={() =>
                      setExpanded((p) => ({
                        ...p,
                        [r.id]: !p[r.id],
                      }))
                    }
                  >
                    <div>
                      <div className="font-medium">{r.siteName}</div>
                      <div className="text-sm text-gray-500">{r.location}</div>
                    </div>
                    <div className="p-1">
                      {expanded[r.id] ? <ChevronUp /> : <ChevronDown />}
                    </div>
                  </div>

                  {expanded[r.id] && (
                    <div
                      className="mt-3 border rounded-md p-3 bg-gray-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="grid grid-cols-2 gap-3 text-sm">

                        {/* Category */}
                        <div>
                          <label className="block text-xs font-medium mb-1">Category</label>
                          <select
                            value={r.category}
                            onChange={(e) => updateRow(r.id, "category", e.target.value)}
                            className="w-full border rounded px-2 py-1.5"
                          >
                            <option value="site_survey">Site Survey</option>
                            <option value="site_inspection">Site Inspection</option>
                            <option value="documentation">Documentation</option>
                            <option value="measurement">Measurement</option>
                          </select>
                        </div>

                        {/* Type */}
                        <div>
                          <label className="block text-xs font-medium mb-1">Type</label>
                          <select
                            value={r.type}
                            onChange={(e) => updateRow(r.id, "type", e.target.value)}
                            className="w-full border rounded px-2 py-1.5"
                          >
                            <option value="internal">Internal</option>
                            <option value="external">External</option>
                          </select>
                        </div>

                        {/* Time Duration */}
                        <div>
                          <label className="block text-xs font-medium mb-1">
                            Time Duration
                          </label>
                          <select
                            value={r.timeSpentOnSite}
                            onChange={(e) =>
                              updateRow(r.id, "timeSpentOnSite", Number(e.target.value))
                            }
                            className="w-full border rounded px-2 py-1.5"
                          >
                            {durationOptions.map((t) => (
                              <option key={t} value={t}>{t}h</option>
                            ))}
                          </select>
                        </div>

                        {/* Remark */}
                        <div>
                          <label className="block text-xs font-medium mb-1">Remark</label>
                          <textarea
                            rows={1}
                            value={r.remark}
                            onChange={(e) => updateRow(r.id, "remark", e.target.value)}
                            className="w-full border rounded px-2 py-1.5 resize-none"
                          />
                        </div>

                        {/* Status Section - Commented Out */}
                        {/* 
                        <div className="col-span-2 border rounded p-3 bg-white">
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-medium mb-1">Status</label>
                              <select
                                value={r.status}
                                onChange={(e) => updateRow(r.id, "status", e.target.value)}
                                className="w-full border rounded px-2 py-1.5"
                              >
                                <option value="progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="incomplete">Incomplete</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-medium mb-1">
                                Actual Area
                              </label>
                              <input
                                type="number"
                                value={r.actualArea}
                                onChange={(e) =>
                                  updateRow(r.id, "actualArea", e.target.value)
                                }
                                className="w-full border rounded px-2 py-1.5"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium mb-1">
                                Time Spent (h)
                              </label>
                              <input
                                type="number"
                                step="0.5"
                                value={r.timeSpent}
                                onChange={(e) =>
                                  updateRow(r.id, "timeSpent", e.target.value)
                                }
                                className="w-full border rounded px-2 py-1.5"
                              />
                            </div>
                          </div>

                          {r.status === "completed" && (
                            <div className="mt-3 grid grid-cols-2 gap-3 pt-3 border-t">
                              <div>
                                <label className="block text-xs font-medium mb-1">
                                  Completion Reason
                                </label>
                                <select
                                  value={r.completionReason}
                                  onChange={(e) =>
                                    updateRow(r.id, "completionReason", e.target.value)
                                  }
                                  className="w-full border rounded px-2 py-1.5"
                                >
                                  <option value="">Select reason...</option>
                                  {completionReasons.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-medium mb-1">
                                  Next Action
                                </label>
                                <input
                                  value={r.nextAction}
                                  onChange={(e) =>
                                    updateRow(r.id, "nextAction", e.target.value)
                                  }
                                  className="w-full border rounded px-2 py-1.5"
                                />
                              </div>
                            </div>
                          )}

                          {r.status === "incomplete" && (
                            <div className="mt-3 pt-3 border-t">
                              <label className="block text-xs font-medium mb-1">
                                Issue Reason
                              </label>
                              <select
                                value={r.issueReason}
                                onChange={(e) =>
                                  updateRow(r.id, "issueReason", e.target.value)
                                }
                                className="w-full border rounded px-2 py-1.5"
                              >
                                <option value="">Select reason...</option>
                                {issueReasons.map((i) => (
                                  <option key={i} value={i}>{i}</option>
                                ))}
                              </select>
                            </div>
                          )}

                          {r.status === "progress" && (
                            <div className="mt-3 grid grid-cols-2 gap-3 pt-3 border-t">
                              <div>
                                <label className="block text-xs font-medium mb-1">
                                  Progress Notes
                                </label>
                                <textarea
                                  rows={1}
                                  value={r.progressNotes}
                                  onChange={(e) =>
                                    updateRow(r.id, "progressNotes", e.target.value)
                                  }
                                  className="w-full border rounded px-2 py-1.5 resize-none"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium mb-1">
                                  Follow-up Date
                                </label>
                                <input
                                  type="date"
                                  value={r.followUpDate}
                                  onChange={(e) =>
                                    updateRow(r.id, "followUpDate", e.target.value)
                                  }
                                  className="w-full border rounded px-2 py-1.5"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        */}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {planRows.length > 0 && (
        <div className="mt-4 flex justify-between bg-white border rounded-md p-3">
          <div>
            <div className="font-medium">{planRows.length} sites selected</div>
            {/* <div className="text-sm text-gray-500">
              Total Area: {fmt(totalArea)} sq.ft • Photos: {fmt(totalPhotos)}
            </div> */}
          </div>

          <button className="bg-black text-white px-4 py-2 rounded">
            Submit Plan
          </button>
        </div>
      )}
    </div>
  );
};

export default MorningReport;
