import React, { useState, useEffect } from "react";
import {
  Shield,
  Edit,
  Grid,
  List,
  Search as SearchIcon,
  X,
} from "lucide-react";
import Swal from "sweetalert2";
import PageHeader from "@/components/PageHeader";
import ErrorMessage from "../ErrorMessage";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";

import {
  useUpdateActionGroupMutation,
  useDeleteActionGroupMutation,
  useCreateActionGroupMutation,
  useGetDepartmentByBranchQuery,
  useGetDesignationsByDepIdQuery,
  useGetActionsGroupByDepQuery,
} from "@/api/admin/department-management/department-designation/department.api";

import {
  useGetZonesQuery,
  useGetStatesByZoneQuery,
  useGetCitiesByStateQuery,
  useGetBranchesByCityQuery,
} from "@/api/admin/department-management/location-heirarchy/master.api";

import { skipToken } from "@reduxjs/toolkit/query";
import ValidatedInput from "@/components/ValidatedInput";
import DepLoading from "../../DepLoading";

const ActionGroup = ({ actiongroup = [], isError }) => {
  const [view, setView] = useState("card");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalData, setModalData] = useState({ show: false, editData: null });
  const [filterData, setFilterData] = useState({
    zoneId: "",
    stateId: "",
    cityId: "",
    branchId: "",
    departmentId: "",
  });

  //  Fetch Hierarchy Data
  const { data: zoneData, isFetching: zonesLoading } = useGetZonesQuery();
  const zones = zoneData?.data || [];

  const { data: stateData, isFetching: statesLoading } =
    useGetStatesByZoneQuery(filterData.zoneId ? filterData.zoneId : skipToken);
  const states = stateData?.data || [];

  const { data: cityData, isFetching: citiesLoading } =
    useGetCitiesByStateQuery(
      filterData.stateId ? filterData.stateId : skipToken
    );
  const cities = cityData?.data || [];

  const { data: branchData, isFetching: branchesLoading } =
    useGetBranchesByCityQuery(
      filterData.cityId ? filterData.cityId : skipToken
    );
  const branches = branchData?.data || [];

  const { data: deptData, isFetching: deptLoading } =
    useGetDepartmentByBranchQuery(
      filterData.branchId ? filterData.branchId : skipToken
    );
  const departments = deptData?.data || [];

  const { data: userControlData, isFetching: userControlLoading } =
    useGetActionsGroupByDepQuery(
      filterData.departmentId ? filterData.departmentId : skipToken
    );
  const userControlsData = userControlData?.data || [];
  const isUserControlLoading =
    userControlLoading && filterData.departmentId !== "";

  const handleAdd = () => setModalData({ show: true, editData: null });
  const handleEdit = (group) => setModalData({ show: true, editData: group });

  //  Select Data Source (Priority: designations > actiongroup)
  const displayGroups = filterData.departmentId
    ? userControlsData || []
    : actiongroup || [];

  const filteredGroups = displayGroups.filter(
    (g) =>
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isError) return <ErrorMessage message="Failed to load Action Groups." />;

  return (
    <div className="p-2 max-w-9xl mx-auto space-y-6">
      <PageHeader
        title="User Control Management"
        btnTitle="Add"
        onClick={handleAdd}
      />

      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 space-y-4">
        {/*  Search + Filters + View Switch */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* 🔎 Search + Filters Section */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* 🔍 Search Bar */}
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-72 md:w-80 bg-white shadow-sm">
              <SearchIcon className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search Action Group..."
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

            {/* 🏢 Branch Filter */}
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

            {/* 🧩 Department Filter */}
            <select
              value={filterData.departmentId || ""}
              onChange={(e) =>
                setFilterData({
                  ...filterData,
                  departmentId: e.target.value,
                })
              }
              disabled={!filterData.branchId || deptLoading}
              className={`border border-gray-300 rounded-lg px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 w-36 disabled:bg-gray-100 ${
                !filterData.branchId || deptLoading ? "cursor-not-allowed" : ""
              }`}
            >
              <option value="">- All Departments -</option>
              {departments.map((dep) => (
                <option key={dep._id} value={dep._id}>
                  {dep.title}
                </option>
              ))}
            </select>
          </div>

          {/* 👁️ View Switch Buttons */}
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

    {view === "card" ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {userControlLoading ? (
      //  Show Loader while loading
      <div className="col-span-full flex justify-center py-16">
        <DepLoading text="Loading user control..." />
      </div>
    ) : filteredGroups.length > 0 ? (
      //  Show data when available
      filteredGroups.map((group) => (
        <ActionGroupCard
          key={group._id}
          group={group}
          onEdit={handleEdit}
        />
      ))
    ) : (
      //  No data fallback
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
          No user controller found
        </p>
        <p className="text-gray-400 text-sm mt-1">
          Try adding a new user controller to get started.
        </p>
      </div>
    )}
  </div>
) : (
  <ActionGroupList
    groups={filteredGroups}
    userControlLoading={userControlLoading}
    onEdit={handleEdit}
  />
)}

      </div>

      {modalData.show && (
        <AddActionGroupModal
          onClose={() => setModalData({ show: false, editData: null })}
          editData={modalData.editData}
        />
      )}
    </div>
  );
};

