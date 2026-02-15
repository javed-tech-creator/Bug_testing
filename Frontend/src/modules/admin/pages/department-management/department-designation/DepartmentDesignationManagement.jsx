import React, { useState, useEffect, useRef } from "react";
import {
  useGetActionGroupsQuery,
  useGetDepartmentsQuery,
  useGetDesignationsQuery,
} from "@/api/admin/department-management/department-designation/department.api";
import Department from "@/modules/admin/components/department-management/department-designation/Department";
import Designation from "@/modules/admin/components/department-management/department-designation/Designation";
import DataLoading from "@/modules/vendor/components/DataLoading";

const DepartmentDesignationManagement = () => {
  const [activeTab, setActiveTab] = useState("department");
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });
  const tabContainerRef = useRef(null);

  //  API calls
  const {
    data: departmentData,
    isLoading: departmentLoading,
    isError: departmentError,
  } = useGetDepartmentsQuery();
  const {
    data: designationData,
    isLoading: designationLoading,
    isError: designationError,
  } = useGetDesignationsQuery();


  const departments = departmentData?.data || [];
  const designations = designationData?.data || [];
 

  const isAnyLoading =
    departmentLoading || designationLoading;

  const tabs = [
    { id: "department", label: "Department", count: departments.length },
    { id: "designation", label: "Designation", count: designations.length },
  ];

  // Indicator flow setup — same logic as LocationHeirarchy
  useEffect(() => {
    const updateIndicator = () => {
      const activeButton = tabContainerRef.current?.querySelector(
        `[data-tab="${activeTab}"]`
      );
      if (activeButton) {
        const { offsetLeft, offsetWidth } = activeButton;
        setIndicatorStyle({
          left: offsetLeft,
          width: offsetWidth,
          opacity: 1,
          transition: "all 0.4s ease",
        });
      }
    };

    const timer = setTimeout(updateIndicator, 50);
    window.addEventListener("resize", updateIndicator);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateIndicator);
    };
  }, [activeTab, departmentData, designationData]);

  //  Content renderer
  const renderContent = () => {
    switch (activeTab) {
      case "department":
        return (
          <Department departments={departments} isError={departmentError} />
        );
      case "designation":
        return (
          <Designation designations={designations} isError={designationError} />
        );
      default:
        return null;
    }
  };

  if (isAnyLoading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <DataLoading />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/*  Sticky Header with Smooth Flow */}
      <div className="sticky top-0 z-20 bg-white shadow-sm border-b border-gray-200 backdrop-blur-md p-2">
        <div className="px-6">
          <div
            ref={tabContainerRef}
            className="relative flex justify-start gap-3 overflow-x-auto scrollbar-hide"
          >
            {/* Flowing Indicator Background */}
            <span
              className="absolute top-0 bottom-0 bg-black rounded-xl transition-all duration-500 ease-in-out"
              style={indicatorStyle}
            ></span>

            {/* Tabs */}
            {tabs.map((tab) => (
              <button
                key={tab.id}
                data-tab={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative z-10 px-6 py-2 text-sm font-semibold tracking-wide rounded-xl transition-all duration-300
                ${
                  activeTab === tab.id
                    ? "text-white"
                    : "text-black hover:bg-gray-200 hover:text-black cursor-pointer"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/*  Tab Content */}
      <div className="p-4 animate-fadeIn">{renderContent()}</div>
    </div>
  );
};

export default DepartmentDesignationManagement;
