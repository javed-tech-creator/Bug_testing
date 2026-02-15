import React, { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import { Edit, Eye, SearchIcon, Users, X } from "lucide-react";
import { toast } from "react-toastify";
import {
  useGetZonesQuery,
  useGetStatesByZoneQuery,
  useGetCitiesByStateQuery,
  useGetBranchesByCityQuery,
} from "@/api/admin/department-management/location-heirarchy/master.api";

import {
  useGetActionsGroupByDepQuery,
  useGetDepartmentByBranchQuery,
  useGetDesignationsByDepIdQuery,
} from "@/api/admin/department-management/department-designation/department.api";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  useRegisterUserMutation,
  useGetRegisteredUsersQuery,
  useLazyGetRegisteredUsersByIdQuery,
  useUpdateRegisteredUserMutation,
  useGetUsersByDesignationIdQuery,
  useUpdateUserStatusMutation,
  useLazyGetEmployeeProfileQuery,
} from "@/api/admin/user-management/user.management.api";
import { FaSpinner } from "react-icons/fa";
import DataLoading from "@/modules/vendor/components/DataLoading";
import ValidatedInput from "@/components/ValidatedInput";
import { useLazyGetAllVendorsQuery } from "@/api/admin/vendor-profile-management/vendor.management.api";
import { useLazyGetAllContractorsQuery } from "@/api/admin/contractor-profile-management/contractor.management.api";
import { useLazyGetAllFreelancersQuery } from "@/api/admin/freelancer-profile-management/freelancer.management.api";
import { useLazyGetAllPartnersQuery } from "@/api/admin/partner-profile-management/partner.management.api";
import { useLazyGetAllFranchisesQuery } from "@/api/admin/franchise-profile-management/franchise.management.api";
import { useNavigate } from "react-router-dom";

