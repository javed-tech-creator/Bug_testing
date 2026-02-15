// import React, { useEffect, useState } from "react";
// import {
//   CheckCircle2,
//   XCircle,
//   Clock,
//   Calendar,
//   Target,
//   AlertCircle,
//   TrendingUp,
//   TrendingDown,
//   Search,
//   ChevronDown,
//   ChevronUp,
//   Phone,
//   Mail,
//   MapPin,
//   Filter,
//   Download,
// } from "lucide-react";
// import PageHeader from "../../../components/PageHeader";
// import { useAddEveningReportMutation, useGetTodayReportQuery } from "@/api/sales/reporting.api";

// const PERCENT = 0.02;

// const fmt = (n) =>
//   typeof n === "number"
//     ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n)
//     : n;

// const durationOptions = Array.from({ length: 16 }, (_, i) => (i + 1) * 0.5);

// const EveningReport = () => {
//   // Morning data (static mock - expanded with contact info)
//   const [morningPlan] = useState({
//     date: new Date().toLocaleDateString("hi-IN"),
//     salesperson: "Rahul Verma",
//     plannedLeads: [
//       {
//         id: 1,
//         name: "Rajesh Kumar",
//         company: "Tech Solutions Pvt Ltd",
//         phone: "+91 98765 43210",
//         email: "rajesh@techsol.com",
//         location: "Gomti Nagar, Lucknow",
//         expectedAmount: 85000,
//         timeAllocated: 3,
//         actionPlanned: "demo",
//         notes: "Product demo scheduled, high interest shown",
//       },
//       {
//         id: 2,
//         name: "Priya Sharma",
//         company: "Digital Marketing Co",
//         phone: "+91 87654 32109",
//         email: "priya@digitalmark.com",
//         location: "Hazratganj, Lucknow",
//         expectedAmount: 45000,
//         timeAllocated: 2,
//         actionPlanned: "meeting",
//         notes: "Follow-up meeting for proposal discussion",
//       },
//       {
//         id: 3,
//         name: "Amit Singh",
//         company: "Manufacturing Ltd",
//         phone: "+91 76543 21098",
//         email: "amit@manufacturing.com",
//         location: "Indira Nagar, Lucknow",
//         expectedAmount: 65000,
//         timeAllocated: 2,
//         actionPlanned: "call",
//         notes: "Price negotiation call scheduled",
//       },
//       {
//         id: 4,
//         name: "Sunita Gupta",
//         company: "Retail Chain",
//         phone: "+91 65432 10987",
//         email: "sunita@retailchain.com",
//         location: "Aliganj, Lucknow",
//         expectedAmount: 35000,
//         timeAllocated: 1,
//         actionPlanned: "call",
//         notes: "Initial interest check call",
//       },
//       {
//         id: 5,
//         name: "Vikash Yadav",
//         company: "Construction Corp",
//         phone: "+91 54321 09876",
//         email: "vikash@construction.com",
//         location: "Mahanagar, Lucknow",
//         expectedAmount: 75000,
//         timeAllocated: 2.5,
//         actionPlanned: "meeting",
//         notes: "Site visit and proposal discussion",
//       },
//       {
//         id: 6,
//         name: "Neha Agarwal",
//         company: "IT Services",
//         phone: "+91 43210 98765",
//         email: "neha@itservices.com",
//         location: "Rajajipuram, Lucknow",
//         expectedAmount: 55000,
//         timeAllocated: 1.5,
//         actionPlanned: "demo",
//         notes: "Software demo scheduled",
//       },
//     ],
//     totalExpected: 350000,
//     totalTimeAllocated: 11,
//   });

//   // Evening default converts morning leads to editable
//   const [eveningReport, setEveningReport] = useState(
//     morningPlan.plannedLeads.map((lead) => ({
//       ...lead,
//       status: "progress",
//       actualAmount: lead.expectedAmount,
//       timeSpent: lead.timeAllocated,
//       targetCategory: "sales_in",
//       vertical: "self",
//       timeDuration: lead.timeAllocated,
//       remark: "",
//       leadAmount: Number((lead.expectedAmount * PERCENT).toFixed(2)),
//       dealAmount: Number((lead.expectedAmount * PERCENT).toFixed(2)),
//       relationAmount: Number((lead.expectedAmount * PERCENT).toFixed(2)),
//       winReason: "",
//       lossReason: "",
//       progressNotes: lead.notes,
//       nextAction: "",
//       followUpDate: new Date(Date.now() + 86400000).toISOString().split("T")[0], // Tomorrow
//       expand: false,
//     }))
//   );


//   const { data: morningReportData } = useGetTodayReportQuery({ type: "morning" });
//   const [addEvening, { isLoading: addEveningLoading }] = useAddEveningReportMutation();
//   console.log(morningReportData);
//   // Morning ke leads ko evening report mein convert karo
//   useEffect(() => {
//     if (morningReportData?.data) {
//       const morningLeads = morningReportData?.data?.data.leads || [];
//       const eveningLeads = morningLeads.map(lead => ({
//         ...lead,
//         status: "progress",
//         actualAmount: lead.expectedAmount,
//         timeSpent: lead.timeDuration,
//         // ... rest fields
//       }));
//       setEveningReport(eveningLeads);
//     }
//   }, [morningReportData]);

  

//   const [leadSearch, setLeadSearch] = useState("");
//   const [summaryFilter, setSummaryFilter] = useState("today");
//   const [currentSummary, setCurrentSummary] = useState({
//     leadTarget: 50,
//     leadAch: 42,
//     salesTarget: 30,
//     salesAch: 28,
//     businessTarget: 20,
//     businessAch: 18,
//     amountTarget: 150,
//     amountAch: 125,
//   });

//   // Filter states for the table
//   const [tableFilters, setTableFilters] = useState({
//     timePeriod: "today",
//     targetCategory: "all",
//     vertical: "all",
//     status: "all",
//   });

//   // Calculate total incentive for a lead
//   const calculateTotalIncentive = (lead) => {
//     if (lead.status !== "win") return 0;
//     return Number(lead.leadAmount || 0) + Number(lead.dealAmount || 0) + Number(lead.relationAmount || 0);
//   };

//   // Filter the table data based on selected filters
//   const getFilteredTableData = () => {
//     let filtered = [...eveningReport];

//     // Filter by target category
//     if (tableFilters.targetCategory !== "all") {
//       filtered = filtered.filter(lead => lead.targetCategory === tableFilters.targetCategory);
//     }

//     // Filter by vertical
//     if (tableFilters.vertical !== "all") {
//       filtered = filtered.filter(lead => lead.vertical === tableFilters.vertical);
//     }

//     // Filter by status
//     if (tableFilters.status !== "all") {
//       filtered = filtered.filter(lead => lead.status === tableFilters.status);
//     }

//     // Filter by time period (you would need actual date data for proper filtering)
//     // This is a placeholder implementation
//     if (tableFilters.timePeriod !== "all") {
//       // In a real app, you would filter by actual dates
//       // For now, we'll just return all data
//     }

//     return filtered;
//   };

//   const updateLeadReport = (id, field, value) => {
//     setEveningReport((prev) =>
//       prev.map((lead) => {
//         if (lead.id !== id) return lead;

//         const updatedLead = { ...lead, [field]: value };

//         // Recalculate amounts if expected amount changes
//         if (field === "actualAmount") {
//           const actual = Number(value || 0);
//           updatedLead.leadAmount = Number((actual * PERCENT).toFixed(2));
//           updatedLead.dealAmount = Number((actual * PERCENT).toFixed(2));
//           updatedLead.relationAmount = Number((actual * PERCENT).toFixed(2));
//         }

