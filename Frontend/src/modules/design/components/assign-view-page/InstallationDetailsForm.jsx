export const LabelBlock = ({ label, value }) => (
  <div className="space-y-1 mt-1">
    <p className="text-xs font-semibold text-black ">{label}</p>
    <div className="border rounded px-3 py-2 bg-gray-50 text-sm">{value}</div>
  </div>
);

export const YesNo = ({ label = "", value }) => (
  <div className="flex flex-col gap-1">
    {/* Label */}
    <span className="text-xs font-semibold text-gray-900">
      {label}
    </span>

    {/* Yes / No */}
    <div className="flex gap-2 mt-1">
      <span
        className={`px-3 py-1 text-xs rounded border ${
          value
            ? "bg-blue-600 text-white border-blue-600"
            : "bg-white text-gray-500"
        }`}
      >
        Yes
      </span>

      <span
        className={`px-3 py-1 text-xs rounded border ${
          !value
            ? "bg-blue-600 text-white border-blue-600"
            : "bg-white text-gray-500"
        }`}
      >
        No
      </span>
    </div>
  </div>
);


