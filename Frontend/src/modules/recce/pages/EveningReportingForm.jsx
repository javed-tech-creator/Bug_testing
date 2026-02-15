import React, { useState } from "react";
import PageHeader from "../../../components/PageHeader";
import { toast } from "react-toastify";

const EveningReportingForm = () => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    team: "Recce Team",
    shift: "Evening",
    sitesCompleted: 0,
    sitesIncomplete: 0,
    totalArea: 0,
    photosCollected: 0,
    measurementsDone: 0,
    documentsCollected: 0,
    remarks: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Evening report submitted successfully!");
    console.log("Form Data:", formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <PageHeader title="Evening Reporting Form" />

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header Section */}
          <div className="grid grid-cols-3 gap-4 pb-6 border-b">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Team
              </label>
              <input
                type="text"
                name="team"
                value={formData.team}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Enter team name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shift
              </label>
              <input
                type="text"
                name="shift"
                value={formData.shift}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50"
                disabled
              />
            </div>
          </div>

          {/* Work Metrics Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Work Metrics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sites Completed
                </label>
                <input
                  type="number"
                  name="sitesCompleted"
                  value={formData.sitesCompleted}
                  onChange={handleChange}
                  min="0"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter number of completed sites"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sites Incomplete
                </label>
                <input
                  type="number"
                  name="sitesIncomplete"
                  value={formData.sitesIncomplete}
                  onChange={handleChange}
                  min="0"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter number of incomplete sites"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Area Surveyed (sq.ft)
                </label>
                <input
                  type="number"
                  name="totalArea"
                  value={formData.totalArea}
                  onChange={handleChange}
                  min="0"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter total area"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photos Collected
                </label>
                <input
                  type="number"
                  name="photosCollected"
                  value={formData.photosCollected}
                  onChange={handleChange}
                  min="0"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter number of photos"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Measurements Done
                </label>
                <input
                  type="number"
                  name="measurementsDone"
                  value={formData.measurementsDone}
                  onChange={handleChange}
                  min="0"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter number of measurements"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Documents Collected
                </label>
                <input
                  type="number"
                  name="documentsCollected"
                  value={formData.documentsCollected}
                  onChange={handleChange}
                  min="0"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter number of documents"
                />
              </div>
            </div>
          </div>

          {/* Remarks Section */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Additional Information
            </h3>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              rows="4"
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Enter any additional remarks or observations..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              Submit Evening Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EveningReportingForm;
