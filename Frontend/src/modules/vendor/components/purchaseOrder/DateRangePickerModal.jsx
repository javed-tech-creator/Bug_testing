import React, { useState } from "react";
import dayjs from "dayjs";
import { IoIosArrowDown } from "react-icons/io";

export default function DateRangeFilter({ onRangeChange }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("Last Week");
  const [customRange, setCustomRange] = useState({
    start: dayjs().format("YYYY-MM-DD"),
    end: dayjs().format("YYYY-MM-DD"),
  });

  const presetRanges = {
    Today: {
      start: dayjs().format("YYYY-MM-DD"),
      end: dayjs().format("YYYY-MM-DD"),
    },
    Yesterday: {
      start: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
      end: dayjs().subtract(1, "day").format("YYYY-MM-DD"),
    },
    "Last Week": {
      start: dayjs().subtract(7, "day").format("YYYY-MM-DD"),
      end: dayjs().format("YYYY-MM-DD"),
    },
    "Last 30 Days": {
      start: dayjs().subtract(30, "day").format("YYYY-MM-DD"),
      end: dayjs().format("YYYY-MM-DD"),
    },
   "Last Year": {
  start: dayjs().subtract(1, "year").format("YYYY-MM-DD"),
  end: dayjs().format("YYYY-MM-DD"),
},
  };

  const handleSelect = (label) => {
    setSelectedLabel(label);
    setShowModal(false);

    if (label !== "Custom") {
      const range = presetRanges[label];
      setCustomRange(range);
      onRangeChange?.(range); // ✅ Send range to parent
    }
  };

  const handleApplyCustom = () => {
    setShowModal(false);
    onRangeChange?.(customRange); // ✅ Send custom range
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-1 px-3 py-2 rounded-md bg-gray-200 text-sm font-medium  cursor-pointer"
      >
        {selectedLabel} <IoIosArrowDown className="text-base" />
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md">
            <div className="flex justify-between items-center mb-4 cursor-pointer">
              <h3 className="text-base font-semibold">Select Date Range</h3>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm mb-2">
              {Object.keys(presetRanges).map((label) => (
                <button
                  key={label}
                  onClick={() => handleSelect(label)}
                  className={`px-3 py-2 border rounded ${
                    selectedLabel === label ? "bg-blue-100 font-semibold" : ""
                  }`}
                >
                  {label}
                </button>
              ))}
              <button
                onClick={() => setSelectedLabel("Custom")}
                className={`px-3 py-2 border rounded col-span-2 ${
                  selectedLabel === "Custom" ? "bg-blue-100 font-semibold" : ""
                }`}
              >
                Custom
              </button>
            </div>

            {selectedLabel === "Custom" && (
              <div className="mt-4 space-y-2 text-sm">
                <label className="block">
                  From:
                  <input
                    type="date"
                    value={customRange.start}
                    onChange={(e) =>
                      setCustomRange({ ...customRange, start: e.target.value })
                    }
                    className="w-full mt-1 px-2 py-1 border rounded"
                  />
                </label>
                <label className="block">
                  To:
                  <input
                    type="date"
                    value={customRange.end}
                    onChange={(e) =>
                      setCustomRange({ ...customRange, end: e.target.value })
                    }
                    className="w-full mt-1 px-2 py-1 border rounded"
                  />
                </label>
                <button
                  onClick={handleApplyCustom}
                  className="mt-2 w-full bg-blue-600 text-white py-1.5 rounded"
                >
                  Apply
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
