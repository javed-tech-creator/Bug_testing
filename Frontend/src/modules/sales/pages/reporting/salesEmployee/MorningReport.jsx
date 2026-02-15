import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Target,
  AlertCircle,
  Search,
  Loader2,
  IndianRupee,
} from "lucide-react";
import PageHeader from "../../../components/PageHeader";
import { useSelector } from "react-redux";
import { useFetchLeadsQuery } from "@/api/sales/lead.api";
import { useAddMorningReportMutation, useGetTodayReportQuery } from "@/api/sales/reporting.api.js";
import { toast } from "react-toastify";

const fmt = (n) =>
  typeof n === "number"
    ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n)
    : n;

const PERCENT = 0.02; // 2%



const durationOptions = Array.from({ length: 16 }, (_, i) => (i + 1) * 0.5);

const MorningReport = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [now, setNow] = useState(new Date());
  const [expanded, setExpanded] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);
  const [workRows, setWorkRows] = useState([]);
  const [leadSearch, setLeadSearch] = useState("");
  const res = useSelector((state) => state.auth.userData);
  const user = res?.user || {};

  const params =
    user?.designation?.title === "Sales Executive"
      ? `leadBy=${user._id}&assignTo=${user._id}&page=${page}&limit=${limit}&match=or`
      : `&page=${page}&limit=${limit}`;

  const { data, isLoading, error } = useFetchLeadsQuery({ params });
  const leads = data?.data?.leads || [];
