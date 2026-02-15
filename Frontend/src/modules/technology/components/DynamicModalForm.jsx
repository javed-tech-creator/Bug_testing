import { User, ArrowRight, UserCheck } from "lucide-react";
import React from "react";
import { FaSpinner } from "react-icons/fa";

const AssignModal = ({
  isOpen,
  closeModal,
  type = "assign",
  departments = [],
  roles = [],
  employees = [],
  isLoading,
  updateLoading,
  onSubmit,
}) => {
  const [department, setDepartment] = React.useState("");
  const [role, setRole] = React.useState("");
  const [employee, setEmployee] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

      // lookup by id → name nikalna
  const departmentName = departments.find((d) => d._id === department)?.name || "";
  const roleName = roles.find((r) => r._id === role)?.name || "";
  const employeeName = employees.find((emp) => emp._id === employee)?.name || "";

    await onSubmit({ department:departmentName, role:roleName, name: employeeName,employeeId:"68c52cb182e6b127de95a4a6" },type);
    setRole("");
    setDepartment("");
    setEmployee("");
  };

  // Title & icon map
  const modalConfig = {
    assign: {
      title: "Assign To",
      icon: <UserCheck size={18} className="text-orange-500" />,
      buttonText: "Submit",
    },
    reassign: {
      title: "Reassign to Another",
      icon: (
        <div className="flex items-center gap-1 text-orange-500">
          <User size={18} />
          <ArrowRight size={18} />
          <User size={18} />
        </div>
      ),
      buttonText: "Update",
    },
  };

  // Update button enable logic
  const canUpdate =
    department && role && employee && !isLoading && !updateLoading;

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="bg-white rounded-lg w-full max-w-md shadow-lg p-6 relative">
          {/* Close button */}
          <button
            onClick={() => {
              setRole("");
              setDepartment("");
              setEmployee("");
              closeModal();
            }}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          >
            ✖
          </button>

          {/* Title */}
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            {modalConfig[type].icon} {modalConfig[type].title}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Department */}
            <div>
              <label className="block text-gray-700 mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  setRole(""); // reset role
                  setEmployee(""); // reset employee
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400"
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Role */}
            <div>
              <label className="block text-gray-700 mb-1">Role</label>
              <select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  setEmployee(""); // reset employee
                }}
                disabled={!department}
                className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 ${
                  !department
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white text-black"
                }`}
              >
                <option value="">Select Role</option>
                {roles
                  .filter((r) => r.departmentId === department)
                  .map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Employee */}
            <div>
              <label className="block text-gray-700 mb-1">Employee</label>
              <select
                value={employee}
                onChange={(e) => setEmployee(e.target.value)}
                disabled={!department || !role}
                className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 ${
                  !department || !role
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-white text-black"
                }`}
              >
                <option value="">Select Employee</option>
                {employees
                  .filter((emp) => emp.roleId === role)
                  .map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Footer buttons */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!canUpdate}
                className={`px-4 py-2 rounded-lg text-white ${
                  !canUpdate
                    ? "bg-orange-300 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600"
                }`}
              >
                {isLoading || updateLoading ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  modalConfig[type].buttonText
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default AssignModal;
