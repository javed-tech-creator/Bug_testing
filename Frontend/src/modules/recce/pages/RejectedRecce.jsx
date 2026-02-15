import React, { useState, useMemo, useEffect } from "react";
import { Eye, Calendar, MapPin, ChevronDown, X, Flag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Table from "../../../components/Table";
import PageHeader from "../../../components/PageHeader";
import { useSelector } from "react-redux";
import SelfTeamToggle from "../components/SelfTeamToggle";
import DesignSimpleHeader from "@/modules/design/components/designs/DesignSimpleHeader";
import { useGetMangerTeamDeclineFlagListQuery } from "@/api/recce/manager/team-flag-decline/team-flag-decline.api";
import { useGetAllReqDesignListQuery } from "@/api/recce/manager/request-all/request-all.api";
import { useGetRecceExeAllDecisionsListQuery } from "@/api/recce/executive/recce-exe-nextday/recce-exe-nextday.api";

const RejectedRecce = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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
  const [viewType, setViewType] = useState("self");

  // Filters state
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  // const [viewType, setViewType] = useState("self"); // self | team

  const handleClearFilters = () => {
    setSelectedDate("");
    setSelectedPriority("");
    setSelectedLocation("");
  };

  const formattedData = [
    {
      id: "RJ-001",
      client: "GreenFields Pvt Ltd",
      project: "Retail Store Branding",
      productCount: 3,
      address: "24, High Street, Andheri West",
      city: "Mumbai",
      visitTime: "15 Jan 2025, 10:30 AM",
      priority: "High",
      siteLocation: "19.1197,72.8468",
      rejectionReason: "Client postponed the project",
    },
    {
      id: "RJ-002",
      client: "AgroMart",
      project: "Mall Facade Signage",
      productCount: 5,
      address: "Sector 18, Noida",
      city: "Noida",
      visitTime: "16 Jan 2025, 11:00 AM",
      priority: "Medium",
      siteLocation: "",
      rejectionReason: "Budget constraints",
    },
    {
      id: "RJ-003",
      client: "FreshStore",
      project: "Office Branding",
      productCount: 2,
      address: "MG Road",
      city: "Bengaluru",
      visitTime: "17 Jan 2025, 09:45 AM",
      priority: "Low",
      siteLocation: "12.9716,77.5946",
      rejectionReason: "Incorrect site details provided",
    },
  ];

  // Unique filter options
  const unique = (arr) => [...new Set(arr.filter(Boolean))];
  const uniqueLocations = unique(formattedData.map((i) => i.city));
  const uniquePriorities = unique(formattedData.map((i) => i.priority));

  // Filtering logic
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

    if (selectedPriority) {
      data = data.filter((item) => item.priority === selectedPriority);
    }

    if (selectedLocation) {
      data = data.filter((item) => item.city === selectedLocation);
    }

    return data;
  }, [formattedData, selectedDate, selectedPriority, selectedLocation]);

  const handleViewDetails = (row) => {
    navigate(`/recce/assigned-recce-details/${row.id}`, {
      state: { from: "declined" },
    });
  };

  // Table config (same as accepted + rejection reason)
  const columnConfig = {
    actions: {
      label: "Actions",
      render: (_, row) => (
        <button
          className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => handleViewDetails(row)}
        >
          <Eye size={16} />
        </button>
      ),
    },
    status: {
      label: "Status",
      render: () => (
        <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-red-50 text-red-600 border-red-100">
          Declined
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
    project: { label: "Project" },
    productCount: {
      label: "Product Count",
      render: (value) => (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
          {value ?? 0}
        </span>
      ),
    },
    address: {
      label: "Address",
      render: (_, row) => {
        const query = encodeURIComponent(`${row.address} ${row.city}`);
        const mapUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;

        return (
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline cursor-pointer"
            title="Open address in Google Maps"
          >
            {row.address}
          </a>
        );
      },
    },

    visitTime: { label: "Visit Time" },


    rejectionReason: {
      label: "Rejection Reason",
      render: (value) => <span className="text-sm text-gray-600">{value}</span>,
    },
  };


  // ============================== [ api section start ] ==========================

  // ================= MANAGER =================

  // Self rejected
  const {
    data: selfData,
    isLoading: selfDataLoading,
    isFetching: selfDataFetching,
    error: selfDataError,
  } = useGetAllReqDesignListQuery(
    {
      page: currentPage,
      limit: itemsPerPage,
      type: "reject",
    },
    {
      skip: !isManager || viewType !== "self",
    }
  );

  // Team rejected
  const {
    data: teamData,
    isLoading: teamLoading,
    isFetching: teamFetching,
    error: teamError,
  } = useGetMangerTeamDeclineFlagListQuery(
    {
      page: currentPage,
      limit: itemsPerPage,
      type: "decline",
    },
    {
      skip: !isManager || viewType !== "team",
    }
  );

  // ================= EXECUTIVE =================

  const {
    data: executiveData,
    isLoading: executiveLoading,
    isFetching: executiveFetching,
    error: executiveError,
  } = useGetRecceExeAllDecisionsListQuery(
    {
      page: currentPage,
      limit: itemsPerPage,
      decision: "decline",
    },
    {
      skip: isManager,
    }
  );

  // ================= COMMON STATE =================

  const managerStateByView = {
    self: {
      data: selfData,
      isLoading: selfDataLoading,
      isFetching: selfDataFetching,
      error: selfDataError,
    },
    team: {
      data: teamData,
      isLoading: teamLoading,
      isFetching: teamFetching,
      error: teamError,
    },
  };

  const managerState = managerStateByView[viewType] ?? {};

  const data = isManager ? managerState.data : executiveData;
  const isLoading = isManager
    ? managerState.isLoading
    : executiveLoading;
  const isFetching = isManager
    ? managerState.isFetching
    : executiveFetching;
  const error = isManager ? managerState.error : executiveError;

  useEffect(() => {
    console.log("Rejected API:", data);
  }, [data]);

  // ============================== [ api section end ] ==========================



  return (
    <div className="min-h-screen">


      <DesignSimpleHeader title="Recce Declined" />

      {/* Self / Team Toggle */}
      {isManager && (
        <div className="flex justify-center my-4">
          <SelfTeamToggle value={viewType} onChange={setViewType} />
        </div>
      )}

      {
        <>
          {/* Filters */}
          <div className="bg-white p-4 rounded-lg border mb-6 flex gap-3 flex-wrap">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border px-3 py-2 rounded-md text-sm"
            />

            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="border px-3 py-2 rounded-md text-sm"
            >
              <option value="">Priority</option>
              {uniquePriorities.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="border px-3 py-2 rounded-md text-sm"
            >
              <option value="">Location</option>
              {uniqueLocations.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>

            <button
              onClick={handleClearFilters}
              className="px-3 py-2 border rounded-md text-sm"
            >
              Clear
            </button>
          </div>

          {/* Table */}
          <Table
            data={filteredData}
            columnConfig={columnConfig}

            onPageChange={(page, limit) => {
              setCurrentPage(page);
              setItemsPerPage(limit);
            }}

          />
        </>
      }
    </div>
  );
};

export default RejectedRecce;
