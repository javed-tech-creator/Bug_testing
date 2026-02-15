import { Eye } from "lucide-react";

export const viewAction = (row, onView) => (
  <button
    onClick={() => onView(row)}
     title="View Details"
    className="border cursor-pointer border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 p-1.5 rounded-lg"
  >
    <Eye size={18} />
  </button>
);