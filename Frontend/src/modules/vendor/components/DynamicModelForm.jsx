import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductModalForm = ({
  title = "🛍️ Add New Product",
  fields = [],
  defaultValues = {},
  onClose,
  onSubmit,
  isLoading,
  editMode,
}) => {
  const [formData, setFormData] = useState(defaultValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  useEffect(() => {
    setFormData(defaultValues);
  }, [defaultValues]);

  const validate = () => {
    const newErrors = {};
    fields.forEach((field) => {
      const fieldValue = formData[field.name];

      if (field.required && !fieldValue) {
        newErrors[field.name] = `${field.label} is required`;
      }

      // ✅ Extra validation for gstPercent range
      if (
        field.name === "gstPercent" &&
        fieldValue !== undefined &&
        fieldValue !== ""
      ) {
        const numValue = Number(fieldValue);
        if (isNaN(numValue) || numValue < 0 || numValue > 100) {
          newErrors[field.name] = "GST must be between 0 and 100";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const res = await onSubmit(formData); // must return from parent
      toast.success(
        res?.message ||
          (editMode
            ? "Product updated successfully!"
            : "Product added successfully!")
      );
      onClose();
      setFormData({});
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-white max-h-[90vh] overflow-y-auto w-full max-w-2xl rounded-xl p-6 shadow-xl border border-gray-200 relative">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
          {title}
        </h2>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div key={field.name} className="flex flex-col">
              <label className="text-sm  font-bold text-gray-700 mb-1">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>

            {field.type === "select" ? (
  <select
    name={field.name}
    value={formData[field.name] || ""}
    onChange={handleChange}
    className={`border p-2 rounded ${
      errors[field.name] ? "border-red-500" : "border-gray-300"
    }`}
  >
    <option value="">-- Select --</option>
    {field.options?.map((option) => {
      const value = typeof option === "object" ? option.value : option;
      const label = typeof option === "object" ? option.label : option;
      return (
        <option key={value} value={value}>
          {field.unit ? `${label} ${field.unit}` : label}
        </option>
      );
    })}
  </select>
) : field.type === "textarea" ? (
  <textarea
    name={field.name}
    value={formData[field.name] || ""}
    onChange={handleChange}
    placeholder={field.placeholder}
    rows={1}
    className={`border p-2 rounded resize-none ${
      errors[field.name] ? "border-red-500" : "border-gray-300"
    }`}
  />
) : (
  <input
    type={field.type || "text"}
    name={field.name}
    value={formData[field.name] || ""}
    min={field.min}
    max={field.max}
    onChange={handleChange}
    placeholder={field.placeholder}
    onKeyDown={(e) => {
      if (
        field.type === "number" &&
        ["e", "E", "+", "-"].includes(e.key)
      ) {
        e.preventDefault();
      }
    }}
    className={`border p-2 rounded ${
      errors[field.name] ? "border-red-500" : "border-gray-300"
    }`}
  />
)}


              {errors[field.name] && (
                <span className="text-xs text-red-500 mt-1">
                  {errors[field.name]}
                </span>
              )}
            </div>
          ))}

          <div className="col-span-1 md:col-span-2 flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm"
            >
              Cancel
            </button>
            <button
              disabled={isLoading}
              onClick={handleSubmit}
              className={`w-20 px-4 py-2 flex items-center justify-center rounded text-sm text-white 
    ${
      isLoading
        ? "bg-orange-400 cursor-not-allowed"
        : "bg-orange-500 hover:bg-orange-600"
    }`}
            >
              {isLoading ? (
                <svg
                  className="w-4 h-4 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              ) : editMode ? (
                "Update"
              ) : (
                "Add"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModalForm;
