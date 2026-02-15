import React, { useEffect, useState } from "react";
import { PlusCircle, MinusCircle, Trash2 } from "lucide-react";
import SubTaskSection from "./SubTaskSection";
import ActivitySection from "./ActivitySection";
import ArrayInputSection from "./ArrayInputSection";
import SingleInputField from "./SingleInputField";

export default function TaskSection({ tasks = [], onChange }) {
  const [activeTask, setActiveTask] = useState(null);

  useEffect(() => {
    if (tasks?.length > 0) {
      const updatedTasks = tasks.map((t) => {
        if (t.subTasks?.length > 0) return { ...t, type: "subtask" };
        if (t.activities?.length > 0) return { ...t, type: "activity" };
        return t;
      });
      if (JSON.stringify(updatedTasks) !== JSON.stringify(tasks)) {
        onChange(updatedTasks);
      }

      // const firstFilledIndex = updatedTasks.findIndex(
      //   (t) =>
      //     (t.subTasks && t.subTasks.length > 0) ||
      //     (t.activities && t.activities.length > 0)
      // );
      // if (firstFilledIndex !== -1) setActiveTask(firstFilledIndex);
      // else setActiveTask(0);
    }
  }, [tasks]);

  const addTask = () => {
    const newTask = {
      taskTitle: "",
      type: "",
      expectedAmount: "",
      expectedTime: "",
      instructions: [],
      checklist: [],
      resources: [],
      subTasks: [],
      activities: [],
    };
    onChange([...tasks, newTask]);
    // setActiveTask(tasks.length);
  };

  const handleTaskChange = (i, key, val) => {
    const updated = [...tasks];
    updated[i] = { ...updated[i], [key]: val };
    onChange(updated);
  };

  const handleAlphaInput = (e, index, key) => {
    let val = e.target.value;
    if (val.startsWith(" ")) val = val.trimStart();
    if (/^[A-Za-z\s]*$/.test(val)) {
      handleTaskChange(index, key, val);
    }
  };

  const delTask = (i) => onChange(tasks.filter((_, idx) => idx !== i));

  return (
    <div className="relative space-y-4 border-green-600 border-2 border-dashed rounded-xl p-1">
      {/* Add Task Button — top right corner */}
      <div className="flex justify-end mb-2">
        <button
          onClick={addTask}
          className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 shadow-sm"
        >
          <PlusCircle size={18} />
          Task
        </button>
      </div>

      {tasks.map((task, i) => {
        const isActive = activeTask === i;
        return (
          <div
            key={i}
            className={`border rounded-xl p-4 bg-gray-50 transition-all duration-200 ${
              isActive ? "ring-2 ring-indigo-400" : ""
            }`}
          >
            <h3 className="font-semibold text-indigo-700 mb-2">
              Task {i + 1} Details
            </h3>
            {/* <label className="block text-sm text-gray-700 mb-1">
              Task Title
            </label> */}
            <div className="flex justify-between items-center mb-2">
              <input
                type="text"
                className="border p-2 rounded-lg w-full"
                placeholder={`Task ${i + 1}`}
                value={task.taskTitle}
                onChange={(e) => handleAlphaInput(e, i, "taskTitle")}
              />
              <div className="flex gap-2 ml-2">
                <button onClick={() => setActiveTask(isActive ? null : i)}>
                  {isActive ? (
                    <MinusCircle className="text-indigo-600" />
                  ) : (
                    <PlusCircle className="text-indigo-600" />
                  )}
                </button>
                <button onClick={() => delTask(i)}>
                  <Trash2 className="text-red-500" />
                </button>
              </div>
            </div>

            {isActive && (
              <div className="mt-3 space-y-3">
                <SingleInputField
                  label="Expected Amount"
                  type="number"
                  value={task.expectedAmount}
                  placeholder="Enter expected amount (₹)"
                  onChange={(v) => handleTaskChange(i, "expectedAmount", v)}
                />

                <SingleInputField
                  label="Expected Time"
                  type="text"
                  value={task.expectedTime}
                  placeholder="Enter expected time (e.g., 2 Hours)"
                  onChange={(v) => handleTaskChange(i, "expectedTime", v)}
                />
                {/* ✔ Instructions */}
                <ArrayInputSection
                  title="Instructions"
                  type="text"
                  items={task.instructions || []}
                  onChange={(v) => handleTaskChange(i, "instructions", v)}
                  color="yellow"
                />

                {/* ✔ Checklist */}
                <ArrayInputSection
                  title="Checklist"
                  type="text"
                  items={task.checklist || []}
                  onChange={(v) => handleTaskChange(i, "checklist", v)}
                  color="green"
                />

                {/* ✔ Resources */}
                <ArrayInputSection
                  title="Resources"
                  type="resource"
                  items={task.resources || []}
                  onChange={(v) => handleTaskChange(i, "resources", v)}
                  color="blue"
                />

                {/* --- Existing Type Selection Buttons --- */}
                {!task.type && (
                  <div className="flex gap-3 justify-end">
                    <button
                      className="flex items-center gap-1 bg-blue-600 text-white px-2.5 py-1.5 rounded-lg hover:bg-blue-700"
                      onClick={() => handleTaskChange(i, "type", "subtask")}
                    >
                      <PlusCircle size={18} /> SubTask
                    </button>
                    <button
                      className="flex items-center gap-1 bg-green-600 text-white px-2.5 py-1.5 rounded-lg hover:bg-green-700"
                      onClick={() => handleTaskChange(i, "type", "activity")}
                    >
                      <PlusCircle size={18} /> Activity
                    </button>
                  </div>
                )}

                {task.type === "subtask" && (
                  <SubTaskSection
                    subTasks={task.subTasks}
                    onChange={(v) => handleTaskChange(i, "subTasks", v)}
                  />
                )}

                {task.type === "activity" && (
                  <ActivitySection
                    activities={task.activities}
                    onChange={(v) => handleTaskChange(i, "activities", v)}
                  />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
