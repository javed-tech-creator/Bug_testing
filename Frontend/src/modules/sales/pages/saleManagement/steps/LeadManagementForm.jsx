import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { toast } from "react-toastify";
import {
  useAssignLeadMutation,
  useFetchLeadByIdQuery,
} from "../../../../../api/sales/lead.api";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import Loader from "../../../../../components/Loader";

const schema = yup.object().shape({
  companyName: yup.string().required("companyName name is required"),
  concernPersonName: yup.string().required("Contact person is required"),
  concernPersonDesignation: yup.string().nullable(),
  address: yup.string().nullable(),
  phone: yup
    .string()
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number")
    .required("Phone number is required"),
  remark: yup.string().nullable(),
  projectDetail: yup.string().nullable(),
  clientRatingInBusiness: yup
    .number()
    .min(1, "Min rating is 1")
    .max(10, "Max rating is 10")
    .nullable(),
  clientProfileComment: yup.string().nullable(),
  expectedBusinessSize: yup.string().nullable(),
  leadSource: yup.string().nullable(),
  businessType: yup.string().nullable(),
  leadStatus: yup.string().nullable(),
  contentShared: yup.string().nullable(),
  recceStatus: yup.string().nullable(),
});

const LeadManagementForm = ({onNext}) => {
  const location = useLocation();
  const salesData = JSON.parse(localStorage.getItem("SalesData"));
  const id = location?.state?.leadId   || salesData.leadId 
  const { data, isLoading, refetch } = useFetchLeadByIdQuery({ id });
  const leadData = data?.data?.result;
console.log(leadData)
  const [isEditable, setIsEditable] = useState(false);
  const navigate = useNavigate();
  const [updateLead, { isLoading: updateLoading, error: errorLoading }] =
    useAssignLeadMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
     mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      companyName: "",
      concernPersonName: "",
      concernPersonDesignation: "",
      address: "",
      phone: "",
      remark: "",
      projectDetail: "",
      clientRatingInBusiness: "",
      clientProfileComment: "",
      expectedBusinessSize: "",
      leadSource: "",
      businessType: "",
      leadStatus: "",
      contentShared: "",
      recceStatus: "",
    },
  });

  useEffect(() => {
    if (leadData) {
      reset({
        companyName: leadData.companyName || "",
        concernPersonName:
          leadData.concernPersonName || leadData.contactPerson || "",
        concernPersonDesignation: leadData.concernPersonDesignation || "",
        address: leadData.address || "",
        phone: leadData.phone || "",
        remark: leadData.remark || "",
        projectDetail: leadData.projectDetail || "",
        clientRatingInBusiness: leadData.clientRatingInBusiness || "",
        clientProfileComment: leadData.clientProfileComment || "",
        expectedBusinessSize: leadData.expectedBusinessSize || "",
        leadSource: leadData.leadSource || "",
        businessType: leadData.businessType || "",
        leadStatus: leadData?.leadStatus || "",
        contentShared: leadData.contentShared || "",
        recceStatus: leadData.recceStatus || "",
      });
    }
  }, [leadData, reset, id]);

  const onSubmit = async (data) => {
    setTimeout(()=>{
        onNext();
    },500)

    // try {
    //   const formData = {
    //     salesTLId: "68807201f4ef3f295e0ff4dc",
    //     ...data,
    //   };

    //   const res = await updateLead({ id, formData }).unwrap();
    //   console.log(res);
    //   toast.success("Lead Updated successfully!");
    //   refetch();
    //   navigate("/sales/leads/sheet");
    // } catch (error) {
    //   console.error("Assignment error:", error);
    //   toast.error(
    //     `${error?.message || "Failed to assign lead. Please try again."}`
    //   );
    // }
  };

  const getInputClassName = (fieldName) => {
    return `w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 transition-colors duration-200 ${
      !isEditable && !!leadData?.[fieldName]
        ? "bg-gray-100 cursor-not-allowed"
        : "bg-white"
    }`;
  };

  const getSelectClassName = (fieldName) => {
    return `w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 transition-colors duration-200 text-gray-900 ${
      !isEditable && !!leadData?.[fieldName]
        ? "bg-gray-100 cursor-not-allowed"
        : "bg-white"
    }`;
  };
