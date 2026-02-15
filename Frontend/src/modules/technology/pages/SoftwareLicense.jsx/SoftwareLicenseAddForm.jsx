import React, { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "@/modules/sales/components/PageHeader";
import { useAddLicenseMutation, useUpdateLicenseMutation } from "@/api/technology/licenseSoftware.api";
import { FaSpinner } from "react-icons/fa";
import { formatDate } from "@/utils/dateHelper";


// ✅ Validation schema
const schema = yup.object().shape({
  licenseId: yup.string().required("License ID / Key is required"),
  softwareName: yup.string().required("Software Name is required"),
  versionType: yup.string().required("Version / Type is required"),
validityStart: yup
  .date()
  .typeError("Please select a valid start date")
  .required("Start Date is required"),

validityEnd: yup
  .date()
  .typeError("Please select a valid end date")
  .required("End Date is required"),
  seats: yup
    .number()
    .typeError("Seats must be a number")
    .positive("Seats must be positive")
    .required("No. of seats is required"),
  renewalAlert: yup.string().required("Renewal Alert setting is required"),
  vendorDetails: yup.string().required("Vendor Details are required"),
});

const LicenseAddForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const licenseData = location?.state?.licenseData;
console.log("licenseData state:", location.state);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

    const [addLicense, { isLoading: addLoading }] = useAddLicenseMutation();
  const [updateLicense, { isLoading: updateLoading }] = useUpdateLicenseMutation();

  useEffect(() => {
    if (licenseData) {
      reset({
        licenseId: licenseData.licenseId || "",
        softwareName: licenseData.softwareName || "",
        versionType: licenseData.versionType || "",
        validityStart: formatDate(licenseData.validityStart),
        validityEnd: formatDate(licenseData.validityEnd),
        seats: licenseData.seats || "",
        assignedTo: licenseData.assignedTo || "",
        renewalAlert: licenseData.renewalAlert || "",
        vendorDetails: licenseData.vendorDetails || "",
      });
    }
  }, [licenseData, reset]);

const onSubmit = async (data) => {
  try {
    if (licenseData) {
      //  Update case
      const id = licenseData._id;
      const result = await updateLicense({ id, ...data }).unwrap();

      if (result?.success) {
        toast.success("License updated successfully!");
        reset();
        navigate("/tech/software-license/list");
      }
    } else {
      //  Add case
      const result = await addLicense(data).unwrap();

      if (result?.success) {
        toast.success("License added successfully!");
        reset();
       navigate("/tech/software-license/list");

      }
    }
  } catch (error) {
    console.error("Submission error:", error);
    toast.error(
      error?.data?.message || "Failed to submit license. Please try again."
    );
  }
};


  return (
    <div className="bg-gray-50 justify-center items-center">
      <PageHeader
        title={`${licenseData ? "Update Software & License Detail" : "Add New Software & License"} `}
      />
      <div className="w-full mx-auto border border-gray-200 rounded-2xl bg-white p-4">
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              {/* License ID */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black/80">
                  License ID / Key <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("licenseId")}
                  placeholder="Enter license key"
                  className="w-full px-3 py-2 text-sm border rounded-sm"
                />
                {errors.licenseId && (
                  <p className="text-red-500 text-sm">
                    {errors.licenseId.message}
                  </p>
                )}
              </div>

              {/* Software Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black/80">
                  Software Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("softwareName")}
                  placeholder="e.g. CorelDRAW, Adobe CC, SAP ERP"
                  className="w-full px-3 py-2 text-sm border rounded-sm"
                />
                {errors.softwareName && (
                  <p className="text-red-500 text-sm">
                    {errors.softwareName.message}
                  </p>
                )}
              </div>

              {/* Version / Type */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black/80">
                  Version / Type <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("versionType")}
                  defaultValue=""
                  className="w-full px-3 py-2 text-sm border rounded-sm bg-white"
                >
                  <option value="" disabled>
                    Select Version / Type
                  </option>
                  <option value="Single License">Single License</option>
                  <option value="Volume License">Volume License</option>
                  <option value="Cloud">Cloud</option>
                </select>
                {errors.versionType && (
                  <p className="text-red-500 text-sm">
                    {errors.versionType.message}
                  </p>
                )}
              </div>

              {/* Validity Start */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black/80">
                  License Validity Start <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register("validityStart")}
                  className="w-full px-3 py-2 text-sm border rounded-sm"
                />
                {errors.validityStart && (
                  <p className="text-red-500 text-sm">
                    {errors.validityStart.message}
                  </p>
                )}
              </div>

              {/* Validity End */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black/80">
                  License Validity End <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register("validityEnd")}
                  className="w-full px-3 py-2 text-sm border rounded-sm"
                />
                {errors.validityEnd && (
                  <p className="text-red-500 text-sm">
                    {errors.validityEnd.message}
                  </p>
                )}
              </div>

              {/* No. of Seats */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black/80">
                  No. of Users <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  {...register("seats")}
                  placeholder="Enter no. of users l"
                  className="w-full px-3 py-2 text-sm border rounded-sm"
                />
                {errors.seats && (
                  <p className="text-red-500 text-sm">{errors.seats.message}</p>
                )}
              </div>


              {/* Renewal Alerts */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black/80">
                  Renewal Alerts <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("renewalAlert")}
                  defaultValue=""
                  className="w-full px-3 py-2 text-sm border rounded-sm bg-white"
                >
                  <option value="" disabled>
                    Select Renewal Alert
                  </option>
                  <option value="15 days before expiry">
                    15 days before expiry
                  </option>
                  <option value="30 days before expiry">
                    30 days before expiry
                  </option>
                  <option value="45 days before expiry">
                    45 days before expiry
                  </option>
                  <option value="60 days before expiry">
                    60 days before expiry
                  </option>
                </select>
                {errors.renewalAlert && (
                  <p className="text-red-500 text-sm">
                    {errors.renewalAlert.message}
                  </p>
                )}
              </div>

              {/* Vendor Details */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black/80">
                  Vendor Details <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("vendorDetails")}
                  placeholder="Enter vendor name"
                  className="w-full px-3 py-2 text-sm border rounded-sm"
                />
                {errors.vendorDetails && (
                  <p className="text-red-500 text-sm">
                    {errors.vendorDetails.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="mt-4 flex justify-end">
              <button
                disabled={addLoading || updateLoading}
                type="submit"
                className={`${
                  addLoading || updateLoading
                    ? "cursor-not-allowed bg-orange-500"
                    : "cursor-pointer bg-orange-500 hover:bg-orange-600"
                } px-4 py-2 text-sm rounded-sm text-white`}
              >
                {addLoading || updateLoading
                  ?  <FaSpinner className="animate-spin" />
                  : licenseData
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

export default LicenseAddForm;
