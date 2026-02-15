import React from "react";
import { Eye, Bell } from "lucide-react";

const tableData = [
  {
    id: 1,
    client: "GreenFields Co.",
    project: "Retail Store Signage",
    location: "Sector 18, Noida",
    date: "05 Feb 26, 09:00AM",
    priorityT: "High",
    priorityN: "High (1)",
    status: "Completed",
    deadline: "05 Feb 26, 05:00PM",
    actions: "view",
  },
  {
    id: 2,
    client: "AgriMart",
    project: "Mall Facade Design",
    location: "Connaught Place, Delhi",
    date: "06 Feb 26, 10:30AM",
    priorityT: "High",
    priorityN: "High (2)",
    status: "In Progress",
    deadline: "06 Feb 26, 06:00PM",
    actions: "bell",
  },
  {
    id: 3,
    client: "SunHarvest",
    project: "Office Branding Survey",
    location: "Gomti Nagar, Lucknow",
    date: "06 Feb 26, 11:00AM",
    priorityT: "Medium",
    priorityN: "Medium (3)",
    status: "Pending",
    deadline: "07 Feb 26, 04:00PM",
    actions: "start",
  },
  {
    id: 4,
    client: "FreshStore",
    project: "Retail Store Signage",
    location: "Hazratganj, Lucknow",
    date: "07 Feb 26, 09:30AM",
    priorityT: "Medium",
    priorityN: "Medium (4)",
    status: "Completed",
    deadline: "07 Feb 26, 05:30PM",
    actions: "view",
  },
  {
    id: 5,
    client: "SunHarvest",
    project: "Mall Entrance Survey",
    location: "Aliganj, Lucknow",
    date: "07 Feb 26, 02:00PM",
    priorityT: "Low",
    priorityN: "Low (5)",
    status: "Revisit Required",
    deadline: "08 Feb 26, 05:00PM",
    actions: "revisit",
  },
  {
    id: 6,
    client: "AgroHub",
    project: "Office Branding Survey",
    location: "Indira Nagar, Lucknow",
    date: "07 Feb 26, 03:30PM",
    priorityT: "Low",
    priorityN: "Low (6)",
    status: "Pending",
    deadline: "08 Feb 26, 06:00PM",
    actions: "start",
  },
];

const PriorityBadge = ({ label }) => {
  let styles = "px-2 py-1 rounded text-[11px] font-medium block w-fit ";
  if (label.includes("High"))
    styles += "bg-red-50 text-red-600 border border-red-100";
  else if (label.includes("Medium"))
    styles += "bg-amber-50 text-amber-600 border border-amber-100";
  else styles += "bg-green-50 text-green-600 border border-green-100";
  return <span className={styles}>{label}</span>;
};

const StatusBadge = ({ status }) => {
  let styles = "px-2 py-1 rounded text-[11px] font-medium ";
  if (status.includes("Completed")) styles += "bg-green-100 text-green-700";
  else if (status.includes("In Progress")) styles += "bg-blue-50 text-blue-600";
  else if (status.includes("Pending")) styles += "bg-gray-100 text-gray-600";
  else if (status.includes("Revisit"))
    styles += "bg-orange-50 text-orange-600";
  else styles += "bg-red-100 text-red-600";
  return <span className={styles}>{status}</span>;
};

