// SalesReportingWrapper.js - Main wrapper with toggle functionality only
import React, { useState, useEffect } from "react";
import MorningSalesForm from "../MorningReportingForm";
import EveningSalesForm from "../EveningReportingForm";
import PageHeader from "../../../components/PageHeader";
import MorningReportManager from "./MorningReportManager";
import EveningReportManager from "./EveningReportManager";

const SalesReportingWrapper = () => {
  const [currentShift, setCurrentShift] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const shiftFromUrl = urlParams.get("shift");
    if (shiftFromUrl) {
      return (
        shiftFromUrl.charAt(0).toUpperCase() +
        shiftFromUrl.slice(1).toLowerCase()
      );
    }
    const hour = new Date().getHours();
    return hour < 12 ? "Morning" : "Evening";
  });

  const handleShiftChange = (newShift) => {
    setCurrentShift(newShift);

    const url = new URL(window.location);
    url.searchParams.set("shift", newShift.toLowerCase());
    window.history.pushState({}, "", url);
  };

  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const shiftFromUrl = urlParams.get("shift");
      if (shiftFromUrl) {
        setCurrentShift(
          shiftFromUrl.charAt(0).toUpperCase() +
            shiftFromUrl.slice(1).toLowerCase()
        );
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <div className="">
      <PageHeader title="Daily Sales Reporting" />

      <div className="relative bg-gray-100  p-1 rounded-lg mb-4 max-w-xs mx-auto">
        <div
          className={`absolute top-1 bottom-1 bg-black rounded-md transition-all duration-300 ease-in-out ${
            currentShift === "Morning" ? "left-1 right-1/2" : "left-1/2 right-1"
          }`}
        />

        {/* Tab Buttons */}
        <div className="relative flex">
          <button
            type="button"
            onClick={() => handleShiftChange("Morning")}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-300 ease-in-out ${
              currentShift === "Morning"
                ? "text-white"
                : "text-black hover:text-gray-600"
            }`}
          >
            Morning
          </button>
          <button
            type="button"
            onClick={() => handleShiftChange("Evening")}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-300 ease-in-out ${
              currentShift === "Evening"
                ? "text-white"
                : "text-black hover:text-gray-600"
            }`}
          >
            Evening
          </button>
        </div>
      </div>

      {/* Form Container with Fade Animation */}
      <div className="transition-opacity duration-200 ease-in-out">
        {currentShift === "Morning" ? (
          <MorningReportManager />
        ) : (
          <EveningReportManager />
        )}
      </div>
    </div>
  );
};

export default SalesReportingWrapper;
