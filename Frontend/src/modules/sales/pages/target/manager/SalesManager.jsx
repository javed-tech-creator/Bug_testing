import React, { useEffect, useState } from "react";
import {
  Users,
  Target,
  ChevronDown,
  ChevronUp,
  Eye,
  X,
  Calendar,
  User,
  TrendingUp,
  CheckCircle
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { useSelector } from "react-redux";
import { useAssignTargetMutation, useGetEmployeByDepartmentQuery, useTargetByDeparmentIdQuery } from "@/api/sales/target.api.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const QUARTERS = {
  Q1: ["April", "May", "June"],
  Q2: ["July", "August", "September"],
  Q3: ["October", "November", "December"],
  Q4: ["January", "February", "March"],
};

const getCurrentFYQuarterMonth = () => {
  const d = new Date();
  const m = d.getMonth(); // 0-11
  const y = d.getFullYear();

  const fy = m >= 3
    ? `${y}-${String(y + 1).slice(-2)}`
    : `${y - 1}-${String(y).slice(-2)}`;

  const months = [
    "January", "February", "March",
    "April", "May", "June",
    "July", "August", "September",
    "October", "November", "December"
  ];

  const quarter =
    ["April", "May", "June"].includes(months[m]) ? "Q1" :
      ["July", "August", "September"].includes(months[m]) ? "Q2" :
        ["October", "November", "December"].includes(months[m]) ? "Q3" :
          "Q4";

  return { fy, quarter, month: months[m] };
};


