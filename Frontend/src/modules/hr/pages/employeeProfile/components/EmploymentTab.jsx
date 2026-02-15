import React from "react";

function EmploymentTab({ employee }) {
    const renderValue = (val) => {
    if (!val) return "N/A";
    if (typeof val === "object") {
 
      return val.name || val.email || JSON.stringify(val);
    }
    return val;
  };
  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Employment</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Zone Name </p>
            <p className="text-gray-900 font-medium">{renderValue(employee?.zoneId?.title)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">State Name</p>
            <p className="text-gray-900 font-medium">{renderValue(employee?.stateId?.title)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">City Name</p>
            <p className="text-gray-900 font-medium">{renderValue(employee?.cityId?.title)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Branch Name</p>
            <p className="text-gray-900 font-medium">{renderValue(employee?.branchId?.title)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Department Name</p>
            <p className="text-gray-900 font-medium">{renderValue(employee?.departmentId?.title)}</p>
          </div>
         
          <div>
            <p className="text-sm text-gray-500">Designation Name</p>
            <p className="text-gray-900 font-medium">{renderValue(employee?.designationId?.title)}</p>
          </div>
         
        </div>
      </div>
    </div>
  );
}

export default EmploymentTab;
