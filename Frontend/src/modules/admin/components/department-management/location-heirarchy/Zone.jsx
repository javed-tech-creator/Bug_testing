import React, { useState } from "react";
import PageHeader from "@/components/PageHeader";
import {
  useAddZoneMutation,
  useUpdateZoneMutation,
  useDeleteZoneMutation,
} from "@/api/admin/department-management/location-heirarchy/master.api";
import { Edit, Grid, List, Trash2, Search as SearchIcon } from "lucide-react";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import ConfirmDialog from "@/components/ConfirmationToastPopUp";
import ErrorMessage from "../ErrorMessage";
import ValidatedInput from "@/components/ValidatedInput";

const Zone = ({ zones, isError }) => {
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);
  const [view, setView] = useState("card");
  const [formData, setFormData] = useState({ title: "" });
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  // Add this new state
  const [formValidity, setFormValidity] = useState({ title: false });

  // Helper: track validation updates
  const handleValidityChange = (name, isValid) => {
    setFormValidity((prev) => ({ ...prev, [name]: isValid }));
  };

  // Determine if whole form is valid
  const isFormValid = Object.values(formValidity).every(Boolean);

  const [addZone, { isLoading: ZoneAdding }] = useAddZoneMutation();
  const [updateZone, { isLoading: ZoneUpdating }] = useUpdateZoneMutation();
  const [deleteZone, { isLoading: ZoneDeleting }] = useDeleteZoneMutation();

  // Filter zones based on search query
  const filteredZones = zones.filter(
    (zone) =>
      zone.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zone.zoneId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleAdd = () => {
    setFormData({ title: "" });
    setEditMode(false);
    setShowModal(true);
  };

  const handleEdit = (zone) => {
    setSelectedZone(zone);
    setFormData({ title: zone.title });
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
      const result = await deleteZone(deleteTarget).unwrap();
      if (result?.success) {
        toast.success(result.message || "Zone deleted successfully!");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete Zone.");
    } finally {
      setOpenDialog(false);
      setDeleteTarget(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode && selectedZone) {
        const updateZones = await updateZone({
          id: selectedZone._id,
          data: formData,
        }).unwrap();
        toast.success(updateZones?.message || "Zone updated successfully!");
      } else {
        const addZones = await addZone(formData).unwrap();
        toast.success(addZones?.message || "Zone added successfully!");
      }
      setShowModal(false);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to save zone");
    }
  };

  if (isError) {
    return <ErrorMessage message="Failed to load Zones." />;
  }
  return (
    <div className="p-6 max-w-10xl mx-auto space-y-6">
      {/* Header */}
      <PageHeader title="Zone Management" btnTitle="Add" onClick={handleAdd} />

      {/* Parent Card: Search + View Switch + Listing */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 space-y-4">
        {/* Top Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search Bar */}
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-72 md:w-80 bg-white shadow-sm">
            <SearchIcon className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search Zone..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full focus:outline-none text-gray-700 placeholder-gray-400 text-sm"
            />
          </div>

          {/* View Switch */}
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

        {/* Listing */}
        {view === "card" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredZones.length > 0 ? (
              filteredZones.map((zone) => (
                <div
                  key={zone._id}
                  className="group relative bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200 hover:border-orange-300 p-4 transition-all duration-300 flex flex-col gap-3"
                >
                  {/* Background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 to-amber-50/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Top Row: Icon, Title, Buttons */}
                  <div className="relative z-10 flex items-start justify-between">
                    {/* Left: Icon + Name */}
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-300 flex-shrink-0">
                        <svg
                          className="w-6 h-6 text-orange-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-gray-800 capitalize break-words leading-tight mb-1">
                          {zone.title}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-orange-50 text-orange-700 border border-orange-100">
                          {zone.zoneId}
                        </span>
                      </div>
                    </div>

                    {/* Right: Edit + Delete Buttons (Same Row) */}
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(zone)}
                        className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 transition-all duration-200 cursor-pointer"
                        title="Edit Zone"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {/* <button
                      onClick={() => handleDelete(zone._id)}
                      disabled={ZoneDeleting}
                      className="p-2 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 transition-all duration-200 disabled:opacity-50"
                      title="Delete Zone"
                    >
                      {ZoneDeleting ? (
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
                <p className="text-gray-500 font-medium">No zone found</p>
                <p className="text-gray-400 text-sm mt-1">
                  Try adding a new zone to get started.
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
                    Zone ID
                  </th>
                  <th className="p-2 text-left border-r border-gray-200">
                    Title
                  </th>
                  <th className="p-2 text-left border-r border-gray-200">
                    Sequence
                  </th>
                  <th className="p-2 text-center border-r border-gray-200">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredZones.length > 0 ? (
                  filteredZones.map((zone) => (
                    <tr
                      key={zone._id}
                      className="border-t hover:bg-gray-50 transition-all"
                    >
                      <td className="p-2 border-r border-gray-200">
                        {zone.zoneId}
                      </td>
                      <td className="p-2 border-r border-gray-200">
                        {zone.title}
                      </td>
                      <td className="p-2 border-r border-gray-200">
                        {zone.sequence_value}
                      </td>
                      <td className="p-2 border-r border-gray-200 text-center space-x-3">
                        <button
                          onClick={() => handleEdit(zone)}
                          className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 transition-all duration-200 cursor-pointer"
                          title="Edit Zone"
                        >
                          <Edit className="w-4 h-4 inline-block" />
                        </button>
                        {/* <button
                        onClick={() => handleDelete(zone._id)}
                        disabled={ZoneDeleting}
                        className="text-red-500 hover:text-red-600"
                        title="Delete Zone"
                      >
                        {ZoneDeleting ? (
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
                      No Zone found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {editMode ? "Update Zone" : "Add New Zone"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                {/* Use reusable validated input here */}
                <ValidatedInput
                  label="Zone Title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  onValidChange={handleValidityChange}
                  required
                  minLength={3}
                  maxLength={50}
                  placeholder="Enter Zone Title"
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
                  disabled={!isFormValid || ZoneAdding || ZoneUpdating} // 👈 validation check added
                  className={`px-4 py-2 rounded-lg flex items-center justify-center gap-2 ${
                    !isFormValid
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-orange-500 hover:bg-orange-600 text-white"
                  }`}
                >
                  {ZoneAdding || ZoneUpdating ? (
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

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={openDialog}
        title="Confirm Delete"
        message={`Are you sure you want to delete this Zone?`}
        onConfirm={confirmDelete}
        isLoading={ZoneDeleting}
        onCancel={() => setOpenDialog(false)}
      />
    </div>
  );
};

export default Zone;