//         return updatedLead;
//       })
//     );
//   };

//   const toggleExpand = (id) => {
//     setEveningReport((prev) =>
//       prev.map((lead) =>
//         lead.id === id ? { ...lead, expand: !lead.expand } : lead
//       )
//     );
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "win":
//         return <CheckCircle2 className="w-4 h-4 text-green-600" />;
//       case "loss":
//         return <XCircle className="w-4 h-4 text-red-600" />;
//       case "progress":
//         return <Clock className="w-4 h-4 text-amber-600" />;
//       default:
//         return <AlertCircle className="w-4 h-4 text-gray-600" />;
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "win": return "border-green-200 bg-green-50";
//       case "loss": return "border-red-200 bg-red-50";
//       case "progress": return "border-amber-200 bg-amber-50";
//       default: return "border-gray-200 bg-gray-50";
//     }
//   };

//   const getTotalActualAmount = () =>
//     eveningReport
//       .filter((lead) => lead.status === "win")
//       .reduce((t, l) => t + Number(l.actualAmount || 0), 0);

//   const getTotalTimeSpent = () =>
//     eveningReport.reduce((t, l) => t + Number(l.timeSpent || 0), 0);

//   const getConversionRate = () => {
//     const total = eveningReport.length;
//     const won = eveningReport.filter((l) => l.status === "win").length;
//     return total ? Math.round((won / total) * 100) : 0;
//   };

//   // Calculate total incentives
//   const getTotalIncentives = () => {
//     return eveningReport.reduce((total, lead) => {
//       return total + calculateTotalIncentive(lead);
//     }, 0);
//   };

//   const winReasons = [
//     "Competitive pricing",
//     "Superior product features",
//     "Excellent service quality",
//     "Strong relationship",
//     "Perfect timing",
//     "Customized solution",
//     "Quick response time",
//   ];

//   const lossReasons = [
//     "Price too high",
//     "Competitor chosen",
//     "Budget constraints",
//     "Timing issues",
//     "Feature mismatch",
//     "Decision postponed",
//     "Internal changes",
//   ];

//   const submitEveningReport = () => {
//     alert("Evening report submitted successfully.");
//   };

//   const filteredLeads = eveningReport.filter(
//     (lead) =>
//       lead.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
//       lead.company.toLowerCase().includes(leadSearch.toLowerCase()) ||
//       lead.phone.includes(leadSearch)
//   );

//   const filteredTableData = getFilteredTableData();

//   return (
//     <div className="max-w-7xl mx-auto">
//       <PageHeader title="Evening Reporting" />

//       {/* HEADER STATS */}
//       <div className="bg-white border border-gray-200 rounded-md p-2 px-4 mb-4">
//         <div className="flex justify-between items-center">
//           {/* Left - Date */}
//           <div className="flex items-center gap-2 text-gray-700">
//             <Calendar className="w-5 h-5 text-gray-700" />
//             <span className="text-sm font-medium">
//               {new Date().toLocaleDateString("en-IN", {
//                 weekday: "long",
//                 day: "numeric",
//                 month: "short",
//                 year: "numeric",
//               })}
//             </span>
//           </div>

//           {/* Right - Stats */}
//           <div className="flex gap-6">
//             <div className="flex flex-col items-center">
//               <div className="text-lg font-semibold text-gray-900">{eveningReport.length}</div>
//               <div className="text-[11px] tracking-wide text-gray-500">TOTAL LEADS</div>
//             </div>

//             <div className="flex flex-col items-center">
//               <div className="text-lg font-semibold text-gray-900">{getConversionRate()}%</div>
//               <div className="text-[11px] tracking-wide text-gray-500">CONVERSION</div>
//             </div>

//             <div className="flex flex-col items-center">
//               <div className="text-lg font-semibold text-gray-900">{getTotalTimeSpent()}h</div>
//               <div className="text-[11px] tracking-wide text-gray-500">TIME SPENT</div>
//             </div>

//             <div className="flex flex-col items-center">
//               <div className="text-lg font-semibold text-gray-900">
//                 {fmt(getTotalIncentives())}
//               </div>
//               <div className="text-[11px] tracking-wide text-gray-500">TOTAL INCENTIVE</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-12 gap-4">
//         {/* LEFT COLUMN: LEAD LIST */}
//         <div className="col-span-5 bg-white border border-gray-200 rounded-md p-3">
//           <div className="flex items-center justify-between mb-3">
//             <h3 className="text-base font-medium text-gray-900">
//               Today's Leads ({eveningReport.length})
//             </h3>

//             {/* Search Input */}
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search leads..."
//                 value={leadSearch}
//                 onChange={(e) => setLeadSearch(e.target.value)}
//                 className="w-40 text-sm border border-gray-300 rounded pl-8 pr-2 py-1 focus:outline-none focus:ring-1 focus:ring-gray-400"
//               />
//               <Search className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
//             </div>
//           </div>

//           <div className="space-y-2 max-h-[36rem] overflow-y-auto">
//             {filteredLeads.map((lead) => (
//               <div
//                 key={lead.id}
//                 className={`p-2 rounded-md border ${getStatusColor(lead.status)} transition-colors duration-200 cursor-pointer hover:bg-opacity-80`}
//                 onClick={() => toggleExpand(lead.id)}
//               >
//                 <div className="flex items-start gap-3">
//                   <div className="mt-1">
//                     {getStatusIcon(lead.status)}
//                   </div>
//                   <div className="flex-1">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <div className="text-base font-medium text-gray-900">{lead.name}</div>
//                         <div className="text-sm text-gray-500">{lead.company}</div>
//                       </div>
//                       <div className="text-right">
//                         <div className="text-sm font-medium text-gray-900">{fmt(lead.actualAmount)}</div>
//                         <div className="text-xs text-gray-500 capitalize">{lead.status}</div>
//                       </div>
//                     </div>

//                     <div className="mt-2 text-sm text-gray-700 space-y-1">
//                       <div className="flex items-center gap-2">
//                         <Phone className="w-3 h-3 text-gray-400" />
//                         <span>{lead.phone}</span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <Mail className="w-3 h-3 text-gray-400" />
//                         <span className="truncate">{lead.email}</span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <MapPin className="w-3 h-3 text-gray-400" />
//                         <span>{lead.location}</span>
//                       </div>
//                     </div>

//                     <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
//                       <span>Planned: {lead.timeAllocated}h • Spent: {lead.timeSpent}h</span>
//                       <button className="p-1">
//                         {lead.expand ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* RIGHT COLUMN: DETAILED REPORT */}
//         <div className="col-span-7 bg-white border border-gray-200 rounded-md p-3">
//           <div className="flex items-center justify-between mb-3">
//             <h3 className="text-base font-medium text-gray-900 flex items-center gap-2">
//               <Target className="w-4 h-4" />
//               Lead Details
//             </h3>
//             <div className="text-sm text-gray-500">
//               {filteredLeads.filter(l => l.expand).length} expanded
//             </div>
//           </div>

