import React, { useState, useEffect, useRef } from "react";
import {
  useGetBranchesQuery,
  useGetCitiesQuery,
  useGetStatesQuery,
  useGetZonesQuery,
} from "@/api/admin/department-management/location-heirarchy/master.api";

import Branch from "@/modules/admin/components/department-management/location-heirarchy/Branch";
import City from "@/modules/admin/components/department-management/location-heirarchy/City";
import State from "@/modules/admin/components/department-management/location-heirarchy/State";
import Zone from "@/modules/admin/components/department-management/location-heirarchy/Zone";
import DataLoading from "@/modules/vendor/components/DataLoading";

const LocationHeirarchy = () => {
  const [activeTab, setActiveTab] = useState("zone");
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });
  const tabContainerRef = useRef(null);

  // API calls
  const { data: zoneData, isLoading: zoneLoading, isError: zoneError } = useGetZonesQuery();
  const { data: stateData, isLoading: stateLoading, isError: stateError } = useGetStatesQuery();
  const { data: citiesData, isLoading: citiesLoading, isError: citiesError } = useGetCitiesQuery();
  const { data: branchData, isLoading: branchLoading, isError: branchError } = useGetBranchesQuery();

  const zones = zoneData?.data || [];
  const states = stateData?.data || [];
  const cities = citiesData?.data || [];
  const branches = branchData?.data || [];

  const isAnyLoading = zoneLoading || stateLoading || citiesLoading || branchLoading;

  const tabs = [
    { id: "zone", label: "Zone", count: zones.length },
    { id: "state", label: "State", count: states.length },
    { id: "city", label: "City", count: cities.length },
    { id: "branch", label: "Branch/Unit", count: branches.length },
  ];

  // ✅ Update indicator when active tab or data changes
  useEffect(() => {
    const updateIndicator = () => {
      const activeButton = tabContainerRef.current?.querySelector(`[data-tab="${activeTab}"]`);
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

    // Delay slightly to ensure layout rendered
    const timer = setTimeout(updateIndicator, 50);

    window.addEventListener("resize", updateIndicator);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateIndicator);
    };
  }, [
    activeTab,
    zoneData, //  important: include data
    stateData,
    citiesData,
    branchData,
  ]);

  // ✅ Render correct tab content
  const renderContent = () => {
    switch (activeTab) {
      case "zone":
        return <Zone zones={zones} isError={zoneError} />;
      case "state":
        return <State states={states} isError={stateError} />;
      case "city":
        return <City citiesdata={cities} isError={citiesError} zones={zones} />;
      case "branch":
        return <Branch branches={branches} isError={branchError} />;
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
    <div className="w-full">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white shadow-sm border-b border-gray-200 backdrop-blur-md">
        <div className="px-6 py-2">
          <div
            ref={tabContainerRef}
            className="relative flex justify-start gap-3 overflow-x-auto scrollbar-hide"
          >
            {/* Flowing Black Background */}
            <span
              className="absolute top-0 bottom-0 bg-black rounded-xl transition-all duration-500 ease-in-out"
              style={indicatorStyle}
            ></span>

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

      {/* Content */}
      <div className="p-3 animate-fadeIn">{renderContent()}</div>
    </div>
  );
};

export default LocationHeirarchy;
