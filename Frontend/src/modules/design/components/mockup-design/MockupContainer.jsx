import React, { useState } from "react";
import CommentWithMedia from "../recording/CommentWithMedia";

/* ================= Container ================= */
const MockupContainer = ({ data, onChange }) => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="mt-4 bg-gray-50 rounded-lg">
      {!showForm && (
        <div className="py-2 px-4 border shadow flex justify-end">
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-md"
          >
            + Add Mockup
          </button>
        </div>
      )}

      {showForm && (
        <MockupForm
          data={data}
          onChange={onChange}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

/* ================= Form ================= */
const MockupForm = ({ data, onChange, onClose }) => {
  return (
    <div className="border rounded-sm p-5 mt-4 bg-white shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <span className="px-4 py-1 text-sm font-medium bg-blue-100 text-blue-600 rounded-sm">
          Mockup Version
        </span>

        <button
          onClick={onClose}
        className="text-red-500 text-sm border p-1 cursor-pointer bg-red-50 hover:bg-red-100 transition rounded-sm"
          >
            ❌
        </button>
       
      </div>

      {/* Uploads */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <FileInput
            label="Upload Design Option"
            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
            helperText="Images, PDF, Docs only"
          />
        </div>

        <div className="flex-1">
          <FileInput
            label="Upload Supporting Assets"
            accept="*/*"
            helperText="All file types supported"
          />
        </div>
      </div>

      {/* Description + Media */}
      <CommentWithMedia
        title="Short Description"
        placeholder="Type here..."
        value={data?.description}
        files={data.files}
        onChange={(val) => onChange("description", val)}
        onFilesChange={(files) => onChange("files", files)}
      />
    </div>
  );
};

/* ================= File Input ================= */
const FileInput = ({ label, helperText, ...props }) => (
  <div
    className="border-2 border-dashed border-gray-300 rounded-lg p-4
                  hover:border-blue-400 transition bg-gray-50"
  >
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type="file"
      {...props}
      className="w-full text-sm
        file:mr-3 file:py-2 file:px-4
        file:border-0 file:rounded
        file:bg-blue-100 file:text-blue-700
        hover:file:bg-blue-200"
    />
    {helperText && <p className="text-xs text-gray-500 mt-1">{helperText}</p>}
  </div>
);
export default MockupContainer;
