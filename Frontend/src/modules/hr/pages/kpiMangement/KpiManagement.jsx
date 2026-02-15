// ---------------- KPIManagementTable.jsx ----------------
import React, { useState } from "react";
import { useGetAllEmployeeQuery } from "../../../../api/hr/employee.api";
import { Search, Plus, Edit, Trash2, Funnel } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { toast } from "react-toastify";
import Table from "@/components/Table";

const KPIManagementTable = () => {
  const { data: employeeData, isLoading } = useGetAllEmployeeQuery();
  const [employees, setEmployees] = useState([]);
  React.useEffect(() => {
    console.log("EMPLOYEE API RAW DATA =>", employeeData);
    if (!employeeData) return;

    // Normalize employee list from API (safe for all backend formats)
    let list =
      employeeData?.data ||
      employeeData?.employees ||
      employeeData?.result ||
      employeeData?.users ||
      employeeData?.data?.data ||
      [];

    // If nested array was received inside an object, extract it
    if (!Array.isArray(list) && typeof list === "object") {
      const possibleArray = Object.values(list).find((v) => Array.isArray(v));
      if (Array.isArray(possibleArray)) list = possibleArray;
    }

    // Final safety fallback
    if (!Array.isArray(list)) list = [];
    console.log("NORMALIZED EMPLOYEE LIST =>", list);

    // Map employees to a consistent structure
    const mapped = list.map((emp) => ({
      id: emp._id || emp.employeeId,
      name: emp.employeeName || emp.name || "Unknown",
      email: emp.email || "",
      phone: emp.mobile || emp.phone || "",
      code: emp.employeeCode || "",
      role: emp.designationId?.title || "N/A",
      dept: emp.departmentId?.name || emp.departmentId?.title || "N/A",
      kpis: emp.kpis?.length
        ? emp.kpis
        : [
            {
              id: Math.random().toString(36).slice(2, 9),
              title:
                "KPI " + (emp.employeeName || emp.name || "").split(" ")[0],
              target: Math.floor(Math.random() * 100) + 20,
              achieved: Math.floor(Math.random() * 50),
            },
          ],
    }));

    setEmployees(mapped);
  }, [employeeData]);
  const [q, setQ] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    empId: "",
    title: "",
    target: "",
    achieved: "",
  });
  const [editing, setEditing] = useState(null);

  const filtered = employees.filter((e) => {
    const searchMatch = (e.name + " " + e.role)
      .toLowerCase()
      .includes(q.toLowerCase());
    const filterMatch = filterDept ? e.dept === filterDept : true;
    return searchMatch && filterMatch;
  });

  const pct = (t, a) => (t ? Math.round((a / t) * 100) : 0);

  // const openCreate = (empId = "") => {
  //     setEditing(null);
  //     setForm({ empId, title: "", target: "", achieved: "" });
  //     setShowForm(true);
  // };

  const openEdit = (empId, kpi) => {
    setEditing({ empId, kpiId: kpi.id });
    setForm({
      empId,
      title: kpi.title,
      target: kpi.target,
      achieved: kpi.achieved,
    });
    setShowForm(true);
  };

  const save = (e) => {
    e.preventDefault();
    const { empId, title, target, achieved } = form;
    if (!empId || !title) return alert("Select employee & title");

    setEmployees((prev) =>
      prev.map((emp) => {
        if (String(emp.id) !== String(empId)) return emp;
        if (editing) {
          return {
            ...emp,
            kpis: emp.kpis.map((k) =>
              k.id === editing.kpiId
                ? { ...k, title, target: +target, achieved: +achieved }
                : k
            ),
          };
        }
        const newK = {
          id: Math.random().toString(36).slice(2, 9),
          title,
          target: +target,
          achieved: +achieved,
        };
        return { ...emp, kpis: [newK, ...emp.kpis] };
      })
    );

    toast.success("KPI saved successfully!");
    setShowForm(false);
    setForm({ empId: "", title: "", target: "", achieved: "" });
    setEditing(null);
  };

  const del = (empId, kpiId) => {
    if (!confirm("Delete this KPI?")) return;
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === empId
          ? { ...emp, kpis: emp.kpis.filter((k) => k.id !== kpiId) }
          : emp
      )
    );
    toast.success("KPI deleted successfully!");
  };

  // Get unique departments for filter dropdown
  const departments = [...new Set(employees.map((e) => e.dept))];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      {isLoading && (
        <div className="text-center py-10 text-lg font-semibold">
          Loading employees...
        </div>
      )}
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <PageHeader title="KPI Management" />

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 mt-4">
          <div className="flex items-center gap-3">
            {/* <div className="relative">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search employee or role..."
                className="pl-10 pr-3 py-2 border rounded-lg w-64 focus:ring-1 focus:ring-indigo-500"
              />
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            </div> */}
          </div>
          <div className="flex items-center gap-2 border rounded-lg overflow-hidden bg-white">
            <Funnel className="w-5 h-5 text-gray-500 ml-2" />
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="py-2 px-2 focus:outline-none"
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            {/* <button
                        onClick={() => openCreate()}
                        className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                    >
                        <Plus className="w-4 h-4" /> Add KPI
                    </button> */}
          </div>
        </div>

        {/* Dynamic Table */}
        <Table
          key={filtered.length}
          data={filtered.flatMap((emp) =>
            emp.kpis.map((kpi) => ({
              id: `${emp.id}-${kpi.id}`,
              empId: emp.id,
              employee: emp.name,
              designation: emp.role,
              department: emp.dept,
              title: kpi.title,
              target: kpi.target,
              achieved: kpi.achieved,
              percentage: pct(kpi.target, kpi.achieved),
              kpiId: kpi.id,
              fullRow: { emp, kpi },
            }))
          )}
          columnConfig={{
            employee: { label: "Employee" },
            designation: { label: "Designation" },
            department: { label: "Department" },
            title: { label: "KPI Title" },
            target: { label: "Target" },
            achieved: { label: "Achieved" },
            percentage: { label: "% Achieved" },
            actions: {
              label: "Actions",
              render: (_, row) => (
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => openEdit(row.empId, row.fullRow.kpi)}
                    className="p-1 rounded-md hover:bg-gray-200"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => del(row.empId, row.kpiId)}
                    className="p-1 rounded-md hover:bg-gray-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ),
            },
          }}
        />

        {/* KPI Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">
                  {editing ? "Edit KPI" : "Add KPI"}
                </h3>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditing(null);
                  }}
                  className="text-gray-500 hover:text-gray-800"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={save} className="space-y-4">
                <div>
                  <label className="text-xs text-gray-600">Employee</label>
                  <select
                    required
                    disabled={!!editing}
                    value={form.empId}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, empId: e.target.value }))
                    }
                    className="w-full mt-1 py-2 px-3 border rounded-lg focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Select employee</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} — {emp.role}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-600">KPI Title</label>
                  <input
                    required
                    value={form.title}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^A-Za-z ]/g, "");
                      setForm((f) => ({ ...f, title: val }));
                    }}
                    placeholder="Enter KPI Title"
                    className="w-full mt-1 py-2 px-3 border rounded-lg focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-600">Target</label>
                    <input
                      type="number"
                      value={form.target}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, target: e.target.value }))
                      }
                      className="w-full mt-1 py-2 px-3 border rounded-lg focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Achieved</label>
                    <input
                      type="number"
                      value={form.achieved}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, achieved: e.target.value }))
                      }
                      className="w-full mt-1 py-2 px-3 border rounded-lg focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditing(null);
                    }}
                    className="px-4 py-2 rounded-lg border hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(KPIManagementTable);
