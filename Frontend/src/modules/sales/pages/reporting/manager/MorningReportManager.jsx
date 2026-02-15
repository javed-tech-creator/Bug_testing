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
    Users,
    User,
    Eye,
} from "lucide-react";
import PageHeader from "../../../components/PageHeader";
import MorningTeam from "./MorningTeam";
import { useAddMorningReportMutation, useGetTodayReportQuery } from "@/api/sales/reporting.api";
import { useFetchLeadsQuery } from "@/api/sales/lead.api";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const fmt = (n) =>
    typeof n === "number"
        ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n)
        : n;

const PERCENT = 0.02;


const durationOptions = Array.from({ length: 16 }, (_, i) => (i + 1) * 0.5);

const MorningReportManager = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [now, setNow] = useState(new Date());
    const [reportingMode, setReportingMode] = useState("self"); // 'self' or 'team'
    const [expanded, setExpanded] = useState({});
    const [selectedIds, setSelectedIds] = useState([]);
    const [workRows, setWorkRows] = useState([]);
    const [leadSearch, setLeadSearch] = useState("");
    const [viewEmployeeReport, setViewEmployeeReport] = useState(null);


    const res = useSelector((state) => state.auth.userData);
    const user = res?.user || {};

    const params =
        user?.designation?.title === "Sales Executive"
            ? `leadBy=${user._id}&assignTo=${user._id}&page=${page}&limit=${limit}&match=or`
            : `&page=${page}&limit=${limit}`;

    const { data, isLoading, error } = useFetchLeadsQuery({ params });
    const leads = data?.data?.leads || [];
    console.log(leads);
    const { data: morningReportData } = useGetTodayReportQuery({ type: "morning" });
    console.log(morningReportData)


    const [addMorning, { isLoading: addMorningLoading }] = useAddMorningReportMutation();

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



    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 60000);
        return () => clearInterval(t);
    }, []);

    const isAfterReporting = () => now.getHours() >= 24; // Morning reporting until 12 PM

    


    const pickLead = (leadId, checked) => {
        if (checked) {
            const lead = leads.find((l) => l._id === leadId);
            const expected = Number(lead.expectedBusiness) || 0;
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
                if (r.id !== id) return r;
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
            const response = await addMorning({ formData: morningReportData }).unwrap();

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


    const totalExpected = workRows.reduce((s, r) => s + Number(r.expectedBusiness || 0), 0);
    const totalLead = workRows.reduce((s, r) => s + Number(r.leadAmount || 0), 0);

    // If viewing employee report
    if (viewEmployeeReport) {
        return (
            <div className="max-w-7xl mx-auto">
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
                            <div className="text-sm text-blue-600 font-medium">Total Leads</div>
                            <div className="text-2xl font-bold mt-1">{viewEmployeeReport.leads}</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-md">
                            <div className="text-sm text-green-600 font-medium">Target</div>
                            <div className="text-2xl font-bold mt-1">{fmt(viewEmployeeReport.target)}</div>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-md">
                            <div className="text-sm text-purple-600 font-medium">Achieved</div>
                            <div className="text-2xl font-bold mt-1">{fmt(viewEmployeeReport.achieved)}</div>
                        </div>
                        <div className={`p-4 rounded-md ${viewEmployeeReport.achieved >= viewEmployeeReport.target ? 'bg-green-50' : 'bg-amber-50'}`}>
                            <div className="text-sm text-gray-600 font-medium">Achievement %</div>
                            <div className="text-2xl font-bold mt-1">
                                {Math.round((viewEmployeeReport.achieved / viewEmployeeReport.target) * 100)}%
                            </div>
                        </div>
                    </div>

                    {/* Placeholder for actual employee report data */}
                    <div className="text-center py-12 text-gray-500">
                        <Eye className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-medium mb-2">Employee Detailed Report</h3>
                        <p>Detailed report view for {viewEmployeeReport.name}</p>
                        <p className="text-sm mt-1">(This would show the employee's complete reporting data)</p>
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
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Morning Reporting Time Over</h2>
                    <p className="text-gray-700 mb-1">Reporting time: 9:00 AM - 12:00 PM</p>
                    <p className="text-base text-gray-500">Current: {now.toLocaleTimeString("hi-IN", { hour: "2-digit", minute: "2-digit" })}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <PageHeader title="Sales Manager - Morning Reporting" />
            <div className="flex w-full items-center justify-center mb-4">
                <div className="relative flex w-96 bg-gray-100 rounded-md p-1">

                    {/* Moving Slider Background */}
                    <div
                        className={`absolute top-1 bottom-1 bg-black rounded-md transition-all duration-300 ease-in-out ${reportingMode === "self" ? "left-1 right-1/2" : "left-1/2 right-1"
                            }`}
                    />

                    {/* Buttons */}
                    <div className="relative flex w-full">
                        <button
                            type="button"
                            onClick={() => setReportingMode("self")}
                            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ease-in-out flex items-center justify-center gap-2 ${reportingMode === "self"
                                ? "text-white"
                                : "text-gray-900"
                                }`}
                        >
                            <User className="w-4 h-4" />
                            Self Reporting
                        </button>

                        <button
                            type="button"
                            onClick={() => setReportingMode("team")}
                            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 ease-in-out flex items-center justify-center gap-2 ${reportingMode === "team"
                                ? "text-white"
                                : "text-gray-900"
                                }`}
                        >
                            <Users className="w-4 h-4" />
                            Team Overview
                        </button>
                    </div>
                </div>
            </div>

            {/* Mode Toggle */}
            <div className="bg-white border border-gray-200 rounded-md p-4 mb-4">
                <div className="flex items-center justify-between mb-1">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Reporting Mode</h2>
                        <p className="text-sm text-gray-600">Switch between self and team reporting</p>
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
                            })} • {now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-center">
                            <div className="text-lg font-semibold text-gray-900">{leads.length}</div>
                            <div className="text-xs text-gray-500">TOTAL LEADS</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-semibold text-gray-900">{workRows.length}</div>
                            <div className="text-xs text-gray-500">SELECTED</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-semibold text-gray-900">{fmt(totalExpected)}</div>
                            <div className="text-xs text-gray-500">EXPECTED</div>
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
                                <h3 className="text-base font-medium text-gray-900">Available Leads</h3>
                                <p className="text-sm text-gray-500">Select leads for your day plan</p>
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search leads..."
                                    value={leadSearch}
                                    disabled={Boolean(morningReportData?.data?.data)}
                                    onChange={(e) => setLeadSearch(e.target.value)}
                                    className="w-48 text-sm border border-gray-300 rounded-md pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
                                />
                                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        <div className="space-y-3 max-h-[32rem] overflow-y-auto">
                            {leads.filter((lead) =>
                                lead.clientName?.toLowerCase().includes(leadSearch.toLowerCase()) ||
                                lead.companyName?.toLowerCase().includes(leadSearch.toLowerCase()) ||
                                lead.phone?.includes(leadSearch)
                            ).map((lead) => {
                                const picked = selectedIds.includes(lead._id);
                                return (
                                    <div key={lead._id} className={`p-3 rounded-md border transition-all ${picked ? "border-blue-300 bg-blue-50" : "border-gray-100 hover:border-gray-300"}`}>
                                        <div className="flex items-start gap-3">
                                            <input
                                                type="checkbox"
                                                checked={picked}
                                                onChange={(e) => pickLead(lead._id, e.target.checked)}
                                                className="mt-1 h-4 w-4 text-blue-600"
                                                disabled={Boolean(morningReportData?.data?.data)}
                                            />
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="text-base font-medium text-gray-900">{lead.clientName}</div>
                                                        <div className="text-sm text-gray-500">{lead.companyName}</div>
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-700">{fmt(lead.expectedBusiness)}</div>
                                                </div>

                                                <div className="mt-2 space-y-1">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Phone className="w-3 h-3" />
                                                        <span>{lead.phone}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Mail className="w-3 h-3" />
                                                        <span className="truncate">{lead.email}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <MapPin className="w-3 h-3" />
                                                        <span>{lead.address}</span>
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
                                    Today's Plan
                                </h3>
                                <p className="text-sm text-gray-500">Manage your daily activities</p>
                            </div>
                            <div className="text-sm px-3 py-1 bg-gray-100 rounded-full">
                                {workRows.length} leads selected
                            </div>
                        </div>

                        {workRows.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                <h3 className="text-lg font-medium mb-2">No Leads Selected</h3>
                                <p>Select leads from the left panel to create your daily plan</p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-[32rem] overflow-y-auto">
                                {workRows.map((r) => (
                                    <div key={r.id} className="border border-gray-200 rounded-md p-4 hover:border-gray-300 transition-colors">
                                        <div className="flex items-center justify-between mb-3">
                                            <div>
                                                <div className="text-lg font-semibold text-gray-900">{r.clientName}</div>
                                                <div className="text-sm text-gray-500">{r.companyName}</div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="text-right">
                                                    <div className="text-base font-bold text-gray-900">{fmt(r.expectedBusiness)}</div>
                                                    <div className="text-xs text-gray-500">Expected Amount</div>
                                                </div>
                                                <button
                                                    onClick={() => setExpanded((p) => ({ ...p, [r._id]: !p[r._id] }))}
                                                    className="p-1 hover:bg-gray-100 rounded"
                                                >
                                                    {expanded[r._id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        {expanded[r._id] && (
                                            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Category</label>
                                                    <select
                                                        value={r.targetCategory}
                                                        onChange={(e) => updateRow(r.id, "targetCategory", e.target.value)}
                                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                                                        disabled={Boolean(morningReportData?.data?.data)}
                                                    >
                                                        <option value="sales_in">Sales In</option>
                                                        <option value="lead_in">Lead In</option>
                                                        <option value="business_in">Business In</option>
                                                        <option value="amount_in">Amount In</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Vertical</label>
                                                    <select
                                                        value={r.vertical}
                                                        onChange={(e) => updateRow(r.id, "vertical", e.target.value)}
                                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                                                        disabled={Boolean(morningReportData?.data?.data)}
                                                    >
                                                        <option value="self">Self</option>
                                                        <option value="business_associates">Business Associates</option>
                                                        <option value="franchise">Franchise</option>
                                                        <option value="partner">Partner</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Expected Amount</label>
                                                    <input
                                                        readOnly
                                                        value={fmt(r.expectedBusiness)}
                                                        className="w-full border border-gray-300 bg-gray-50 rounded-md px-3 py-2 text-sm"

                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Time Duration (Hours)</label>
                                                    <select
                                                        value={r.timeDuration}
                                                        onChange={(e) => updateRow(r.id, "timeDuration", Number(e.target.value))}
                                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                                                        disabled={Boolean(morningReportData?.data?.data)}
                                                    >
                                                        {durationOptions.map((h) => (
                                                            <option key={h} value={h}>{h} Hour</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Lead Amount (2%)</label>
                                                    <input
                                                        readOnly
                                                        value={fmt(r.leadAmount)}
                                                        className="w-full border border-gray-300 bg-blue-50 rounded-md px-3 py-2 text-sm"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Action Required</label>
                                                    <select
                                                        value={r.actionRequired}
                                                        onChange={(e) => updateRow(r.id, "actionRequired", e.target.value)}
                                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
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

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Deal Amount (2%)</label>
                                                    <input
                                                        readOnly
                                                        value={fmt(r.dealAmount)}
                                                        className="w-full border border-gray-300 bg-purple-50 rounded-md px-3 py-2 text-sm"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Relation Amount (2%)</label>
                                                    <input
                                                        readOnly
                                                        value={fmt(r.relationAmount)}
                                                        className="w-full border border-gray-300 bg-pink-50 rounded-md px-3 py-2 text-sm"
                                                    />
                                                </div>

                                                <div className="col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                                                    <textarea
                                                        rows={2}
                                                        value={r.remark}
                                                        placeholder="Add any remarks or notes..."
                                                        onChange={(e) => updateRow(r.id, "remark", e.target.value)}
                                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 resize-none"
                                                        disabled={Boolean(morningReportData?.data?.data)}
                                                    />
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
                // TEAM OVERVIEW VIEW
                <MorningTeam />
            )}

            {/* Footer Submit (only for self reporting) */}
            {reportingMode === "self" && workRows.length > 0 && (
                <div className="mt-6 bg-white border border-gray-200 rounded-md p-4 flex items-center justify-between">
                    <div>
                        <h4 className="text-base font-medium text-gray-900">Ready to Submit?</h4>
                        <p className="text-sm text-gray-600">
                            {workRows.length} leads selected • Total Expected: {fmt(totalExpected)} • Total Lead Share: {fmt(totalLead)}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">

                        <button
                            onClick={submitPlan}
                            className="px-6 py-2 cursor-pointer bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
                        >
                            {addMorningLoading ? "Submiting.." : "Submit Morning Plan"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MorningReportManager;