//           <div className="space-y-3 max-h-[36rem] overflow-y-auto">
//             {filteredLeads.filter(lead => lead.expand).map((lead) => (
//               <div key={lead.id} className="border rounded-md p-3 bg-gray-50">
//                 {/* Lead Header */}
//                 <div className="flex justify-between items-center mb-3">
//                   <div>
//                     <div className="text-lg font-semibold text-gray-900">{lead.name}</div>
//                     <div className="text-sm text-gray-600">{lead.company}</div>
//                     <div className="text-xs text-gray-500">
//                       Morning Plan: {lead.actionPlanned} • {lead.timeAllocated}h
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <span className="text-sm capitalize px-2 py-1 rounded bg-white border">
//                       {lead.status}
//                     </span>
//                     <button
//                       onClick={() => toggleExpand(lead.id)}
//                       className="p-1 hover:bg-gray-200 rounded"
//                     >
//                       <ChevronUp className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>

//                 {/* Form Grid */}
//                 <div className="grid grid-cols-2 gap-2 text-sm">
//                   {/* Target Category */}
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-1">
//                       Target Category
//                     </label>
//                     <select
//                       value={lead.targetCategory}
//                       onChange={(e) =>
//                         updateLeadReport(lead.id, "targetCategory", e.target.value)
//                       }
//                       className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
//                     >
//                       <option value="sales_in">Sales In</option>
//                       <option value="lead_in">Lead In</option>
//                       <option value="business_in">Business In</option>
//                       <option value="amount_in">Amount In</option>
//                     </select>
//                   </div>

//                   {/* Vertical */}
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-1">
//                       Vertical
//                     </label>
//                     <select
//                       value={lead.vertical}
//                       onChange={(e) =>
//                         updateLeadReport(lead.id, "vertical", e.target.value)
//                       }
//                       className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
//                     >
//                       <option value="self">Self</option>
//                       <option value="business_associates">Business Associates</option>
//                       <option value="franchise">Franchise</option>
//                       <option value="partner">Partner</option>
//                     </select>
//                   </div>

//                   {/* Expected Amount (Readonly) */}
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-1">
//                       Expected Amount
//                     </label>
//                     <input
//                       readOnly
//                       value={fmt(lead.expectedAmount)}
//                       className="w-full border border-gray-300 bg-gray-100 rounded px-2 py-1.5 text-sm"
//                     />
//                   </div>

//                   {/* Time Duration */}
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-1">
//                       Time Duration
//                     </label>
//                     <select
//                       value={lead.timeDuration}
//                       onChange={(e) =>
//                         updateLeadReport(lead.id, "timeDuration", Number(e.target.value))
//                       }
//                       className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
//                     >
//                       {durationOptions.map((t) => (
//                         <option key={t} value={t}>
//                           {t}h
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Lead Amount (2%) */}
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-1">
//                       Lead Amount (2%)
//                     </label>
//                     <input
//                       readOnly
//                       value={fmt(lead.leadAmount)}
//                       className="w-full border border-gray-300 bg-gray-100 rounded px-2 py-1.5 text-sm"
//                     />
//                   </div>

//                   {/* Deal Amount (2%) */}
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-1">
//                       Deal Amount (2%)
//                     </label>
//                     <input
//                       readOnly
//                       value={fmt(lead.dealAmount)}
//                       className="w-full border border-gray-300 bg-gray-100 rounded px-2 py-1.5 text-sm"
//                     />
//                   </div>

//                   {/* Relationship Amount (2%) */}
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-1">
//                       Relationship Amount (2%)
//                     </label>
//                     <input
//                       readOnly
//                       value={fmt(lead.relationAmount)}
//                       className="w-full border border-gray-300 bg-gray-100 rounded px-2 py-1.5 text-sm"
//                     />
//                   </div>

//                   {/* Total Incentive */}
//                   <div>
//                     <label className="block text-xs font-medium text-gray-700 mb-1">
//                       Total Incentive
//                     </label>
//                     <input
//                       readOnly
//                       value={fmt(calculateTotalIncentive(lead))}
//                       className="w-full border border-gray-300 bg-green-50 rounded px-2 py-1.5 text-sm font-medium"
//                     />
//                   </div>

//                   {/* Remark */}
//                   <div className="col-span-2">
//                     <label className="block text-xs font-medium text-gray-700 mb-1">
//                       Remark
//                     </label>
//                     <textarea
//                       rows={2}
//                       value={lead.remark}
//                       onChange={(e) =>
//                         updateLeadReport(lead.id, "remark", e.target.value)
//                       }
//                       className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-gray-400"
//                       placeholder="Enter any additional remarks..."
//                     />
//                   </div>

//                   {/* Status Block */}
//                   <div className="col-span-2 border rounded p-3 bg-white">
//                     <div className="grid grid-cols-3 gap-3">
//                       {/* Status */}
//                       <div>
//                         <label className="block text-xs font-medium text-gray-700 mb-1">
//                           Status
//                         </label>
//                         <select
//                           value={lead.status}
//                           onChange={(e) =>
//                             updateLeadReport(lead.id, "status", e.target.value)
//                           }
//                           className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
//                         >
//                           <option value="progress">Hot</option>
//                           <option value="progress">Warm</option>
//                           <option value="progress">Cold</option>
//                           <option value="win">Won</option>
//                           <option value="loss">Lost</option>
//                         </select>
//                       </div>

//                       {/* Actual Amount */}
//                       <div>
//                         <label className="block text-xs font-medium text-gray-700 mb-1">
//                           Actual Amount (₹)
//                         </label>
//                         <input
//                           type="number"
//                           value={lead.actualAmount}
//                           onChange={(e) =>
//                             updateLeadReport(lead.id, "actualAmount", e.target.value)
//                           }
//                           disabled={lead.status === "loss"}
//                           className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:bg-gray-100"
//                         />
//                         <p className="text-xs text-gray-500 mt-1">
//                           Expected: {fmt(lead.expectedAmount)}
//                         </p>
//                       </div>

//                       {/* Time Spent */}
//                       <div>
//                         <label className="block text-xs font-medium text-gray-700 mb-1">
//                           Time Spent (h)
//                         </label>
//                         <input
//                           type="number"
//                           value={lead.timeSpent}
//                           onChange={(e) =>
//                             updateLeadReport(lead.id, "timeSpent", e.target.value)
//                           }
//                           step="0.5"
//                           className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
//                         />
//                         <p className="text-xs text-gray-500 mt-1">
//                           Planned: {lead.timeAllocated}h
//                         </p>
//                       </div>
//                     </div>

//                     {/* Conditional Sections */}
//                     {lead.status === "win" && (
//                       <div className="mt-3 grid grid-cols-2 gap-3 pt-3 border-t">
//                         <div>
//                           <label className="block text-xs font-medium text-gray-700 mb-1">
//                             Win Reason
//                           </label>
//                           <select
//                             value={lead.winReason}
//                             onChange={(e) =>
//                               updateLeadReport(lead.id, "winReason", e.target.value)
//                             }
//                             className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
//                           >
//                             <option value="">Select reason...</option>
//                             {winReasons.map((r) => (
//                               <option key={r} value={r}>
//                                 {r}
//                               </option>
//                             ))}
//                           </select>
//                         </div>
//                         <div>
//                           <label className="block text-xs font-medium text-gray-700 mb-1">
//                             Next Action
//                           </label>
//                           <input
//                             type="text"
//                             value={lead.nextAction}
//                             onChange={(e) =>
//                               updateLeadReport(lead.id, "nextAction", e.target.value)
//                             }
//                             placeholder="Contract, delivery etc."
//                             className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
//                           />
//                         </div>
//                       </div>
//                     )}

//                     {lead.status === "loss" && (
//                       <div className="mt-3 pt-3 border-t">
//                         <label className="block text-xs font-medium text-gray-700 mb-1">
//                           Loss Reason
//                         </label>
//                         <select
//                           value={lead.lossReason}
//                           onChange={(e) =>
//                             updateLeadReport(lead.id, "lossReason", e.target.value)
//                           }
//                           className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
//                         >
//                           <option value="">Select reason...</option>
//                           {lossReasons.map((r) => (
//                             <option key={r} value={r}>
//                               {r}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     )}

