import React, { useEffect, useState } from "react";
import WorkSection from "./WorkSection";

export default function DepartmentSection({ department, index, onChange }) {
  const [open, setOpen] = useState(true); //  Default open (no need for click)

  useEffect(() => {
    // Automatically open when department or works change
    if (department) setOpen(true);
  }, [department]);

  const handleWorkChange = (updatedWorks) => {
    onChange({ ...department, works: updatedWorks });
  };

  return (
    <div className="border border-gray-200 rounded-md bg-white shadow-sm overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-3 bg-orange-50 border-b border-gray-200">
        <h4 className="font-semibold text-gray-800 text-sm sm:text-base truncate">
          {department?.departmentName}
        </h4>
      </div>

      {/* Always visible Work Section */}
      <div className="bg-white p-4 transition-all duration-500 ease-in-out">
        <WorkSection
          works={department?.works || []}
          onChange={handleWorkChange}
        />
      </div>
    </div>
  );
}