/* ----------------------------------------------------------------
   ADD / EDIT ACTION GROUP MODAL
------------------------------------------------------------------ */
const AddActionGroupModal = ({ onClose, editData }) => {
  const isEdit = !!editData;

  // Add this new state
  const [formValidity, setFormValidity] = useState({ title: false });

  // Helper: track validation updates
  const handleValidityChange = (name, isValid) => {
    setFormValidity((prev) => ({ ...prev, [name]: isValid }));
  };

  // Determine if whole form is valid
  const isFormValid = Object.values(formValidity).every(Boolean);

  const [formData, setFormData] = useState({
    zoneId: "",
    stateId: "",
    cityId: "",
    branchId: "",
    department: "",
    title: "",
    description: "",
    permissions: { crud: [], workflow: [], data: [], system: [] },
  });

  const [createActionGroup, { isLoading: adding }] =
    useCreateActionGroupMutation();
  const [updateActionGroup, { isLoading: updating }] =
    useUpdateActionGroupMutation();

  const { data: zoneData } = useGetZonesQuery();
  const zones = zoneData?.data || [];

  const { data: stateData } = useGetStatesByZoneQuery(
    formData.zoneId || skipToken
  );
  const states = stateData?.data || [];

  const { data: cityData } = useGetCitiesByStateQuery(
    formData.stateId || skipToken
  );
  const cities = cityData?.data || [];

  const { data: branchData } = useGetBranchesByCityQuery(
    formData.cityId || skipToken
  );
  const branches = branchData?.data || [];

  const { data: deptData } = useGetDepartmentByBranchQuery(
    formData.branchId || skipToken
  );
  const departments = deptData?.data || [];

  useEffect(() => {
    if (isEdit && editData) {
      setFormData({
        ...formData,
        department: editData.department?.title || "",
        title: editData.title || "",
        description: editData.description || "",
        permissions: editData.permissions || {
          crud: [],
          workflow: [],
          data: [],
          system: [],
        },
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...formData, [name]: value };

    if (name === "zoneId") {
      updatedData.stateId =
        updatedData.cityId =
        updatedData.branchId =
        updatedData.department =
          "";
    } else if (name === "stateId") {
      updatedData.cityId = updatedData.branchId = updatedData.department = "";
    } else if (name === "cityId") {
      updatedData.branchId = updatedData.department = "";
    } else if (name === "branchId") {
      updatedData.department = "";
    }

    setFormData(updatedData);
  };

  const togglePermission = (category, value) => {
    setFormData((prev) => {
      const exists = prev.permissions[category].includes(value);
      return {
        ...prev,
        permissions: {
          ...prev.permissions,
          [category]: exists
            ? prev.permissions[category].filter((v) => v !== value)
            : [...prev.permissions[category], value],
        },
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.department || !formData.title) {
      toast.error("DepartmentId title required fields!");
      return;
    }

    let payload = {
      title: formData.title,
      department: formData.department,
      description: formData.description,
      permissions: formData.permissions,
    };

    try {
      if (isEdit) {
        payload.department = editData.department._id;
        await updateActionGroup({ id: editData._id, data: payload }).unwrap();
        toast.success("Action Group updated successfully!");
      } else {
        await createActionGroup(payload).unwrap();
        toast.success("Action Group added successfully!");
      }
      onClose();
    } catch {
      toast.error(
        isEdit
          ? "Failed to update Action Group."
          : "Failed to add Action Group."
      );
    }
  };

  const categories = {
    crud: ["view", "create", "update", "delete"],
    workflow: ["import", "export", "assign", "approve", "reject", "submit"],
    data: ["filter", "search", "sort", "generate_report"],
    system: ["login", "logout", "reset_password", "notify", "track"],
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto ">
        <div className="flex justify-between items-center mb-4 border-b pb-2 ">
          <h2 className="text-xl font-semibold">
            {isEdit ? "Update User Control" : "Add User Control"}
          </h2>
          <button
            onClick={onClose}
            className="bg-gray-200 text-black rounded-full p-1.5  hover:scale-105   transition-all duration-300 ease-in-out hover:bg-gray-300 hover:text-red-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dropdowns - hide in Edit mode except Department */}
          {!isEdit && (
            <div className="grid grid-cols-2 gap-3">
              <select
                name="zoneId"
                value={formData.zoneId}
                onChange={handleChange}
                className="border rounded-lg p-2 text-black"
              >
                <option value="">-- Select Zone --</option>
                {zones.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.title}
                  </option>
                ))}
              </select>

              <select
                name="stateId"
                value={formData.stateId}
                onChange={handleChange}
                disabled={!formData.zoneId}
                className="border rounded-lg p-2 text-black disabled:bg-gray-100"
              >
                <option value="">-- Select State --</option>
                {states.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.title}
                  </option>
                ))}
              </select>

              <select
                name="cityId"
                value={formData.cityId}
                onChange={handleChange}
                disabled={!formData.stateId}
                className="border rounded-lg p-2 text-black disabled:bg-gray-100"
              >
                <option value="">-- Select City --</option>
                {cities.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.title}
                  </option>
                ))}
              </select>

              <select
                name="branchId"
                value={formData.branchId}
                onChange={handleChange}
                disabled={!formData.cityId}
                className="border rounded-lg p-2 text-black disabled:bg-gray-100"
              >
                <option value="">-- Select Branch --</option>
                {branches.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Department (always visible) */}
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className={`border rounded-lg p-2 text-black w-full ${
              isEdit ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
            disabled={isEdit} //  disable only in edit mode
          >
            {isEdit ? (
              <option value="">{formData.department}</option>
            ) : (
              <>
                <option value="">-- Select Department --</option>
                {departments.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.title}
                  </option>
                ))}
              </>
            )}
          </select>

          {/* Title & Description in one row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ValidatedInput
              // label="Designation Title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              onValidChange={handleValidityChange}
              required
              minLength={3}
              maxLength={50}
              placeholder="Enter Action Title"
            />
            <ValidatedInput
              // label="Designation Title"
              name="description"
              type="text"
              value={formData.description}
              onChange={handleChange}
              onValidChange={handleValidityChange}
              required
              minLength={3}
              maxLength={50}
              placeholder="Enter description..."
            />
          </div>

          {/* Permissions */}
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(categories).map(([key, values]) => (
              <div key={key} className="border rounded-lg p-3">
                <p className="font-semibold mb-2 capitalize">{key}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {values.map((item) => (
                    <label key={item} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.permissions[key].includes(item)}
                        onChange={() => togglePermission(key, item)}
                      />
                      {item}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
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
              ) : isEdit ? (
                "Update"
              ) : (
                "Add"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ----------------------------------------------------------------
   CARD COMPONENT
------------------------------------------------------------------ */
const ActionGroupCard = ({ group, onEdit }) => {
  const [deleteActionGroup, { isLoading: deleting }] =
    useDeleteActionGroupMutation();

  const handleDelete = async (e) => {
    e.stopPropagation();
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete this Action Group!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete",
    });

    if (result.isConfirmed) {
      try {
        await deleteActionGroup(group._id);
        toast.success("Action Group deleted successfully!");
      } catch {
        toast.error("Failed to delete Action Group.");
      }
    }
  };

  const permissions = group.permissions || {};

  return (
    <div
      onClick={() => {
        onEdit(group);
      }}
      className="relative self-start bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg hover:border-orange-300 transition-all duration-300 cursor-pointer group"
    >
      <div className="p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center shadow-sm">
              <Shield className="text-orange-700 w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 capitalize">
                {group.title}
              </h3>
              <p className="text-sm text-gray-500 font-medium">
                Department:{" "}
                <span className="text-gray-700">
                  {group.department?.title || "No Department"}
                </span>
              </p>
              <p className="text-sm text-gray-600 mt-1 truncate  max-w-[200px]">
                {group.description || "No description"}
              </p>
            </div>
          </div>

          {/* Edit Button */}
          <div
            className="flex items-center gap-2 ml-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => onEdit(group)}
              className="p-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 transition-all"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Footer Section */}
        <div className="mt-4">
          <button
            onClick={() => onEdit(group)}
            className="inline-flex items-center cursor-pointer gap-2 text-sm font-semibold text-orange-600 group-hover:text-orange-700 transition-all"
          >
            View Details
            <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform duration-200">
              →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

/* ----------------------------------------------------------------
   LIST COMPONENT (for view = "list")
------------------------------------------------------------------ */
const ActionGroupList = ({ groups, userControlLoading, onEdit }) => {
  const [updateActionGroup, { isLoading: updating }] =
    useUpdateActionGroupMutation();
  const [deleteActionGroup, { isLoading: deleting }] =
    useDeleteActionGroupMutation();

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete this Action Group!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete",
    });

    if (result.isConfirmed) {
      try {
        await deleteActionGroup(id);
        toast.success("Action Group deleted successfully!");
      } catch {
        toast.error("Failed to delete Action Group.");
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-gray-700 border border-gray-300 overflow-hidden">
        <thead className="bg-gray-100 border-b border-gray-300">
          <tr>
            {[
              { label: "Title" },
              { label: "Description" },
              { label: "CRUD" },
              { label: "Workflow" },
              { label: "Data" },
              { label: "System" },
              { label: "Actions" },
            ].map((col, index) => (
              <th
                key={index}
                className={`p-3 text-center border-r border-gray-200`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {userControlLoading ? (
            //  Loader row when loading
            <tr>
              <td colSpan="7" className="py-10 text-center">
                <DepLoading text="Loading user control..." />
              </td>
            </tr>
          ) : groups.length > 0 ? (
            //  Show rows when data available
            groups.map((group) => (
              <tr key={group._id} className="border-t hover:bg-gray-50">
                <td className="p-2 border-r border-gray-200 text-center">
                  {group.title}
                </td>
                <td className="p-2 text-sm text-center text-gray-700 max-w-[240px] line-clamp-2">
                  {group.description || "-"}
                </td>

                <td className="p-2 text-center border-r border-l border-gray-200">
                  {group.permissions?.crud?.join(", ") || "-"}
                </td>
                <td className="p-2 text-center border-r border-gray-200">
                  {group.permissions?.workflow?.join(", ") || "-"}
                </td>
                <td className="p-2 text-center border-r border-gray-200">
                  {group.permissions?.data?.join(", ") || "-"}
                </td>
                <td className="p-2 text-center border-r border-gray-200">
                  {group.permissions?.system?.join(", ") || "-"}
                </td>

                {/*  Action Icons */}
                <td className="p-2 text-center border-r border-gray-200">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => onEdit(group)}
                      disabled={updating}
                      className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 transition-all disabled:opacity-50"
                      title="Edit"
                    >
                      {updating ? (
                        <FaSpinner className="animate-spin w-4 h-4" />
                      ) : (
                        <Edit className="w-4 h-4" />
                      )}
                    </button>
                    {/* 
            <button
              onClick={() => handleDelete(group._id)}
              disabled={deleting}
              className="p-2 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 transition-all disabled:opacity-50"
              title="Delete"
            >
              {deleting ? (
                <FaSpinner className="animate-spin w-4 h-4" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button> 
            */}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            //  No data fallback
            <tr>
              <td
                colSpan="7"
                className="text-center text-gray-500 py-6 italic bg-gray-50"
              >
                No user controller found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
export default ActionGroup;
