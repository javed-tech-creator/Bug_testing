import React, { useState, useEffect, useRef } from "react";
import {
  Eye,
  ArrowLeft,
  Search,
  ChevronDown,
  CheckSquare,
  Square,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import Table from "@/components/Table";

import SelfTeamToggle from "../components/SelfTeamToggle";
import { useSelector } from "react-redux";
import DesignSimpleHeader from "@/modules/design/components/designs/DesignSimpleHeader";
import { useGetRecceAllWaitingLostListQuery } from "@/api/recce/common/recce-waiting-lost.api";

const WaitingRecce = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);


  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("All");
  const [selectedLeadTypes, setSelectedLeadTypes] = useState([]);
  const [selectedRecceStatuses, setSelectedRecceStatuses] = useState([]);
  const [selectedSubStatuses, setSelectedSubStatuses] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);

  // Role-based toggle logic
  const res = useSelector((state) => state.auth?.userData);
  const user = res?.user || {};
  const role = user?.designation?.title?.toLowerCase();
  const normalizedRole = {
    executive: "executive",
    "recce executive": "executive",
    manager: "manager",
    "recce manager": "manager",
    hod: "manager",
    "recce hod": "manager",
  }[role] || "executive";
  const isManager = normalizedRole === "manager";
  const [viewType, setViewType] = useState("self"); // self | team

  // ========================= [api section start] ============================

  const {
    data,
    isLoading,
    isFetching,
    error
  } = useGetRecceAllWaitingLostListQuery({
    page: currentPage,
    limit: itemsPerPage,
    status: "waiting",
    type: viewType
  },
    {
      refetchOnMountOrArgChange: true
    }
  )


  useEffect(() => {
    console.log('data:>', data)
  }, [data])


  // ========================= [api section end] ===============================


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 1. Static Data Matching Screenshot
  const staticData = [
    {
      id: 1,
      sNo: "01",
      projectName: "Abc Project",
      projectCode: "P-4332",
      products: 10,
      recceStatus: "Hold by Client",
      subStatus: "Client Review Pending",
      firstAskingTime: "12/11/25-12:10",
      waitingTime: "1 Day, 6 hrs, 5 Minutes",
      leadType: "Warm Lead",
      action: "",
    },
    {
      id: 2,
      sNo: "02",
      projectName: "Abc Project",
      projectCode: "P-4332",
      products: 10,
      recceStatus: "Postponed by Client",
      subStatus: "Client Approval Needed",
      firstAskingTime: "12/11/25-12:10",
      waitingTime: "1 Day, 6 hrs, 5 Minutes",
      leadType: "Cold Lead",
      action: "",
    },
    {
      id: 3,
      sNo: "03",
      projectName: "Abc Project",
      projectCode: "P-4332",
      products: 10,
      recceStatus: "Hold by Company",
      subStatus: "Company Review Pending",
      firstAskingTime: "12/11/25-12:10",
      waitingTime: "1 Day, 6 hrs, 5 Minutes",
      leadType: "Hot Lead",
      action: "",
    },
    {
      id: 4,
      sNo: "04",
      projectName: "Abc Project",
      projectCode: "P-4332",
      products: 10,
      recceStatus: "Postponed by Company",
      subStatus: "Company Approval Needed",
      firstAskingTime: "12/11/25-12:10",
      waitingTime: "1 Day, 6 hrs, 5 Minutes",
      leadType: "Revenue: High",
      action: "",
    },
    {
      id: 5,
      sNo: "05",
      projectName: "Xyz Project",
      projectCode: "P-4333",
      products: 8,
      recceStatus: "Hold by Client",
      subStatus: "Client Review Pending",
      firstAskingTime: "12/11/25-12:10",
      waitingTime: "2 Days, 3 hrs, 15 Minutes",
      leadType: "Feedback: Low",
      action: "",
    },
    {
      id: 6,
      sNo: "06",
      projectName: "Demo Project",
      projectCode: "P-4334",
      products: 12,
      recceStatus: "Postponed by Client",
      subStatus: "Client Approval Needed",
      firstAskingTime: "12/11/25-12:10",
      waitingTime: "3 Days, 1 hr, 45 Minutes",
      leadType: "Engagement: High",
      action: "",
    },
    {
      id: 7,
      sNo: "07",
      projectName: "Test Project",
      projectCode: "P-4335",
      products: 5,
      recceStatus: "Hold by Company",
      subStatus: "Company Review Pending",
      firstAskingTime: "12/11/25-12:10",
      waitingTime: "4 Days, 2 hrs, 30 Minutes",
      leadType: "Satisfaction: High",
      action: "",
    },
  ];

  const columnConfig = {
    action: {
      label: "Action",
      render: (_, row) => (
        <button
          onClick={() =>
            navigate(`/recce/assigned-recce-details/${row.id}`, {
              state: { from: "waiting" },
            })
          }
          className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-md transition-colors"
        >
          <Eye size={18} />
        </button>
      ),
    },
    recceStatus: {
      label: "Recce Status",
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-md text-xs font-medium ${getStatusStyle(
            value
          )}`}
        >
          {value}
        </span>
      ),
    },
    projectName: { label: "Project Name" },
    projectCode: { label: "Project Code" },
    products: {
      label: "Product Count",
      render: (value) => (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
          {value ?? 0}
        </span>
      ),
    },

    subStatus: {
      label: "Sub Status",
      render: () => <div className="w-6 h-6 bg-orange-50 rounded-sm"></div>,
    },
    firstAskingTime: { label: "1st Asking Time" },
    waitingTime: { label: "Waiting Time" },
    leadType: {
      label: "Lead Type",
      render: (value) => (
        <span className="text-xs font-medium text-gray-700">{value}</span>
      ),
    },
  };

  const leadTypeOptions = [
    { label: "Feedback: Low", color: "bg-[#5D1910] text-white" },
    { label: "Feedback: High", color: "bg-[#1A237E] text-white" },
    { label: "Engagement: Low", color: "bg-[#252525] text-white" },
    { label: "Engagement: High", color: "bg-[#4A148C] text-white" },
    {
      label: "Warm Lead",
      color: "bg-orange-50 text-orange-600 border border-orange-100",
    },
    {
      label: "Cold Lead",
      color: "bg-blue-50 text-blue-600 border border-blue-100",
    },
    {
      label: "Hot Lead",
      color: "bg-red-50 text-red-600 border border-red-100",
    },
    { label: "Revenue: High", color: "bg-orange-400 text-white" },
    { label: "Revenue: Low", color: "bg-[#4E342E] text-white" },
    { label: "Satisfaction: Low", color: "bg-gray-700 text-white" },
    { label: "Satisfaction: High", color: "bg-blue-800 text-white" },
    { label: "Repeat Potential: Low", color: "bg-gray-800 text-white" },
    { label: "Repeat Potential: High", color: "bg-[#1B5E20] text-white" },
  ];
  const recceStatusOptions = Array.from(
    new Set(staticData.map((item) => item.recceStatus))
  );
  const subStatusOptions = Array.from(
    new Set(staticData.map((item) => item.subStatus).filter(Boolean))
  );

  const parseFirstAskingTime = (value) => {
    if (!value) return null;
    try {
      const [datePart, timePart] = value.split("-");
      if (!datePart || !timePart) return null;
      const [day, month, yearShort] = datePart
        .split("/")
        .map((v) => parseInt(v, 10));
      const [hours, minutes] = timePart.split(":").map((v) => parseInt(v, 10));
      if (!day || !month || !yearShort) return null;
      const fullYear = yearShort + 2000;
      const jsDate = new Date(
        fullYear,
        month - 1,
        day,
        hours || 0,
        minutes || 0
      );
      if (isNaN(jsDate.getTime())) return null;
      return jsDate;
    } catch (e) {
      return null;
    }
  };

  const filteredData = staticData.filter((row) => {
    const term = searchTerm.trim().toLowerCase();

    if (term) {
      const haystack =
        `${row.projectName} ${row.projectCode} ${row.recceStatus} ${row.leadType}`.toLowerCase();
      if (!haystack.includes(term)) return false;
    }

    if (
      selectedLeadTypes.length > 0 &&
      !selectedLeadTypes.includes(row.leadType)
    ) {
      return false;
    }

    if (
      selectedRecceStatuses.length > 0 &&
      !selectedRecceStatuses.includes(row.recceStatus)
    ) {
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
      case "Feedback: Low":
        return "bg-[#5D1910] text-white";
      case "Feedback: High":
        return "bg-[#1A237E] text-white";
      case "Engagement: Low":
        return "bg-[#252525] text-white";
      case "Engagement: High":
        return "bg-[#4A148C] text-white";
      case "Warm Lead":
        return "bg-orange-50 text-orange-600 border border-orange-100";
      case "Cold Lead":
        return "bg-blue-50 text-blue-600 border border-blue-100";
      case "Hot Lead":
        return "bg-red-50 text-red-600 border border-red-100";
      case "Revenue: High":
        return "bg-orange-400 text-white";
      case "Revenue: Low":
        return "bg-[#4E342E] text-white";
      case "Satisfaction: Low":
        return "bg-gray-700 text-white";
      case "Satisfaction: High":
        return "bg-blue-800 text-white";
      case "Repeat Potential: Low":
        return "bg-gray-800 text-white";
      case "Repeat Potential: High":
        return "bg-[#1B5E20] text-white";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };




  return (
    <div className="min-h-screen">
      {/* --- Page Header --- */}


      <DesignSimpleHeader title="Recce in Waiting" />


      {/* Self / Team Toggle */}
      {isManager && (
        <div className="flex justify-center my-4">
          <SelfTeamToggle value={viewType} onChange={setViewType} />
        </div>
      )}

      {/* --- Filter Bar --- */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-200">
        <div className="flex flex-wrap gap-3 items-center" ref={dropdownRef}>
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
                {["All", "Today", "Last 7 Days", "Last 30 Days"].map(
                  (option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setDateFilter(option);
                        setOpenDropdown(null);
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${dateFilter === option ? "bg-gray-100 font-medium" : ""
                        }`}
                    >
                      {option}
                    </button>
                  )
                )}
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
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors min-w-[150px] justify-between"
            >
              <span className="font-medium">
                {selectedLeadTypes.length === 0
                  ? "Lead Type"
                  : `${selectedLeadTypes.length} selected`}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {openDropdown === "leadType" && (
              <div className="absolute z-20 mt-2 w-[520px] bg-white border border-gray-200 rounded-lg shadow-xl text-sm max-h-[420px] overflow-auto p-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Left Column */}
                  <div className="space-y-2">
                    {[
                      {
                        label: "Feedback: Low",
                        color: "bg-[#5D1910] text-white",
                      },
                      {
                        label: "Engagement: Low",
                        color: "bg-[#252525] text-white",
                      },
                      {
                        label: "Engagement: High",
                        color: "bg-[#4A148C] text-white",
                      },
                    ].map((option) => {
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
                          className="w-full transition-transform hover:scale-[1.02]"
                        >
                          <div
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium shadow-sm ${option.color
                              } ${isActive
                                ? "ring-2 ring-offset-1 ring-blue-500"
                                : ""
                              }`}
                          >
                            {isActive ? (
                              <CheckSquare
                                size={16}
                                className="flex-shrink-0"
                              />
                            ) : (
                              <Square
                                size={16}
                                className="flex-shrink-0 opacity-70"
                              />
                            )}
                            <span>{option.label}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-2">
                    {[
                      {
                        label: "Warm Lead",
                        color:
                          "bg-orange-50 text-orange-600 border border-orange-200",
                      },
                      {
                        label: "Cold Lead",
                        color:
                          "bg-blue-50 text-blue-600 border border-blue-200",
                      },
                      {
                        label: "Hot Lead",
                        color: "bg-red-50 text-red-600 border border-red-200",
                      },
                      {
                        label: "Revenue: High",
                        color: "bg-orange-400 text-white",
                      },
                      {
                        label: "Satisfaction: Low",
                        color: "bg-gray-700 text-white",
                      },
                      {
                        label: "Satisfaction: High",
                        color: "bg-blue-800 text-white",
                      },
                      {
                        label: "Repeat Potential: Low",
                        color: "bg-gray-800 text-white",
                      },
                      {
                        label: "Revenue: Low",
                        color: "bg-[#4E342E] text-white",
                      },
                      {
                        label: "Repeat Potential: High",
                        color: "bg-[#1B5E20] text-white",
                      },
                      {
                        label: "Feedback: High",
                        color: "bg-[#1A237E] text-white",
                      },
                    ].map((option) => {
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
                          className="w-full transition-transform hover:scale-[1.02]"
                        >
                          <div
                            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium shadow-sm ${option.color
                              } ${isActive
                                ? "ring-2 ring-offset-1 ring-blue-500"
                                : ""
                              }`}
                          >
                            {isActive ? (
                              <CheckSquare
                                size={16}
                                className="flex-shrink-0"
                              />
                            ) : (
                              <Square
                                size={16}
                                className="flex-shrink-0 opacity-70"
                              />
                            )}
                            <span>{option.label}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Clear Button */}
                <button
                  type="button"
                  onClick={() => setSelectedLeadTypes([])}
                  className="w-full text-center px-3 py-2.5 text-sm font-medium text-red-600 border-t border-gray-200 hover:bg-red-50 rounded-b-md mt-4 transition-colors"
                >
                  Clear Lead Type
                </button>
              </div>
            )}
          </div>

          {/* Recce Status Filter (Multi-select) */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setOpenDropdown(
                  openDropdown === "recceStatus" ? null : "recceStatus"
                )
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
                      className={`w-full flex items-center gap-2 text-left px-3 py-2 hover:bg-gray-100 ${isActive ? "bg-gray-100 font-medium" : ""
                        }`}
                    >
                      {isActive ? (
                        <CheckSquare size={14} />
                      ) : (
                        <Square size={14} />
                      )}
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
                setOpenDropdown(
                  openDropdown === "recceSubStatus" ? null : "recceSubStatus"
                )
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
                      className={`w-full flex items-center gap-2 text-left px-3 py-2 hover:bg-gray-100 ${isActive ? "bg-gray-100 font-medium" : ""
                        }`}
                    >
                      {isActive ? (
                        <CheckSquare size={14} />
                      ) : (
                        <Square size={14} />
                      )}
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
          {/* Clear All Filters Button - styled and positioned inline */}
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setDateFilter("All");
              setSelectedLeadTypes([]);
              setSelectedRecceStatuses([]);
              setSelectedSubStatuses([]);
            }}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 min-w-[170px] justify-between font-medium transition-colors"
            style={{ marginLeft: "8px" }}
          >
            Clear All Filters
          </button>
        </div>
      </div>

      {/* --- Table Section --- */}
      <Table
        data={
          viewType === "self"
            ? filteredData
            : filteredData /* future: replace with team waiting recce data */
        }
        columnConfig={columnConfig}

        onPageChange={(page, limit) => {
          setCurrentPage(page);
          setItemsPerPage(limit);
        }}

      />
    </div>
  );
};

export default WaitingRecce;
