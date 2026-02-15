import React, { useState, useEffect, useMemo, useRef } from "react";
import { ChevronLeft, ChevronRight, ChevronDown, Search } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { useGetCalendarViewQuery } from "@/api/hr/attendance.api";
import { useUpdateAttendanceMutation } from "@/api/hr/attendance.api";
import StatusModal from "./StatusModal";

const STATUS_MAP = (value) => {
  if (!value && value !== "") return "NA";
  const s = String(value).trim().toLowerCase();
  if (s.includes("present")) return "P";
  if (s.includes("absent")) return "A";
  if (s.includes("leave")) return "L";
  if (s.includes("weekly") || s.includes("off")) return "WO";
  if (s.includes("holiday")) return "H";
  if (s.includes("work") || s.includes("wfh")) return "WFH";
  if (s.includes("half")) return "HD";
  return s === "p" || s === "present" ? "P" : s === "a" ? "A" : "NA";
};

const getStatusColor = (status) => {
  switch (status) {
    case "P":
      return "bg-green-100 text-green-700";
    case "A":
      return "bg-red-100 text-red-700";
    case "L":
      return "bg-blue-100 text-blue-700";
    case "HD":
      return "bg-yellow-100 text-yellow-700";
    case "WFH":
      return "bg-purple-100 text-purple-700";
    case "WO":
      return "bg-indigo-100 text-indigo-700";
    case "H":
      return "bg-orange-100 text-orange-700";
    case "NA":
    default:
      return "bg-gray-200 text-gray-700";
  }
};

const statusFullName = {
  P: "Present",
  A: "Absent",
  L: "Leave",
  WO: "Weekly Off",
  H: "Holiday",
  WFH: "Work From Home",
  HD: "Half Day",
  NA: "Not Available",
};

