import React, { useState, useMemo, useEffect } from "react";
import { Eye, Calendar, MapPin, ChevronDown, X, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Table from "../../../components/Table";
import PageHeader from "../../../components/PageHeader";
import SelfTeamToggle from "../components/SelfTeamToggle";
import { useSelector } from "react-redux";
import DesignSimpleHeader from "@/modules/design/components/designs/DesignSimpleHeader";
import { useGetRecceAllWaitingLostListQuery } from "@/api/recce/common/recce-waiting-lost.api";

const LostRecce = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // FILTER STATES
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [viewType, setViewType] = useState("self"); // self | team

  // STATIC DATA (LOST RECCE)
  const tableData = [
    {
      id: "LR-001",
      client: "GreenFields Pvt Ltd",
      project: "Retail Store Branding",
      productCount: 3,
      address: "24, High Street, Andheri West",
      city: "Mumbai",
      visitTime: "2025-01-10T10:30:00",
      priority: "High",
      status: "Lost",
      reason: "Client cancelled project",
      siteLocation: "19.1197, 72.8468",
    },
    {
      id: "LR-002",
      client: "AgroMart",
      project: "Mall Facade Signage",
      productCount: 5,
      address: "Sector 18, Noida",
      city: "Noida",
      visitTime: "2025-01-11T11:00:00",
      priority: "Medium",
      status: "Lost",
      reason: "Budget constraints",
      siteLocation: "",
    },
    {
      id: "LR-003",
      client: "FreshStore",
      project: "Office Branding",
      productCount: 2,
      address: "MG Road",
      city: "Bengaluru",
      visitTime: "2025-01-12T09:45:00",
      priority: "Low",
      status: "Lost",
      reason: "No response from client",
      siteLocation: "12.9716, 77.5946",
    },
  ];

  const unique = (arr) => [...new Set(arr.filter(Boolean))];
  const uniqueLocations = unique(tableData.map((i) => i.city));

  const filteredData = useMemo(() => {
    let data = [...tableData];

    if (selectedDate) {
      data = data.filter((item) => {
        const d = new Date(item.visitTime).toISOString().split("T")[0];
        return d === selectedDate;
      });
    }

    if (selectedLocation) {
      data = data.filter((item) => item.city === selectedLocation);
    }

    return data;
  }, [selectedDate, selectedLocation]);

  useEffect(() => {
    const handleClickOutside = () => { };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleView = (row) => {
    navigate(`/recce/assigned-recce-details/${row.id}`, {
      state: { from: "lost", recce: row },
    });
  };

  const columnConfig = {
    actions: {
      label: "Actions",
      render: (_, row) => (
        <div className="flex justify-center">
          <button
            onClick={() => handleView(row)}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            title="View Details"
          >
            <Eye size={16} />
          </button>
        </div>
      ),
    },
    status: {
      label: "Status",
      render: () => (
        <div style={{ textAlign: "center" }}>
          <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-red-50 text-red-700 border-red-200">
            Lost
          </span>
        </div>
      ),
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
        const mapUrl = row.siteLocation
          ? `https://www.google.com/maps?q=${row.siteLocation}`
          : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            `${row.address} ${row.city}`,
          )}`;

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

    visitTime: {
      label: "Visit Time",
      render: (v) =>
        new Date(v).toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },

    reason: {
      label: "Lost Reason",
      render: (value) => <span className="text-xs text-gray-700">{value}</span>,
    },
  };

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


  // ========================= [api section start] ============================

  const {
    data,
    isLoading,
    isFetching,
    error
  } = useGetRecceAllWaitingLostListQuery({
    page: currentPage,
    limit: itemsPerPage,
    status: "lost",
    type: viewType
  }
  )


  useEffect(() => {
    console.log('data:>', data)
  }, [data])


  // ========================= [api section end] ===============================

  return (
    <div className="min-h-screen">

      <DesignSimpleHeader title="Lost Recce" />

      {/* Self / Team Toggle */}
      {isManager && (
        <div className="flex justify-center my-4">
          <SelfTeamToggle value={viewType} onChange={setViewType} />
        </div>
      )}

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <Calendar
              className="absolute left-3 top-2.5 text-gray-500"
              size={16}
            />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md text-sm"
            />
          </div>

          <div className="relative">
            <MapPin
              className="absolute left-3 top-2.5 text-gray-500"
              size={16}
            />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="pl-10 pr-10 py-2 border rounded-md text-sm appearance-none"
            >
              <option value="">Location</option>
              {uniqueLocations.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>

          <button
            onClick={() => {
              setSelectedDate("");
              setSelectedLocation("");
            }}
            className="flex items-center gap-2 px-3 py-2 border rounded-md text-sm"
          >
            <X size={14} /> Clear Filters
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Table
          data={
            viewType === "self"
              ? filteredData
              : filteredData /* future: replace with team lost recce data */
          }
          columnConfig={columnConfig}

          onPageChange={(page, limit) => {
            setCurrentPage(page);
            setItemsPerPage(limit);
          }}

        />
      </div>
    </div>
  );
};

export default LostRecce;
