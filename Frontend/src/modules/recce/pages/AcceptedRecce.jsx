import React, { useState, useMemo } from "react";
import {
  Eye,
  Calendar,
  MapPin,
  Filter,
  ChevronDown,
  X,
  Flag,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Table from "../../../components/Table";
import PageHeader from "../../../components/PageHeader";
import { useGetAcceptedRecceQuery } from "../../../api/admin/assignedRecce.api";

const AcceptedRecce = () => {
  const navigate = useNavigate();

  // Fetch accepted recces from API
  const { data: recceData, isLoading } = useGetAcceptedRecceQuery();

  // 2. STATE FOR FILTERS
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const handleClearFilters = () => {
    setSelectedDate("");
    setSelectedPriority("");
    setSelectedLocation("");
  };

  // Format data from API
  const formattedData =
    recceData?.data?.projects?.map((item) => ({
      id: item._id,
      client: item?.clientId?.name || "N/A",
      project: item.projectName,
      address: item.address,
      city: item?.clientId?.city || "",
      visitTime: item.projectTimeline?.startDate
        ? new Date(item.projectTimeline.startDate).toLocaleString()
        : "Not Scheduled",
      priority: "Medium", // You can add priority field to backend if needed
      status: item.status,
      approvalStatus: item?.reviewSubmit?.approvalStatus || "",
      siteLocation: item.siteLocation,
      actions: "",
    })) || [];

  // 3. LEAD SHEET LOGIC: Extract Unique Options Dynamically
  const unique = (arr) => [...new Set(arr.filter(Boolean))];

  // Get unique cities and priorities directly from data
  const uniqueLocations = unique(formattedData.map((item) => item.city));
  const uniquePriorities = unique(formattedData.map((item) => item.priority));

  // 4. LEAD SHEET LOGIC: Sequential Filtering
  // Using useMemo to prevent re-calculation on every render unless deps change
  const filteredData = useMemo(() => {
    let data = [...formattedData];

    // Filter 1: Date (Custom logic for your specific date needs)
    if (selectedDate) {
      data = data.filter((item) => {
        const itemDate = item.visitTime
          ? new Date(item.visitTime).toISOString().split("T")[0]
          : "";
        return itemDate === selectedDate;
      });
    }

    // Filter 2: Priority (Lead Logic)
    if (selectedPriority && selectedPriority !== "All") {
      data = data.filter((item) => item.priority === selectedPriority);
    }

    // Filter 3: Location (Lead Logic)
    if (selectedLocation && selectedLocation !== "All") {
      data = data.filter((item) => item.city === selectedLocation);
    }

    return data;
  }, [formattedData, selectedDate, selectedPriority, selectedLocation]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleViewDetails = (item) => {
    navigate(`/recce/recce-details/${item.id}`);
  };

  const columnConfig = {
    client: { label: "Client" },
    project: { label: "Projects" },
    fullAddress: {
      label: "Address",
      render: (value, row) => {
        const query = encodeURIComponent(
          row.siteLocation && row.siteLocation.trim() !== ""
            ? row.siteLocation
            : `${row.address}, ${row.city}`
        );

        return (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${query}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline cursor-pointer"
            title="Open address in Google Maps"
          >
            {row.address}
          </a>
        );
      },
    },
    viewMap: {
      label: "Full Address",
      render: (value, row) => {
        if (row.siteLocation) {
          const [lat, lng] = row.siteLocation
            .split(",")
            .map((coord) => coord.trim());
          const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;
          return (
            <div className="text-center w-full">
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline text-sm transition-colors"
              >
                View Map
              </a>
            </div>
          );
        }
        const query = encodeURIComponent(`${row.address} ${row.city}`);
        const fallbackUrl = `https://www.google.com/maps?q=${query}`;
        return (
          <div className="text-center w-full">
            <a
              href={fallbackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:text-orange-800 underline text-sm transition-colors"
            >
              View Map (Approx)
            </a>
          </div>
        );
      },
    },
    visitTime: { label: "Visit Time" },
    city: { label: "City" }, // Added City column so you can see filter working
    priority: {
      label: "Priority",
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${
            value === "High"
              ? "bg-red-50 text-red-600 border-red-100"
              : value === "Medium"
              ? "bg-orange-50 text-orange-600 border-orange-100"
              : "bg-green-50 text-green-600 border-green-100"
          }`}
        >
          {value}
        </span>
      ),
    },
    status: {
      label: "Status",
      render: () => (
        <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-orange-50 text-orange-600 border-orange-100">
          Recce Pending
        </span>
      ),
    },
    actions: {
      label: "Actions",
      render: (value, row) => {
        return (
          <div className="flex items-center justify-center">
            <button
              className="p-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-sm"
              onClick={() => handleViewDetails(row)}
              title="View Details"
            >
              <Eye size={16} strokeWidth={2} />
            </button>
          </div>
        );
      },
    },
  };

  return (
    <div className="min-h-screen">
      {/* --- ROW 1: Page Title --- */}
      <div className="mb-6">
        <PageHeader title="Received / Accepted Recce" />
      </div>

      {isLoading ? (
        <div className="text-center py-10">Loading accepted recces...</div>
      ) : (
        <>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col md:flex-row items-center justify-start gap-4">
              {/* Filter Dropdowns */}
              <div className="flex items-center gap-3 w-full overflow-x-auto pb-2 md:pb-0">
                {/* Date Filter */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar size={16} className="text-gray-500" />
                  </div>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none cursor-pointer"
                  />
                </div>

                {/* Priority Filter */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Flag size={16} className="text-gray-500" />
                  </div>
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="appearance-none pl-10 pr-10 py-2 bg-white border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none cursor-pointer min-w-[130px]"
                  >
                    <option value="">Priority</option>
                    {uniquePriorities.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown size={14} className="text-gray-400" />
                  </div>
                </div>

                {/* Location Filter */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin size={16} className="text-gray-500" />
                  </div>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="appearance-none pl-10 pr-10 py-2 bg-white border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none cursor-pointer min-w-[140px]"
                  >
                    <option value="">Location</option>
                    {uniqueLocations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown size={14} className="text-gray-400" />
                  </div>
                </div>

                {/* Clear Filters Button */}
                <button
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 bg-white rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 flex-shrink-0 shadow-sm"
                >
                  <X size={14} className="text-gray-500" />
                  <span>Clear Filters</span>
                </button>
              </div>
            </div>
          </div>

          {/* --- ROW 3: Table --- */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <Table data={filteredData} columnConfig={columnConfig} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AcceptedRecce;