export default function ActiveRecceTable({ navigate }) {
//   const handleRowClick = (row) => {
//     if (row.status === "Completed") {
//       navigate("/recce/recce-details");
//     } else if (row.status === "Revisit Required") {
//       navigate(`/recce/recce-form/${row.id}`);
//     } else if (row.status === "In Progress") {
//       navigate(`/recce/recce-form/${row.id}`);
//     } else if (row.status === "Pending") {
//       navigate(`/recce/recce-form/${row.id}`);
//     }
//   };

  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden border border-slate-200">
      <div className="bg-[#7c3aed] text-white px-5 py-3 font-semibold text-sm">
        My Active Quotations
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse border border-black">
          <thead className="bg-[#1a1a1a] text-white text-[11px] uppercase tracking-wider">
            <tr className="border-b border-black text-center">
              <th className="px-3 py-2 font-medium whitespace-nowrap w-[60px] border-r border-black">
                S. No
              </th>
              <th className="px-3 py-2 font-medium whitespace-nowrap border-r border-black">
                Client Name
              </th>
              <th className="px-3 py-2 font-medium whitespace-nowrap border-r border-black">
                Project Name
              </th>
              <th className="px-3 py-2 font-medium whitespace-nowrap border-r border-black">
                Location
              </th>
              <th className="px-3 py-2 font-medium whitespace-nowrap border-r border-black">
                Date
              </th>
              <th className="px-3 py-2 font-medium whitespace-nowrap border-r border-black">
                Priority (T)
              </th>
              <th className="px-3 py-2 font-medium whitespace-nowrap border-r border-black">
                Priority (N)
              </th>
              <th className="px-3 py-2 font-medium whitespace-nowrap border-r border-black">
                Status
              </th>
              <th className="px-3 py-2 font-medium whitespace-nowrap border-r border-black">
                Deadline
              </th>
              <th className="px-3 py-2 font-medium whitespace-nowrap border-r border-black">
                View
              </th>
              <th className="px-3 py-2 font-medium whitespace-nowrap w-[160px] text-center border-r border-black">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-[12px] text-slate-700">
            {tableData.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-slate-50 transition-colors text-center"
              >
                <td className="px-3 py-2 font-medium whitespace-nowrap border-r border-b border-black">
                  0{row.id}
                </td>
                <td className="px-3 py-2 whitespace-normal break-words border-r border-b border-black">
                  {row.client}
                </td>
                <td className="px-3 py-2 whitespace-normal break-words border-r border-b border-black">
                  {row.project}
                </td>
                <td className="px-3 py-2 whitespace-normal break-words border-r border-b border-black">
                  {row.location}
                </td>
                <td className="px-3 py-2 text-slate-500 whitespace-nowrap border-r border-b border-black">
                  {row.date}
                </td>
                <td className="px-3 py-2 whitespace-nowrap border-r border-b border-black">
                  <PriorityBadge label={row.priorityT} />
                </td>
                <td className="px-3 py-2 whitespace-nowrap border-r border-b border-black">
                  <PriorityBadge label={row.priorityN} />
                </td>
                <td className="px-3 py-2 whitespace-normal break-words border-r border-b border-black">
                  <StatusBadge status={row.status} />
                </td>
                <td className="px-3 py-2 text-slate-500 whitespace-nowrap border-r border-b border-black">
                  {row.deadline}
                </td>
                <td className="px-3 py-2 whitespace-nowrap border-r border-b border-black">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRowClick(row);
                    }}
                    className="bg-purple-600 text-white p-1.5 rounded hover:bg-purple-700 transition cursor-pointer"
                  >
                    <Eye size={14} />
                  </button>
                </td>
                <td className="px-3 py-2 w-[160px] border-r border-b border-black">
                  <div className="flex justify-center items-center gap-2">
                    {row.actions === "bell" ? (
                      <button className="w-9 h-9 flex items-center justify-center bg-[#f59e0b] text-white rounded hover:bg-amber-600 transition cursor-pointer">
                        <Bell size={14} />
                      </button>
                    ) : row.actions === "revisit" ? (
                      <button className="w-full bg-orange-50 text-orange-600 border border-orange-200 px-3 py-1 rounded text-[11px] font-medium hover:bg-orange-100 transition cursor-pointer">
                        Revisit Now
                      </button>
                    ) : row.actions === "start" ? (
                      <button className="w-full bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1 rounded text-[11px] font-medium hover:bg-blue-100 transition cursor-pointer">
                        Start Recce
                      </button>
                    ) : (
                      <button className="w-full bg-green-50 text-green-600 border border-green-200 px-3 py-1 rounded text-[11px] font-medium hover:bg-green-100 transition cursor-pointer">
                        View Details
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}