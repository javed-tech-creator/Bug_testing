import React, { useEffect, useState } from "react";
import { PlusCircle, Trash2, MinusCircle } from "lucide-react";
import ActivitySection from "./ActivitySection";
import ArrayInputSection from "./ArrayInputSection";
import SingleInputField from "./SingleInputField";

export default function SubTaskSection({ subTasks = [], onChange }) {
  const [activeSubTask, setActiveSubTask] = useState(null);
  const [initialAdded, setInitialAdded] = useState(false);

  const addSubTask = () => {
    const newSubTask = {
      subTaskTitle: "",
      type: "",
       expectedAmount: "",
      expectedTime: "",
      instructions: [],
      checklist: [],
      resources: [],
      activities: [],
    };
    onChange([...subTasks, newSubTask]);
  };

  useEffect(() => {
    if (!initialAdded && (!subTasks || subTasks.length === 0)) {
      addSubTask();
      setInitialAdded(true);
    }
  }, [subTasks, initialAdded]);

  const deleteSubTask = (index) =>
    onChange(subTasks.filter((_, i) => i !== index));

  const updateSubTask = (index, key, value) => {
    const updated = [...subTasks];
    updated[index] = { ...updated[index], [key]: value };
    onChange(updated);
  };

  const handleAlphaInput = (e, i, key) => {
    let val = e.target.value;
    if (val.startsWith(" ")) val = val.trimStart();
    if (/^[A-Za-z\s]*$/.test(val)) updateSubTask(i, key, val);
  };

  return (
    <div className="relative space-y-4 border-orange-400 border-2 border-dashed rounded-xl p-1">

      {/* 🔹 Add SubTask Button — Top Right */}
      <div className="absolute top-1 right-0">
        <button
          onClick={addSubTask}
          className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 shadow-md"
        >
          <PlusCircle size={18} /> SubTask
        </button>
      </div>

      <div className="pt-12 space-y-4">
        {subTasks.map((st, i) => {
          const isActive = activeSubTask === i;

          return (
            <div
              key={i}
              className="border-2 border-indigo-300 bg-indigo-50 p-3 rounded-xl shadow-sm"
            >
              <h3 className="font-semibold text-indigo-700 mb-2">
                Sub-Task {i + 1} Details
              </h3>

              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder={`SubTask ${i + 1}`}
                  value={st.subTaskTitle}
                  onChange={(e) =>
                    handleAlphaInput(e, i, "subTaskTitle")
                  }
                  className="border p-2 rounded-lg w-full font-medium"
                />

                <div className="flex gap-2">
                  <button onClick={() => setActiveSubTask(isActive ? null : i)}>
                    {isActive ? (
                      <MinusCircle className="text-indigo-600" />
                    ) : (
                      <PlusCircle className="text-indigo-600" />
                    )}
                  </button>

                  <button onClick={() => deleteSubTask(i)}>
                    <Trash2 className="text-red-500" />
                  </button>
                </div>
              </div>

              {/* Expanded */}
              {isActive && (
                <div className="mt-2 space-y-3">

                    <SingleInputField
                  label="Expected Amount"
                  type="number"
                  value={st.expectedAmount}
                  placeholder="Enter expected amount (₹)"
                  onChange={(v) => updateSubTask(i, "expectedAmount", v)}
                />

                <SingleInputField
                  label="Expected Time"
                  type="text"
                  value={st.expectedTime}
                  placeholder="Enter expected time (e.g., 2 Hours)"
                  onChange={(v) => updateSubTask(i, "expectedTime", v)}
                />

                  {/*  Instructions */}
                  <ArrayInputSection
                    title="Instructions"
                    type="text"
                    items={st.instructions}
                    onChange={(v) =>
                      updateSubTask(i, "instructions", v)
                    }
                    color="yellow"
                  />

                  {/*  Checklist */}
                  <ArrayInputSection
                    title="Checklist"
                    type="text"
                    items={st.checklist}
                    onChange={(v) =>
                      updateSubTask(i, "checklist", v)
                    }
                    color="green"
                  />

                  {/*  Resources */}
                  <ArrayInputSection
                    title="Resources"
                    type="resource"
                    items={st.resources}
                    onChange={(v) =>
                      updateSubTask(i, "resources", v)
                    }
                    color="blue"
                  />

                  {/* Activity Button */}
                  {!st.type && st.activities?.length === 0 && (
                    <div className="flex justify-end">
                      <button
                        onClick={() =>
                          updateSubTask(i, "type", "activity")
                        }
                        className="flex items-center gap-1 bg-blue-600 text-white px-2.5 py-1.5 rounded-lg hover:bg-blue-700"
                      >
                        <PlusCircle size={18} /> Activity
                      </button>
                    </div>
                  )}

                  {(st.type === "activity" || st.activities?.length > 0) && (
                    <ActivitySection
                      activities={st.activities}
                      onChange={(v) => updateSubTask(i, "activities", v)}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
