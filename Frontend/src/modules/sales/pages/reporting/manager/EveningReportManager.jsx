    // EveningReportManager.jsx
    import React, { use, useEffect, useState } from "react";
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
        CheckCircle2,
        XCircle,
        Clock,
    } from "lucide-react";
    import PageHeader from "../../../components/PageHeader";
    import EveningTeam from "./EveningTeam";
    import { useSelector } from "react-redux";
    import { useAddEveningReportMutation, useGetTodayReportQuery } from "@/api/sales/reporting.api";
    import { toast } from "react-toastify";

    const fmt = (n) =>
        typeof n === "number"
            ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n)
            : n;

    const PERCENT = 0.02;




    const winReasons = [
        "Competitive pricing",
        "Superior product features",
        "Excellent service quality",
        "Strong relationship",
        "Perfect timing",
        "Customized solution",
        "Quick response time",
    ];

    const lossReasons = [
        "Price too high",
        "Competitor chosen",
        "Budget constraints",
        "Timing issues",
        "Feature mismatch",
        "Decision postponed",
        "Internal changes",
    ];

    const durationOptions = Array.from({ length: 16 }, (_, i) => (i + 1) * 0.5);

    const EveningReportManager = () => {
        const [now, setNow] = useState(new Date());
        const [reportingMode, setReportingMode] = useState("self");
        const [expanded, setExpanded] = useState({});
        const [eveningReport, setEveningReport] = useState([]);
        const [leadSearch, setLeadSearch] = useState("");
        const [viewEmployeeReport, setViewEmployeeReport] = useState(null);

        const user = useSelector((s) => s.auth.userData?.user);

        const { data: morningReportData, isLoading } =
            useGetTodayReportQuery({ type: "morning" });

        console.log("Morning Report Data:", morningReportData);

        const { data: existingEveningReport } =
            useGetTodayReportQuery({ type: "evening" });

        useEffect(() => {
            const timer = setInterval(() => setNow(new Date()), 60000);
            return () => clearInterval(timer);
        }, []);


        const [addEvening, { isLoading: submitting }] =
            useAddEveningReportMutation();

        const isAlreadySubmitted = Boolean(existingEveningReport?.data?.data);

        useEffect(() => {
            if (!morningReportData?.data?.data?.leads) return;

            const mapped = morningReportData.data.data.leads.map((lead, index) => ({
                id: lead.leadId || lead._id,
                leadId: lead.leadId || lead._id,

                name: lead.leadName,
                company: lead.leadCompany,
                phone: lead.leadPhone,
                email: lead.leadEmail,
                location: lead.leadLocation,

                expectedAmount: lead.expectedAmount,
                actualAmount: lead.expectedAmount,

                targetCategory: lead.targetCategory,
                vertical: lead.vertical,

                timeAllocated: lead.timeDuration,
                timeSpent: lead.timeDuration,

                status: "progress",

                leadAmount: +(lead.expectedAmount * PERCENT).toFixed(2),
                dealAmount: +(lead.expectedAmount * PERCENT).toFixed(2),
                relationAmount: +(lead.expectedAmount * PERCENT).toFixed(2),

                remark: lead.remark || "",
                progressNotes: lead.remark || "",
                winReason: "",
                lossReason: "",
                nextAction: "",
                followUpDate: new Date(Date.now() + 86400000)
                    .toISOString()
                    .split("T")[0],

                // 🔑 KEY LINE
                expand: isAlreadySubmitted ? index === 0 : false,
            }));

            setEveningReport(mapped);
        }, [morningReportData, isAlreadySubmitted]);


        const isAfterReporting = () => now.getHours() >= 24; // Evening reporting check

        // Calculate total incentive for a lead
        const calculateTotalIncentive = (lead) => {
            if (lead.status !== "win") return 0;
            return Number(lead.leadAmount || 0) + Number(lead.dealAmount || 0) + Number(lead.relationAmount || 0);
        };

        const updateLeadReport = (id, field, value) => {
            setEveningReport((prev) =>
                prev.map((lead) => {
                    if (lead.id !== id) return lead;

                    const updatedLead = { ...lead, [field]: value };

                    // Recalculate amounts if actual amount changes
                    if (field === "actualAmount") {
                        const actual = Number(value || 0);
                        updatedLead.leadAmount = Number((actual * PERCENT).toFixed(2));
                        updatedLead.dealAmount = Number((actual * PERCENT).toFixed(2));
                        updatedLead.relationAmount = Number((actual * PERCENT).toFixed(2));
                    }

                    return updatedLead;
                })
            );
        };

        const toggleExpand = (id) => {
            if (isAlreadySubmitted) return;

            setEveningReport((prev) =>
                prev.map((lead) =>
                    lead.id === id
                        ? { ...lead, expand: !lead.expand }
                        : { ...lead, expand: false }
                )
            );
        };


        const getStatusIcon = (status) => {
            switch (status) {
                case "win":
                    return <CheckCircle2 className="w-4 h-4 text-green-600" />;
                case "loss":
                    return <XCircle className="w-4 h-4 text-red-600" />;
                case "progress":
                    return <Clock className="w-4 h-4 text-amber-600" />;
                default:
                    return <AlertCircle className="w-4 h-4 text-gray-600" />;
            }
        };

        const getStatusColor = (status) => {
            switch (status) {
                case "win": return "border-green-200 bg-green-50";
                case "loss": return "border-red-200 bg-red-50";
                case "progress": return "border-amber-200 bg-amber-50";
                default: return "border-gray-200 bg-gray-50";
            }
        };

        const getTotalActualAmount = () =>
            eveningReport
                .filter((lead) => lead.status === "win")
                .reduce((t, l) => t + Number(l.actualAmount || 0), 0);

        const getTotalTimeSpent = () =>
            eveningReport.reduce((t, l) => t + Number(l.timeSpent || 0), 0);

        const getConversionRate = () => {
            const total = eveningReport.length;
            const won = eveningReport.filter((l) => l.status === "win").length;
            return total ? Math.round((won / total) * 100) : 0;
        };

        const getTotalIncentives = () => {
            return eveningReport.reduce((total, lead) => {
                return total + calculateTotalIncentive(lead);
            }, 0);
        };

        const submitEveningReport = async () => {
            try {
                const payload = {
                    reportType: "evening",
                    salesDone: getTotalActualAmount(),

                    meetingsAttended: eveningReport.filter(
                        (l) => l.actionPlanned === "meeting" && l.status === "win"
                    ).length,

                    achievements: `Closed ${eveningReport.filter((l) => l.status === "win").length
                        } deals`,

                    leads: eveningReport.map((l) => ({

                        leadId: l.leadId,
                        leadName: l.name,
                        leadCompany: l.company,
                        leadPhone: l.phone,
                        leadEmail: l.email,
                        leadLocation: l.location,

                        expectedAmount: l.expectedAmount,
                        actualAmount: l.actualAmount,

                        targetCategory: l.targetCategory,
                        vertical: l.vertical,

                        timeDuration: l.timeAllocated,
                        timeSpent: l.timeSpent,

                        status: l.status,
                        winReason: l.winReason,
                        lossReason: l.lossReason,
                        progressNotes: l.progressNotes,
                        nextAction: l.nextAction,
                        followUpDate: l.followUpDate,

                        leadAmount: l.leadAmount,
                        dealAmount: l.dealAmount,
                        relationAmount: l.relationAmount,
                    })),
                };

                await addEvening({ formData: payload }).unwrap();
                toast.success("Evening report submitted");
            } catch (e) {
                toast.error(e?.data?.message || "Submit failed");
            }
        };


        const filteredLeads = eveningReport.filter(
            (lead) =>
                lead.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
                lead.company.toLowerCase().includes(leadSearch.toLowerCase()) ||
                lead.phone.includes(leadSearch)
        );

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
                                Employee Evening Report: {viewEmployeeReport.name}
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
                                <div className="text-sm text-blue-600 font-medium">Leads Handled</div>
                                <div className="text-2xl font-bold mt-1">{viewEmployeeReport.leads}</div>
                            </div>
                            <div className="bg-green-50 p-4 rounded-md">
                                <div className="text-sm text-green-600 font-medium">Closed Amount</div>
                                <div className="text-2xl font-bold mt-1">{fmt(viewEmployeeReport.achieved)}</div>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-md">
                                <div className="text-sm text-purple-600 font-medium">Conversion Rate</div>
                                <div className="text-2xl font-bold mt-1">{viewEmployeeReport.conversion}%</div>
                            </div>
                            <div className="bg-amber-50 p-4 rounded-md">
                                <div className="text-sm text-gray-600 font-medium">Total Incentive</div>
                                <div className="text-2xl font-bold mt-1">
                                    {fmt(viewEmployeeReport.incentive)}
                                </div>
                            </div>
                        </div>

                        {/* Placeholder for actual employee report data */}
                        <div className="text-center py-12 text-gray-500">
                            <Eye className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <h3 className="text-lg font-medium mb-2">Employee Evening Report</h3>
                            <p>Detailed evening report for {viewEmployeeReport.name}</p>
                            <p className="text-sm mt-1">(This would show the employee's complete evening reporting data)</p>
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
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Evening Reporting Time Over</h2>
                        <p className="text-gray-700 mb-1">Reporting time: 5:00 PM - 8:00 PM</p>
                        <p className="text-base text-gray-500">Current: {now.toLocaleTimeString("hi-IN", { hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="max-w-7xl mx-auto">
                <PageHeader title="Sales Manager - Evening Reporting" />
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
                                <div className="text-lg font-semibold text-gray-900">{eveningReport.length}</div>
                                <div className="text-xs text-gray-500">TOTAL LEADS</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-semibold text-gray-900">{getConversionRate()}%</div>
                                <div className="text-xs text-gray-500">CONVERSION</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-semibold text-gray-900">{getTotalTimeSpent()}h</div>
                                <div className="text-xs text-gray-500">TIME SPENT</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-semibold text-gray-900">{fmt(getTotalIncentives())}</div>
                                <div className="text-xs text-gray-500">TOTAL INCENTIVE</div>
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
                                    <h3 className="text-base font-medium text-gray-900">Today's Leads</h3>
                                    <p className="text-sm text-gray-500">Update outcome for each lead</p>
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search leads..."
                                        value={leadSearch}
                                        disabled={isAlreadySubmitted}
                                        onChange={(e) => setLeadSearch(e.target.value)}
                                        className="w-48 text-sm border border-gray-300 rounded-md pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
                                    />
                                    <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>

                            <div className="space-y-3 max-h-[32rem] overflow-y-auto">
                                {filteredLeads.map((lead) => (
                                    <div
                                        key={lead.id}
                                        className={`p-3 rounded-md border transition-all cursor-pointer ${getStatusColor(lead.status)} hover:bg-opacity-80`}
                                        onClick={() => toggleExpand(lead.id)}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1">
                                                {getStatusIcon(lead.status)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="text-base font-medium text-gray-900">{lead.name}</div>
                                                        <div className="text-sm text-gray-500">{lead.company}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-sm font-medium text-gray-900">{fmt(lead.actualAmount)}</div>
                                                        <div className="text-xs text-gray-500 capitalize">{lead.status}</div>
                                                    </div>
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
                                                        <span>{lead.location}</span>
                                                    </div>
                                                </div>

                                                <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
                                                    <span>Planned: {lead.timeAllocated}h • Spent: {lead.timeSpent}h</span>
                                                    <button className="p-1">
                                                        {lead.expand ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Today's Plan */}
                        <div className="col-span-7 bg-white border border-gray-200 rounded-md p-4">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-base font-medium text-gray-900 flex items-center gap-2">
                                        <Target className="w-4 h-4" />
                                        Lead Details
                                    </h3>
                                    <p className="text-sm text-gray-500">Update actual outcome for each lead</p>
                                </div>
                                <div className="text-sm px-3 py-1 bg-gray-100 rounded-full">
                                    {filteredLeads.filter(l => l.expand).length} expanded
                                </div>
                            </div>

                            {filteredLeads.filter(lead => lead.expand).length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                    <h3 className="text-lg font-medium mb-2">No Lead Selected</h3>
                                    <p>Select a lead from the left panel to update its outcome</p>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-[32rem] overflow-y-auto">
                                    {filteredLeads.filter(lead => lead.expand).map((lead) => (
                                        <div key={lead.id} className="border rounded-md p-4 bg-gray-50">
                                            {/* Lead Header */}
                                            <div className="flex justify-between items-center mb-4">
                                                <div>
                                                    <div className="text-lg font-semibold text-gray-900">{lead.name}</div>
                                                    <div className="text-sm text-gray-600">{lead.company}</div>
                                                    <div className="text-xs text-gray-500">
                                                        Morning Plan: {lead.actionPlanned} • {lead.timeAllocated}h
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm capitalize px-2 py-1 rounded bg-white border">
                                                        {lead.status}
                                                    </span>
                                                    <button
                                                        onClick={() => toggleExpand(lead.id)}
                                                        className="p-1 hover:bg-gray-200 rounded"
                                                    >
                                                        <ChevronUp className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Form Grid */}
                                            <div className="grid grid-cols-2 gap-2 mt-4">
                                                {/* Target Category */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Category</label>
                                                    <select
                                                        value={lead.targetCategory}
                                                        disabled={isAlreadySubmitted}
                                                        onChange={(e) => updateLeadReport(lead.id, "targetCategory", e.target.value)}
                                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                                    >
                                                        <option value="sales_in">Sales In</option>
                                                        <option value="lead_in">Lead In</option>
                                                        <option value="business_in">Business In</option>
                                                        <option value="amount_in">Amount In</option>
                                                    </select>
                                                </div>

                                                {/* Vertical */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Vertical</label>
                                                    <select
                                                        value={lead.vertical}
                                                        disabled={isAlreadySubmitted}
                                                        onChange={(e) => updateLeadReport(lead.id, "vertical", e.target.value)}
                                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                                    >
                                                        <option value="self">Self</option>
                                                        <option value="business_associates">Business Associates</option>
                                                        <option value="franchise">Franchise</option>
                                                        <option value="partner">Partner</option>
                                                    </select>
                                                </div>

                                                {/* Expected Amount (Readonly) */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Expected Amount</label>
                                                    <input
                                                        readOnly
                                                        value={fmt(lead.expectedAmount)}
                                                        className="w-full border border-gray-300 bg-gray-100 rounded-md px-3 py-2 text-sm"
                                                    />
                                                </div>

                                                {/* Time Duration */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Time Duration</label>
                                                    <select
                                                        disabled={isAlreadySubmitted}
                                                        value={lead.timeDuration}
                                                        onChange={(e) => updateLeadReport(lead.id, "timeDuration", Number(e.target.value))}
                                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                                    >
                                                        {durationOptions.map((t) => (
                                                            <option key={t} value={t}>
                                                                {t}h
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Lead Amount (2%) */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Lead Amount (2%)</label>
                                                    <input
                                                        readOnly
                                                        value={fmt(lead.leadAmount)}
                                                        className="w-full border border-gray-300 bg-gray-100 rounded-md px-3 py-2 text-sm"
                                                    />
                                                </div>

                                                {/* Deal Amount (2%) */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Deal Amount (2%)</label>
                                                    <input
                                                        readOnly
                                                        value={fmt(lead.dealAmount)}
                                                        className="w-full border border-gray-300 bg-gray-100 rounded-md px-3 py-2 text-sm"
                                                    />
                                                </div>

                                                {/* Relation Amount (2%) */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Relation Amount (2%)</label>
                                                    <input
                                                        readOnly
                                                        value={fmt(lead.relationAmount)}
                                                        className="w-full border border-gray-300 bg-gray-100 rounded-md px-3 py-2 text-sm"
                                                    />
                                                </div>

                                                {/* Total Incentive */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Incentive</label>
                                                    <input
                                                        readOnly
                                                        value={fmt(calculateTotalIncentive(lead))}
                                                        className="w-full border border-gray-300 bg-green-50 rounded-md px-3 py-2 text-sm font-medium"
                                                    />
                                                </div>

                                                {/* Status Block */}
                                                <div className="col-span-2 border rounded-md p-2 bg-white mt-2">
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {/* Status */}
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                                            <select
                                                                disabled={isAlreadySubmitted}
                                                                value={lead.status}
                                                                onChange={(e) => updateLeadReport(lead.id, "status", e.target.value)}
                                                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                                            >
                                                                <option value="hot">Hot</option>
                                                                <option value="warm">Warm</option>
                                                                <option value="cold">Cold</option>
                                                                <option value="win">Won</option>
                                                                <option value="loss">Lost</option>
                                                            </select>
                                                        </div>

                                                        {/* Actual Amount */}
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Actual Amount (₹)</label>
                                                            <input

                                                                type="number"
                                                                value={lead.actualAmount}
                                                                onChange={(e) => updateLeadReport(lead.id, "actualAmount", e.target.value)}
                                                                disabled={lead.status === "loss" || isAlreadySubmitted}
                                                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm disabled:bg-gray-100"
                                                            />
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                Expected: {fmt(lead.expectedAmount)}
                                                            </p>
                                                        </div>

                                                        {/* Time Spent */}
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Time Spent (h)</label>
                                                            <input
                                                                type="number"
                                                                value={lead.timeSpent}
                                                                disabled={isAlreadySubmitted}
                                                                onChange={(e) => updateLeadReport(lead.id, "timeSpent", e.target.value)}
                                                                step="0.5"
                                                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                                            />
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                Planned: {lead.timeAllocated}h
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Conditional Sections */}
                                                    {lead.status === "win" && (
                                                        <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Win Reason</label>
                                                                <select
                                                                    value={lead.winReason}
                                                                    onChange={(e) => updateLeadReport(lead.id, "winReason", e.target.value)}
                                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                                                    disabled={isAlreadySubmitted}
                                                                >
                                                                    <option value="">Select reason...</option>
                                                                    {winReasons.map((r) => (
                                                                        <option key={r} value={r}>
                                                                            {r}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Next Action</label>
                                                                <input
                                                                    type="text"
                                                                    value={lead.nextAction}
                                                                    disabled={isAlreadySubmitted}
                                                                    onChange={(e) => updateLeadReport(lead.id, "nextAction", e.target.value)}
                                                                    placeholder="Contract, delivery etc."
                                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {lead.status === "loss" && (
                                                        <div className="mt-4 pt-4 border-t">
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Loss Reason</label>
                                                            <select
                                                                value={lead.lossReason}
                                                                disabled={isAlreadySubmitted}
                                                                onChange={(e) => updateLeadReport(lead.id, "lossReason", e.target.value)}
                                                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                                            >
                                                                <option value="">Select reason...</option>
                                                                {lossReasons.map((r) => (
                                                                    <option key={r} value={r}>
                                                                        {r}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    )}

                                                    {lead.status === "progress" && (
                                                        <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Progress Notes</label>
                                                                <textarea
                                                                    disabled={isAlreadySubmitted}
                                                                    value={lead.progressNotes}
                                                                    onChange={(e) => updateLeadReport(lead.id, "progressNotes", e.target.value)}
                                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm resize-none"
                                                                    rows={1}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
                                                                <input
                                                                    type="date"
                                                                    disabled={isAlreadySubmitted}
                                                                    value={lead.followUpDate}
                                                                    onChange={(e) => updateLeadReport(lead.id, "followUpDate", e.target.value)}
                                                                    min={new Date().toISOString().split("T")[0]}
                                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Remark */}
                                                <div className="col-span-2 mt-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Remark</label>
                                                    <textarea
                                                        rows={2}
                                                        value={lead.remark}
                                                        disabled={isAlreadySubmitted}
                                                        onChange={(e) => updateLeadReport(lead.id, "remark", e.target.value)}
                                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm resize-none"
                                                        placeholder="Enter any additional remarks..."
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
                    <EveningTeam />
                )}

                {/* Footer Submit (only for self reporting) */}
                {reportingMode === "self" && eveningReport.length > 0 && (
                    <div className="mt-6 bg-white border border-gray-200 rounded-md p-4 flex items-center justify-between">
                        <div>
                            <h4 className="text-base font-medium text-gray-900">Ready to Submit?</h4>
                            <p className="text-sm text-gray-600">
                                {eveningReport.filter((l) => l.status === "win").length} won,{" "}
                                {eveningReport.filter((l) => l.status === "loss").length} lost,{" "}
                                {eveningReport.filter((l) => l.status === "progress").length} in progress
                                {" • "}Total Incentive: {fmt(getTotalIncentives())}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                        
                            <button
                                onClick={submitEveningReport}
                                className="px-6 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
                            >
                                Submit Evening Report
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    export default EveningReportManager;