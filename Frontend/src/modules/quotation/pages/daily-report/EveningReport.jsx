import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  AlertCircle,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Target,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";

const PERCENT = 0.02;

const fmt = (n) =>
  typeof n === "number"
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(n)
    : n;

/* ---------------- STATIC MORNING LEADS ---------------- */
const STATIC_MORNING_LEADS = [
  {
    id: "lead001",
    Projectname: "Signage Installation",
    company: "Tech Solutions Pvt Ltd",
    expectedAmount: 500000,
    timeAllocated: 2,
  },
  {
    id: "lead002",
    Projectname: "Digital Marketing Campaign",
    company: "Digital Marketing Hub",
    expectedAmount: 250000,
    timeAllocated: 1.5,
  },
  {
    id: "lead003",
    Projectname: "Export Logistics",
    company: "Global Exports Ltd",
    expectedAmount: 800000,
    timeAllocated: 3,
  },
];

const EveningReport = () => {
  const [now, setNow] = useState(new Date());
  const [leadSearch, setLeadSearch] = useState("");
  const [eveningReport, setEveningReport] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedIds, setSelectedIds] = useState([]);
  const [workRows, setWorkRows] = useState([]);

  /* ---------------- INIT DATA ---------------- */
  useEffect(() => {
    const mapped = STATIC_MORNING_LEADS.map((l, index) => ({
      ...l,
      actualAmount: l.expectedAmount,
      timeSpent: l.timeAllocated,
      status: "",
      checked: false,

      leadAmount: +(l.expectedAmount * PERCENT).toFixed(2),
      dealAmount: +(l.expectedAmount * PERCENT).toFixed(2),
      relationAmount: +(l.expectedAmount * PERCENT).toFixed(2),

      remark: "",
      expand: index === 0,
    }));

    setEveningReport(mapped);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  /* ---------------- HELPERS ---------------- */
  const updateLead = (id, field, value) => {
    setEveningReport((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l;
        const updated = { ...l, [field]: value };

        if (field === "actualAmount") {
          const amt = Number(value || 0);
          updated.leadAmount = +(amt * PERCENT).toFixed(2);
          updated.dealAmount = +(amt * PERCENT).toFixed(2);
          updated.relationAmount = +(amt * PERCENT).toFixed(2);
        }

        return updated;
      })
    );
  };

  const toggleExpand = (id) => {
    setEveningReport((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, expand: !l.expand } : { ...l, expand: false }
      )
    );
  };

  const toggleCheck = (id, value) => {
    setEveningReport((prev) =>
      prev.map((l) => (l.id === id ? { ...l, checked: value } : l))
    );
  };

  const pickLead = (leadId, checked) => {
    if (checked) {
      const lead = STATIC_MORNING_LEADS.find((l) => l.id === leadId);
      setSelectedIds((p) => [...p, leadId]);
      setWorkRows((p) => [
        ...p,
        {
          _id: lead.id,
          projectName: lead.Projectname,
          companyName: lead.company,
          timeAllocated: lead.timeAllocated,
          timeSpent: lead.timeAllocated,
          status: "",
          remark: "",
        },
      ]);
    } else {
      setSelectedIds((p) => p.filter((id) => id !== leadId));
      setWorkRows((p) => p.filter((r) => r._id !== leadId));
    }
  };

  // ...existing code...

  const statusIcon = (s) =>
    s === "completed" ? (
      <CheckCircle2 className="w-4 h-4 text-green-600" />
    ) : s === "pending" ? (
      <Clock className="w-4 h-4 text-amber-600" />
    ) : (
      <XCircle className="w-4 h-4 text-gray-400" />
    );

  const filtered = eveningReport.filter(
    (l) =>
      l.Projectname.toLowerCase().includes(leadSearch.toLowerCase()) ||
      l.company.toLowerCase().includes(leadSearch.toLowerCase())
  );

  const selectedLeads = eveningReport.filter(
    (l) => l.checked && (l.status === "completed" || l.status === "pending")
  );

  const totalExpected = selectedLeads.reduce(
    (sum, l) => sum + Number(l.actualAmount || 0),
    0
  );

  const totalLeadShare = selectedLeads.reduce(
    (sum, l) => sum + Number(l.leadAmount || 0),
    0
  );

  const submitEveningReport = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      alert("Evening Report Submitted Successfully ✅");
      setIsSubmitting(false);
    }, 1000);
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-full mx-auto">
      <PageHeader title="Evening Report" />

      {/* Header */}
      <div className="bg-white border rounded-md p-4 mb-4 flex justify-between">
        <div className="flex items-center gap-2 text-gray-700">
          <Calendar className="w-5 h-5" />
          <span className="text-sm font-medium">
            {now.toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "short",
              year: "numeric",
            })}{" "}
            •{" "}
            {now.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Leads List */}
        <div className="col-span-5 bg-white border rounded-md p-4">
          <div className="flex justify-between mb-3">
            <h3 className="font-medium">Today's Leads</h3>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-2 top-2.5 text-gray-400" />
              <input
                className="pl-8 border rounded-md text-sm px-2 py-1"
                placeholder="Search..."
                value={leadSearch}
                onChange={(e) => setLeadSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2 max-h-[32rem] overflow-y-auto">
            {filtered.map((l) => {
              const picked = selectedIds.includes(l.id);
              return (
                <div
                  key={l.id}
                  className={`p-3 rounded-md border ${
                    picked ? "border-blue-300 bg-blue-50" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={picked}
                      onChange={(e) => pickLead(l.id, e.target.checked)}
                      className="mt-1 h-4 w-4"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{l.Projectname}</div>
                      <div className="text-xs text-gray-500">{l.company}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Planned {l.timeAllocated}h
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lead Details */}
        <div className="col-span-7 bg-white border rounded-md p-4">
          {workRows.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <AlertCircle className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p>No leads selected</p>
            </div>
          ) : (
            workRows.map((l) => (
              <div key={l._id} className="mb-4 border rounded-md p-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  {l.projectName}
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={l.status}
                    onChange={(e) =>
                      setWorkRows((prev) =>
                        prev.map((r) =>
                          r._id === l._id ? { ...r, status: e.target.value } : r
                        )
                      )
                    }
                    className="border rounded px-2 py-1 text-sm h-9"
                  >
                    <option value="">Select status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                  </select>

                  {(l.status === "completed" || l.status === "pending") && (
                    <input
                      type="text"
                      placeholder="Enter remark"
                      value={l.remark}
                      onChange={(e) =>
                        setWorkRows((prev) =>
                          prev.map((r) =>
                            r._id === l._id ? { ...r, remark: e.target.value } : r
                          )
                        )
                      }
                      className="border rounded px-2 py-1 text-sm h-9"
                    />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {workRows.length > 0 && (
        <div className="mt-6 bg-white border rounded-md p-4 flex justify-between">
          <div>
            <h4 className="font-medium">Ready to Submit?</h4>
            <p className="text-sm text-gray-600">{workRows.length} leads selected</p>
          </div>
          <button
            onClick={submitEveningReport}
            disabled={isSubmitting || workRows.length === 0}
            className="px-6 py-2 bg-black text-white rounded-md disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Evening Report"}
          </button>
        </div>
      )}
    </div>
  );
};

export default EveningReport;
