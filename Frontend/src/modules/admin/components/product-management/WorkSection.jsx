import React, { useState } from "react";
import { PlusCircle, MinusCircle, Trash2 } from "lucide-react";
import TaskSection from "./TaskSection";
import ArrayInputSection from "./ArrayInputSection";
import SingleInputField from "./SingleInputField";

export default function WorkSection({ works = [], onChange }) {
  const [activeWork, setActiveWork] = useState(null);

  //  Add new work (added at the top)
  const handleAddWork = () => {
    const newWork = {
      workTitle: "",
      expectedAmount: "",
      expectedTime: "",
      instructions: [],
      checklist: [],
      resources: [],
      tasks: [],
    };
    onChange([...works, newWork]); // new work added on top
  };

  const handleDeleteWork = (index) => {
    onChange(works.filter((_, i) => i !== index));
  };

  const handleWorkChange = (i, key, value) => {
    const updated = [...works];
    updated[i] = { ...updated[i], [key]: value };
    onChange(updated);
  };

  const handleArrayChange = (i, key, value) => {
    const updated = [...works];
    updated[i][key] = value;
    onChange(updated);
  };

  //  Restrict to alphabets & spaces only
  const handleAlphaInput = (e, i, key) => {
    let val = e.target.value;
    if (val.startsWith(" ")) val = val.trimStart();
    if (/^[A-Za-z\s]*$/.test(val)) handleWorkChange(i, key, val);
  };

  return (
    <div className="relative border-orange-400 border-2 border-dashed rounded-md p-4">
      {/* Add Work Button — Top Right Corner */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleAddWork}
          className="flex items-center gap-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 shadow-md"
        >
          <PlusCircle size={18} /> Work
        </button>
      </div>

      {/* Work Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
        {works.map((work, i) => {
          const isActive = activeWork === i;
          return (
            <div
              key={i}
              className={`self-start border rounded-2xl p-4 bg-white shadow-sm transition-all duration-200 hover:shadow-md ${
                isActive ? "ring-2 ring-purple-400" : ""
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-indigo-700 text-base">
                  Work {i + 1} Details
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveWork(isActive ? null : i)}
                    className="text-purple-600 hover:text-purple-800"
                  >
                    {isActive ? (
                      <MinusCircle size={20} />
                    ) : (
                      <PlusCircle size={20} />
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteWork(i)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Work Title */}
              <div className="mb-3">
                {/* <label className="block text-sm text-gray-700 mb-1">
                  Work Title
                </label> */}
                <input
                  className="border p-2 rounded-lg w-full font-medium focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  placeholder={`Work ${i + 1}`}
                  value={work?.workTitle || ""}
                  onChange={(e) => handleAlphaInput(e, i, "workTitle")}
                />
              </div>

              {/* Description
              <div className="mb-3">
                <label className="block text-sm text-gray-700 mb-1">
                  Work Description
                </label>
                <textarea
                  placeholder="Work Description"
                  value={work?.description || ""}
                  onChange={(e) => handleAlphaInput(e, i, "description")}
                  className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
              </div> */}

              {/* Task Section (expandable) */}
              {isActive && (
                <div className="mt-3 space-y-3">
                  <SingleInputField
                    label="Expected Amount"
                    type="number"
                    value={work.expectedAmount}
                    placeholder="Enter expected amount (₹)"
                    onChange={(val) =>
                      handleWorkChange(i, "expectedAmount", val)
                    }
                  />

                  <SingleInputField
                    label="Expected Time"
                    type="text"
                    value={work.expectedTime}
                    placeholder="Enter expected time (e.g., 2 Hours)"
                   onChange={(val) => handleWorkChange(i, "expectedTime", val)}
                  />
                  {/* 🔥 ALWAYS VISIBLE FIELDS */}
                  <ArrayInputSection
                    title="Instructions"
                    type="text"
                    items={work.instructions}
                    onChange={(newItems) =>
                      handleArrayChange(i, "instructions", newItems)
                    }
                    color="yellow"
                  />

                  <ArrayInputSection
                    title="Checklist"
                    type="text"
                    items={work.checklist}
                    onChange={(newItems) =>
                      handleArrayChange(i, "checklist", newItems)
                    }
                    color="green"
                  />

                  <ArrayInputSection
                    title="Resources"
                    type="resource"
                    items={work.resources}
                    onChange={(newItems) =>
                      handleArrayChange(i, "resources", newItems)
                    }
                    color="blue"
                  />

                  <div className="mt-4">
                    <TaskSection
                      tasks={work.tasks}
                      onChange={(tasks) => handleWorkChange(i, "tasks", tasks)}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
