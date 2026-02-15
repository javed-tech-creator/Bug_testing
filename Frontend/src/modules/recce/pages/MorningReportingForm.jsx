import React, { useState } from "react";
import PageHeader from "../../../components/PageHeader";
import { toast } from "react-toastify";

const MorningReportingForm = () => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    team: "Recce Team",
    shift: "Morning",
    plannedSites: 0,
    plannedArea: 0,
    estimatedPhotos: 0,
    estimatedMeasurements: 0,
    estimatedDocs: 0,
    objectives: "",
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
    toast.success("Morning plan submitted successfully!");
    console.log("Form Data:", formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <PageHeader title="Morning Reporting Form" />

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

          {/* Planning Metrics Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Today's Plan
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Planned Sites
                </label>
                <input
                  type="number"
                  name="plannedSites"
                  value={formData.plannedSites}
                  onChange={handleChange}
                  min="0"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter number of sites planned"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Planned Area (sq.ft)
                </label>
                <input
                  type="number"
                  name="plannedArea"
                  value={formData.plannedArea}
                  onChange={handleChange}
                  min="0"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter planned area"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Photos
                </label>
                <input
                  type="number"
                  name="estimatedPhotos"
                  value={formData.estimatedPhotos}
                  onChange={handleChange}
                  min="0"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter estimated photos"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Measurements
                </label>
                <input
                  type="number"
                  name="estimatedMeasurements"
                  value={formData.estimatedMeasurements}
                  onChange={handleChange}
                  min="0"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter estimated measurements"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Documents
                </label>
                <input
                  type="number"
                  name="estimatedDocs"
                  value={formData.estimatedDocs}
                  onChange={handleChange}
                  min="0"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter estimated documents"
                />
              </div>
            </div>
          </div>

          {/* Objectives Section */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Daily Objectives
            </h3>
            <textarea
              name="objectives"
              value={formData.objectives}
              onChange={handleChange}
              rows="4"
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Enter today's objectives and priorities..."
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
              Submit Morning Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MorningReportingForm;
