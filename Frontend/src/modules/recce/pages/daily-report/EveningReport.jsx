import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Target,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Search,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  MapPin,
  Filter,
  Download,
} from "lucide-react";

import SelfTeamToggle from "../../components/SelfTeamToggle";
import PageHeader from "../../../../components/PageHeader";
import { useSelector } from "react-redux";
import DesignSimpleHeader from "@/modules/design/components/designs/DesignSimpleHeader";


const PERCENT = 0.02;

const fmt = (n) =>
  typeof n === "number"
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(n)
    : n;

const durationOptions = Array.from({ length: 16 }, (_, i) => (i + 1) * 0.5);


const EveningReport = () => {
  // Removed viewType and toggle logic
  // Morning data (static mock - expanded with contact info)
  const [morningPlan] = useState({
    date: new Date().toLocaleDateString("hi-IN"),
    recceTeam: "Recce Team A",
    plannedSites: [
      {
        id: 1,
        siteName: "Warehouse Complex A",
        location: "Industrial Area, Lucknow",
        phone: "+91 98765 43210",
        contact: "Rajesh Kumar",
        email: "rajesh@warehouse.com",
        area: 50000,
        timeAllocated: 3,
        actionPlanned: "site inspection",
        notes: "Structural assessment scheduled, high priority",
      },
      {
        id: 2,
        siteName: "Commercial Space B",
        location: "Business Park, Lucknow",
        phone: "+91 87654 32109",
        contact: "Priya Sharma",
        email: "priya@commercial.com",
        area: 25000,
        timeAllocated: 2,
        actionPlanned: "measurement",
        notes: "Detailed measurement work for proposal",
      },
      {
        id: 3,
        siteName: "Retail Store C",
        location: "Shopping Mall, Lucknow",
        phone: "+91 76543 21098",
        contact: "Amit Singh",
        email: "amit@retail.com",
        area: 10000,
        timeAllocated: 1.5,
        actionPlanned: "documentation",
        notes: "Photo and document collection",
      },
      {
        id: 4,
        siteName: "Office Tower D",
        location: "CBD Area, Lucknow",
        phone: "+91 65432 10987",
        contact: "Sunita Gupta",
        email: "sunita@office.com",
        area: 75000,
        timeAllocated: 2.5,
        actionPlanned: "survey",
        notes: "Complete survey and floor plan",
      },
    ],
    totalArea: 160000,
    totalTimeAllocated: 9,
  });

  // All available sites - converted to evening report format
  const [allSites] = useState(
    morningPlan.plannedSites.map((site) => ({
      ...site,
      status: "progress",
      actualArea: site.area,
      timeSpent: site.timeAllocated,
      category: "site_survey",
      type: "internal",
      timeSpentOnSite: site.timeAllocated,
      remark: "",
      photosTaken: Number((site.area * 0.001).toFixed(2)),
      measurementDone: Number((site.area * 0.001).toFixed(2)),
      documentsCollected: Number((site.area * 0.001).toFixed(2)),
      completionReason: "",
      issueReason: "",
      progressNotes: site.notes,
      nextAction: "",
      followUpDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    })),
  );

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
  const selfSites = allSites.filter((_, i) => i % 2 === 0);
  const teamSites = allSites.filter((_, i) => i % 2 !== 0);
  const visibleSites = isManager ? (viewType === "self" ? selfSites : teamSites) : selfSites;

  const [selectedIds, setSelectedIds] = useState([]);
  const [eveningReport, setEveningReport] = useState([]);

  const [siteSearch, setSiteSearch] = useState("");
  const [summaryFilter, setSummaryFilter] = useState("today");
  const [currentSummary, setCurrentSummary] = useState({
    siteTarget: 10,
    siteAch: 8,
    areaTarget: 200000,
    areaAch: 160000,
    docsTarget: 50,
    docsAch: 45,
    photoTarget: 100,
    photoAch: 89,
  });

  // Filter states for the table
  const [tableFilters, setTableFilters] = useState({
    timePeriod: "today",
    category: "all",
    type: "all",
    status: "all",
  });

  // Handle checkbox selection - automatically expand on select
  const pickSite = (siteId, checked) => {
    if (checked) {
      setSelectedIds((p) => [...p, siteId]);
      const site = visibleSites.find((s) => s.id === siteId);
      if (site && !eveningReport.find((r) => r.id === siteId)) {
        // Add site with expand set to true
        setEveningReport((p) => [...p, { ...site, expand: true }]);
      }
    } else {
      setSelectedIds((p) => p.filter((id) => id !== siteId));
      setEveningReport((p) => p.filter((r) => r.id !== siteId));
    }
  };

  // Calculate total work for a site
  const calculateTotalWork = (site) => {
    if (site.status !== "completed") return 0;
    return (
      Number(site.photosTaken || 0) +
      Number(site.measurementDone || 0) +
      Number(site.documentsCollected || 0)
    );
  };

  // Filter the table data based on selected filters
  const getFilteredTableData = () => {
    let filtered = [...eveningReport];

    // Filter by category
    if (tableFilters.category !== "all") {
      filtered = filtered.filter(
        (site) => site.category === tableFilters.category,
      );
    }

    // Filter by type
    if (tableFilters.type !== "all") {
      filtered = filtered.filter((site) => site.type === tableFilters.type);
    }

    // Filter by status
    if (tableFilters.status !== "all") {
      filtered = filtered.filter((site) => site.status === tableFilters.status);
    }

    return filtered;
  };

  const updateSiteReport = (id, field, value) => {
    setEveningReport((prev) =>
      prev.map((site) => {
        if (site.id !== id) return site;

        const updatedSite = { ...site, [field]: value };

        // Recalculate amounts if area changes
        if (field === "actualArea") {
          const actual = Number(value || 0);
          updatedSite.photosTaken = Number((actual * 0.001).toFixed(2));
          updatedSite.measurementDone = Number((actual * 0.001).toFixed(2));
          updatedSite.documentsCollected = Number((actual * 0.001).toFixed(2));
        }

        return updatedSite;
      }),
    );
  };

  const toggleExpand = (id) => {
    setEveningReport((prev) =>
      prev.map((site) =>
        site.id === id ? { ...site, expand: !site.expand } : site,
      ),
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "incomplete":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "progress":
        return <Clock className="w-4 h-4 text-amber-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "border-green-200 bg-green-50";
      case "incomplete":
        return "border-red-200 bg-red-50";
      case "progress":
        return "border-gray-200 bg-white";
      default:
        return "border-gray-200 bg-white";
    }
  };

  const getTotalActualArea = () =>
    eveningReport
      .filter((site) => site.status === "completed")
      .reduce((t, s) => t + Number(s.actualArea || 0), 0);

  const getTotalTimeSpent = () =>
    eveningReport.reduce((t, s) => t + Number(s.timeSpent || 0), 0);

  const getCompletionRate = () => {
    const total = eveningReport.length;
    const completed = eveningReport.filter(
      (s) => s.status === "completed",
    ).length;
    return total ? Math.round((completed / total) * 100) : 0;
  };

  // Calculate total work metrics
  const getTotalWorkMetrics = () => {
    return eveningReport.reduce((total, site) => {
      return total + calculateTotalWork(site);
    }, 0);
  };

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

  const submitEveningReport = () => {
    alert("Evening report submitted successfully.");
  };

  const filteredSites = visibleSites.filter(
    (site) =>
      site.siteName.toLowerCase().includes(siteSearch.toLowerCase()) ||
      site.location.toLowerCase().includes(siteSearch.toLowerCase()) ||
      site.phone.includes(siteSearch),
  );

  // const filteredTableData = getFilteredTableData();

  return (
    <div className="">
              <DesignSimpleHeader title="Evening Reporting"  />
      {isManager && (
        <div className="flex justify-center mb-3">
          <SelfTeamToggle value={viewType} onChange={setViewType} />
        </div>
      )}
      <div className="bg-white border border-gray-200 rounded-md p-2 px-4 mb-4">
        <div className="flex justify-between items-center">
          {/* Left - Date */}
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar className="w-5 h-5 text-gray-700" />
            <span className="text-sm font-medium">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Right - Stats */}
          <div className="flex gap-6">
            <div className="flex flex-col items-center">
              <div className="text-lg font-semibold text-gray-900">
                {visibleSites.length}
              </div>
              <div className="text-[11px] tracking-wide text-gray-500">
                TOTAL SITES
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-lg font-semibold text-gray-900">
                {eveningReport.length}
              </div>
              <div className="text-[11px] tracking-wide text-gray-500">
                SELECTED
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-lg font-semibold text-gray-900">
                {getCompletionRate()}%
              </div>
              <div className="text-[11px] tracking-wide text-gray-500">
                COMPLETION
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-lg font-semibold text-gray-900">
                {getTotalTimeSpent()}h
              </div>
              <div className="text-[11px] tracking-wide text-gray-500">
                TIME SPENT
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* LEFT COLUMN: SITE LIST WITH CHECKBOXES */}
        <div className="col-span-5 bg-white border border-gray-200 rounded-md p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-medium text-gray-900">
              Available Sites ({visibleSites.length})
            </h3>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={siteSearch}
                onChange={(e) => setSiteSearch(e.target.value)}
                className="w-40 text-sm border border-gray-300 rounded pl-8 pr-2 py-1 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
              <Search className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2 max-h-[36rem] overflow-y-auto">
            {filteredSites.map((site) => {
              const picked = selectedIds.includes(site.id);
              const reportSite = eveningReport.find((r) => r.id === site.id);
              const status = reportSite?.status || "progress";

              return (
                <div
                  key={site.id}
                  className={`flex items-start gap-3 p-2 rounded-md border ${
                    picked ? getStatusColor(status) : "border-gray-100"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={picked}
                    onChange={(e) => pickSite(site.id, e.target.checked)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {/* {picked && getStatusIcon(status)} */}
                        <div>
                          <div className="text-base font-medium text-gray-900">
                            {site.siteName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {site.location}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {/* <div className="text-sm font-medium text-gray-900">
                          {fmt(site.area)} sq.ft
                        </div> */}
                        {picked && (
                          <div className="text-xs text-gray-500 capitalize">
                            {status}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-2 text-sm text-gray-700 space-y-1">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span>{site.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <span className="truncate">{site.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span>{site.contact}</span>
                      </div>
                    </div>

                    {picked && (
                      <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
                        <span>
                          Planned: {site.timeAllocated}h • Spent:{" "}
                          {reportSite?.timeSpent || 0}h
                        </span>
                        <button
                          onClick={() => toggleExpand(site.id)}
                          className="p-1"
                        >
                          {reportSite?.expand ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILED REPORT */}
        <div className="col-span-7 bg-white border border-gray-200 rounded-md p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-medium text-gray-900 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Site Details ({eveningReport.length})
            </h3>
            <div className="text-sm text-gray-500">
              {eveningReport.filter((s) => s.expand).length} expanded
            </div>
          </div>

          {eveningReport.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No sites selected. Select sites from left.
            </div>
          ) : (
            <div className="space-y-3 max-h-[36rem] overflow-y-auto">
              {eveningReport
                .filter((site) => site.expand)
                .map((site) => (
                  <div
                    key={site.id}
                    className="border rounded-md p-3 bg-gray-50"
                  >
                    {/* Site Header */}
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <div className="text-lg font-semibold text-gray-900">
                          {site.siteName}
                        </div>
                        <div className="text-sm text-gray-600">
                          {site.location}
                        </div>
                        <div className="text-xs text-gray-500">
                          Planned: {site.actionPlanned} • {site.timeAllocated}h
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm capitalize px-2 py-1 rounded bg-white border">
                          {site.status}
                        </span>
                        <button
                          onClick={() => toggleExpand(site.id)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Form Grid */}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {/* Category */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Category
                        </label>
                        <select
                          value={site.category}
                          disabled
                          className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 bg-gray-50 cursor-not-allowed"
                        >
                          <option value="site_survey">Site Survey</option>
                          <option value="site_inspection">
                            Site Inspection
                          </option>
                          <option value="documentation">Documentation</option>
                          <option value="measurement">Measurement</option>
                        </select>
                      </div>

                      {/* Type */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Type
                        </label>
                        <select
                          value={site.type}
                          disabled
                          className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 bg-gray-50 cursor-not-allowed"
                        >
                          <option value="internal">Internal</option>
                          <option value="external">External</option>
                          <option value="client_site">Client Site</option>
                          <option value="partner_site">Partner Site</option>
                        </select>
                      </div>

                      {/* Time Duration */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Time Duration
                        </label>
                        <select
                          value={site.timeSpentOnSite}
                          disabled
                          className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 bg-gray-50 cursor-not-allowed"
                        >
                          {durationOptions.map((t) => (
                            <option key={t} value={t}>
                              {t}h
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Remark */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Remark
                        </label>
                        <textarea
                          rows={1}
                          value={site.remark}
                          readOnly
                          className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-gray-400 bg-gray-50 cursor-not-allowed"
                          placeholder="Enter any additional remarks..."
                        />
                      </div>

                      {/* Status Block */}
                      <div className="col-span-2 border rounded p-3 bg-white">
                        <div className="grid grid-cols-3 gap-3">
                          {/* Status */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Status
                            </label>
                            <select
                              value={site.status}
                              onChange={(e) =>
                                updateSiteReport(
                                  site.id,
                                  "status",
                                  e.target.value,
                                )
                              }
                              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                            >
                              <option value="progress">In Progress</option>
                              <option value="completed">Completed</option>
                              <option value="incomplete">Incomplete</option>
                            </select>
                          </div>

                          {/* Actual Area */}
                         

                          {/* Time Spent */}
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Time Spent (h)
                            </label>
                            <input
                              type="number"
                              value={site.timeSpent}
                              onChange={(e) =>
                                updateSiteReport(
                                  site.id,
                                  "timeSpent",
                                  e.target.value,
                                )
                              }
                              step="0.5"
                              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Planned: {site.timeAllocated}h
                            </p>
                          </div>
                        </div>

                        {/* Conditional Sections - Completion Remark */}
                        {site.status === "completed" && (
                          <div className="mt-3 pt-3 border-t">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Completion Remark
                              </label>
                              <textarea
                                rows={2}
                                value={site.completionReason}
                                onChange={(e) =>
                                  updateSiteReport(
                                    site.id,
                                    "completionReason",
                                    e.target.value,
                                  )
                                }
                                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-gray-400"
                                placeholder="Enter completion remarks..."
                              />
                            </div>
                          </div>
                        )}

                        {site.status === "incomplete" && (
                          <div className="mt-3 pt-3 border-t">
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Issue Reason
                            </label>
                            <textarea
                              rows={2}
                              value={site.issueReason}
                              onChange={(e) =>
                                updateSiteReport(
                                  site.id,
                                  "issueReason",
                                  e.target.value,
                                )
                              }
                              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-gray-400"
                              placeholder="Enter issue reason..."
                            />
                          </div>
                        )}

                        {site.status === "progress" && (
                          <div className="mt-3 grid grid-cols-2 gap-3 pt-3 border-t">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Progress Notes
                              </label>
                              <textarea
                                value={site.progressNotes}
                                onChange={(e) =>
                                  updateSiteReport(
                                    site.id,
                                    "progressNotes",
                                    e.target.value,
                                  )
                                }
                                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm resize-none"
                                rows={1}
                              />
                            </div>
                            
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

              {eveningReport.filter((s) => s.expand).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Select a site from the left panel to view and edit details
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* FOOTER SUBMIT */}
      {eveningReport.length > 0 && (
        <div className="mt-4 bg-white border border-gray-200 rounded-md p-3 flex items-center justify-between">
          <div>
            <div className="text-base font-medium text-gray-900">
              Report Summary
            </div>
            <div className="text-sm text-gray-600">
              {eveningReport.filter((s) => s.status === "completed").length}{" "}
              completed,{" "}
              {eveningReport.filter((s) => s.status === "incomplete").length}{" "}
              incomplete,{" "}
              {eveningReport.filter((s) => s.status === "progress").length} in
              progress
              {/* {" • "}Total Work: {fmt(getTotalWorkMetrics())} */}
            </div>
          </div>
          <div>
            <button
              onClick={submitEveningReport}
              className="bg-black text-white text-base px-6 py-2 rounded hover:bg-gray-800 transition-colors duration-200"
            >
              Submit Evening Report
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default EveningReport;
