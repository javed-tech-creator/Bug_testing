import React, { useState } from "react";
import PageHeader from "@/components/PageHeader";
import {
  useCreateBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
  useGetZonesQuery,
  useGetStatesByZoneQuery,
  useGetCitiesByStateQuery,
} from "@/api/admin/department-management/location-heirarchy/master.api";
import { Edit, Grid, List, Trash2, Search as SearchIcon } from "lucide-react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import ConfirmDialog from "@/components/ConfirmationToastPopUp";
import { skipToken } from "@reduxjs/toolkit/query";
import ErrorMessage from "../ErrorMessage";
import ValidatedInput from "@/components/ValidatedInput";

const Branch = ({ branches, isError }) => {
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [view, setView] = useState("card");
  const [searchQuery, setSearchQuery] = useState("");
  // const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    zoneId: "",
    stateId: "",
    cityId: "",
  });
  const [filterData, setFilterData] = useState({
    zoneId: "",
    stateId: "",
    cityId: "",
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Add this new state
  const [formValidity, setFormValidity] = useState({ address: false });

  // Helper: track validation updates
  const handleValidityChange = (name, isValid) => {
    setFormValidity((prev) => ({ ...prev, [name]: isValid }));
  };

  // Determine if whole form is valid
  const isFormValid = Object.values(formValidity).every(Boolean);

  // Fetch zones
  const { data: zoneData } = useGetZonesQuery();
  const zones = zoneData?.data || [];

  // States based on zone (for both form and filter)
  const { data: statesData, isFetching: statesLoading } =
    useGetStatesByZoneQuery(
      formData.zoneId || filterData.zoneId
        ? formData.zoneId || filterData.zoneId
        : skipToken
    );
  const states = statesData?.data || [];

  // Cities based on state (for both form and filter)
  const { data: citiesData, isFetching: citiesLoading } =
    useGetCitiesByStateQuery(
      formData.stateId || filterData.stateId
        ? formData.stateId || filterData.stateId
        : skipToken
    );
  const cities = citiesData?.data || [];

  const [addBranch, { isLoading: adding }] = useCreateBranchMutation();
  const [updateBranch, { isLoading: updating }] = useUpdateBranchMutation();
  const [deleteBranch, { isLoading: deleting }] = useDeleteBranchMutation();

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const filteredBranches = branches.filter((b) => {
    const search = searchQuery.toLowerCase();
    const matchesSearch =
      b.title?.toLowerCase().includes(search) ||
      b.branchId?.toLowerCase().includes(search) ||
      b.cityId?.title?.toLowerCase().includes(search) ||
      b.stateId?.title?.toLowerCase().includes(search) ||
      b.zoneId?.title?.toLowerCase().includes(search);

    const matchesZone = filterData.zoneId
      ? b.zoneId?._id === filterData.zoneId
      : true;
    const matchesState = filterData.stateId
      ? b.stateId?._id === filterData.stateId
      : true;
    const matchesCity = filterData.cityId
      ? b.cityId?._id === filterData.cityId
      : true;

    return matchesSearch && matchesZone && matchesState && matchesCity;
  });

  const handleAdd = () => {
    setFormData({
      title: "",
      address: "",
      zoneId: "",
      stateId: "",
      cityId: "",
    });
    setSelectedBranch(null);
    setEditMode(false);
    setShowModal(true);
  };

  const handleEdit = (branch) => {
    setSelectedBranch(branch);
    setFormData({
      title: branch.title || "",
      address: branch.address || "",
      zoneId: branch.zoneId?._id || "",
      stateId: branch.stateId?._id || "",
      cityId: branch.cityId?._id || "",
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
    setDeletingId(deleteTarget);
    try {
      const res = await deleteBranch(deleteTarget).unwrap();
      if (res?.success)
        toast.success(res.message || "Branch deleted successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete branch");
    } finally {
      setOpenDialog(false);
      setDeleteTarget(null);
      setDeleteTarget(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode && selectedBranch) {
        const res = await updateBranch({
          id: selectedBranch._id,
          ...formData,
        }).unwrap();
        toast.success(res?.message || "Branch updated successfully!");
      } else {
        const res = await addBranch(formData).unwrap();
        toast.success(res?.message || "Branch added successfully!");
      }
      setShowModal(false);
      setSelectedBranch(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save branch");
    }
  };

  if (isError) {
    return <ErrorMessage message="Failed to load Branch." />;
  }

  return (
    <div className="p-6 max-w-10xl mx-auto space-y-6">
      <PageHeader
        title="Branch/Unit  Management"
        btnTitle="Add"
        onClick={handleAdd}
      />

      {/* Search and view controls */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 space-y-4">
        {/*  Search + Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* 🔸 Search + Zone + State + City (inline grouping) */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* 🔍 Search Bar */}
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-72 md:w-80">
              <SearchIcon className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search by Branch, Code, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full focus:outline-none text-sm"
              />
            </div>

            {/* 🗺 Zone Filter */}
            <select
              name="zoneId"
              value={filterData.zoneId || ""}
              onChange={(e) =>
                setFilterData({
                  zoneId: e.target.value,
                  stateId: "",
                  cityId: "",
                })
              }
              className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 w-36"
            >
              <option value="">- All Zones -</option>
              {zones.map((zone) => (
                <option key={zone._id} value={zone._id}>
                  {zone.title}
                </option>
              ))}
            </select>

            {/* 🏛 State Filter */}
            <select
              value={filterData.stateId || ""}
              onChange={(e) =>
                setFilterData({
                  ...filterData,
                  stateId: e.target.value,
                  cityId: "",
                })
              }
              disabled={!filterData.zoneId || statesLoading}
              className={`border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 w-36 disabled:bg-gray-100 ${
                !filterData.zoneId || statesLoading ? "cursor-not-allowed" : ""
              }`}
            >
              <option value="">- All States -</option>
              {states.map((state) => (
                <option key={state._id} value={state._id}>
                  {state.title}
                </option>
              ))}
            </select>

            {/* 🏙 City Filter */}
            <select
              value={filterData.cityId || ""}
              onChange={(e) =>
                setFilterData({
                  ...filterData,
                  cityId: e.target.value,
                })
              }
              disabled={!filterData.stateId || citiesLoading}
              className={`border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 w-36 disabled:bg-gray-100 ${
                !filterData.stateId || citiesLoading ? "cursor-not-allowed" : ""
              }`}
            >
              <option value="">- All Cities -</option>
              {cities.map((city) => (
                <option key={city._id} value={city._id}>
                  {city.title}
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

        {/* Card / List View */}
        {view === "card" ? (
          <>
            {/* Card View */}
            {filteredBranches.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {filteredBranches.map((b) => {
                  const showIcon = !!b.title;

                  return (
                    <div
                      key={b._id}
                      className="group relative bg-white rounded-2xl border border-gray-200 hover:border-orange-300 shadow-sm hover:shadow-md p-5 transition-all duration-300"
                    >
                      {/* Header Row */}
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-4">
                          {/* Conditional Icon */}
                          {showIcon && (
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-orange-700 font-bold text-lg shadow-sm group-hover:shadow-md transition-all duration-300">
                              {b.title?.[0]}
                            </div>
                          )}

                          {/* Branch Info */}
                          <div className="flex flex-col">
                            <h3 className="text-base font-semibold text-gray-900 capitalize leading-snug">
                              {b.title || "Untitled Branch"}
                            </h3>
                            <span className="inline-block w-fit px-2.5 py-0.5 mt-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-100">
                              {b.branchId || "—"}
                            </span>

                            {/* Location Line */}
                            <p className="mt-2 text-sm text-gray-700">
                              {[
                                b.cityId?.title,
                                b.stateId?.title,
                                b.zoneId?.title,
                              ]
                                .filter(Boolean)
                                .join(", ") || "N/A"}
                            </p>

                            {/* Address */}
                            {b.address && (
                              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                {b.address}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(b)}
                            className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 transition-all duration-200"
                            title="Edit Branch"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {/* <button
                            onClick={() => handleDelete(b._id)}
                            className="p-2 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 transition-all duration-200"
                            title="Delete Branch"
                          >
                            {deleteTarget === b._id && deleting ? (
                              <FaSpinner className="animate-spin w-4 h-4" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button> */}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
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
                <p className="text-gray-500 font-medium">No branch found</p>
                <p className="text-gray-400 text-sm mt-1">
                  Try adding a new branch to get started.
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            {/* 🧾 List View */}

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-700 border border-gray-300">
                <thead className="bg-gray-100 border-b border-gray-300">
                  <tr>
                    <th className="p-2 text-left border-r border-gray-200">
                      Branch ID
                    </th>
                    <th className="p-2 text-left border-r border-gray-200">
                      Title
                    </th>
                    <th className="p-2 text-left border-r border-gray-200">
                      City
                    </th>
                    <th className="p-2 text-left border-r border-gray-200">
                      State
                    </th>
                    <th className="p-2 text-left border-r border-gray-200">
                      Zone
                    </th>
                    <th className="p-2 text-center border-r border-gray-200">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBranches.length > 0 ? (
                    filteredBranches.map((b) => (
                      <tr key={b._id} className="border-t hover:bg-gray-50">
                        <td className="p-2 border-r border-gray-200">
                          {b.branchId}
                        </td>
                        <td className="p-2 border-r border-gray-200">
                          {b.title}
                        </td>
                        <td className="p-2 border-r border-gray-200">
                          {b.cityId?.title}
                        </td>
                        <td className="p-2 border-r border-gray-200">
                          {b.stateId?.title}
                        </td>
                        <td className="p-2 border-r border-gray-200">
                          {b.zoneId?.title}
                        </td>
                        <td className="p-2 border-r border-gray-200 text-center space-x-3">
                          <button
                            onClick={() => handleEdit(b)}
                            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 transition-all duration-200 cursor-pointer"
                          >
                            <Edit className="w-4 h-4 inline-block" />
                          </button>
                          {/* <button
                            onClick={() => handleDelete(b._id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            {deleteTarget === b._id ? (
                              <FaSpinner className="animate-spin inline-block" />
                            ) : (
                              <Trash2 className="w-4 h-4 inline-block" />
                            )}
                          </button> */}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center text-gray-500 py-6 italic bg-gray-50"
                      >
                        No branch found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {editMode ? "Update Branch" : "Add New Branch"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Zone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Zone
                </label>
                <select
                  value={formData.zoneId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      zoneId: e.target.value,
                      stateId: "",
                      cityId: "",
                    })
                  }
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="">-- Select Zone --</option>
                  {zones.map((zone) => (
                    <option key={zone._id} value={zone._id}>
                      {zone.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select State
                </label>
                <select
                  value={formData.stateId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stateId: e.target.value,
                      cityId: "",
                    })
                  }
                  required
                  disabled={!formData.zoneId || statesLoading}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:bg-gray-100 disabled:cursor-not-allowed "
                >
                  <option value="">-- Select State --</option>
                  {states.map((state) => (
                    <option key={state._id} value={state._id}>
                      {state.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select City
                </label>
                <select
                  value={formData.cityId}
                  onChange={(e) =>
                    setFormData({ ...formData, cityId: e.target.value })
                  }
                  required
                  disabled={!formData.stateId || citiesLoading}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:bg-gray-100 disabled:cursor-not-allowed "
                >
                  <option value="">-- Select City --</option>
                  {cities.map((city) => (
                    <option key={city._id} value={city._id}>
                      {city.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Branch Type Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Branch Type
                </label>
                <select
                  name="title"
                  value={formData.title}
                  disabled={!formData.cityId}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:cursor-not-allowed disabled:bg-gray-100"
                >
                  <option value="">-- Select Branch Type --</option>
                  <option value="Office">Office</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Franchise">Franchise</option>
                </select>
              </div>

              {/* Branch Address */}
              <div>
                <ValidatedInput
                  label="Branch Address"
                  name="address"
                  type="textarea"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  onValidChange={handleValidityChange}
                  required
                  rows={3}
                  minLength={10}
                  maxLength={300}
                  placeholder="Enter Branch Address"
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
        message="Are you sure you want to delete this Branch?"
        onConfirm={confirmDelete}
        isLoading={deleting}
        onCancel={() => {
          setOpenDialog(false);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
};

export default Branch;
