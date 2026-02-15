import React, { useState } from "react";
import PageHeader from "@/components/PageHeader";
import {
  useGetZonesQuery,
  useGetStatesByZoneQuery,
  useGetCitiesByStateQuery,
  useGetBranchesByCityQuery,
} from "@/api/admin/department-management/location-heirarchy/master.api";
import {
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  useGetDepartmentByBranchQuery,
} from "@/api/admin/department-management/department-designation/department.api";
import ErrorMessage from "../ErrorMessage";
import ConfirmDialog from "@/components/ConfirmationToastPopUp";
import { Edit, Grid, List, Trash2, Search as SearchIcon } from "lucide-react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import { skipToken } from "@reduxjs/toolkit/query";
import ValidatedInput from "@/components/ValidatedInput";
import DepLoading from "../../DepLoading";

const Department = ({ departments = [], isError }) => {
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [formData, setFormData] = useState({
    zoneId: "",
    stateId: "",
    cityId: "",
    branch: "",
    title: "",
  });
  const [filterData, setFilterData] = useState({
    zoneId: "",
    stateId: "",
    cityId: "",
    branchId: "",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [view, setView] = useState("card");
  const [searchQuery, setSearchQuery] = useState("");

  // Add this new state
  const [formValidity, setFormValidity] = useState({ title: false });

  // Helper: track validation updates
  const handleValidityChange = (name, isValid) => {
    setFormValidity((prev) => ({ ...prev, [name]: isValid }));
  };

  // Determine if whole form is valid
  const isFormValid = Object.values(formValidity).every(Boolean);

  //  Fetch Zones
  const {
    data: zoneData,
    isLoading: zonesLoading,
    isError: zonesError,
  } = useGetZonesQuery();
  const zones = zoneData?.data || [];

  //  Fetch States (filtered by zone)
  const {
    data: stateData,
    isFetching: statesLoading,
    isError: statesError,
  } = useGetStatesByZoneQuery(
    formData.zoneId || filterData.zoneId
      ? formData.zoneId || filterData.zoneId
      : skipToken
  );
  const states = stateData?.data || [];

  //  Fetch Cities (filtered by state)
  const {
    data: cityData,
    isFetching: citiesLoading,
    isError: citiesError,
  } = useGetCitiesByStateQuery(
    formData.stateId || filterData.stateId
      ? formData.stateId || filterData.stateId
      : skipToken
  );
  const cities = cityData?.data || [];

  //  Fetch Branches (filtered by city)
  const {
    data: branchData,
    isFetching: branchesLoading,
    isError: branchesError,
  } = useGetBranchesByCityQuery(
    formData.cityId || filterData.cityId
      ? formData.cityId || filterData.cityId
      : skipToken
  );
  const branches = branchData?.data || [];

  //  Fetch Branches (filtered by city)
  const {
    data: departmentsData,
    isFetching: departmentsLoading,
    isError: departmentsError,
  } = useGetDepartmentByBranchQuery(
    filterData.branchId ? filterData.branchId : skipToken
  );
  const departmentsDataByBranch = departmentsData?.data || [];

  // Decide which cities to show
  const departmentData = filterData.branchId
    ? departmentsDataByBranch || [] // agar state selected hai to hamesha API ka use karo
    : departments || [];

  //  CRUD Mutations
  const [createDepartment, { isLoading: creating }] =
    useCreateDepartmentMutation();
  const [updateDepartment, { isLoading: updating }] =
    useUpdateDepartmentMutation();
  const [deleteDepartment, { isLoading: deleting }] =
    useDeleteDepartmentMutation();

  //  Error Handling
  if (isError) return <ErrorMessage message="Failed to load Departments." />;

  //  Search Filter
  const filteredDepartments = departmentData.filter(
    (d) =>
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.departmentId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.branch?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //  Handlers
  const handleAdd = () => {
    setEditMode(false);
    setFormData({
      zoneId: "",
      stateId: "",
      cityId: "",
      branch: "",
      title: "",
    });
    setShowModal(true);
  };

  const handleEdit = (dept) => {
    setSelectedDepartment(dept);
    setFormData({
      zoneId: dept.branch?.city?.state?.zone?._id || "",
      stateId: dept.branch?.city?.state?._id || "",
      cityId: dept.branch?.city?._id || "",
      branch: dept.branch?._id || "",
      title: dept.title,
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setDeleteTarget(id);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await deleteDepartment(deleteTarget).unwrap();
      if (res?.success)
        toast.success(res.message || "Department deleted successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete department");
    } finally {
      setOpenDialog(false);
      setDeleteTarget(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { branch, title } = formData;

    if (!branch || !title) {
      toast.error("Please fill all required fields.");
      return;
    }

    // find selected branch details
    const selectedBranch = branches.find((b) => b._id === branch);
    const payload = {
      title,
      branch: selectedBranch?._id,
    };

    try {
      if (editMode && selectedDepartment) {
        const res = await updateDepartment({
          id: selectedDepartment._id,
          data: payload,
        }).unwrap();
        toast.success(res?.message || "Department updated successfully!");
      } else {
        const res = await createDepartment(payload).unwrap();
        toast.success(res?.message || "Department added successfully!");
      }
      setShowModal(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save department.");
    }
  };

  return (
    <div className="p-2 max-w-10xl mx-auto space-y-6">
      <PageHeader
        title="Department Management"
        btnTitle="Add"
        onClick={handleAdd}
      />

      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 space-y-4">

        {/*  Search + Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/*  Search + Zone + State + City + Branch (inline grouping) */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/*  Search Bar */}
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-72 md:w-80 bg-white shadow-sm">
              <SearchIcon className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search Department..."
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

   {departmentsLoading ? (
          <DepLoading text="Loading department..." />
        ) : (
          <>
        {/*  Card/List View */}
        {view === "card" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {filteredDepartments.length > 0 ? (
              filteredDepartments.map((dept) => (
                <div
                  key={dept._id}
                  className="group relative bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200 hover:border-orange-300 p-5 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 to-amber-50/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="relative z-10 flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center shadow-sm">
                        <span className="text-orange-700 font-bold text-lg uppercase">
                          {dept.title?.[0] || "D"}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 capitalize">
                          {dept.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-50 text-orange-700 border border-orange-100">
                            {dept.departmentId}
                          </span>
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Branch:</span>{" "}
                          {dept.branch?.title || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* ✏️ Action Buttons */}
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(dept)}
                        className="p-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 transition-all"
                        title="Edit Department"
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
                <p className="text-gray-500 font-medium">
                  No departments found
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Try adding a new department to get started.
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
                    Department ID
                  </th>
                  <th className="p-2 text-left border-r border-gray-200">
                    Department Title
                  </th>
                  <th className="p-2 text-left border-r border-gray-200">
                    Branch
                  </th>
                  <th className="p-2 text-center border-r border-gray-200">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDepartments.length > 0 ? (
                  filteredDepartments.map((dept) => (
                    <tr key={dept._id} className="border-t hover:bg-gray-50">
                      <td className="p-2 border-r border-gray-200">
                        {dept.departmentId}
                      </td>
                      <td className="p-2 border-r border-gray-200">
                        {dept.title}
                      </td>
                      <td className="p-2 border-r border-gray-200">
                        {dept.branch?.title}
                      </td>
                      <td className="p-2 border-r border-gray-200 text-center space-x-3">
                        <button
                          onClick={() => handleEdit(dept)}
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
                      No departments found
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

      {/* 🧾 Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {editMode ? "Update Department" : "Add New Department"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 👇 Hide Zone/State/City when Editing */}
              {!editMode && (
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
                          branch: "",
                        })
                      }
                      className={`w-full border rounded-lg px-3 py-2 ${
                        zonesLoading
                          ? "bg-gray-100 cursor-wait text-gray-400"
                          : "bg-white text-gray-800"
                      }`}
                      disabled={zonesLoading}
                    >
                      <option value="">-- Select Zone --</option>
                      {zonesLoading ? (
                        <option disabled>Loading Zones...</option>
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
                          branch: "",
                        })
                      }
                      className={`w-full border rounded-lg px-3 py-2 ${
                        !formData.zoneId || statesLoading
                          ? "bg-gray-100 cursor-not-allowed text-gray-400"
                          : "bg-white text-gray-800"
                      }`}
                      disabled={!formData.zoneId || statesLoading}
                    >
                      <option value="">-- Select State --</option>
                      {statesLoading ? (
                        <option disabled>Loading States...</option>
                      ) : (
                        states.map((s) => (
                          <option key={s._id} value={s._id}>
                            {s.title}
                          </option>
                        ))
                      )}
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
                          branch: "",
                        })
                      }
                      className={`w-full border rounded-lg px-3 py-2 ${
                        !formData.stateId || citiesLoading
                          ? "bg-gray-100 cursor-not-allowed text-gray-400"
                          : "bg-white text-gray-800"
                      }`}
                      disabled={!formData.stateId || citiesLoading}
                    >
                      <option value="">-- Select City --</option>
                      {citiesLoading ? (
                        <option disabled>Loading Cities...</option>
                      ) : (
                        cities.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.title}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </>
              )}

              {/* Branch — always visible */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Branch
                </label>
                <select
                  value={formData.branch}
                  onChange={(e) =>
                    setFormData({ ...formData, branch: e.target.value })
                  }
                  className={`w-full border rounded-lg px-3 py-2 ${
                    !editMode && (!formData.cityId || branchesLoading)
                      ? "bg-gray-100 cursor-not-allowed text-gray-400"
                      : "bg-white text-gray-800"
                  }`}
                  disabled={!editMode && (!formData.cityId || branchesLoading)}
                >
                  <option value="">-- Select Branch --</option>
                  {branchesLoading ? (
                    <option disabled>Loading Branches...</option>
                  ) : (
                    branches.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.title}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Department Title */}
              <div>
                <ValidatedInput
                  label="Department Title"
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
                  placeholder="Enter Department Title"
                />
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

      {/* 🗑 Confirm Delete */}
      <ConfirmDialog
        open={openDialog}
        title="Confirm Delete"
        message="Are you sure you want to delete this Department?"
        onConfirm={confirmDelete}
        isLoading={deleting}
        onCancel={() => setOpenDialog(false)}
      />
    </div>
  );
};

export default Department;
