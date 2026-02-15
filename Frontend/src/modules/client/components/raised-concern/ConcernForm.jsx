import { useState, useRef } from "react";
import { toast } from "react-toastify";
import CommentWithMedia from "../../../design/components/recording/CommentWithMedia";

export default function ConcernForm() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);

  const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
  const ALLOWED_TYPES = ["image/svg+xml", "image/png", "image/jpeg", "application/pdf"];

  const handleFileSelect = (files) => {
    const file = files && files[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`File ${file.name} is too large. Max size is 1MB.`);
      return;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error(`File ${file.name} format not allowed. Use SVG, PNG, JPG, or PDF.`);
      return;
    }
    setUploadedFiles([{ name: file.name, size: file.size, type: file.type }]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleSave = () => {
    toast.success("Concern saved successfully.");
    setDescription("");
    setFiles([]);
    setUploadedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = () => {
    setUploadedFiles([]);
  };

  return (
    <div className="bg-white border rounded-lg overflow-hidden">

        {/* Header */}
        <div className="bg-blue-600 text-white px-5 py-4">
          <h2 className="font-semibold text-lg">Report an Issue</h2>
          <p className="text-sm opacity-90">
            We take your concerns seriously. Please provide details below so we can address them immediately.
          </p>
        </div>

        {/* Form */}
        <div className="p-5 space-y-5">

          {/* Concern Type */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Concern Type
            </label>
            <select className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
              <option>Select Issue Category...</option>
              <option>Design Issue</option>
              <option>Delay</option>
              <option>Quality Issue</option>
              <option>Payment Issue</option>
            </select>
          </div>

          {/* Description */}
          <CommentWithMedia
  title="Description"
  placeholder="Please describe the issue in detail. Include dates or names if relevant."
  value={description}
  onChange={setDescription}
  files={files}
  onFilesChange={setFiles}
/>


          {/* Attachment */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Attachment (Optional)
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept=".svg,.png,.jpg,.jpeg,.pdf"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />

            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-4 text-center text-sm transition cursor-pointer ${
                dragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-blue-500"
              }`}
            >
              {uploadedFiles.length > 0 ? (
                <div className="text-sm font-medium text-blue-700">
                  {uploadedFiles[0].name}
                </div>
              ) : (
                <>
                  <div className="flex justify-center mb-2 text-blue-600 text-2xl">
                    ⬆
                  </div>
                  <p className="font-medium text-gray-700">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500 mt-1">
                    SVG, PNG, JPG or PDF (max 1MB)
                  </p>
                </>
              )}
            </div>

          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
          </div>

        </div>
      </div>
    )
}
