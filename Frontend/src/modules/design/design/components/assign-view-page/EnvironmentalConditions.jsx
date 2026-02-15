export const LevelBadge = ({ value, selected }) => (
  <div
    className={`px-4 py-2 rounded-md text-sm font-medium border ${
      selected
        ? "bg-blue-100 text-blue-600 border-blue-200"
        : "bg-gray-100 text-gray-500"
    }`}
  >
    {value}
  </div>
);

  export const RenderLevel = ({ label, selected }) => (
    <div>
      <p className="text-sm font-medium mb-2">{label}</p>
      <div className="flex gap-3">
        {["High", "Medium", "Low"].map((lvl) => (
          <LevelBadge key={lvl} value={lvl} selected={lvl === selected} />
        ))}
      </div>
    </div>
  );

