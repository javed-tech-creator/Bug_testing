import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import {
  useUpdateTrainingMutation,
  useCreateTrainingMutation,
  useGetTrainingByEmployeeQuery,
} from "@/api/hr/employee.api";
import Loader from "@/components/Loader";

// Validation Schema
const schema = yup.object().shape({
  trainingName: yup
    .string()
    .matches(/^[A-Za-z\s]+$/, "Only alphabets are allowed")
    .required("Training name is required"),
  trainingType: yup
    .string()
    .matches(/^[A-Za-z\s]+$/, "Only alphabets are allowed")
    .required("Training type is required"),
  trainingPeriod: yup
    .string()
    .required("Training period is required")
    .matches(/^\d{1,2}$/, "Only 1 or 2 digits allowed"),
  trainingStartDate: yup
    .string()
    .required("Start date is required")
    .test("notPastDate", "Start date cannot be in the past", function (value) {
      if (!value) return true;
      return new Date(value) >= new Date(new Date().toDateString());
    }),
  trainingEndDate: yup
    .string()
    .nullable()
    .test(
      "endAfterStart",
      "End date must be after start date",
      function (value) {
        const { trainingStartDate } = this.parent;
        if (!value || !trainingStartDate) return true;
        return new Date(value) >= new Date(trainingStartDate);
      }
    ),
  mentorName: yup
    .string()
    .nullable()
    .matches(/^[A-Za-z\s]*$/, "Only alphabets are allowed"),
  remark: yup.string().nullable(),
  status: yup
    .string()
    .oneOf(["active", "completed", "pending", "cancelled"])
    .required("Status is required"),
  completionStatus: yup
    .string()
    .oneOf(["not-started", "in-progress", "completed"])
    .required("Completion status is required"),
  materials: yup.mixed().nullable(),
  isMandatory: yup.mixed().oneOf(["true", "false"]).required(),
});
const StepTraining = ({ goNext, goBack }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data: trainingData,
    isLoading: trainingLoading,
    refetch,
    error,
  } = useGetTrainingByEmployeeQuery({ id }, { skip: !id });
  const training = trainingData?.data || {};
  const [updateTraining, { isLoading: updateLoading }] =
    useUpdateTrainingMutation();
  const [createTraining, { isLoading: createLoading }] =
    useCreateTrainingMutation();

  const [initialized, setInitialized] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  // Prefill form
  useEffect(() => {
    if (!initialized && !trainingLoading && training) {
      reset({
        trainingName: training.trainingName || "",
        trainingType: training.trainingType || "other",
        trainingPeriod: training.trainingPeriod || "",
        trainingStartDate: training.trainingStartDate
          ? training.trainingStartDate.slice(0, 10)
          : "",
        trainingEndDate: training.trainingEndDate
          ? training.trainingEndDate.slice(0, 10)
          : "",
        mentorName: training.mentorName || "",
        remark: training.remark || "",
        status: training.status || "pending",
        completionStatus: training.completionStatus || "not-started",
        isMandatory: training.isMandatory ? "true" : "false",
        materials: null,
      });
      setExistingFiles(training.materials || []);
      setUploadedFiles([]);
      setInitialized(true);
    } else if (!initialized && error?.status === 404) {
      reset({
        trainingName: "",
        trainingType: "other",
        trainingPeriod: "",
        trainingStartDate: "",
        trainingEndDate: "",
        mentorName: "",
        remark: "",
        status: "pending",
        completionStatus: "not-started",
        isMandatory: "false",
        materials: null,
      });
      setExistingFiles([]);
      setUploadedFiles([]);
      setInitialized(true);
    }
  }, [training, trainingLoading, reset, error]);

  // File handling
  const onMaterialsChange = (e) => {
    setUploadedFiles(Array.from(e.target.files));
    setValue("materials", e.target.files);
  };

  const removeUploadedFile = (idx) => {
    const updated = uploadedFiles.filter((_, i) => i !== idx);
    setUploadedFiles(updated);
    const dataTransfer = new DataTransfer();
    updated.forEach((file) => dataTransfer.items.add(file));
    setValue("materials", dataTransfer.files);
  };

  const removeExistingFile = (idx) => {
    setExistingFiles(existingFiles.filter((_, i) => i !== idx));
  };

  const fileSize = (size) => {
    if (!size) return null;
    if (size > 1024 * 1024) return `${(size / 1024 / 1024).toFixed(1)} MB`;
    return `${(size / 1024).toFixed(1)} KB`;
  };

  const onSubmit = async (data) => {
    if (!isDirty && uploadedFiles.length === 0) {
      toast.info("No changes detected. Nothing to save.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("employeeId", id);
      formData.append("trainingName", data.trainingName);
      formData.append("trainingType", data.trainingType);
      formData.append("trainingPeriod", data.trainingPeriod);
      formData.append("trainingStartDate", data.trainingStartDate || "");
      formData.append("trainingEndDate", data.trainingEndDate || "");
      formData.append("mentorName", data.mentorName || "");
      formData.append("remark", data.remark || "");
      formData.append("status", data.status);
      formData.append("completionStatus", data.completionStatus);
      formData.append("isMandatory", data.isMandatory === "true");

      uploadedFiles.forEach((file) => formData.append("materials", file));

      if (training?._id) {
        await updateTraining({ id: training._id, formData }).unwrap();
        toast.success("Training updated successfully!");
      } else {
        await createTraining({ formData }).unwrap();
        toast.success("Training created successfully!");
      }

      setUploadedFiles([]);
      refetch();
      goNext();
      navigate(`/hr/employee/onboarding/${id}?step=7`);
    } catch (error) {
      toast.error("Failed to save training info");
      console.error("Error saving training info:", error);
    }
  };

  if (trainingLoading) return <Loader />;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mx-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-2 gap-x-4"
      >
        {/* Training Name */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1">
            Training Name *
          </label>
          <input
            type="text"
            {...register("trainingName")}
            onKeyDown={(e) => {
              if (
                !/[a-zA-Z\s]/.test(e.key) &&
                e.key !== "Backspace" &&
                e.key !== "Tab"
              ) {
                e.preventDefault();
              }
            }}
            placeholder="e.g. Safety Induction"
            className="w-full px-3 py-1.5 border rounded"
          />
          {errors.trainingName && (
            <p className="text-red-600 text-xs mt-0.5">
              {errors.trainingName.message}
            </p>
          )}
        </div>

        {/* Training Type */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1">
            Training Type *
          </label>
          <input
            type="text"
            {...register("trainingType")}
            onKeyDown={(e) => {
              if (
                !/[a-zA-Z\s]/.test(e.key) &&
                e.key !== "Backspace" &&
                e.key !== "Tab"
              ) {
                e.preventDefault();
              }
            }}
            className="w-full px-3 py-1.5 border rounded"
            placeholder="Enter training type"
          />
        </div>

        {/* Training Period */}
        <div>
          <label className="block text-sm mb-0.5 font-medium">
            Training Period *
          </label>

          <div className="flex items-center gap-1">
            <input
              {...register("trainingPeriod")}
              className="flex-1 border rounded-md p-2"
              placeholder="Enter Training Period"
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

          {errors.trainingPeriod && (
            <p className="text-red-500">{errors.trainingPeriod.message}</p>
          )}
        </div>

        {/* Start Date */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            {...register("trainingStartDate")}
            className="w-full px-3 py-1.5 border rounded"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            {...register("trainingEndDate")}
            className="w-full px-3 py-1.5 border rounded"
          />
          {errors.trainingEndDate && (
            <p className="text-red-600 text-xs mt-0.5">
              {errors.trainingEndDate.message}
            </p>
          )}
        </div>

        {/* Mentor */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1">
            Mentor
          </label>
          <input
            type="text"
            {...register("mentorName")}
            onKeyDown={(e) => {
              if (
                !/[a-zA-Z\s]/.test(e.key) &&
                e.key !== "Backspace" &&
                e.key !== "Tab"
              ) {
                e.preventDefault();
              }
            }}
            placeholder="Enter mentor/trainer name"
            className="w-full px-3 py-1.5 border rounded"
          />
        </div>

        {/* Completion Status */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1">
            Completion Status *
          </label>
          <select
            {...register("completionStatus")}
            className="w-full px-3 py-1.5 border rounded"
          >
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1">
            Training Status *
          </label>
          <select
            {...register("status")}
            className="w-full px-3 py-1.5 border rounded"
          >
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Mandatory */}
        <div>
          <label className="text-sm font-medium text-gray-700 mt-2 ml-2 block">
            Mandatory?
          </label>
          <div className="flex items-center gap-4 mt-1 ml-2">
            <label className="flex items-center gap-1 text-sm">
              <input type="radio" value="true" {...register("isMandatory")} />
              True
            </label>
            <label className="flex items-center gap-1 text-sm">
              <input type="radio" value="false" {...register("isMandatory")} />
              False
            </label>
          </div>
        </div>

        {/* Materials Upload & Preview */}
        <div className="lg:col-span-3">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Training Materials
          </label>
          {(!existingFiles || existingFiles.length === 0) && (
            <input
              type="file"
              multiple
              accept=".pdf,.png,.jpg,.jpeg"
              className="w-full border-2 p-2
             file:bg-black file:text-white file:py-1 file:px-2
             file:border-0 file:rounded file:cursor-pointer
             file:hover:bg-gray-600"
              onChange={onMaterialsChange}
            />
          )}

          {/* Existing files */}
          {existingFiles && existingFiles.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-4">
              {existingFiles.map((file, idx) => (
                <li
                  key={idx}
                  className="w-full sm:w-auto px-4 bg-gray-50/70 rounded border p-2 flex items-center gap-2"
                >
                  <a
                    href={
                      file.public_url ||
                      `${import.meta.env.VITE_BACKEND_URL}/${file.url}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-black text-white text-xs font-semibold rounded-md hover:bg-black transition-colors duration-200"
                  >
                    View
                  </a>
                  <button
                    type="button"
                    className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-md hover:bg-red-600 transition-colors duration-200"
                    onClick={() => removeExistingFile(idx)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* New files */}
          {uploadedFiles.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-4">
              {uploadedFiles.map((file, idx) => (
                <li
                  key={idx}
                  className="w-full sm:w-auto bg-blue-50 rounded border px-2 py-1.5 flex items-center gap-2"
                >
                  <span className="text-blue-800 text-sm font-medium">
                    {file.name} ({fileSize(file.size)})
                  </span>
                  <a
                    href={URL.createObjectURL(file)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline text-xs"
                  >
                    Preview
                  </a>
                  <button
                    type="button"
                    className="ml-2 text-red-500 hover:text-red-600 px-2 py-1 rounded"
                    onClick={() => removeUploadedFile(idx)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Remarks */}
        <div className="lg:col-span-3">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Remarks
          </label>
          <textarea
            {...register("remark")}
            placeholder="Enter additional notes"
            rows={2}
            className="w-full px-3 py-1.5 border rounded"
          />
        </div>

        {/* Buttons */}
        <div className="mt-4 flex justify-end items-center gap-2 lg:col-span-3">
          {/* <button
            type="button"
            onClick={goBack}
            className="px-4 py-1.5 border rounded text-gray-700 bg-white hover:border-black"
          >
            Back
          </button> */}
          <button
            type="submit"
            disabled={updateLoading || createLoading}
            className="px-4 py-2 bg-black text-white rounded-sm shadow hover:bg-black/70 cursor-pointer"
          >
            {updateLoading || createLoading ? "Saving..." : "Save & Next"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StepTraining;
