import React, { useState } from "react";
import Table from "@/components/Table";
import {
    ArrowLeft,
    ChevronDown,
    Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PlanningLogModal from "./modals/PlanningLog";
import ReviewPlanningModal from "./modals/ReviewPlanningModal";

const RecceDepartment = () => {
    const navigate = useNavigate();
    const [openPlanningModal, setPlanningModal] = useState(false);
    const [openReviewPlanning, setReviewPlanningModal] = useState(false)

    const data = [
        {
            id: 1,
            project: "Flex Sign Board",
            plannedBy: "Abhay Sindh",
            planningDate: "Nov 15, 2024 - 10:00 AM",
            executive: "Aman",
            recceDeadline: "Nov 15, 2024 - 10:00 AM",
            completion: "Nov 15, 2024",
            urgency: "High",
            priority: 1,
            status: "On Track",
        },
        {
            id: 2,
            project: "LED Channel Letter Signage",
            plannedBy: "Abhay Sindh",
            planningDate: "Nov 15, 2024 - 10:00 AM",
            executive: "Aman",
            recceDeadline: "Nov 15, 2024 - 10:00 AM",
            completion: "Nov 15, 2024",
            urgency: "High",
            priority: 2,
            status: "Hold By Company",
        },
        {
            id: 3,
            project: "Acrylic Sign Board",
            plannedBy: "Abhay Sindh",
            planningDate: "Nov 15, 2024 - 10:00 AM",
            executive: "Aman",
            recceDeadline: "Nov 15, 2024 - 10:00 AM",
            completion: "Nov 15, 2024",
            urgency: "Low",
            priority: 4,
            status: "Hold By Company",
        },
        {
            id: 4,
            project: "Vinyl Cut Signage",
            plannedBy: "Abhay Sindh",
            planningDate: "Nov 15, 2024 - 10:00 AM",
            executive: "Aman",
            recceDeadline: "Nov 15, 2024 - 10:00 AM",
            completion: "Nov 15, 2024",
            urgency: "Low",
            priority: 6,
            status: "Hold By Company",
        },
        {
            id: 5,
            project: "Glow Sign Board",
            plannedBy: "Abhay Sindh",
            planningDate: "Nov 15, 2024 - 10:00 AM",
            executive: "Aman",
            recceDeadline: "Nov 15, 2024 - 10:00 AM",
            completion: "Nov 15, 2024",
            urgency: "High",
            priority: 8,
            status: "Postponed By Client",
        },
        {
            id: 6,
            project: "LED Channel Letter Signage",
            plannedBy: "Abhay Sindh",
            planningDate: "Nov 15, 2024 - 10:00 AM",
            executive: "Aman",
            recceDeadline: "Nov 15, 2024 - 10:00 AM",
            completion: "Nov 15, 2024",
            urgency: "Low",
            priority: 9,
            status: "On Track",
        },
    ];

    const columnConfig = {
        project: { label: "Project Name" },

        plannedBy: {
            label: "Planned By",
            render: (val) => (
                <div>
                    <div className="font-medium">{val}</div>
                    <div className="text-xs text-blue-600 cursor-pointer">
                        Project Co-Ordinator
                    </div>
                </div>
            ),
        },

        planningDate: { label: "Planning Date" },
        executive: { label: "Recce Executive" },
        recceDeadline: { label: "Recce Deadline" },
        completion: { label: "Completion Date" },

        urgency: {
            label: "Urgency",
            render: (val) => {
                const styles = {
                    High: "bg-red-600 text-white",
                    Low: "bg-blue-600 text-white",
                };
                return (
                    <span className={`px-3 py-1 rounded text-xs font-medium ${styles[val]}`}>
                        {val}
                    </span>
                );
            },
        },

        priority: { label: "Priority" },

        status: {
            label: "Status",
            render: (val) => {
                const styles = {
                    "On Track": "bg-blue-50 text-blue-600",
                    "Hold By Company": "bg-orange-50 text-orange-500",
                    "Postponed By Client": "bg-red-50 text-red-600",
                };
                return (
                    <span className={`px-3 py-1 rounded text-xs font-medium ${styles[val]}`}>
                        {val}
                    </span>
                );
            },
        },

        actions: {
            label: "Action",
            render: () => (
                <div className="flex gap-2">
                    <button className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700" onClick={() => { setPlanningModal(true) }}>
                        <Eye size={14} />
                    </button>
                    <button className="bg-orange-500 text-white px-3 py-1 rounded text-xs hover:bg-orange-600"
                        onClick={() => setReviewPlanningModal(true)}
                    >
                        Review
                    </button>
                </div>
            ),
        },
    };

    return (
        <div className="p-6">
            {/* HEADER */}
            <div className="flex flex-wrap items-center justify-between mb-5 bg-white px-4 py-3 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 border rounded hover:bg-slate-100"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <h1 className="text-lg font-semibold text-slate-800">
                        Recce Department
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    {/* <input
                        type="text"
                        placeholder="Search here"
                        className="px-4 py-2 bg-slate-100 rounded text-sm w-60 focus:outline-none"
                    /> */}

                    {["Urgency", "Status", "Co - Ordinator's"].map((f) => (
                        <button
                            key={f}
                            className="flex items-center gap-2 px-3 py-2 border rounded text-sm text-slate-600 hover:bg-slate-50"
                        >
                            {f}
                            <ChevronDown size={14} />
                        </button>
                    ))}
                </div>
            </div>

            {/* TABLE */}
            <Table data={data} columnConfig={columnConfig} />

            {openPlanningModal &&
                <PlanningLogModal
                    open={openPlanningModal}
                    onClose={() => { setPlanningModal(false) }}
                    title="Planning Log"
                />
            }

            {openReviewPlanning &&
                <ReviewPlanningModal

                    open={openReviewPlanning}
                    onClose={() => { setReviewPlanningModal(false) }}
                    onSubmit={() => { console.log('inside the submit review planning') }}

                />
            }

        </div>
    );
};

export default RecceDepartment;
