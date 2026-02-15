import React, { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import PageHeader from "@/components/PageHeader.jsx";
import {
  useAddJobPostMutation,
  useJobUpdateMutation,
  useGetJobPostByIdQuery,
} from "@/api/hr/job.api.js";

import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import Loader from "@/components/Loader";

// ✅ Validation Schema
const schema = yup.object().shape({
  title: yup
    .string()
    .matches(/^[A-Za-z ]+$/, "Only alphabets are allowed")
    .required("Job title is required"),
  description: yup.string().required("Job description is required"),
  jobType: yup.string().oneOf(["Internal", "Public"]).required(),
  employmentType: yup
    .string()
    .oneOf(["Full-time", "Part-time", "Contract", "Internship"])
    .required(),
  skills: yup
    .string()
    .matches(
      /^([A-Za-z ]+)(\s*,\s*[A-Za-z ]+)*$/,
      "Only alphabets allowed in each skill"
    )
    .required("At least one skill is required"),
  experience: yup
    .string()
    .required("Experience is required")
    .matches(/^\d{1,2}$/, "Only 1 or 2 digits allowed"),
  experienceType: yup
    .string()
    .oneOf(["Year", "Month"], "Please select experience type")
    .required("Experience type is required"),
  salaryRange: yup
    .string()
    .matches(
      /^\d+(\s*-\s*\d+)?$/,
      "Enter valid salary or range (e.g., 50000-80000)"
    )
    .nullable(),
  openings: yup
    .string()
    .matches(/^\d{1,2}$/, "Only up to 2 digits allowed")
    .required("Openings is required"),
});

const JobPostForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, isLoading: jobDataLoading } = useGetJobPostByIdQuery(
    { id },
    { skip: !id }
  );
  const jobData = data?.data;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  // API hooks
  const [createJob, { isLoading }] = useAddJobPostMutation();
  const [updateJob, { isLoading: updating }] = useJobUpdateMutation();

  useEffect(() => {
    if (jobData) {
      reset({
        title: jobData.title || "",
        description: jobData.description || "",
        jobType: jobData.jobType || "Public",
        employmentType: jobData.employmentType || "Full-time",
        skills: jobData.skills?.join(", ") || "",
        experience: jobData.experience || "",
        experienceType: jobData.experienceType || "",
        salaryRange: jobData.salaryRange || "",
        openings: jobData.openings || 1,
      });
    }
  }, [jobData, reset]);

  const onSubmit = async (data) => {
    try {
      const formData = {
        ...data,
        experienceType: data.experienceType,
        skills: data.skills.split(",").map((s) => s.trim()),
      };
      console.log("Form data is ",formData);

      if (jobData) {
        const result = await updateJob({ id: jobData._id, formData });
        if (result?.data?.success) {
          toast.success("Job updated successfully");
          reset();
        }
      } else {
        await createJob({ formData }).unwrap();
        toast.success("Job posted successfully");
        reset();
      }

      navigate("/hr/job/post");
    } catch (err) {
      console.error("Error submitting job:", err);
      toast.error(err?.message || "Failed to submit job post");
    }
  };
  if (jobDataLoading) {
    return <Loader />;
  }

  return (
    <div className="bg-gray-50">
      <PageHeader title={jobData ? "Update Job Post" : "Create New Job Post"} />
      <div className="w-full mx-auto border border-gray-200 rounded-2xl bg-white p-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className=" p-4 border border-gray-200 rounded-lg"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {/* Title */}
            <div>
              <label className="block text-sm mb-0.5 font-medium">
                Title *
              </label>
              <input
                {...register("title")}
                className="w-full border rounded p-2"
                placeholder="Job Title"
                pattern="[A-Za-z ]+"
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^A-Za-z ]/g, "");
                }}
              />
              {errors.title && (
                <p className="text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Job Type */}
            <div>
              <label className="block text-sm mb-0.5 font-medium">
                Job Type *
              </label>
              <select
                {...register("jobType")}
                className="w-full border rounded p-2"
              >
                <option value="Public">Public</option>
                <option value="Internal">Internal</option>
              </select>
            </div>

            {/* Employment Type */}
            <div>
              <label className="block text-sm mb-0.5 font-medium">
                Employment Type *
              </label>
              <select
                {...register("employmentType")}
                className="w-full border rounded p-2"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm mb-0.5 font-medium">
                Skills (comma separated) *
              </label>
              <input
                {...register("skills")}
                className="w-full border rounded p-2"
                placeholder="React, Node.js, MongoDB"
                pattern="^([A-Za-z ]+)(\s*,\s*[A-Za-z ]+)*$"
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^A-Za-z, ]/g, "");
                }}
              />
              {errors.skills && (
                <p className="text-red-500">{errors.skills.message}</p>
              )}
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-3 gap-2">
              {/* Experience */}
              <div>
                <label className="block text-sm mb-0.5 font-medium">
                  Experience *
                </label>

                <div className="flex items-center gap-1">
                  <input
                    {...register("experience")}
                    defaultValue={jobData?.experience}
                    className="flex-1 border rounded-md p-2"
                    placeholder="Enter Experience"
                    type="text"
                    maxLength={2}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/\D/g, "");
                    }}
                  />

                  <select
                    {...register("experienceType")}
                    defaultValue={jobData?.experienceType}
                    className="flex-1 border rounded-md p-2"
                  >
                    <option value="">Select</option>
                    <option value="Year">Year</option>
                    <option value="Month">Month</option>
                  </select>
                </div>

                {errors.experience && (
                  <p className="text-red-500">{errors.experience.message}</p>
                )}
                {errors.experienceType && (
                  <p className="text-red-500">{errors.experienceType.message}</p>
                )}
              </div>

              {/* Salary */}
              <div>
                <label className="block text-sm mb-0.5 font-medium">
                  Salary Range
                </label>
                <input
                  {...register("salaryRange")}
                  className="w-full border rounded p-2"
                  placeholder="50000-80000"
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9\- ]/g, "");
                  }}
                />
              </div>

              {/* Openings */}
              <div>
                <label className="block text-sm mb-0.5 font-medium">
                  Openings *
                </label>
                <input
                  type="text"
                  placeholder="Number of openings"
                  {...register("openings")}
                  maxLength={2}
                  pattern="\d{1,2}"
                  className="w-full border rounded p-2"
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  }}
                />
                {errors.openings && (
                  <p className="text-red-500">{errors.openings.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Description - SunEditor */}
          <div className="mt-2">
            <label className="block text-sm mb-0.5 font-medium">
              Description *
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <SunEditor
                  {...field}
                  setContents={field.value}
                  onChange={field.onChange}
                  height="200px"
                  setOptions={{
                    buttonList: [
                      ["undo", "redo"],
                      ["bold", "italic", "underline", "strike"],
                      ["fontSize", "formatBlock"],
                      ["fontColor", "hiliteColor"],
                      ["align", "list", "indent", "outdent"],
                      ["link", "image", "video"],
                      ["codeView"],
                    ],
                  }}
                />
              )}
            />
            {errors.description && (
              <p className="text-red-500">{errors.description.message}</p>
            )}
          </div>

          {/* Submit */}
          <div className="mt-4 flex justify-end">
            <button
              disabled={isLoading || updating}
              type="submit"
              className="px-4 py-2 bg-black text-white rounded"
            >
              {isLoading || updating
                ? "Submitting..."
                : jobData
                ? "Update Job"
                : "Post Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobPostForm;