const {data: morningReportData} = useGetTodayReportQuery({type:"morning"});
console.log(morningReportData)
useEffect(() => {
  if (morningReportData && morningReportData.data.data) {
    const reportLeads = morningReportData.data.data.leads || [];
    setWorkRows(reportLeads.map(lead => ({
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
    })));
    setSelectedIds(reportLeads.map(lead => lead.leadId));
  }

  setWorkRows((prevRows) => {
    return prevRows.map((row) => {
      const matchedLead = leads.find((lead) => lead.leadId === row._id);
      return matchedLead ? { ...row, ...matchedLead } : row;
    });
  });
}, [morningReportData]);


  const [addMorning, { isLoading: addMorningLoading }] = useAddMorningReportMutation();


  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const isAfterReporting = () => now.getHours() >= 24;



  const pickLead = (leadId, checked) => {
    if (checked) {
      const lead = leads.find((l) => l._id === leadId);
      console.log({ lead });
      const expected = lead.expectedBusiness || 0;
      const derived = {
        leadAmount: Number((expected * PERCENT).toFixed(2)),
        dealAmount: Number((expected * PERCENT).toFixed(2)),
        relationAmount: Number((expected * PERCENT).toFixed(2)),
      };

      setSelectedIds((p) => [...p, leadId]);
      setWorkRows((p) => [
        ...p,
        {
          ...lead,
          targetCategory: "sales_in",
          vertical: "self",
          expectedBusiness: expected,
          ...derived,
          timeDuration: 1,
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
      })
    );
  };

  const submitPlan = async () => {
    try {
      console.log("Submitting plan", workRows);

      // Prepare the data in correct format
      const morningReportData = {
        plannedTasks: ["Follow up with selected leads"], // You can add dynamic tasks if needed
        plannedMeetings: 0, // You can add dynamic meetings count
        targetForDay: totalExpected,
        leads: workRows.map(lead => ({
          leadId: lead._id, // Use lead._id from your data
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
          remark: lead.remark || ""
        }))
      };

      console.log("API Payload:", morningReportData);

      // Call the API
      const response = await addMorning({formData:morningReportData}).unwrap();

      // Show success message
      toast.success(response.message || "Morning report submitted successfully!");

      // Reset the form
      setSelectedIds([]);
      setWorkRows([]);
      setExpanded({});

    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error(error?.data?.message || "Failed to submit morning report");
    }
  };

  // compact summary helpers
  const totalExpected = workRows.reduce((s, r) => s + Number(r.expectedBusiness || 0), 0);
  const totalLead = workRows.reduce((s, r) => s + Number(r.leadAmount || 0), 0);

  if (isAfterReporting()) {
    return (
      <div className="max-w-3xl mx-auto p-6 min-h-screen flex items-center justify-center">
        <div className="text-center bg-white border border-gray-200 rounded-md p-8">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-500" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Morning Reporting Time Over</h2>
          <p className="text-gray-700 mb-1">Reporting time: 9:00 AM - 12:00 PM</p>
          <p className="text-base text-gray-500">Current: {now.toLocaleTimeString("hi-IN", { hour: "2-digit", minute: "2-digit" })}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto ">
      <PageHeader title="Morning Reporting" />

      {/* header stats */}
      <div className="bg-white border border-gray-200 rounded-md p-2 px-4 mb-4">
        <div className="flex justify-between items-center">

          {/* Left - Date */}
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar className="w-5 h-5 text-gray-700" />
            <span className="text-sm font-medium">
              {now.toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Right - Stats */}
          <div className="flex gap-6">

            {/* Total Leads */}
            <div className="flex flex-col items-center">
              <div className="text-lg font-semibold text-gray-900">{leads.length}</div>
              <div className="text-[11px] tracking-wide text-gray-500">TOTAL LEADS</div>
            </div>

            {/* Selected */}
            <div className="flex flex-col items-center">
              <div className="text-lg font-semibold text-gray-900">{workRows.length}</div>
              <div className="text-[11px] tracking-wide text-gray-500">SELECTED</div>
            </div>

            {/* Total Expected */}
            <div className="flex flex-col items-center">
              <div className="text-lg font-semibold text-gray-900">{fmt(totalExpected)}</div>
              <div className="text-[11px] tracking-wide text-gray-500">TOTAL EXPECTED</div>
            </div>

          </div>
        </div>
      </div>


      <div className="grid grid-cols-12 gap-4">
        {/* leads list - compact */}
        <div className="col-span-5 bg-white border border-gray-200 rounded-md p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-medium text-gray-900">
              Available Leads ({leads.length})
            </h3>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={leadSearch}
                onChange={(e) => setLeadSearch(e.target.value)}
                className="w-40 text-sm border border-gray-300 rounded-md pl-8 pr-2 py-1 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />

              <Search className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>


          <div className="space-y-2 max-h-[36rem] overflow-y-auto">
            {leads
              .filter((lead) =>
                lead.clientName.toLowerCase().includes(leadSearch.toLowerCase()) ||
                lead.companyName.toLowerCase().includes(leadSearch.toLowerCase()) ||
                lead.phone.includes(leadSearch)
              )
              .map((lead) => {

                const picked = selectedIds.includes(lead._id);
                return (
                  <div key={lead._id} className={`flex items-start gap-3 p-2 rounded-md border ${picked ? "border-gray-300 bg-gray-50" : "border-gray-100"}`}>
                    <input
                      type="checkbox"
                      checked={picked}
                      onChange={(e) => pickLead(lead._id, e.target.checked)}
                      className="mt-1"
                       disabled={Boolean(morningReportData?.data?.data)}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-base font-medium text-gray-900">{lead.clientName}</div>
                          <div className="text-sm text-gray-500">{lead.companyName}</div>
                        </div>
                        <div className="text-sm text-gray-400">{lead.lastContact}</div>
                      </div>

                      {/* expand */}
                      <div className="mt-2 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span>{lead.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span>{lead.email}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span>{lead.address}</span>
                        </div>
                      </div>
                    </div>
                  <div className="flex justify-center items-center text-gray-700 text-sm">  <IndianRupee className="" size={12}/> {lead.expectedBusiness || 0}</div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* today's plan - compact table-like */}
        <div className="col-span-7 bg-white border border-gray-200 rounded-md p-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-medium text-gray-900 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Today's Plan ({workRows.length})
            </h3>
            <div className="text-sm text-gray-500">Compact view</div>
          </div>

          {workRows.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No leads selected. Select leads from left.</div>
          ) : (
            <div className="space-y-3 max-h-[36rem] overflow-y-auto">
              {workRows.map((r) => (
                <div key={r._id} className="border rounded-sm p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-base font-medium text-gray-900">{r.clientName}</div>
                      <div className="text-sm text-gray-500">{r.companyName}</div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="text-right">
                        <div className="font-medium">{fmt(r.expectedBusiness)}</div>
                        <div className="text-sm text-gray-400">Expected</div>
                      </div>
                      <button
                        onClick={() => setExpanded((p) => ({ ...p, [r._id]: !p[r._id] }))}
                        className="p-1"
                      >
                        {expanded[r._id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* grid fields - minimal spacing */}
                  {expanded[r._id] && (<div className="grid grid-cols-2 gap-2 mt-3 text-base">
                    {/* target category */}
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Target Category</label>
                      <select
                        disabled={Boolean(morningReportData?.data?.data)}
                        value={r.targetCategory}
                        onChange={(e) => updateRow(r._id, "targetCategory", e.target.value)}
                        className="w-full text-base border rounded px-2 py-1"
                      >
                        <option value="sales_in">Sales In</option>
                        <option value="lead_in">Lead In</option>
                        <option value="business_in">Business In</option>
                        <option value="amount_in">Amount In</option>
                      </select>
                    </div>

                    {/* vertical */}
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Vertical</label>
                      <select
                        value={r.vertical}
                         disabled={Boolean(morningReportData?.data?.data)}
                        onChange={(e) => updateRow(r._id, "vertical", e.target.value)}
                        className="w-full text-base border rounded px-2 py-1"
                      >
                        <option value="self">Self</option>
                        <option value="business_associates">Business Associates</option>
                        <option value="franchise">Franchise</option>
                        <option value="partner">Partner</option>
                      </select>
                    </div>

                    {/* expected (readonly) */}
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Expected Amount</label>
                      <input readOnly value={fmt(r.expectedBusiness)} className="w-full text-base border bg-gray-50 rounded px-2 py-1" />
                    </div>

                    {/* time duration */}
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Time Duration</label>
                      <select
                        value={r.timeDuration}
                        onChange={(e) => updateRow(r._id, "timeDuration", Number(e.target.value))}
                        className="w-full  text-base border rounded px-2 py-1"
                         disabled={Boolean(morningReportData?.data?.data)}
                      >
                        {durationOptions.map((h) => (
                          <option key={h} value={h}>
                            {h % 1 === 0 ? `${h} Hour` : `${h} Hour`}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Lead Amount (readonly) */}
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Lead Amount (2%)</label>
                      <input readOnly value={fmt(r.leadAmount)} className="w-full text-base border bg-gray-50 rounded px-2 py-1" />
                    </div>

                    {/* action required */}
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Action Required</label>
                      <select
                        value={r.actionRequired}
                        onChange={(e) => updateRow(r._id, "actionRequired", e.target.value)}
                        className="w-full text-base border rounded px-2 py-1"
                        disabled={Boolean(morningReportData?.data?.data)}
                      >
                        <option value="call">Call</option>
                        <option value="meeting">Meeting</option>
                        <option value="demo">Demo</option>
                        <option value="followup">Follow-up</option>
                        <option value="proposal">Proposal</option>
                        <option value="visit">Visit</option>
                      </select>
                    </div>

                    {/* Deal amount */}
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Deal Amount (2%)</label>
                      <input readOnly value={fmt(r.dealAmount)} className="w-full text-base border bg-gray-50 rounded px-2 py-1" />
                    </div>

                    {/* Relationship amount */}
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Relationship Amount (2%)</label>
                      <input readOnly value={fmt(r.relationAmount)} className="w-full text-base border bg-gray-50 rounded px-2 py-1" />
                    </div>

                    {/* remark full width */}
                    <div className="col-span-2">
                      <label className="block text-sm text-gray-700 mb-1">Remark</label>
                      <textarea
                        rows={2}
                        value={r.remark}
                         disabled={Boolean(morningReportData?.data?.data)}
                        placeholder="Enter Remark"
                        onChange={(e) => updateRow(r._id, "remark", e.target.value)}
                        className="w-full text-base border rounded px-2 py-1 resize-none"
                      />
                    </div>
                  </div>)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* footer summary & submit */}
      {workRows.length > 0 && (
        <div className="mt-4 bg-white border border-gray-200 rounded-md p-3 flex items-center justify-between">
          <div className="text-base text-gray-700">
            <div><span className="font-semibold">{workRows.length}</span> leads selected</div>
            <div className="text-sm text-gray-500">
              Total Expected: {fmt(totalExpected)} • Total LeadShare: {fmt(totalLead)}
            </div>
          </div>
          <div>
            <button
              onClick={submitPlan}
               disabled={addMorningLoading || Boolean(morningReportData?.data?.data)}
              className="bg-black text-white text-base px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addMorningLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Plan"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MorningReport;
