import React, { useState, useMemo, useEffect } from "react";
import {
  Eye,
  Calendar,
  MapPin,
  ChevronDown,
  X,
  Flag,
  Send,
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Table from "../../../components/Table";
import FeedbackModal from "../../quotation/components/FeedbackModal";
import DesignSimpleHeader from "@/modules/design/components/designs/DesignSimpleHeader";
import SelfTeamToggle from "../components/SelfTeamToggle";
const RecceReviewManager = () => {
  const navigate = useNavigate();
  
  // Get user role
  const res = useSelector((state) => state.auth.userData);
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
  
  const headerTitle = normalizedRole === "manager" ? "Recce Final Preview" : "Recce Review (Manager)";

// FILTER STATES
const [selectedDate, setSelectedDate] = useState("");
const [selectedPriority, setSelectedPriority] = useState("");
const [selectedLocation, setSelectedLocation] = useState("");
const [viewType, setViewType] = useState("self");

const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
const [feedbackData, setFeedbackData] = useState([]);

  // STATIC DATA (MANAGER REVIEW)
  const tableData = [
  {
    id: "MR-001",
    client: "GreenFields Pvt Ltd",
    project: "Retail Store Branding",
    product: "Retail Signage",
    address: "24, High Street, Andheri West",
    city: "Mumbai",
    visitTime: "2025-01-15T10:30:00",
    priority: "High",
    status: "Approved By Manager",
    siteLocation: "19.1197, 72.8468",
    recceExecutive: "Amit Patel",
    submissionDate: "2025-01-15T14:15:00",
    feedback: [
      {
        date: "15 Jan 2025",
        status: "Submitted to Manager",
        designation: "Amit Patel – Sales Executive",
        feedback: "Recce details submitted for managerial review.",
      },
      {
        date: "16 Jan 2025",
        status: "Approved By Manager",
        designation: "Neha Kapoor – Project Manager",
        feedback:
          "Recce approved. Proceed with quotation and execution planning.",
      },
    ],
  },

  {
    id: "MR-002",
    client: "AgroMart",
    project: "Mall Facade Signage",
    product: "Facade Branding",
    address: "Sector 18, Noida",
    city: "Noida",
    visitTime: "2025-01-16T11:00:00",
    priority: "Medium",
    status: "Modification Required",
    siteLocation: "",
    recceExecutive: "Rahul Verma",
    submissionDate: "2025-01-16T15:30:00",
    feedback: [
      {
        date: "16 Jan 2025",
        status: "Submitted to Manager",
        designation: "Rahul Verma – Sales Executive",
        feedback: "Recce report shared for approval.",
      },
      {
        date: "17 Jan 2025",
        status: "Modification Required",
        designation: "Sanjay Mehta – Project Manager",
        feedback:
          "Manager has requested changes in measurements and updated site photos.",
      },
    ],
  },

  {
    id: "MR-003",
    client: "FreshStore",
    project: "Office Branding",
    product: "Office Graphics",
    address: "MG Road",
    city: "Bengaluru",
    visitTime: "2025-01-17T09:45:00",
    priority: "Low",
    status: "Rejected",
    siteLocation: "12.9716, 77.5946",    recceExecutive: "Vikram Singh",
    submissionDate: "2025-01-17T14:30:00",    feedback: [
      {
        date: "17 Jan 2025",
        status: "Submitted to Manager",
        designation: "Suresh Iyer – Sales Executive",
        feedback: "Recce details sent for final confirmation.",
      },
      {
        date: "18 Jan 2025",
        status: "Rejected",
        designation: "Rohit Malhotra – Project Manager",
        feedback:
          "Rejected due to incomplete site details and unclear branding scope.",
      },
    ],
  },
  {
    id: "MR-004",
    client: "TechCorp Solutions",
    project: "Corporate Office Signage",
    product: "Corporate Branding",
    address: "Hinjewadi IT Park, Phase 2",
    city: "Pune",
    visitTime: "2025-01-18T10:00:00",
    priority: "High",
    status: "New",
    siteLocation: "18.5912, 73.7389",
    recceExecutive: "Rajesh Kumar",
    submissionDate: "2025-01-18T16:45:00",
    feedback: [
      {
        date: "18 Jan 2025",
        status: "Submitted to Manager",
        designation: "Rajesh Kumar – Recce Executive",
        feedback: "Recce completed and submitted for manager review.",
      },
    ],
  },
  {
    id: "MR-005",
    client: "Metro Retail",
    project: "Store Front Display",
    product: "Retail Signage",
    address: "T Nagar Main Road",
    city: "Chennai",
    visitTime: "2025-01-19T11:30:00",
    priority: "Medium",
    status: "New",
    siteLocation: "13.0418, 80.2341",
    recceExecutive: "Priya Sharma",
    submissionDate: "2025-01-19T15:20:00",
    feedback: [
      {
        date: "19 Jan 2025",
        status: "Submitted to Manager",
        designation: "Priya Sharma – Recce Executive",
        feedback: "Site survey completed and submitted for approval.",
      },
    ],
  },
];


  const unique = (arr) => [...new Set(arr.filter(Boolean))];
  const uniqueLocations = unique(tableData.map((i) => i.city));
  const uniquePriorities = unique(tableData.map((i) => i.priority));

  const filteredData = useMemo(() => {
    let data = [...tableData];

    if (selectedDate) {
      data = data.filter((item) => {
        const d = new Date(item.visitTime).toISOString().split("T")[0];
        return d === selectedDate;
      });
    }

    if (selectedPriority) {
      data = data.filter((item) => item.priority === selectedPriority);
    }

    if (selectedLocation) {
      data = data.filter((item) => item.city === selectedLocation);
    }

    return data;
  }, [selectedDate, selectedPriority, selectedLocation]);

  useEffect(() => {
    const handleClickOutside = () => {};
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleView = (row) => {
    navigate(`/recce/review-submit/${row.id}`, {
      state: { recce: row, from: "recce-review-manager" },
    });
  };

  const columnConfig = {
    actions: {
      label: "Actions",
      render: (_, row) => (
        <div className="flex items-center justify-center gap-2">
          {/* View always */}
          <button
            onClick={() => handleView(row)}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          {/* Feedback button */}
          <button
            onClick={() => {
              setFeedbackData(row.feedback || []);
              setIsFeedbackOpen(true);
            }}
            className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            title="View Feedback"
          >
            <MessageSquare size={16} />
          </button>
        </div>
      ),
    },
    status: {
      label: "Status",
      render: (value) => {
        if (value === "Approved By Manager") {
          return (
            <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-green-50 text-green-700 border-green-200">
              Approved By Manager
            </span>
          );
        }

        if (value === "Modification Required") {
          return (
            <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-yellow-50 text-yellow-700 border-yellow-200">
              Modification Required
            </span>
          );
        }

        if (value === "Rejected") {
          return (
            <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-red-50 text-red-700 border-red-200">
              Rejected
            </span>
          );
        }

        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-blue-50 text-blue-700 border-blue-200">
            {value || "Pending"}
          </span>
        );
      },
    },
    priority: {
      label: "Priority",
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${
            value === "High"
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
    product: {
      label: "Product Name",
      render: (value) => (
        <span className="text-sm  text-gray-800">{value || "—"}</span>
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
  };

  // Add manager-specific columns
  if (normalizedRole === "manager") {
    columnConfig.recceExecutive = {
      label: "Recce Executive",
      render: (value) => (
        <span className="text-sm font-medium text-gray-800">{value || "—"}</span>
      ),
    };
    columnConfig.submissionDate = {
      label: "Submission Date",
      render: (value) =>
        value
          ? new Date(value).toLocaleString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "—",
    };
  }

  return (
    <div className="min-h-screen">

        <DesignSimpleHeader title={headerTitle}  />
 <div className="flex justify-center my-4">
        <SelfTeamToggle value={viewType} onChange={(val) => setViewType(val)} />
      </div>
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
              className="appearance-none pl-10 pr-8 py-2 border rounded-md text-sm bg-white"
            />
          </div>

          <div className="relative">
            <Flag className="absolute left-3 top-2.5 text-gray-500" size={16} />
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="appearance-none pl-10 pr-8 py-2 border rounded-md text-sm bg-white"
            >
              <option value="">Priority</option>
              {uniquePriorities.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
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
              className="appearance-none pl-10 pr-8 py-2 border rounded-md text-sm bg-white"
            >
              <option value="">Location</option>
              {uniqueLocations.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>

          <button
            onClick={() => {
              setSelectedDate("");
              setSelectedPriority("");
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
        <Table data={filteredData} columnConfig={columnConfig} />
      </div>

      <FeedbackModal
  isOpen={isFeedbackOpen}
  onClose={() => setIsFeedbackOpen(false)}
  data={feedbackData}
/>
    </div>
  );
};

export default RecceReviewManager;
