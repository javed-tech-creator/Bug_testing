import React, { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import PageHeader from "@/modules/sales/components/PageHeader";
import { useAddVendorMutation, useUpdateVendorMutation } from "@/api/technology/vendorAMCManagement.api";
import { FaSpinner } from "react-icons/fa";
import { formatDate } from "@/utils/dateHelper";



//  Validation schema
const schema = yup.object().shape({
  vendorId: yup.string().required("Vendor ID is required"),
  companyName: yup.string().required("Company Name is required"),
  services: yup.string().required("Services Provided is required"),
  contactName: yup.string().required("Contact Person Name is required"),
  contactPhone: yup
    .string()
    .required("Contact Phone is required")
    .matches(/^[0-9]{10}$/, "Invalid phone number"),
  contactEmail: yup
    .string()
    .required("Contact Email is required")
    .email("Invalid email format"),
contractStart: yup
  .date()
  .nullable()
  .typeError("Please select a valid Contract Start Date")
  .required("Contract Start Date is required"),

contractEnd: yup
  .date()
  .nullable()
  .typeError("Please select a valid Contract End Date")
  .required("Contract End Date is required")
  .min(yup.ref("contractStart"), "Contract End Date must be after Start Date"),

  renewalTerms: yup.string().required("Renewal Terms & Cost is required"),
  slaCommitments: yup.string().required("SLA Commitments are required"),
  serviceLogs: yup.string().required("Service Logs are required"),
});

const VendorAddForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const vendorData = location?.state?.vendorData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

//  RTK Query Hooks
  const [addVendor, { isLoading }] = useAddVendorMutation();
  const [updateVendor, { isLoading: updateLoading }] =
    useUpdateVendorMutation();

  //  Reset form if editing vendor
  useEffect(() => {
    if (vendorData) {
      reset({
        vendorId: vendorData.vendorId || "",
        companyName: vendorData.companyName || "",
        services: vendorData.services || "",
        contactName: vendorData.contactName || "",
        contactPhone: vendorData.contactPhone || "",
        contactEmail: vendorData.contactEmail || "",
        contractStart: formatDate(vendorData.contractStart),
        contractEnd: formatDate(vendorData.contractEnd),
        renewalTerms: vendorData.renewalTerms || "",
        slaCommitments: vendorData.slaCommitments || "",
        serviceLogs: vendorData.serviceLogs || "",
      });
    }
  }, [vendorData, reset]);

  //  Submit handler
 // ✅ Submit handler
  const onSubmit = async (data) => {
    console.log("form data is",data);
    
    try {
      if (vendorData) {
        const id = vendorData._id;
        const result = await updateVendor({ id, ...data }).unwrap();
        if (result?.success) {
          toast.success("Vendor updated successfully!");
          reset();
          navigate("/tech/vendor-amc-management/list");
        }
      } else {
        const result = await addVendor(data).unwrap();
        if (result?.success) {
          toast.success("Vendor added successfully!");
          reset();
          navigate("/tech/vendor-amc-management/list");
        }
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error?.data?.message || "Failed to submit vendor data.");
    }
  };

  return (
    <div className="bg-gray-50 justify-center items-center">
      <PageHeader
        title={`${vendorData ? "Update Vendor Details" : "Add New Vendor"}`}
      />
      <div className="w-full mx-auto border border-gray-200 rounded-2xl bg-white p-4">
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              {/* Vendor ID */}
              <div>
                <label className="block text-sm font-medium">
                  Vendor ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("vendorId")}
                  placeholder="Enter Vendor ID"
                  className="w-full px-3 py-2 text-sm border rounded"
                />
                {errors.vendorId && (
                  <p className="text-red-500 text-sm">
                    {errors.vendorId.message}
                  </p>
                )}
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("companyName")}
                  placeholder="Enter Company Name"
                  className="w-full px-3 py-2 text-sm border rounded"
                />
                {errors.companyName && (
                  <p className="text-red-500 text-sm">
                    {errors.companyName.message}
                  </p>
                )}
              </div>

              {/* Services Provided */}
              <div>
                <label className="block text-sm font-medium">
                  Services Provided <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("services")}
                  defaultValue=""
                  className="w-full px-3 py-2 text-sm border rounded bg-white"
                >
                  <option value="" disabled>
                    Select Service
                  </option>
                  <option value="AMC">AMC</option>
                  <option value="Network">Network</option>
                  <option value="Server">Server</option>
                  <option value="Cloud">Cloud</option>
                </select>
                {errors.services && (
                  <p className="text-red-500 text-sm">
                    {errors.services.message}
                  </p>
                )}
              </div>

              {/* Contact Person Name */}
              <div>
                <label className="block text-sm font-medium">
                  Contact Person <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("contactName")}
                  placeholder="Enter contact person name"
                  className="w-full px-3 py-2 text-sm border rounded"
                />
                {errors.contactName && (
                  <p className="text-red-500 text-sm">
                    {errors.contactName.message}
                  </p>
                )}
              </div>

              {/* Contact Phone */}
              <div>
                <label className="block text-sm font-medium">
                  Contact Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("contactPhone")}
                  placeholder="Enter contact number"
                  className="w-full px-3 py-2 text-sm border rounded"
                />
                {errors.contactPhone && (
                  <p className="text-red-500 text-sm">
                    {errors.contactPhone.message}
                  </p>
                )}
              </div>

              {/* Contact Email */}
              <div>
                <label className="block text-sm font-medium">
                  Contact Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  {...register("contactEmail")}
                  placeholder="Enter contact email"
                  className="w-full px-3 py-2 text-sm border rounded"
                />
                {errors.contactEmail && (
                  <p className="text-red-500 text-sm">
                    {errors.contactEmail.message}
                  </p>
                )}
              </div>

              {/* Contract Start */}
              <div>
                <label className="block text-sm font-medium">
                  Contract Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register("contractStart")}
                  className="w-full px-3 py-2 text-sm border rounded"
                />
                {errors.contractStart && (
                  <p className="text-red-500 text-sm">
                    {errors.contractStart.message}
                  </p>
                )}
              </div>

              {/* Contract End */}
              <div>
                <label className="block text-sm font-medium">
                  Contract End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register("contractEnd")}
                  className="w-full px-3 py-2 text-sm border rounded"
                />
                {errors.contractEnd && (
                  <p className="text-red-500 text-sm">
                    {errors.contractEnd.message}
                  </p>
                )}
              </div>

              {/* Renewal Terms */}
              <div>
                <label className="block text-sm font-medium">
                  Renewal Terms & Cost <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("renewalTerms")}
                  placeholder="Enter renewal terms"
                  className="w-full px-3 py-2 text-sm border rounded"
                  rows={2}
                />
                {errors.renewalTerms && (
                  <p className="text-red-500 text-sm">
                    {errors.renewalTerms.message}
                  </p>
                )}
              </div>

              {/* SLA Commitments */}
              <div>
                <label className="block text-sm font-medium">
                  SLA Commitments <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("slaCommitments")}
                  placeholder="Enter SLA details"
                  className="w-full px-3 py-2 text-sm border rounded"
                  rows={2}
                />
                {errors.slaCommitments && (
                  <p className="text-red-500 text-sm">
                    {errors.slaCommitments.message}
                  </p>
                )}
              </div>

              {/* Service Logs */}
              <div>
                <label className="block text-sm font-medium">
                  Previous Service Logs <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("serviceLogs")}
                  placeholder="Enter service history"
                  className="w-full px-3 py-2 text-sm border rounded"
                  rows={2}
                />
                {errors.serviceLogs && (
                  <p className="text-red-500 text-sm">
                    {errors.serviceLogs.message}
                  </p>
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
                  ? <FaSpinner className="animate-spin" />
                  : vendorData
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

export default VendorAddForm;
