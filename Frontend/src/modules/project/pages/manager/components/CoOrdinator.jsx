import Table from "@/components/Table";
import { current } from "@reduxjs/toolkit";
import { ArrowLeft, ChevronDown, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CoOrdinator = () => {

    const navigate = useNavigate();

    const summaryCards = [
        {
            title: "Total Co-Ordinators",
            value: 132,
            color: "text-blue-600",
        },
        {
            title: "Active Today",
            value: 18,
            color: "text-green-600",
        },
        {
            title: "On Half Day",
            value: 41,
            color: "text-orange-500",
        },
        {
            title: "Absent",
            value: 27,
            color: "text-red-600",
        }
    ];

    const data = [
        {
            id: 1,
            coordinator: "Robert Smith",
            empId: "Ex-1023",
            phone: "+91-98XXXXXXXX",
            branch: "Chinhat",
            attendance: "Present",
            current_projects: "12",
            performance: "90"
        },
        {
            id: 2,
            coordinator: "Robert Smith",
            empId: "Ex-1023",
            phone: "+91-98XXXXXXXX",
            branch: "Chinhat",
            attendance: "Absent",
            current_projects: "12",
            performance: "98"
        },
        {
            id: 3,
            coordinator: "Robert Smith",
            empId: "Ex-1023",
            phone: "+91-98XXXXXXXX",
            branch: "Chinhat",
            attendance: "On Half Day",
            current_projects: "12",
            performance: "92"
        },
        {
            id: 4,
            coordinator: "Robert Smith",
            empId: "Ex-1023",
            phone: "+91-98XXXXXXXX",
            branch: "Chinhat",
            attendance: "Present",
            current_projects: "12",
            performance: "80"
        },
        {
            id: 5,
            coordinator: "Robert Smith",
            empId: "Ex-1023",
            phone: "+91-98XXXXXXXX",
            branch: "Chinhat",
            attendance: "Present",
            current_projects: "12",
            performance: "70"
        },
        {
            id: 6,
            coordinator: "Robert Smith",
            empId: "Ex-1023",
            phone: "+91-98XXXXXXXX",
            branch: "Chinhat",
            attendance: "Present",
            current_projects: "12",
            performance: "94"
        },
    ];

    const columnConfig = {
        coordinator: { label: "Co-Ordinator" },

        empId: {
            label: "Employee ID"
        },

        branch: { label: "Branch" },

        attendance: {
            label: "Attendance",
            render: (val) => {
                const map = {
                    Present: {
                        // text: "text-green-600",
                        bg: "bg-green-600",
                    },
                    Absent: {
                        // text: "text-red-600",
                        bg: "bg-red-600",
                    },
                    "On Half Day": {
                        // text: "text-blue-600",
                        bg: "bg-blue-600",
                    },
                };

                const style = map[val] || map.Present;

                return (
                    <span className="inline-flex items-center gap-2 text-sm font-medium">
                        <span
                            className={`w-2.5 h-2.5 rounded-full ${style.bg}`}
                        />
                        <span>{val}</span>
                    </span>
                );
            },
        },

        current_projects: { label: "Current Projects" },

        performance: {
            label: "Performance",
            render: (val) => (
                <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-600"
                            style={{ width: `${val}%` }}
                        />
                    </div>
                    <span className="text-sm font-medium text-green-700">
                        {val}%
                    </span>
                </div>
            ),
        },

        actions: {
            label: "Action",
            render: (_val, row) => (
                <button
                    onClick={() => navigate(`/project/co-ordinator/${row.id}`)}
                    className="text-blue-600 font-medium text-sm hover:underline"
                >
                    View Profile
                </button>
            ),
        },

    };


    return (
        <div className="bg-slate-50 min-h-screen">

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
                        Project Co-Ordinators
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        className="flex items-center gap-2 px-3 py-2 border rounded text-sm text-slate-600 hover:bg-slate-50"
                    >
                        Export Excel
                    </button>

                    <button
                        className="flex items-center gap-2 px-3 py-2 border rounded text-sm text-slate-600 hover:bg-slate-50"
                    >
                        Export Pdf
                    </button>
                </div>
            </div>


            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                {summaryCards.map((card, i) => (
                    <div
                        key={i}
                        className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm"
                    >
                        <p className="text-[12px] text-slate-500 mb-2">{card.title}</p>
                        <p className={`text-3xl font-bold ${card.color}`}>
                            {card.value}
                        </p>
                        <p className="text-[12px] text-slate-400 mt-2">{card.sub}</p>
                    </div>
                ))}
            </div>


            {/* TABLE */}
            <Table data={data} columnConfig={columnConfig} />

        </div>
    );

}


export default CoOrdinator;