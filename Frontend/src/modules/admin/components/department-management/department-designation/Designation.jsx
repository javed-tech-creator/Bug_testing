import React, { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import ErrorMessage from "../ErrorMessage";
import { FaSpinner } from "react-icons/fa";
import { Edit, Grid, List, Trash2, Search as SearchIcon } from "lucide-react";
import { toast } from "react-toastify";
import {
  useGetZonesQuery,
  useGetStatesByZoneQuery,
  useGetCitiesByStateQuery,
  useGetBranchesByCityQuery,
} from "@/api/admin/department-management/location-heirarchy/master.api";

import {
  useGetDepartmentByBranchQuery,
  useCreateDesignationMutation,
  useUpdateDesignationMutation,
  useDeleteDesignationMutation,
  useGetDesignationsByDepIdQuery,
} from "@/api/admin/department-management/department-designation/department.api";

import ConfirmDialog from "@/components/ConfirmationToastPopUp";
import { skipToken } from "@reduxjs/toolkit/query";
import ValidatedInput from "@/components/ValidatedInput";
import DepLoading from "../../DepLoading";

const Designation = ({ designations = [], isError }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  //  Form State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("card");

  const [formData, setFormData] = useState({
    _id: "",
    zoneId: "",
    stateId: "",
    cityId: "",
    branchId: "",
    depId: "",
    title: "",
    description: "",
  });

  const [filterData, setFilterData] = useState({
    zoneId: "",
    stateId: "",
    cityId: "",
    branchId: "",
    departmentId: "",
  });

  // Add this new state
  const [formValidity, setFormValidity] = useState({ title: false });

  // Helper: track validation updates
  const handleValidityChange = (name, isValid) => {
    setFormValidity((prev) => ({ ...prev, [name]: isValid }));
  };

  // Determine if whole form is valid
  const isFormValid = Object.values(formValidity).every(Boolean);

  //  Fetch Hierarchy Data
  const { data: zoneData, isFetching: zonesLoading } = useGetZonesQuery();
  const zones = zoneData?.data || [];

  const { data: stateData, isFetching: statesLoading } =
    useGetStatesByZoneQuery(
      formData.zoneId || filterData.zoneId
        ? formData.zoneId || filterData.zoneId
        : skipToken
    );
  const states = stateData?.data || [];

  const { data: cityData, isFetching: citiesLoading } =
    useGetCitiesByStateQuery(
      formData.stateId || filterData.stateId
        ? formData.stateId || filterData.stateId
        : skipToken
    );
  const cities = cityData?.data || [];

  const { data: branchData, isFetching: branchesLoading } =
    useGetBranchesByCityQuery(
      formData.cityId || filterData.cityId
        ? formData.cityId || filterData.cityId
        : skipToken
    );
  const branches = branchData?.data || [];

  const { data: deptData, isFetching: deptLoading } =
    useGetDepartmentByBranchQuery(
      formData.branchId || filterData.branchId
        ? formData.branchId || filterData.branchId
        : skipToken
    );
  const departments = deptData?.data || [];

  const { data: designationdata, isFetching: designationLoading } =
    useGetDesignationsByDepIdQuery(
      filterData.departmentId ? filterData.departmentId : skipToken
    );
  const desigData = designationdata?.data || [];

  // Decide which cities to show
  const designationsData = filterData.departmentId
    ? desigData || [] // agar state selected hai to hamesha API ka use karo
    : designations || [];

  //  Mutations
  const [createDesignation, { isLoading: creating }] =
    useCreateDesignationMutation();
  const [updateDesignation, { isLoading: updating }] =
    useUpdateDesignationMutation();
  const [deleteDesignation, { isLoading: deleting }] =
    useDeleteDesignationMutation();

  //  Search Filter
  const filteredDesignations = designationsData.filter(
    (d) =>
      d.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.branchId?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.depId?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //  Handlers
  const handleAdd = () => {
    setShowModal(true);
    setIsEditing(false);
    setFormData({
      _id: "",
      zoneId: "",
      stateId: "",
      cityId: "",
      branchId: "",
      depId: "",
      title: "",
      description: "",
    });
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setShowModal(true);
    setFormData({
      _id: item._id,
      zoneId: item.zoneId?._id || "",
      stateId: item.stateId?._id || "",
      cityId: item.cityId?._id || "",
      branchId: item.branchId?._id || "",
      depId: item.depId?._id || "",
      title: item.title || "",
      description: item.description || "",
    });
  };

  const confirmDelete = async () => {
    if (!selectedId) return;
    try {
      const res = await deleteDesignation(selectedId).unwrap();
      toast.success(res?.message || "Designation deleted successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete designation.");
    } finally {
      setOpenDialog(false);
      setSelectedId(null);
    }
  };

  // const handleDelete = (id) => {
  //   setSelectedId(id);
  //   setOpenDialog(true);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { depId, title } = formData;
    if (!depId || !title) {
      toast.error("Please fill all required fields.");
      return;
    }
    try {
      if (isEditing) {
        await updateDesignation({ id: formData._id, data: formData }).unwrap();
        toast.success("Designation updated successfully!");
      } else {
        await createDesignation(formData).unwrap();
        toast.success("Designation added successfully!");
      }
      setShowModal(false);
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong.");
    }
  };

  if (isError) return <ErrorMessage message="Failed to load Designations." />;

  //  Render
  return (
    <div className="p-2 max-w-10xl mx-auto space-y-6">
      <PageHeader
        title="Designation Management"
        btnTitle="Add"
        onClick={handleAdd}
      />

      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 space-y-4">
  
        {/*  Search + Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/*  Search + Zone + State + City + Branch (inline grouping) */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* 🔍 Search Bar */}
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-72 md:w-80 bg-white shadow-sm">
              <SearchIcon className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search Designation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full focus:outline-none text-gray-700 placeholder-gray-400 text-sm"
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
                  branchId: "",
                  departmentId: "",
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

            {/* branch Filter */}
            <select
              value={filterData.branchId || ""}
              onChange={(e) =>
                setFilterData({
                  ...filterData,
                  branchId: e.target.value,
                })
              }
              disabled={!filterData.cityId || branchesLoading}
              className={`border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 w-36 disabled:bg-gray-100 ${
                !filterData.cityId || branchesLoading
                  ? "cursor-not-allowed"
                  : ""
              }`}
            >
              <option value="">- All Branches -</option>
              {branches.map((branch) => (
                <option key={branch._id} value={branch._id}>
                  {branch.title}
                </option>
              ))}
            </select>

            {/* department Filter */}
            <select
              value={filterData.departmentId || ""}
              onChange={(e) =>
                setFilterData({
                  ...filterData,
                  departmentId: e.target.value,
                })
              }
              disabled={!filterData.branchId || designationLoading}
              className={`border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 w-36 disabled:bg-gray-100 ${
                !filterData.branchId || designationLoading
                  ? "cursor-not-allowed"
                  : ""
              }`}
            >
              <option value="">- All Department -</option>
              {departments.map((dep) => (
                <option key={dep._id} value={dep._id}>
                  {dep.title}
                </option>
              ))}
            </select>
          </div>

          {/*  View Switch */}

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
        {/*  Designation Cards */}

        {designationLoading ? (
          <DepLoading text="Loading designation..." />
        ) : (
          <>
        {view === "card" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredDesignations.length > 0 ? (
              filteredDesignations.map((d) => (
                <div
                  key={d._id}
                  className="group relative bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200 hover:border-orange-300 p-5 transition-all"
                >
                  <div className="relative z-10 flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 capitalize">
                        {d.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Department:</span>{" "}
                        {d.depId?.title || "—"}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Branch:</span>{" "}
                        {d.branchId?.title || "—"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {d.description || "No description"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(d)}
                        className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {/* <button
                      onClick={() => handleDelete(d._id)}
                      disabled={deleting}
                      className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 disabled:opacity-50"
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
                <p className="text-gray-500 font-medium">
                  No designation found
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Try adding a new department to get started.
                </p>
              </div>
            )}
          </div>
        ) : (
          // 🧾 List View
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-700 border border-gray-300">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr>
                  <th className="p-2 text-left border-r border-gray-200">
                    Title
                  </th>
                  <th className="p-2 text-left border-r border-gray-200">
                    Branch
                  </th>
                  <th className="p-2 text-left border-r border-gray-200">
                    Department
                  </th>
                  <th className="p-2 text-center border-r border-gray-200">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDesignations.length > 0 ? (
                  filteredDesignations.map((d) => (
                    <tr key={d._id} className="border-t hover:bg-gray-50">
                      <td className="p-2 border-r border-gray-200">
                        {d.title}
                      </td>
                      <td className="p-2 border-r border-gray-200">
                        {d.branchId?.title}
                      </td>
                      <td className="p-2 border-r border-gray-200">
                        {d.depId?.title}
                      </td>
                      <td className="p-2 border-r border-gray-200 text-center space-x-3">
                        <button
                          onClick={() => handleEdit(d)}
                          className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 transition-all duration-200 cursor-pointer"
                        >
                          <Edit className="w-4 h-4 inline-block" />
                        </button>
                        {/* <button
                        onClick={() => handleDelete(d._id)}
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
                      No designation found
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

      {/*  Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {isEditing ? "Edit Designation" : "Add New Designation"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/*  Hierarchy fields only show when NOT editing */}
                {!isEditing && (
                  <>
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
                            branchId: "",
                            depId: "",
                          })
                        }
                        className="w-full border rounded-lg px-3 py-2"
                      >
                        <option value="">-- Select Zone --</option>
                        {zonesLoading ? (
                          <option disabled>Loading...</option>
                        ) : (
                          zones.map((z) => (
                            <option key={z._id} value={z._id}>
                              {z.title}
                            </option>
                          ))
                        )}
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
                            branchId: "",
                            depId: "",
                          })
                        }
                        disabled={!formData.zoneId || statesLoading}
                        className={`w-full border rounded-lg px-3 py-2 ${
                          !formData.zoneId
                            ? "bg-gray-100 text-gray-400"
                            : "bg-white"
                        }`}
                      >
                        <option value="">-- Select State --</option>
                        {states.map((s) => (
                          <option key={s._id} value={s._id}>
                            {s.title}
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
                          setFormData({
                            ...formData,
                            cityId: e.target.value,
                            branchId: "",
                            depId: "",
                          })
                        }
                        disabled={!formData.stateId || citiesLoading}
                        className={`w-full border rounded-lg px-3 py-2 ${
                          !formData.stateId
                            ? "bg-gray-100 text-gray-400"
                            : "bg-white"
                        }`}
                      >
                        <option value="">-- Select City --</option>
                        {cities.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Branch */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Branch
                      </label>
                      <select
                        value={formData.branchId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            branchId: e.target.value,
                            depId: "",
                          })
                        }
                        disabled={!formData.cityId || branchesLoading}
                        className={`w-full border rounded-lg px-3 py-2 ${
                          !formData.cityId
                            ? "bg-gray-100 text-gray-400"
                            : "bg-white"
                        }`}
                      >
                        <option value="">-- Select Branch --</option>
                        {branches.map((b) => (
                          <option key={b._id} value={b._id}>
                            {b.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {/*  Department (always show) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Department
                  </label>
                  <select
                    value={formData.depId}
                    onChange={(e) =>
                      setFormData({ ...formData, depId: e.target.value })
                    }
                    disabled={(!formData.branchId && !isEditing) || deptLoading}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">-- Select Department --</option>
                    {departments.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Designation Title */}
                <div>
                  <ValidatedInput
                    label="Designation Title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    onValidChange={handleValidityChange}
                    required
                    minLength={3}
                    maxLength={50}
                    placeholder="Enter Designation Title"
                  />
                </div>

                {/* Description (full width) */}
                <div className="md:col-span-2">
                  <ValidatedInput
                    label="Description"
                    name="description"
                    type="textarea"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    onValidChange={handleValidityChange}
                    required
                    rows={3}
                    minLength={10}
                    maxLength={300}
                    placeholder="Enter Description..."
                  />
                </div>
              </div>

              {/* Buttons */}
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
                  disabled={!isFormValid || creating || updating}
                  className={`px-4 py-2 rounded-lg flex items-center justify-center gap-2 ${
                    !isFormValid
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-orange-500 hover:bg-orange-600 text-white"
                  }`}
                >
                  {creating || updating ? (
                    <FaSpinner className="animate-spin" />
                  ) : isEditing ? (
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

      {/* Delete Confirm */}
      <ConfirmDialog
        open={openDialog}
        title="Confirm Delete"
        message="Are you sure you want to delete this Designation?"
        onConfirm={confirmDelete}
        isLoading={deleting}
        onCancel={() => setOpenDialog(false)}
      />
    </div>
  );
};

export default Designation;
