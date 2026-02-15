import React, { useEffect, useState } from "react";
import {
  Calendar,
  Phone,
  Mail,
  MapPin,
  Target,
  AlertCircle,
  Search,
  Users,
  User,
  Eye,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
// import MorningTeam from "./MorningTeam";

const fmt = (n) =>
  typeof n === "number"
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(n)
    : n;

const PERCENT = 0.02;

// Static Morning Leads Data (for report)
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
// Static Leads Data
const STATIC_LEADS = [
  {
    _id: "lead001",
    clientName: "Rajesh Kumar",
    companyName: "Tech Solutions Pvt Ltd",
    phone: "+91 98765 43210",
    email: "rajesh.kumar@techsolutions.com",
    address: "Connaught Place, New Delhi",
    expectedBusiness: 500000,
  },
  {
    _id: "lead002",
    clientName: "Priya Sharma",
    companyName: "Digital Marketing Hub",
    phone: "+91 98765 43211",
    email: "priya.sharma@digitalmarketing.com",
    address: "Bandra West, Mumbai",
    expectedBusiness: 750000,
  },
  {
    _id: "lead003",
    clientName: "Amit Patel",
    companyName: "Global Exports Ltd",
    phone: "+91 98765 43212",
    email: "amit.patel@globalexports.com",
    address: "MG Road, Bangalore",
    expectedBusiness: 1200000,
  },
  {
    _id: "lead004",
    clientName: "Neha Gupta",
    companyName: "Fashion Forward",
    phone: "+91 98765 43213",
    email: "neha.gupta@fashionforward.com",
    address: "Park Street, Kolkata",
    expectedBusiness: 300000,
  },
  {
    _id: "lead005",
    clientName: "Sanjay Verma",
    companyName: "Real Estate Builders",
    phone: "+91 98765 43214",
    email: "sanjay.verma@realestatebuilders.com",
    address: "Jubilee Hills, Hyderabad",
    expectedBusiness: 2000000,
  },
  {
    _id: "lead006",
    clientName: "Anjali Singh",
    companyName: "Healthcare Solutions",
    phone: "+91 98765 43215",
    email: "anjali.singh@healthcaresolutions.com",
    address: "Civil Lines, Jaipur",
    expectedBusiness: 850000,
  },
  {
    _id: "lead007",
    clientName: "Vikram Reddy",
    companyName: "IT Services India",
    phone: "+91 98765 43216",
    email: "vikram.reddy@itservices.com",
    address: "Hitech City, Hyderabad",
    expectedBusiness: 950000,
  },
  {
    _id: "lead008",
    clientName: "Meera Kapoor",
    companyName: "Educational Institute",
    phone: "+91 98765 43217",
    email: "meera.kapoor@eduinstitute.com",
    address: "Sector 18, Noida",
    expectedBusiness: 400000,
  },
];

// Static Morning Report Data
const STATIC_MORNING_REPORT = null; // Set to null initially, or you can populate with existing report data

const MorningReport = () => {
  const [now, setNow] = useState(new Date());
  const [reportingMode] = useState("self");
  // const [expanded, setExpanded] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);
  const [workRows, setWorkRows] = useState([]);
  const [leadSearch, setLeadSearch] = useState("");
  const [viewEmployeeReport, setViewEmployeeReport] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Using static morning report leads
  const leads = STATIC_MORNING_LEADS;
  const morningReportData = STATIC_MORNING_REPORT;

  useEffect(() => {
    if (morningReportData && morningReportData.data) {
      const reportLeads = morningReportData.data.leads || [];
      setWorkRows(
        reportLeads.map((lead) => ({
          _id: lead.leadId,
          clientName: lead.leadName,
          companyName: lead.leadCompany,
          phone: lead.leadPhone,
          email: lead.leadEmail,
          address: lead.leadLocation,
          expectedBusiness: lead.expectedAmount,
          targetCategory: lead.targetCategory,
          vertical: lead.vertical,
          timeDuration: lead.timeDuration,
          actionRequired: lead.actionRequired,
          remark: lead.remark,
          leadAmount: Number((lead.expectedAmount * PERCENT).toFixed(2)),
          dealAmount: Number((lead.expectedAmount * PERCENT).toFixed(2)),
          relationAmount: Number((lead.expectedAmount * PERCENT).toFixed(2)),
        })),
      );
      setSelectedIds(reportLeads.map((lead) => lead.leadId));
    }
  }, [morningReportData]);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const isAfterReporting = () => now.getHours() >= 24; // Morning reporting until 12 PM

  const pickLead = (leadId, checked) => {
    if (checked) {
      const lead = leads.find((l) => l.id === leadId);
      const expected = Number(lead.expectedAmount) || 0;
      console.log(expected);
      const derived = {
        leadAmount: Number((expected * PERCENT).toFixed(2)),
        dealAmount: Number((expected * PERCENT).toFixed(2)),
        relationAmount: Number((expected * PERCENT).toFixed(2)),
      };

      setSelectedIds((p) => [...p, leadId]);
      setWorkRows((p) => [
        ...p,
        {
          _id: lead.id,
          projectName: lead.Projectname,
          companyName: lead.company,
          expectedBusiness: expected,
          timeDuration: lead.timeAllocated,
          ...derived,
          targetCategory: "sales_in",
          vertical: "self",
          actionRequired: "call",
          remark: "",
        },
      ]);
    } else {
      setSelectedIds((p) => p.filter((id) => id !== leadId));
      setWorkRows((p) => p.filter((r) => r._id !== leadId));
    }
  };

  const updateRow = (id, field, value) => {
    setWorkRows((prev) =>
      prev.map((r) => {
        if (r._id !== id) return r;
        const next = { ...r, [field]: value };

        if (field === "expectedBusiness") {
          const exp = Number(value || 0);
          next.leadAmount = Number((exp * PERCENT).toFixed(2));
          next.dealAmount = Number((exp * PERCENT).toFixed(2));
          next.relationAmount = Number((exp * PERCENT).toFixed(2));
        }
        return next;
      }),
    );
  };

  const submitPlan = async () => {
    try {
      setIsSubmitting(true);
      console.log("Submitting plan", workRows);

      // Prepare the data in correct format
      const morningReportData = {
        plannedTasks: ["Follow up with selected leads"],
        plannedMeetings: 0,
        targetForDay: totalExpected,
        leads: workRows.map((lead) => ({
          leadId: lead._id,
          leadName: lead.clientName,
          leadCompany: lead.companyName,
          leadPhone: lead.phone,
          leadEmail: lead.email,
          leadLocation: lead.address,
          expectedAmount: lead.expectedBusiness,
          targetCategory: lead.targetCategory || "sales_in",
          vertical: lead.vertical || "self",
          timeDuration: lead.timeDuration || 1,
          actionRequired: lead.actionRequired || "call",
          remark: lead.remark || "",
        })),
      };

      console.log("Quotation Data:", morningReportData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success message
      alert("Quotation submitted successfully!");

      // Reset the form
      setSelectedIds([]);
      setWorkRows([]);
    } catch (error) {
      console.error("Error submitting quotation:", error);
      alert("Failed to submit quotation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalExpected = workRows.reduce(
    (s, r) => s + Number(r.expectedBusiness || 0),
    0,
  );
  const totalLead = workRows.reduce((s, r) => s + Number(r.leadAmount || 0), 0);

  // If viewing employee report
  if (viewEmployeeReport) {
    return (
      <div className="max-w-full mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <button
              onClick={() => setViewEmployeeReport(null)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-2"
            >
              ← Back to Manager Dashboard
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              Employee Report: {viewEmployeeReport.name}
            </h1>
            <p className="text-gray-600">{viewEmployeeReport.role}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Report Date</div>
            <div className="font-medium">{now.toLocaleDateString("en-IN")}</div>
          </div>
        </div>

        {/* Employee Report View (Readonly) */}
        <div className="bg-white border border-gray-200 rounded-md p-6">
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-md">
              <div className="text-sm text-blue-600 font-medium">
                Total Leads
              </div>
              <div className="text-2xl font-bold mt-1">
                {viewEmployeeReport.leads}
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-md">
              <div className="text-sm text-green-600 font-medium">Target</div>
              <div className="text-2xl font-bold mt-1">
                {fmt(viewEmployeeReport.target)}
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-md">
              <div className="text-sm text-purple-600 font-medium">
                Achieved
              </div>
              <div className="text-2xl font-bold mt-1">
                {fmt(viewEmployeeReport.achieved)}
              </div>
            </div>
            <div
              className={`p-4 rounded-md ${
                viewEmployeeReport.achieved >= viewEmployeeReport.target
                  ? "bg-green-50"
                  : "bg-amber-50"
              }`}
            >
              <div className="text-sm text-gray-600 font-medium">
                Achievement %
              </div>
              <div className="text-2xl font-bold mt-1">
                {Math.round(
                  (viewEmployeeReport.achieved / viewEmployeeReport.target) *
                    100,
                )}
                %
              </div>
            </div>
          </div>

          {/* Placeholder for actual employee report data */}
          <div className="text-center py-12 text-gray-500">
            <Eye className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">
              Employee Detailed Report
            </h3>
            <p>Detailed report view for {viewEmployeeReport.name}</p>
            <p className="text-sm mt-1">
              (This would show the employee's complete reporting data)
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isAfterReporting()) {
    return (
      <div className="max-w-3xl mx-auto p-6 min-h-screen flex items-center justify-center">
        <div className="text-center bg-white border border-gray-200 rounded-md p-8">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-500" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Morning Reporting Time Over
          </h2>
          <p className="text-gray-700 mb-1">
            Reporting time: 9:00 AM - 12:00 PM
          </p>
          <p className="text-base text-gray-500">
            Current:{" "}
            {now.toLocaleTimeString("hi-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader title="Morning Report" />
      <div className="flex w-full items-center justify-center mb-4">
        <div className="relative flex w-96 bg-gray-100 rounded-md p-1">
          {/* Moving Slider Background */}
          <div
            className={`absolute top-1 bottom-1 bg-black rounded-md transition-all duration-300 ease-in-out ${
              reportingMode === "self" ? "left-1 right-1/2" : "left-1/2 right-1"
            }`}
          />

          {/* Buttons */}
          {/* <div className="relative flex w-full">
            <button
              type="button"
              onClick={() => setReportingMode("self")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ease-in-out flex items-center justify-center gap-2 ${
                reportingMode === "self" ? "text-white" : "text-gray-900"
              }`}
            >
              <User className="w-4 h-4" />
              Create Quotation
            </button>

            <button
              type="button"
              onClick={() => setReportingMode("team")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ease-in-out flex items-center justify-center gap-2 ${
                reportingMode === "team" ? "text-white" : "text-gray-900"
              }`}
            >
              <Users className="w-4 h-4" />
              Team Overview
            </button>
          </div> */}
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="bg-white border border-gray-200 rounded-md p-4 mb-4">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Quotation Mode
            </h2>
            <p className="text-sm text-gray-600">
              Switch between creating quotations and team overview
            </p>
          </div>
        </div>

        {/* Current time and stats */}
        <div className="flex items-center justify-between">
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
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {leads.length}
              </div>
              <div className="text-xs text-gray-500">TOTAL LEADS</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {workRows.length}
              </div>
              <div className="text-xs text-gray-500">SELECTED</div>
            </div>
          </div>
        </div>
      </div>

      {reportingMode === "self" ? (
        // SELF REPORTING VIEW
        <div className="grid grid-cols-12 gap-4">
          {/* Leads List */}
          <div className="col-span-5 bg-white border border-gray-200 rounded-md p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-medium text-gray-900">
                  Available Leads
                </h3>
                <p className="text-sm text-gray-500">
                  Select leads for quotation
                </p>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={leadSearch}
                  disabled={Boolean(morningReportData?.data)}
                  onChange={(e) => setLeadSearch(e.target.value)}
                  className="w-48 text-sm border border-gray-300 rounded-md pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="space-y-3 max-h-[32rem] overflow-y-auto">
              {leads
                .filter(
                  (lead) =>
                    lead.Projectname?.toLowerCase().includes(
                      leadSearch.toLowerCase(),
                    ) ||
                    lead.company
                      ?.toLowerCase()
                      .includes(leadSearch.toLowerCase()),
                )
                .map((lead) => {
                  const picked = selectedIds.includes(lead.id);
                  return (
                    <div
                      key={lead.id}
                      className={`p-3 rounded-md border transition-all ${
                        picked
                          ? "border-blue-300 bg-blue-50"
                          : "border-gray-100 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={picked}
                          onChange={(e) => pickLead(lead.id, e.target.checked)}
                          className="mt-1 h-4 w-4 text-blue-600"
                          disabled={Boolean(morningReportData?.data)}
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="text-base font-medium text-gray-900">
                                {lead.Projectname}
                              </div>
                              <div className="text-sm text-gray-500">
                                {lead.company}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Today's Plan */}
          <div className="col-span-7 bg-white border border-gray-200 rounded-md p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-medium text-gray-900 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Quotation Details
                </h3>
                <p className="text-sm text-gray-500">
                  Manage your quotation items
                </p>
              </div>
              <div className="text-sm px-3 py-1 bg-gray-100 rounded-full">
                {workRows.length} leads selected
              </div>
            </div>

            {workRows.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No Leads Selected</h3>
                <p>Select leads from the left panel to create quotation</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[32rem] overflow-y-auto">
                {workRows.map((l) => (
                  <div
                    key={l._id}
                    className="border border-gray-200 rounded-md p-4 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-lg font-semibold text-gray-900">
                          {l.projectName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {l.companyName}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                      </div>
                    </div>
                    {/* Remark Input and Save Button */}
                    <div className="mt-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Enter remark"
                          value={l.remark || ""}
                          onChange={(e) =>
                            updateRow(l._id, "remark", e.target.value)
                          }
                          className="border rounded px-2 py-1 text-sm h-9 flex-1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        // TEAM OVERVIEW VIEW
        <MorningTeam />
      )}

      {/* Footer Submit (only for self reporting) */}
      {reportingMode === "self" && workRows.length > 0 && (
        <div className="mt-6 bg-white border border-gray-200 rounded-md p-4 flex items-center justify-between">
          <div>
            <h4 className="text-base font-medium text-gray-900">
              Ready to Submit?
            </h4>
            <p className="text-sm text-gray-600">
              {workRows.length} leads selected
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={submitPlan}
              className="px-6 py-2 cursor-pointer bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Quotation"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MorningReport;
