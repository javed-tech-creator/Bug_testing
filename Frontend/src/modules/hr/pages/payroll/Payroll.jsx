// src/components/Payroll/Payroll.jsx
import React, { useState, useMemo } from "react";
import { Search, Users, CheckCircle, TrendingUp, CalendarDays, Check, X } from "lucide-react";
import { useGetAllSalarySlipsQuery, useMarkSalaryPaymentMutation , useLazyDownloadSalarySlipQuery, useApproveSalaryMutation, useRejectSalaryMutation } from "@/api/hr/payroll.api";
import PageHeader from "@/components/PageHeader";
import { toast } from "react-toastify";

const Payroll = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState(
    today.toLocaleString("default", { month: "long" })
  );

  const monthMap = {
    January: "1", February: "2", March: "3", April: "4",
    May: "5", June: "6", July: "7", August: "8",
    September: "9", October: "10", November: "11", December: "12"
  };

  // ✅ Get salary slips
  const { data, isLoading, isError, refetch } = useGetAllSalarySlipsQuery({
    year: selectedYear,
    month: monthMap[selectedMonth]
  });

  const [triggerDownload, { isFetching: isDownloading }] = useLazyDownloadSalarySlipQuery();

  // ✅ Mark payment mutation
  const [markPayment, { isLoading: isPaying }] = useMarkSalaryPaymentMutation();
  const [approveSalary, { isLoading: isApproving }] = useApproveSalaryMutation();
  const [rejectSalary, { isLoading: isRejecting }] = useRejectSalaryMutation();
  const [optimisticStatus, setOptimisticStatus] = useState({});
  const [approvingId, setApprovingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);


  const getInitials = (name) => name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  // Robust status / paidAmount helpers — try multiple possible backend shapes
  const getEmpStatus = (emp) => {
    if (!emp) return "Unpaid";
    if (emp.status) return emp.status;
    if (emp.paymentStatus && typeof emp.paymentStatus.isPaid !== 'undefined') return emp.paymentStatus.isPaid ? 'Paid' : 'Unpaid';
    if (typeof emp.isPaid !== 'undefined') return emp.isPaid ? 'Paid' : 'Unpaid';
    if (emp.salaryRecord && typeof emp.salaryRecord.isPaid !== 'undefined') return emp.salaryRecord.isPaid ? 'Paid' : 'Unpaid';
    if (emp.paidAmount && Number(emp.paidAmount) > 0) return 'Paid';
    return 'Unpaid';
  };

  const getPaidAmount = (emp) => {
    if (!emp) return 0;
    if (typeof emp.paidAmount !== 'undefined' && emp.paidAmount !== null) return Number(emp.paidAmount) || 0;
    if (emp.paymentStatus && typeof emp.paymentStatus.paidAmount !== 'undefined') return Number(emp.paymentStatus.paidAmount) || 0;
    if (emp.salaryRecord && typeof emp.salaryRecord.paidAmount !== 'undefined') return Number(emp.salaryRecord.paidAmount) || 0;
    return 0;
  };

  

  // Filter employees
  const filteredEmployees = data?.data?.filter(emp =>
    emp.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);
  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));

  // Calculate stats (memoized)
  const stats = useMemo(() => ({
    totalEmployees: filteredEmployees.length,
    paid: filteredEmployees.filter(emp => getEmpStatus(emp) === "Paid").length,
    unpaid: filteredEmployees.filter(emp => getEmpStatus(emp) !== "Paid").length,
    totalPayout: filteredEmployees.reduce(
      (acc, emp) => acc + (getEmpStatus(emp) === "Paid" ? getPaidAmount(emp) : 0),
      0
    ),
    highestSalary: Math.max(...filteredEmployees.map(emp => Number(emp.actualSalary || 0)), 0),
    maxPresentDays: filteredEmployees.length > 0
      ? Math.max(...filteredEmployees.map(emp => ((emp.presentDays / emp.totalWorkingDays) * 100 || 0)))
      : 0,
  }), [filteredEmployees]);


  const handlePayNow = async (employeeId, employeeName) => {
    try {
      const employee = data?.data?.find(emp => emp.employeeId === employeeId);

      // 1️⃣ Mark as paid
      await markPayment({
        employeeId: employeeId,
        year: parseInt(selectedYear),
        month: parseInt(monthMap[selectedMonth]),
        isPaid: true,
        paidAmount: employee?.estimate_salary || getPaidAmount(employee)
      }).unwrap();

      // 2️⃣ Refresh data
      refetch();

      // 3️⃣ Download PDF
      const monthNum = monthMap[selectedMonth];
      const response = await triggerDownload({ id: employeeId, year: selectedYear, month: monthNum }).unwrap();

      const url = window.URL.createObjectURL(response);
      const a = document.createElement("a");
      a.href = url;
      a.download = `salary-slip-${employeeName}-${selectedMonth}-${selectedYear}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      alert(`Salary paid and slip downloaded for ${employeeName}`);
    } catch (error) {
      console.error("Payment or download failed:", error);
      alert("Failed to pay or download salary slip. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-4">
          <PageHeader title="Monthly Payroll" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <div className="bg-white rounded-lg shadow p-5 border-l-4 border-blue-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Total Employees</p>
                <p className="text-xl font-bold text-gray-800">{stats.totalEmployees}</p>
              </div>
              <Users className="text-blue-400" size={24} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-5 border-l-4 border-green-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Paid</p>
                <p className="text-xl font-bold text-gray-800">{stats.paid}</p>
              </div>
              <CheckCircle className="text-green-400" size={24} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-5 border-l-4 border-red-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Unpaid</p>
                <p className="text-xl font-bold text-gray-800">{stats.unpaid}</p>
              </div>
              <Users className="text-red-400" size={24} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-5 border-l-4 border-purple-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Total Payout</p>
                <p className="text-xl font-bold text-gray-800">₹{stats.totalPayout}</p>
              </div>
              <TrendingUp className="text-purple-400" size={24} />
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-lg shadow p-3 mb-4 flex flex-col md:flex-row gap-3 items-center">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search employee name or email..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>2025</option>
              <option>2024</option>
              <option>2023</option>
            </select>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.keys(monthMap).map(month => <option key={month}>{month}</option>)}
            </select>
          </div>
        </div>

        {/* Employee Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black text-white">
                <tr>
                  <th className="px-4 py-3 border text-left text-sm font-semibold">Employee</th>
                  <th className="px-4 py-3 border text-left text-sm font-semibold">Salary</th>
                  <th className="px-4 py-3 border text-left text-sm font-semibold">Total Work Day</th>
                  <th className="px-4 py-3 border text-left text-sm font-semibold">Present</th>
                  <th className="px-4 py-3 border text-left text-sm font-semibold">Absent</th>
                  <th className="px-4 py-3 border text-left text-sm font-semibold">Estimate</th>
                  <th className="px-4 py-3 border text-left text-sm font-semibold">Status</th>
                  <th className="px-4 py-3 border text-left text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">Loading...</td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-red-500">Error fetching data</td>
                  </tr>
                ) : currentEmployees.length > 0 ? (
                  currentEmployees.map(emp => {
                    console.log("FULL EMP DATA =>", emp);
                    console.log("EMP ->", emp);
                    console.log("EMP IMAGE =>", emp.profileImage);
                    console.log("EMP IMAGE FILE NAME =>", emp?.profileImage ? emp.profileImage.split("/").pop() : "No image");

                    return (
                      <tr
                        key={emp.employeeId}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-3 flex items-center gap-2">
                          {emp?.profileImage ? (
                            <img
                              src={emp.profileImage}
                              alt={emp.employeeName}
                              className="w-9 h-9 rounded-full object-cover border"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full overflow-hidden bg-black text-white flex items-center justify-center font-semibold text-xs">
                              {emp.employeeName
                                ? emp.employeeName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()
                                    .slice(0, 2)
                                : "NA"}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">
                              {emp.employeeName}
                            </p>
                            <p className="text-xs text-gray-500">{emp.email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          ₹{emp.actualSalary || "0"}
                        </td>
                        <td className="px-4 py-3">
                          {emp.totalWorkingDays || "0"}{" "}
                        </td>
                        <td className="px-4 py-3">{emp.presentDays || "0"} </td>
                        <td className="px-4 py-3">{emp.absentDays || "0"} </td>
                        <td className="px-4 py-3">
                          ₹{emp.estimate_salary || "0"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold border 
    ${
      getEmpStatus(emp) === "Paid"
        ? "bg-green-50 text-green-700 border-green-300"
        : getEmpStatus(emp) === "Rejected"
        ? "bg-red-50 text-red-700 border-red-300"
        : "bg-yellow-50 text-yellow-700 border-yellow-300"
    }`}
                          >
                            {optimisticStatus[emp.employeeId] || getEmpStatus(emp)}
                          </span>
                        </td>
                        <td className="px-4 py-3 space-x-2">
                          {getEmpStatus(emp) !== "Paid" &&
                          getEmpStatus(emp) !== "Rejected" ? (
                            <>
                              <button
                                disabled={approvingId !== null || rejectingId !== null}
                                onClick={async () => {
                                  try {
                                    setApprovingId(emp.employeeId);
                                    setOptimisticStatus(prev => ({ ...prev, [emp.employeeId]: "Paid" }));
                                    await approveSalary({
                                      employeeId: emp.employeeId,
                                      year: parseInt(selectedYear),
                                      month: parseInt(monthMap[selectedMonth]),
                                    }).unwrap();

                                    toast.success("Salary approved successfully");
                                    await refetch();
                                    setApprovingId(null);
                                    setOptimisticStatus({});
                                  } catch (error) {
                                    setApprovingId(null);
                                    console.error("Approve failed:", error);
                                    toast.error("Failed to approve salary");
                                  }
                                }}
                                className={`p-2 rounded-lg transition-all duration-200 cursor-pointer text-green-600 shadow-sm
      ${approvingId !== null || rejectingId !== null ? "opacity-50 cursor-not-allowed" : "hover:bg-green-100 hover:scale-110"}
    `}
                              >
                                {approvingId === emp.employeeId ? (
                                  <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <Check className="w-5 h-5" />
                                )}
                              </button>

                              <button
                                disabled={approvingId !== null || rejectingId !== null}
                                onClick={async () => {
                                  try {
                                    setRejectingId(emp.employeeId);
                                    setOptimisticStatus(prev => ({ ...prev, [emp.employeeId]: "Rejected" }));
                                    await rejectSalary({
                                      employeeId: emp.employeeId,
                                      year: parseInt(selectedYear),
                                      month: parseInt(monthMap[selectedMonth]),
                                    }).unwrap();

                                    toast.success("Salary rejected");
                                    await refetch();
                                    setRejectingId(null);
                                    setOptimisticStatus({});
                                  } catch (error) {
                                    setRejectingId(null);
                                    toast.error("Failed to reject salary");
                                  }
                                }}
                                className={`p-2 rounded-lg transition-all duration-200 cursor-pointer text-red-600 shadow-sm
      ${approvingId !== null || rejectingId !== null ? "opacity-50 cursor-not-allowed" : "hover:bg-red-100 hover:scale-110"}
    `}
                              >
                                {rejectingId === emp.employeeId ? (
                                  <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <X className="w-5 h-5" />
                                )}
                              </button>
                            </>
                          ) : (
                            <>
                              {getEmpStatus(emp) === "Paid" && (
                                <span className="text-green-600 text-sm font-semibold">
                                  ✓ Paid
                                </span>
                              )}

                              {getEmpStatus(emp) === "Rejected" && (
                                <span className="text-red-600 text-sm font-semibold">
                                  ✗ Rejected
                                </span>
                              )}
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-gray-500">No Data Found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {filteredEmployees.length > rowsPerPage && (
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payroll;