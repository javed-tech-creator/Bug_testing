import React, { useState } from "react";
import Table from "@/components/Table";
import {
    ArrowLeft,
    ChevronDown,
    RotateCcw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AssignCoOrdinatorModal from "./modals/AssignCoOrdinatorModal";
import { useGetAssignedClientsQuery } from "@/api/project/clientProjectMap.api";

const ManagerAssignedProjects = () => {
    const navigate = useNavigate();
    const [openAssignModal, setAssignModal] = useState(false)
    const [selectedMapping, setSelectedMapping] = useState(null);
    const { data: assignedData, isLoading: loadingAssigned } = useGetAssignedClientsQuery();

    const fetched = assignedData?.data?.mappings || assignedData?.mappings || [];
    const data = fetched.map((m, idx) => ({
        id: idx + 1,
        _raw: m,
        coordinator: m.coordinator?.userId?.name || "-",
        project: m.projectId?.projectName || m.projectId?.projectId || "-",
        client: m.clientId?.name || "-",
        location: m.clientId?.city || m.branch || "-",
        sales: m.clientId?.leadId?.leadBy || "-",
        completion: m.deadline ? new Date(m.deadline).toLocaleString() : "-",
        urgency: m.urgency || "-",
        status: m.clientId?.status || "-",
    }));

    const columnConfig = {
        coordinator: { label: "Project Co- Ordinator" },
        project: { label: "Project Name" },
        client: { label: "Client Name" },
        location: { label: "Site Location" },
        sales: { label: "Sales Person" },
        completion: { label: "Completion Date" },

        urgency: {
            label: "Urgency",
            render: (val) => {
                const styles = {
                    High: "bg-red-600 text-white",
                    Low: "bg-blue-600 text-white",
                };
                return (
                    <span
                        className={`px-3 py-1 rounded text-xs font-medium ${styles[val]}`}
                    >
                        {val}
                    </span>
                );
            },
        },

        status: {
            label: "Status",
            render: (val) => {
                const styles = {
                    Fresh: "bg-blue-50 text-blue-600",
                    Repeated: "bg-orange-50 text-orange-500",
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
            render: (_val, row) => (
                <button className="bg-orange-500 text-white p-2 rounded hover:bg-orange-600 transition"
                    onClick={() => { setSelectedMapping(row._raw); setAssignModal(true); }}
                >
                    <RotateCcw size={14} />
                </button>
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
                        Assigned Projects
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

            {openAssignModal && (
                <AssignCoOrdinatorModal
                    open={openAssignModal}
                    onClose={() => { setAssignModal(false); setSelectedMapping(null); }}
                    onSubmit={() => { console.log('re-assign submitted') }}
                    title="Re-assign to Project Co-Ordinator"
                    client={ selectedMapping?.clientId ? selectedMapping.clientId : selectedMapping }
                />
            )}


        </div>
    );
};

export default ManagerAssignedProjects;
