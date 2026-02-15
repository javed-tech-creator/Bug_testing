import React, { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import PageHeader from "@/modules/sales/components/PageHeader";
import { useAddDeviceMutation, useUpdateDeviceMutation } from "@/api/technology/networkInfrastructure.api";
import { FaSpinner } from "react-icons/fa";
import { formatDate } from "@/utils/dateHelper";

//  Validation schema
const schema = yup.object().shape({
  deviceId: yup.string().required("Device ID is required"),
  deviceType: yup.string().required("Device Type is required"),
  ipAddress: yup
    .string()
    .required("IP Address is required")
    .matches(
      /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/,
      "Invalid IP Address"
    ),
  macAddress: yup
    .string()
    .required("MAC Address is required")
    .matches(
      /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
      "Invalid MAC Address"
    ),
  configurationDetails: yup.string().required("Configuration details are required"),
  installedLocation: yup.string().required("Installed Location is required"),
  vendor: yup.string().required("Vendor / AMC Partner is required"),
  maintenanceHistory: yup.string().required("Maintenance History is required"),
nextServiceDue: yup
  .date()
  .typeError("Please select a valid next service due date")
  .required("Next Service Due Date is required"),
});

const DeviceAddForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const deviceData = location?.state?.deviceData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const [addDevice, { isLoading }] = useAddDeviceMutation();
const [updateDevice, { isLoading: updateLoading }] = useUpdateDeviceMutation();



  useEffect(() => {
    if (deviceData) {
      reset({
        deviceId: deviceData.deviceId || "",
        deviceType: deviceData.deviceType || "",
        ipAddress: deviceData.ipAddress || "",
        macAddress: deviceData.macAddress || "",
        configurationDetails: deviceData.configurationDetails || "",
        installedLocation: deviceData.installedLocation || "",
        vendor: deviceData.vendor || "",
        maintenanceHistory: deviceData.maintenanceHistory || "",
        nextServiceDue: formatDate(deviceData.nextServiceDue),
      });
    }
  }, [deviceData, reset]);

const onSubmit = async (formData) => {
  console.log("formdata is",formData);
  
  try {
    if (deviceData) {
      // Update Device
      const result = await updateDevice({ id: deviceData._id, ...formData }).unwrap();

      if (result?.success) {
        toast.success("Device updated successfully!");
        reset();
        navigate("/tech/network-infrastructure/list");
      }
    } else {
      // Add Device
      const result = await addDevice(formData).unwrap();

      if (result?.success) {
        toast.success("Device added successfully!");
        reset();
        navigate("/tech/network-infrastructure/list");
      }
    }
  } catch (error) {
    console.error("Submission error:", error);
    toast.error(
      error?.data?.message || "Failed to submit device. Please try again."
    );
  }
};


  return (
    <div className="bg-gray-50 justify-center items-center">
      <PageHeader
        title={`${deviceData ? "Update Device Details" : "Add New Device"}`}
      />
      <div className="w-full mx-auto border border-gray-200 rounded-2xl bg-white p-4">
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              {/* Device ID */}
              <div>
                <label className="block text-sm font-medium">
                  Device ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("deviceId")}
                  placeholder="Enter Device ID"
                  className="w-full px-3 py-2 text-sm border rounded"
                />
                {errors.deviceId && (
                  <p className="text-red-500 text-sm">{errors.deviceId.message}</p>
                )}
              </div>

              {/* Device Type */}
              <div>
                <label className="block text-sm font-medium">
                  Device Type <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("deviceType")}
                  defaultValue=""
                  className="w-full px-3 py-2 text-sm border rounded bg-white"
                >
                  <option value="" disabled>Select Device Type</option>
                  <option value="Switch">Switch</option>
                  <option value="Router">Router</option>
                  <option value="Firewall">Firewall</option>
                  <option value="Access Point">Access Point</option>
                  <option value="CCTV">CCTV</option>
                  <option value="Server">Server</option>
                </select>
                {errors.deviceType && (
                  <p className="text-red-500 text-sm">{errors.deviceType.message}</p>
                )}
              </div>

              {/* IP Address */}
              <div>
                <label className="block text-sm font-medium">
                  IP Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("ipAddress")}
                  placeholder="192.168.1.1"
                  className="w-full px-3 py-2 text-sm border rounded"
                />
                {errors.ipAddress && (
                  <p className="text-red-500 text-sm">{errors.ipAddress.message}</p>
                )}
              </div>

              {/* MAC Address */}
              <div>
                <label className="block text-sm font-medium">
                  MAC Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("macAddress")}
                  placeholder="00:1B:44:11:3A:B7"
                  className="w-full px-3 py-2 text-sm border rounded"
                />
                {errors.macAddress && (
                  <p className="text-red-500 text-sm">{errors.macAddress.message}</p>
                )}
              </div>

            

              {/* Installed Location */}
              <div>
                <label className="block text-sm font-medium">
                  Installed Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("installedLocation")}
                  placeholder="e.g. Data Center, Floor 2"
                  className="w-full px-3 py-2 text-sm border rounded"
                />
                {errors.installedLocation && (
                  <p className="text-red-500 text-sm">{errors.installedLocation.message}</p>
                )}
              </div>

              {/* Vendor / AMC Partner */}
              <div>
                <label className="block text-sm font-medium">
                  Vendor / AMC Partner <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("vendor")}
                  placeholder="Enter vendor / AMC partner"
                  className="w-full px-3 py-2 text-sm border rounded"
                />
                {errors.vendor && (
                  <p className="text-red-500 text-sm">{errors.vendor.message}</p>
                )}
              </div>
               {/* Next Service Due Date */}
              <div>
                <label className="block text-sm font-medium">
                  Next Service Due Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register("nextServiceDue")}
                  className="w-full px-3 py-2 text-sm border rounded"
                />
                {errors.nextServiceDue && (
                  <p className="text-red-500 text-sm">{errors.nextServiceDue.message}</p>
                )}
              </div>

                {/* Configuration Details */}
              <div>
                <label className="block text-sm font-medium">
                  Configuration Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("configurationDetails")}
                  placeholder="Enter device configuration details"
                  className="w-full px-3 py-2 text-sm border rounded"
                  rows={2}
                />
                {errors.configurationDetails && (
                  <p className="text-red-500 text-sm">{errors.configurationDetails.message}</p>
                )}
              </div>

              {/* Maintenance History */}
              <div>
                <label className="block text-sm font-medium">
                  Maintenance History <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("maintenanceHistory")}
                  placeholder="Enter last maintenance details"
                  className="w-full px-3 py-2 text-sm border rounded"
                  rows={2}
                />
                {errors.maintenanceHistory && (
                  <p className="text-red-500 text-sm">{errors.maintenanceHistory.message}</p>
                )}
              </div>

             
            </div>

            {/* Submit Button */}
            <div className="mt-4 flex justify-end">
              <button
                disabled={isLoading || updateLoading}
                type="submit"
                className={`${
                  isLoading || updateLoading
                    ? "cursor-not-allowed bg-orange-500"
                    : "cursor-pointer bg-orange-500 hover:bg-orange-600"
                } px-4 py-2 text-sm rounded text-white`}
              >
                {isLoading || updateLoading
                  ?   <FaSpinner className="animate-spin" />
                  : deviceData
                  ? "Update"
                  : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeviceAddForm;
