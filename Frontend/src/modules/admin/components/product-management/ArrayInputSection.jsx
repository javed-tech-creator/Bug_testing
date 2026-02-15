import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

export default function ArrayInputSection({
  title,
  items = [],
  onChange,
  color,
  type, // ← NEW: "text" for checklist/instruction, "resource" for resources
}) {
  const add = () => {
    if (type === "resource") {
      onChange([
        ...items,
        { title: "", link: "", files: [], selectedFile: null },
      ]);
    } else {
      onChange([...items, ""]);
    }
  };

  const del = (i) => onChange(items.filter((_, idx) => idx !== i));

  // Restrict only alphabets & spaces
  const handleAlphaInput = (e, i) => {
    if (type === "resource") return; // resources do not use alpha restriction

    let val = e.target.value;
    if (val.startsWith(" ")) val = val.trimStart();
    if (/^[A-Za-z\s]*$/.test(val)) {
      const updated = [...items];
      updated[i] = val;
      onChange(updated);
    }
  };

  // For resource fields
  const handleResourceChange = (i, field, value) => {
    const updated = [...items];
    updated[i][field] = value;
    onChange(updated);
  };

  // File selector
  const handleFileSelect = (e, i) => {
    const file = e.target.files?.[0] || null;
    const updated = [...items];
    updated[i].file = file;
    onChange(updated);
  };

  // Tailwind colors
  const colorMap = {
    yellow: {
      focus: "focus:ring-yellow-400 border-yellow-300",
      text: "text-yellow-700",
      bg: "bg-yellow-100 hover:bg-yellow-200",
      icon: "text-yellow-600 hover:text-yellow-800",
    },
    green: {
      focus: "focus:ring-green-400 border-green-300",
      text: "text-green-700",
      bg: "bg-green-100 hover:bg-green-200",
      icon: "text-green-600 hover:text-green-800",
    },
    blue: {
      focus: "focus:ring-blue-400 border-blue-300",
      text: "text-blue-700",
      bg: "bg-blue-100 hover:bg-blue-200",
      icon: "text-blue-600 hover:text-blue-800",
    },
  };
  const colorClasses = colorMap[color] || colorMap.blue;

  return (
    <div className="border rounded-xl p-3 bg-gray-50">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium text-gray-800">{title}</h4>
        {items.length > 0 && (
          <button onClick={add} className={`${colorClasses.icon} transition`}>
            <Plus size={20} />
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <button
          onClick={add}
          className={`flex items-center gap-2 text-sm font-medium ${colorClasses.text} ${colorClasses.bg} px-3 py-2 rounded-lg transition`}
        >
          <Plus size={16} /> Add {title}
        </button>
      ) : (
        <div className="space-y-3">
          {items.map((it, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-3"
            >
              <div className="flex justify-between">
                <span className="font-medium text-blue-700">{i + 1}.</span>

                <button
                  onClick={() => del(i)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {type !== "resource" ? (
                // ---------------- TEXT LIST (instructions / checklist)
                <input
                  type="text"
                  placeholder={`Enter ${title} ${i + 1}`}
                  value={it}
                  onChange={(e) => handleAlphaInput(e, i)}
                  className={`w-full mt-2 p-2 rounded-lg border ${colorClasses.focus} focus:ring-2`}
                />
              ) : (
                // ---------------- RESOURCE FIELDS
                <div className="space-y-3 mt-2">
                  {/* Title */}
                  <input
                    type="text"
                    placeholder={`Enter resource title ${i + 1}`}
                    value={it.title}
                    onChange={(e) =>
                      handleResourceChange(i, "title", e.target.value)
                    }
                    className="w-full p-2 rounded-lg border border-gray-300"
                  />

                  {/* Link */}
                  <input
                    type="text"
                    placeholder="Resource Link / URL"
                    value={it.link}
                    onChange={(e) =>
                      handleResourceChange(i, "link", e.target.value)
                    }
                    className="w-full p-2 rounded-lg border border-gray-300"
                  />

                  {/* File Input + Add Button */}
                  <div className="flex items-center gap-3 mt-2">
                    {/* File Select Box */}
                    <div className="flex-1">
                      <label className="block">
                        <span className="text-sm font-medium text-gray-700">
                          Select File
                        </span>

                        <div className="mt-1 flex items-center gap-3">
                          <label
                            className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-300 
      rounded-lg cursor-pointer hover:bg-gray-100 transition shadow-sm"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-5 h-5 text-gray-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="2"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 16v-8m-4 4h8m5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span className="text-sm text-gray-700">
                              Choose File
                            </span>

                            <input
                              type="file"
                              accept="image/*,video/*,application/pdf"
                              onChange={(e) =>
                                handleResourceChange(
                                  i,
                                  "selectedFile",
                                  e.target.files?.[0] || null
                                )
                              }
                              className="hidden"
                            />
                          </label>

                          {/* Selected file name */}
                          <span className="text-sm text-gray-600 italic truncate max-w-[180px]">
                            {it?.selectedFile?.name || "No file chosen"}
                          </span>
                        </div>
                      </label>
                    </div>

                    {/* Add File Button */}
                    <button
                      type="button"
                      // disabled={
                      //   (it.files?.length || 0) >= 10 || !it.selectedFile
                      // }
                      onClick={() => {
                        const updatedFiles = [...(it.files || [])];

                        if (updatedFiles.length < 10 && it.selectedFile) {
                          updatedFiles.push(it.selectedFile);
                          handleResourceChange(i, "files", updatedFiles);
                          handleResourceChange(i, "selectedFile", null);
                        } else {
                          handleResourceChange(i, "selectedFile", null);
                          toast.warn("Only 10 files are allowed !");
                        }
                      }}
                      className={`h-9 w-20 px-4 mt-6 rounded-lg font-medium flex items-center justify-center 
                transition-all shadow-sm bg-blue-600 text-white hover:bg-blue-700
                }`}
                    >
                      Add
                    </button>
                  </div>

                  {/* File List */}
                  {it.files && it.files.length > 0 && (
                    <div className="space-y-2 mt-3">
                      {it.files.map((f, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-white border border-gray-200 
                   rounded-xl px-4 py-2 shadow-sm hover:bg-gray-50 transition"
                        >
                          {/* File name + icon */}
                          <div className="flex items-center gap-2">
                            <svg
                              className="w-5 h-5 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14 2v6h6"
                              />
                            </svg>

                            <span className="text-sm font-medium text-gray-700">
                              {f.name}
                            </span>
                          </div>

                          {/* Remove Button */}
                          <button
                            type="button"
                            onClick={() => {
                              const updatedFiles = it.files.filter(
                                (_, i2) => i2 !== idx
                              );
                              handleResourceChange(i, "files", updatedFiles);
                            }}
                            className="w-8 h-8 rounded-full flex items-center justify-center 
                     bg-red-100 text-red-600 hover:bg-red-200 transition"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
