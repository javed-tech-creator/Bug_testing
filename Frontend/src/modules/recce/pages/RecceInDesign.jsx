import React, { useState, useMemo, useEffect } from "react";
import {
  Eye,
  Calendar,
  MapPin,
  ChevronDown,
  X,
  Flag,
  Send,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Table from "../../../components/Table";
import PageHeader from "../../../components/PageHeader";
import DesignSimpleHeader from "@/modules/design/components/designs/DesignSimpleHeader";

const RecceInDesign = () => {
  const navigate = useNavigate();

  // FILTER STATES
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState("");

  // STATIC DATA (MANAGER REVIEW)
  const tableData = [
    {
      id: "MR-001",
      client: "GreenFields Pvt Ltd",
      project: "Retail Store Branding",
      address: "24, High Street, Andheri West",
      city: "Mumbai",
      visitTime: "2025-01-15T10:30:00",
      priority: "High",
      status: "Submitted to Design",
      siteLocation: "19.1197, 72.8468",
      totalProduct: 10,
      completed: 10,
      pending: 0,
      submittedBy: "Ravi Kumar",
    },
    {
      id: "MR-002",
      client: "AgroMart",
      project: "Mall Facade Signage",
      address: "Sector 18, Noida",
      city: "Noida",
      visitTime: "2025-01-16T11:00:00",
      priority: "Medium",
      status: "Submitted to Design",
      feedback:
        "Manager has requested changes in measurements and site photos.",
      siteLocation: "",
      totalProduct: 8,
      completed: 5,
      pending: 3,
      submittedBy: "Anita Singh",
    },
    {
      id: "MR-003",
      client: "FreshStore",
      project: "Office Branding",
      address: "MG Road",
      city: "Bengaluru",
      visitTime: "2025-01-17T09:45:00",
      priority: "Low",
      status: "Submitted to Design",
      siteLocation: "12.9716, 77.5946",
      totalProduct: 6,
      completed: 6,
      pending: 0,
      submittedBy: "Suresh Reddy",
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
    navigate(`/recce/send-to-manager`, {
      state: { recce: row },
    });
  };

  const columnConfig = {
    actions: {
      label: "Actions",
      render: (_, row) => {
        const total = row.totalProduct;
        const completed = row.completed;

        return (
          <div className="flex items-center justify-center gap-2">
            {/* View always */}
            <button
              onClick={() => handleView(row)}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              title="View Details"
            >
              <Eye size={16} />
            </button>

            {/* Show Send button only when total === completed */}
            {total === completed && (
              <button
               onClick={() => handleView(row)}
          
                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                title="Send"
              >
                <Send size={16} />
              </button>
            )}
          </div>
        );
      },
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
     submittedBy: { label: "Submitted By" },
    feedback: {
      label: "Feedback",
      render: (_, row) => (
        <button
          onClick={() => {
            setSelectedFeedback(row.feedback || "No feedback provided.");
            setIsFeedbackOpen(true);
          }}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
          title="View Feedback"
        >
          <Eye size={16} />
        </button>
      ),
    },
    client: { label: "Client" },
    project: { label: "Project" },
    address: {
      label: "Address",
      render: (_, row) => {
        const url = row.siteLocation
          ? `https://www.google.com/maps?q=${row.siteLocation}`
          : `https://www.google.com/maps?q=${encodeURIComponent(
              row.address + " " + row.city,
            )}`;
        return (
          <button
            onClick={() => window.open(url, "_blank")}
            className="text-blue-600 underline hover:text-blue-700 text-sm cursor-pointer transition-colors"
            title="Open in Google Maps"
          >
            {row.address}
          </button>
        );
      },
    },

    // visitTime: {
    //   label: "Visit Time",
    //   render: (v) =>
    //     new Date(v).toLocaleString("en-GB", {
    //       day: "2-digit",
    //       month: "short",
    //       year: "numeric",
    //       hour: "2-digit",
    //       minute: "2-digit",
    //     }),
    // },


    totalProduct: {
      label: "Total Product",
      render: (value) => (
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
          {value}
        </span>
      ),
    },

    pending: {
      label: "Pending",
      render: (value) => (
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-yellow-100 text-yellow-700 font-semibold text-sm">
          {value}
        </span>
      ),
    },

    completed: {
      label: "Completed",
      render: (value) => (
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-green-100 text-green-700 font-semibold text-sm">
          {value}
        </span>
      ),
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
             <DesignSimpleHeader title="Recce in Design"  />
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

      {isFeedbackOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg w-full max-w-md p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-800">
                Modification Required – Reason
              </h3>
              <button
                onClick={() => setIsFeedbackOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="text-sm text-gray-700 whitespace-pre-wrap">
              {selectedFeedback}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setIsFeedbackOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecceInDesign;
