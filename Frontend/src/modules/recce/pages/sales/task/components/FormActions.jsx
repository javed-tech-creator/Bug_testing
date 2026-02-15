import React from "react";

const FormActions = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border mt-6">
      <div className="flex justify-end gap-4">
        {/* Reset Form */}
        <button className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-100 transition">
          Reset Form
        </button>

        {/* Save as Draft */}
        <button className="px-6 py-3 bg-gray-700 text-white rounded-xl font-medium hover:bg-gray-800 transition">
          Save as Draft
        </button>

        {/* Assign Target */}
        <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition">
          Assign Target
        </button>
      </div>
    </div>
  );
};

export default FormActions;