const CalendarView = ({
  currentDate,
  setCurrentDate,
  searchTerm: parentSearchTerm,
  setSearchTerm: setParentSearchTerm,
  allEmployees = [],
  refetchTable,
}) => {
  const [selectedYear, setSelectedYear] = useState(
    currentDate?.getFullYear() ?? new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate?.getMonth() ?? new Date().getMonth()
  );
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState(parentSearchTerm || "");
  const dropdownRef = useRef(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [modalData, setModalData] = useState({
    dateKey: "",
    status: "",
    employee: null,
  });
  const [remarks, setRemarks] = useState("");

  const [updateAttendance] = useUpdateAttendanceMutation();

  const {
    data: calendarData,
    isFetching: isCalendarLoading,
    refetch,
  } = useGetCalendarViewQuery({
    month: String(selectedMonth + 1).padStart(2, "0"),
    year: String(selectedYear),
  });

  // Sync search up to parent if provided
  useEffect(() => {
    if (typeof setParentSearchTerm === "function") {
      setParentSearchTerm(searchTerm);
    }
  }, [searchTerm, setParentSearchTerm]);

  // Close dropdown on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target)) {
        setShowEmployeeDropdown(false);
      }
    };
    if (showEmployeeDropdown) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [showEmployeeDropdown]);

  const employees = useMemo(() => {
    const calendarRaw = calendarData?.data || [];

    return (allEmployees || []).map((emp) => {
      const match = calendarRaw.find(
        (c) => c.employeeId?.toString() === emp._id?.toString()
      );

      return {
        _id: emp._id,
        name: emp.name,
        email: emp.email,
        avatar: emp.name ? emp.name.charAt(0).toUpperCase() : "U",
        attendance: {
          ...(emp.attendance || {}),
          ...(match?.attendance || {}),
        },
      };
    });
  }, [allEmployees, calendarData]);

  // Sync selectedEmployee with updated calendar data
  useEffect(() => {
    if (selectedEmployee) {
      const updated = employees.find((e) => e._id === selectedEmployee._id);
      if (updated) {
        setSelectedEmployee(updated);
      }
    }
  }, [calendarData]);

  // Sync selectedEmployee when employees list updates
  useEffect(() => {
    if (selectedEmployee) {
      const updated = employees.find((e) => e._id === selectedEmployee._id);
      if (updated) {
        setSelectedEmployee(updated);
      }
    }
  }, [employees]);

  // Filter employees by search only (no attendance month filter)
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      if (!searchTerm) return true;
      const s = searchTerm.toLowerCase();
      return (
        (emp.name || "").toLowerCase().includes(s) ||
        (emp.email || "").toLowerCase().includes(s) ||
        (emp._id || "").toString().toLowerCase().includes(s)
      );
    });
  }, [employees, searchTerm]);

  // Auto-select first available employee when list updates
  useEffect(() => {
    if (!selectedEmployee && filteredEmployees.length > 0) {
      setSelectedEmployee(filteredEmployees[0]);
    } else if (filteredEmployees.length === 0) {
      setSelectedEmployee(null);
    } else if (selectedEmployee) {
      // keep selection if still present, otherwise pick first
      const exists = filteredEmployees.find(
        (e) => e._id === selectedEmployee._id
      );
      if (!exists) setSelectedEmployee(filteredEmployees[0] || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredEmployees]);

  const getDaysInMonth = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        i
      ).padStart(2, "0")}`;
      const isToday =
        new Date().toDateString() === new Date(year, month, i).toDateString();
      days.push({ date: i, dateKey, isToday });
    }
    return days;
  };

  const navigateMonth = (dir) => {
    let newMonth = selectedMonth + dir;
    let newYear = selectedYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
  };

  const openStatusModal = (dayKey, status, emp) => {
    setModalData({ dateKey: dayKey, status, employee: emp });
    setRemarks("");
    setShowStatusModal(true);
  };

  const days = useMemo(
    () => getDaysInMonth(selectedYear, selectedMonth),
    [selectedYear, selectedMonth]
  );

  const monthNames = [
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

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (isCalendarLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <ClipLoader size={30} />
      </div>
    );
  }
  if (!employees.length) {
    return (
      <div className="flex justify-center items-center h-60">
        <ClipLoader size={30} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Filters */}
      <div className="p-6 flex justify-between border-b border-gray-200 items-center gap-4">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowEmployeeDropdown((s) => !s)}
            className="flex items-center justify-between w-80 border border-gray-300 rounded-lg px-4 py-2"
            aria-haspopup="listbox"
            aria-expanded={showEmployeeDropdown}
          >
            {selectedEmployee ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#06425F] rounded-full flex items-center justify-center text-white">
                  {selectedEmployee.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold">
                    {selectedEmployee.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {selectedEmployee.email}
                  </div>
                </div>
              </div>
            ) : (
              <span className="text-gray-500 text-sm">Select an Employee</span>
            )}
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>

          {showEmployeeDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-md max-h-60 overflow-y-auto z-10 w-80">
              {filteredEmployees.length === 0 ? (
                <div className="px-4 py-2 text-gray-500 text-sm">
                  No employees found
                </div>
              ) : (
                filteredEmployees.map((emp) => (
                  <button
                    key={emp._id}
                    onClick={() => {
                      setSelectedEmployee(emp);
                      setShowEmployeeDropdown(false);
                    }}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 w-full text-left"
                  >
                    <div className="w-8 h-8 bg-[#06425F] rounded-full flex items-center justify-center text-white">
                      {emp.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{emp.name}</div>
                      <div className="text-xs text-gray-500 truncate">
                        {emp.email}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Month/Year Navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm font-medium"
          >
            {monthNames.map((m, i) => (
              <option key={i} value={i}>
                {m}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm font-medium"
          >
            {Array.from({ length: 5 }, (_, i) => {
              const y = new Date().getFullYear() - 2 + i;
              return (
                <option key={y} value={y}>
                  {y}
                </option>
              );
            })}
          </select>

          <button
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Calendar */}
      <div className="p-4">
        <h2 className="text-xl font-bold text-center mb-2">
          {monthNames[selectedMonth]} {selectedYear}
        </h2>

        {/* Week Days */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((d) => (
            <div
              key={d}
              className="text-center text-xs font-semibold text-gray-600"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => {
            const status =
              day && selectedEmployee
                ? selectedEmployee.attendance[day.dateKey] || "NA"
                : null;
            const normalizedStatus = status;
            const isFuture = day && new Date(day.dateKey) > new Date();
            if (isFuture) {
              return (
                <div
                  key={i}
                  className={`h-16 border rounded-lg p-1 border-gray-200 opacity-60`}
                >
                  <div className="text-xs font-semibold text-gray-400 mb-1">
                    {day?.date}
                  </div>
                </div>
              );
            }
            return (
              <div
                key={i}
                onClick={() =>
                  openStatusModal(
                    day.dateKey,
                    normalizedStatus,
                    selectedEmployee
                  )
                }
                className={`h-16 border rounded-lg p-1 cursor-pointer ${
                  day?.isToday
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
              >
                {day ? (
                  <div className="flex flex-col h-full">
                    <div className="text-xs font-semibold text-gray-800 mb-1">
                      {day.date}
                    </div>
                    <div className="flex-1 flex items-center justify-center relative group">
                      <div
                        className={`px-4 py-2.5 text-[12px] font-bold rounded-full text-center ${getStatusColor(
                          normalizedStatus
                        )}`}
                      >
                        {normalizedStatus}
                      </div>
                      <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10">
                        {statusFullName[normalizedStatus] || "Unknown"}
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
      {/* Modal for status update */}
      <StatusModal
        show={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        modalData={modalData}
        setModalData={setModalData}
        remarks={remarks}
        setRemarks={setRemarks}
        updateAttendance={updateAttendance}
        refetch={refetch}
        refetchTable={refetchTable}
      />
    </div>
  );
};

export default CalendarView;
