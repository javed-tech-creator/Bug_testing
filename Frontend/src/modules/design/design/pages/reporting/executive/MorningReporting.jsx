import React from "react";
import { CalendarDays, ChevronDown, ChevronUp } from "lucide-react";
import { Calendar, AlertCircle, Layers } from "lucide-react";
import DesignSimpleHeader from "@/modules/design/components/designs/DesignSimpleHeader";
import { LiveClock } from "@/modules/design/components/navbar/LiveClock";

 const timeOptions = Array.from({ length: 17 }, (_, i) => {
  const half = i / 2;
  return half === Math.floor(half) ? half.toString() : half.toString();
}).slice(2); // 1 se 8 tak (0.5 steps)

const MorningReporting = () => {
  const designData = [
    {
      id: "DES-001",
      product: "Modular Kitchen",
      projects: "Kitchen",
      receivedDate: "12 Nov 2025",
      priority: "High",
      deadline: "20 Nov 2025",
    },
    {
      id: "DES-002",
      product: "Wardrobe Design",
      projects: "Wardrobe",
      receivedDate: "14 Nov 2025",
      priority: "Medium",
      deadline: "25 Nov 2025",
    },
    {
      id: "DES-003",
      product: "3D Elevation",
      projects: "Elevation",
      receivedDate: "10 Nov 2025",
      priority: "Low",
      deadline: "30 Nov 2025",
    },
    {
      id: "DES-004",
      product: "3D Elevation",
      projects: "Elevation",
      receivedDate: "10 Nov 2025",
      priority: "Low",
      deadline: "30 Nov 2025",
    },
  ];
  const [search, setSearch] = React.useState("");
  const [selectedDesigns, setSelectedDesigns] = React.useState([]);
  const [expandedId, setExpandedId] = React.useState(null);
  const [reports, setReports] = React.useState({});
  // const timeOptions = Array.from({ length: 8 }, (_, i) => i + 1);

  const filteredDesignData = designData.filter((item) =>
    `${item.product} ${item.id} ${item.projects}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const payload = selectedDesigns.map((d) => ({
    ...d,
    duration: reports[d.id]?.duration,
    remark: reports[d.id]?.remark,
  }));

  console.log(payload);

  
  return (
    <div className="px-5">
      <DesignSimpleHeader title="Morning Reporting" />

      <div className="bg-white border border-gray-200 rounded-md px-6 py-3 shadow-sm flex items-center justify-between">
        {/* LEFT : DATE */}
      {/* Date */}
              <div className="flex items-center gap-3 text-gray-700">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <CalendarDays className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Today's Date
                  </p>
                  <LiveClock size="sm" colorvalue={900} />
                </div>
              </div>

        {/* RIGHT : STATS */}
        <div className="flex items-center gap-10">
          <StatBlock value={designData.length} label="TOTAL LEADS" />

          <StatBlock value={selectedDesigns.length} label="SELECTED" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-5">
        {/* LEFT SIDE – DESIGN LIST */}
        <div className=" bg-white rounded-md border shadow-sm">
          {/* HEADER */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold text-lg">
              Design Tasks ({designData.length})
            </h2>

            <input
              type="text"
              placeholder="Search by product / ID / project"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-md px-3 py-1 text-sm outline-none w-56"
            />
          </div>

          {/* LIST */}
          <div className="max-h-[500px] overflow-y-auto divide-y">
            {filteredDesignData.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-6">
                No design found
              </p>
            )}

            {filteredDesignData.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedDesigns((prev) => {
                    const exists = prev.find((d) => d.id === item.id);

                    if (exists) {
                      // remove
                      const updated = prev.filter((d) => d.id !== item.id);
                      const newReports = { ...reports };
                      delete newReports[item.id];
                      setReports(newReports);
                      return updated;
                    } else {
                      // add
                      setReports((r) => ({
                        ...r,
                        [item.id]: { duration: "", remark: "" },
                      }));
                      return [...prev, item];
                    }
                  });
                }}
                className={`p-4 cursor-pointer transition flex justify-between gap-4
    ${
      selectedDesigns.some((d) => d.id === item.id)
        ? "bg-blue-50 border-l-4 border-blue-500"
        : "hover:bg-gray-50"
    }`}
              >
                {/* LEFT */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedDesigns.some((d) => d.id === item.id)}
                      readOnly
                    />

                    <h3 className="font-semibold">{item.product}</h3>
                  </div>

                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Design ID:</span> {item.id}
                  </p>

                  <p className="text-sm flex items-center gap-2 text-gray-600">
                    <Layers size={14} /> Projects: {item.projects}
                  </p>

                  <p className="text-sm flex items-center gap-2 text-gray-600">
                    <Calendar size={14} /> Received: {item.receivedDate}
                  </p>
                  <p className="text-sm flex items-center justify-end gap-2 text-gray-600">
                    <AlertCircle size={14} />
                    Deadline: {item.deadline}
                  </p>
                </div>

                {/* RIGHT */}
                <div className="text-right space-y-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                  ${
                    item.priority === "High"
                      ? "bg-red-100 text-red-700"
                      : item.priority === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                  >
                    {item.priority} Priority
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE – DETAILS / SUMMARY */}
        <div className="bg-white rounded-md border shadow-sm p-4 space-y-4">
          <h3 className="font-semibold text-lg border-b pb-4">
            Today's Plan ({selectedDesigns.length})
          </h3>

          <div className="max-h-[500px] overflow-y-auto">
            {selectedDesigns.length === 0 ? (
              <p className="text-sm text-gray-500">
                Select design tasks from left to add report
              </p>
            ) : (
              selectedDesigns.map((design) => (
                <div key={design.id} className="space-y-2">
                  {/* BASIC CARD */}
                  <div
                    onClick={() =>
                      setExpandedId(expandedId === design.id ? null : design.id)
                    }
                    className="border rounded-md p-4 cursor-pointer hover:bg-gray-50 mb-2"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">{design.product}</h4>
                        <p className="text-sm text-gray-600">
                          Design ID: {design.id}
                        </p>
                      </div>

                      <span className="text-blue-600">
                        {expandedId === design.id ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </span>
                    </div>
                  </div>

                  {/* EXPAND */}
                  {expandedId === design.id && (
                    <div className="border rounded-md p-4 bg-gray-50 space-y-4 mb-2">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Time Duration (Hours)
                        </label>

                        <select
                          value={reports[design.id]?.duration || ""}
                          onChange={(e) =>
                            setReports((r) => ({
                              ...r,
                              [design.id]: {
                                ...r[design.id],
                                duration: e.target.value,
                              },
                            }))
                          }
                          className="w-full border rounded-md px-3 py-2 text-sm mt-1 bg-white"
                        >
                          <option value="">Select hours</option>

                          {timeOptions.map((hour) => (
                            <option key={hour} value={hour}>
                              {hour} hour{hour > 1 ? "s" : ""}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Remark
                        </label>
                        <textarea
                          rows={3}
                          value={reports[design.id]?.remark || ""}
                          onChange={(e) =>
                            setReports((r) => ({
                              ...r,
                              [design.id]: {
                                ...r[design.id],
                                remark: e.target.value,
                              },
                            }))
                          }
                          className="w-full border rounded-md px-3 py-2 text-sm mt-1 resize-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-md px-6 py-3 shadow-sm flex items-center justify-between">
        <span className="">{selectedDesigns.length} Designs selected</span>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-sm font-medium transition cursor-pointer">
          Submit Report
        </button>
      </div>
    </div>
  );
};

export default MorningReporting;

/* ---------- Small Components ---------- */

function StatBlock({ value, label, highlight }) {
  return (
    <div className="text-center">
      <p
        className={`text-lg font-semibold ${
          highlight ? "text-gray-900" : "text-gray-800"
        }`}
      >
        {value}
      </p>
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
    </div>
  );
}
