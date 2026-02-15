import React from "react";
import {
    TrendingUp,
    MapPin,
    PenTool,
    FileText,
    Package,
    Megaphone,
    Factory,
    Wrench,
    Truck,
    AlertCircle,
    Hammer,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ManagerDepartmentOverView() {
    const navigate = useNavigate();

    const summaryCards = [
        {
            title: "Total Projects (All Departments)",
            value: 132,
            sub: "Across Recce, Design, Production, Inst",
            color: "text-blue-600",
        },
        {
            title: "Total Flags Raised",
            value: 18,
            sub: "5 Critical, 7 At Risk, 6 Normal",
            color: "text-red-600",
        },
        {
            title: "Waiting Projects",
            value: 41,
            sub: "Vendor, client or inter-department...",
            color: "text-orange-500",
        },
        {
            title: "Completed This Week",
            value: 27,
            sub: "Closed projects & major milestones",
            color: "text-green-600",
        },
    ];

    const departments = [
        {
            name: "Sales",
            icon: TrendingUp,
            completed: 12,
            process: 8,
            pending: 3,
            url: "/project/manager/department/sales"
        },
        {
            name: "Recce",
            icon: MapPin,
            waiting: 10,
            completed: 24,
            process: 5,
            pending: 2,
            url: "/project/manager/department/recce"
        },
        {
            name: "Design",
            icon: PenTool,
            waiting: 10,
            completed: 31,
            process: 12,
            pending: 9,
            url: "/project/manager/department/design"
        },
        {
            name: "Quotation",
            icon: FileText,
            waiting: 10,
            completed: 19,
            process: 5,
            pending: 2,
            url: "/project/manager/department/quotation"
        },
        {
            name: "PR",
            icon: Package,
            waiting: 10,
            completed: 16,
            process: 9,
            pending: 11,
            url: "/project/manager/department/pr"
        },
        {
            name: "Production",
            icon: Factory,
            waiting: 10,
            completed: 22,
            process: 10,
            pending: 7,
            url: "/project/manager/department/production"
        },
        {
            name: "Installation",
            icon: Wrench,
            waiting: 10,
            completed: 14,
            process: 4,
            pending: 2,
            url: "/project/manager/department/installation"
        },
        {
            name: "Dispatch",
            icon: Truck,
            waiting: 10,
            completed: 11,
            process: 3,
            pending: 1,
            url: "/project/manager/department/dispatch"
        },
        {
            name: "Complaint",
            icon: AlertCircle,
            waiting: 10,
            completed: 11,
            process: 3,
            pending: 1,
            url: "/project/manager/department/complaint"
        },
        {
            name: "Repair",
            icon: Hammer,
            waiting: 10,
            completed: 11,
            process: 3,
            pending: 1,
            url: "/project/manager/department/repair"
        },
    ];

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            {/* Header */}
            {/* <div className="mb-6">
        <h1 className="text-lg font-semibold text-slate-900">
          Department Overview
        </h1>
        <p className="text-sm text-slate-500">
          Monitor all signage departments, projects & next-day planning
        </p>
      </div> */}

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

            {/* Department Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {departments.map((dept, i) => {
                    const Icon = dept.icon;

                    return (
                        <div
                            key={i}
                            className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm"
                            onClick={() => { navigate(`${dept.url}`) }}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    {/* <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">        
                                        <Icon size={18} className="text-slate-700" />
                                    </div> */}

                                    <div className="w-10 h-10 rounded-lg  bg-[#EF44441A]  flex items-center justify-center">
                                        <Icon size={18} className="text-red-500" />
                                    </div>

                                    <h3 className="font-medium text-slate-800">
                                        {dept.name}
                                    </h3>
                                </div>

                                {dept.waiting && (
                                    <span className="text-[11px] px-2 py-1 rounded bg-[#fff5e6] text-yellow-500">
                                        Waiting: {dept.waiting}
                                    </span>
                                )}
                            </div>

                            <div className="border-t pt-4 grid grid-cols-3 text-center">
                                <div>
                                    <p className="text-[10px] tracking-wide text-slate-400">
                                        COMPLETED
                                    </p>
                                    <p className="text-green-600 font-semibold">
                                        {dept.completed}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] tracking-wide text-slate-400">
                                        PROCESS
                                    </p>
                                    <p className="text-blue-600 font-semibold">
                                        {dept.process}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] tracking-wide text-slate-400">
                                        PENDING
                                    </p>
                                    <p className="text-orange-500 font-semibold">
                                        {dept.pending}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
