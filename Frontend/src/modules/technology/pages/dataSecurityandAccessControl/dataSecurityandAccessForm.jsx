import React, { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import PageHeader from "@/modules/sales/components/PageHeader";
import { useAddAccessMutation, useUpdateAccessMutation } from "@/api/technology/dataAccessControl.api";
import { FaSpinner } from "react-icons/fa";



//  Validation schema
const schema = yup.object().shape({
  employeeId: yup.string().required("Employee ID is required"),
  systemAccess: yup
    .array()
    .min(1, "At least one system access must be selected"),
  role: yup.string().required("Role is required"),
  loginHistory: yup.string().required("Login history is required"),
  deviceBinding: yup.string().required("Device binding is required"),
  accessRevoked: yup.string().nullable(),
});

const AccessAddForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const AccessControlData = location?.state?.AccessControlData;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      employeeId: "",
      systemAccess: [],
      role: "",
      loginHistory: "",
      deviceBinding: "",
      accessRevoked: "",
    },
  });

  const [addAccess, { isLoading }] = useAddAccessMutation();
const [updateAccess, { isLoading: updateLoading }] = useUpdateAccessMutation();

  //  Reset form if editing
  useEffect(() => {
    if (AccessControlData) {
      reset({
        employeeId: AccessControlData.employeeId || "",
        systemAccess: AccessControlData.systemAccess || [],
        role: AccessControlData.role || "",
        loginHistory: AccessControlData.loginHistory || "",
        deviceBinding: AccessControlData.deviceBinding || "",
      });
    }
  }, [AccessControlData, reset]);

  //  Submit handler
const onSubmit = async (data) => {
  try {
    if (AccessControlData) {
      // update
      const id = AccessControlData._id;
      const result = await updateAccess({ id, ...data }).unwrap();
      if (result?.success) {
        toast.success("Access detail record updated successfully!");
        navigate("/tech/data-access-control/list");
      }
    } else {
      // add
      const result = await addAccess(data).unwrap();
      if (result?.success) {
        toast.success("Access detail record added successfully!");
      }
    }
    reset();
    navigate("/tech/data-access-control/list");
  } catch (error) {
    console.error("Submission error:", error);
    toast.error(error?.data?.message || "Failed to submit data.");
  }
};


  const systemOptions = [
    "Email",
    "CRM",
    "ERP",
    "Server",
    "VPN",
    "WiFi",
    "Door Access",
  ];

  return (
    <div className="bg-gray-50 justify-center items-center">
      <PageHeader
        title={
          AccessControlData ? "Update Security & Access" : "Add New Security & Access"
        }
      />
      <div className="w-full mx-auto border border-gray-200 rounded-2xl bg-white p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* Employee ID */}
    <div className="flex flex-col">
      <label className="text-sm font-semibold mb-1">
        Employee ID <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        {...register("employeeId")}
        placeholder="Enter Employee ID"
        className="w-full px-4 py-2 text-sm border rounded-lg shadow-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
      />
      {errors.employeeId && (
        <p className="text-red-500 text-xs mt-1">
          {errors.employeeId.message}
        </p>
      )}
    </div>

  

    {/* Role */}
    <div className="flex flex-col">
      <label className="text-sm font-semibold mb-1">
        Permissions / Role <span className="text-red-500">*</span>
      </label>
      <select
        {...register("role")}
        className="w-full px-4 py-2 text-sm border rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
      >
        <option value="">Select Role</option>
        <option value="Admin">Admin</option>
        <option value="Editor">Editor</option>
        <option value="Viewer">Viewer</option>
      </select>
      {errors.role && (
        <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>
      )}
    </div>

     {/* Device Binding Dropdown */}
    <div className="flex flex-col">
      <label className="text-sm font-semibold mb-1">
        Device Binding <span className="text-red-500">*</span>
      </label>
      <select
        {...register("deviceBinding")}
        className="w-full px-4 py-2 text-sm border rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
      >
        <option value="">Select Device</option>
        <option value="Laptop">Laptop</option>
        <option value="Phone">Phone</option>
        <option value="Tablet">Tablet</option>
      </select>
      {errors.deviceBinding && (
        <p className="text-red-500 text-xs mt-1">
          {errors.deviceBinding.message}
        </p>
      )}
    </div>

      {/* System Access as Checkboxes */}
    <div className="flex flex-col">
      <label className="text-sm font-semibold mb-1">
        System Access <span className="text-red-500">*</span>
      </label>
      <div className="grid grid-cols-2 gap-2 border rounded-lg p-3 shadow-sm">
        {systemOptions.map((item) => (
          <label
            key={item}
            className="flex items-center gap-2 text-sm cursor-pointer hover:text-orange-600"
          >
            <input
              type="checkbox"
              value={item}
              {...register("systemAccess")}
              className="accent-orange-500"
            />
            {item}
          </label>
        ))}
      </div>
      {errors.systemAccess && (
        <p className="text-red-500 text-xs mt-1">
          {errors.systemAccess.message}
        </p>
      )}
    </div>

    {/* Login History */}
    <div className="lg:col-span-2 flex flex-col">
      <label className="text-sm font-semibold mb-1">
        Login History / Logs <span className="text-red-500">*</span>
      </label>
      <textarea
        {...register("loginHistory")}
        placeholder="Enter login history details"
        className="w-full px-4 py-2 text-sm border rounded-lg shadow-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
        rows={6}
      />
      {errors.loginHistory && (
        <p className="text-red-500 text-xs mt-1">
          {errors.loginHistory.message}
        </p>
      )}
    </div>
  </div>

  {/* Submit Button */}
  <div className="flex justify-end">
    <button
      disabled={isLoading || updateLoading}
      type="submit"
      className={`${
        isLoading || updateLoading
          ? "cursor-not-allowed bg-orange-500"
          : "cursor-pointer bg-orange-500 hover:bg-orange-600"
      } px-6 py-2 text-sm font-semibold rounded-lg text-white shadow-md transition-all`}
    >
      {isLoading || updateLoading
        ?  <FaSpinner className="animate-spin" />
        : AccessControlData
        ? "Update"
        : "Submit"}
    </button>
  </div>
</form>

      </div>
    </div>
  );
};

export default AccessAddForm;
