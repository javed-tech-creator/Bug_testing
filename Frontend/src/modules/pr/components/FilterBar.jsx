import React, { useState } from "react";
import { ChevronDown, X, Calendar } from "lucide-react";

const FilterBar = ({ 
  filters = {}, 
  onFilterChange, 
  showCategory = false,
  customFilters = [] 
}) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    date: filters.date || null,
    priority: filters.priority || [],
    status: filters.status || [],
    category: filters.category || [],
  });

  // Default filter options
  const defaultFilterOptions = {
    date: [
      { label: "Today", value: "today" },
      { label: "Yesterday", value: "yesterday" },
      { label: "Last 7 Days", value: "last_7_days" },
      { label: "Last 30 Days", value: "last_30_days" },
      { label: "This Month", value: "this_month" },
      { label: "Last Month", value: "last_month" },
      { label: "Custom Range", value: "custom" },
    ],
    priority: [
      { label: "High", value: "high" },
      { label: "Medium", value: "medium" },
      { label: "Low", value: "low" },
    ],
    status: [
      { label: "Pending", value: "pending" },
      { label: "In Progress", value: "in_progress" },
      { label: "Completed", value: "completed" },
      { label: "On Hold", value: "on_hold" },
      { label: "Cancelled", value: "cancelled" },
    ],
    category: [
      { label: "Signage", value: "signage" },
      { label: "Display", value: "display" },
      { label: "Branding", value: "branding" },
      { label: "Printing", value: "printing" },
      { label: "Vinyl Work", value: "vinyl_work" },
    ],
  };

  // Toggle dropdown
  const toggleDropdown = (filterName) => {
    setOpenDropdown(openDropdown === filterName ? null : filterName);
  };

  // Handle single select (for date)
  const handleSingleSelect = (filterName, value) => {
    const newFilters = {
      ...selectedFilters,
      [filterName]: value,
    };
    setSelectedFilters(newFilters);
    setOpenDropdown(null);
    
    // Call parent callback
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  // Handle multi-select (for priority, status, category)
  const handleMultiSelect = (filterName, value) => {
    const currentValues = selectedFilters[filterName];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    const newFilters = {
      ...selectedFilters,
      [filterName]: newValues,
    };
    setSelectedFilters(newFilters);
    
    // Call parent callback
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  // Clear specific filter
  const clearFilter = (filterName) => {
    const newFilters = {
      ...selectedFilters,
      [filterName]: Array.isArray(selectedFilters[filterName]) ? [] : null,
    };
    setSelectedFilters(newFilters);
    
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    const clearedFilters = {
      date: null,
      priority: [],
      status: [],
      category: [],
    };
    setSelectedFilters(clearedFilters);
    
    if (onFilterChange) {
      onFilterChange(clearedFilters);
    }
  };

  // Get active filter count
  const getActiveCount = (filterName) => {
    const value = selectedFilters[filterName];
    if (Array.isArray(value)) return value.length;
    return value ? 1 : 0;
  };

  // Check if any filter is active
  const hasActiveFilters = () => {
    return (
      selectedFilters.date ||
      selectedFilters.priority.length > 0 ||
      selectedFilters.status.length > 0 ||
      selectedFilters.category.length > 0
    );
  };

  // Render filter button
  const renderFilterButton = (filterName, label, options, isMulti = true) => {
    const activeCount = getActiveCount(filterName);
    const isOpen = openDropdown === filterName;

    return (
      <div className="relative">
        <button
          onClick={() => toggleDropdown(filterName)}
          className={`flex items-center gap-2 px-4 py-2 border rounded-md text-sm transition-all ${
            activeCount > 0
              ? "bg-blue-50 border-blue-300 text-blue-700"
              : "bg-white text-gray-600 hover:shadow-sm"
          }`}
        >
          {filterName === "date" && <Calendar className="w-4 h-4" />}
          {label}
          {activeCount > 0 && (
            <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeCount}
            </span>
          )}
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setOpenDropdown(null)}
            />
            
            {/* Dropdown Content */}
            <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-20 max-h-64 overflow-y-auto">
              {options.map((option) => (
                <div
                  key={option.value}
                  onClick={() =>
                    isMulti
                      ? handleMultiSelect(filterName, option.value)
                      : handleSingleSelect(filterName, option.value)
                  }
                  className={`px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between ${
                    isMulti && selectedFilters[filterName].includes(option.value)
                      ? "bg-blue-50"
                      : !isMulti && selectedFilters[filterName] === option.value
                      ? "bg-blue-50"
                      : ""
                  }`}
                >
                  <span className="text-sm text-gray-700">{option.label}</span>
                  {isMulti && selectedFilters[filterName].includes(option.value) && (
                    <span className="text-blue-600 text-xs">✓</span>
                  )}
                  {!isMulti && selectedFilters[filterName] === option.value && (
                    <span className="text-blue-600 text-xs">✓</span>
                  )}
                </div>
              ))}
              
              {/* Clear button for this filter */}
              {activeCount > 0 && (
                <div className="border-t border-gray-200 p-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearFilter(filterName);
                    }}
                    className="w-full text-xs text-red-600 hover:text-red-700 py-1"
                  >
                    Clear {label}
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Date Filter */}
      {renderFilterButton("date", "Date", defaultFilterOptions.date, false)}

      {/* Priority Filter */}
      {renderFilterButton("priority", "Priority", defaultFilterOptions.priority)}

      {/* Status Filter */}
      {renderFilterButton("status", "Status", defaultFilterOptions.status)}

      {/* Category Filter - Conditional */}
      {showCategory && renderFilterButton("category", "Category", defaultFilterOptions.category)}

      {/* Custom Filters */}
      {customFilters.map((customFilter) =>
        renderFilterButton(
          customFilter.name,
          customFilter.label,
          customFilter.options,
          customFilter.isMulti !== false
        )
      )}

      {/* Clear All Filters Button */}
      {hasActiveFilters() && (
        <button
          onClick={clearAllFilters}
          className="flex items-center gap-1 px-3 py-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-all"
        >
          <X className="w-3 h-3" />
          Clear All
        </button>
      )}
    </div>
  );
};

export default FilterBar;