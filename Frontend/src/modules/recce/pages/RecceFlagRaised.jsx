import React, { useState, useMemo, useEffect } from "react";
import {
  Eye,
  Calendar,
  MapPin,
  ChevronDown,
  X,
  Flag,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import Table from "../../../components/Table";

import SelfTeamToggle from "../components/SelfTeamToggle";
import DesignSimpleHeader from "@/modules/design/components/designs/DesignSimpleHeader";
import { useGetAllReqDesignListQuery } from "@/api/recce/manager/request-all/request-all.api";
import { useGetMangerTeamDeclineFlagListQuery } from "@/api/recce/manager/team-flag-decline/team-flag-decline.api";
import { useGetRecceExeAllDecisionsListQuery } from "@/api/recce/executive/recce-exe-nextday/recce-exe-nextday.api";

const RecceFlagRaised = () => {
  const navigate = useNavigate();

  /* =======================
    AUTH / ROLE
  ======================= */
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


  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10)

  /* =======================
    STATES
  ======================= */
  const [viewType, setViewType] = useState("self"); // self | team
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  /* =======================
    CLEAR FILTERS
  ======================= */
  const handleClearFilters = () => {
    setSelectedDate("");
    setSelectedPriority("");
    setSelectedLocation("");
  };

  /* =======================
    DATA
  ======================= */
  const formattedData = useMemo(
    () => [
      {
        id: "FR-001",
        flagId: "FLAG-101",
        client: "GreenFields Pvt Ltd",
        city: "Mumbai",
        project: "Retail Store Branding",
        productCount: 3,
        address: "24, High Street, Andheri West",
        visitTime: "2025-01-15",
        priority: "High",
        siteLocation: "19.1197,72.8468",
        status: "open",
      },
      {
        id: "FR-002",
        flagId: "FLAG-102",
        client: "AgroMart",
        city: "Noida",
        project: "Mall Facade Signage",
        productCount: 5,
        address: "Sector 18, Noida",
        visitTime: "2025-01-16",
        priority: "Medium",
        flagReason: "Site access not available",
        siteLocation: "",
        status: "open",
      },
      {
        id: "FR-003",
        flagId: "FLAG-103",
        client: "FreshStore",
        city: "Bengaluru",
        project: "Office Branding",
        productCount: 2,
        address: "MG Road",
        visitTime: "2025-01-17",
        priority: "Low",
        flagReason: "Power supply issue",
        siteLocation: "12.9716,77.5946",
        status: "resolved",
      },
    ],
    []
  );

  /* =======================
    FILTER OPTIONS
  ======================= */
  const unique = (arr) => [...new Set(arr.filter(Boolean))];
  const uniqueLocations = unique(formattedData.map((i) => i.city));
  const uniquePriorities = unique(formattedData.map((i) => i.priority));

  /* =======================
    FILTER LOGIC
  ======================= */
  const filteredData = useMemo(() => {
    let data = [...formattedData];

    if (selectedDate) {
      data = data.filter((item) => item.visitTime === selectedDate);
    }

    if (selectedPriority) {
      data = data.filter((item) => item.priority === selectedPriority);
    }

    if (selectedLocation) {
      data = data.filter((item) => item.city === selectedLocation);
    }

    return data;
  }, [formattedData, selectedDate, selectedPriority, selectedLocation]);

  /* =======================
    NAVIGATION
  ======================= */
  const handleViewDetails = (row) => {
    navigate(`/recce/assigned-recce-details/${row.id}`, {
      state: { from: "flagRaised" },
    });
  };

  /* =======================
    TABLE CONFIG
  ======================= */
  const columnConfig = {
    actions: {
      label: "Actions",
      render: (_, row) => (
        <div className="flex items-center justify-center gap-2">
          <button
            className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => handleViewDetails(row)}
          >
            <Eye size={16} />
          </button>

          {row.status === "open" ? (
            <button
              className="p-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
              onClick={() => toast.success("Flag resolved successfully")}
            >
              <Flag size={16} />
            </button>
          ) : (
            <span className="text-gray-400 text-sm">—</span>
          )}
        </div>
      ),
    },
    status: {
      label: "Status",
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${value === "open"
            ? "bg-red-50 text-red-600"
            : "bg-green-50 text-green-600"
            }`}
        >
          {value === "open" ? "Flag Raised" : "Resolved"}
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
    client: { label: "Client" },
    project: { label: "Project" },
    productCount: { label: "Product Count" },
    fullAddress: {
      label: "Address",
      render: (_, row) => {
        const query = encodeURIComponent(`${row.address} ${row.city}`);
        return (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${query}`}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:underline"
          >
            {row.address}
          </a>
        );
      },
    },
    visitTime: { label: "Visit Date" },

    flagReason: { label: "Flag Reason" },
  };


  // =================================== [api section started] =============================

  // ================= MANAGER =================

  // Self flag list
  const {
    data: selfFlagData,
    isLoading: selfFlagLoading,
    isFetching: selfFlagFetching,
    error: selfFlagError,
  } = useGetAllReqDesignListQuery(
    {
      page: currentPage,
      limit: itemsPerPage,
      type: "flag",
    },
    {
      skip: !isManager || viewType !== "self",
    }
  );

  // Team flag list
  const {
    data: teamFlagData,
    isLoading: teamFlagLoading,
    isFetching: teamFlagFetching,
    error: teamFlagError,
  } = useGetMangerTeamDeclineFlagListQuery(
    {
      page: currentPage,
      limit: itemsPerPage,
      type: "flag",
    },
    {
      skip: !isManager || viewType !== "team",
    }
  );

  // ================= EXECUTIVE =================

  const {
    data: executiveFlagData,
    isLoading: executiveFlagLoading,
    isFetching: executiveFlagFetching,
    error: executiveFlagError,
  } = useGetRecceExeAllDecisionsListQuery(
    {
      page: currentPage,
      limit: itemsPerPage,
      decision: "flag",
    },
    {
      skip: isManager, // only for executive
    }
  );

  // ================= COMMON STATE =================

  const managerStateByView = {
    self: {
      data: selfFlagData,
      isLoading: selfFlagLoading,
      isFetching: selfFlagFetching,
      error: selfFlagError,
    },
    team: {
      data: teamFlagData,
      isLoading: teamFlagLoading,
      isFetching: teamFlagFetching,
      error: teamFlagError,
    },
  };

  const managerState = managerStateByView[viewType] ?? {};

  const data = isManager ? managerState.data : executiveFlagData;
  const isLoading = isManager
    ? managerState.isLoading
    : executiveFlagLoading;
  const isFetching = isManager
    ? managerState.isFetching
    : executiveFlagFetching;
  const error = isManager ? managerState.error : executiveFlagError;

  useEffect(() => {
    console.log("Flag API data:", data);
  }, [data]);

  // =================================== [api section end] =============================


  /* =======================
    JSX
  ======================= */
  return (
    <div className="min-h-screen">

      <DesignSimpleHeader title="Recce Flag Raised" />

      {isManager && (
        <div className="flex justify-center my-6">
          <SelfTeamToggle value={viewType} onChange={setViewType} />
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border mb-6 flex gap-4 flex-wrap">
        <div className="relative">
          <Calendar className="absolute left-3 top-2.5 text-gray-500" size={16} />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="pl-10 pr-3 py-2 border rounded-md"
          />
        </div>

        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
          className="border rounded-md px-3 py-2"
        >
          <option value="">Priority</option>
          {uniquePriorities.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="border rounded-md px-3 py-2"
        >
          <option value="">Location</option>
          {uniqueLocations.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>

        <button
          onClick={handleClearFilters}
          className="flex items-center gap-2 px-3 py-2 border rounded-md"
        >
          <X size={14} /> Clear
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <Table data={filteredData} columnConfig={columnConfig}
          onPageChange={(page, limit) => {
            setCurrentPage(page);
            setItemsPerPage(limit)
          }}
        />


      </div>
    </div>
  );
};

export default RecceFlagRaised;
