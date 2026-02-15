import React, { useState } from "react";
import DepartmentSection from "./DepartmentSection";

export default function PhaseSection({ phase, index, onChange }) {
  const [activeDept, setActiveDept] = useState(0);

  const handleDepartmentChange = (deptIndex, updatedDept) => {
    const newDepartments = [...phase.departments];
    newDepartments[deptIndex] = updatedDept;
    onChange(index, { ...phase, departments: newDepartments });
  };

  return (
    <div className="border border-gray-200 rounded-md bg-white shadow-sm overflow-hidden transition-all duration-300">
      {/* Phase Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-orange-50 to-white border-b border-gray-200 rounded-t-2xl flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 tracking-wide">
          {phase.phaseName}
        </h3>
      </div>

      {/* Department Selector */}
      <div className="p-6 bg-gray-50 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-5 gap-3">
          <label className="text-gray-700 font-medium text-sm sm:text-base">
            Select Department:
          </label>
          <select
            className="w-full sm:w-72 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none shadow-sm transition"
            value={activeDept}
            onChange={(e) => setActiveDept(Number(e.target.value))}
          >
            {(phase?.departments || []).map((dept, i) => (
              <option key={i} value={i}>
                {dept.departmentName}
              </option>
            ))}
          </select>
        </div>

        {/* Department Section */}
          <DepartmentSection
            department={phase.departments[activeDept]}
            index={activeDept}
            onChange={(updatedDept) =>
              handleDepartmentChange(activeDept, updatedDept)
            }
          />
      </div>
    </div>
  );
}
