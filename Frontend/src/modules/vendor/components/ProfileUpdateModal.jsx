import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { FaTimes } from "react-icons/fa";

const ProfileUpdateModal = ({ isOpen, onClose, onSubmit, title,fields, defaultValues = {} ,isUpdating}) => {
  const [formData, setFormData] = useState(defaultValues);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async() => {
   await onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 backdrop-blur-sm bg-black/30 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Panel className="bg-white border-2 border-gray-300 w-full max-w-4xl rounded-xl shadow-xl p-6 space-y-6">
          <div className="flex justify-between items-center border-b pb-2">
            <Dialog.Title className="text-xl font-bold text-gray-800">{title}</Dialog.Title>
            <button onClick={onClose}>
              <FaTimes className="text-gray-600 hover:text-red-500 cursor-pointer" />
            </button>
          </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto p-2">
  {fields.map(({ name, label }) => (
    <div key={name}>
      <label className="block text-gray-700 text-sm font-bold mb-1">
        {label}
      </label>
      <input
        name={name}
        value={formData[name] || ""}
        onChange={handleChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  ))}
</div>


          <div className="flex justify-end gap-3 border-t pt-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-sm rounded"
            >
              Cancel
            </button>
            <button
            disabled={isUpdating}
              onClick={handleSubmit}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded"
            >
           {isUpdating ? (
          <svg
            className="animate-spin h-5 w-5 text-white"
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
        ) : (
          "Update"
        )}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ProfileUpdateModal;
