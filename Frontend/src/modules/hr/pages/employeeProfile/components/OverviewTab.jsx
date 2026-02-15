export default function OverviewTab({ employee }) {
  
  return (
    <div className="space-y-6">
      {/* Basic Info Card */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Employee Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Employee ID</p>
            <p className="text-gray-900 font-medium">{employee.employeeId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="text-gray-900 font-medium">{employee.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Department</p>
            <p className="text-gray-900 font-medium">
              {employee?.departmentId?.title}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Employee Type</p>
            <p className="text-gray-900 font-medium">{employee.employeeType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="text-gray-900 font-medium">{employee.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Gender</p>
            <p className="text-gray-900 font-medium">{employee.gender}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">City</p>
            <p className="text-gray-900 font-medium">
              {employee?.cityId?.title}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">State</p>
            <p className="text-gray-900 font-medium">
              {employee?.stateId?.title}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Country</p>
            <p className="text-gray-900 font-medium">{employee.country}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Joining Date</p>
            <p className="text-gray-900 font-medium">
              {employee.joiningDate
                ? new Date(employee.joiningDate).toLocaleDateString("en-IN")
                : "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Stats / KPIs Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
          <p className="text-sm text-gray-500">Projects</p>
          <p className="text-2xl font-semibold text-gray-900">12</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
          <p className="text-sm text-gray-500">Leaves Taken</p>
          <p className="text-2xl font-semibold text-gray-900">5</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
          <p className="text-sm text-gray-500">Pending Tasks</p>
          <p className="text-2xl font-semibold text-gray-900">3</p>
        </div>
      </div>

      {/* About / Short Bio */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h3 className="text-lg font-semibold mb-2">About</h3>
        <p className="text-gray-700 text-sm">
          John Doe is a full-time employee in the Sales department, currently
          onboarding and actively contributing to client acquisition and
          internal projects. He joined the company on{" "}
          {employee.joiningDate
            ? new Date(employee.joiningDate).toLocaleDateString("en-IN")
            : "-"}{" "}
          and has shown excellent performance in early tasks.
        </p>
      </div>
    </div>
  );
}
