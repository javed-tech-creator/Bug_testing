import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Search,
  FileText,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import DesignSimpleHeader from "@/modules/design/components/designs/DesignSimpleHeader";

// Dummy Data for Recce Executives
const DUMMY_EXECUTIVES = [
  {
    _id: "1",
    sno: 1,
    name: "Rahul Sharma",
    empId: "RE-1023",
    phone: "9834345445",
    branch: "Chinhat",
    attendance: "Present",
    currentRecce: 8,
    performance: 92,
  },
  {
    _id: "2",
    sno: 2,
    name: "Priya Verma",
    empId: "RE-1018",
    phone: "9834345445",
    branch: "Chinhat",
    attendance: "Absent",
    currentRecce: 12,
    performance: 90,
  },
  {
    _id: "3",
    sno: 3,
    name: "Amit Patel",
    empId: "RE-1015",
    phone: "9834345445",
    branch: "Chinhat",
    attendance: "On Half Day",
    currentRecce: 5,
    performance: 82,
  },
  {
    _id: "4",
    sno: 4,
    name: "Rajesh Kumar",
    empId: "RE-1012",
    phone: "9876543210",
    branch: "Gomti Nagar",
    attendance: "Present",
    currentRecce: 10,
    performance: 88,
  },
  {
    _id: "5",
    sno: 5,
    name: "Neha Singh",
    empId: "RE-1009",
    phone: "9123456789",
    branch: "Hazratganj",
    attendance: "Present",
    currentRecce: 7,
    performance: 85,
  },
];

const TeamManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleViewProfile = (executive) => {
    // Navigate to profile page
    navigate(`/recce/team/profile/${executive._id}`, { state: { executive } });
  };

  // Helper for attendance colors
  const getAttendanceStyle = (status) => {
    switch (status) {
      case "Present":
        return "text-green-600 before:bg-green-600";
      case "Absent":
        return "text-red-600 before:bg-red-600";
      case "On Half Day":
        return "text-blue-600 before:bg-blue-600";
      default:
        return "text-gray-600 before:bg-gray-600";
    }
  };

  return (
    <div className="">
      {/* Top Header */}
      <div className="">
       
         <DesignSimpleHeader title="Team Management"  />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Blue Card */}
        <div className="bg-blue-50 p-6 rounded-2xl border-l-[6px] border-blue-500 shadow-sm flex flex-col justify-center">
          <p className="text-gray-600 font-semibold mb-1">Total Executives</p>
          <h3 className="text-4xl font-bold text-blue-600">28</h3>
        </div>
        {/* Green Card */}
        <div className="bg-green-50 p-6 rounded-2xl border-l-[6px] border-green-500 shadow-sm flex flex-col justify-center">
          <p className="text-gray-600 font-semibold mb-1">Active Today</p>
          <h3 className="text-4xl font-bold text-green-600">18</h3>
        </div>
        {/* Yellow Card */}
        <div className="bg-yellow-50 p-6 rounded-2xl border-l-[6px] border-yellow-400 shadow-sm flex flex-col justify-center">
          <p className="text-gray-600 font-semibold mb-1">On Half Day</p>
          <h3 className="text-4xl font-bold text-yellow-500">6</h3>
        </div>
        {/* Red Card */}
        <div className="bg-red-50 p-6 rounded-2xl border-l-[6px] border-red-500 shadow-sm flex flex-col justify-center">
          <p className="text-gray-600 font-semibold mb-1">Absent</p>
          <h3 className="text-4xl font-bold text-red-500">4</h3>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Filters */}
        

        {/* The Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-900 text-white text-sm">
              <tr>
                <th className="py-4 px-6 text-left font-medium border border-gray-700">
                  S.No
                </th>
                <th className="py-4 px-6 text-left font-medium border border-gray-700">
                  Action
                </th>
                <th className="py-4 px-6 text-left font-medium border border-gray-700">
                  Executive
                </th>
                <th className="py-4 px-6 text-left font-medium border border-gray-700">
                  Employee ID
                </th>
                <th className="py-4 px-6 text-left font-medium border border-gray-700">
                  Phone
                </th>
                <th className="py-4 px-6 text-left font-medium border border-gray-700">
                  Branch
                </th>
                <th className="py-4 px-6 text-left font-medium border border-gray-700">
                  Attendance
                </th>
                <th className="py-4 px-6 text-center font-medium border border-gray-700">
                  Active Recce
                </th>
                <th className="py-4 px-6 text-left font-medium border border-gray-700">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {DUMMY_EXECUTIVES.map((row, index) => (
                <tr key={row._id} className="hover:bg-gray-50">
                  <td className="py-4 px-6 text-gray-600 border border-gray-200">
                    {row.sno}
                  </td>
                  <td className="py-4 px-6 border border-gray-200">
                    <button
                      onClick={() => handleViewProfile(row)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 transition"
                      title="View Profile"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                  <td className="py-4 px-6 font-medium text-gray-800 border border-gray-200">
                    {row.name}
                  </td>
                  <td className="py-4 px-6 text-gray-600 border border-gray-200">
                    {row.empId}
                  </td>
                  <td className="py-4 px-6 text-gray-600 border border-gray-200">
                    {row.phone}
                  </td>
                  <td className="py-4 px-6 text-gray-600 border border-gray-200">
                    {row.branch}
                  </td>
                  <td className="py-4 px-6 border border-gray-200">
                    <div
                      className={`flex items-center gap-2 font-medium ${getAttendanceStyle(row.attendance)}`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${row.attendance === "Present" ? "bg-green-500" : row.attendance === "Absent" ? "bg-red-500" : "bg-blue-500"}`}
                      ></span>
                      {row.attendance}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center border border-gray-200">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                      {row.currentRecce}
                    </span>
                  </td>
                  <td className="py-4 px-6 border border-gray-200">
                    <div className="flex items-center gap-3 w-32">
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${row.performance >= 90 ? "bg-green-500" : row.performance >= 80 ? "bg-blue-500" : "bg-yellow-500"}`}
                          style={{ width: `${row.performance}%` }}
                        ></div>
                      </div>
                      <span
                        className={`font-bold text-xs ${row.performance >= 90 ? "text-green-600" : row.performance >= 80 ? "text-blue-600" : "text-yellow-600"}`}
                      >
                        {row.performance}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center gap-2">
          <button className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded text-sm hover:bg-gray-200 transition">
            <ChevronLeft size={16} className="inline" /> Prev
          </button>
          <button className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded text-sm font-medium">
            1
          </button>
          <button className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600 rounded text-sm font-medium hover:bg-gray-200">
            2
          </button>
          <button className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600 rounded text-sm font-medium hover:bg-gray-200">
            3
          </button>
          <button className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded text-sm hover:bg-gray-200 transition">
            Next <ChevronRight size={16} className="inline" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamManagement;
