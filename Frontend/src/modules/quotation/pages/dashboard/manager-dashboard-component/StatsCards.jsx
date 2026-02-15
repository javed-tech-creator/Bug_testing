import React from "react";
import {
  User,
  CheckCircle,
  Camera,
  Clock,
  Flag,
  Ban,
  FileSearch,
  MapPin,
} from "lucide-react";

const topCards = [
  {
    label: "Assigned Quotations",
    value: 22,
    icon: User,
    color: "text-purple-600",
    border: "border-purple-600",
    bg: "bg-purple-50",
  },
  {
    label: "Completed Quotations",
    value: 15,
    icon: CheckCircle,
    color: "text-green-600",
    border: "border-green-600",
    bg: "bg-green-50",
  },
  {
    label: "Quotations in Progress",
    value: 7,
    icon: Camera,
    color: "text-blue-400",
    border: "border-blue-400",
    bg: "bg-blue-50",
  },
  {
    label: "Pending Quotations",
    value: 5,
    icon: Clock,
    color: "text-orange-400",
    border: "border-orange-400",
    bg: "bg-orange-50",
  },
  {
    label: "Revisit Required",
    value: 3,
    icon: Flag,
    color: "text-red-600",
    border: "border-red-600",
    bg: "bg-red-50",
  },
  {
    label: "Rejected Quotations",
    value: 2,
    icon: Ban,
    color: "text-red-500",
    border: "border-red-500",
    bg: "bg-red-50",
  },
  {
    label: "Approved Quotations",
    value: 18,
    icon: FileSearch,
    color: "text-blue-500",
    border: "border-blue-500",
    bg: "bg-blue-50",
  },
  {
    label: "Total Sites Visited",
    value: 32,
    icon: MapPin,
    color: "text-indigo-600",
    border: "border-indigo-600",
    bg: "bg-indigo-50",
  },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4 mb-6">
      {topCards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`bg-white border-t-4 ${card.border} p-3 rounded-md shadow-sm flex flex-col justify-between h-[130px]`}
          >
            <div className={`p-2 rounded-full w-fit mb-2 ${card.bg}`}>
              <Icon size={18} className={card.color} strokeWidth={2.5} />
            </div>
            <div>
              <div className={`text-2xl font-bold ${card.color}`}>
                {card.value}
              </div>
              <div className="text-[11px] font-medium text-slate-500 leading-tight mt-1">
                {card.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}