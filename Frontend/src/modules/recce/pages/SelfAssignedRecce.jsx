import React, { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Eye,
  X,
  Calendar,
  Flag,
  MapPin,
  ChevronDown,
  AlertCircle,
  CheckCircle,
  UserCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Table from "../../../components/Table";
import PageHeader from "@/components/PageHeader";

const SelfAssignedRecce = () => {
  const navigate = useNavigate();

  const res = useSelector((state) => state.auth.userData);
  const user = res?.user || {};

  const [allData, setAllData] = useState([]);
  const [notification, setNotification] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  /* ------------------ STATIC DATA ------------------ */
  useEffect(() => {
    const staticData = [
      {
        _id: "1",
        clientName: "ABC Corp",
        clientCity: "Mumbai",
        projectName: "Office Renovation",
        address: "Andheri East, Mumbai",
        createdAt: "2025-01-18T10:30:00Z",
        priority: "High",
        approvalStatus: "Accepted",
        assignedTo: null,
        assignedToName: null,
      },
      {
        _id: "2",
        clientName: "XYZ Builders",
        clientCity: "Delhi",
        projectName: "Residential Tower",
        address: "Dwarka Sector 21, Delhi",
        createdAt: "2025-01-17T14:00:00Z",
        priority: "Medium",
        approvalStatus: "Accepted",
        assignedTo: null,
        assignedToName: null,
      },
    ];

    setAllData(staticData);
  }, []);

  /* ------------------ FILTER LOGIC ------------------ */
  const filteredData = useMemo(() => {
    return allData.filter((item) => {
      if (item.approvalStatus !== "Accepted") return false;

      const matchesSearch =
        item.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.projectName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPriority =
        selectedPriority === "" || item.priority === selectedPriority;

      const matchesLocation =
        selectedLocation === "" || item.clientCity === selectedLocation;

      const itemDate = item?.createdAt?.split("T")[0];
      const matchesDate = selectedDate === "" || itemDate === selectedDate;

      return matchesSearch && matchesPriority && matchesLocation && matchesDate;
    });
  }, [allData, searchTerm, selectedPriority, selectedLocation, selectedDate]);

  /* ------------------ HELPERS ------------------ */
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replace(",", "");
  };

  /* ------------------ ACTIONS ------------------ */
  const handleViewDetails = (id) => {
    navigate(`/recce/assigned-recce-details/${id}`);
  };


  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedDate("");
    setSelectedPriority("");
    setSelectedLocation("");
  };

  /* ------------------ TABLE CONFIG ------------------ */
  const columnConfig = {
    actions: {
      label: "Actions",
      render: (_, row) => (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => handleViewDetails(row._id)}
            className="w-8 h-8 flex items-center justify-center rounded bg-blue-600 text-white hover:bg-blue-700"
            title="View"
          >
            <Eye size={16} />
          </button>

        </div>
      ),
    },

    status: {
      label: "Status",
      render: (_, row) => (
        <span
          className={`px-3 py-1 rounded-md text-xs font-semibold border ${
            row.approvalStatus === "Accepted"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {row.approvalStatus || "Pending"}
        </span>
      ),
    },

    client: {
      label: "Client",
      render: (_, row) => <span className="font-medium">{row.clientName}</span>,
    },

    project: {
      label: "Project",
      render: (_, row) => <span>{row.projectName}</span>,
    },

    address: {
      label: "Address",
      render: (_, row) => <span>{row.address}</span>,
    },

    visitTime: {
      label: "Visit Time",
      render: (_, row) => (
        <span className="whitespace-nowrap">
          {formatDateTime(row.createdAt)}
        </span>
      ),
    },

    priority: {
      label: "Priority",
      render: (value) => <span className="font-semibold">{value}</span>,
    },

    assignedTo: {
      label: "Assigned To",
      render: (_, row) => (
        <span className="text-sm">{row.assignedToName || "Unassigned"}</span>
      ),
    },
  };

  /* ------------------ JSX ------------------ */
  return (
    <div className="min-h-screen">
      <PageHeader title="Self Assign Recce" />

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border">
        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border rounded text-sm"
          />

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 border rounded text-sm"
          >
            <option value="">Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-3 py-2 border rounded text-sm"
          >
            <option value="">Location</option>
            {[...new Set(allData.map((i) => i.clientCity))].map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          <button
            onClick={handleClearFilters}
            className="px-4 py-2 border rounded text-sm"
          >
            Clear
          </button>
        </div>
      </div>

      <Table data={filteredData} columnConfig={columnConfig} />

      {notification && (
        <div
          className={`fixed bottom-4 right-4 p-4 rounded shadow flex items-center gap-2 ${
            notification.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          <span>{notification.message}</span>
        </div>
      )}
    </div>
  );
};

export default SelfAssignedRecce;
