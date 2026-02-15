import React, { useState, useEffect } from "react";
import Table from "@/components/Table";
import FilterBar from "../../components/FilterBar";
import { Lightbulb, ArrowLeft, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UploadStatusIcon from "../../components/UploadStatusIcon";
import UploadFormModal from "../../components/UploadFormModal";
import { toast } from "react-toastify";

// Utility to format date in 12hr format with date
function formatDateTime12hr(dateString) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (isNaN(date)) return dateString;
  const options = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return date.toLocaleString("en-US", options);
}

const TodaysPR = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    date: null,
    priority: [],
    status: [],
    category: [],
  });
  const [filteredData, setFilteredData] = useState([]);
  const [uploadModal, setUploadModal] = useState({
    isOpen: false,
    prId: null,
  });
  
  // Track upload status for each PR
  const [uploadStatuses, setUploadStatuses] = useState({});

  // Sample data - Replace with API call
  const data = [
    {
      id: 1,
      clientName: "GreenFields Co.",
      productName: "LED Signage Board",
      category: "signage",
      assignedDate: "11 Nov 25, 10:30AM",
      priorityT: "High",
      priorityN: "High (1)",
      priority: "high",
      status: "pending",
      deadline: "11 Nov 25, 11:30AM",
      createdAt: "2025-11-11T10:30:00",
      uploadStatus: "not_started", 
    },
    {
      id: 2,
      clientName: "AgriMart",
      productName: "Acrylic Display Stand",
      category: "display",
      assignedDate: "11 Nov 25, 10:30AM",
      priorityT: "High",
      priorityN: "High (2)",
      priority: "high",
      status: "in_progress",
      deadline: "11 Nov 25, 11:30AM",
      createdAt: "2025-11-11T10:30:00",
      uploadStatus: "not_started",
    },
    {
      id: 3,
      clientName: "SunHarvest",
      productName: "Metal Letter Branding",
      category: "branding",
      assignedDate: "11 Nov 25, 10:30AM",
      priorityT: "Medium",
      priorityN: "Medium (3)",
      priority: "medium",
      status: "pending",
      deadline: "11 Nov 25, 11:30AM",
      createdAt: "2025-11-11T10:30:00",
      uploadStatus: "not_started",
    },
    {
      id: 4,
      clientName: "FreshStore",
      productName: "Flex Banner",
      category: "printing",
      assignedDate: "10 Nov 25, 10:30AM",
      priorityT: "Medium",
      priorityN: "Medium (4)",
      priority: "medium",
      status: "completed",
      deadline: "11 Nov 25, 11:30AM",
      createdAt: "2025-11-10T10:30:00",
      uploadStatus: "uploaded",
    },
    {
      id: 5,
      clientName: "SunHarvest",
      productName: "Glass Door Sticker",
      category: "vinyl_work",
      assignedDate: "09 Nov 25, 10:30AM",
      priorityT: "Low",
      priorityN: "Low (5)",
      priority: "low",
      status: "on_hold",
      deadline: "11 Nov 25, 11:30AM",
      createdAt: "2025-11-09T10:30:00",
      uploadStatus: "not_started",
    },
    {
      id: 6,
      clientName: "AgroHub",
      productName: "Neon Sign Box",
      category: "signage",
      assignedDate: "08 Nov 25, 10:30AM",
      priorityT: "Low",
      priorityN: "Low (6)",
      priority: "low",
      status: "pending",
      deadline: "11 Nov 25, 11:30AM",
      createdAt: "2025-11-08T10:30:00",
      uploadStatus: "started",
    },
  ];

  // Log 12hr time only when view icon is clicked
  const logPRTimes = (row) => {
    console.log(`PR #${row.id} Assigned:`, formatDateTime12hr(row.createdAt), '| Deadline:', formatDateTime12hr(row.deadline));
  };

  // Filter data based on selected filters
  useEffect(() => {
    let result = [...data];

    // Filter by date
    if (filters.date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      result = result.filter((item) => {
        const itemDate = new Date(item.createdAt);
        itemDate.setHours(0, 0, 0, 0);

        switch (filters.date) {
          case "today":
            return itemDate.getTime() === today.getTime();
          case "yesterday":
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            return itemDate.getTime() === yesterday.getTime();
          case "last_7_days":
            const last7Days = new Date(today);
            last7Days.setDate(last7Days.getDate() - 7);
            return itemDate >= last7Days;
          case "last_30_days":
            const last30Days = new Date(today);
            last30Days.setDate(last30Days.getDate() - 30);
            return itemDate >= last30Days;
          case "this_month":
            return (
              itemDate.getMonth() === today.getMonth() &&
              itemDate.getFullYear() === today.getFullYear()
            );
          case "last_month":
            const lastMonth = new Date(today);
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            return (
              itemDate.getMonth() === lastMonth.getMonth() &&
              itemDate.getFullYear() === lastMonth.getFullYear()
            );
          default:
            return true;
        }
      });
    }

    // Filter by priority
    if (filters.priority.length > 0) {
      result = result.filter((item) =>
        filters.priority.includes(item.priority),
      );
    }

    // Filter by status
    if (filters.status.length > 0) {
      result = result.filter((item) => filters.status.includes(item.status));
    }

    // Filter by category
    if (filters.category.length > 0) {
      result = result.filter((item) =>
        filters.category.includes(item.category),
      );
    }

    setFilteredData(result);
  }, [filters]);

  // Initialize with all data
  useEffect(() => {
    setFilteredData(data);
    
    // Initialize upload statuses from data
    const initialStatuses = {};
    data.forEach(item => {
      initialStatuses[item.id] = item.uploadStatus || "not_started";
    });
    setUploadStatuses(initialStatuses);
  }, []);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Handle upload icon click
  const handleUploadClick = (prId, currentStatus) => {
    if (currentStatus === "uploaded") {
      // Already uploaded, do nothing
      return;
    }

    if (currentStatus === "not_started") {
      // Start the process - save start time and update status
      const startTime = new Date().toISOString();
      
      // Update status to "started"
      setUploadStatuses(prev => ({
        ...prev,
        [prId]: "started"
      }));

      // Save start time (in real app, send to API)
      console.log(`PR ${prId} started at:`, startTime);
      
      // Store in localStorage as example
      localStorage.setItem(`pr_${prId}_start_time`, startTime);
      
      toast.info("Upload process started. Click again to upload files.");
      
    } else if (currentStatus === "started") {
      // Open upload modal
      setUploadModal({
        isOpen: true,
        prId: prId,
      });
    }
  };

  // Handle upload submit
  const handleUploadSubmit = async (uploadData) => {
    try {
      // In real app, send to API with FormData
      const formData = new FormData();
      formData.append("prId", uploadData.prId);
      formData.append("pdfFile", uploadData.pdfFile);
      formData.append("autocadFile", uploadData.autocadFile);
      formData.append("submissionTime", uploadData.submissionTime);
      
      // Get start time
      const startTime = localStorage.getItem(`pr_${uploadData.prId}_start_time`);
      if (startTime) {
        formData.append("startTime", startTime);
      }

      // Simulate API call
      console.log("Uploading files for PR:", uploadData.prId);
      console.log("PDF File:", uploadData.pdfFile.name);
      console.log("AutoCAD File:", uploadData.autocadFile.name);
      console.log("Start Time:", startTime);
      console.log("Submission Time:", uploadData.submissionTime);

      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update status to uploaded
      setUploadStatuses(prev => ({
        ...prev,
        [uploadData.prId]: "uploaded"
      }));

      // In real app: await fetch('/api/pr-upload', { method: 'POST', body: formData });

    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const columnConfig = {
    actions: {
      label: "Actions",
      render: (_val, row) => (
        <div className="flex gap-2">
          <button
            title="View"
            onClick={() => {
              logPRTimes(row);
              navigate(`/pr/pr-detail/${row.id}`, { state: { readonly: true } });
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-md transition-colors cursor-pointer"
          >
            <Eye size={16} />
          </button>
          <UploadStatusIcon
            status={uploadStatuses[row.id] || row.uploadStatus || "not_started"}
            onClick={() => handleUploadClick(row.id, uploadStatuses[row.id] || row.uploadStatus || "not_started")}
          />
        </div>
      ),
    },
    status: {
      label: "Status",
      render: (val) => {
        const statusStyles = {
          pending: "border-orange-100 bg-orange-50 text-orange-400",
          in_progress: "border-blue-100 bg-blue-50 text-blue-400",
          completed: "border-green-100 bg-green-50 text-green-400",
          on_hold: "border-yellow-100 bg-yellow-50 text-yellow-600",
          cancelled: "border-red-100 bg-red-50 text-red-400",
        };
        return (
          <span
            className={`px-4 py-1 rounded border text-xs font-medium capitalize ${statusStyles[val] || statusStyles.pending}`}
          >
            {val.replace("_", " ")}
          </span>
        );
      },
    },
    clientName: { label: "Client Name" },
    productName: { label: "Product Name" },
    category: {
      label: "Category",
      render: (val) => (
        <span className="capitalize">{val.replace("_", " ")}</span>
      ),
    },
    assignedDate: {
      label: "Assigned Date",
      render: (val, row) => (
        <span>{formatDateTime12hr(row.createdAt)}</span>
      ),
    },
    deadline: {
      label: "Deadline",
      render: (val, row) => (
        <span>{formatDateTime12hr(row.deadline)}</span>
      ),
    },
    priorityT: {
      label: "Priority (T)",
      render: (val) => {
        const styles = {
          High: "bg-red-50 text-red-500 border-red-100",
          Medium: "bg-orange-50 text-orange-400 border-orange-100",
          Low: "bg-green-50 text-green-500 border-green-100",
        };
        return (
          <span
            className={`px-4 py-1 rounded border text-xs font-medium ${styles[val]}`}
          >
            {val}
          </span>
        );
      },
    },
    priorityN: {
      label: "Priority (N)",
      render: (val) => {
        const basePriority = val.split(" ")[0];
        const styles = {
          High: "bg-red-50 text-red-500 border-red-100",
          Medium: "bg-orange-50 text-orange-400 border-orange-100",
          Low: "bg-green-50 text-green-500 border-green-100",
        };
        return (
          <span
            className={`px-4 py-1 rounded border text-xs font-medium ${styles[basePriority]}`}
          >
            {val}
          </span>
        );
      },
    },
  };

  return (
    <div className="">
      {/* Header with Search and Navigation */}
      <div className="flex flex-wrap items-center justify-between mb-6 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div
            onClick={() => navigate(-1)}
            className="p-2 border rounded-md bg-gray-50 cursor-pointer hover:bg-gray-100 shadow-sm transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-gray-800" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">
            Today's PRs (Product Requests)
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* PSL Button */}
          <button
            title="PSL"
            className="flex items-center justify-center px-3 py-2 border bg-blue-600 rounded-md text-white hover:bg-blue-700 transition-all cursor-pointer"
            onClick={() => navigate("/pr/psl")}
          >
            <Lightbulb className="w-4 h-4" />
          </button>

          {/* Filter Bar Component */}
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            showCategory={true}
          />
        </div>
      </div>

      {/* Main Table Container */}
      <Table data={filteredData} columnConfig={columnConfig} />

      {/* Upload Form Modal */}
      <UploadFormModal
        isOpen={uploadModal.isOpen}
        onClose={() => setUploadModal({ isOpen: false, prId: null })}
        onSubmit={handleUploadSubmit}
        prId={uploadModal.prId}
      />
    </div>
  );
};

export default TodaysPR;