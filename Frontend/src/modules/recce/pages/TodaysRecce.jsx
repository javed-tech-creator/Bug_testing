import React, { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Eye,
  Calendar,
  MapPin,
  Filter,
  ChevronDown,
  X,
  Flag,
  UserPlus,
  Share2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Table from "../../../components/Table";
import PageHeader from "../../../components/PageHeader";
import AssignedRecceModal from "../components/AssignedRecceModal";
import DesignSimpleHeader from "@/modules/design/components/designs/DesignSimpleHeader";
import { useGetTodayAllRecceListQuery } from "@/api/recce/common/today-recce.api";

const TodaysRecce = () => {
  const navigate = useNavigate();

  const res = useSelector((state) => state.auth.userData);
  const user = res?.user || {};
  const role = user?.designation?.title?.toLowerCase();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const normalizedRole =
    {
      executive: "executive",
      "recce executive": "executive",
      manager: "manager",
      "recce manager": "manager",
      hod: "manager",
      "recce hod": "manager",
    }[role] || "executive";

  const isManager = normalizedRole === "manager";

  // STATE FOR FILTERS
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);

  // STATE FOR MODAL
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecce, setSelectedRecce] = useState(null);

  const handleClearFilters = () => {
    setSelectedDate("");
    setSelectedPriority("");
    setSelectedLocation("");
  };

  const formattedData = [
    {
      id: "RR-001",
      client: "GreenFields Pvt Ltd",
      project: "Retail Store Branding",
      productCount: 3,
      address: "24, High Street, Andheri West",
      city: "Mumbai",
      visitTime: "15 Jan 2025, 10:30 AM",
      deadline: "20 Jan 2025",
      priority: "High",
      status: "Recce Received",
      approvalStatus: "Accepted",
      siteLocation: "19.1197, 72.8468",
    },
    {
      id: "RR-002",
      client: "AgroMart",
      project: "Mall Facade Signage",
      productCount: 5,
      address: "Sector 18, Noida",
      city: "Noida",
      visitTime: "16 Jan 2025, 11:00 AM",
      deadline: "21 Jan 2025",
      priority: "Medium",
      status: "Recce Received",
      approvalStatus: "Accepted",
      siteLocation: "",
    },
    {
      id: "RR-003",
      client: "FreshStore",
      project: "Office Branding",
      productCount: 2,
      address: "MG Road",
      city: "Bengaluru",
      visitTime: "17 Jan 2025, 09:45 AM",
      deadline: "22 Jan 2025",
      priority: "Low",
      status: "Recce Received",
      approvalStatus: "Accepted",
      siteLocation: "12.9716, 77.5946",
    },
  ];

  // Extract Unique Options Dynamically
  const unique = (arr) => [...new Set(arr.filter(Boolean))];
  const uniqueLocations = unique(formattedData.map((item) => item.city));
  const uniquePriorities = unique(formattedData.map((item) => item.priority));

  // Sequential Filtering
  const filteredData = useMemo(() => {
    let data = [...formattedData];

    if (selectedDate) {
      data = data.filter((item) => {
        const itemDate = item.visitTime
          ? new Date(item.visitTime).toISOString().split("T")[0]
          : "";
        return itemDate === selectedDate;
      });
    }

    if (selectedPriority && selectedPriority !== "All") {
      data = data.filter((item) => item.priority === selectedPriority);
    }

    if (selectedLocation && selectedLocation !== "All") {
      data = data.filter((item) => item.city === selectedLocation);
    }

    return data;
  }, [formattedData, selectedDate, selectedPriority, selectedLocation]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleViewDetails = (item) => {
    navigate(`/recce/recce-details/${item.id}`, {
      state: {
        recce: item,
        from: "received",
      },
    });
  };

  const handleAssignRecce = (item) => {
    setSelectedRecce(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecce(null);
  };

  const columnConfig = {
    actions: {
      label: "Actions",
      render: (value, row) => {
        return (
          <div className="flex items-center justify-center gap-2">
            <button
              className="w-8 h-8 flex items-center justify-center rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
              onClick={() => handleViewDetails(row)}
              title="View"
            >
              <Eye size={16} strokeWidth={2.5} />
            </button>

          </div>
        );
      },
    },
    status: {
      label: "Status",
      render: () => (
        <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-green-50 text-green-600 border-green-100">
          Recce Received
        </span>
      ),
    },
    priority: {
      label: "Priority",
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${value === "High"
            ? "bg-red-50 text-red-600 border-red-100"
            : value === "Medium"
              ? "bg-orange-50 text-orange-600 border-orange-100"
              : "bg-green-50 text-green-600 border-green-100"
            }`}
        >
          {value}
        </span>
      ),
    },
    priorityNumber: {
      label: "Priority By Number",
      render: (_, row) => {
        const map = {
          High: 1,
          Medium: 2,
          Low: 3,
        };

        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-gray-50 text-gray-700 border-gray-200">
            {map[row.priority] ?? "-"}
          </span>
        );
      },
    },
    client: { label: "Client" },
    project: { label: "Projects" },
    productCount: {
      label: "Product Count",
      render: (value) => (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
          {value ?? 0}
        </span>
      ),
    },
    fullAddress: {
      label: "Address",
      render: (_, row) => {
        const query = encodeURIComponent(
          row.siteLocation && row.siteLocation.trim() !== ""
            ? row.siteLocation
            : `${row.address}, ${row.city}`
        );

        return (
          <button
            onClick={() =>
              window.open(
                `https://www.google.com/maps/search/?api=1&query=${query}`,
                "_blank"
              )
            }
            className="text-sm text-blue-600 hover:underline cursor-pointer text-left"
            title="Open address in new tab"
          >
            {row.address}
          </button>
        );
      },
    },

    visitTime: { label: "Date" },
    deadline: {
      label: "Deadline",
      render: (value) => (
        <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-red-50 text-red-600 border-red-100">
          {value || "-"}
        </span>
      ),
    },
  };

  // ============================== [Api section started] ===================

  const {
    data,
    isLoading,
    isFetching,
    error
  } = useGetTodayAllRecceListQuery({
    page: currentPage,
    limit: itemsPerPage
  })

  useEffect(() => {
    console.log('data:>', data)
  }, [data])

  // ============================== [Api section end] ===================


  return (
    <div className="min-h-screen">
      {/* Page Title */}
      <div className="mb-6">

        <DesignSimpleHeader title="Today's Recce" />
      </div>

      {
        <>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col md:flex-row items-center justify-start gap-4">
              {/* Filter Dropdowns */}
              <div className="flex items-center gap-3 w-full overflow-x-auto pb-2 md:pb-0">
                {/* Date Filter */}
                <div className="relative dropdown-container">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar size={16} className="text-gray-500" />
                  </div>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none cursor-pointer"
                  />
                </div>

                {/* Priority Filter */}
                <div className="relative dropdown-container">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Flag size={16} className="text-gray-500" />
                  </div>
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="appearance-none pl-10 pr-10 py-2 bg-white border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none cursor-pointer min-w-[130px]"
                  >
                    <option value="">Priority</option>
                    {uniquePriorities.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown size={14} className="text-gray-400" />
                  </div>
                </div>

                {/* Location Filter */}
                <div className="relative dropdown-container">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin size={16} className="text-gray-500" />
                  </div>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="appearance-none pl-10 pr-10 py-2 bg-white border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none cursor-pointer min-w-[140px]"
                  >
                    <option value="">Location</option>
                    {uniqueLocations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown size={14} className="text-gray-400" />
                  </div>
                </div>

                {/* Clear Filters Button */}
                <button
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 bg-white rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 flex-shrink-0 shadow-sm"
                >
                  <X size={14} className="text-gray-500" />
                  <span>Clear Filters</span>
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <Table
                data={filteredData}
                columnConfig={columnConfig}
                onPageChange={(page, limit) => {
                  setCurrentPage(page);
                  setItemsPerPage(limit);
                }}
              />
            </div>
          </div>
        </>
      }

      {/* Assigned Recce Modal */}
      <AssignedRecceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        recceData={selectedRecce}
      />
    </div>
  );
};

export default TodaysRecce;
