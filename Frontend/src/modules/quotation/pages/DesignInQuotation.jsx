import React, { useState, useMemo, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import {
  Eye,
  X,
  Check,
  Calendar,
  Flag,
  MapPin,
  ChevronDown,
  AlertCircle,
  CheckCircle,
  UserCheck,
  ArrowLeft,
  Lightbulb
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Table from "../../../components/Table";

import AssignedRecceModal from "@/modules/recce/components/AssignedRecceModal";

import DesignSimpleHeader from "@/modules/design/components/designs/DesignSimpleHeader";

const DesignInQuotation = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const res = useSelector((state) => state.auth.userData);
  const user = res?.user || {};
  const role = user?.designation?.title?.toLowerCase();

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

  const [allData, setAllData] = useState([]);
  const [notification, setNotification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecce, setSelectedRecce] = useState(null);



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
        approvalStatus: "New",
        productCount: 4,
      },
      {
        _id: "2",
        clientName: "XYZ Builders",
        clientCity: "Delhi",
        projectName: "Residential Tower",
        address: "Dwarka Sector 21, Delhi",
        createdAt: "2025-01-17T14:00:00Z",
        priority: "Medium",
        approvalStatus: "New",
        productCount: 6,
      },
      {
        _id: "3",
        clientName: "Sunrise Infra",
        clientCity: "Bangalore",
        projectName: "Warehouse Setup",
        address: "Whitefield, Bangalore",
        createdAt: "2025-01-16T09:15:00Z",
        priority: "Low",
        approvalStatus: "New",
        productCount: 2,
      },
    ];

    setAllData(staticData);
  }, []);

  // 2. Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);

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

  // 3. Filter Logic (Runs whenever filters or data change)
  const filteredData = useMemo(() => {
    return allData.filter((item) => {
      // Search Logic (Client, Project, or City)
      const matchesSearch =
        item.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.projectName.toLowerCase().includes(searchTerm.toLowerCase());

      // Priority Filter
      const matchesPriority =
        selectedPriority === "" || item.priority === selectedPriority;

      // Location Filter (City)
      const matchesLocation =
        selectedLocation === "" || item.clientCity === selectedLocation;

      // Date Filter (Simple YYYY-MM-DD match)
      const itemDate = item?.createdAt?.split("T")[0];
      const matchesDate = selectedDate === "" || itemDate === selectedDate;

      return matchesSearch && matchesPriority && matchesLocation && matchesDate;
    });
  }, [allData, searchTerm, selectedPriority, selectedLocation, selectedDate]);

  // 4. Show Notification
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // 5. Handlers
  const handleStatusUpdate = (id, status) => {
    // Update the status in local state
    setAllData((prevData) =>
      prevData.map((item) =>
        item._id === id ? { ...item, approvalStatus: status } : item,
      ),
    );

    // Store in localStorage for persistence
    try {
      localStorage.setItem(`recceApprovalStatus:${id}`, status);
    } catch {}

    // Show notification
    setNotification({
      message: `Recce ${status}`,
      type: status === "Accepted" ? "success" : "error",
    });

    // Optionally redirect to detail page after brief delay
    setTimeout(() => {
      navigate(`/recce/assigned-recce-details/${id}`, {
        state: { approvalStatus: status },
      });
    }, 500);
  };

  const handleViewDetails = (id) => {
    navigate(`/recce/sales-in-recce-details/${id}`);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedDate("");
    setSelectedPriority("");
    setSelectedLocation("");
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

  const handleAssignRecce = (item) => {
    // normalize data to match AssignedRecce modal expectations
    setSelectedRecce({
      ...item,
      _id: item._id || item.id,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecce(null);
  };
  // 5. Column Config for your Dynamic Table
  const columnConfig = {
    actions: {
      label: "Actions",
      render: (_, row) => (
        <div className="flex items-center justify-center gap-2">
          {/* View Button */}
          <button
            onClick={() => navigate(`/quotation/quotation-detail/${row._id}`)}
            className="w-8 h-8 flex items-center justify-center rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
            title="View"
          >
            <Eye size={16} strokeWidth={2.5} />
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
          {row.approvalStatus}
        </span>
      ),
    },
    client: {
      label: "Client",
      render: (_, row) => (
        <span className="font-medium text-gray-900">{row.clientName}</span>
      ),
    },
    project: {
      label: "Project",
      render: (_, row) => (
        <span className="text-gray-700">{row.projectName}</span>
      ),
    },
    productCount: {
      label: "Product Count",
      render: (_, row) => (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
          {row.productCount ?? 0}
        </span>
      ),
    },
    fullAddress: {
      label: "Full Address",
      render: (_, row) => (
        <span className="text-gray-800 font-medium">{row.address}</span>
      ),
    },
    visitTime: {
      label: "Visit Time",
      render: (_, row) => (
        <span className="text-gray-700 whitespace-nowrap">
          {row?.createdAt ? formatDateTime(row.createdAt) : "-"}
        </span>
      ),
    },
    priority: {
      label: "Priority",
      render: (value) => {
        // Priority styling with better visibility
        const styleMap = {
          High: "bg-red-500 text-white border-red-600", // Solid red
          Medium: "bg-orange-500 text-white border-orange-600", // Solid orange
          Low: "bg-green-500 text-white border-green-600", // Solid green
        };
        console.log("Priority Value:", value); // Debug log
        return (
          <div className="flex justify-start">
            {/* <span
              className={`px-3 py-1 rounded-md text-sm font-semibold border shadow-sm ${
                styleMap[value] || "bg-gray-500 text-white border-gray-600"
              }`}
            > */}
            {value}
            {/* </span> */}
          </div>
        );
      },
    },
  };

  return (
    <div className="">
       {/* Header */}
<div className="flex flex-wrap items-center justify-between mb-6 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
  <div className="flex items-center gap-4">
    {/* Back Button */}
    <div
      onClick={() => navigate(-1)}
      className="p-2 border rounded-md bg-gray-50 cursor-pointer hover:bg-gray-100 shadow-sm transition-all"
    >
      <ArrowLeft className="w-5 h-5 text-gray-800" />
    </div>

    {/* Title */}
    <h1 className="text-xl font-bold text-gray-800">
      Design In Quotation
    </h1>
  </div>

  {/* Right Actions */}
  <div className="flex flex-wrap items-center gap-3">
    {/* PSL Button */}
   

    {["Date", "Priority", "Status"].map((f) => (
      <button
        key={f}
        className="flex items-center gap-2 px-4 py-2 border bg-white rounded-md text-sm text-gray-600 hover:shadow-sm transition-all"
      >
        {f}
        <ChevronDown className="w-4 h-4" />
      </button>
    ))}
  </div>
</div>


      {/* Dynamic Table */}
      <Table data={filteredData} columnConfig={columnConfig} />

      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg flex items-center gap-3 animate-slideIn ${
            notification.type === "success"
              ? "bg-green-100 text-green-800 border border-green-300"
              : "bg-red-100 text-red-800 border border-red-300"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}
      <AssignedRecceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        recceData={selectedRecce}
      />
    </div>
  );
};

export default DesignInQuotation;