//                     {lead.status === "progress" && (
//                       <div className="mt-3 grid grid-cols-2 gap-3 pt-3 border-t">
//                         <div>
//                           <label className="block text-xs font-medium text-gray-700 mb-1">
//                             Progress Notes
//                           </label>
//                           <textarea
//                             value={lead.progressNotes}
//                             onChange={(e) =>
//                               updateLeadReport(lead.id, "progressNotes", e.target.value)
//                             }
//                             className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm resize-none"
//                             rows={3}
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-xs font-medium text-gray-700 mb-1">
//                             Follow-up Date
//                           </label>
//                           <input
//                             type="date"
//                             value={lead.followUpDate}
//                             onChange={(e) =>
//                               updateLeadReport(lead.id, "followUpDate", e.target.value)
//                             }
//                             min={new Date().toISOString().split("T")[0]}
//                             className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
//                           />
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}

//             {filteredLeads.filter(l => l.expand).length === 0 && (
//               <div className="text-center py-8 text-gray-500">
//                 Select a lead from the left panel to view and edit details
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* FOOTER SUBMIT */}
//       {filteredLeads.length > 0 && (
//         <div className="mt-4 bg-white border border-gray-200 rounded-md p-3 flex items-center justify-between">
//           <div>
//             <div className="text-base font-medium text-gray-900">Report Summary</div>
//             <div className="text-sm text-gray-600">
//               {eveningReport.filter((l) => l.status === "win").length} won,{" "}
//               {eveningReport.filter((l) => l.status === "loss").length} lost,{" "}
//               {eveningReport.filter((l) => l.status === "progress").length} in progress
//               {" • "}Total Incentive: {fmt(getTotalIncentives())}
//             </div>
//           </div>
//           <div>
//             <button
//               onClick={submitEveningReport}
//               className="bg-black text-white text-base px-6 py-2 rounded hover:bg-gray-800 transition-colors duration-200"
//             >
//               Submit Evening Report
//             </button>
//           </div>
//         </div>
//       )}

//       {/* NEW Comparison Table with Filters */}
//       <div className="bg-white border border-gray-200 rounded-lg shadow-sm mt-6">
//         {/* Header with Filters */}
//         <div className="p-3 border-b rounded-lg bg-black flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//           <div className="flex items-center gap-3">
//             <h3 className="text-lg font-semibold text-white">
//               Incentive Summary Report
//             </h3>
           
//           </div>

//           <div className="flex flex-wrap gap-2">
//             {/* Time Period Filter */}
//             <select
//               className="p-1.5 border text-sm rounded-lg bg-gray-100 min-w-[120px]"
//               value={tableFilters.timePeriod}
//               onChange={(e) => setTableFilters({...tableFilters, timePeriod: e.target.value})}
//             >
//               <option value="today">Today</option>
//               <option value="slot">This Slot</option>
//               <option value="month">This Month</option>
//               <option value="quarter">This Quarter</option>
//               <option value="year">This Year</option>
//               <option value="all">All Time</option>
//             </select>

//             {/* Target Category Filter */}
//             <select
//               className="p-1.5 border text-sm rounded-lg bg-gray-100 min-w-[120px]"
//               value={tableFilters.targetCategory}
//               onChange={(e) => setTableFilters({...tableFilters, targetCategory: e.target.value})}
//             >
//               <option value="all">All Categories</option>
//               <option value="sales_in">Sales In</option>
//               <option value="lead_in">Lead In</option>
//               <option value="business_in">Business In</option>
//               <option value="amount_in">Amount In</option>
//             </select>

//             {/* Vertical Filter */}
//             <select
//               className="p-1.5 border text-sm rounded-lg bg-gray-100 min-w-[120px]"
//               value={tableFilters.vertical}
//               onChange={(e) => setTableFilters({...tableFilters, vertical: e.target.value})}
//             >
//               <option value="all">All Verticals</option>
//               <option value="self">Self</option>
//               <option value="business_associates">Business Associates</option>
//               <option value="franchise">Franchise</option>
//               <option value="partner">Partner</option>
//             </select>

//             {/* Status Filter */}
//             <select
//               className="p-1.5 border text-sm rounded-lg bg-gray-100 min-w-[120px]"
//               value={tableFilters.status}
//               onChange={(e) => setTableFilters({...tableFilters, status: e.target.value})}
//             >
//               <option value="all">All Status</option>
//               <option value="win">Won</option>
//               <option value="loss">Lost</option>
//               <option value="progress">In Progress</option>
//             </select>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto rounded-lg">
//           <table className="w-full text-sm border-collapse">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="border px-4 py-3 text-center font-semibold">Sr</th>
//                 <th className="border px-4 py-3 text-center font-semibold">Target Category</th>
//                 <th className="border px-4 py-3 text-center font-semibold">Vertical</th>
//                 <th className="border px-4 py-3 text-center font-semibold">Client Name</th>
//                 <th className="border px-4 py-3 text-center font-semibold">Expected</th>
//                 <th className="border px-4 py-3 text-center font-semibold bg-amber-50">Lead 2%</th>
//                 <th className="border px-4 py-3 text-center font-semibold bg-purple-50">Deal 2%</th>
//                 <th className="border px-4 py-3 text-center font-semibold bg-pink-50">Relation 2%</th>
//                 <th className="border px-4 py-3 text-center font-semibold bg-green-50">Total Incentive</th>
//                 <th className="border px-4 py-3 text-center font-semibold">Status</th>
//               </tr>
//             </thead>

//             <tbody className="bg-white">
//               {filteredTableData.map((lead, index) => {
//                 const exp = Number(lead.expectedAmount || 0);
//                 const leadIncentive = Number((exp * 0.02).toFixed(2));
//                 const totalIncentive = calculateTotalIncentive(lead);

//                 return (
//                   <tr key={lead.id} className="hover:bg-gray-50">
//                     <td className="border px-3 py-2 text-center">{index + 1}</td>
//                     <td className="border px-3 py-2 text-center capitalize">
//                       {lead.targetCategory.replace("_", " ")}
//                     </td>
//                     <td className="border px-3 py-2 text-center capitalize">
//                       {lead.vertical}
//                     </td>
//                     <td className="border px-3 py-2 text-center">
//                       {lead.name}
//                     </td>
//                     <td className="border px-3 py-2 text-center font-medium">
//                       {fmt(exp)}
//                     </td>
//                     <td className="border px-3 py-2 text-center text-amber-700">
//                       {lead.status === "win" ? fmt(leadIncentive) : "₹0"}
//                     </td>
//                     <td className="border px-3 py-2 text-center text-purple-700">
//                       {lead.status === "win" ? fmt(leadIncentive) : "₹0"}
//                     </td>
//                     <td className="border px-3 py-2 text-center text-pink-700">
//                       {lead.status === "win" ? fmt(leadIncentive) : "₹0"}
//                     </td>
//                     <td className="border px-3 py-2 text-center font-semibold bg-green-50 text-green-700">
//                       {fmt(totalIncentive)}
//                     </td>
//                     <td className="border px-3 py-2 text-center capitalize">
//                       <span className={`px-2 py-1 rounded-full text-xs ${
//                         lead.status === "win" ? "bg-green-100 text-green-800" :
//                         lead.status === "loss" ? "bg-red-100 text-red-800" :
//                         "bg-amber-100 text-amber-800"
//                       }`}>
//                         {lead.status}
//                       </span>
//                     </td>
//                   </tr>
//                 );
//               })}

