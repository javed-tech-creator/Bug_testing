import React, { useState, useMemo, useEffect, Fragment } from "react";
import {
  Eye,
  Calendar,
  MapPin,
  ChevronDown,
  X,
  Flag,
  Send,
  Edit,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Table from "../../../components/Table";
import FeedbackModal from "../../quotation/components/FeedbackModal";
import DesignSimpleHeader from "@/modules/design/components/designs/DesignSimpleHeader";


const RecceReviewClient = () => {
  const navigate = useNavigate();

  // FILTER STATES
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  // FEEDBACK MODAL STATE
 const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
const [feedbackData, setFeedbackData] = useState([]);


  // STATIC DATA (CLIENT REVIEW)
 const tableData = [
  {
    id: "CR-001",
    client: "GreenFields Pvt Ltd",
    project: "Retail Store Branding",
    product: "Retail Signage",
    address: "24, High Street, Andheri West",
    city: "Mumbai",
    visitTime: "2025-01-15T10:30:00",
    priority: "High",
    status: "Approved",
    siteLocation: "19.1197, 72.8468",
    feedback: [
      {
        date: "15 Jan 2025",
        status: "Submitted to Manager",
        designation: "Amit Patel – Sales Executive",
        feedback: "Recce report submitted for approval.",
      },
      {
        date: "16 Jan 2025",
        status: "Approved",
        designation: "Neha Kapoor – Sales Manager",
        feedback:
          "Recce approved. Proceed with quotation and execution planning.",
      },
    ],
  },

  {
    id: "CR-002",
    client: "AgroMart",
    project: "Mall Facade Signage",
    product: "Facade Branding",
    address: "Sector 18, Noida",
    city: "Noida",
    visitTime: "2025-01-16T11:00:00",
    priority: "Medium",
    status: "Modify Needed",
    siteLocation: "",
    feedback: [
      {
        date: "16 Jan 2025",
        status: "Submitted to Manager",
        designation: "Rahul Verma – Sales Executive",
        feedback: "Initial recce shared with client for review.",
      },
      {
        date: "17 Jan 2025",
        status: "Modify Needed",
        designation: "Anita Sharma – Client Manager",
        feedback:
          "Material quality to be changed and logo size alignment required.",
      },
    ],
  },

  {
    id: "CR-003",
    client: "FreshStore",
    project: "Office Branding",
    product: "Office Graphics",
    address: "MG Road",
    city: "Bengaluru",
    visitTime: "2025-01-17T09:45:00",
    priority: "Low",
    status: "Rejected",
    siteLocation: "12.9716, 77.5946",
    feedback: [
      {
        date: "17 Jan 2025",
        status: "Submitted to Manager",
        designation: "Suresh Iyer – Sales Executive",
        feedback: "Recce submitted for final client confirmation.",
      },
      {
        date: "18 Jan 2025",
        status: "Rejected",
        designation: "Client Head – Operations",
        feedback:
          "Client rejected due to budget constraints and timeline mismatch.",
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
  }, [selectedDate, selectedPriority, selectedLocation, tableData]);

  useEffect(() => {
    const handleClickOutside = () => {};
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleView = (row) => {
    navigate(`/recce/report/${row.id}`, {
      state: { recce: row, source: "client-review" },
    });
  };

  const handleAction = (row) => {
    const status = (row?.status || "").toLowerCase();

    if (status === "approved") {
      navigate(`/recce/review-submit/${row.id}`, {
        state: { rowData: row, from: "client-review" },
      });
      return;
    }

    if (status === "modify needed" || status === "modify") {
      navigate("/recce/product-requirements", {
        state: { rowData: row, from: "client-review" },
      });
      return;
    }

    // Rejected/Declined: no action
  };

  const columnConfig = {
   actions: {
  label: "Actions",
  render: (_, row) => {
    const status = (row?.status || "").toLowerCase();
    const isDeclined = status === "rejected" || status === "declined";
    const isApproved = status === "approved";

    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() =>
            navigate(`/recce/report/${row.id}`, {
              state: { rowData: row, from: "client-review" },
            })
          }
          className="p-2 bg-blue-600 text-white rounded-lg"
          title="View"
        >
          <Eye size={16} />
        </button>
        <button
          onClick={() => {
            if (!isDeclined) {
              handleAction(row);
            }
          }}
          disabled={isDeclined}
          className={`p-2 rounded-lg ${
            isDeclined
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : isApproved
                ? "bg-green-600 text-white"
                : "bg-yellow-500 text-white"
          }`}
          title={
            isDeclined
              ? "No action available"
              : isApproved
                ? "Send to manager"
                : "Edit requirements"
          }
        >
          {isApproved ? <Send size={16} /> : <Edit size={16} />}
        </button>
      </div>
    );
  },
},

    status: {
      label: "Status",
      render: (value) => {
        if (value === "Approved") {
          return (
            <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-green-50 text-green-700 border-green-200">
              Approved
            </span>
          );
        }

        if (value === "Modify Needed") {
          return (
            <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-yellow-50 text-yellow-700 border-yellow-200">
              Modify Needed
            </span>
          );
        }

        if (value === "Rejected") {
          return (
            <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-red-50 text-red-700 border-red-200">
              Declined
            </span>
          );
        }

        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-blue-50 text-blue-700 border-blue-200">
            {value || "Pending Client Review"}
          </span>
        );
      },
    },
  feedback: {
  label: "Feedback",
  render: (_, row) => {
    return (
      <button
        onClick={() => {
          setFeedbackData(row.feedback || []);
          setIsFeedbackOpen(true);
        }}
        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        title="View Feedback"
      >
        <Eye size={16} />
      </button>
    );
  },
},

    client: { label: "Client" },
    project: { label: "Project" },
    product: {
      label: "Product Name",
      render: (value) => (
        <span className="text-sm text-gray-800">{value || "—"}</span>
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
  };

  return (
    <div className="min-h-screen">
      
        <DesignSimpleHeader title="Recce Review (Client)"  />

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

export default RecceReviewClient;
