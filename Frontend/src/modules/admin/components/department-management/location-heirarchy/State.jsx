import React, { useState } from "react";
import PageHeader from "@/components/PageHeader";
import {
  useAddStateMutation,
  useUpdateStateMutation,
  useDeleteStateMutation,
} from "@/api/admin/department-management/location-heirarchy/master.api";
import { useGetZonesQuery } from "@/api/admin/department-management/location-heirarchy/master.api";
import { Edit, Grid, List, Trash2, Search as SearchIcon } from "lucide-react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import ConfirmDialog from "@/components/ConfirmationToastPopUp";
import ErrorMessage from "../ErrorMessage";
import ValidatedInput from "@/components/ValidatedInput";

const State = ({ states, isError }) => {
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedState, setSelectedState] = useState(null);
  const [view, setView] = useState("card");
  const [formData, setFormData] = useState({ title: "", zoneId: "" });
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedZone, setSelectedZone] = useState("");

  // Add this new state
  const [formValidity, setFormValidity] = useState({ title: false });

  // Helper: track validation updates
  const handleValidityChange = (name, isValid) => {
    setFormValidity((prev) => ({ ...prev, [name]: isValid }));
  };

  // Determine if whole form is valid
  const isFormValid = Object.values(formValidity).every(Boolean);

  // API Hooks
  const { data: zoneData } = useGetZonesQuery();
  const zones = zoneData?.data || [];

  const [addState, { isLoading: adding }] = useAddStateMutation();
  const [updateState, { isLoading: updating }] = useUpdateStateMutation();
  const [deleteState, { isLoading: deleting }] = useDeleteStateMutation();

  // Filter states based on search
  const filteredStates = states.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.stateId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.zoneId?.title?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesZone = selectedZone ? s.zoneId?._id === selectedZone : true;

    return matchesSearch && matchesZone;
  });

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleAdd = () => {
    setFormData({ title: "", zoneId: "" });
    setEditMode(false);
    setShowModal(true);
  };

  const handleEdit = (state) => {
    setSelectedState(state);
    setFormData({
      title: state.title,
      zoneId: state.zoneId?._id || "",
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setDeleteTarget(id);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await deleteState(deleteTarget).unwrap();
      if (res?.success)
        toast.success(res.message || "State deleted successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete state");
    } finally {
      setOpenDialog(false);
      setDeleteTarget(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode && selectedState) {
        const res = await updateState({
          id: selectedState._id,
          data: formData,
        }).unwrap();
        toast.success(res?.message || "State updated successfully!");
      } else {
        const res = await addState(formData).unwrap();
        toast.success(res?.message || "State added successfully!");
      }
      setShowModal(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save state");
    }
  };

  if (isError) {
    return <ErrorMessage message="Failed to load State." />;
  }
  
  return (
    <div className="p-6 max-w-10xl mx-auto space-y-6">
      <PageHeader title="State Management" btnTitle="Add" onClick={handleAdd} />

      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 space-y-4">
        {/* Top Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
  {/*  Left Section — Search + Zone (inline grouping) */}
  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">

    {/* 🔍 Search Bar */}
    <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-72 md:w-80 bg-white shadow-sm">
      <SearchIcon className="w-4 h-4 text-gray-400 mr-2" />
      <input
        type="text"
        placeholder="Search by State, Zone, or ID..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="w-full focus:outline-none text-gray-700 placeholder-gray-400 text-sm"
      />
    </div>

    {/* 🗺 Zone Filter */}
    <select
      name="zoneId"
      value={selectedZone || ""}
      onChange={(e) => setSelectedZone(e.target.value)}
      className="border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 w-36"
    >
      <option value="">- All Zones -</option>
      {zones.map((zone) => (
        <option key={zone._id} value={zone._id}>
          {zone.title}
        </option>
      ))}
    </select>

  </div>

  {/* 🔸 Right Section — View Switch */}
  <div className="flex gap-2">
    <button
      onClick={() => setView("card")}
      className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
        view === "card"
          ? "bg-black text-white shadow"
          : "border border-gray-300 text-gray-700 hover:bg-gray-100"
      }`}
    >
      <Grid className="w-4 h-4 mr-1" /> Card
    </button>
    <button
      onClick={() => setView("list")}
      className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
        view === "list"
          ? "bg-black text-white shadow"
          : "border border-gray-300 text-gray-700 hover:bg-gray-100"
      }`}
    >
      <List className="w-4 h-4 mr-1" /> List
    </button>
  </div>
</div>


        {/* View Mode: Card or List */}
        {view === "card" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {filteredStates.length > 0 ? (
              filteredStates.map((state) => (
                <div
                  key={state._id}
                  className="group relative bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200 hover:border-orange-300 p-5 transition-all duration-300"
                >
                  {/* Subtle gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 to-amber-50/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Top Row: Avatar + Title + Buttons */}
                  <div className="relative z-10 flex items-start justify-between mb-4">
                    {/* Avatar + Title */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
                        <span className="text-orange-700 font-bold text-lg uppercase">
                          {state.title?.[0] || "S"}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-semibold text-gray-900 capitalize leading-tight">
                          {state.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-orange-50 text-orange-700 border border-orange-100">
                            {state.stateId}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Zone:</span>{" "}
                          {state.zoneId?.title || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 ml-4">
                      <button
                        onClick={() => handleEdit(state)}
                        className="p-3.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 transition-all duration-200"
                        title="Edit State"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {/* <button
                      onClick={() => handleDelete(state._id)}
                      disabled={deleting}
                      className="p-3.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 transition-all duration-200 disabled:opacity-50"
                      title="Delete State"
                    >
                      {deleting ? (
                        <FaSpinner className="animate-spin w-4 h-4" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button> */}
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
                <p className="text-gray-500 font-medium">No state found</p>
                <p className="text-gray-400 text-sm mt-1">
                  Try adding a new state to get started.
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
                    State ID
                  </th>
                  <th className="p-2 text-left border-r border-gray-200">
                    State Title
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
                {filteredStates.length > 0 ? (
                  filteredStates.map((state) => (
                    <tr key={state._id} className="border-t hover:bg-gray-50">
                      <td className="p-2 border-r border-gray-200">
                        {state.stateId}
                      </td>
                      <td className="p-2 border-r border-gray-200 ">
                        {state.title}
                      </td>
                      <td className="p-2 border-r border-gray-200">
                        {state.zoneId?.title}
                      </td>
                      <td className="p-2 border-r border-gray-200 text-center space-x-3">
                        <button
                          onClick={() => handleEdit(state)}
                          className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 transition-all duration-200 cursor-pointer"
                        >
                          <Edit className="w-4 h-4 inline-block" />
                        </button>
                        {/* <button
                        onClick={() => handleDelete(state._id)}
                        disabled={deleting}
                        className="text-red-500 hover:text-red-600"
                      >
                        {deleting ? (
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
                      colSpan="4"
                      className="text-center text-gray-500 py-6 italic bg-gray-50"
                    >
                      No State found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {editMode ? "Update State" : "Add New State"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Zone Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Zone
                </label>
                <select
                  name="zoneId"
                  value={formData.zoneId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      zoneId: e.target.value,
                    }))
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

              {/* State Title */}
              <div>
                <ValidatedInput
                  label="State Title"
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
                  placeholder="Enter State Title"
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
                  className={`px-4 py-2 rounded-lg flex items-center justify-center gap-3 ${
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
        message="Are you sure you want to delete this State?"
        onConfirm={confirmDelete}
        isLoading={deleting}
        onCancel={() => setOpenDialog(false)}
      />
    </div>
  );
};

export default State;
