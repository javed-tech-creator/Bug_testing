import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAddTicketMutation } from "@/api/technology/helpdesk.api";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";

// ✅ Validation Schema
const schema = yup.object().shape({
  priority: yup.string().required("Priority is required"),
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),
  attachment: yup
    .mixed()
    .test("fileType", "Only images or videos are allowed", (value) => {
      if (!value || value.length === 0) return true; // Optional
      const file = value[0];
      return (
        file &&
        (file.type.startsWith("image/") || file.type.startsWith("video/"))
      );
    }),
});

const ModalForm = ({ isOpen, onClose, ticketType }) => {
  const [preview, setPreview] = useState(null);
  const [addTicket, { isLoading }] = useAddTicketMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // const onSubmit = (data) => {
  //   const formData = new FormData();
  //   formData.append("priority", data.priority);
  //   formData.append("description", data.description);
  //   formData.append("ticketType", ticketType);

  //   if (data.attachment && data.attachment.length > 0) {
  //     formData.append("attachment", data.attachment[0]); // sirf first file
  //   }

  //   // Debugging check
  //   for (let pair of formData.entries()) {
  //     console.log(pair[0], pair[1]);
  //   }
  //   console.log("formdata is",formData);
  //   onClose()
  //   reset();
  //     setPreview(null); // reset preview bhi

  //   // Yaha API call karo → axios/fetch ke sath
  // };

  // 📌 File change hone par preview set karna

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("priority", data.priority);
    formData.append("description", data.description);
    formData.append("ticketType", ticketType);

    if (data.attachment && data.attachment.length > 0) {
      formData.append("attachment", data.attachment[0]); // sirf first file
    }

    // Debugging check
    // for (let pair of formData.entries()) {
    //   console.log(pair[0], pair[1]);
    // }

    try {
      const response = await addTicket(formData).unwrap(); //  RTK query call
      console.log("Ticket Added:", response);
      toast.success(" Ticket created successfully!");
      // success hone ke baad cleanup
      reset();
      setPreview(null);
      onClose();
    } catch (error) {
      console.error("Error while adding ticket:", error);
      toast.error(error?.data?.message || "Failed to create ticket");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setPreview(null);
      return;
    }
    const fileURL = URL.createObjectURL(file);
    setPreview({ url: fileURL, type: file.type });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center mb-5 border-b pb-3">
          <h2 className="text-lg font-semibold text-black">
          Create Support Ticket
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Priority */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Priority
            </label>
            <select
              {...register("priority")}
              className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
            >
              <option value="">Select priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            {errors.priority && (
              <p className="text-red-500 text-xs mt-1">
                {errors.priority.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={4}
              placeholder="Enter issue description..."
              className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Attachment */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Attachment (Image/Video)
            </label>
            <div className="relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-orange-400 transition">
              <input
                type="file"
                accept="image/*,video/*"
                {...register("attachment")}
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <p className="text-sm text-gray-500">
                📁 Click or drag file here
              </p>
            </div>
            {errors.attachment && (
              <p className="text-red-500 text-xs mt-1">
                {errors.attachment.message}
              </p>
            )}

            {/* ✅ Preview */}
            {preview && (
              <div className="mt-3">
                {preview.type.startsWith("image/") ? (
                  <img
                    src={preview.url}
                    alt="Preview"
                    className="w-full max-h-48 object-contain rounded-lg border"
                  />
                ) : (
                  <video
                    controls
                    src={preview.url}
                    className="w-full max-h-48 rounded-lg border"
                  />
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-5 py-2 text-sm text-white rounded-lg shadow cursor-pointer 
    ${
      isLoading
        ? "bg-orange-500"
        : "bg-orange-500 hover:bg-orange-600 hover:shadow-md"
    }`}
            >
              {isLoading ?  <FaSpinner className="animate-spin" />: "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalForm;
