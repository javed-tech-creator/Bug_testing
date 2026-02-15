import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import Loader from "@/components/Loader";
import {
  useAddCandidateMutation,
  useGetAllJobPostQuery,
} from "@/api/hr/job.api";

// ✅ Validation Schema
const schema = yup.object().shape({
  jobId: yup.string().required("Job selection is required"),
  name: yup
    .string()
    .matches(/^[A-Za-z ]+$/, "Name must contain only letters")
    .min(3, "Name must be at least 3 characters")
    .required("Candidate name is required"),
  email: yup.string().email().required("Valid email is required"),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Enter valid 10-digit phone number")
    .required("Phone is required"),
  experience: yup
    .string()
    .required("Experience is required")
    .matches(/^\d{1,2}$/, "Only 1 or 2 digits allowed"),
  skills: yup
    .string()
    .matches(/^[A-Za-z., ]+$/, "Skills must contain only letters and commas")
    .required("At least one skill is required"),
  source: yup.string().nullable(),
  resume: yup.mixed().required("Resume file is required"),
});

const AddCandidateForm = () => {
  const navigate = useNavigate();
  const [filePreview, setFilePreview] = useState(null);

  // ✅ API hooks
  const [addCandidate, { isLoading }] = useAddCandidateMutation();
  const { data: jobData, isLoading: jobLoading } = useGetAllJobPostQuery();

  // ✅ react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  // ✅ File change preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFilePreview(file.name);
  };

  // ✅ Submit handler
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("jobId", data.jobId);
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("experience", data.experience);
      formData.append("skills", data.skills);
      formData.append("source", data.source || "");
      formData.append("resume", data.resume[0]);

      const res = await addCandidate({ formData }).unwrap();
      if (res?.success) {
        toast.success("Candidate added successfully");
        reset();
        navigate("/hr/job/candidates");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to add candidate");
    }
  };

  if (jobLoading) return <Loader />;

  return (
    <div className="bg-gray-50">
      <PageHeader title="Add New Candidate" />
      <div className="w-full mx-auto border border-gray-200 rounded-2xl bg-white p-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-4 border border-gray-200 rounded-lg"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
            {/* Job Selection */}
            <div>
              <label className="block text-sm mb-0.5 font-medium">
                Select Job *
              </label>
              <select
                {...register("jobId")}
                className="w-full border rounded-md p-2 "
              >
                <option value="">-- Select Job --</option>
                {jobData?.data?.map((job) => (
                  <option key={job._id} value={job._id}>
                    {job.title}
                  </option>
                ))}
              </select>
              {errors.jobId && (
                <p className="text-red-500">{errors.jobId.message}</p>
              )}
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm mb-0.5 font-medium">Name *</label>
              <input
                {...register("name")}
                className="w-full border rounded-md p-2 "
                placeholder="Candidate Name"
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^A-Za-z ]/g, "");
                }}
              />
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm mb-0.5 font-medium">
                Email *
              </label>
              <input
                type="email"
                {...register("email")}
                className="w-full border rounded-md p-2 "
                placeholder="Email Address"
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm mb-0.5 font-medium">
                Phone *
              </label>
              <input
                type="tel"
                {...register("phone")}
                className="w-full border rounded-md p-2 "
                placeholder="10-digit number"
                maxLength={10}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                }}
              />
              {errors.phone && (
                <p className="text-red-500">{errors.phone.message}</p>
              )}
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm mb-0.5 font-medium">
                Experience *
              </label>

              <div className="flex items-center gap-1">
                <input
                  {...register("experience")}
                  className="flex-1 border rounded-md p-2"
                  placeholder="Enter Experience"
                  type="text"
                  maxLength={2}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/\D/g, "");
                  }}
                />

                <select className="flex-1 border rounded-md p-2">
                  <option value="">Select</option>
                  <option value="Year">Year</option>
                  <option value="Month">Month</option>
                </select>
              </div>

              {errors.experience && (
                <p className="text-red-500">{errors.experience.message}</p>
              )}
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm mb-0.5 font-medium">
                Skills (comma separated) *
              </label>
              <input
                {...register("skills")}
                className="w-full border rounded-md p-2 "
                placeholder="React, Node.js, MongoDB"
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^A-Za-z., ]/g, "");
                }}
              />
              {errors.skills && (
                <p className="text-red-500">{errors.skills.message}</p>
              )}
            </div>

            {/* Source */}
            <div>
              <label className="block text-sm mb-0.5 font-medium">
                Source (Optional)
              </label>
              <select
                {...register("source")}
                className="w-full border rounded-md p-2  bg-white"
                defaultValue=""
              >
                <option value="">Select Source</option>
                <option value="Referral">Referral</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Indeed">Indeed</option>
                <option value="Naukri">Naukri</option>
                <option value="Internal">Internal</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Resume Upload */}
            <div>
              <label className="block text-sm mb-0.5 font-medium">
                Upload Resume *
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                {...register("resume")}
                onChange={handleFileChange}
                className="w-full border rounded-md p-2  bg-white"
              />
              {filePreview && (
                <p className="text-sm text-gray-600 mt-1">{filePreview}</p>
              )}
              {errors.resume && (
                <p className="text-red-500">{errors.resume.message}</p>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="mt-4 flex justify-end">
            <button
              disabled={isLoading}
              type="submit"
              className="px-4 py-2 bg-black text-white rounded"
            >
              {isLoading ? "Submitting..." : "Add Candidate"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCandidateForm;
