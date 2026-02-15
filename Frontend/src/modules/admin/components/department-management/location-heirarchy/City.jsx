import React, { useState } from "react";
import PageHeader from "@/components/PageHeader";
import {
  useAddCityMutation,
  useUpdateCityMutation,
  useDeleteCityMutation,
  useGetStatesByZoneQuery,
  useGetCitiesByStateQuery,
} from "@/api/admin/department-management/location-heirarchy/master.api";
// import { useGetZonesQuery } from "@/api/admin/department-management/location-heirarchy/master.api";

import { Edit, Grid, List, Trash2, Search as SearchIcon } from "lucide-react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import ConfirmDialog from "@/components/ConfirmationToastPopUp";
import ErrorMessage from "../ErrorMessage";
import ValidatedInput from "@/components/ValidatedInput";
import { skipToken } from "@reduxjs/toolkit/query";
import DepLoading from "../../DepLoading";

const City = ({ citiesdata, isError, zones }) => {
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [view, setView] = useState("card");
  const [formData, setFormData] = useState({ title: "", stateId: "" });
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectZone, setSelectZone] = useState(null);
  const [selectState, setSelectState] = useState(null);

  // Add this new state
  const [formValidity, setFormValidity] = useState({ title: false });

  // Helper: track validation updates
  const handleValidityChange = (name, isValid) => {
    setFormValidity((prev) => ({ ...prev, [name]: isValid }));
  };

  // Determine if whole form is valid
  const isFormValid = Object.values(formValidity).every(Boolean);

  // Fetch states based on selected zone
  const { data: stateData, isFetching: statesLoading } =
    useGetStatesByZoneQuery(selectZone ? selectZone : skipToken);
  const states = stateData?.data || [];

  // Fetch cities based on selected state
  const { data: cityData, isFetching: citiesLoading } =
    useGetCitiesByStateQuery(selectState ? selectState : skipToken);
  const citiesdataByStateId = cityData?.data || [];

  // Decide which cities to show
  const cities = selectState
    ? citiesdataByStateId || [] // agar state selected hai to hamesha API ka use karo
    : citiesdata || [];

  const handleZoneChange = (e) => {
    const zoneId = e.target.value || null;
    setSelectZone(zoneId);
    setSelectState(null); // zone change → reset state
  };

  const [addCity, { isLoading: adding }] = useAddCityMutation();
  const [updateCity, { isLoading: updating }] = useUpdateCityMutation();
  const [deleteCity, { isLoading: deleting }] = useDeleteCityMutation();

  //  Combined filtering logic
  const filteredCities = cities.filter((c) => {
    const search = searchQuery.toLowerCase();

    const matchesSearch =
      c.title?.toLowerCase().includes(search) ||
      c.stateId?.title?.toLowerCase().includes(search) ||
      c.cityId?.toLowerCase().includes(search);

    // const matchesZone = selectZone
    //   ? c.stateId?.zoneId?._id?.toString() === selectZone
    //   : true;

    const matchesState = selectState
      ? c.stateId?._id?.toString() === selectState
      : true;

    return matchesSearch && matchesState; //&& matchesZone;
  });

  console.log("filteredCities id are", filteredCities);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleAdd = () => {
    setFormData({ title: "", stateId: "" });
    setEditMode(false);
    setShowModal(true);
  };

  const handleEdit = (city) => {
    setSelectedCity(city);
    setFormData({
      title: city.title,
      stateId: city.stateId?._id || "",
    });
    setEditMode(true);
    setShowModal(true);
  };

  // const handleDelete = (id) => {
  //   setDeleteTarget(id);
  //   setOpenDialog(true);
  // };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await deleteCity(deleteTarget).unwrap();
      if (res?.success)
        toast.success(res.message || "City deleted successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete city");
    } finally {
      setOpenDialog(false);
      setDeleteTarget(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode && selectedCity) {
        const res = await updateCity({
          id: selectedCity._id,
          data: formData,
        }).unwrap();
        toast.success(res?.message || "City updated successfully!");
      } else {
        const res = await addCity(formData).unwrap();
        toast.success(res?.message || "City added successfully!");
      }
      setShowModal(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save city");
    }
  };

  if (isError) {
    return <ErrorMessage message="Failed to load Cities." />;
  }
  return (
    <div className="p-6 max-w-10xl mx-auto space-y-6">
      <PageHeader title="City Management" btnTitle="Add" onClick={handleAdd} />

      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 space-y-4">
        {/* Top Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* 🔸 Search + Zone + State (inline grouping) */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search Bar */}
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-72 md:w-80">
              <SearchIcon className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search by City, State, or ID..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full focus:outline-none text-sm"
              />
            </div>

            {/* Zone Filter */}
            <select
              name="zoneId"
              value={selectZone || ""}
              onChange={(e) => handleZoneChange(e)}
              className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 w-36"
            >
              <option value="">- All Zones -</option>
              {zones.map((zone) => (
                <option key={zone._id} value={zone._id}>
                  {zone.title}
                </option>
              ))}
            </select>

            {/* State Filter */}
            <select
              value={selectState || ""}
              onChange={(e) => setSelectState(e.target.value || null)}
              disabled={!selectZone || statesLoading}
              className={`border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 w-36 disabled:bg-gray-100 ${
                !selectZone || statesLoading ? "cursor-not-allowed" : ""
              }`}
            >
              <option value="">- All States -</option>
              {states.map((state) => (
                <option key={state._id} value={state._id}>
                  {state.title}
                </option>
              ))}
            </select>
          </div>

          {/* 🔸 View Switch */}
          <div className="flex gap-2">
            <button
              onClick={() => setView("card")}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                view === "card"
                  ? "bg-black text-white shadow"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Grid className="w-4 h-4 mr-1" /> Card
            </button>
            <button
              onClick={() => setView("list")}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                view === "list"
                  ? "bg-black text-white shadow"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              <List className="w-4 h-4 mr-1" /> List
            </button>
          </div>
        </div>

        {citiesLoading ? (
          <DepLoading text="Loading cities..." />
        ) : (
          //  Main Content when loading is done
          <>
            {/* Card / List View */}
            {view === "card" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {filteredCities.length > 0 ? (
                  filteredCities.map((city) => (
                    <div
                      key={city._id}
                      className="group relative bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200 hover:border-orange-300 p-5 transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 to-amber-50/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      <div className="relative z-10 flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
                            <span className="text-orange-700 font-bold text-lg uppercase">
                              {city.title?.[0] || "C"}
                            </span>
                          </div>

                          <div>
                            <h3 className="text-base font-semibold text-gray-900 capitalize leading-tight">
                              {city.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-orange-50 text-orange-700 border border-orange-100">
                                {city.cityId}
                              </span>
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">State:</span>{" "}
                              {city.stateId?.title || "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => handleEdit(city)}
                            className="p-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 transition-all duration-200"
                            title="Edit City"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-12 h-12 text-gray-400 mb-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 13h6m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5l2 2h5a2 2 0 012 2v12a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-gray-500 font-medium">No city found</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Try adding a new city to get started.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-gray-700 border border-gray-300">
                  <thead className="bg-gray-100 border-b border-gray-300">
                    <tr>
                      <th className="p-2 text-left border-r border-gray-200">
                        City ID
                      </th>
                      <th className="p-2 text-left border-r border-gray-200">
                        City Title
                      </th>
                      <th className="p-2 text-left border-r border-gray-200">
                        State
                      </th>
                      <th className="p-2 text-center border-r border-gray-200">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCities.length > 0 ? (
                      filteredCities.map((city) => (
                        <tr
                          key={city._id}
                          className="border-t hover:bg-gray-50"
                        >
                          <td className="p-2 border-r border-gray-200">
                            {city.cityId}
                          </td>
                          <td className="p-2 border-r border-gray-200">
                            {city.title}
                          </td>
                          <td className="p-2 border-r border-gray-200">
                            {city.stateId?.title}
                          </td>
                          <td className="p-2 border-r border-gray-200 text-center space-x-3">
                            <button
                              onClick={() => handleEdit(city)}
                              className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 transition-all duration-200 cursor-pointer"
                            >
                              <Edit className="w-4 h-4 inline-block" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="text-center text-gray-500 py-6 italic bg-gray-50"
                        >
                          No City found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {editMode ? "Update City" : "Add New City"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* State Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select State
                </label>
                <select
                  name="stateId"
                  value={formData.stateId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      stateId: e.target.value,
                    }))
                  }
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="">-- Select State --</option>
                  {states.map((state) => (
                    <option key={state._id} value={state._id}>
                      {state.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* City Title */}
              <div>
                <ValidatedInput
                  label="City Title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  onValidChange={handleValidityChange}
                  required
                  minLength={3}
                  maxLength={50}
                  placeholder="Enter City Title"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid || adding || updating}
                  className={`px-4 py-2 rounded-lg flex items-center justify-center gap-2 ${
                    !isFormValid
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-orange-500 hover:bg-orange-600 text-white"
                  }`}
                >
                  {adding || updating ? (
                    <FaSpinner className="animate-spin" />
                  ) : editMode ? (
                    "Update"
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={openDialog}
        title="Confirm Delete"
        message="Are you sure you want to delete this City?"
        onConfirm={confirmDelete}
        isLoading={deleting}
        onCancel={() => setOpenDialog(false)}
      />
    </div>
  );
};

export default City;