const UserManagement = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [filteredActions, setFilteredActions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [typeList, settypeList] = useState([]);
  const [selectDataGenPassword, isSelectDataGenPassword] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [localUsers, setLocalUsers] = useState([]);

  const navigate = useNavigate();

  const initialFormData = {
    type: "",
    manageBy: "",
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    password: "",
    zone: "",
    state: "",
    city: "",
    branch: "",
    department: "",
    designation: "",
    profile: "",
    actionGroups: [],
  };

  const [formData, setFormData] = useState(initialFormData);

  const resetFormData = () => {
    setFormData(initialFormData);
  };

  const handleCloseModal = () => {
    resetFormData();
    setFilteredActions([]);
    setSelectedUserId(null);
    setModalOpen(false);
  };

  const [getVendors, { data: vendorData }] = useLazyGetAllVendorsQuery();

  const [getContractors, { data: contractorData }] =
    useLazyGetAllContractorsQuery();

  const [getFreelancers, { data: freelancerData }] =
    useLazyGetAllFreelancersQuery();

  const [getPartners, { data: partnerData }] = useLazyGetAllPartnersQuery();

  const [getFranchises, { data: franchiseData }] =
    useLazyGetAllFranchisesQuery();

  // Add this new state
  const [formValidity, setFormValidity] = useState({});

  // Helper: track validation updates
  const handleValidityChange = (name, isValid) => {
    setFormValidity((prev) => ({ ...prev, [name]: isValid }));
  };

  // Determine if whole form is valid
  const isFormValid = Object.values(formValidity).every(Boolean);

  const [createUser, { isLoading }] = useRegisterUserMutation();

  // Location hierarchy fetch
  const { data: zoneData } = useGetZonesQuery();
  const zones = zoneData?.data || [];

  const { data: stateData } = useGetStatesByZoneQuery(
    formData.zone || skipToken
  );
  const states = stateData?.data || [];

  const { data: cityData } = useGetCitiesByStateQuery(
    formData.state || skipToken
  );
  const cities = cityData?.data || [];

  const { data: branchData } = useGetBranchesByCityQuery(
    formData.city || skipToken
  );
  const branches = branchData?.data || [];

  const { data: deptData } = useGetDepartmentByBranchQuery(
    formData.branch || skipToken
  );
  const departments = deptData?.data || [];

  const { data: designationData } = useGetDesignationsByDepIdQuery(
    formData.department || skipToken
  );
  const designations = designationData?.data || [];

  const { data: actiongroupData } = useGetActionsGroupByDepQuery(
    formData.department || skipToken
  );
  // const actions = actiongroupData?.data || [];
  const [ getEmployeeProfile,{ data: employeData} ] = useLazyGetEmployeeProfileQuery();

  const { data: registeredUser, isLoading: registeredUserLoading } =
    useGetRegisteredUsersQuery();

  useEffect(() => {
    if (registeredUser?.data?.users) {
      setLocalUsers(registeredUser.data.users);
    }
  }, [registeredUser]);

  const { data: usersByDesignation } = useGetUsersByDesignationIdQuery(
    formData.designation || skipToken
  );
  const usersDesignation = usersByDesignation?.data?.users || [];

  // add the lazy hook:
  const [
    triggerGetUserById,
    {
      data: singleUserData,
      isLoading: singleUserLoading,
      currentData: currentSingleUser,
      isFetching,
    }, // currentData optional
  ] = useLazyGetRegisteredUsersByIdQuery();

  const singleUser = singleUserData?.data?.user || {};

  const [updateUser, { isLoading: isUpdating }] =
    useUpdateRegisteredUserMutation();

  useEffect(() => {
    if (formData.department && actiongroupData?.data) {
      setFilteredActions(actiongroupData.data);
    } else {
      setFilteredActions([]);
    }
  }, [formData.department, actiongroupData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...formData, [name]: value };

    // Reset dependent fields
    if (name === "zone")
      updated.state =
        updated.city =
        updated.branch =
        updated.department =
        updated.designation =
          "";
    if (name === "state")
      updated.city =
        updated.branch =
        updated.department =
        updated.designation =
          "";
    if (name === "city")
      updated.branch = updated.department = updated.designation = "";
    if (name === "branch") updated.department = updated.designation = "";
    if (name === "department") updated.designation = "";

    setFormData(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      //  Required fields list
      const requiredFields = [
        "designation",
        "profile",
        "type",
        // "manageBy",
        "department",
        "zone",
        "state",
        "city",
        "branch",
        // "password",
        "name",
        "email",
        "phone",
        "whatsapp",
      ];

      //  Loop and find missing field
      for (let field of requiredFields) {
        if (!formData[field] || formData[field].toString().trim() === "") {
          toast.error(`Please fill ${field} field`);
          return; //  Stop submit here
        }
      }

      const { ...sendData } = formData;
      let response;

      if (!sendData.password) delete sendData.password;
      sendData.type = sendData.type.toUpperCase();

      if (selectedUserId) {
        // UPDATE existing user
        response = await updateUser({
          id: selectedUserId,
          data: sendData,
        }).unwrap();
        toast.success(response.message || "User updated successfully!");
      } else {
        if (!formData.password) {
          toast.error("Please fill password field");
          return; //  Stop submit here
        }
        // CREATE new user
        console.log("after upparcase is", sendData);

        response = await createUser(sendData).unwrap();
        toast.success(response.message || "User created successfully!");
      }

      setModalOpen(false);
      setFormData(initialFormData);
      setSelectedUserId(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save user.");
      console.error(err);
    }
  };

  const handleAdd = () => setModalOpen(true);

  //  Auto Password Generator Function
  const handleAutoGeneratePassword = () => {
    if (!selectDataGenPassword) {
      toast.warning("Please select an employee first!");
      return;
    }

    //  Generate random 3 digits
    const randomNum = Math.floor(100 + Math.random() * 900); // 100–999

    //  Create password format: EMP25001@123
    const generated = `${selectDataGenPassword}@${randomNum}`;

    setFormData((prev) => ({
      ...prev,
      password: generated,
    }));
  };

  const [updateUserStatus, { isLoading: statusLoading }] =
    useUpdateUserStatusMutation();

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === "Active" ? "Inactive" : "Active";

    // 1️ Optimistic UI Update
    setLocalUsers((prev) =>
      prev.map((u) => (u._id === user._id ? { ...u, status: newStatus } : u))
    );

    try {
      await updateUserStatus({
        id: user._id,
        status: newStatus,
      }).unwrap();

      toast.success(`User is now ${newStatus}`);
    } catch (error) {
      console.error(error);
      // rollback on error
      setLocalUsers((prev) =>
        prev.map((u) =>
          u._id === user._id ? { ...u, status: user.status } : u
        )
      );
      toast.error("Failed to update status");
    }
  };

  //  Table columns configuration
  const columnArray = [
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex justify-center gap-3">
          {/*  View */}
          <button
            onClick={() => handleView(row)}
            title="View Details"
            className="border border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 p-2 rounded-lg transition-all duration-200 cursor-pointer"
          >
            <Eye size={16} />
          </button>

          {/*  Edit */}
          <button
            onClick={() => handleEdit(row)}
            className="p-2 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 transition-all"
            title="Edit User"
          >
            <Edit size={16} />
          </button>
        </div>
      ),
    },
    { key: "userId", label: "ID" },

    {
      key: "status",
      label: "Status",
      render: (row) => (
        <div className="flex flex-col items-center gap-1.5">
          {/* Status Text Upar */}
          <span
            className={`text-xs font-semibold transition-colors duration-300
          ${row.status === "Active" ? "text-green-600" : "text-gray-500"}
        `}
          >
            {row.status}
          </span>

          {/* Toggle Switch */}
          <button
            onClick={() => handleToggleStatus(row)}
            className={`relative inline-flex items-center h-6 w-12 rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer
          ${
            row.status === "Active"
              ? "bg-green-500 focus:ring-green-500"
              : "bg-gray-300 focus:ring-gray-400"
          }
        `}
          >
            {/* Sliding Circle */}
            <span
              className={`inline-flex items-center justify-center h-4 w-4 rounded-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out
            ${row.status === "Active" ? "translate-x-7" : "translate-x-1"}
          `}
            >
              <svg
                className={`w-3 h-3 transition-colors duration-300
              ${row.status === "Active" ? "text-green-500" : "text-gray-400"}
            `}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                {row.status === "Active" ? (
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                ) : (
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                )}
              </svg>
            </span>
          </button>
        </div>
      ),
    },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "designation", label: "Designation" },
    { key: "department", label: "Department" },
    { key: "branch", label: "Branch" },
    { key: "city", label: "City" },
    { key: "state", label: "State" },
    { key: "zone", label: "Zone" },
  ];

  //  Filter users by search query
  const filteredList =
    localUsers?.filter((user) => {
      // Search Filter
      const query = searchQuery.toLowerCase();
      const matchSearch =
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.userId?.toLowerCase().includes(query);

      // Status Filter
      const matchStatus =
        statusFilter === "ALL" || user.status?.toUpperCase() === statusFilter;

      // Type Filter
      const matchType =
        typeFilter === "ALL" || user.type?.toUpperCase() === typeFilter;

      return matchSearch && matchStatus && matchType;
    }) || [];

  const total = filteredList?.length || 0;
  const emptyText = "No users found.";

  //  Handlers for actions
  const handleView = (user) => {
    navigate(`/admin/user-management/profile/${user._id}`);
  };

  const handleEdit = async (user) => {
    try {
      // set which user we are editing (keeps UI state consistent)
      setSelectedUserId(user._id);

      // explicitly trigger the lazy query for this ID
      const result = await triggerGetUserById(user._id).unwrap();

      if (result?.data?.user) {
        // populate form happens in your existing singleUser effect,
        // but you can optionally set it here directly for immediate control:
        const u = result.data.user;
        setFormData({
          type: u.type?.toLowerCase(),
          manageBy: u.manageBy,
          name: u.name || "",
          email: u.email || "",
          phone: u.phone || "",
          whatsapp: u.whatsapp || "",
          password: "",
          zone: u.zone?._id || "",
          state: u.state?._id || "",
          city: u.city?._id || "",
          branch: u.branch?._id || "",
          department: u.department?._id || "",
          designation: u.designation?._id || "",
          profile: u.profile?._id || "",
          actionGroups: u.actionGroups?.map((g) => g._id) || [],
        });
        fetchtypeData(u.type?.toLowerCase());
        setModalOpen(true);

        // only open modal after data is ready
      } else {
        toast.error("Unable to load user details.");
      }
    } catch (err) {
      console.error("Failed to load user:", err);
      toast.error("Error fetching user details.");
    }
  };

  const fetchtypeData = async (type) => {
    try {
      let response;

      if (type === "vendor") {
        response = await getVendors({ isActive: null }).unwrap();
      } else if (type === "contractor") {
        response = await getContractors({ isActive: null }).unwrap();
      } else if (type === "freelancer") {
        response = await getFreelancers({ isActive: null }).unwrap();
      } else if (type === "partner") {
        response = await getPartners({ isActive: null }).unwrap();
      } else if (type === "franchise") {
        response = await getFranchises({ isActive: null }).unwrap();
      }else{
        response = await getEmployeeProfile().unwrap();
      }
      console.log(" respoinse are comming", response);

      settypeList(response?.data || response || []);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load list!");
    }
  };

  return (
    <div className="p-6 max-w-9xl mx-auto space-y-6">
      {/*  Page Header */}
      <PageHeader title="User Management" btnTitle="Add" onClick={handleAdd} />

      {/*  Search Bar Section */}
      <div className="bg-white border border-gray-300 rounded-md shadow-md p-4 space-y-4">
        {/* Header Section with Improved Layout */}
        <div className="bg-white border-b border-gray-200 p-2">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Title Section */}
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-gray-900 to-gray-700 p-2 rounded-md shadow-md">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Registered CRM Users
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {filteredList.length}{" "}
                  {filteredList.length === 1 ? "user" : "users"} found
                </p>
              </div>
            </div>

            {/* Filters and Search Section */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-gray-300 rounded-md px-4 py-1.5 text-sm font-medium text-gray-700 hover:border-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all cursor-pointer shadow-sm"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>

              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-white border border-gray-300 rounded-md px-4 py-1.5 text-sm font-medium text-gray-700 hover:border-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all cursor-pointer shadow-sm"
              >
                <option value="ALL">All Types</option>
                <option value="EMPLOYEE">Employee</option>
                <option value="VENDOR">Vendor</option>
                <option value="CONTRACTOR">Contractor</option>
                <option value="FREELANCER">Freelancer</option>
                <option value="FRANCHISE">Franchise</option>
                <option value="PARTNER">Partner</option>
              </select>

              {/* Search Bar */}
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Search by Name, Email or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-md pl-11 pr-4 py-2 text-sm text-gray-900 placeholder-gray-400 hover:border-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition-all shadow-sm"
                />
                <SearchIcon className="absolute left-4 top-3 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/*  Table Section */}
        <div className="overflow-x-auto">
          {registeredUserLoading ? (
            <div className="flex items-center justify-center py-12">
              <DataLoading /> {/* Apna loader component */}
            </div>
          ) : (
            <table className="w-full text-sm text-gray-800 border border-gray-300 rounded-lg">
              {/* Table Header */}
              <thead className="bg-gray-100 text-gray-900 border-b border-gray-300">
                <tr>
                  {columnArray.map((col) => (
                    <th
                      key={col.key}
                      className="p-3 font-semibold text-center uppercase text-[13px] tracking-wide border-r border-gray-200 last:border-none"
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-gray-200">
                {filteredList.length > 0 ? (
                  filteredList.map((row, i) => (
                    <tr
                      key={i}
                      className="hover:bg-gray-50 transition-all duration-150"
                    >
                      {columnArray.map((col) => (
                        <td
                          key={col.key}
                          className="px-5 py-3 border-r border-gray-200 last:border-none text-center whitespace-nowrap"
                        >
                          {col.render ? col.render(row) : row[col.key] || "-"}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columnArray.length}
                      className="text-center py-8 text-gray-500 text-sm"
                    >
                      {emptyText}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col transform transition-all duration-300 ">
            {/*  Header - Modern Gradient Style */}
            <div className="relative bg-black rounded-t-xl px-6 py-5 shadow-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {selectedUserId ? "Update User" : "Create New User"}
                    </h2>
                    <p className="text-white/80 text-sm">
                      Fill in the details below
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleCloseModal}
                  className="group bg-white/20 backdrop-blur-sm text-white rounded-full p-2 hover:bg-white hover:text-red-500 transition-all duration-300 hover:rotate-90"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Decorative wave */}
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-white rounded-t-xl"></div>
            </div>

            {/* 📝 Content Area */}
            {singleUserLoading || isFetching ? (
              <div className="flex flex-1 items-center justify-center min-h-[400px] bg-gradient-to-br from-orange-50 to-pink-50">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <FaSpinner className="w-12 h-12 animate-spin text-orange-500" />
                    <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-orange-200 animate-pulse"></div>
                  </div>
                  <p className="text-gray-600 font-medium">
                    Loading user data...
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-y-auto px-6 py-6 space-y-6 flex-1 bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
                <form className="space-y-6" id="user-form">
                  {/* 👤 User Type Selection */}
                  <div className="bg-white rounded-md p-5 shadow-sm border-2 border-gray-100 hover:border-orange-200 transition-all duration-300">
                    <label className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                      Select User Type
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      disabled={!!selectedUserId}
                      onChange={(e) => {
                        const type = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          type: type,
                          profile: "",
                          name: "",
                          email: "",
                          phone: "",
                          whatsapp: "",
                          manageBy: type === "employee" ? "" : prev.manageBy,
                        }));
                        if (type) {
                          fetchtypeData(type);
                        }
                      }}
                      className={`border-2 rounded-md p-2 w-full transition-all duration-200 font-medium
                        ${
                          selectedUserId
                            ? "bg-gray-50 border-gray-200 cursor-not-allowed text-gray-400"
                            : "border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 hover:border-gray-300 bg-white"
                        }`}
                    >
                      <option value="">-- Select User Type --</option>
                      <option value="employee"> Employee</option>
                      <option value="vendor"> Vendor</option>
                      <option value="contractor"> Contractor</option>
                      <option value="freelancer"> Freelancer</option>
                      <option value="partner"> Partner</option>
                      <option value="franchise"> Franchise</option>
                    </select>
                  </div>

                  {/* 👨 Select Employee */}
                  {formData.type === "employee" && (
                    <div className="bg-white rounded-md p-5 shadow-sm border-2 border-blue-100 hover:border-blue-300 transition-all duration-300">
                      <label className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        Select Employee
                      </label>
                      <select
                        name="profile"
                        value={formData.profile}
                        onChange={(e) => {
                          const selectedId = e.target.value;
                          const selectedEmp = typeList.find(
                            (emp) => emp._id === selectedId
                          );
                          if (selectedEmp) {
                            setFormData((prev) => ({
                              ...prev,
                              profile: selectedEmp._id,
                              name: selectedEmp.name || "",
                              email: selectedEmp.email || "",
                              phone: selectedEmp.phone || "",
                              whatsapp: selectedEmp.whatsapp || selectedEmp.phone || "",
                            }));
                            isSelectDataGenPassword(selectedEmp.employeeId);
                          } else {
                            setFormData((prev) => ({
                              ...prev,
                              profile: "",
                              name: "",
                              email: "",
                              phone: "",
                              whatsapp: "",
                            }));
                            isSelectDataGenPassword("");
                          }
                        }}
                        className="border-2 border-gray-200 rounded-md p-2 w-full focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 font-medium"
                      >
                        <option value="">-- Select Employee --</option>
                        {typeList.map((emp) => (
                          <option key={emp._id} value={emp._id}>
                            {emp.name} ({emp.employeeId})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* 🏢 Select Other Types */}
                  {formData.type && formData.type !== "employee" && (
                    <div className="bg-white rounded-md p-5 shadow-sm border-2 border-purple-100 hover:border-purple-300 transition-all duration-300">
                      <label className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                        Select {formData.type}
                      </label>
                      <select
                        name="profile"
                        value={formData.profile}
                        onChange={(e) => {
                          const selectedId = e.target.value;
                          const user = typeList.find(
                            (u) => u._id === selectedId
                          );
                          if (user) {
                            setFormData((prev) => ({
                              ...prev,
                              profile: user._id,
                              name: user.contactPersonName || user.name || "",
                              email: user.email || "",
                              phone: user.contactNumber || "",
                              whatsapp:
                                user.whatsapp || user.contactNumber || "",
                            }));
                            isSelectDataGenPassword(user.profileId);
                          }
                        }}
                        className="border-2 border-gray-200 rounded-md p-2 w-full focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-200 font-medium"
                      >
                        <option value="">-- Select {formData.type} --</option>
                        {typeList.map((item) => (
                          <option key={item._id} value={item._id}>
                            {item.contactPersonName} ({item.profileId})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* 📍 Location Hierarchy */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-md p-5 shadow-sm border-2 border-green-100 hover:border-green-300 transition-all duration-300">
                    <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2 pb-3 border-b-2 border-green-200">
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
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
                      Location Hierarchy
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          name: "zone",
                          label: "Zone",
                          data: zones,
                       
                        },
                        {
                          name: "state",
                          label: "State",
                          data: states,
                      
                        },
                        {
                          name: "city",
                          label: "City",
                          data: cities,
                       
                        },
                        {
                          name: "branch",
                          label: "Branch",
                          data: branches,
                       
                        },
                        {
                          name: "department",
                          label: "Department",
                          data: departments,
                       
                        },
                        {
                          name: "designation",
                          label: "Designation",
                          data: designations,
                         
                        },
                        ...(formData.type !== "employee"
                          ? [
                              {
                                name: "manageBy",
                                label: "Managed By",
                                data: usersDesignation,
                              
                              },
                            ]
                          : []),
                      ].map(({ name, label, data,  }) => (
                        <div key={name}>
                          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                            {label}
                          </label>
                          <select
                            name={name}
                            value={formData[name]}
                            onChange={handleChange}
                            disabled={
                              (name === "zone" && !formData.profile) ||
                              (name === "state" && !formData.zone) ||
                              (name === "city" && !formData.state) ||
                              (name === "branch" && !formData.city) ||
                              (name === "department" && !formData.branch) ||
                              (name === "designation" &&
                                !formData.department) ||
                              (name === "manageBy" && !formData.designation)
                            }
                            className="border-2 rounded-md p-2 w-full transition-all duration-200 disabled:bg-gray-50 disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 bg-white"
                          >
                            <option value="">-- Select {label} --</option>
                            {data?.map((item) => (
                              <option key={item._id} value={item._id}>
                                {item.title
                                  ? item.title
                                  : `${item.name} (${item.userId})`}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 🎭 Action Groups */}
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-md p-5 shadow-sm border-2 border-indigo-100 hover:border-indigo-300 transition-all duration-300">
                    <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-indigo-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      Assign Action Groups
                    </h3>
                    <div
                      className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto p-3 bg-white rounded-md border-2 border-indigo-100"
                      style={{ opacity: !formData.designation ? 0.5 : 1 }}
                    >
                      {filteredActions.length === 0 ? (
                        <div className="col-span-2 text-center py-8">
                          <div className="text-gray-400 text-4xl mb-2">📋</div>
                          <p className="text-gray-500 text-sm font-medium">
                            No Action Groups Available
                          </p>
                        </div>
                      ) : (
                        filteredActions.map((action, index) => (
                          <label
                            key={action._id}
                            className={`flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-all duration-200 cursor-pointer
          ${
            formData.actionGroups.includes(action._id)
              ? "bg-gradient-to-r from-orange-100 to-pink-100 border-2 border-orange-400 shadow-sm"
              : "bg-white border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
          }`}
                          >
                            {/* Serial Number */}
                            <span
                              className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all duration-200
            ${
              formData.actionGroups.includes(action._id)
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
                            >
                              {index + 1}
                            </span>

                            {/* Action Title */}
                            <span className="flex-1 text-gray-700">
                              {action.title}
                            </span>

                            {/* Checkbox */}
                            <input
                              type="checkbox"
                              value={action._id}
                              checked={formData.actionGroups.includes(
                                action._id
                              )}
                              onChange={(e) => {
                                const value = e.target.value;
                                setFormData((prev) => ({
                                  ...prev,
                                  actionGroups: prev.actionGroups.includes(
                                    value
                                  )
                                    ? prev.actionGroups.filter(
                                        (id) => id !== value
                                      )
                                    : [...prev.actionGroups, value],
                                }));
                              }}
                              disabled={!formData.designation}
                              className="w-5 h-5 accent-orange-500 rounded cursor-pointer"
                            />
                          </label>
                        ))
                      )}
                    </div>
                  </div>

                  {/* 📋 User Details */}
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-md p-5 shadow-sm border-2 border-orange-100 hover:border-orange-300 transition-all duration-300">
                    <h3 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2 pb-3 border-b-2 border-orange-200">
                      <svg
                        className="w-5 h-5 text-orange-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      User Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          name: "name",
                          type: "text",
                          placeholder: "Enter full name",
                          label: "Full Name",
                          minLength: 3,
                          maxLength: 50,
                        
                        },
                        {
                          name: "email",
                          type: "email",
                          placeholder: "email@example.com",
                          label: "Email Address",
                          minLength: 6,
                          maxLength: 100,
                        
                        },
                        {
                          name: "phone",
                          type: "number",
                          placeholder: "Enter phone number",
                          label: "Phone Number",
                          
                        },
                        {
                          name: "whatsapp",
                          type: "number",
                          placeholder: "Enter WhatsApp number",
                          label: "WhatsApp Number",
                         
                        },
                      ].map((field) => (
                        <div key={field.name}>
                          <ValidatedInput
                            label={` ${field.label}`}
                            name={field.name}
                            type={field.type}
                            value={formData[field.name]}
                            disabled={!formData.designation}
                            onChange={handleChange}
                            onValidChange={handleValidityChange}
                            required
                            minLength={field.minLength}
                            maxLength={field.maxLength}
                            placeholder={field.placeholder}
                          />
                        </div>
                      ))}

                      {!selectedUserId && (
                        <div className="md:col-span-2">
                          <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                            Password <span className="text-red-500">*</span>
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="text"
                              name="password"
                              placeholder="Enter or Generate password"
                              value={formData.password}
                              onChange={handleChange}
                              disabled={!formData.designation}
                              className={`border-2 rounded-md p-2 flex-1 transition-all duration-200
                                ${
                                  !formData.designation
                                    ? "bg-gray-50 border-gray-200 cursor-not-allowed text-gray-400"
                                    : "border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 hover:border-gray-300"
                                }`}
                            />
                            <button
                              type="button"
                              onClick={handleAutoGeneratePassword}
                              disabled={!formData.designation}
                              className={`px-5 py-2 rounded-md font-semibold transition-all duration-200 whitespace-nowrap flex items-center gap-2
                                ${
                                  !formData.designation
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-black text-white shadow-md hover:shadow-lg "
                                }`}
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                              </svg>
                              Generate
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* 🎯 Footer - Action Buttons */}
            <div className="flex justify-end gap-3 px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-t-2 border-gray-100 rounded-b-xl">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300 active:scale-95 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="user-form"
                disabled={
                  !isFormValid || isLoading || isUpdating || singleUserLoading
                }
                onClick={handleSubmit}
                className={`px-6 py-2 rounded-md font-semibold flex items-center justify-center gap-2 transition-all duration-200 min-w-[120px]
                  ${
                    !isFormValid
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-orange-500 text-white hover:bg-orange-600 shadow-lg hover:shadow-xl active:scale-95"
                  }`}
              >
                {(isLoading || isUpdating) && (
                  <FaSpinner className="animate-spin w-4 h-4" />
                )}
                {selectedUserId ? "Update User" : "Add User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