//               {/* Totals Row */}
//               {filteredTableData.length > 0 && (
//                 <tr className="bg-gray-200 font-semibold">
//                   <td colSpan="4" className="border px-3 py-2 text-right">TOTAL</td>
//                   <td className="border px-3 py-2 text-center">
//                     {fmt(filteredTableData.reduce((t, l) => t + Number(l.expectedAmount), 0))}
//                   </td>
//                   <td className="border px-3 py-2 text-center">
//                     {fmt(filteredTableData
//                       .filter(l => l.status === "win")
//                       .reduce((t, l) => t + Number(l.expectedAmount * 0.02), 0))}
//                   </td>
//                   <td className="border px-3 py-2 text-center">
//                     {fmt(filteredTableData
//                       .filter(l => l.status === "win")
//                       .reduce((t, l) => t + Number(l.expectedAmount * 0.02), 0))}
//                   </td>
//                   <td className="border px-3 py-2 text-center">
//                     {fmt(filteredTableData
//                       .filter(l => l.status === "win")
//                       .reduce((t, l) => t + Number(l.expectedAmount * 0.02), 0))}
//                   </td>
//                   <td className="border px-3 py-2 text-center bg-green-100">
//                     {fmt(getTotalIncentives())}
//                   </td>
//                   <td className="border px-3 py-2 text-center">-</td>
//                 </tr>
//               )}

//               {filteredTableData.length === 0 && (
//                 <tr>
//                   <td colSpan="10" className="border px-4 py-8 text-center text-gray-500">
//                     No data available for the selected filters
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Table Footer */}
//         <div className="p-3 border-t bg-gray-50 flex justify-between items-center">
//           <div className="text-sm text-gray-600">
//             Showing {filteredTableData.length} of {eveningReport.length} records
//             {tableFilters.status !== "all" && ` • Filtered by status: ${tableFilters.status}`}
//           </div>
//           <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 text-sm">
//             <Download className="w-4 h-4" />
//             Export Report
//           </button>
//         </div>
//       </div>

//       {/* Summary Table */}
//       <div className="bg-white border border-gray-200 rounded-lg shadow-sm mt-6">
//         <div className="p-3 border-b rounded-lg bg-black flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//           <h3 className="text-lg font-semibold text-white">
//             Target vs Achievement Summary
//           </h3>
          
//           <select
//             className="p-1.5 border text-sm rounded-lg bg-gray-100"
//             value={summaryFilter}
//             onChange={(e) => setSummaryFilter(e.target.value)}
//           >
//             <option value="today">Today</option>
//             <option value="slot">This Slot</option>
//             <option value="month">This Month</option>
//             <option value="quarter">This Quarter</option>
//             <option value="year">This Year</option>
//           </select>
//         </div>

//         <div className="overflow-x-auto rounded-lg">
//           <table className="w-full text-sm border-collapse">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="border px-4 py-3 text-left font-semibold">Metric</th>
//                 <th className="border px-4 py-3 text-center font-semibold">TARGET</th>
//                 <th className="border px-4 py-3 text-center font-semibold">ACHIEVEMENT</th>
//                 <th className="border px-4 py-3 text-center font-semibold">VARIANCE</th>
//                 <th className="border px-4 py-3 text-center font-semibold">% ACHIEVED</th>
//               </tr>
//             </thead>

//             <tbody className="bg-white">
//               <tr className="hover:bg-gray-50">
//                 <td className="border px-4 py-3 font-medium">Lead In</td>
//                 <td className="border px-4 py-3 text-center">{currentSummary.leadTarget}</td>
//                 <td className="border px-4 py-3 text-center">{currentSummary.leadAch}</td>
//                 <td className={`border px-4 py-3 text-center ${currentSummary.leadAch >= currentSummary.leadTarget ? 'text-green-600' : 'text-red-600'}`}>
//                   {currentSummary.leadAch - currentSummary.leadTarget}
//                 </td>
//                 <td className="border px-4 py-3 text-center">
//                   {Math.round((currentSummary.leadAch / currentSummary.leadTarget) * 100)}%
//                 </td>
//               </tr>

//               <tr className="hover:bg-gray-50">
//                 <td className="border px-4 py-3 font-medium">Sales In</td>
//                 <td className="border px-4 py-3 text-center">{currentSummary.salesTarget}</td>
//                 <td className="border px-4 py-3 text-center">{currentSummary.salesAch}</td>
//                 <td className={`border px-4 py-3 text-center ${currentSummary.salesAch >= currentSummary.salesTarget ? 'text-green-600' : 'text-red-600'}`}>
//                   {currentSummary.salesAch - currentSummary.salesTarget}
//                 </td>
//                 <td className="border px-4 py-3 text-center">
//                   {Math.round((currentSummary.salesAch / currentSummary.salesTarget) * 100)}%
//                 </td>
//               </tr>

//               <tr className="hover:bg-gray-50">
//                 <td className="border px-4 py-3 font-medium">Business In</td>
//                 <td className="border px-4 py-3 text-center">{currentSummary.businessTarget}</td>
//                 <td className="border px-4 py-3 text-center">{currentSummary.businessAch}</td>
//                 <td className={`border px-4 py-3 text-center ${currentSummary.businessAch >= currentSummary.businessTarget ? 'text-green-600' : 'text-red-600'}`}>
//                   {currentSummary.businessAch - currentSummary.businessTarget}
//                 </td>
//                 <td className="border px-4 py-3 text-center">
//                   {Math.round((currentSummary.businessAch / currentSummary.businessTarget) * 100)}%
//                 </td>
//               </tr>

//               <tr className="hover:bg-gray-50">
//                 <td className="border px-4 py-3 font-medium">Amount In (₹ Lacs)</td>
//                 <td className="border px-4 py-3 text-center">₹{currentSummary.amountTarget}L</td>
//                 <td className="border px-4 py-3 text-center">₹{currentSummary.amountAch}L</td>
//                 <td className={`border px-4 py-3 text-center ${currentSummary.amountAch >= currentSummary.amountTarget ? 'text-green-600' : 'text-red-600'}`}>
//                   ₹{currentSummary.amountAch - currentSummary.amountTarget}L
//                 </td>
//                 <td className="border px-4 py-3 text-center">
//                   {Math.round((currentSummary.amountAch / currentSummary.amountTarget) * 100)}%
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EveningReport;


import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Target,
  AlertCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  MapPin,
  Filter,
  Download,
  Loader2,
} from "lucide-react";
import PageHeader from "../../../components/PageHeader";
import { useSelector } from "react-redux";
import { useAddEveningReportMutation, useGetTodayReportQuery } from "@/api/sales/reporting.api.js";
import { toast } from "react-toastify";

const PERCENT = 0.02;

const fmt = (n) =>
  typeof n === "number"
    ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n)
    : n;

const durationOptions = Array.from({ length: 16 }, (_, i) => (i + 1) * 0.5);

