import React, { useState } from "react";
import { X, Upload, FileText, File } from "lucide-react";
import { toast } from "react-toastify";

const UploadFormModal = ({ isOpen, onClose, onSubmit, prId }) => {
  const [formData, setFormData] = useState({
    pdfFile: null,
    autocadFile: null,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // File type validation
  const validateFile = (file, allowedTypes, fieldName) => {
    if (!file) {
      return `${fieldName} is required`;
    }

    const fileExtension = file.name.split(".").pop().toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      return `Invalid file type. Only ${allowedTypes.join(", ")} files are allowed`;
    }

    // Optional: Add file size validation (e.g., max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return `File size should not exceed 10MB`;
    }

    return null;
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    
    setFormData((prev) => ({
      ...prev,
      [fieldName]: file,
    }));

    // Clear error for this field
    setErrors((prev) => ({
      ...prev,
      [fieldName]: null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate both files
    const pdfError = validateFile(formData.pdfFile, ["pdf"], "PDF file");
    const autocadError = validateFile(
      formData.autocadFile,
      ["dwg", "dxf"],
      "AutoCAD file"
    );

    if (pdfError || autocadError) {
      setErrors({
        pdfFile: pdfError,
        autocadFile: autocadError,
      });
      toast.error("Please fix the errors before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      // Get submission time
      const submissionTime = new Date().toISOString();

      // Prepare data for submission
      const uploadData = {
        prId,
        pdfFile: formData.pdfFile,
        autocadFile: formData.autocadFile,
        submissionTime,
      };

      // Call parent submit handler
      await onSubmit(uploadData);

      toast.success("Files uploaded successfully!");
      handleClose();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload files. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      pdfFile: null,
      autocadFile: null,
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">
            Upload Required Files
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-1 hover:bg-gray-100 rounded transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* PDF File Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                PDF File <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="pdfFile"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e, "pdfFile")}
                  className="hidden"
                  disabled={isSubmitting}
                />
                <label
                  htmlFor="pdfFile"
                  className={`flex items-center justify-center gap-2 border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors ${
                    errors.pdfFile
                      ? "border-red-300 bg-red-50"
                      : formData.pdfFile
                        ? "border-green-300 bg-green-50"
                        : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                  } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <FileText
                    size={24}
                    className={
                      errors.pdfFile
                        ? "text-red-500"
                        : formData.pdfFile
                          ? "text-green-500"
                          : "text-gray-400"
                    }
                  />
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">
                      {formData.pdfFile
                        ? formData.pdfFile.name
                        : "Click to upload PDF file"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Only PDF files allowed (Max 10MB)
                    </p>
                  </div>
                </label>
              </div>
              {errors.pdfFile && (
                <p className="text-red-500 text-xs mt-1">{errors.pdfFile}</p>
              )}
            </div>

            {/* AutoCAD File Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                AutoCAD File <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="autocadFile"
                  accept=".dwg,.dxf"
                  onChange={(e) => handleFileChange(e, "autocadFile")}
                  className="hidden"
                  disabled={isSubmitting}
                />
                <label
                  htmlFor="autocadFile"
                  className={`flex items-center justify-center gap-2 border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors ${
                    errors.autocadFile
                      ? "border-red-300 bg-red-50"
                      : formData.autocadFile
                        ? "border-green-300 bg-green-50"
                        : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                  } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <File
                    size={24}
                    className={
                      errors.autocadFile
                        ? "text-red-500"
                        : formData.autocadFile
                          ? "text-green-500"
                          : "text-gray-400"
                    }
                  />
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">
                      {formData.autocadFile
                        ? formData.autocadFile.name
                        : "Click to upload AutoCAD file"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Only .dwg or .dxf files allowed (Max 10MB)
                    </p>
                  </div>
                </label>
              </div>
              {errors.autocadFile && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.autocadFile}
                </p>
              )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> Both files are mandatory. Ensure that
                your files are in the correct format before uploading.
              </p>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6 py-2 bg-gray-600 text-white rounded text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={16} />
                  Upload Files
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadFormModal;