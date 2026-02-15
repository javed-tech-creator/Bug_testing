import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FiEye, FiDownload, FiTrash2 } from "react-icons/fi";
import { Upload, FileText, Plus, AlertCircle, CheckCircle } from "lucide-react";

import {
  useGetEmployeeByIdQuery,
  useUpdateDocumentMutation,
} from "@/api/hr/employee.api";
import Loader from "@/components/Loader";

const defaultDocs = [
  { label: "Aadhaar Card", name: "Aadhaar", required: true },
  { label: "PAN Card", name: "PAN", required: true },
  { label: "Bank Passbook", name: "Passbook", required: true },
  { label: "High School Marksheet", name: "High School" },
  { label: "Graduation Marksheet", name: "Graduation" },
  { label: "Salary Slips", name: "Salary Slip" },
];

const StepDocuments = ({ goNext, goBack }) => {
  const { id } = useParams();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const {
    data: employeeData,
    isLoading,
    refetch,
  } = useGetEmployeeByIdQuery({ id }, { skip: !id });
  const [updateDocuments, { isLoading: isUpdating }] =
    useUpdateDocumentMutation();

  const employee = employeeData?.data;

  const [fileChanges, setFileChanges] = useState({});
  const [otherDocs, setOtherDocs] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (employee?.documents) {
      setFileChanges({});
      setOtherDocs([]);
      setErrors({});
    }
  }, [employee?._id]);

  const getFileName = (url) => {
    if (!url) return "";
    const parts = url.split("/");
    return parts[parts.length - 1];
  };

  const handleFileChange = (type, file) => {
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          [type]: "File size should not exceed 5MB",
        }));
        return;
      }

      // Validate file type
      const validTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
      ];
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          [type]: "Only PDF, JPG, JPEG, and PNG files are allowed",
        }));
        return;
      }

      setFileChanges((prev) => ({
        ...prev,
        [type]: file,
      }));
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[type];
        return newErrors;
      });
    }
  };

  const removeFileChange = (type) => {
    setFileChanges((prev) => {
      const newChanges = { ...prev };
      delete newChanges[type];
      return newChanges;
    });
  };

  const handleAddOtherDoc = () => {
    setOtherDocs((prev) => [...prev, { type: "", file: null, id: Date.now() }]);
  };

  const handleOtherDocChange = (id, field, value) => {
    setOtherDocs((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, [field]: value } : doc))
    );
  };

  const handleRemoveOtherDoc = (id) => {
    setOtherDocs((prev) => prev.filter((doc) => doc.id !== id));
  };

  const validateForm = () => {
    const newErrors = {};
    let hasRequiredDocs = true;

    defaultDocs.forEach((doc) => {
      if (doc.required) {
        const uploaded = employee?.documents?.find(
          (d) => d.type?.toLowerCase() === doc.name.toLowerCase()
        );
        const hasChange = fileChanges[doc.name];
        if (!uploaded && !hasChange) {
          newErrors[doc.name] = "This document is required";
          hasRequiredDocs = false;
        }
      }
    });

    otherDocs.forEach((doc) => {
      if (doc.file && !doc.type.trim()) {
        newErrors[`other_${doc.id}`] = "Document type is required";
      }
    });

    setErrors(newErrors);
    return hasRequiredDocs && Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!id) return;

    if (!validateForm()) {
      toast.error("Please fill all required documents");
      return;
    }

    const formData = new FormData();
    let hasChanges = false;

    Object.keys(fileChanges).forEach((type) => {
      formData.append("documents", fileChanges[type]);
      formData.append("documentTypes[]", type.trim().toLowerCase());
      hasChanges = true;
    });

    otherDocs.forEach((doc) => {
      if (doc.file && doc.type.trim()) {
        formData.append("documents", doc.file);
        formData.append("documentTypes[]", doc.type.trim().toLowerCase());
        hasChanges = true;
      }
    });

    formData.append("replace", "true");

    if (!hasChanges) {
      toast.info("No changes to save");
      return;
    }

    try {
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
      await updateDocuments({ id, formData }).unwrap();
      toast.success("Documents updated successfully");
      setFileChanges({});
      setOtherDocs([]);
      await refetch();
      goNext();
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to update documents");
    }
  };

  const handleDownload = async (fileUrl) => {
    try {
      const url = fileUrl.startsWith("http")
        ? fileUrl
        : `${backendUrl}/${fileUrl}`;

      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = url.split("/").pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download file");
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      {/* Required Documents */}
      <h2 className="text-lg font-semibold mb-4">Required Documents</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {defaultDocs.map((doc) => {
          const uploaded = employee?.documents?.find(
            (d) => d.type?.toLowerCase() === doc.name.toLowerCase()
          );
          const hasChange = fileChanges[doc.name];
          const hasError = errors[doc.name];

          return (
            <div
              key={doc.name}
              className="bg-gray-50 rounded-lg border border-gray-200 p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-800">
                  {doc.label}
                  {doc.required && <span className="text-red-500 ml-1">*</span>}
                </h3>
              </div>

              {/* Show pending upload file */}
              {hasChange && (
                <div className="space-y-3 mb-3">
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-md p-3">
                    <CheckCircle className="w-4 h-4 text-orange-600 mr-3 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700 truncate flex-1">
                      {fileChanges[doc.name].name}
                    </span>
                    <button
                      onClick={() => removeFileChange(doc.name)}
                      className="ml-2 text-red-600 hover:text-red-700"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-orange-600">
                    New file selected. Click "Save & Next" to upload.
                  </p>
                </div>
              )}

              {/* Show uploaded document */}
              {uploaded?.public_url || (uploaded?.url && !hasChange) ? (
                <div className="space-y-3">
                  <div className="flex items-center bg-green-50 border border-green-200 rounded-md p-3">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700 truncate">
                      {getFileName(uploaded?.public_url || uploaded.url)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={
                        uploaded?.public_url
                          ? uploaded.public_url
                          : `${backendUrl}/${uploaded?.url || ""}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center px-3 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-black/70 flex-1"
                    >
                      <FiEye className="w-4 h-4 mr-2" />
                      View
                    </a>
                    <button
                      type="button"
                      onClick={() =>
                        handleDownload(uploaded?.public_url || uploaded?.url || "")
                      }
                      className="flex items-center justify-center px-3 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 flex-1"
                    >
                      <FiDownload className="w-4 h-4 mr-2" />
                      Download
                    </button>
                  </div>
                </div>
              ) : !hasChange ? (
                <div className="space-y-3">
                  <div className="flex items-center bg-gray-100 border border-gray-200 rounded-md p-3">
                    <FileText className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-500">Not uploaded</span>
                  </div>
                </div>
              ) : null}

              {/* Error Message */}
              {hasError && (
                <div className="mt-3 p-2 bg-red-50 rounded-md border border-red-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-red-700">{hasError}</p>
                </div>
              )}

              {/* Upload/Replace Button */}
              <label className="mt-3 w-full flex items-center justify-center px-3 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-black/70 cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                {uploaded || hasChange ? "Replace" : `Upload ${doc.label}`}
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  hidden
                  onChange={(e) =>
                    handleFileChange(doc.name, e.target.files[0])
                  }
                />
              </label>
            </div>
          );
        })}
      </div>

      {/* Additional Documents Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Additional Documents</h2>
          <button
            type="button"
            onClick={handleAddOtherDoc}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Document
          </button>
        </div>

        {otherDocs.length > 0 && (
          <div className="space-y-3">
            {otherDocs.map((doc) => (
              <div
                key={doc.id}
                className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Document Type <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Experience Letter"
                      value={doc.type}
                      onChange={(e) =>
                        handleOtherDocChange(doc.id, "type", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                    />
                    {errors[`other_${doc.id}`] && (
                      <p className="text-xs text-red-600 mt-1">
                        {errors[`other_${doc.id}`]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      File <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) =>
                        handleOtherDocChange(doc.id, "file", e.target.files[0])
                      }
                      className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-black file:text-white hover:file:bg-black/70 file:cursor-pointer"
                    />
                    {doc.file && (
                      <p className="text-xs text-green-600 mt-1 truncate">
                        {doc.file.name}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveOtherDoc(doc.id)}
                  className="mt-6 p-2 text-red-600 hover:bg-red-50 rounded-md transition"
                  title="Remove document"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {otherDocs.length === 0 && (
          <div className="text-center  text-gray-400">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No additional documents added</p>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-6 flex justify-end">
        {/* <button
          type="button"
          onClick={goBack}
          disabled={isUpdating}
          className="px-4 py-2 border rounded-sm bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button> */}
        <button
          type="button"
          onClick={handleSave}
          disabled={isUpdating}
          className="px-4 py-2 bg-black text-white rounded-sm shadow hover:bg-black/70 cursor-pointer"
        >
          {isUpdating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            "Save & Next"
          )}
        </button>
      </div>
    </div>
  );
};

export default StepDocuments;
