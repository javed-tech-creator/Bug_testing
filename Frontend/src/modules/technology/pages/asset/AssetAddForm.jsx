import React, { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "@/modules/sales/components/PageHeader";
import { useAddAssetMutation, useUpdateAssetMutation } from "@/api/technology/assetManagement.api";
import { FaSpinner } from "react-icons/fa";
import { formatDate } from "@/utils/dateHelper";


//  Validation schema
const schema = yup.object().shape({
  tag: yup.string().required("Tag is required"),
  type: yup.string().required("Type is required"),
  brand: yup.string().required("Brand is required"),
  model: yup.string().required("Model is required"),
  location: yup.string().required("Location is required"),
  status: yup.string().required("Status is required"),
  purchase_date: yup
    .date()
    .typeError("Please select a valid purchase date")
    .required("Purchase date is required"),
  warranty_end: yup
    .date()
    .typeError("Please select a valid warranty end date")
    .required("Warranty end date is required"),
      vendor_name: yup.string().required("Vendor name is required"),
  amc_contract: yup.string().required("AMC Contract selection is required"),
  contract_no: yup.string().when("amc_contract", {
  is: "Yes",
  then: (schema) =>
    schema.trim().required("Contract number is required"),
  otherwise: (schema) => schema.strip(), //  field ko hata do jab zarurat na ho
}),

validity: yup.date().nullable().when("amc_contract", {
  is: "Yes",
  then: (schema) =>
    schema
      .typeError("Please select a valid validity date")
      .required("Validity date is required"),
  otherwise: (schema) => schema.strip(), //  Yup se bhi hata diya
}),


});


const AssetAddForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
const assetData = location.state?.assetData;
console.log("Received state:", assetData);

const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
  mode: "onChange",
  resolver: yupResolver(schema),
   shouldUnregister: true,
});

// watch AMC field
const watchAmc = watch("amc_contract", "No"); 


  const [addAsset, { isLoading }] = useAddAssetMutation();
  const [updateAsset, { isLoading: updateLoading }] = useUpdateAssetMutation();

useEffect(() => {
  if (assetData) {
    reset({
      tag: assetData.tag || "",
      type: assetData.type || "",
      brand: assetData.brand || "",
      model: assetData.model || "",
      location: assetData.location || "",
      status: assetData.status || "",
       vendor_name: assetData.vendor_name||"", //  Added

      purchase_date: formatDate(assetData.purchase_date),
        warranty_end: formatDate(assetData.warranty_end),
        validity: formatDate(assetData.validity),
      amc_contract: assetData.amc_contract || "No",
      contract_no: assetData.contract_no || "",
    });
  }
}, [assetData, reset]);



