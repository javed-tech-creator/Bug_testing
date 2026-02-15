import React, { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import PageHeader from "@/components/PageHeader";
import { useCreateCampaignMutation, useUpdateCampaignMutation } from "@/api/marketing/campaignManagement.api";
// TODO: Replace with your RTK query hooks
// import { useAddCampaignMutation, useUpdateCampaignMutation } from "@/api/marketing/campaign.api";

//  Yup Validation Schema
const schema = yup.object().shape({
   campaign_id: yup.string().required("Campaign ID is required"),
  campaignName: yup.string().required("Campaign name is required"),
  type: yup.string().required("Campaign type is required"),
  platform: yup.string().required("Platform is required"),
  objective: yup.string().required("Objective is required"),
  targetAudience: yup.object().shape({
    region: yup.string().required("Region is required"),
    demographics: yup.string().required("Demographics is required"),
    interests: yup.array().of(yup.string()).min(1, "At least one interest is required"),
  }),
  budget: yup
    .number()
    .typeError("Budget must be a number")
    .positive("Budget must be positive")
    .required("Budget is required"),
  landingPage: yup.string().url("Must be a valid URL").nullable(),
  startDate: yup.date().required("Start date is required"),
  endDate: yup
    .date()
    .min(yup.ref("startDate"), "End date must be after start date")
    .required("End date is required"),
});

const CampaignAddForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const campaignData = location.state?.campaignData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

const [addCampaign, { isLoading:campaignAdding, isSuccess, isError, error }] = useCreateCampaignMutation();
  const [updateCampaign, { isLoading: updateLoading }] = useUpdateCampaignMutation();


  useEffect(() => {
    if (campaignData) {
      reset({
        campaign_id: campaignData?.campaign_id || "",
        campaignName: campaignData.campaignName || "",
        type: campaignData.type || "",
        platform: campaignData.platform || "",
        objective: campaignData.objective || "",
        targetAudience: {
          region: campaignData.targetAudience?.region || "",
          demographics: campaignData.targetAudience?.demographics || "",
          interests: campaignData.targetAudience?.interests || [],
        },
        budget: campaignData.budget || "",
        landingPage: campaignData.landingPage || "",
        // utmTags: {
        //   source: campaignData.utmTags?.source || "",
        //   medium: campaignData.utmTags?.medium || "",
        //   campaign: campaignData.utmTags?.campaign || "",
        //   referralCode: campaignData.utmTags?.referralCode || "",
        // },
        startDate: campaignData.startDate
          ? campaignData.startDate.split("T")[0]
          : "",
        endDate: campaignData.endDate ? campaignData.endDate.split("T")[0] : "",
      });
    }
  }, [campaignData, reset]);

  const onSubmit = async (data) => {

    console.log("campaign data is",data);
    
    try {
      if (campaignData) {
        const id = campaignData._id;
        const result = await updateCampaign({ id, data }).unwrap();
        if (result?.success) {
          toast.success( result.message || "Campaign updated successfully!");
          reset();
          navigate("/marketing/campaigns");
        }
      } else {
        const result = await addCampaign(data).unwrap();
        if (result?.success) {
          toast.success(result.message || "Campaign created successfully!");
          reset();
          navigate("/marketing/campaigns");
        }
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(
        `${error?.data?.message || "Failed to submit campaign. Please try again."}`
      );
    }
  };

  return (
    <div className="bg-gray-50 justify-center items-center">
      <PageHeader
        title={`${campaignData ? "Update Campaign" : "Add New Campaign"}`}
      />
      <div className="w-full mx-auto border border-gray-200 rounded-2xl bg-white p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Campaign Name */}
          <div>
  <label className="block text-sm font-medium">Campaign ID  <span className="text-red-500">*</span></label>
  <input
    type="text"
    {...register("campaign_id")}
    className="w-full px-3 py-2 text-sm border rounded-sm"
    placeholder="Enter campaign ID"
    // readOnly={!!campaignData} // update ke time readonly
  />
  {errors.campaign_id && <p className="text-red-500 text-sm">{errors.campaign_id.message}</p>}
</div>


          {/* Campaign Name */}
          <div>
            <label className="block text-sm font-medium">Campaign Name  <span className="text-red-500">*</span></label>
            <input
              type="text"
              {...register("campaignName")}
              className="w-full px-3 py-2 text-sm border rounded-sm"
              placeholder="Enter campaign name"
            />
            {errors.campaignName && <p className="text-red-500 text-sm">{errors.campaignName.message}</p>}
          </div>

          {/* Campaign Type */}
          <div>
            <label className="block text-sm font-medium">Type  <span className="text-red-500">*</span></label>
            <select {...register("type")} className="w-full px-3 py-2 text-sm border rounded-sm bg-white">
              <option value="">Select Type</option>
              <option value="Print">Print</option>
              <option value="Digital">Digital</option>
              <option value="Event">Event</option>
            </select>
            {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
          </div>

          {/* Platform */}
          <div>
            <label className="block text-sm font-medium">Platform  <span className="text-red-500">*</span></label>
            <select {...register("platform")} className="w-full px-3 py-2 text-sm border rounded-sm bg-white">
              <option value="">Select Platform</option>
              <option value="Facebook">Facebook</option>
              <option value="Instagram">Instagram</option>
              <option value="Google Ads">Google Ads</option>
              <option value="Other">Whatsapp</option>
            </select>
            {errors.platform && <p className="text-red-500 text-sm">{errors.platform.message}</p>}
          </div>

          {/* Objective */}
          <div>
            <label className="block text-sm font-medium">Objective  <span className="text-red-500">*</span></label>
            <select {...register("objective")} className="w-full px-3 py-2 text-sm border rounded-sm bg-white">
              <option value="">Select Objective</option>
              <option value="Awareness">Awareness</option>
              <option value="Lead Gen">Lead Gen</option>
              <option value="Engagement">Engagement</option>
            </select>
            {errors.objective && <p className="text-red-500 text-sm">{errors.objective.message}</p>}
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-sm font-medium">Region  <span className="text-red-500">*</span></label>
            <input
              type="text"
              {...register("targetAudience.region")}
              className="w-full px-3 py-2 text-sm border rounded-sm"
              placeholder="Enter target region"
            />
            {errors.targetAudience?.region && (
              <p className="text-red-500 text-sm">{errors.targetAudience.region.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Demographics  <span className="text-red-500">*</span></label>
            <input
              type="text"
              {...register("targetAudience.demographics")}
              className="w-full px-3 py-2 text-sm border rounded-sm"
              placeholder="Enter demographics"
            />
            {errors.targetAudience?.demographics && (
              <p className="text-red-500 text-sm">{errors.targetAudience.demographics.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Interests  <span className="text-red-500">*</span></label>
            <input
              type="text"
              {...register("targetAudience.interests.0")}
              className="w-full px-3 py-2 text-sm border rounded-sm"
              placeholder="e.g. Technology, Sports"
            />
            {errors.targetAudience?.interests && (
              <p className="text-red-500 text-sm">{errors.targetAudience.interests.message}</p>
            )}
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium">Budget  <span className="text-red-500">*</span></label>
            <input
              type="number"
              {...register("budget")}
              className="w-full px-3 py-2 text-sm border rounded-sm"
              placeholder="Enter budget"
            />
            {errors.budget && <p className="text-red-500 text-sm">{errors.budget.message}</p>}
          </div>

          {/* Landing Page */}
          <div>
            <label className="block text-sm font-medium">Landing Page</label>
            <input
              type="url"
              {...register("landingPage")}
              className="w-full px-3 py-2 text-sm border rounded-sm"
              placeholder="https://example.com"
            />
            {errors.landingPage && <p className="text-red-500 text-sm">{errors.landingPage.message}</p>}
          </div>

          {/* Dates */}
          <div>
            <label className="block text-sm font-medium">Start Date  <span className="text-red-500">*</span></label>
            <input
              type="date"
              {...register("startDate")}
              className="w-full px-3 py-2 text-sm border rounded-sm"
            />
            {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">End Date  <span className="text-red-500">*</span></label>
            <input
              type="date"
              {...register("endDate")}
              className="w-full px-3 py-2 text-sm border rounded-sm"
            />
            {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate.message}</p>}
          </div>

          {/* Submit Button */}
          <div className="col-span-2 flex justify-end mt-4">
            <button
              disabled={campaignAdding || updateLoading}
              type="submit"
              className={`${
                campaignAdding || updateLoading
                  ? "cursor-not-allowed bg-orange-500"
                  : "cursor-pointer bg-orange-500 hover:bg-orange-600"
              } px-4 py-2 text-sm rounded-sm text-white`}
            >
              {campaignAdding || updateLoading ? (
                <FaSpinner className="animate-spin" />
              ) : campaignData ? (
                "Update"
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CampaignAddForm;
