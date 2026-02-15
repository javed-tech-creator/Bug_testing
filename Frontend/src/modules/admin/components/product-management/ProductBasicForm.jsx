import React, { useState } from "react";
import {
  Upload,
  Save,
  Image as ImageIcon,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "@/api/admin/product-management/product.management.api";
import { toast } from "react-toastify";

export default function ProductBasicForm({ onClose, initialData }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    alias: initialData?.alias || "",
    image: null,
  });

  const [preview, setPreview] = useState(
    initialData?.productImage?.public_url || null
  );
  const [errors, setErrors] = useState({});

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const isLoading = isCreating || isUpdating;


  //  Validate fields before submit
  const validate = () => {
    const newErrors = {};

    //  Image required
    if (!formData.image && !preview)
      newErrors.image = "Please upload a product image.";

    //  Title validation
    const titleValue = formData.title.trim();
    if (!titleValue) newErrors.title = "Product title is required.";
    else if (titleValue.length < 3)
      newErrors.title = "Title must be at least 3 characters long.";
    else if (!onlyLettersRegex.test(titleValue))
      newErrors.title = "Title can only contain letters and basic punctuation.";

    //  Alias (optional)
    if (formData.alias && formData.alias.trim().length < 2)
      newErrors.alias = "Alias should have at least 2 characters.";

    //  Description validation
    const descValue = formData.description.trim();
    if (!descValue) newErrors.description = "Description is required.";
    else if (descValue.length < 10)
      newErrors.description =
        "Description must be at least 10 characters long.";
    else if (!onlyLettersRegex.test(descValue))
      newErrors.description =
        "Description can only contain letters and basic punctuation.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add this regex at the top (below imports)
const onlyLettersRegex = /^[A-Za-z\s.,!?-]*$/;

  //  Field-level live validation
  const validateField = (name, value) => {
    let message = "";
    const trimmedValue = value.trim();

    if (name === "title") {
      if (!trimmedValue) message = "Product title is required.";
      else if (trimmedValue.length < 3)
        message = "Title must be at least 3 characters long.";
       else if (trimmedValue.length > 50)
        message = "Title must be in 50 characters long.";
      else if (!onlyLettersRegex.test(trimmedValue))
        message = "Title can only contain letters and basic punctuation.";
    }

     if (name === "alias") {
       if (trimmedValue.length < 3)
        message = "Title must be at least 3 characters long.";
       else if (trimmedValue.length > 50)
        message = "Title must be in 50 characters long.";
      else if (!onlyLettersRegex.test(trimmedValue))
        message = "Title can only contain letters and basic punctuation.";
    }

    if (name === "description") {
      if (!trimmedValue) message = "Description is required.";
      else if (trimmedValue.length < 10)
        message = "Description must be at least 10 characters long.";
      else if (!onlyLettersRegex.test(trimmedValue))
        message = "Description can only contain letters and basic punctuation.";
    }

    return message;
  };


//  Handle text input
const handleChange = (e) => {
  const { name, value } = e.target;

  //  Prevent numbers from being typed in title or description
  if ((name === "title" || name === "alias" || name === "description") && /[0-9]/.test(value)) {
    return; // stop input if number found
  }

  setFormData((prev) => ({ ...prev, [name]: value }));

  //  Run live validation for this specific field
  const fieldError = validateField(name, value);

  setErrors((prev) => ({
    ...prev,
    [name]: fieldError,
  }));
};


  //  Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          image: "Only JPG, PNG, or JPEG formats are allowed.",
        }));
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "File size must be less than 2MB.",
        }));
        return;
      }
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  //  Submit form (with API call)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("alias", formData.alias);
      payload.append("description", formData.description);

      if (formData.image instanceof File) {
        payload.append("productImage", formData.image);
      }

      let res;
      if (initialData) {
        //  Update existing product
        res = await updateProduct({
          id: initialData._id,
          formData: payload,
        }).unwrap();
        toast.success(res?.message || "Product updated successfully!");
      } else {
        //  Create new product
        res = await createProduct(payload).unwrap();
        toast.success(res?.message || "Product created successfully!");
      }
      setFormData({
        title: "",
        description: "",
        alias: "",
        image: null,
      });
      setPreview(null);

      if (onClose) onClose();
    } catch (err) {
      toast.error(err?.data?.message || "Operation failed!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl space-y-2 p-4 sm:p-2 relative overflow-hidden"
    >
      {/* Product Title & Alias (Same Row) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Product Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Product Title <span className="text-orange-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter product title"
            required
            className={`w-full border rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 transition ${
              errors.title
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-gray-900 focus:border-gray-900"
            }`}
          />
          {errors.title && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.title}
            </p>
          )}
        </div>

        {/* Alias Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Alias Name
          </label>
          <input
            type="text"
            name="alias"
            value={formData.alias}
            onChange={handleChange}
            placeholder="Enter alias name"
            className={`w-full border rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 transition ${
              errors.alias
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-gray-900 focus:border-gray-900"
            }`}
          />
          {errors.alias && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.alias}
            </p>
          )}
        </div>
      </div>

      {/* Description & Upload Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Description <span className="text-orange-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter product description..."
            rows={5}
            className={`w-full border rounded-lg px-4 py-2 text-gray-900 placeholder-gray-400 focus:ring-2 transition resize-none ${
              errors.description
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-gray-900 focus:border-gray-900"
            }`}
          />
          {errors.description && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle size={14} /> {errors.description}
            </p>
          )}
        </div>

        {/* Upload Section - Centered */}
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-center">
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              Product Image <span className="text-orange-500">*</span>
            </label>

            <label className="cursor-pointer">
              <span className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2 rounded-lg font-medium transition">
                <Upload size={18} /> Upload Image
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            <p className="text-xs text-gray-500 mt-1">
              Supported formats: JPG, PNG, JPEG
            </p>

            {errors.image && (
              <p className="text-xs text-red-500 mt-1 flex items-center justify-center gap-1">
                <AlertCircle size={14} /> {errors.image}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Full Width Image Preview */}
      {preview && (
        <div className="w-full mt-4">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Image Preview
          </label>
          <div className="relative w-full h-56 sm:h-64 border border-gray-300 rounded-xl overflow-hidden shadow-sm">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Bottom Fixed Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 bg-white sticky bottom-0 left-0 right-0 p-4">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="px-4 py-2 border border-gray-400 text-gray-800 rounded-lg font-medium hover:bg-gray-100 transition disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium shadow transition ${
            isLoading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600 text-white"
          }`}
        >
          {isLoading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <>
              <Save size={18} />
              {initialData ? "Update" : "Save"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
