import { useState } from "react"

import {
    ArrowLeft,
    Printer,
    Share2,
    AlertCircle,
    CheckCircle,
    Flag,
    Hammer,
    PenTool,
    MapPin
} from "lucide-react";
import ConfirmEscalationModal from "./modals/ConfirmEscalationModal";


const FlagResolution = () => {
    const [openEscalateModal, setOpenEscalateModal] = useState(true);
    const [escalationReason, setEscalationReason] = useState("")

    return (
        <div className="p-6 space-y-6">

            {/* ================= HEADER ================= */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                    <button className="p-2 border rounded hover:bg-slate-100">
                        <ArrowLeft size={18} />
                    </button>
                    <h1 className="text-lg font-semibold text-slate-800">
                        Flag Resolution
                    </h1>
                </div>

                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-3 py-2 border rounded text-sm">
                        <Printer size={16} /> Print Report
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 border rounded text-sm">
                        <Share2 size={16} /> Share
                    </button>
                </div>
            </div>

            {/* ================= TOP GRID ================= */}
            <div className="grid grid-cols-3 gap-6">

                {/* ===== FLAG DETAILS ===== */}
                <div className="col-span-2 bg-white rounded-lg border p-5">
                    <div className="flex items-center gap-2 mb-4 text-blue-600 font-medium">
                        <AlertCircle size={18} />
                        Flag Details
                    </div>

                    <div className="grid grid-cols-2 gap-6 text-sm">
                        <div>
                            <p className="text-slate-400 text-xs">PROJECT</p>
                            <p className="font-medium">PRJ-2401 (Apex Towers)</p>
                        </div>

                        <div>
                            <p className="text-slate-400 text-xs">CLIENT</p>
                            <p className="font-medium">Apex Developers Group</p>
                        </div>

                        <div>
                            <p className="text-slate-400 text-xs">PRODUCT NAME</p>
                            <p className="font-medium">External Wayfinding Signage</p>
                        </div>

                        <div>
                            <p className="text-slate-400 text-xs">FLAG TYPE</p>
                            <span className="inline-block px-3 py-1 text-xs rounded-full bg-red-50 text-red-600">
                                Red
                            </span>
                        </div>

                        <div className="col-span-2">
                            <p className="text-slate-400 text-xs">FLAG REASON</p>
                            <p className="text-slate-700">
                                Budget confirmation for additional LED modules pending from
                                client side. Sales team input required to proceed with
                                production PO.
                            </p>
                        </div>

                        <div>
                            <p className="text-slate-400 text-xs">RAISED BY</p>
                            <p className="font-medium">David Miller (Production Executive)</p>
                        </div>

                        <div>
                            <p className="text-slate-400 text-xs">RAISED ON</p>
                            <p className="font-medium">Oct 24, 2024 · 10:30 AM</p>
                        </div>
                    </div>
                </div>

                {/* ===== RESPONSIBILITY CHAIN ===== */}
                <div className="bg-white rounded-lg border p-5">
                    <h3 className="font-semibold mb-4">Responsibility Chain</h3>

                    <div className="space-y-4">

                        {/* Production */}
                        <div className="relative grid grid-cols-[48px_1fr] gap-x-4">

                            {/* ===== LEFT ICON + LINE ===== */}
                            <div className="flex justify-center">
                                {/* Icon */}
                                <div className="absolute z-10 flex h-12 w-12 items-center justify-center rounded-full bg-[#0B67FF]">
                                    <CheckCircle size={20} className="text-white" />
                                </div>

                                {/* Vertical line */}
                                <span className="relative top-12 bottom-0 w-[2px] bg-blue-500"></span>
                            </div>

                            {/* ===== RIGHT CARD ===== */}
                            <div className="border border-blue-500 bg-[#FBFBFC] rounded-lg p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-medium text-slate-800">
                                        Production
                                    </h4>
                                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                                        Current
                                    </span>
                                </div>

                                <p className="text-sm text-slate-600">
                                    <span className="text-slate-400">Manager</span> &nbsp; David Miller
                                </p>
                                <p className="text-sm text-slate-600">
                                    <span className="text-slate-400">Exec</span> &nbsp; Steve K.
                                </p>
                            </div>
                        </div>


                        {/* Design */}
                        <div className="relative grid grid-cols-[48px_1fr] gap-x-4">

                            {/* ===== LEFT ICON + LINE ===== */}
                            <div className="flex justify-center">
                                {/* Icon */}
                                <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-[#0B67FF]">
                                    <CheckCircle size={20} className="text-white" />
                                </div>

                                {/* Vertical line */}
                                <span className="absolute top-12 bottom-0 w-[2px] bg-slate-500"></span>
                            </div>

                            {/* ===== RIGHT CARD ===== */}
                            <div className="border bg-[#FBFBFC] rounded-lg p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-medium">Design</h4>
                                    <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded border border-[#FFEDD5]">
                                        Escalation Target
                                    </span>
                                </div>
                                <p className="text-sm text-slate-600">
                                    Manager: Jessica Pearson
                                </p>
                                <p className="text-sm text-slate-600">
                                    Exec: Mike Ross
                                </p>
                            </div>

                        </div>



                        {/* Recce */}
                        <div className="relative grid grid-cols-[48px_1fr] gap-x-4">

                            {/* ===== LEFT ICON + LINE ===== */}
                            <div className=" flex justify-center">
                                {/* Icon */}
                                <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-[#0B67FF]">
                                    <CheckCircle size={20} className="text-white" />
                                </div>

                                {/* Vertical line */}
                                {/* <span className="absolute top-12 bottom-0 w-[2px] bg-blue-500"></span> */}
                            </div>
                            <div className="border bg-[#FBFBFC] rounded-lg p-4 bg-slate-50">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-medium">Recce</h4>
                                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded border border-[#FFEDD5">
                                        Passed
                                    </span>
                                </div>
                                <p className="text-sm text-slate-600">
                                    Manager: Louis Litt
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* ================= RESOLUTION ACTION ================= */}
            <div className="bg-white rounded-lg border p-5">
                <div className="flex items-center gap-2 mb-4 text-green-600 font-medium">
                    <CheckCircle size={18} />
                    Resolution Action
                </div>

                <div className="space-y-4 text-sm">

                    <div>
                        <label className="block mb-1 font-medium">
                            Resolution Type
                        </label>
                        <input
                            readOnly
                            value="Needs Escalation"
                            className="w-full border rounded px-3 py-2 bg-slate-50"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">
                            Resolution / Action Summary *
                        </label>
                        <textarea
                            rows={4}
                            className="w-full border rounded px-3 py-2"
                            defaultValue="Budget approval is still not received. This is blocking the material procurement..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 font-medium">
                                Action Date
                            </label>
                            <input
                                type="date"
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">
                                Supporting Documents
                            </label>
                            <div className="border border-dashed rounded px-3 py-2 text-center text-slate-500">
                                Click to upload
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between pt-4">
                        <button className="px-5 py-2 border border-red-500 text-red-600 rounded"
                            onClick={() => { setOpenEscalateModal(true) }}
                        >
                            Escalate to Previous Dept
                        </button>

                        <button className="px-5 py-2 bg-blue-600 text-white rounded">
                            Resolve Flag
                        </button>
                    </div>
                </div>
            </div>

            {openEscalateModal &&
                <ConfirmEscalationModal
                    open={openEscalateModal}
                    from="Production"
                    to="Design Dept"
                    reason={escalationReason}
                    onChangeReason={setEscalationReason}
                    onCancel={() => setOpenEscalateModal(false)}
                    onConfirm={() => {
                        // submit escalation
                        setOpenEscalateModal(false);
                    }}  
                />

            }

        </div>
    );
};

export default FlagResolution;