const onSubmit = async (data) => {
  console.log("errors =>", errors);

  console.log("data is ",data);
   // sanitize AMC fields
  if (data.amc_contract === "No") {
    data.contract_no = "";
    data.validity = null;
  }

  
  try {
    if (assetData) {
      // update
      const id = assetData._id;
      const result = await updateAsset({ id, ...data }).unwrap();
      if (result?.success) {
        toast.success("Asset updated successfully!");
        reset();
        navigate("/tech/assets/list");
      }
    } else {
      // add
      const result = await addAsset(data).unwrap();
      if (result?.success) {
        toast.success("Asset added successfully!");
        reset();
        navigate("/tech/assets/list");
      }
    }
  } catch (error) {
    console.error("Submission error:", error);
    toast.error(
      `${error?.data?.message || "Failed to submit asset. Please try again."}`
    );
  }
};


  return (
    <div className="bg-gray-50 justify-center items-center">
      <PageHeader
        title={`${assetData ? "Update Asset Detail" : "Add New Asset"} `}
      />
      <div className="w-full mx-auto border border-gray-200 rounded-2xl bg-white p-4">
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              {/* Asset Tag */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black/80">
                  Asset Tag <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("tag")}
                  placeholder="Enter unique asset tag"
                  className="w-full px-3 py-2 text-sm border rounded-sm"
                />
                {errors.tag && (
                  <p className="text-red-500 text-sm">{errors.tag.message}</p>
                )}
              </div>

              {/* Asset Type */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black/80">
                  Asset Type <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("type")}
                  defaultValue=""
                  className="w-full px-3 py-2 text-sm border rounded-sm bg-white"
                >
                  <option value="" disabled>
                    Select Asset Type
                  </option>
                  <option value="Laptop">Laptop</option>
                  <option value="Server">Server</option>
                  <option value="LED Display Controller">
                    LED Display Controller
                  </option>
                  <option value="Printer">Printer</option>
                  <option value="Camera">Camera</option>
                  <option value="Router">Router</option>
                  <option value="Other">Other</option>
                </select>
                {errors.type && (
                  <p className="text-red-500 text-sm">{errors.type.message}</p>
                )}
              </div>

              {/* Brand */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black/80">
                  Brand <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("brand")}
                  placeholder="Enter brand name"
                  className="w-full px-3 py-2 text-sm border rounded-sm"
                />
                {errors.brand && (
                  <p className="text-red-500 text-sm">{errors.brand.message}</p>
                )}
              </div>

              {/* Model */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black/80">
                  Model/Serial Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("model")}
                  placeholder="Enter model name or serial number"
                  className="w-full px-3 py-2 text-sm border rounded-sm"
                />
                {errors.model && (
                  <p className="text-red-500 text-sm">{errors.model.message}</p>
                )}
              </div>

              {/* Vendor/Supplier Name */}
<div className="space-y-2">
  <label className="block text-sm font-medium text-black/80">
    Vendor/Supplier Name <span className="text-red-500">*</span>
  </label>
  <input
    type="text"
    {...register("vendor_name")}
    placeholder="Enter vendor or supplier name"
    className="w-full px-3 py-2 text-sm border rounded-sm"
  />
  {errors.vendor_name && (
    <p className="text-red-500 text-sm">{errors.vendor_name.message}</p>
  )}
</div>


              {/* Location */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black/80">
                  Location <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("location")}
                  defaultValue=""
                  className="w-full px-3 py-2 text-sm border rounded-sm bg-white"
                >
                  <option value="" disabled>
                    Select Location
                  </option>
                  <option value="Head Office">Head Office</option>
                  <option value="Manufacturing Hub">Manufacturing Hub</option>
                  <option value="Client Site">Client Site</option>
                </select>
                {errors.location && (
                  <p className="text-red-500 text-sm">
                    {errors.location.message}
                  </p>
                )}
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black/80">
                 Current Status <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("status")}
                  defaultValue=""
                  className="w-full px-3 py-2 text-sm border rounded-sm bg-white"
                >
                  <option value="" disabled>
                    Select Status
                  </option>
                  <option value="In Use">In Use</option>
                  <option value="Repair">Repair</option>
                  <option value="Spare">Spare</option>
                  <option value="Scrap">Scrap</option>
                </select>
                {errors.status && (
                  <p className="text-red-500 text-sm">
                    {errors.status.message}
                  </p>
                )}
              </div>
             



              {/* Purchase Date */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black/80">
                  Purchase Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register("purchase_date")}
                  className="w-full px-3 py-2 text-sm border rounded-sm"
                />
                {errors.purchase_date && (
                  <p className="text-red-500 text-sm">
                    {errors.purchase_date.message}
                  </p>
                )}
              </div>

              {/* Warranty End */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black/80">
                  Warranty End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register("warranty_end")}
                  className="w-full px-3 py-2 text-sm border rounded-sm"
                />
                {errors.warranty_end && (
                  <p className="text-red-500 text-sm">
                    {errors.warranty_end.message}
                  </p>
                )}
              </div>

               {/* AMC Contract */}
<div className="space-y-2">
  <label className="block text-sm font-medium text-black/80">
    AMC Contract <span className="text-red-500">*</span>
  </label>
  <select
    {...register("amc_contract")}
    defaultValue=""
    className="w-full px-3 py-2 text-sm border rounded-sm bg-white"
  >
    <option value="" disabled>
      Select AMC Contract
    </option>
    <option value="Yes">Yes</option>
    <option value="No">No</option>
  </select>
  {errors.amc_contract && (
    <p className="text-red-500 text-sm">{errors.amc_contract.message}</p>
  )}
</div>

{/* Show these only if AMC = Yes */}
{watchAmc === "Yes" && (
  <>
    {/* Contract No */}
    <div className="space-y-2">
      <label className="block text-sm font-medium text-black/80">
        Contract No. <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        {...register("contract_no")}
        placeholder="Enter contract number"
        className="w-full px-3 py-2 text-sm border rounded-sm"
      />
      {errors.contract_no && (
        <p className="text-red-500 text-sm">{errors.contract_no.message}</p>
      )}
    </div>

    {/* Validity */}
    <div className="space-y-2">
      <label className="block text-sm font-medium text-black/80">
        Validity <span className="text-red-500">*</span>
      </label>
      <input
        type="date"
        {...register("validity")}
        className="w-full px-3 py-2 text-sm border rounded-sm"
      />
      {errors.validity && (
        <p className="text-red-500 text-sm">{errors.validity.message}</p>
      )}
    </div>
  </>
)}
            </div>

    

            {/* Submit */}
            <div className="mt-4 flex justify-end">
              <button
                disabled={isLoading || updateLoading}
                type="submit"
                className={`${
                  isLoading || updateLoading
                    ? "cursor-not-allowed bg-orange-500"
                    : "cursor-pointer bg-orange-500 hover:bg-orange-600"
                } px-4 py-2 text-sm rounded-sm text-white`}
              >
                {isLoading || updateLoading
                  ?   <FaSpinner className="animate-spin" />
                  : assetData
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

export default AssetAddForm;
