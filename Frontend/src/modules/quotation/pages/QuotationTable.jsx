import React, { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, Eye, FileText, Edit } from "lucide-react";
import Table from "@/components/Table";
import FeedbackModal from "../components/FeedbackModal";

/* -------------------- DATA -------------------- */
const initialData = [
  {
    id: "01",
    client: "GreenFields Co.",
    project: "Retails Store Signage",
    products: 12,
    date: "2025-11-11T10:30:00",
    displayDate: "11 Nov 25, 10:30AM",
    priority: "High",
    pNum: 1,
    status: "Accepted",
    deadline: "11 Nov 25, 11:30AM",
    action: "Receipt",
  },
  {
    id: "02",
    client: "AgriMart",
    project: "Mall Facade Design's",
    products: 23,
    date: "2025-11-11T10:30:00",
    displayDate: "11 Nov 25, 10:30AM",
    priority: "High",
    pNum: 2,
    status: "Accepted",
    deadline: "11 Nov 25, 11:30AM",
    action: "Receipt",
  },
  {
    id: "03",
    client: "SunHarvest",
    project: "Office Branding Survey",
    products: 32,
    date: "2025-11-11T10:30:00",
    displayDate: "11 Nov 25, 10:30AM",
    priority: "Medium",
    pNum: 3,
    status: "Accepted",
    deadline: "11 Nov 25, 11:30AM",
    action: "Receipt",
  },
  {
    id: "04",
    client: "FreshStore",
    project: "Retails Store Signage",
    products: 12,
    date: "2025-11-11T10:30:00",
    displayDate: "11 Nov 25, 10:30AM",
    priority: "Medium",
    pNum: 4,
    status: "Modification Needed",
    deadline: "11 Nov 25, 11:30AM",
    action: "Modify Now",
  },
  {
    id: "05",
    client: "SunHarvest",
    project: "Mall Facade Design's",
    products: 32,
    date: "2025-11-11T10:30:00",
    displayDate: "11 Nov 25, 10:30AM",
    priority: "Low",
    pNum: 5,
    status: "Accepted",
    deadline: "11 Nov 25, 11:30AM",
    action: "Receipt",
  },
  {
    id: "06",
    client: "AgroHub",
    project: "Office Branding Survey",
    products: 22,
    date: "2025-11-11T10:30:00",
    displayDate: "11 Nov 25, 10:30AM",
    priority: "Low",
    pNum: 6,
    status: "Accepted",
    deadline: "11 Nov 25, 11:30AM",
    action: "Receipt",
  },
];
const feedbackData = [
  {
    date: "11 Nov 25, 10:30AM",
    name: "Rahul Sharma",
    designation: "Rahul Sharma - Sales Executive",
    status: "Approved By Sales",
    feedback:
      "Please recheck the unit pricing; it appears higher than the previously discussed estimate",
  },
  {
    date: "11 Nov 25, 10:30AM",
    name: "Aman",
    designation: "Aman - Quotation Manager",
    status: "Submitted to Manager",
    feedback:
      "Please recheck the unit pricing; it appears higher than the previously discussed estimate",
  },
];
/* -------------------- COMPONENT -------------------- */
const QuotationTable = () => {
  const navigate = useNavigate();

  const [searchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // Dropdown states
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // Refs for dropdowns
  const dateDropdownRef = useRef(null);
  const priorityDropdownRef = useRef(null);
  const statusDropdownRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dateDropdownRef.current &&
        !dateDropdownRef.current.contains(event.target)
      ) {
        setShowDateDropdown(false);
      }
      if (
        priorityDropdownRef.current &&
        !priorityDropdownRef.current.contains(event.target)
      ) {
        setShowPriorityDropdown(false);
      }
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target)
      ) {
        setShowStatusDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* -------------------- FILTER LOGIC -------------------- */
  const filteredData = useMemo(() => {
    return initialData
      .filter((item) => {
        const matchesSearch =
          item.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.project.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
          statusFilter === "All" || item.status === statusFilter;

        const matchesPriority =
          priorityFilter === "All" || item.priority === priorityFilter;

        return matchesSearch && matchesStatus && matchesPriority;
      })
      .sort((a, b) =>
        sortOrder === "asc"
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date)
      );
  }, [searchTerm, statusFilter, priorityFilter, sortOrder]);

  /* -------------------- HANDLERS -------------------- */
  const handleReceiptClick = (row) => {
    navigate("/quotation/payment-receipt", { state: { quotation: row } });
  };

  const handleViewFeedback = (row) => {
    setSelectedRow(row);
    setIsFeedbackModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsFeedbackModalOpen(false);
    setSelectedRow(null);
  };

  const handleViewAssignedQuotations = (row) => {
    navigate("/quotation/assigned-quotations", {
      state: { quotation: row },
    });
  };

  /* -------------------- UI -------------------- */
  return (
    <div>
      {/* ===== HEADER ===== */}
      <div className="flex flex-wrap items-center justify-between mb-6 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div
            onClick={() => navigate(-1)}
            className="p-2 border rounded-md bg-gray-50 cursor-pointer hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5 text-gray-800" />
          </div>

          <h1 className="text-xl font-bold text-gray-800">
            Quotations (Client)
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Date Filter */}
          <div className="relative" ref={dateDropdownRef}>
            <button
              onClick={() => {
                setShowDateDropdown(!showDateDropdown);
                setShowPriorityDropdown(false);
                setShowStatusDropdown(false);
              }}
              className={`flex items-center gap-2 px-4 py-2 border bg-white rounded-md text-sm text-gray-600 hover:bg-gray-50 cursor-pointer ${
                sortOrder !== "desc" ? "bg-blue-50 border-blue-200" : ""
              }`}
            >
              Date <ChevronDown size={14} />
            </button>
            {showDateDropdown && (
              <div className="absolute top-full mt-1 right-0 bg-white border rounded-md shadow-lg z-10 min-w-[150px]">
                <button
                  onClick={() => {
                    setSortOrder("desc");
                    setShowDateDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${
                    sortOrder === "desc" ? "bg-gray-100 font-semibold" : ""
                  }`}
                >
                  Newest First
                </button>
                <button
                  onClick={() => {
                    setSortOrder("asc");
                    setShowDateDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${
                    sortOrder === "asc" ? "bg-gray-100 font-semibold" : ""
                  }`}
                >
                  Oldest First
                </button>
              </div>
            )}
          </div>

          {/* Priority Filter */}
          <div className="relative" ref={priorityDropdownRef}>
            <button
              onClick={() => {
                setShowPriorityDropdown(!showPriorityDropdown);
                setShowDateDropdown(false);
                setShowStatusDropdown(false);
              }}
              className={`flex items-center gap-2 px-4 py-2 border bg-white rounded-md text-sm text-gray-600 hover:bg-gray-50 cursor-pointer ${
                priorityFilter !== "All" ? "bg-blue-50 border-blue-200" : ""
              }`}
            >
              Priority {priorityFilter !== "All" && `(${priorityFilter})`}{" "}
              <ChevronDown size={14} />
            </button>
            {showPriorityDropdown && (
              <div className="absolute top-full mt-1 right-0 bg-white border rounded-md shadow-lg z-10 min-w-[150px]">
                {["All", "High", "Medium", "Low"].map((priority) => (
                  <button
                    key={priority}
                    onClick={() => {
                      setPriorityFilter(priority);
                      setShowPriorityDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${
                      priorityFilter === priority
                        ? "bg-gray-100 font-semibold"
                        : ""
                    }`}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Status Filter */}
          <div className="relative" ref={statusDropdownRef}>
            <button
              onClick={() => {
                setShowStatusDropdown(!showStatusDropdown);
                setShowDateDropdown(false);
                setShowPriorityDropdown(false);
              }}
              className={`flex items-center gap-2 px-4 py-2 border bg-white rounded-md text-sm text-gray-600 hover:bg-gray-50 cursor-pointer ${
                statusFilter !== "All" ? "bg-blue-50 border-blue-200" : ""
              }`}
            >
              Status{" "}
              {statusFilter !== "All" &&
                `(${statusFilter.substring(0, 10)}...)`}{" "}
              <ChevronDown size={14} />
            </button>
            {showStatusDropdown && (
              <div className="absolute top-full mt-1 right-0 bg-white border rounded-md shadow-lg z-10 min-w-[180px]">
                {["All", "Accepted", "Modification Needed"].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                      setShowStatusDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${
                      statusFilter === status ? "bg-gray-100 font-semibold" : ""
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <Table
        data={filteredData}
        columnConfig={{
          // S.No. is handled by Table.jsx, so start with action for correct order
          action: {
            label: "Actions",
            render: (value, row) => (
              <div className="flex justify-center">
                {value === "Receipt" && (
                  <button
                    title="View Receipt"
                    onClick={() => handleReceiptClick(row)}
                    className="flex items-center justify-center w-9 h-9 bg-blue-50 border border-blue-200 rounded text-blue-500 hover:bg-blue-100 transition-colors cursor-pointer"
                  >
                    <FileText size={16} />
                  </button>
                )}

                {value === "Modify Now" && (
                  <button
                    title="Modify Quotation"
                    onClick={() =>
                      navigate(`/quotation/form/${row.id}`, { state: { quotation: row } })
                    }
                    className="flex items-center justify-center w-9 h-9 bg-orange-50 border border-orange-200 rounded text-orange-400 hover:bg-orange-100 transition-colors cursor-pointer"
                  >
                    <Edit size={16} />
                  </button>
                )}
              </div>
            ),
          },
          status: {
            label: "Status",
            render: (value, row) => (
              <button
                className={`px-3 py-1 rounded border text-xs font-medium ${
                  value === "Accepted"
                    ? "bg-green-50 text-green-500 border-green-100 hover:bg-green-100"
                    : "bg-orange-50 text-orange-400 border-orange-100"
                }`}
              >
                {value}
              </button>
            ),
          },
          feedback: {
            label: "Feedback",
            render: (_, row) =>
              (
                <button
                  onClick={() => handleViewFeedback(row)}
                  className="bg-blue-600 p-1.5 rounded text-white hover:bg-blue-700 cursor-pointer"
                >
                  <Eye size={14} />
                </button>
              )
          },
          client: { label: "Client Name" },
          project: {
            label: "Project Name",
            render: (value, row) => (
              <button
                onClick={() =>
                  navigate(`/quotation/accepted-quotation-page/${row.id}`, {
                    state: { showButton: false },
                  })
                }
                className="text-blue-500 hover:text-blue-700 cursor-pointer"
              >
                {value}
              </button>
            ),
          },
          products: { label: "Products" },
          displayDate: { label: "Date" },
          priority: {
            label: "Priority (T)",
            render: (value) => (
              <span
                className={`px-3 py-1 rounded border text-xs font-medium ${
                  value === "High"
                    ? "bg-red-50 text-red-400 border-red-100"
                    : value === "Medium"
                    ? "bg-orange-50 text-orange-400 border-orange-100"
                    : "bg-green-50 text-green-500 border-green-100"
                }`}
              >
                {value}
              </span>
            ),
          },
          pNum: {
            label: "Priority (N)",
            render: (value, row) => (
              <span
                className={`px-3 py-1 rounded border text-xs font-medium ${
                  row.priority === "High"
                    ? "bg-red-50 text-red-400 border-red-100"
                    : row.priority === "Medium"
                    ? "bg-orange-50 text-orange-400 border-orange-100"
                    : "bg-green-50 text-green-500 border-green-100"
                }`}
              >
                {row.priority} ({value})
              </span>
            ),
          },

          deadline: { label: "Deadline" },
        }}
      />

      {/* ===== MODAL ===== */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={handleCloseModal}
        rowData={selectedRow}
        data={feedbackData}
      />
    </div>
  );
};

export default QuotationTable;
