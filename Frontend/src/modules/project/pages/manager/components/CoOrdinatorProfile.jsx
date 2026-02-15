import React from "react";
import { MapPin, PenTool, Factory, Wrench, Settings2 } from 'lucide-react';
import Table from "@/components/Table";

const CoOrdinatorProfile = () => {

    const data = [
        {
            id: 1,
            projectName: "Project Alpha Redesign",
            planningApproved: true,
            client: "Acme Corp",
            dept: "Design",
            status: "On Track",
            sla: "2 Days Left",
            flagCount: 0,
        },
        {
            id: 2,
            projectName: "Website Migration",
            planningApproved: false,
            client: "Globex",
            dept: "IT / Dev",
            status: "Critical",
            sla: "Overdue",
            flagCount: 2,
        },
        {
            id: 3,
            projectName: "Q3 Marketing Assets",
            planningApproved: false,
            client: "Soylent",
            dept: "Production",
            status: "Drafting",
            sla: "5 Days Left",
            flagCount: 0,
        },
        {
            id: 4,
            projectName: "Lobby Signage",
            planningApproved: false,
            client: "Initech",
            dept: "Installation",
            status: "Waiting",
            sla: "1 Day Left",
            flagCount: 1,
        },
    ];


    const columnConfig = {
        projectName: {
            label: "Project Name",
            render: (val, row) => (
                <div>
                    <p className="font-medium text-slate-800">{val}</p>

                    <p className="text-xs text-slate-500">
                        Planning Approved: {row.planningApproved ? "Yes" : "No"}
                    </p>

                    {row.flagCount > 0 && (
                        <p className="text-xs font-medium text-red-600 mt-0.5">
                            Flagged ({row.flagCount})
                        </p>
                    )}
                </div>
            ),
        },


        client: {
            label: "Client",
        },

        dept: {
            label: "Dept",
        },

        status: {
            label: "Status",
            render: (val) => {
                const map = {
                    "On Track": "bg-green-100 text-green-700",
                    Critical: "bg-red-100 text-red-700",
                    Drafting: "bg-slate-100 text-slate-700",
                    Waiting: "bg-blue-100 text-blue-700",
                };

                return (
                    <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${map[val] || "bg-slate-100 text-slate-700"
                            }`}
                    >
                        {val}
                    </span>
                );
            },
        },

        sla: {
            label: "SLA",
            render: (val) => (
                <span
                    className={`text-sm font-medium ${val === "Overdue" ? "text-red-600" : "text-slate-700"
                        }`}
                >
                    {val}
                </span>
            ),
        },

        actions: {
            label: "Action",
            render: (_val, row) => (
                <button
                    className="px-3 py-1.5 rounded-md border border-slate-200
                   text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                    View
                </button>
            ),
        },
    };



    return (
        <div className="bg-slate-50 min-h-screen space-y-6">

            {/* ================= PROFILE HEADER ================= */}
            <div className="bg-white rounded-xl border p-5 flex flex-wrap justify-between gap-4">
                <div className="flex items-center gap-4">
                    <img
                        src="https://i.pravatar.cc/100"
                        alt="profile"
                        className="w-14 h-14 rounded-full object-cover"
                    />

                    <div>
                        <h2 className="text-lg font-semibold text-slate-800">
                            Sarah Jenkins
                        </h2>
                        <p className="text-sm text-slate-500">
                            Project Co-Ordinator · ID: EMP-2024-042
                        </p>
                        <p className="text-xs text-slate-400">
                            Reporting to: Alex Morgan
                        </p>

                        <span className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-medium">
                            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                            High Load
                        </span>

                    </div>
                </div>

                <div className="flex gap-8 text-center">
                    {[
                        { label: "Active Project", value: 12, color: "text-blue-600" },
                        { label: "Completed", value: 5, color: "text-green-600" },
                        { label: "Waiting", value: 8, color: "text-orange-500" },
                        { label: "Flags", value: 3, color: "text-red-600" },
                    ].map((i) => (
                        <div key={i.label}>
                            <p className="text-xs text-slate-500">{i.label}</p>
                            <p className={`text-xl font-bold ${i.color}`}>{i.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ================= SUMMARY CARDS ================= */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">

                {[
                    { title: "Active Projects", value: 12, color: "text-blue-600" },
                    { title: "Completed Projects", value: 4, color: "text-green-600" },
                    { title: "Flag Raised", value: 2, color: "text-red-600" },
                    { title: "Waiting Projects", value: 3, color: "text-orange-500" },
                    { title: "Avg Closure", value: "18d", color: "text-slate-800" },
                ].map((c) => (
                    <div
                        key={c.title}
                        className="bg-white border rounded-lg p-4 shadow-sm"
                    >
                        <p className="text-xs text-slate-500">{c.title}</p>
                        <p className={`text-2xl font-bold mt-1 ${c.color}`}>
                            {c.value}
                        </p>
                    </div>
                ))}

                {/* ===== Current Capacity Load (NEW CARD) ===== */}
                <div className="bg-white border rounded-lg p-4 shadow-sm xl:col-span-2 flex flex-col justify-between">

                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <p className="text-xs text-slate-500">Current Capacity Load</p>
                        <p className="text-sm font-semibold text-orange-600">78%</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                        <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-orange-500 rounded-full"
                                style={{ width: "78%" }}
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-2 flex justify-between text-xs text-slate-500">
                        <span>Based on count, complexity</span>
                        <span className="text-orange-600 font-medium">
                            Warning Level
                        </span>
                    </div>
                </div>

            </div>


            {/* ================= DEPARTMENT LOAD ================= */}
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
                {[
                    { name: "Recce", a: 4, p: 2, w: 1, f: 0, color: "orange", icon: MapPin },
                    { name: "Design", a: 3, p: 1, w: 0, f: 0, color: "green", icon: PenTool },
                    { name: "Production", a: 5, p: 3, w: 2, f: 2, color: "red", icon: Factory },
                    { name: "Installation", a: 2, p: 0, w: 0, f: 0, color: "green", icon: Wrench },
                    { name: "AMC", a: 10, p: 4, w: 2, f: 1, color: "orange", icon: Settings2 },
                ].map((d) => {

                    const Icon = d.icon;

                    return (
                        <div
                            key={d.name}
                            className={`bg-white  border-t-4  border rounded-xl p-4 border-${d.color}-400`}
                        >
                            <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-slate-700 mb-3">
                                    {d.name}
                                </h4>
                                <Icon className={`text-${d.color}-500`} size={18} strokeWidth={2} />
                            </div>

                            <div className="grid grid-cols-2 text-sm gap-y-2">
                                <div>
                                    <p className="text-slate-800 text-lg font-semibold">{d.a}</p>
                                    <p className="text-slate-500 text-xs">Active</p>
                                </div>

                                <div>
                                    <p className="text-slate-800 text-lg font-semibold">{d.a}</p>
                                    <p className="text-slate-500 text-xs">Pending</p>
                                </div>

                                <div>
                                    <p className="text-slate-800 text-lg font-semibold">{d.a}</p>
                                    <p className="text-slate-500 text-xs">Waiting</p>
                                </div>

                                <div>
                                    <p className="text-slate-800 text-lg font-semibold">{d.a}</p>
                                    <p className="text-slate-500 text-xs">Flags</p>
                                </div>

                            </div>
                        </div>
                    )
                })}
            </div>

            {/* ================= MAIN GRID ================= */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* ===== LEFT SIDE (2 columns wide) ===== */}
                <div className="xl:col-span-2 space-y-6">

                    {/* -------- Assigned Projects -------- */}
                    <div className="xl:col-span-2 bg-white rounded-xl border p-5">
                        <h3 className="font-semibold mb-4">Assigned Projects</h3>
                        {/* TABLE */}
                        <Table data={data} columnConfig={columnConfig} />

                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="font-semibold text-slate-800">
                                    Critical Flags Analysis
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Flags by Dept (L30D)
                                </p>
                            </div>

                            <button className="text-sm text-blue-600 hover:underline">
                                View All Flags
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* LEFT: BAR CHART */}
                            <div className="flex items-end justify-between h-28 px-2">
                                {[
                                    { label: "Rec", value: 1 },
                                    { label: "Des", value: 2 },
                                    { label: "Pro", value: 6, critical: true },
                                    { label: "Ins", value: 1 },
                                    { label: "AMC", value: 0 },
                                ].map((d) => (
                                    <div key={d.label} className="flex flex-col items-center gap-2">
                                        <div className="w-8 h-20 bg-slate-100 rounded flex items-end">
                                            <div
                                                className={`w-full rounded ${d.critical ? "bg-red-500" : "bg-slate-300"
                                                    }`}
                                                style={{ height: `${d.value * 15}px` }}
                                            />
                                        </div>
                                        <span className="text-xs text-slate-500">{d.label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* RIGHT: FLAG LIST */}
                            <div className="space-y-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-slate-800">
                                            Material Shortage
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            Website Migration • Age: 4 Days
                                        </p>
                                    </div>

                                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                                        Escalated
                                    </span>
                                </div>

                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-slate-800">
                                            Permit Denied
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            Lobby Signage • Age: 1 Day
                                        </p>
                                    </div>

                                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                                        Investigating
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* -------- Right Panel -------- */}
                <div className="space-y-6">
                    {/* -------- Right Panel -------- */}
                    <div className="space-y-6">

                        {/* ================= Performance Metrics ================= */}
                        <div className="bg-white rounded-xl border border-slate-200 p-5">
                            <h3 className="font-semibold text-slate-800 mb-4">
                                Performance Metrics
                            </h3>

                            {/* On-Time Delivery */}
                            <div className="mb-4">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-600">On-Time Delivery</span>
                                    <span className="font-medium text-slate-800">92%</span>
                                </div>
                                <div className="h-2.5 bg-slate-200 rounded">
                                    <div className="h-full bg-green-500 rounded" style={{ width: "92%" }} />
                                </div>
                            </div>

                            {/* Avg Turnaround Time */}
                            <div className="mb-4">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-600">Avg Turnaround Time</span>
                                    <span className="font-medium text-slate-800">2.4 Days</span>
                                </div>
                                <div className="h-2.5 bg-slate-200 rounded">
                                    <div className="h-full bg-blue-500 rounded" style={{ width: "80%" }} />
                                </div>
                            </div>

                            {/* SOP Compliance */}
                            <div className="mb-4">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-600">SOP Compliance</span>
                                    <span className="font-medium text-slate-800">88%</span>
                                </div>
                                <div className="h-2.5 bg-slate-200 rounded">
                                    <div className="h-full bg-orange-400 rounded" style={{ width: "88%" }} />
                                </div>
                            </div>

                            {/* Escalation Ratio */}
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-600">Escalation Ratio</span>
                                    <span className="font-medium text-red-600">15%</span>
                                </div>
                                <div className="h-2.5 bg-slate-200 rounded">
                                    <div className="h-full bg-red-500 rounded" style={{ width: "15%" }} />
                                </div>
                            </div>
                        </div>

                        {/* ================= Audit Log ================= */}
                        <div className="bg-white rounded-xl border border-slate-200 p-5">
                            <h3 className="font-semibold text-slate-800 mb-4">
                                Audit Log
                            </h3>

                            <div className="space-y-4 text-sm">

                                {/* ITEM */}
                                <div className="relative flex gap-3">

                                    {/* LINE (bottom only – first item) */}
                                    <span className="absolute left-[6px] top-4 bottom-0 w-px h-10 bg-slate-200"></span>

                                    {/* DOT */}
                                    <span className="relative z-10 w-2 h-2 mt-1.5 ml-0.5 rounded-full bg-orange-500"></span>

                                    {/* CONTENT */}
                                    <div className="grid grid-cols-[80px_1fr] gap-x-2">
                                        <p className="text-xs text-slate-400">Today, 10:30</p>
                                        <div>
                                            <p className="font-semibold text-slate-800">Flag Raised</p>
                                            <p className="text-xs text-slate-500">
                                                Project: Website Migration
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* ITEM */}
                                <div className="relative flex gap-3">

                                    {/* LINE (top + bottom) */}
                                    <span className="absolute left-[6px] top-0 bottom-0 h-15 w-px bg-slate-200"></span>

                                    {/* DOT */}
                                    <span className="relative z-10 w-2 h-2 mt-1.5 ml-0.5 rounded-full bg-green-500"></span>

                                    {/* CONTENT */}
                                    <div className="grid grid-cols-[80px_1fr] gap-x-2">
                                        <p className="text-xs text-slate-400">Yesterday</p>
                                        <div>
                                            <p className="font-semibold text-slate-800">Planning Approved</p>
                                            <p className="text-xs text-slate-500">
                                                Project: Summer Promo
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* ITEM */}
                                <div className="relative flex gap-3">

                                    {/* LINE (top + bottom) */}
                                    <span className="absolute left-[6px] top-0 bottom-0 h-15 w-px bg-slate-200"></span>

                                    {/* DOT */}
                                    <span className="relative z-10 w-2 h-2 mt-1.5 ml-0.5 rounded-full bg-blue-500"></span>

                                    {/* CONTENT */}
                                    <div className="grid grid-cols-[80px_1fr] gap-x-2">
                                        <p className="text-xs text-slate-400">Oct 23</p>
                                        <div>
                                            <p className="font-semibold text-slate-800">
                                                Dept Shift: Design → Prod
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                Project: Q3 Marketing
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* ITEM */}
                                <div className="relative flex gap-3">

                                    {/* LINE (top only – last item) */}
                                    <span className="absolute left-[6px] top-0 bottom-4 h-0 w-px bg-slate-200"></span>

                                    {/* DOT */}
                                    <span className="relative z-10 w-2 h-2 mt-1.5 ml-0.5 rounded-full bg-red-500"></span>

                                    {/* CONTENT */}
                                    <div className="grid grid-cols-[80px_1fr] gap-x-2">
                                        <p className="text-xs text-slate-400">Oct 22</p>
                                        <div>
                                            <p className="font-semibold text-slate-800">Planning Rejected</p>
                                            <p className="text-xs text-slate-500">
                                                Project: Store Display 2025
                                            </p>
                                        </div>
                                    </div>
                                </div>

                            </div>



                            <button
                                className="mt-4 w-full text-sm font-medium text-slate-600
                 border border-slate-200 rounded-md py-2
                 hover:bg-slate-50"
                            >
                                View Full Audit Log
                            </button>
                        </div>

                    </div>


                </div>

            </div>




        </div>
    );
};

export default CoOrdinatorProfile;
