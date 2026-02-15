// ---------------- KPIIncentiveManagementTable.jsx ----------------
import React, { useState } from "react";
import { Check, IndianRupee, Award } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Table from "@/components/Table";
import { useGetAllEmployeeQuery } from "../../../../api/hr/employee.api";

const KPIIncentiveManagementTable = () => {
    const { data: employeeData } = useGetAllEmployeeQuery();
    const [employees, setEmployees] = useState([]);

    React.useEffect(() => {
        if (!employeeData) return;

        let list =
            employeeData?.data ||
            employeeData?.employees ||
            employeeData?.result ||
            employeeData?.users ||
            employeeData?.data?.data ||
            [];

        if (!Array.isArray(list) && typeof list === "object") {
            const possibleArray = Object.values(list).find((v) => Array.isArray(v));
            if (Array.isArray(possibleArray)) list = possibleArray;
        }

        if (!Array.isArray(list)) list = [];

        const mapped = list.map((emp) => ({
            id: emp._id || emp.employeeId,
            name: emp.employeeName || emp.name || "Unknown",
            dept: emp.departmentId?.name || emp.departmentId?.title || "N/A",
            avgPerf: Math.floor(Math.random() * 40) + 60, // temp performance until backend provides it
        }));

        setEmployees(mapped);
    }, [employeeData]);

    const [rules] = useState([
        { id: "r1", label: "≥ 90%", threshold: 90, amount: 5000 },
        { id: "r2", label: "80% – 89%", threshold: 80, amount: 2000 },
        { id: "r3", label: "< 80%", threshold: 0, amount: 0 },
    ]);

    const [approvals, setApprovals] = useState({});
    const [approvingId, setApprovingId] = useState(null);
    const [rejectingId, setRejectingId] = useState(null);

    const calculateIncentive = (emp) => {
        const matched = [...rules]
            .sort((a, b) => b.threshold - a.threshold)
            .find((r) => emp.avgPerf >= r.threshold);
        return matched ? matched.amount : 0;
    };

    const toggleApprove = (id) => {
        if (approvingId !== null || rejectingId !== null) return;
        setApprovingId(id);
        setTimeout(() => {
            setApprovals((prev) => ({
                ...prev,
                [id]: "paid",
            }));
            setApprovingId(null);
        }, 1000);
    };

    const markPaid = (id) => {
        if (approvingId !== null || rejectingId !== null) return;
        setRejectingId(id);
        setTimeout(() => {
            setApprovals((prev) => ({
                ...prev,
                [id]: "unpaid",
            }));
            setRejectingId(null);
        }, 1000);
    };

    const getStatusColor = (status) => {
        if (status === "paid") return "bg-blue-100 text-blue-800";
        if (status === "unpaid") return "bg-red-100 text-red-800";
        return "bg-yellow-100 text-yellow-800";
    };

    return (
      <div className="min-h-screen bg-gray-50 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <PageHeader title="Incentive Management" />
          <div className="mt-10 bg-white p-2 rounded-2xl shadow-sm border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-3">
              🎯 Incentive Rules
            </h4>
            <div className="grid md:grid-cols-3 gap-3 ">
              {rules.map((r) => (
                <div
                  key={r.id}
                  className="border border-gray-200 rounded-xl p-4 text-center bg-gradient-to-br from-gray-50 to-gray-100 shadow-md hover:shadow-lg transform hover:-translate-y-1 hover:scale-105 transition-all duration-300"
                >
                  <div className="text-xl shadow-2xl font-bold text-indigo-600">
                    {r.label}
                  </div>
                  <div className="text-gray-500 text-sm mt-1">
                    ₹{r.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Table */}
          <div className="overflow-x-auto bg-white rounded-2xl shadow border border-gray-200 mt-6">
            <Table
              data={employees.map((emp) => ({
                id: emp.id,
                name: emp.name,
                dept: emp.dept,
                avgPerf: emp.avgPerf + "%",
                incentive: calculateIncentive(emp),
                status: approvals[emp.id] || "pending",
                actions: emp.id,
              }))}
              columnConfig={{
                name: { label: "Employee" },
                dept: { label: "Department" },
                avgPerf: { label: "Avg Performance" },
                incentive: {
                  label: "Incentive",
                  render: (val) => `₹${val.toLocaleString()}`,
                },
                status: {
                  label: "Status",
                  render: (val) =>
                    val === "paid"
                      ? "Paid"
                      : val === "unpaid"
                      ? "Unpaid"
                      : "Pending",
                },
                actions: {
                  label: "Actions",
                  render: (id) => {
                    const status = approvals[id] || "pending";
                    const isApproving = approvingId === id;
                    const isRejecting = rejectingId === id;

                    return (
                      <>
                        {status !== "paid" && status !== "unpaid" ? (
                          <div className="flex justify-center gap-2">
                            <button
                              disabled={
                                approvingId !== null || rejectingId !== null
                              }
                              onClick={() => toggleApprove(id)}
                              className={`p-2 rounded-lg transition-all duration-200 cursor-pointer text-green-600 shadow-sm
                                ${
                                  approvingId !== null || rejectingId !== null
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-green-100 hover:scale-110"
                                }
                              `}
                            >
                              {isApproving ? (
                                <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                "✔"
                              )}
                            </button>

                            <button
                              disabled={
                                approvingId !== null || rejectingId !== null
                              }
                              onClick={() => markPaid(id)}
                              className={`p-2 rounded-lg transition-all duration-200 cursor-pointer text-red-600 shadow-sm
                                ${
                                  approvingId !== null || rejectingId !== null
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-red-100 hover:scale-110"
                                }
                              `}
                            >
                              {isRejecting ? (
                                <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                "✘"
                              )}
                            </button>
                          </div>
                        ) : (
                          <>
                            {status === "paid" && (
                              <span className="text-green-600 text-sm font-semibold">
                                ✓ Paid
                              </span>
                            )}
                            {status === "unpaid" && (
                              <span className="text-red-600 text-sm font-semibold">
                                ✗ Unpaid
                              </span>
                            )}
                          </>
                        )}
                      </>
                    );
                  },
                },
              }}
            />
          </div>

          {/* Rules Section */}
        </div>
      </div>
    );
};

export default KPIIncentiveManagementTable;
