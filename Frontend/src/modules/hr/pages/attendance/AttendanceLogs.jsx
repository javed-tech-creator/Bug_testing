import React, { useState, useEffect } from "react";
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
} from "lucide-react";
import * as XLSX from "xlsx";
import CalendarView from "./CalendarView.jsx";
import PageHeader from "@/components/PageHeader";
import Table from "@/components/Table";
import { useGetAllEmployeeQuery } from "@/api/hr/employee.api";
import { useGetAttendanceByCityQuery } from "@/api/hr/attendance.api";
import { useGetCalendarViewQuery } from "@/api/hr/attendance.api";
import { useSelector } from "react-redux";
import Loader from "@/components/Loader.jsx";

const AttendanceLogs = () => {
  const [activeView, setActiveView] = useState("table");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [showEntries, setShowEntries] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);

  const authData = useSelector((state) => state.auth.userData);

  // Fetch employee list (all employees under this HR city)
  const { data: empData, isFetching } = useGetAllEmployeeQuery();

  const formattedDate = currentDate.toLocaleDateString("en-CA");

  const {
    data: calendarData,
  } = useGetCalendarViewQuery({
    month: String(currentDate.getMonth() + 1).padStart(2, "0"),
    year: String(currentDate.getFullYear()),
  });

  const {
    data: attendanceApiData,
    isFetching: isAttendanceFetching,
    refetch: refetchAttendance,
  } = useGetAttendanceByCityQuery(
    { date: formattedDate },
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    refetchAttendance();
  }, [formattedDate]);

  const attendanceData = attendanceApiData?.data ?? [];

  // ---------------------- FILTER EMPLOYEES BY HR CITY ------------------------
  const allEmployees =
    calendarData?.data?.map((emp) => {
      const full = empData?.data?.find(
        (e) => e._id?.toString() === emp.employeeId?.toString()
      );

      return {
        _id: emp.employeeId,
        name: emp.name || full?.name || "",
        email: emp.email || full?.email || "",
        phone: full?.phone || emp.mobile || "",
        city: full?.city || emp.city || "",
        photo: full?.photo || emp.photo || {},
        branchId: full?.branchId || null,
        departmentId: full?.departmentId || null,
        designationId: full?.designationId || null,
        attendance: emp.attendance || {},
      };
    }) || [];

  const employees = allEmployees;

  // ---------------------- MERGE ATTENDANCE WITH EMPLOYEES -------------------
  let combinedAttendance = [];

  const currentDateKey = formattedDate;

  combinedAttendance = employees.map((emp) => {
    const rawStatus = emp.attendance?.[currentDateKey] || "NA";

    const statusMap = {
      P: "P",
      A: "A",
      L: "L",
      HD: "HD",
      WFH: "WFH",
      WO: "WO",
      H: "H",
      NA: "NA"
    };

    const finalStatus = statusMap[rawStatus] || "NA";

    return {
      _id: emp._id,
      employeeId: emp,
      name: emp.name,
      email: emp.email,
      phone: emp.phone,
      photo: emp.photo,
      city: emp.city,
      status: finalStatus,
      checkIn: false,
      leave: finalStatus === "L",
      workingHours: "--",
      loginTime: null,
      logoutTime: null,
      date: currentDateKey,
      location: null,
    };
  });

  // ---------------------- SEARCH FILTER -------------------------------------
  const filteredData = combinedAttendance.filter((row) => {
    const match =
      row.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return match;
  });

  // ---------------------- PAGINATION ----------------------------------------
  const totalPages = Math.ceil(filteredData.length / showEntries) || 1;
  const paginatedData = filteredData.slice(
    (currentPage - 1) * showEntries,
    currentPage * showEntries
  );

  // ---------------------- TABLE CONFIG --------------------------------------
  const columnConfig = {
    "photo.public_url": {
      label: "Photo",
      render: (value, row) => {
        const initials =
          row?.name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) || "NA";

        return (
          <div className="w-12 h-12 rounded-full overflow-hidden bg-black text-white flex items-center justify-center font-semibold text-xs mx-auto">
            {value ? (
              <img
                src={value}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
        );
      },
    },

    name: { label: "Name" },
    email: { label: "Email" },
    phone: { label: "Mobile" },
    status: {
      label: "Status",
      render: (value) => {
        // Convert short codes to full labels
        const fullLabelMap = {
          P: "Present",
          A: "Absent",
          L: "Leave",
          HD: "Half Day",
          WFH: "Work From Home",
          WO: "Weekly Off",
          H: "Holiday",
        };

        const fullLabel = fullLabelMap[value] || value;

        // Colors matching calendar logic
        let color = "bg-gray-300 text-gray-800";
        if (value === "P") color = "bg-green-100 text-green-700";
        else if (value === "A") color = "bg-red-100 text-red-700";
        else if (value === "HD") color = "bg-yellow-100 text-yellow-700";
        else if (value === "L") color = "bg-blue-100 text-blue-700";
        else if (value === "WFH") color = "bg-purple-100 text-purple-700";
        else if (value === "WO") color = "bg-indigo-100 text-indigo-700";
        else if (value === "H") color = "bg-orange-100 text-orange-700";

        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}
          >
            {fullLabel}
          </span>
        );
      },
    },
    checkIn: { label: "Check-In" },
    leave: { label: "Leave" },
    workingHours: { label: "Working Hours" },
    loginTime: { label: "Login Time" },
    logoutTime: { label: "Logout Time" },
    date: {
      label: "Date",
      render: (value) => {
        if (!value) return "--";
        const d = new Date(value);
        if (isNaN(d)) return value;

        return d.toLocaleDateString("en-CA"); // YYYY-MM-DD format
      },
    },
    location: { label: "Location" },
  };

  /* -------------------------------------------------------------------------- */
  /* 🔹 EXPORT EXCEL                                                            */
  /* -------------------------------------------------------------------------- */
  const handleExport = () => {
    try {
      const exportData = combinedAttendance.map((record) => ({
        Name: record.name || "",
        Email: record.email || "",
        Mobile: record.phone || "",
        Status: record.status || "",
        CheckIn: record.checkIn ? "Yes" : "No",
        Leave: record.leave ? "Yes" : "No",
        WorkingHours: record.workingHours || "",
        LoginTime: record.loginTime
          ? new Date(record.loginTime).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
          : "--",
        LogoutTime: record.logoutTime
          ? new Date(record.logoutTime).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
          : "--",
        Date: record.date || "",
        Location:
          record.location &&
          Array.isArray(record.location.coordinates) &&
          record.location.coordinates.length === 2
            ? `${record.location.coordinates[1]}, ${record.location.coordinates[0]}`
            : "--",
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
      XLSX.writeFile(
        workbook,
        `${new Date().toLocaleDateString()}_Attendance.xlsx`
      );
    } catch (err) {
      console.error("Excel Export Error:", err.message);
    }
  };
  const isToday = currentDate.toDateString() === new Date().toDateString();

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    if (direction === "prev") newDate.setDate(newDate.getDate() - 1);
    else if (direction === "next") newDate.setDate(newDate.getDate() + 1);

    setCurrentDate(newDate);
    setCurrentPage(1);
  };

  const paginatedCombined = paginatedData;

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <PageHeader title="Attendance Logs" />

      {/* 🔹 HEADER */}
      <div className="mb-6">
        {/* 🔸 DATE NAVIGATION */}
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigateDate("prev")}
            className="text-sm flex items-center gap-1 text-[#06425F] cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" /> PREVIOUS
          </button>

          <input
            type="date"
            value={currentDate.toLocaleDateString("en-CA")}
            onChange={(e) => {
              setCurrentDate(new Date(e.target.value));
              setCurrentPage(1);
            }}
            max={new Date().toLocaleDateString("en-CA")}
            className="border border-gray-300 rounded px-3 py-1 text-sm"
          />

          <button
            onClick={() => navigateDate("next")}
            disabled={isToday}
            className={`text-sm flex items-center gap-1 cursor-pointer ${
              isToday ? "text-gray-400 cursor-not-allowed" : "text-[#06425F]"
            }`}
          >
            NEXT <ChevronRight className="h-4 w-4" />
          </button>

          {!isToday && (
            <button
              onClick={() => {
                setCurrentDate(new Date());
                setCurrentPage(1);
              }}
              className="text-[#06425F] text-sm hover:underline cursor-pointer"
            >
              Today
            </button>
          )}
        </div>

        {/* 🔹 SEARCH + EXPORT + SHOW ENTRIES */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex border border-gray-300 rounded">
            <button
              onClick={() => setActiveView("table")}
              className={`px-4 py-2 text-sm font-medium cursor-pointer ${
                activeView === "table"
                  ? "bg-black text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setActiveView("calendar")}
              className={`px-4 py-2 text-sm font-medium cursor-pointer ${
                activeView === "calendar"
                  ? "bg-black text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              Calendar View
            </button>
          </div>

          {/* Search, Export, Show */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded px-3 py-2 pr-10 text-sm w-64"
              />
              <Search className="h-4 w-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
            </div>

            <button
              onClick={handleExport}
              className="bg-black text-white px-4 py-2 rounded text-sm flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Export
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show</span>
              <select
                className="border border-gray-300 rounded px-2 py-1 text-sm"
                value={showEntries}
                onChange={(e) => {
                  setShowEntries(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation, Search, Table, Calendar - NO UI CHANGES */}
      {/* Your ENTIRE UI is untouched */}

      {activeView === "table" ? (
        isFetching || isAttendanceFetching ? (
          <Loader />
        ) : (
          <Table data={paginatedCombined} columnConfig={columnConfig} />
        )
      ) : (
        <CalendarView
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          allEmployees={combinedAttendance}
          refetchTable={refetchAttendance}
        />
      )}
    </div>
  );
};

export default AttendanceLogs;
