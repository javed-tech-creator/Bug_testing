import React, { useState } from "react";
import Table from "@/components/Table";
import { 
  Eye, 
  ArrowLeft, 
  Search, 
  ChevronDown, 
  CheckSquare, 
  Square 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";

const WaitingRecce = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("All");
  const [selectedLeadTypes, setSelectedLeadTypes] = useState([]);
  const [selectedRecceStatuses, setSelectedRecceStatuses] = useState([]);
  const [selectedSubStatuses, setSelectedSubStatuses] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);

  // 1. Static Data Matching Screenshot
  const staticData = [
    {
      id: 1,
      sNo: "01",
      projectName: "Abc Project",
      projectCode: "P-4332",
      products: 10,
      recceStatus: "Hold by Client",
      subStatus: "", 
      firstAskingTime: "12/11/25-12:10",
      waitingTime: "1 Day, 6 hrs, 5 Minutes",
      leadType: "Warm",
    },
    {
      id: 2,
      sNo: "02",
      projectName: "Abc Project",
      projectCode: "P-4332",
      products: 10,
      recceStatus: "Postponed by Client",
      subStatus: "",
      firstAskingTime: "12/11/25-12:10",
      waitingTime: "1 Day, 6 hrs, 5 Minutes",
      leadType: "Cold",
    },
    {
      id: 3,
      sNo: "03",
      projectName: "Abc Project",
      projectCode: "P-4332",
      products: 10,
      recceStatus: "Hold by Company",
      subStatus: "",
      firstAskingTime: "12/11/25-12:10",
      waitingTime: "1 Day, 6 hrs, 5 Minutes",
      leadType: "Hot",
    },
    {
      id: 4,
      sNo: "04",
      projectName: "Abc Project",
      projectCode: "P-4332",
      products: 10,
      recceStatus: "Postponed by Company",
      subStatus: "",
      firstAskingTime: "12/11/25-12:10",
      waitingTime: "1 Day, 6 hrs, 5 Minutes",
      leadType: "Warm",
    },
  ];

  const leadTypeOptions = [
    { label: "Warm", color: "bg-orange-50 text-orange-600 border border-orange-100" },
    { label: "Cold", color: "bg-blue-50 text-blue-600 border border-blue-100" },
    { label: "Hot", color: "bg-red-50 text-red-600 border border-red-100" }
  ];
  const recceStatusOptions = Array.from(new Set(staticData.map((item) => item.recceStatus)));
  const subStatusOptions = Array.from(
    new Set(staticData.map((item) => item.subStatus).filter(Boolean))
  );

  const parseFirstAskingTime = (value) => {
    if (!value) return null;
    try {
      const [datePart, timePart] = value.split("-");
      if (!datePart || !timePart) return null;
      const [day, month, yearShort] = datePart.split("/").map((v) => parseInt(v, 10));
      const [hours, minutes] = timePart.split(":").map((v) => parseInt(v, 10));
      if (!day || !month || !yearShort) return null;
      const fullYear = yearShort + 2000;
      const jsDate = new Date(fullYear, month - 1, day, hours || 0, minutes || 0);
      if (isNaN(jsDate.getTime())) return null;
      return jsDate;
    } catch (e) {
      return null;
    }
  };

  const filteredData = staticData.filter((row) => {
    const term = searchTerm.trim().toLowerCase();

    if (term) {
      const haystack = `${row.projectName} ${row.projectCode} ${row.recceStatus} ${row.leadType}`.toLowerCase();
      if (!haystack.includes(term)) return false;
    }

    if (selectedLeadTypes.length > 0 && !selectedLeadTypes.includes(row.leadType)) {
      return false;
    }

    if (selectedRecceStatuses.length > 0 && !selectedRecceStatuses.includes(row.recceStatus)) {
      return false;
    }

    if (selectedSubStatuses.length > 0) {
      const value = row.subStatus || "";
      if (!selectedSubStatuses.includes(value)) {
        return false;
      }
    }

    if (dateFilter && dateFilter !== "All") {
      const date = parseFirstAskingTime(row.firstAskingTime);
      if (!date) return false;

      const now = new Date();
      const oneDayMs = 24 * 60 * 60 * 1000;
      const diffMs = now.getTime() - date.getTime();

      if (dateFilter === "Today") {
        const sameDay =
          date.getDate() === now.getDate() &&
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear();
        if (!sameDay) return false;
      }

      if (dateFilter === "Last 7 Days" && diffMs > 7 * oneDayMs) {
        return false;
      }

      if (dateFilter === "Last 30 Days" && diffMs > 30 * oneDayMs) {
        return false;
      }
    }

    return true;
  });

  // Helper for Status Badge Styling
  const getStatusStyle = (status) => {
    if (status.includes("Client")) return "bg-red-100 text-red-800";
    if (status.includes("Company")) return "bg-blue-100 text-blue-800";
    return "bg-gray-100 text-gray-800";
  };

  // Helper for Lead Type Styling
  const getLeadStyle = (type) => {
    switch (type) {
      case "Warm": return "bg-orange-100 text-orange-600";
      case "Cold": return "bg-blue-50 text-blue-600";
      case "Hot": return "bg-red-100 text-red-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const columnConfig = {
    projectName: {
      label: "Project Name",
    },
    projectCode: {
      label: "Project Code",
    },
    products: {
      label: "Expt. Products",
    },
    recceStatus: {
      label: "Recce Status",
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-md text-xs font-medium ${getStatusStyle(
            value || ""
          )}`}
        >
          {value || "--"}
        </span>
      ),
    },
    subStatus: {
      label: "Sub Status",
      render: (value) => (
        value ? (
          <span className="text-xs font-medium">{value}</span>
        ) : (
          <div className="w-6 h-6 bg-orange-50 rounded-sm mx-auto" />
        )
      ),
    },
    firstAskingTime: {
      label: "1st Asking Time",
    },
    waitingTime: {
      label: "Waiting Time",
    },
    leadType: {
      label: "Lead Type",
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-md text-xs font-medium ${getLeadStyle(
            value || ""
          )}`}
        >
          {value || "--"}
        </span>
      ),
    },
    actions: {
      label: "Actions",
      render: (_, row) => (
        <button className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-md transition-colors inline-flex items-center justify-center">
          <Eye size={18} />
        </button>
      ),
    },
  };

  return (
    <div className="min-h-screen">
      {/* --- Page Header --- */}
      <div className="flex items-center">
        
        <PageHeader title="Recce in Waiting"/>
      </div>

      {/* --- Filter Bar --- */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap gap-4 items-center justify-between border border-gray-200">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
            </div>
          <input
            type="text"
            placeholder="Search here.."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap gap-3">
          {/* Date Filter */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setOpenDropdown(openDropdown === "date" ? null : "date")
              }
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 min-w-[150px] justify-between"
            >
              <span>{dateFilter === "All" ? "Date" : dateFilter}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {openDropdown === "date" && (
              <div className="absolute z-20 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg text-sm">
                {["All", "Today", "Last 7 Days", "Last 30 Days"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setDateFilter(option);
                      setOpenDropdown(null);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${
                      dateFilter === option ? "bg-gray-100 font-medium" : ""
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Lead Type Filter (Multi-select) */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setOpenDropdown(openDropdown === "leadType" ? null : "leadType")
              }
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 min-w-[150px] justify-between"
            >
              <span>
                {selectedLeadTypes.length === 0
                  ? "Lead Type"
                  : `${selectedLeadTypes.length} selected`}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {openDropdown === "leadType" && (
              <div className="absolute z-20 mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg text-sm max-h-64 overflow-auto">
                {leadTypeOptions.map((option) => {
                  const isActive = selectedLeadTypes.includes(option.label);
                  return (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => {
                        setSelectedLeadTypes((prev) =>
                          isActive
                            ? prev.filter((v) => v !== option.label)
                            : [...prev, option.label]
                        );
                      }}
                      className="w-full flex items-center gap-2 text-left px-3 py-2 hover:bg-gray-100"
                    >
                      {isActive ? <CheckSquare size={14} /> : <Square size={14} />}
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${option.color}`}>
                        {option.label}
                      </span>
                    </button>
                  );
                })}
                {leadTypeOptions.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedLeadTypes([])}
                    className="w-full text-left px-3 py-2 text-xs text-gray-500 border-t border-gray-100 hover:bg-gray-50"
                  >
                    Clear Lead Type Filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Recce Status Filter (Multi-select) */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setOpenDropdown(openDropdown === "recceStatus" ? null : "recceStatus")
              }
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 min-w-[170px] justify-between"
            >
              <span>
                {selectedRecceStatuses.length === 0
                  ? "Recce Status"
                  : `${selectedRecceStatuses.length} selected`}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {openDropdown === "recceStatus" && (
              <div className="absolute z-20 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg text-sm max-h-64 overflow-auto">
                {recceStatusOptions.map((option) => {
                  const isActive = selectedRecceStatuses.includes(option);
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setSelectedRecceStatuses((prev) =>
                          isActive
                            ? prev.filter((v) => v !== option)
                            : [...prev, option]
                        );
                      }}
                      className={`w-full flex items-center gap-2 text-left px-3 py-2 hover:bg-gray-100 ${
                        isActive ? "bg-gray-100 font-medium" : ""
                      }`}
                    >
                      {isActive ? <CheckSquare size={14} /> : <Square size={14} />}
                      <span>{option}</span>
                    </button>
                  );
                })}
                {recceStatusOptions.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedRecceStatuses([])}
                    className="w-full text-left px-3 py-2 text-xs text-gray-500 border-t border-gray-100 hover:bg-gray-50"
                  >
                    Clear Recce Status
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Recce Sub Status Filter (Multi-select) */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setOpenDropdown(openDropdown === "recceSubStatus" ? null : "recceSubStatus")
              }
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 min-w-[190px] justify-between"
            >
              <span>
                {selectedSubStatuses.length === 0
                  ? "Recce Sub Status"
                  : `${selectedSubStatuses.length} selected`}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {openDropdown === "recceSubStatus" && (
              <div className="absolute z-20 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg text-sm max-h-64 overflow-auto">
                {subStatusOptions.length === 0 && (
                  <div className="px-3 py-2 text-xs text-gray-500">
                    No sub status options available
                  </div>
                )}
                {subStatusOptions.map((option) => {
                  const isActive = selectedSubStatuses.includes(option);
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setSelectedSubStatuses((prev) =>
                          isActive
                            ? prev.filter((v) => v !== option)
                            : [...prev, option]
                        );
                      }}
                      className={`w-full flex items-center gap-2 text-left px-3 py-2 hover:bg-gray-100 ${
                        isActive ? "bg-gray-100 font-medium" : ""
                      }`}
                    >
                      {isActive ? <CheckSquare size={14} /> : <Square size={14} />}
                      <span>{option}</span>
                    </button>
                  );
                })}
                {subStatusOptions.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedSubStatuses([])}
                    className="w-full text-left px-3 py-2 text-xs text-gray-500 border-t border-gray-100 hover:bg-gray-50"
                  >
                    Clear Sub Status
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- Table Section (Dynamic) --- */}
      <div className="mt-4">
        <Table data={filteredData} columnConfig={columnConfig} />
      </div>

      {/* --- Footer / Legends Section --- */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left: Lead Type Dropdowns */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Lead Type Dropdowns (Multi check)</h3>
          <div className="space-y-2">
            {[
               { label: "Feedback: Low", color: "bg-[#5D1910] text-white" },
               { label: "Engagement: Low", color: "bg-[#252525] text-white" },
               { label: "Engagement: High", color: "bg-[#4A148C] text-white" }
            ].map((item, idx) => (
               <div key={idx} className={`flex items-center gap-2 px-3 py-2 rounded text-sm font-medium w-fit ${item.color}`}>
                  <CheckSquare size={16} /> {item.label}
               </div>
            ))}
          </div>
          
          {/* Light colored badges column next to dark ones in screenshot */}
          <div className="mt-[-115px] ml-[200px] space-y-2"> 
             {[
                { label: "Warm Lead", color: "bg-orange-50 text-orange-600 border border-orange-100" },
                { label: "Cold Lead", color: "bg-blue-50 text-blue-600 border border-blue-100" },
                { label: "Hot Lead", color: "bg-red-50 text-red-600 border border-red-100" },
                { label: "Revenue: High", color: "bg-orange-400 text-white" },
                { label: "Satisfaction: Low", color: "bg-gray-700 text-white" },
                { label: "Satisfaction: High", color: "bg-blue-800 text-white" },
                { label: "Repeat Potential: Low", color: "bg-gray-800 text-white" },
                { label: "Revenue: Low", color: "bg-[#4E342E] text-white" },
                { label: "Repeat Potential: High", color: "bg-[#1B5E20] text-white" },
                { label: "Feedback: High", color: "bg-[#1A237E] text-white" },

             ].map((item, idx) => (
                <div key={idx} className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium w-fit ${item.color}`}>
                    {item.label.includes("Lead") ? <CheckSquare size={16}/> : <CheckSquare size={16}/> } {item.label}
                </div>
             ))}
          </div>
        </div>

        {/* Right: Recce Status Dropdowns */}
        {/* <div>
           <h3 className="font-semibold text-gray-900 mb-4">Recce Status Dropdowns</h3>
           <div className="space-y-3">
             {[
                { label: "Postponed by Company", color: "bg-red-50 text-red-600 border border-red-100" },
                { label: "Postponed by Client", color: "bg-red-50 text-red-600 border border-red-100" },
                { label: "Hold by Company", color: "bg-red-50 text-red-600 border border-red-100" },
                { label: "Hold by Client", color: "bg-red-50 text-red-600 border border-red-100" },
             ].map((item, idx) => (
                <div key={idx} className={`px-4 py-2 rounded text-sm font-medium w-fit ${item.color}`}>
                   {item.label}
                </div>
             ))}
           </div>
        </div> */}
      </div>
    </div>
  );
};

export default WaitingRecce;