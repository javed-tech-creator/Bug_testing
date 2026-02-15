import React, { useState } from "react";
import {
  Search,
  Upload,
  Check,
  X,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  useGetLeavesByCityQuery,
  useApproveLeaveMutation,
  useRejectLeaveMutation,
} from "@/api/hr/leave.api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import PageHeader from "@/components/PageHeader";
import ApplyLeaveModal from "./components/ApplyLeaveModal";
import { useSelector } from "react-redux";
import Table from "@/components/Table";
const LeaveLogs = () => {
  // 🔹 RTK Query Hooks

  const userData = useSelector((state) => state.auth.userData);
  console.log(userData);
  const cityId = userData?.user?.city?._id;
  console.log("CITY ID:", cityId);
  const { data, isLoading, isError } = useGetLeavesByCityQuery(
    { id: cityId },
    { skip: !cityId }
  );
  const [approveLeave] = useApproveLeaveMutation();
  const [rejectLeave] = useRejectLeaveMutation();

  const leaveData = data?.data || [];

  // 🔹 Current month/year defaults
  const currentMonth = new Date().toLocaleString("en-US", { month: "long" });
  const currentYear = new Date().getFullYear().toString();

  // 🔹 Unique years from data for dropdown
  const uniqueYears = Array.from(
    new Set(leaveData.map((leave) => new Date(leave.createdAt).getFullYear()))
  ).sort((a, b) => b - a);

  // 🔹 Component State
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showEntries, setShowEntries] = useState(10);
  const [openModal, setOpenModal] = useState(false);

  // 🔹 Filter options
  const departments = [
    "All",
    ...Array.from(
      new Set(
        leaveData
          .map((leave) => leave?.employeeId?.departmentId?.title)
          .filter(Boolean)
      )
    ),
  ];
  const months = [
    "All",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // 🔹 Utility functions
  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "text-green-700 bg-green-100 border-green-200";
      case "Rejected":
        return "text-red-700 bg-red-100 border-red-200";
      case "Pending":
        return "text-yellow-700 bg-yellow-100 border-yellow-200";
      default:
        return "text-gray-700 bg-gray-100 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="w-4 h-4" />;
      case "Rejected":
        return <XCircle className="w-4 h-4" />;
      case "Pending":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "-";

  const calculateLeaveDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  // 🔹 Handlers
  const handleApprove = async (id) => {
    try {
      await approveLeave({ id }).unwrap();
      toast.success("Leave Approved ✅");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to approve leave");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectLeave({ id }).unwrap();
      toast.success("Leave Rejected ❌");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to reject leave");
    }
  };

  // 🔹 Filter Logic
  const filteredLeaves = leaveData.filter((leave) => {
    const empName = leave?.employeeId?.name?.toLowerCase() || "";
    const empId = leave?.employeeId?._id?.slice(-4).toLowerCase() || "";
    const dept = leave?.employeeId?.departmentId?.title?.toLowerCase() || "";
    const createdDate = new Date(leave?.createdAt);
    const year = createdDate.getFullYear().toString();
    const monthIndex = createdDate.getMonth(); // 0–11

    const matchesSearch =
      empName.includes(searchQuery.toLowerCase()) ||
      empId.includes(searchQuery.toLowerCase()) ||
      dept.includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      leave?.status?.toLowerCase() === statusFilter.toLowerCase();

    const matchesDepartment =
      departmentFilter === "all" || dept === departmentFilter.toLowerCase();

    const matchesYear = selectedYear === "all" || year === selectedYear;

    const matchesMonth =
      selectedMonth === "All" ||
      monthIndex === months.indexOf(selectedMonth) - 1;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesDepartment &&
      matchesYear &&
      matchesMonth
    );
  });

  // 🔹 Export to Excel
  const exportExcel = () => {
    // Export full data instead of filtered data
    const dataToExport = leaveData.map((leave) => ({
      ID: leave?.employeeId?._id?.slice(-4),
      Name: leave?.employeeId?.name,
      Department: leave?.employeeId?.departmentId?.title || "-",
      LeaveType: leave?.leaveType,
      StartDate: formatDate(leave?.startDate),
      EndDate: formatDate(leave?.endDate),
      Days: calculateLeaveDays(leave?.startDate, leave?.endDate),
      Status: leave?.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "LeaveLogs");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "LeaveLogs.xlsx");
  };

  // Table column configuration and data
  const columnConfig = {
    actions: {
      label: "Actions",
      render: (_, row) => (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => handleApprove(row?._id)}
            disabled={row?.status?.toLowerCase() !== "pending"}
            className={`p-2 rounded-lg transition-all duration-200 ${
              row?.status?.toLowerCase() !== "pending"
                ? "cursor-not-allowed hover:cursor-not-allowed pointer-events-none bg-gray-200 text-gray-400 opacity-60"
                : "cursor-pointer text-green-600 hover:bg-green-100 hover:scale-110 shadow-sm"
            }`}
            title={
              row?.status?.toLowerCase() !== "pending"
                ? "Action disabled"
                : "Approve"
            }
          >
            <Check className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleReject(row?._id)}
            disabled={row?.status?.toLowerCase() !== "pending"}
            className={`p-2 rounded-lg transition-all duration-200 ${
              row?.status?.toLowerCase() !== "pending"
                ? "cursor-not-allowed hover:cursor-not-allowed pointer-events-none bg-gray-200 text-gray-400 opacity-60"
                : "cursor-pointer text-red-600 hover:bg-red-100 hover:scale-110 shadow-sm"
            }`}
            title={
              row?.status?.toLowerCase() !== "pending"
                ? "Action disabled"
                : "Reject"
            }
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ),
    },
    status: {
      label: "Status",
      render: (value) => (
        <span
          title={value === "Approved" ? "Approved (Marked Absent in Attendance)" : value}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
            value === "Approved"
              ? "bg-green-100 text-green-700"
              : value === "Rejected"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {value}
        </span>
      ),
    },
    department: {
      label: "Department",
      render: (_, row) => row?.employeeId?.departmentId?.title || "--",
    },
    designation: {
      label: "Designation",
      render: (_, row) => row?.employeeId?.designationId?.title || "--",
    },
    leaveType: { label: "Type" },
    days: {
      label: "Days",
      render: (_, row) => calculateLeaveDays(row?.startDate, row?.endDate),
    },
    startDate: {
      label: "Start (Year)",
      render: (value) => new Date(value).getFullYear(),
    },
    endDate: {
      label: "End (Year)",
      render: (value) => new Date(value).getFullYear(),
    },
    reason: { label: "Reason" },
  };

  const tableData = filteredLeaves.map((leave) => ({
    ...leave,
    actions: "",
    status: leave.status,
    department: leave?.employeeId?.departmentId?.title,
    designation: leave?.employeeId?.designationId?.title,
    leaveType: leave.leaveType,
    days: calculateLeaveDays(leave.startDate, leave.endDate),
    startDate: leave.startDate,
    endDate: leave.endDate,
    reason: leave.reason || "--",
  }));

  // 🔹 Loading / Error States
  if (isLoading)
    return (
      <div className="p-6 text-center text-gray-500">Loading leaves...</div>
    );
  if (isError)
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load leave data.
      </div>
    );

  const Open = () => {
    setOpenModal(true);
  };

  // 🔹 Main UI
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 flex justify-between items-center">
          <PageHeader
            title="Employee Leave"
            btnTitle="Apply Leave"
            onClick={Open}
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-4 flex flex-wrap gap-3 items-center">
          {/* <input
            type="text"
            placeholder="Search employee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border px-3 py-2 rounded-lg w-48 text-sm"
          /> */}

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="border px-3 py-2 rounded-lg text-sm"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept.toLowerCase()}>
                {dept}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border px-3 py-2 rounded-lg text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border px-3 py-2 rounded-lg text-sm"
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border px-3 py-2 rounded-lg text-sm"
          >
            <option value="all">All Years</option>
            {uniqueYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <select
            value={showEntries}
            onChange={(e) => setShowEntries(Number(e.target.value))}
            className="border px-3 py-2 rounded-lg text-sm"
          >
            <option value="10">10 entries</option>
            <option value="20">20 entries</option>
            <option value="50">50 entries</option>
          </select>
          <button
            onClick={exportExcel}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span className="ml-2">Export</span>
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <Table data={tableData} columnConfig={columnConfig} />
        </div>
      </div>
      <ApplyLeaveModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        employeeId={"68cd4e25e7883dbddc164d2b"}
      />
    </div>
  );
};

export default LeaveLogs;
