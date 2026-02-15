import React, { useState } from "react";
import Table from "@/components/Table";
import { Lightbulb, ChevronDown, FolderPen, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AssignCoOrdinatorModal from "./modals/AssignCoOrdinatorModal";
import { useGetClientByParamsQuery, useGetClientQuery } from "@/api/sales/client.api";

const ManagerSalesIntake = () => {
    const navigate = useNavigate();

    const [openAssignModal, setAssignModal] = useState(false)
    const [selectedClient, setSelectedClient] = useState(null);
    const params = `isSentToProjectDepartment=true`
    const { data:clientData, isLoading, error }=useGetClientByParamsQuery({params});
    
console.log("clientData", clientData)

    // Replace static dummy rows with mapped client data from API.
    // Only include fields that existed in the original static rows.
    const data =
        clientData?.data?.clients?.map((c, idx) => {
            // Use available client fields where appropriate, fall back to sensible defaults.
            const lead = Array.isArray(c.leadData) && c.leadData.length ? c.leadData[0] : {};
            return {
                id: idx + 1,
                _id:c._id || null,
                clientName: c.name || c.clientId || "",
                project: lead.requirement || "",
                products: 0, // no direct mapping available in API response
                assignedDate: c.createdAt || "",
                priorityT: c.revenue || "", // map revenue to priorityT where available
                priorityN: c.revenue ? `${c.revenue} (1)` : "",
                status: c.status || "",
                deadline: c.updatedAt || "",
            };
        }) || [];

    const columnConfig = {
        // S.No. is handled by Table.jsx, so start with actions for correct order

        project: { label: "Project Name" },
        clientName: { label: "Client Name" },
        assignedDate: { label: "Completion Date" },

        priorityT: {
            label: "Urgency",
            render: (val) => {
                const styles = {
                    High: "bg-red-50 text-red-500 border-red-100",
                    Medium: "bg-orange-50 text-orange-400 border-orange-100",
                    Low: "bg-green-50 text-green-500 border-green-100",
                };
                return (
                    <span
                        className={`px-4 py-1 rounded border text-xs font-medium ${styles[val]}`}
                    >
                        {val}
                    </span>
                );
            },
        },
        status: {
            label: "Status",
            render: (val) => (
                <span className="px-4 py-1 rounded border border-orange-100 bg-orange-50 text-orange-400 text-xs font-medium">
                    {val}
                </span>
            ),
        },
            actions: {
            label: "Actions",
            render: (_val, row) => (
                <button
                    title="Make Quotation"
                    onClick={() => { setSelectedClient(row); setAssignModal(true); }}
                    className=" bg-blue-50 text-blue-600 px-4 py-1.5 rounded border border-blue-100 hover:bg-blue-100 transition-colors text-xs font-semibold relative group cursor-pointer"
                >
                    <FolderPen size={22} />
                </button>
            ),
        },


    };

    return (
        <div className="">
            {/* Header with Search and Navigation */}
            <div className="flex flex-wrap items-center justify-between mb-6 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-2 border rounded-md bg-white cursor-pointer hover:bg-gray-100 shadow-sm transition-all">
                        <ArrowLeft className="w-5 h-5 text-gray-800" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-800">
                        Sales Intake & Project Pool
                    </h1>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* PSL Button */}
                    <button
                        title="PSL"
                        className="flex items-center justify-center px-3 py-2 border bg-blue-600 rounded-md text-white hover:bg-blue-700 transition-all cursor-pointer"
                        onClick={() => navigate("/quotation/psl")}
                    >
                        <Lightbulb className="w-4 h-4" />
                    </button>
                    {/* <input
            type="text"
            placeholder="Search here"
            className="bg-[#EDEDED] px-4 py-2 rounded-md text-sm w-72 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
          /> */}
                    {["Urgency", "Status"].map((f) => (
                        <button
                            key={f}
                            className="flex items-center gap-2 px-4 py-2 border bg-white rounded-md text-sm text-gray-600 hover:shadow-sm cursor-pointer transition-all"
                        >
                            {f} <ChevronDown className="w-4 h-4" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Table Container */}
            <Table data={data} columnConfig={columnConfig} />

            {openAssignModal && (
                <AssignCoOrdinatorModal
                    open={openAssignModal}
                    onClose={() => {
                        setAssignModal(false);
                        setSelectedClient(null);
                    }}
                    onSubmit={() => {
                        console.log("submit");
                    }}
                    title="Assign to Project Co-Ordinator"
                    client={selectedClient}
                />
            )}


        </div>
    );
};

export default ManagerSalesIntake;
