import React, { useEffect, useState } from "react";
import { PlusCircle, Trash2, MinusCircle } from "lucide-react";
import ArrayInputSection from "./ArrayInputSection";
import SubActivitySection from "./SubActivitySection";
import SingleInputField from "./SingleInputField";

export default function ActivitySection({ activities = [], onChange }) {
  const [activeActivity, setActiveActivity] = useState(null);
  const [initialAdded, setInitialAdded] = useState(false);

  // Add a new activity
  const addActivity = () =>
    onChange([
      ...activities,
      {
        name: "",
        expectedAmount: "",
        expectedTime: "",
        subActivities: [],
        instructions: [],
        checklist: [],
        resources: [],
      },
    ]);

  // Add first activity auto on load
  useEffect(() => {
    if (!initialAdded && (!activities || activities.length === 0)) {
      addActivity();
      setInitialAdded(true);
    }
  }, [activities, initialAdded]);

  const deleteActivity = (index) =>
    onChange(activities.filter((_, i) => i !== index));

  const updateActivity = (index, key, value) => {
    const updated = [...activities];
    updated[index] = { ...updated[index], [key]: value };
    onChange(updated);
  };

  // Allow only alphabets & spaces
  const handleAlphaInput = (e, i, key) => {
    let val = e.target.value;

    if (val.startsWith(" ")) val = val.trimStart();
    if (/^[A-Za-z\s]*$/.test(val)) updateActivity(i, key, val);
  };

  return (
    <div className="space-y-4 border-green-600 border-2 border-dashed rounded-xl p-2">
      {/* Add Activity Button */}
      <div className="flex justify-end mb-3">
        <button
          onClick={addActivity}
          className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 shadow-sm"
        >
          <PlusCircle size={18} />
          Activity
        </button>
      </div>

      {/* ACTIVITY CARDS */}
      {activities.map((a, i) => {
        const isActive = activeActivity === i;

        return (
          <div
            key={i}
            className={`border border-blue-300 bg-blue-50 p-4 rounded-xl shadow-sm transition-all duration-200 ${
              isActive ? "ring-2 ring-blue-400" : ""
            }`}
          >
            <h3 className="font-semibold text-blue-700 mb-2">
              Activity {i + 1} Details
            </h3>

            {/* NAME FIELD */}
            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                placeholder={`Activity ${i + 1} Name`}
                value={a.name}
                onChange={(e) => handleAlphaInput(e, i, "name")}
                className="border p-2 rounded-lg w-full font-medium"
              />

              <button onClick={() => setActiveActivity(isActive ? null : i)}>
                {isActive ? (
                  <MinusCircle className="text-blue-600" size={20} />
                ) : (
                  <PlusCircle className="text-blue-600" size={20} />
                )}
              </button>

              <button onClick={() => deleteActivity(i)}>
                <Trash2
                  className="text-red-500 hover:text-red-700"
                  size={18}
                  title="Delete Activity"
                />
              </button>
            </div>

            {/* OPEN/CLOSE FIELDS */}
            {isActive && (
              <div className="mt-3 space-y-3">
                <SingleInputField
                  label="Expected Amount"
                  type="number"
                  value={a.expectedAmount}
                  placeholder="Enter expected amount (₹)"
                  onChange={(v) => updateActivity(i, "expectedAmount", v)}
                />

                <SingleInputField
                  label="Expected Time"
                  type="text"
                  value={a.expectedTime}
                  placeholder="Enter expected time (e.g., 2 Hours)"
                  onChange={(v) => updateActivity(i, "expectedTime", v)}
                />

                {/*  ALWAYS VISIBLE FIELDS */}
                <ArrayInputSection
                  title="Instructions"
                  type="text"
                  items={a.instructions}
                  onChange={(v) => updateActivity(i, "instructions", v)}
                  color="yellow"
                />

                <ArrayInputSection
                  title="Checklist"
                  type="text"
                  items={a.checklist}
                  onChange={(v) => updateActivity(i, "checklist", v)}
                  color="green"
                />

                <ArrayInputSection
                  title="Resources"
                  type="resource"
                  items={a.resources}
                  onChange={(v) => updateActivity(i, "resources", v)}
                  color="blue"
                />

                {/*  SUB-ACTIVITY ADD BUTTON AT BOTTOM */}
                <div className="mt-4">
                  <SubActivitySection
                    subActivities={a.subActivities}
                    onChange={(v) => updateActivity(i, "subActivities", v)}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
