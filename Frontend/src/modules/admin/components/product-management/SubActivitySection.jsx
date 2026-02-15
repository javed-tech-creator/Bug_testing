import React, { useEffect } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import ArrayInputSection from "./ArrayInputSection";
import SingleInputField from "./SingleInputField";

export default function SubActivitySection({ subActivities = [], onChange }) {
  //  Function to add a new SubActivity
  const addSubActivity = () =>
    onChange([
      ...subActivities,
      {
        id: Date.now(),
        subActivityTitle: "",
        expectedAmount: "",
        expectedTime: "",
        instructions: [],
        checklist: [],
        resources: [],
      },
    ]);

  //  Function to delete a SubActivity
  const deleteSubActivity = (index) =>
    onChange(subActivities.filter((_, i) => i !== index));

  //  Function to update a specific SubActivity
  const updateSubActivity = (index, key, value) => {
    const updated = [...subActivities];
    updated[index] = { ...updated[index], [key]: value };
    onChange(updated);
  };

  //  Allow only alphabets and spaces (no leading space)
  const handleAlphaInput = (e, i, key) => {
    let val = e.target.value;
    if (val.startsWith(" ")) val = val.trimStart();
    if (/^[A-Za-z\s]*$/.test(val)) {
      updateSubActivity(i, key, val);
    }
  };

  return (
    <div className="space-y-4 border-orange-400 border-2 border-dashed rounded-xl p-2">
      {/*  Add Sub-Activity Button — Top Right */}
      <div className="flex justify-end mb-3">
        <button
          onClick={addSubActivity}
          className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 shadow-sm"
        >
          <PlusCircle size={18} /> Sub-Activity
        </button>
      </div>

      {/*  Sub-Activity List */}
      {subActivities.map((sa, i) => (
        <div
          key={sa.id || i}
          className="border border-indigo-300 bg-indigo-50 p-3 rounded-xl shadow-sm space-y-3"
        >
          <h4 className="text-indigo-700 font-semibold mb-2">
            Sub-Activity {i + 1} Details
          </h4>

          {/* <label className="block text-sm text-gray-700 mb-1">
            Sub-Activity Title
          </label> */}
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              placeholder={`Sub-Activity ${i + 1}`}
              value={sa.subActivityTitle}
              onChange={(e) => handleAlphaInput(e, i, "subActivityTitle")}
              className="border p-2 rounded-lg w-full font-medium"
            />
            <button onClick={() => deleteSubActivity(i)}>
              <Trash2 className="text-red-500 hover:text-red-700" size={18} />
            </button>
          </div>

          {/* <label className="block text-sm text-gray-700 mb-1 mt-3">
            Sub-Activity Description
          </label>
          <textarea
            placeholder="Sub-Activity Description"
            value={sa.description}
            onChange={(e) => handleAlphaInput(e, i, "description")}
            className="border border-gray-300 p-2 rounded-lg w-full mb-3"
          /> */}
          <SingleInputField
            label="Expected Amount"
            type="number"
            value={sa.expectedAmount}
            placeholder="Enter expected amount (₹)"
            onChange={(v) => updateSubActivity(i, "expectedAmount", v)}
          />

          <SingleInputField
            label="Expected Time"
            type="text"
            value={sa.expectedTime}
            placeholder="Enter expected time (e.g., 2 Hours)"
            onChange={(v) => updateSubActivity(i, "expectedTime", v)}
          />
          <ArrayInputSection
            title="Instructions"
            items={sa.instructions}
            onChange={(v) => updateSubActivity(i, "instructions", v)}
            color="yellow"
          />
          <ArrayInputSection
            title="Checklist"
            items={sa.checklist}
            onChange={(v) => updateSubActivity(i, "checklist", v)}
            color="green"
          />
          <ArrayInputSection
            title="Resources"
            type="resource"
            items={sa.resources}
            onChange={(v) => updateSubActivity(i, "resources", v)}
            color="blue"
          />
        </div>
      ))}
    </div>
  );
}