const EveningReport = () => {
  const [now, setNow] = useState(new Date());
  const [eveningReport, setEveningReport] = useState([]);
  const [leadSearch, setLeadSearch] = useState("");
  const [summaryFilter, setSummaryFilter] = useState("today");
  const [tableFilters, setTableFilters] = useState({
    timePeriod: "today",
    targetCategory: "all",
    vertical: "all",
    status: "all",
  });

  const user = useSelector((state) => state.auth.userData?.user);
  
  // Fetch morning report data
  const { data: morningReportData, isLoading: isLoadingMorning } = useGetTodayReportQuery({ type: "morning" });
  // Check if evening report already submitted
  const { data: existingEveningReport } = useGetTodayReportQuery({ type: "evening" });
  const [addEvening, { isLoading: addEveningLoading }] = useAddEveningReportMutation();

  // Time validation - Evening reporting: 5 PM to 8 PM
  const isEveningReportingTime = () => {
    const currentHour = now.getHours();
    return currentHour >= 1 && currentHour < 24;
  };

  // Check if already submitted
  const isAlreadySubmitted = Boolean(existingEveningReport?.data?.data);

  // Initialize evening report from morning report
  useEffect(() => {
    if (morningReportData?.data?.data?.leads) {
      const morningLeads = morningReportData.data.data.leads;
      const convertedLeads = morningLeads.map(lead => ({
        id: lead.leadId || lead._id,
        _id: lead.leadId || lead._id,
        leadId: lead.leadId,
        name: lead.leadName,
        company: lead.leadCompany,
        phone: lead.leadPhone,
        email: lead.leadEmail,
        location: lead.leadLocation,
        expectedAmount: lead.expectedAmount,
        actualAmount: lead.expectedAmount,
        status: "progress",
        timeSpent: lead.timeDuration,
        timeAllocated: lead.timeDuration,
        actionPlanned: lead.actionRequired,
        targetCategory: lead.targetCategory || "sales_in",
        vertical: lead.vertical || "self",
        timeDuration: lead.timeDuration,
        remark: lead.remark || "",
        leadAmount: Number((lead.expectedAmount * PERCENT).toFixed(2)),
        dealAmount: Number((lead.expectedAmount * PERCENT).toFixed(2)),
        relationAmount: Number((lead.expectedAmount * PERCENT).toFixed(2)),
        winReason: "",
        lossReason: "",
        progressNotes: lead.remark || "",
        nextAction: "",
        followUpDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
        expand: false,
      }));
      setEveningReport(convertedLeads);
    }
  }, [morningReportData]);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  // Calculate total incentive for a lead
  const calculateTotalIncentive = (lead) => {
    if (lead.status !== "win") return 0;
    return Number(lead.leadAmount || 0) + Number(lead.dealAmount || 0) + Number(lead.relationAmount || 0);
  };

  // Filter the table data based on selected filters
  const getFilteredTableData = () => {
    let filtered = [...eveningReport];

    if (tableFilters.targetCategory !== "all") {
      filtered = filtered.filter(lead => lead.targetCategory === tableFilters.targetCategory);
    }

    if (tableFilters.vertical !== "all") {
      filtered = filtered.filter(lead => lead.vertical === tableFilters.vertical);
    }

    if (tableFilters.status !== "all") {
      filtered = filtered.filter(lead => lead.status === tableFilters.status);
    }

    return filtered;
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
    setEveningReport((prev) =>
      prev.map((lead) =>
        lead.id === id ? { ...lead, expand: !lead.expand } : lead
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

  // Calculate total incentives
  const getTotalIncentives = () => {
    return eveningReport.reduce((total, lead) => {
      return total + calculateTotalIncentive(lead);
    }, 0);
  };

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

  const submitEveningReport = async () => {
    try {
      // Prepare the data in correct format
     const eveningReportData = {
      reportType: "evening",
      completedTasks: ["Follow up with leads", "Update CRM entries"], // Isko aap dynamic bana sakte hain
      tasksPending: ["Submit documentation", "Schedule next meeting"], // Isko bhi dynamic
      meetingsAttended: eveningReport.filter(l => l.actionPlanned === "meeting" && l.status === "win").length,
      achievements: `Closed ${eveningReport.filter(l => l.status === "win").length} deals`,
      challengesFaced: "None", // Isko user input se bhar sakte hain
      salesDone: getTotalActualAmount(),
      leads: eveningReport.map(lead => ({
        leadId: lead.leadId || lead._id,
        leadName: lead.name,
        leadCompany: lead.company,
        leadPhone: lead.phone,
        leadEmail: lead.email,
        leadLocation: lead.location,
        // Morning report se fields
        expectedAmount: lead.expectedAmount,
        targetCategory: lead.targetCategory,
        vertical: lead.vertical,
        timeDuration: lead.timeDuration,
        actionRequired: lead.actionPlanned,
        remark: lead.remark,
        // Evening report ke fields
        actualAmount: lead.actualAmount,
        timeSpent: lead.timeSpent,
        status: lead.status,
        winReason: lead.winReason,
        lossReason: lead.lossReason,
        progressNotes: lead.progressNotes,
        nextAction: lead.nextAction,
        followUpDate: lead.followUpDate,
        // Calculated fields
        leadAmount: lead.leadAmount,
        dealAmount: lead.dealAmount,
        relationAmount: lead.relationAmount
      }))
    };

      // Call the API
      const response = await addEvening({formData:eveningReportData}).unwrap();

      // Show success message
      toast.success(response.message || "Evening report submitted successfully!");

    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error(error?.data?.message || "Failed to submit evening report");
    }
  };

  const filteredLeads = eveningReport.filter(
    (lead) =>
      lead.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
      lead.company.toLowerCase().includes(leadSearch.toLowerCase()) ||
      lead.phone.includes(leadSearch)
  );

  const filteredTableData = getFilteredTableData();

  // Show time restriction if not in evening reporting time
  if (!isEveningReportingTime()) {
    return (
      <div className="max-w-3xl mx-auto p-6 min-h-screen flex items-center justify-center">
        <div className="text-center bg-white border border-gray-200 rounded-md p-8">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-500" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Evening Reporting Time</h2>
          <p className="text-gray-700 mb-1">Reporting time: 5:00 PM - 8:00 PM</p>
          <p className="text-base text-gray-500">Current: {now.toLocaleTimeString("hi-IN", { hour: "2-digit", minute: "2-digit" })}</p>
        </div>
      </div>
    );
  }

  // If already submitted, show message
  if (isAlreadySubmitted) {
    return (
      <div className="max-w-3xl mx-auto p-6 min-h-screen flex items-center justify-center">
        <div className="text-center bg-white border border-gray-200 rounded-md p-8">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-green-500" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Evening Report Already Submitted</h2>
          <p className="text-gray-700 mb-1">Your evening report has been submitted for today.</p>
          <p className="text-base text-gray-500">Submitted at: {existingEveningReport?.data?.data?.submittedAt ? 
            new Date(existingEveningReport.data.data.submittedAt).toLocaleTimeString("hi-IN", { hour: "2-digit", minute: "2-digit" }) : 
            "N/A"}</p>
        </div>
      </div>
    );
  }

  // If no morning report data
  if (isLoadingMorning) {
    return (
      <div className="max-w-7xl mx-auto">
        <PageHeader title="Evening Reporting" />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-600">Loading morning report data...</span>
        </div>
      </div>
    );
  }

  if (!morningReportData?.data?.data?.leads || morningReportData.data.data.leads.length === 0) {
    return (
      <div className="max-w-7xl mx-auto">
        <PageHeader title="Evening Reporting" />
        <div className="text-center bg-white border border-gray-200 rounded-md p-8 mt-4">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-500" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Morning Report Found</h2>
          <p className="text-gray-700">Please submit a morning report first to access evening reporting.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader title="Evening Reporting" />

      {/* HEADER STATS */}
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
              <div className="text-lg font-semibold text-gray-900">{eveningReport.length}</div>
              <div className="text-[11px] tracking-wide text-gray-500">TOTAL LEADS</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-lg font-semibold text-gray-900">{getConversionRate()}%</div>
              <div className="text-[11px] tracking-wide text-gray-500">CONVERSION</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-lg font-semibold text-gray-900">{getTotalTimeSpent()}h</div>
              <div className="text-[11px] tracking-wide text-gray-500">TIME SPENT</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-lg font-semibold text-gray-900">
                {fmt(getTotalIncentives())}
              </div>
              <div className="text-[11px] tracking-wide text-gray-500">TOTAL INCENTIVE</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* LEFT COLUMN: LEAD LIST */}
        <div className="col-span-5 bg-white border border-gray-200 rounded-md p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-medium text-gray-900">
              Today's Leads ({eveningReport.length})
            </h3>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search leads..."
                value={leadSearch}
                onChange={(e) => setLeadSearch(e.target.value)}
                className="w-40 text-sm border border-gray-300 rounded pl-8 pr-2 py-1 focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
              <Search className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2 max-h-[36rem] overflow-y-auto">
            {filteredLeads.map((lead) => (
              <div
                key={lead.id}
                className={`p-2 rounded-md border ${getStatusColor(lead.status)} transition-colors duration-200 cursor-pointer hover:bg-opacity-80`}
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

                    <div className="mt-2 text-sm text-gray-700 space-y-1">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span>{lead.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <span className="truncate">{lead.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-gray-400" />
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

        {/* RIGHT COLUMN: DETAILED REPORT */}
        <div className="col-span-7 bg-white border border-gray-200 rounded-md p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-medium text-gray-900 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Lead Details
            </h3>
            <div className="text-sm text-gray-500">
              {filteredLeads.filter(l => l.expand).length} expanded
            </div>
          </div>

          <div className="space-y-3 max-h-[36rem] overflow-y-auto">
            {filteredLeads.filter(lead => lead.expand).map((lead) => (
              <div key={lead.id} className="border rounded-md p-3 bg-gray-50">
                {/* Lead Header */}
                <div className="flex justify-between items-center mb-3">
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
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {/* Target Category - READONLY from Morning */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Target Category
                    </label>
                    <input
                      readOnly
                      value={lead.targetCategory.replace("_", " ")}
                      className="w-full border border-gray-300 bg-gray-100 rounded px-2 py-1.5 text-sm capitalize"
                    />
                  </div>

                  {/* Vertical - READONLY from Morning */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Vertical
                    </label>
                    <input
                      readOnly
                      value={lead.vertical}
                      className="w-full border border-gray-300 bg-gray-100 rounded px-2 py-1.5 text-sm capitalize"
                    />
                  </div>

                  {/* Expected Amount - READONLY from Morning */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Expected Amount (Morning)
                    </label>
                    <input
                      readOnly
                      value={fmt(lead.expectedAmount)}
                      className="w-full border border-gray-300 bg-gray-100 rounded px-2 py-1.5 text-sm"
                    />
                  </div>

                  {/* Time Duration - READONLY from Morning */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Time Allocated (Morning)
                    </label>
                    <input
                      readOnly
                      value={`${lead.timeAllocated}h`}
                      className="w-full border border-gray-300 bg-gray-100 rounded px-2 py-1.5 text-sm"
                    />
                  </div>

                  {/* Lead Amount (2%) - READONLY from Morning */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Lead Amount (2%)
                    </label>
                    <input
                      readOnly
                      value={fmt(lead.leadAmount)}
                      className="w-full border border-gray-300 bg-gray-100 rounded px-2 py-1.5 text-sm"
                    />
                  </div>

                  {/* Deal Amount (2%) - READONLY from Morning */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Deal Amount (2%)
                    </label>
                    <input
                      readOnly
                      value={fmt(lead.dealAmount)}
                      className="w-full border border-gray-300 bg-gray-100 rounded px-2 py-1.5 text-sm"
                    />
                  </div>

                  {/* Relationship Amount (2%) - READONLY from Morning */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Relationship Amount (2%)
                    </label>
                    <input
                      readOnly
                      value={fmt(lead.relationAmount)}
                      className="w-full border border-gray-300 bg-gray-100 rounded px-2 py-1.5 text-sm"
                    />
                  </div>

                  {/* Total Incentive - READONLY */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Total Incentive
                    </label>
                    <input
                      readOnly
                      value={fmt(calculateTotalIncentive(lead))}
                      className="w-full border border-gray-300 bg-green-50 rounded px-2 py-1.5 text-sm font-medium"
                    />
                  </div>

                  {/* Remark - READONLY from Morning */}
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Morning Remark
                    </label>
                    <textarea
                      readOnly
                      rows={2}
                      value={lead.remark}
                      className="w-full border border-gray-300 bg-gray-100 rounded px-2 py-1.5 text-sm resize-none"
                    />
                  </div>

                  {/* Status Block */}
                  <div className="col-span-2 border rounded p-3 bg-white">
                    <div className="grid grid-cols-3 gap-3">
                      {/* Status - EDITABLE */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          value={lead.status}
                          onChange={(e) =>
                            updateLeadReport(lead.id, "status", e.target.value)
                          }
                          className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                          disabled={isAlreadySubmitted}
                        >
                          <option value="progress">Hot</option>
                          <option value="progress">Warm</option>
                          <option value="progress">Cold</option>
                          <option value="win">Won</option>
                          <option value="loss">Lost</option>
                        </select>
                      </div>

                      {/* Actual Amount - EDITABLE */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Actual Amount (₹)
                        </label>
                        <input
                          type="number"
                          value={lead.actualAmount}
                          onChange={(e) =>
                            updateLeadReport(lead.id, "actualAmount", e.target.value)
                          }
                          disabled={lead.status === "loss" || isAlreadySubmitted}
                          className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:bg-gray-100"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Expected: {fmt(lead.expectedAmount)}
                        </p>
                      </div>

                      {/* Time Spent - EDITABLE */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Time Spent (h)
                        </label>
                        <input
                          type="number"
                          value={lead.timeSpent}
                          onChange={(e) =>
                            updateLeadReport(lead.id, "timeSpent", e.target.value)
                          }
                          step="0.5"
                          disabled={isAlreadySubmitted}
                          className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:bg-gray-100"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Planned: {lead.timeAllocated}h
                        </p>
                      </div>
                    </div>

                    {/* Conditional Sections */}
                    {lead.status === "win" && (
                      <div className="mt-3 grid grid-cols-2 gap-3 pt-3 border-t">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Win Reason
                          </label>
                          <select
                            value={lead.winReason}
                            onChange={(e) =>
                              updateLeadReport(lead.id, "winReason", e.target.value)
                            }
                            disabled={isAlreadySubmitted}
                            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:bg-gray-100"
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
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Next Action
                          </label>
                          <input
                            type="text"
                            value={lead.nextAction}
                            onChange={(e) =>
                              updateLeadReport(lead.id, "nextAction", e.target.value)
                            }
                            placeholder="Contract, delivery etc."
                            disabled={isAlreadySubmitted}
                            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:bg-gray-100"
                          />
                        </div>
                      </div>
                    )}

                    {lead.status === "loss" && (
                      <div className="mt-3 pt-3 border-t">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Loss Reason
                        </label>
                        <select
                          value={lead.lossReason}
                          onChange={(e) =>
                            updateLeadReport(lead.id, "lossReason", e.target.value)
                          }
                          disabled={isAlreadySubmitted}
                          className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:bg-gray-100"
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
                      <div className="mt-3 grid grid-cols-2 gap-3 pt-3 border-t">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Progress Notes
                          </label>
                          <textarea
                            value={lead.progressNotes}
                            onChange={(e) =>
                              updateLeadReport(lead._id, "progressNotes", e.target.value)
                            }
                            disabled={isAlreadySubmitted}
                            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:bg-gray-100"
                            rows={2}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Follow-up Date
                          </label>
                          <input
                            type="date"
                            value={lead.followUpDate}
                            onChange={(e) =>
                              updateLeadReport(lead.id, "followUpDate", e.target.value)
                            }
                            min={new Date().toISOString().split("T")[0]}
                            disabled={isAlreadySubmitted}
                            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:bg-gray-100"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredLeads.filter(l => l.expand).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Select a lead from the left panel to view and edit evening details
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER SUBMIT */}
      {filteredLeads.length > 0 && (
        <div className="mt-4 bg-white border border-gray-200 rounded-md p-3 flex items-center justify-between">
          <div>
            <div className="text-base font-medium text-gray-900">Evening Report Summary</div>
            <div className="text-sm text-gray-600">
              {eveningReport.filter((l) => l.status === "win").length} won,{" "}
              {eveningReport.filter((l) => l.status === "loss").length} lost,{" "}
              {eveningReport.filter((l) => l.status === "progress").length} in progress
              {" • "}Total Incentive: {fmt(getTotalIncentives())}
            </div>
          </div>
          <div>
            <button
              onClick={submitEveningReport}
              disabled={addEveningLoading || isAlreadySubmitted}
              className="bg-black text-white text-base px-6 py-2 rounded hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {addEveningLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : isAlreadySubmitted ? (
                "Already Submitted"
              ) : (
                "Submit Evening Report"
              )}
            </button>
          </div>
        </div>
      )}

      {/* NEW Comparison Table with Filters */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm mt-6">
        {/* Header with Filters */}
        <div className="p-3 border-b rounded-lg bg-black flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-white">
              Evening Report Summary
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Target Category Filter */}
            <select
              className="p-1.5 border text-sm rounded-lg bg-gray-100 min-w-[120px]"
              value={tableFilters.targetCategory}
              onChange={(e) => setTableFilters({...tableFilters, targetCategory: e.target.value})}
            >
              <option value="all">All Categories</option>
              <option value="sales_in">Sales In</option>
              <option value="lead_in">Lead In</option>
              <option value="business_in">Business In</option>
              <option value="amount_in">Amount In</option>
            </select>

            {/* Vertical Filter */}
            <select
              className="p-1.5 border text-sm rounded-lg bg-gray-100 min-w-[120px]"
              value={tableFilters.vertical}
              onChange={(e) => setTableFilters({...tableFilters, vertical: e.target.value})}
            >
              <option value="all">All Verticals</option>
              <option value="self">Self</option>
              <option value="business_associates">Business Associates</option>
              <option value="franchise">Franchise</option>
              <option value="partner">Partner</option>
            </select>

            {/* Status Filter */}
            <select
              className="p-1.5 border text-sm rounded-lg bg-gray-100 min-w-[120px]"
              value={tableFilters.status}
              onChange={(e) => setTableFilters({...tableFilters, status: e.target.value})}
            >
              <option value="all">All Status</option>
              <option value="win">Won</option>
              <option value="loss">Lost</option>
              <option value="progress">In Progress</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-3 text-center font-semibold">Sr</th>
                <th className="border px-4 py-3 text-center font-semibold">Target Category</th>
                <th className="border px-4 py-3 text-center font-semibold">Vertical</th>
                <th className="border px-4 py-3 text-center font-semibold">Client Name</th>
                <th className="border px-4 py-3 text-center font-semibold">Expected</th>
                <th className="border px-4 py-3 text-center font-semibold">Actual</th>
                <th className="border px-4 py-3 text-center font-semibold bg-amber-50">Lead 2%</th>
                <th className="border px-4 py-3 text-center font-semibold bg-purple-50">Deal 2%</th>
                <th className="border px-4 py-3 text-center font-semibold bg-pink-50">Relation 2%</th>
                <th className="border px-4 py-3 text-center font-semibold bg-green-50">Total Incentive</th>
                <th className="border px-4 py-3 text-center font-semibold">Status</th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {filteredTableData.map((lead, index) => {
                const totalIncentive = calculateTotalIncentive(lead);
                return (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="border px-3 py-2 text-center">{index + 1}</td>
                    <td className="border px-3 py-2 text-center capitalize">
                      {lead.targetCategory.replace("_", " ")}
                    </td>
                    <td className="border px-3 py-2 text-center capitalize">
                      {lead.vertical}
                    </td>
                    <td className="border px-3 py-2 text-center">
                      {lead.name}
                    </td>
                    <td className="border px-3 py-2 text-center font-medium">
                      {fmt(lead.expectedAmount)}
                    </td>
                    <td className="border px-3 py-2 text-center font-medium">
                      {fmt(lead.actualAmount)}
                    </td>
                    <td className="border px-3 py-2 text-center text-amber-700">
                      {lead.status === "win" ? fmt(lead.leadAmount) : "₹0"}
                    </td>
                    <td className="border px-3 py-2 text-center text-purple-700">
                      {lead.status === "win" ? fmt(lead.dealAmount) : "₹0"}
                    </td>
                    <td className="border px-3 py-2 text-center text-pink-700">
                      {lead.status === "win" ? fmt(lead.relationAmount) : "₹0"}
                    </td>
                    <td className="border px-3 py-2 text-center font-semibold bg-green-50 text-green-700">
                      {fmt(totalIncentive)}
                    </td>
                    <td className="border px-3 py-2 text-center capitalize">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        lead.status === "win" ? "bg-green-100 text-green-800" :
                        lead.status === "loss" ? "bg-red-100 text-red-800" :
                        "bg-amber-100 text-amber-800"
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {/* Totals Row */}
              {filteredTableData.length > 0 && (
                <tr className="bg-gray-200 font-semibold">
                  <td colSpan="4" className="border px-3 py-2 text-right">TOTAL</td>
                  <td className="border px-3 py-2 text-center">
                    {fmt(filteredTableData.reduce((t, l) => t + Number(l.expectedAmount), 0))}
                  </td>
                  <td className="border px-3 py-2 text-center">
                    {fmt(filteredTableData.reduce((t, l) => t + Number(l.actualAmount), 0))}
                  </td>
                  <td className="border px-3 py-2 text-center">
                    {fmt(filteredTableData
                      .filter(l => l.status === "win")
                      .reduce((t, l) => t + Number(l.leadAmount), 0))}
                  </td>
                  <td className="border px-3 py-2 text-center">
                    {fmt(filteredTableData
                      .filter(l => l.status === "win")
                      .reduce((t, l) => t + Number(l.dealAmount), 0))}
                  </td>
                  <td className="border px-3 py-2 text-center">
                    {fmt(filteredTableData
                      .filter(l => l.status === "win")
                      .reduce((t, l) => t + Number(l.relationAmount), 0))}
                  </td>
                  <td className="border px-3 py-2 text-center bg-green-100">
                    {fmt(getTotalIncentives())}
                  </td>
                  <td className="border px-3 py-2 text-center">-</td>
                </tr>
              )}

              {filteredTableData.length === 0 && (
                <tr>
                  <td colSpan="11" className="border px-4 py-8 text-center text-gray-500">
                    No data available for the selected filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-3 border-t bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {filteredTableData.length} of {eveningReport.length} records
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default EveningReport;