const EmployeeDetailModal = ({ employee, data, onClose, fy, quarter, month }) => {
  const [selectedMonth, setSelectedMonth] = useState(month || "April");
  const [selectedQuarter, setSelectedQuarter] = useState(quarter || "Q1");
  const [selectedFy, setSelectedFy] = useState(fy || "2024-25");

  const getQuarterMonths = () => QUARTERS[selectedQuarter] || [];

  const getMonthData = (monthName) => {
    return data?.[monthName] || {
      financialYear: selectedFy,
      quarter: selectedQuarter,
      month: monthName,
      monthlyTarget: 0,
      achieved: 0,
    };
  };

  const calculateAchievement = (target, achieved) => {
    if (!target) return 0;
    return Math.round((achieved / target) * 100);
  };

  return (
    <div className="fixed inset-0 bg-black/30  backdrop-blur-[1px] flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="border-b p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold flex items-center">
              <User className="h-5 w-5 mr-2" />
              {employee?.name}
            </h2>
            <p className="text-gray-600 text-sm">{employee?.designation}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b bg-gray-50">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Financial Year
              </label>
              <select
                className="w-full p-2 border rounded-lg"
                value={selectedFy}
                onChange={(e) => setSelectedFy(e.target.value)}
              >
                <option value="2025-26">2025-26</option>
                <option value="2026-27">2026-27</option>
                <option value="2027-28">2027-28</option>
                <option value="2028-29">2028-29</option>
                <option value="2029-30">2029-30</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quarter
              </label>
              <select
                className="w-full p-2 border rounded-lg"
                value={selectedQuarter}
                onChange={(e) => {
                  setSelectedQuarter(e.target.value);
                  setSelectedMonth(QUARTERS[e.target.value][0]);
                }}
              >
                {Object.keys(QUARTERS).map((q) => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Month
              </label>
              <select
                className="w-full p-2 border rounded-lg"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {getQuarterMonths().map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Selected Month Details */}
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            {selectedMonth} {selectedFy} Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Target Card */}
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
              <div className="flex items-center mb-2">
                <Target className="h-5 w-5 text-orange-600 mr-2" />
                <h4 className="font-medium text-orange-800">Monthly Target</h4>
              </div>
              <p className="text-2xl font-bold text-orange-900">
                ₹{getMonthData(selectedMonth).monthlyTarget} L
              </p>
              <p className="text-sm text-orange-600 mt-1">Quarter: {selectedQuarter}</p>
            </div>

            {/* Achievement Card */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="flex items-center mb-2">
                <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                <h4 className="font-medium text-green-800">Achieved</h4>
              </div>
              <p className="text-2xl font-bold text-green-900">
                ₹{getMonthData(selectedMonth).achieved} L
              </p>
              <p className="text-sm text-green-600 mt-1">
                {getMonthData(selectedMonth).achieved} Lakhs
              </p>
            </div>

            {/* Performance Card */}
            <div className={`p-4 rounded-lg border ${calculateAchievement(
              getMonthData(selectedMonth).monthlyTarget,
              getMonthData(selectedMonth).achieved
            ) >= 100
              ? 'bg-emerald-50 border-emerald-100'
              : 'bg-amber-50 border-amber-100'
              }`}>
              <div className="flex items-center mb-2">
                <CheckCircle className="h-5 w-5 text-emerald-600 mr-2" />
                <h4 className="font-medium text-emerald-800">Achievement %</h4>
              </div>
              <p className={`text-2xl font-bold ${calculateAchievement(
                getMonthData(selectedMonth).monthlyTarget,
                getMonthData(selectedMonth).achieved
              ) >= 100
                ? 'text-emerald-900'
                : 'text-amber-900'
                }`}>
                {calculateAchievement(
                  getMonthData(selectedMonth).monthlyTarget,
                  getMonthData(selectedMonth).achieved
                )}%
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className={`h-2 rounded-full ${calculateAchievement(
                    getMonthData(selectedMonth).monthlyTarget,
                    getMonthData(selectedMonth).achieved
                  ) >= 100
                    ? 'bg-emerald-500'
                    : 'bg-amber-500'
                    }`}
                  style={{
                    width: `${Math.min(
                      calculateAchievement(
                        getMonthData(selectedMonth).monthlyTarget,
                        getMonthData(selectedMonth).achieved
                      ),
                      100
                    )}%`
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Quarter Summary */}
          <div className="mt-8">
            <h4 className="font-semibold mb-4">Quarter {selectedQuarter} Summary</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left">Month</th>
                    <th className="p-3 text-left">Target (₹ L)</th>
                    <th className="p-3 text-left">Achieved (₹ L)</th>
                    <th className="p-3 text-left">Achievement %</th>
                    <th className="p-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {getQuarterMonths().map((monthName) => {
                    const monthData = getMonthData(monthName);
                    const achievement = calculateAchievement(
                      monthData.monthlyTarget,
                      monthData.achieved
                    );

                    return (
                      <tr key={monthName} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{monthName}</td>
                        <td className="p-3">₹{monthData.monthlyTarget}</td>
                        <td className="p-3">₹{monthData.achieved}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${achievement >= 100
                            ? 'bg-emerald-100 text-emerald-800'
                            : achievement >= 75
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-red-100 text-red-800'
                            }`}>
                            {achievement}%
                          </span>
                        </td>
                        <td className="p-3">
                          {achievement >= 100 ? (
                            <span className="flex items-center text-emerald-600">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Achieved
                            </span>
                          ) : (
                            <span className="text-amber-600">In Progress</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Employee Card Component
const EmployeeCard = ({ employee, targets, onViewDetails }) => {
  const employeeData = targets[employee._id] || {};
  const monthsAssigned = Object.keys(employeeData);
  const totalTarget = monthsAssigned.reduce(
    (sum, month) => sum + (employeeData[month]?.monthlyTarget || 0),
    0
  );
  const totalAchieved = monthsAssigned.reduce(
    (sum, month) => sum + (employeeData[month]?.achieved || 0),
    0
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Card Header */}
      <div className="p-4 border-b">
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold`}>
            {employee.name.charAt(0)}
          </div>
          <div className="ml-3">
            <h3 className="font-semibold">{employee.name}</h3>
            <p className="text-sm text-gray-600">{employee.designation}</p>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-800">{totalAchieved}</p>
            <p className="text-xs text-gray-600">Monthly Achieved</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-800">₹{totalTarget}</p>
            <p className="text-xs text-gray-600">Total Target (L)</p>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Target vs Achieved</span>
            <span className="font-medium">
              ₹{totalAchieved}L / ₹{totalTarget}L
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-orange-600 h-2 rounded-full"
              style={{
                width: totalTarget > 0
                  ? `${Math.min((totalAchieved / totalTarget) * 100, 100)}%`
                  : '0%'
              }}
            ></div>
          </div>
        </div>

        {/* View Details Button */}
        <button
          onClick={() => onViewDetails(employee._id)}
          className="w-full flex items-center justify-center gap-2 bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition-colors"
        >
          <Eye className="h-4 w-4" />
          View Details
        </button>
      </div>
    </div>
  );
};

const ManagerTargetPage = () => {
  const [employeeTargets, setEmployeeTargets] = useState({});
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const current = getCurrentFYQuarterMonth();
  const [fy, setFy] = useState(current.fy);
  const [quarter, setQuarter] = useState(current.quarter);
  const [month, setMonth] = useState(current.month);
  const [monthlyTarget, setMonthlyTarget] = useState("");
  const [expanded, setExpanded] = useState({ assign: true });
  const [viewEmployee, setViewEmployee] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [targetFilter, setTargetFilter] = useState("");
  const [sortMonth, setSortMonth] = useState(current.month);

  const res = useSelector((state) => state.auth.userData);
  const user = res?.user || {}
  const deptId = user?.department?._id;
  const { data } = useGetEmployeByDepartmentQuery({ deptId }, { skip: !deptId });
  const employees = data?.data?.users || [];
  const [assignTarget] = useAssignTargetMutation();

  const targetQuery = `departmentId=${user?.department?._id}&financialYear=${fy}&quarter=${quarter}&month=${month}`;

  const { data: targetData } =
    useTargetByDeparmentIdQuery(
      { query: targetQuery },
      { skip: !user?.department?._id }
    );

  const employeeTargetData = targetData?.data || [];

  useEffect(() => {
    if (!employeeTargetData?.length) {
      setEmployeeTargets({});
      return;
    }

    const normalized = {};

    employeeTargetData.forEach(item => {
      const empId = item.executiveId?._id;
      if (!empId) return;

      if (!normalized[empId]) {
        normalized[empId] = {};
      }

      normalized[empId][item.month] = {
        financialYear: item.financialYear,
        quarter: item.quarter,
        month: item.month,
        monthlyTarget: item.monthlyTarget
          ? +(item.monthlyTarget / 100000).toFixed(2)
          : 0,
        achieved: item.achieved
          ? +(item.achieved / 100000).toFixed(2)
          : 0,
        status: item.status || "not_assigned",
        slotTargets: item.slotTargets || []
      };
    });

    setEmployeeTargets(normalized);
  }, [employeeTargetData]);

  const handleAssign = async () => {
    if (!selectedEmployee) {
      toast.error("Please select an employee.");
      return;
    }
    if (!monthlyTarget) {
      toast.error("Please enter monthly target.");
      return;
    }
    if (isNaN(monthlyTarget) || monthlyTarget <= 0) {
      toast.error("Please enter a valid target amount.");
      return;
    }

    const selectedEmp = employees.find(e => e._id == selectedEmployee);

    if (!selectedEmp) {
      toast.error("Selected employee not found.");
      return;
    }

    // Prepare data for API
    const formData = {
      executiveId: selectedEmployee,
      financialYear: fy,
      quarter,
      month,
      monthlyTarget: Math.round(Number(monthlyTarget) * 100000),
      employeeName: selectedEmp.name,
      departmentId: deptId,
      managerId: user._id,
    };

    try {
      // Show loading toast
      const toastId = toast.loading("Assigning target...");

      // API call
      const response = await assignTarget({ formData }).unwrap();

      // Update local state with response data
      setEmployeeTargets(prev => {
        const emp = prev[selectedEmployee] || {};
        return {
          ...prev,
          [selectedEmployee]: {
            ...emp,
            [month]: {
              financialYear: fy,
              quarter,
              month,
              monthlyTarget: Number(monthlyTarget),
              achieved: emp[month]?.achieved || 0,
              assignedDate: new Date().toISOString(),
              employeeName: selectedEmp.name,
              // Add API response ID if needed
              _id: response.data?._id || Date.now().toString()
            }
          }
        };
      });

      setMonthlyTarget("");

      // Update toast to success
      toast.update(toastId, {
        render: `Target assigned to ${selectedEmp.name} for ${month} ${fy}`,
        type: "success",
        isLoading: false,
        autoClose: 3000
      });

    } catch (error) {
      console.error("Error assigning target:", error);

      // Show error toast
      toast.error(error?.data?.message || "Failed to assign target. Please try again.", {
        autoClose: 4000
      });
    }
  };

  const getEmployeeMonthData = (empId) => employeeTargets[empId] || {};

  const filteredEmployees = [...employees]
    .filter(emp => {
      if (
        selectedFilters.name &&
        !emp.name.toLowerCase().includes(selectedFilters.name.toLowerCase())
      ) return false;
      return true;
    })
    .sort((a, b) => {
      if (!targetFilter && !sortMonth) return 0;

      const aData = employeeTargets[a._id]?.[sortMonth] || {};
      const bData = employeeTargets[b._id]?.[sortMonth] || {};

      const aTarget = aData.monthlyTarget || 0;
      const bTarget = bData.monthlyTarget || 0;

      if (targetFilter === "max") return bTarget - aTarget;
      if (targetFilter === "min") return aTarget - bTarget;

      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* Add ToastContainer at the top level */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <PageHeader title="Sales Target Management" />

      {/* Filters */}
      <div className="bg-white rounded-lg border p-3 pb-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Employee
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg"
              placeholder="Search by name..."
              onChange={(e) => setSelectedFilters(prev => ({
                ...prev,
                name: e.target.value
              }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Target
            </label>
            <select
              className="w-full p-2 border rounded-lg"
              onChange={(e) => setTargetFilter(e.target.value)}
            >
              <option value="">None</option>
              <option value="max">Max Target</option>
              <option value="min">Min Target</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort By Month (Current Quarter)
            </label>
            <select
              className="w-full p-2 border rounded-lg"
              onChange={(e) => setSortMonth(e.target.value)}
            >
              <option value="">None</option>
              {QUARTERS[quarter].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Assign Target */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border mb-6 sticky top-6">
            <div
              className="p-4 border-b flex justify-between items-center cursor-pointer bg-gray-50"
              onClick={() => setExpanded(p => ({ ...p, assign: !p.assign }))}
            >
              <h3 className="font-semibold flex items-center text-gray-800">
                <Target className="h-5 w-5 mr-2" /> Assign New Target
              </h3>
              {expanded.assign ? <ChevronUp /> : <ChevronDown />}
            </div>

            {expanded.assign && (
              <div className="p-4 space-y-4">
                {/* Select Employee */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Employee *
                  </label>
                  <select
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                  >
                    <option value="">Choose Employee</option>
                    {employees.map((e) => (
                      <option key={e._id} value={e._id}>{e.name}</option>
                    ))}
                  </select>
                </div>

                {/* FY & Quarter */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Financial Year
                    </label>
                    <select
                      className="w-full p-2 border rounded-lg"
                      value={fy}
                      onChange={(e) => setFy(e.target.value)}
                    >
                      <option value="2025-26">2025-26</option>
                      <option value="2026-27">2026-27</option>
                      <option value="2027-28">2027-28</option>
                      <option value="2028-29">2028-29</option>
                      <option value="2029-30">2029-30</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quarter
                    </label>
                    <select
                      className="w-full p-2 border rounded-lg"
                      value={quarter}
                      onChange={(e) => {
                        setQuarter(e.target.value);
                        setMonth(QUARTERS[e.target.value][0]);
                      }}
                    >
                      {Object.keys(QUARTERS).map((q) => (
                        <option key={q} value={q}>{q}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Month */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Month
                  </label>
                  <select
                    className="w-full p-2 border rounded-lg"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                  >
                    {QUARTERS[quarter].map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </div>

                {/* Monthly Target */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Target (₹ Lacs) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                    <input
                      type="number"
                      min="1"
                      step="0.5"
                      className="w-full p-2 pl-8 border rounded-lg"
                      placeholder="Enter amount in lakhs"
                      value={monthlyTarget}
                      onChange={(e) => setMonthlyTarget(e.target.value)}
                    />
                    <span className="absolute right-3 top-2.5 text-gray-500">L</span>
                  </div>
                </div>

                <button
                  className="w-full bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                  onClick={handleAssign}
                >
                  Assign Target
                </button>

                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Stats</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="text-lg font-bold">{Object.keys(employeeTargets).length}</p>
                      <p className="text-xs text-gray-600">Employees</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <p className="text-lg font-bold">
                        {Object.values(employeeTargets).reduce((sum, emp) => sum + Object.keys(emp).length, 0)}
                      </p>
                      <p className="text-xs text-gray-600">Assignments</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Employee Grid */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border">
            <div className="p-4 border-b">
              <h3 className="font-semibold flex items-center text-gray-800">
                <Users className="h-5 w-5 mr-2" /> Team Members ({filteredEmployees.length})
              </h3>
            </div>

            {/* Employee Grid - Responsive 3 columns */}
            <div className="p-4">
              {filteredEmployees.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
                  <p className="text-gray-500">Try adjusting your filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredEmployees.map((emp) => (
                    <EmployeeCard
                      key={emp._id}
                      employee={emp}
                      targets={employeeTargets}
                      onViewDetails={setViewEmployee}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {viewEmployee && (
        <EmployeeDetailModal
          employee={employees.find(e => e._id === viewEmployee)}
          data={getEmployeeMonthData(viewEmployee)}
          onClose={() => setViewEmployee(null)}
          fy={fy}
          quarter={quarter}
          month={month}
        />
      )}
    </div>
  );
};

export default ManagerTargetPage;