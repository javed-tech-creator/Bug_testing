import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import PageHeader from "@/components/PageHeader";
import Modal from "@/modules/hr/pages/standardOperatingProcedure/components/Modal";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector } from "react-redux";

import {
  useGetZonesQuery,
  useGetStatesByZoneQuery,
  useGetCitiesByStateQuery,
  useGetBranchesByCityQuery,
  useGetDepartmentByBranchQuery,
  useGetDesignationsByDepIdQuery,
  useCreateSopMutation,
  useGetSopByIdQuery,
  useUpdateSopMutation,
  useDeleteSopFileMutation,
} from "@/api/hr/employment.api.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string(),
  file: yup.mixed(),
});

const SopForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const isViewMode = location.pathname.includes("/view");
  const isEditMode = location.pathname.includes("/edit");

  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);

  const [createSop] = useCreateSopMutation();
  const [updateSop] = useUpdateSopMutation();
  const [deleteSopFile] = useDeleteSopFileMutation();

  const user = useSelector((state) => state.auth?.userData?.user) || {};

  const isImageFile = useCallback((file) => {
    // file can be File (from input) or object with name/url
    if (!file) return false;
    if (file.type) return file.type.startsWith("image/");
    const fileName = file.name || file.url || "";
    return /\.(jpe?g|png|gif|bmp|webp)$/i.test(fileName);
  }, []);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const watchZone = !isViewMode ? useWatch({ control, name: "zone" }) : null;
  const watchState = !isViewMode ? useWatch({ control, name: "state" }) : null;
  const watchCity = !isViewMode ? useWatch({ control, name: "city" }) : null;
  const watchBranch = !isViewMode
    ? useWatch({ control, name: "branch" })
    : null;
  const watchDepartment = !isViewMode
    ? useWatch({ control, name: "department" })
    : null;

  const watchedFile = useWatch({ control, name: "file" });

  const { data: zones } = useGetZonesQuery();
  const { data: states } = useGetStatesByZoneQuery(watchZone, {
    skip: !watchZone,
  });
  const { data: cities } = useGetCitiesByStateQuery(watchState, {
    skip: !watchState,
  });
  const { data: branches } = useGetBranchesByCityQuery(watchCity, {
    skip: !watchCity,
  });
  const { data: departments } = useGetDepartmentByBranchQuery(watchBranch, {
    skip: !watchBranch,
  });
  const { data: designations } = useGetDesignationsByDepIdQuery(
    watchDepartment,
    { skip: !watchDepartment }
  );

  const { data: sopData, isLoading: loadingSop } = useGetSopByIdQuery(id, {
    skip: !id,
  });

  useEffect(() => {
    if (!sopData?.data) return;

    const sop = sopData.data;
    console.log("SOP Data Loaded:", sop);
    setValue("zone", sop.zone || "");
    setValue("state", sop.state || "");
    setValue("city", sop.city || "");
    setValue("branch", sop.branch || "");
    setValue("department", sop.department || "");
    setValue("designation", sop.designationId?._id || "");
    setValue("title", sop.title || "");
    setValue("description", sop.description || "");

    setExistingFiles(sop.files || []);
  }, [sopData, setValue]);

  useEffect(() => {
    if (isViewMode) return;

    if (watchedFile?.length > 0) setSelectedFiles(Array.from(watchedFile));
    else setSelectedFiles([]);
  }, [watchedFile, isViewMode]);

  const handleDeleteExistingFile = async (fileId) => {
    if (!fileId) return;

    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this file?"
      );
      if (!confirmed) return;

      await deleteSopFile({ sopId: id, fileId }).unwrap();

      setExistingFiles((prev) => prev.filter((f) => f._id !== fileId));

      toast.success("File deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete file");
    }
  };

  const validateFileIsAllowed = (file) => {
    if (!file) return false;
    if (file.type) {
      const isImg = file.type.startsWith("image/");
      const isPdf = file.type === "application/pdf";
      return isImg || isPdf;
    }
    // fallback to extension check
    const name = file.name || "";
    return /\.(jpe?g|png|gif|bmp|webp|pdf)$/i.test(name);
  };

  const onSubmit = async (formData) => {
    if (isViewMode) return;

    setLoading(true);

    try {
      const fd = new FormData();

      const keys = [
        "zone",
        "state",
        "city",
        "branch",
        "department",
        "designation",
        "title",
        "description",
      ];

      keys.forEach((key) => {
        const val = formData[key];
        if (key === "designation") fd.append("designationId", val || "");
        else fd.append(key, val || "");
      });

      fd.append("uploadedBy", user?._id || "");
      fd.append("uploadedByName", user?.name || "");

      // client-side validation for files (images + pdf only)
      for (const file of selectedFiles) {
        if (!validateFileIsAllowed(file)) {
          toast.error("Only Images & PDF files are allowed!");
          setLoading(false);
          return;
        }
        fd.append("files", file);
      }

      if (isEditMode) {
        await updateSop({ id, data: fd }).unwrap();
        toast.success("SOP Updated");
      } else {
        await createSop(fd).unwrap();
        toast.success("SOP Created");
      }

      navigate("/hr/sop");
    } catch (error) {
      // Provide meaningful error messages to user
      const msg =
        error?.data?.message ||
        error?.message ||
        "Failed to save SOP. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (loadingSop) return <p className="p-6 text-center">Loading...</p>;

  const renderFormUI = () => (
    <div className="p-4 border border-gray-200 rounded-md bg-white">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-3 gap-4"
      >
        {!isViewMode && (
          <>
            {[
              ["Zone", "zone", zones?.data],
              ["State", "state", states?.data],
              ["City", "city", cities?.data],
              ["Branch", "branch", branches?.data],
              ["Department", "department", departments?.data],
              ["Designation", "designation", designations?.data],
            ].map(([label, key, list]) => (
              <div key={key} className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">
                  {label}
                </label>

                <select
                  disabled={isViewMode || isEditMode}
                  {...register(key)}
                  defaultValue=""
                  className={`w-full border p-2 rounded-md mt-1 ${
                    isViewMode || isEditMode ? "cursor-not-allowed bg-gray-100" : ""
                  }`}
                >
                  <option value="">Select</option>
                  {list?.length > 0 &&
                    list?.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.title}
                      </option>
                    ))}
                </select>
              </div>
            ))}
          </>
        )}

        {/* Title + Description Row */}
        <div className="col-span-3 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              SOP Title
            </label>
            <input
              disabled={isViewMode}
              {...register("title")}
              className={`w-full border p-2 rounded-md mt-1 ${
                isViewMode ? "cursor-not-allowed bg-gray-100" : ""
              }`}
              placeholder="Enter Your SOP Title"
            />
            {errors.title && (
              <p className="text-sm text-red-600 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              SOP Description
            </label>
            <textarea
              disabled={isViewMode}
              {...register("description")}
              className={`w-full border p-2 rounded-md mt-1 h-[45px] resize-none ${
                isViewMode ? "cursor-not-allowed bg-gray-100" : ""
              }`}
              placeholder="Enter Your SOP Description"
            />
          </div>
        </div>

        {/* ===================== FILE UPLOAD (DRAG + DROP + CLICK) ===================== */}
        <div className="col-span-3">
          <label className="block text-sm font-medium text-gray-700">
            Upload Files
          </label>

          <div
            className={`mt-2 border-2 border-dashed border-gray-400 rounded-md p-6 text-center 
  ${
    isViewMode
      ? "opacity-50 cursor-not-allowed"
      : "cursor-pointer hover:bg-gray-50"
  }`}
            onDragOver={(e) => !isViewMode && e.preventDefault()}
            onDrop={(e) => {
              if (isViewMode) return;
              e.preventDefault();
              const droppedFiles = Array.from(e.dataTransfer.files || []);
              const updated = [...selectedFiles, ...droppedFiles];

              // validate at least extension/type for immediate feedback
              const invalid = updated.find((f) => !validateFileIsAllowed(f));
              if (invalid) {
                toast.error("Only Images & PDF files are allowed!");
                return;
              }

              setSelectedFiles(updated);

              // update react-hook-form
              setValue("file", updated);
            }}
            onClick={() =>
              !isViewMode && document.getElementById("realFile").click()
            }
          >
            <p className="text-gray-600 font-medium">Drag & Drop files here</p>
            <p className="text-gray-500 text-sm mt-1">or click to browse</p>
          </div>

          {/* HIDDEN INPUT — clean + NOT taking full area */}
          <input
            id="realFile"
            type="file"
            multiple
            className={`hidden ${isViewMode ? "cursor-not-allowed" : ""}`}
            disabled={isViewMode}
            onChange={(e) => {
              const files = Array.from(e.target.files || []);

              const invalid = files.find((f) => !validateFileIsAllowed(f));
              if (invalid) {
                toast.error("Only Images & PDF files are allowed!");
                return;
              }

              const updated = [...selectedFiles, ...files];
              setSelectedFiles(updated);
              setValue("file", updated);
            }}
          />

          {/* FILE PREVIEW */}
          {selectedFiles.length > 0 && (
            <div className="mt-4 space-y-3">
              {selectedFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between border rounded-md p-3 bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    {(file.type && file.type.startsWith("image/")) ||
                    isImageFile(file) ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    ) : (
                      <div className="text-sm text-gray-700 font-medium break-all">
                        📄 {file.name}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    className="text-red-600"
                    onClick={() => {
                      const updated = selectedFiles.filter((_, i) => i !== idx);
                      setSelectedFiles(updated);
                      setValue("file", updated);
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* ===================== END FILE UPLOAD ===================== */}

        {/* Existing Files */}
        {existingFiles.length > 0 && (
          <div
            className={`col-span-3 ${
              isViewMode ? "max-h-[350px] overflow-y-auto" : ""
            }`}
          >
            <label className="block text-sm font-medium text-gray-700">
              Existing Files
            </label>

            <div className="mt-2 space-y-2">
              {existingFiles.map((f) => {
                const cleanUrl = f.url?.replace(/^public\//, "") || "";
                const fullUrl =
                  f.public_url ||
                  `${API_BASE_URL.replace(/\/$/, "")}/${cleanUrl.replace(
                    /^\//,
                    ""
                  )}`;

                return (
                  <div
                    key={f._id}
                    className="flex items-center justify-between p-3 border rounded-md"
                  >
                    {isImageFile(f) ? (
                      <a
                        href={fullUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center space-x-3 group"
                      >
                        <img
                          src={fullUrl}
                          alt={f.name}
                          className={`${
                            isViewMode ? "w-12 h-12" : "w-16 h-16"
                          } object-cover rounded-md shadow`}
                        />
                        <span className="text-blue-600 group-hover:underline">
                          {f.name}
                        </span>
                      </a>
                    ) : (
                      <a
                        href={fullUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                      >
                        {f.name} (View File)
                      </a>
                    )}

                    {!isViewMode && (
                      <button
                        type="button"
                        onClick={() => handleDeleteExistingFile(f._id)}
                        className="text-red-600"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Submit Button */}
        {!isViewMode && (
          <div className="col-span-3 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-5 py-3 rounded-md"
            >
              {loading ? "Saving..." : isEditMode ? "Update SOP" : "Submit SOP"}
            </button>
          </div>
        )}
      </form>
    </div>
  );

  // -------- RETURN UI --------
  if (isViewMode) {
    return (
      <Modal isOpen={true} data={sopData?.data} onClose={() => navigate(-1)} />
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <PageHeader title={isEditMode ? "Edit SOP" : "Add SOP"} />
        <div className="bg-white rounded-md shadow p-6 mt-4">
          {renderFormUI()}
        </div>
      </div>
    </div>
  );
};

export default SopForm;
