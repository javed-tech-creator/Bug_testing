import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Users,
  User,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import EveningQuotationTeam from "./EveningQuotationTeam";

/* ================= DUMMY DATA ================= */
const dummyEveningQuotationData = [
  {
    id: 1,
    siteName: "Warehouse Complex A",
    location: "Industrial Area, Lucknow",
    category: "quotation",
    type: "internal",

    timeAllocated: 2,
    timeSpent: 2,
    timeSpentOnSite: 2,

    actionPlanned: "Quotation Preparation",

    status: "progress", // progress | completed | incomplete
    completionReason: "",
    issueReason: "",
    progressNotes: "",
    followUpDate: "",

    expand: false,
  },
];

/* ================= COMPONENT ================= */
const EveningQuotationManager = () => {
  const [reportingMode, setReportingMode] = useState("self");
  const [quotationReport, setQuotationReport] = useState(
    dummyEveningQuotationData
  );
  const [search, setSearch] = useState("");
  const [teamReportData, setTeamReportData] = useState(null);

  /* ================= HELPERS ================= */
  const toggleExpand = (id) => {
    setQuotationReport((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, expand: !r.expand } : { ...r, expand: false }
      )
    );
  };

  const updateReport = (id, field, value) => {
    setQuotationReport((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleSubmit = async () => {
    const submitPayload = {
      reportType: "evening",
      selfReport: quotationReport,
      teamReport: teamReportData,
      submittedAt: new Date().toISOString(),
    };

    console.log("Submitting Report:", submitPayload);

    try {
      // TODO: Replace with actual API endpoint
      // const response = await fetch('/api/quotation/evening-report', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(submitPayload)
      // });
      // if (response.ok) {
      //   console.log('Report submitted successfully');
      // }

      alert("Report submitted successfully!");
    } catch (error) {
      console.error("Submit error:", error);
      alert("Error submitting report");
    }
  };

  const getStatusIcon = (status) => {
    if (status === "completed")
      return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    if (status === "incomplete")
      return <XCircle className="w-4 h-4 text-red-600" />;
    return <Clock className="w-4 h-4 text-amber-600" />;
  };

  const filteredReports = quotationReport.filter(
    (r) =>
      r.siteName.toLowerCase().includes(search.toLowerCase()) ||
      r.location.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= UI ================= */
  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader title="Quotation Manager - Evening Report" />

      {/* Toggle */}
      <div className="flex justify-center mb-4">
        <div className="flex bg-gray-100 rounded-md p-1 w-80">
          <button
            onClick={() => setReportingMode("self")}
            className={`flex-1 py-2 text-sm rounded-md ${
              reportingMode === "self" ? "bg-black text-white" : ""
            }`}
          >
            <User className="inline w-4 h-4 mr-1" /> Self
          </button>
          <button
            onClick={() => setReportingMode("team")}
            className={`flex-1 py-2 text-sm rounded-md ${
              reportingMode === "team" ? "bg-black text-white" : ""
            }`}
          >
            <Users className="inline w-4 h-4 mr-1" /> Team
          </button>
        </div>
      </div>

      {reportingMode === "self" ? (
        <div className="grid grid-cols-12 gap-4">
          {/* LEFT */}
          <div className="col-span-5 bg-white border rounded-md p-4">
            <div className="flex justify-between mb-3">
              <h3 className="font-medium">Today’s Quotations</h3>
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

            <div className="space-y-3">
              {filteredReports.map((site) => (
                <div
                  key={site.id}
                  onClick={() => toggleExpand(site.id)}
                  className="border rounded-md p-3 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(site.status)}
                    <div className="flex-1">
                      <div className="font-medium">{site.siteName}</div>
                      <div className="text-sm text-gray-500">
                        {site.location}
                      </div>
                    </div>
                    {site.expand ? <ChevronUp /> : <ChevronDown />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — SAME AS EveningRecceManager */}
          <div className="col-span-7 bg-white border rounded-md p-4">
            {filteredReports.filter((r) => r.expand).length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <AlertCircle className="w-10 h-10 mx-auto mb-3" />
                Select a quotation
              </div>
            ) : (
              filteredReports
                .filter((r) => r.expand)
                .map((site) => (
                  <div key={site.id} className="border rounded-md p-4 bg-gray-50">
                    <div className="mb-3">
                      <div className="text-lg font-semibold">
                        {site.siteName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {site.location}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <label className="text-xs font-medium">Category</label>
                        <input
                          readOnly
                          value={site.category}
                          className="w-full border rounded px-2 py-1 bg-gray-100"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium">Type</label>
                        <input
                          readOnly
                          value={site.type}
                          className="w-full border rounded px-2 py-1 bg-gray-100"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium">
                          Time Duration
                        </label>
                        <input
                          readOnly
                          value={`${site.timeSpentOnSite}h`}
                          className="w-full border rounded px-2 py-1 bg-gray-100"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium">
                          Planned Action
                        </label>
                        <input
                          readOnly
                          value={site.actionPlanned}
                          className="w-full border rounded px-2 py-1 bg-gray-100"
                        />
                      </div>

                      {/* STATUS */}
                      <div>
                        <label className="text-xs font-medium">Status</label>
                        <select
                          value={site.status}
                          onChange={(e) =>
                            updateReport(site.id, "status", e.target.value)
                          }
                          className="w-full border rounded px-2 py-1"
                        >
                          <option value="progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="incomplete">Incomplete</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-medium">
                          Time Spent (h)
                        </label>
                        <input
                          type="number"
                          step="0.5"
                          value={site.timeSpent}
                          onChange={(e) =>
                            updateReport(
                              site.id,
                              "timeSpent",
                              e.target.value
                            )
                          }
                          className="w-full border rounded px-2 py-1"
                        />
                      </div>

                      {site.status === "completed" && (
                        <div className="col-span-2">
                          <label className="text-xs font-medium">
                            Completion Remark
                          </label>
                          <textarea
                            rows={2}
                            value={site.completionReason}
                            onChange={(e) =>
                              updateReport(
                                site.id,
                                "completionReason",
                                e.target.value
                              )
                            }
                            className="w-full border rounded px-2 py-1"
                          />
                        </div>
                      )}

                      {site.status === "incomplete" && (
                        <div className="col-span-2">
                          <label className="text-xs font-medium">
                            Issue Reason
                          </label>
                          <textarea
                            rows={2}
                            value={site.issueReason}
                            onChange={(e) =>
                              updateReport(
                                site.id,
                                "issueReason",
                                e.target.value
                              )
                            }
                            className="w-full border rounded px-2 py-1"
                          />
                        </div>
                      )}

                      {site.status === "progress" && (
                        <>
                          <div className="col-span-2">
                            <label className="text-xs font-medium">
                              Progress Notes
                            </label>
                            <textarea
                              rows={1}
                              value={site.progressNotes}
                              onChange={(e) =>
                                updateReport(
                                  site.id,
                                  "progressNotes",
                                  e.target.value
                                )
                              }
                              className="w-full border rounded px-2 py-1"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-medium">
                              Follow-up Date
                            </label>
                            <input
                              type="date"
                              value={site.followUpDate}
                              onChange={(e) =>
                                updateReport(
                                  site.id,
                                  "followUpDate",
                                  e.target.value
                                )
                              }
                              className="w-full border rounded px-2 py-1"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      ) : (
        <EveningQuotationTeam onDataChange={setTeamReportData} />
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

export default EveningQuotationManager;