const handleBack = ()=>{
    window.history.back ()
}
if(isLoading){
  return(
    <Loader/>
  )
}
  return (
    <div className="">
      {/* <div className="w-full mb-6 rounded-lg shadow-md bg-white p-3 hover:shadow-lg transition duration-300">
        <div className="flex items-center justify-between bg-gray-50 px-4 p-1 border border-gray-200 rounded-md">
          <h2 className="text-xl animate-bounce  font-semibold">
            !! Update Lead Management Sheet !!
          </h2>
          <button
            type="button"
            onClick={() => setIsEditable((prev) => !prev)}
            className="px-3 py-1 text-sm bg-black text-white rounded hover:bg-black/80 transition-colors"
          >
            {isEditable ? "Lock" : "Edit"}
          </button>
        </div>
      </div> */}

      <div className="flex w-full justify-center items-center">
        <div className="w-full mx-auto border border-gray-200 rounded-xl p-4">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
            <form onSubmit={handleSubmit(onSubmit)} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* companyName Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company / Individual Name{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    {...register("companyName")}
                    readOnly={!isEditable && !!leadData?.companyName}
                    placeholder="Enter company or individual name"
                    className={getInputClassName("companyName")}
                  />
                  {errors.companyName && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.companyName?.message}
                    </p>
                  )}
                </div>

                {/* Concern Person Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Concern Person Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    {...register("concernPersonName")}
                    readOnly={!isEditable && !!leadData?.concernPersonName}
                    placeholder="Enter concern person name"
                    className={getInputClassName("concernPersonName")}
                  />
                  {errors.concernPersonName && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.concernPersonName?.message}
                    </p>
                  )}
                </div>

                {/* Concern Person Designation */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Concern Person Designation{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    {...register("concernPersonDesignation")}
                    readOnly={
                      !isEditable && !!leadData?.concernPersonDesignation
                    }
                    placeholder="Enter designation"
                    className={getInputClassName("concernPersonDesignation")}
                  />
                  {errors.concernPersonDesignation && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.concernPersonDesignation?.message}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    {...register("address")}
                    readOnly={!isEditable && !!leadData?.address}
                    placeholder="Enter full address"
                    className={getInputClassName("address")}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.address?.message}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("phone")}
                    readOnly={!isEditable && !!leadData?.phone}
                    placeholder="Enter 10-digit phone number"
                    className={getInputClassName("phone")}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.phone?.message}
                    </p>
                  )}
                </div>

                {/* Remark */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Remark
                  </label>
                  <input
                    type="text"
                    {...register("remark")}
                    readOnly={!isEditable && !!leadData?.remark}
                    placeholder="Enter remarks"
                    className={getInputClassName("remark")}
                  />
                  {errors.remark && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.remark?.message}
                    </p>
                  )}
                </div>

                {/* Project Detail */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Detail
                  </label>
                  <input
                    type="text"
                    {...register("projectDetail")}
                    readOnly={!isEditable && !!leadData?.projectDetail}
                    placeholder="Enter project details"
                    className={getInputClassName("projectDetail")}
                  />
                  {errors.projectDetail && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.projectDetail?.message}
                    </p>
                  )}
                </div>

                {/* Client Rating */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client Rating
                  </label>
                  <select
                    {...register("clientRatingInBusiness")}
                    disabled={!isEditable && !!leadData?.clientRatingInBusiness}
                    className={getSelectClassName("clientRatingInBusiness")}
                  >
                    <option value="">Select Rating</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                      <option key={rating} value={rating}>
                        {rating}
                      </option>
                    ))}
                  </select>
                  {errors.clientRatingInBusiness && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.clientRatingInBusiness?.message}
                    </p>
                  )}
                </div>

                {/* Profile Comment */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client Profile Comment
                  </label>
                  <input
                    type="text"
                    {...register("clientProfileComment")}
                    readOnly={!isEditable && !!leadData?.clientProfileComment}
                    placeholder="Enter client profile comment"
                    className={getInputClassName("clientProfileComment")}
                  />
                  {errors.clientProfileComment && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.clientProfileComment?.message}
                    </p>
                  )}
                </div>

                {/* Expected Business Size */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Business Size
                  </label>
                  <input
                    type="number"
                    {...register("expectedBusinessSize")}
                    readOnly={!isEditable && !!leadData?.expectedBusinessSize}
                    placeholder="Enter expected business size in rupees"
                    className={getInputClassName("expectedBusinessSize")}
                  />
                  {errors.expectedBusinessSize && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.expectedBusinessSize?.message}
                    </p>
                  )}
                </div>

                {/* Lead Source */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lead Source
                  </label>
                  <select
                    {...register("leadSource")}
                    disabled={!isEditable && !!leadData?.leadSource}
                    className={getSelectClassName("leadSource")}
                  >
                    <option value="" disabled>
                      Select Lead Source
                    </option>
                    <option value="Website">Website</option>
                    <option value="Phone">Phone</option>
                    <option value="Email">Email</option>
                    <option value="Justdial">Justdial</option>
                    <option value="Indiamart">Indiamart</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.leadSource && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.leadSource?.message}
                    </p>
                  )}
                </div>

                {/* Business Type */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Type
                  </label>
                  <select
                    {...register("businessType")}
                    disabled={!isEditable && !!leadData?.businessType}
                    className={getSelectClassName("businessType")}
                  >
                    <option value="">Select Business Type</option>
                    <option value="b2b">B2B</option>
                    <option value="b2c">B2C</option>
                    <option value="b2g">B2G</option>
                    <option value="retail">Retail</option>
                    <option value="wholesale">Wholesale</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="service">Service</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.businessType && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.businessType?.message}
                    </p>
                  )}
                </div>

                {/* Lead Status */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lead Status
                  </label>
                  <select
                    {...register("leadStatus")}
                    disabled={!isEditable && !!leadData?.leadStatus}
                    className={getSelectClassName("leadStatus")}
                  >
                    <option value="">Select Lead Status</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Success">Success</option>
                    <option value="Close">Close</option>
                  </select>
                  {errors.leadStatus && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.leadStatus?.message}
                    </p>
                  )}
                </div>

                {/* Content Shared */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content Shared
                  </label>
                  <select
                    {...register("contentShared")}
                    disabled={!isEditable && !!leadData?.contentShared}
                    className={getSelectClassName("contentShared")}
                  >
                    <option value="" disabled>
                      Select Option
                    </option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                  {errors.contentShared && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.contentShared?.message}
                    </p>
                  )}
                </div>

                {/* Recce Status */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recce Status
                  </label>
                  <select
                    {...register("recceStatus")}
                    disabled={!isEditable && !!leadData?.recceStatus}
                    className={getSelectClassName("recceStatus")}
                  >
                    <option value="">Select Status</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Success">Success</option>
                    <option value="Close">Close</option>
                  </select>
                  {errors.recceStatus && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors.recceStatus?.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-4 px-2 flex justify-between text-[14px]">
                <button
                  type="button"
                  onClick={handleBack}
                  className={` cursor-pointer px-6 py-2 bg-gray-600 rounded-sm text-white focus:ring-offset-2 transform  transition-all duration-200 shadow-lg`}
                >
                 <ArrowBigLeft className="inline"/> Back
                </button>

                <button
                  type="submit"
                  disabled={updateLoading}
                  className={` ${
                    updateLoading ? "cursor-not-allowed" : "cursor-pointer"
                  } px-6 py-2 bg-black rounded-sm text-white focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 shadow-lg`}
                >
                  {updateLoading ? "Submiting.." : "Next"} <ArrowBigRight className="inline"/>
                </button>

              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadManagementForm;
