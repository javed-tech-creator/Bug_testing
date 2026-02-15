import React, { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { Eye, ArrowLeft, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Table from "../../../components/Table";
import NextLogModal from "../components/NextLogModal";
import AssignedRecceModal from "../components/AssignedRecceModal";
import { useGetRecceAllNextDayPlanningQuery } from "@/api/recce/manager/next-day-planning/next-day-planning.api";
import { useGetRecceExeAllNextDayPlanningQuery } from "@/api/recce/executive/recce-exe-nextday/recce-exe-nextday.api";
const NextDayReccePlanning = () => {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState("10:30 AM");
  const [showPlanningLogModal, setShowPlanningLogModal] = useState(false);
  const [selectedRecce, setSelectedRecce] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

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

  console.log({ role })
  console.log({ normalizedRole })
  console.log({ isManager })

  const [data] = useState([
    {
      _id: "1",
      clientName: "GreenFields Pvt Ltd",
      clientCity: "Mumbai",
      projectName: "Retail Store Branding",
      address: "24, High Street, Andheri West",
      createdAt: "2025-01-15T10:30:00Z",
      priority: "High",
      approvalStatus: "New",
      timeSlot: "10:30 AM",
    },
    {
      _id: "2",
      clientName: "AgroMart",
      clientCity: "Delhi",
      projectName: "Mall Facade Signage",
      address: "Sector 18, Noida",
      createdAt: "2025-01-16T11:00:00Z",
      priority: "Medium",
      approvalStatus: "New",
      timeSlot: "5:00 PM",
    },
    {
      _id: "3",
      clientName: "FreshStore",
      clientCity: "Bengaluru",
      projectName: "Office Branding",
      address: "MG Road, Bengaluru",
      createdAt: "2025-01-17T09:45:00Z",
      priority: "Low",
      approvalStatus: "New",
      timeSlot: "10:30 AM",
    },
    {
      _id: "4",
      clientName: "TechCorp Solutions",
      clientCity: "Pune",
      projectName: "Corporate Office Signage",
      address: "Hinjewadi IT Park, Phase 2",
      createdAt: "2025-01-18T17:00:00Z",
      priority: "High",
      approvalStatus: "New",
      timeSlot: "8:00 PM",
    },
    {
      _id: "5",
      clientName: "Metro Retail",
      clientCity: "Chennai",
      projectName: "Store Front Display",
      address: "T Nagar Main Road",
      createdAt: "2025-01-19T20:00:00Z",
      priority: "Medium",
      approvalStatus: "New",
      timeSlot: "8:00 PM",
    },
    {
      _id: "6",
      clientName: "Fashion Hub",
      clientCity: "Hyderabad",
      projectName: "Boutique Branding",
      address: "Jubilee Hills, Road No 10",
      createdAt: "2025-01-20T17:00:00Z",
      priority: "Low",
      approvalStatus: "New",
      timeSlot: "5:00 PM",
    },
  ]);
  const handleAssignRecce = (item) => {
    // normalize data to match AssignedRecce modal expectations
    setSelectedRecce({
      ...item,
      _id: item._id || item.id,
    });
    setIsModalOpen(true);
  };
  const planningLogs = [
    {
      sno: 1,
      dateTime: "15 Jan 2025, 10:30 AM",
      coordinator: "Amit Verma",
      manager: "Neha Kapoor",
      projectStatus: "On Track",
      planningStatus: "Submitted",
      remark: "Initial planning submitted for client review and approval.",
    },
    {
      sno: 2,
      dateTime: "16 Jan 2025, 11:15 AM",
      coordinator: "Rohit Sharma",
      manager: "Rajesh Kumar",
      projectStatus: "Approved",
      planningStatus: "Approved",
      remark: "Planning approved by manager. Proceed with execution phase.",
    },
    {
      sno: 3,
      dateTime: "17 Jan 2025, 02:30 PM",
      coordinator: "Priya Singh",
      manager: "Neha Kapoor",
      projectStatus: "Hold By Client",
      planningStatus: "Rejected",
      remark:
        "Client requested modifications in timeline and resource allocation.",
    },
  ];

  // Filter data based on selected time
  const filteredData = useMemo(() => {
    return data.filter((item) => item.timeSlot === timeFilter);
  }, [data, timeFilter]);

  const modalColumnConfig = {
    status: {
      label: "Status",
      render: () => (
        <span
          className={
            "px-3 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700"
          }
        >
          New
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
    fullAddress: {
      label: "Full Address",
      render: (_, row) => (
        <button
          onClick={() => {
            const query = encodeURIComponent(
              `${row.address}, ${row.clientCity}`,
            );
            window.open(
              `https://www.google.com/maps/search/?api=1&query=${query}`,
              "_blank",
            );
          }}
          className="text-blue-600 font-medium hover:underline cursor-pointer text-left"
          title="Open address in new tab"
        >
          {row.address}
        </button>
      ),
    },
    visitTime: {
      label: "Date",
      render: (_, row) => (
        <span className="text-gray-700 whitespace-nowrap">
          {row.createdAt
            ? new Date(row.createdAt).toLocaleString("en-GB")
            : "-"}
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
          <span className="px-3 py-1 rounded-md text-xs font-semibold border bg-gray-50 text-gray-700 border-gray-200">
            {map[row.priority] ?? "-"}
          </span>
        );
      },
    },
  };

  const columnConfig = {
    actions: {
      label: "Actions",
      render: (_, row) => (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() =>
              navigate(`/recce/assigned-executive-recce-details/${row._id}`, {
                state: { from: "newDayPlanning" },
              })
            }
            className="w-8 h-8 flex items-center justify-center rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            <Eye size={16} className="block" />
          </button>
          {/* {isManager && (
            <button
              onClick={() => handleAssignRecce(row)}
              className="w-8 h-8 flex items-center justify-center rounded bg-purple-600 text-white hover:bg-purple-700 transition-colors shadow-sm"
              title="Re-Assign Now"
            >
              <UserCheck size={16} strokeWidth={2.5} />
            </button>
          )} */}
        </div>
      ),
    },
    status: {
      label: "Status",
      render: () => (
        <span
          className={
            "px-3 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700"
          }
        >
          New
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
    fullAddress: {
      label: "Full Address",
      render: (_, row) => (
        <button
          onClick={() => {
            const query = encodeURIComponent(
              `${row.address}, ${row.clientCity}`,
            );
            window.open(
              `https://www.google.com/maps/search/?api=1&query=${query}`,
              "_blank",
            );
          }}
          className="text-blue-600 font-medium hover:underline cursor-pointer text-left"
          title="Open address in new tab"
        >
          {row.address}
        </button>
      ),
    },
    visitTime: {
      label: "Date",
      render: (_, row) => (
        <span className="text-gray-700 whitespace-nowrap">
          {row.createdAt
            ? new Date(row.createdAt).toLocaleString("en-GB")
            : "-"}
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
          <span className="px-3 py-1 rounded-md text-xs font-semibold border bg-gray-50 text-gray-700 border-gray-200">
            {map[row.priority] ?? "-"}
          </span>
        );
      },
    },
  };

  // ==========================> api section start ==========================


  // get the all next day planning list

  const {
    data: managerData,
    isLoading: managerLoading,
    isFetching: managerFetching,
    error: managerError
  } = useGetRecceAllNextDayPlanningQuery(
    {
      page: currentPage,
      limit: itemsPerPage
    },
    { skip: !isManager }
  )


  // executive API
  const {
    data: executiveData,
    isLoading: executiveLoading,
    isFetching: executiveFetching,
    error: executiveError
  } = useGetRecceExeAllNextDayPlanningQuery(
    {
      page: currentPage,
      limit: itemsPerPage
    },
    { skip: isManager } //  skip when manager
  );


  const nextDayPlanningData = isManager ? managerData : executiveData;
  const isApiLoading = isManager ? managerLoading : executiveLoading;


  useEffect(() => {
    console.log("Next day planning:", nextDayPlanningData);
  }, [nextDayPlanningData]);


  // ==========================> api section end ==========================

  return (
    <div className="min-h-screen">
      {/* Header Section with Filter */}
      <div className="sticky -top-2 z-30 flex items-center justify-between bg-white shadow-md rounded-sm px-4 py-3 border my-5">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 border cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-semibold">Next Day Recce Planning</h2>
        </div>

        {/* RIGHT - Time Filter */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPlanningLogModal(true)}
            className="bg-blue-600 text-white text-xs px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors shadow-sm"
          >
            Planning Logs
          </button>
          <label className="text-sm font-medium text-gray-700">
            Time Filter:
          </label>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="10:30 AM">10:30 AM</option>
            <option value="5:00 PM">5:00 PM</option>
            <option value="8:00 PM">8:00 PM</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <Table data={filteredData} columnConfig={columnConfig}

        onPageChange={(page, limit) => {
          setCurrentPage(page);
          setItemsPerPage(limit)
        }}

      />

      <NextLogModal
        isOpen={showPlanningLogModal}
        onClose={() => setShowPlanningLogModal(false)}
        data={data}
        columnConfig={modalColumnConfig} // Bina actions wala config pass kiya
      />

      <AssignedRecceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        recceData={selectedRecce}
        variant="assignment"
      />
    </div>
  );
};

export default NextDayReccePlanning;
