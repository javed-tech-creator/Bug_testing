const STATUS_CONFIG = {
  completed: {
    wrapper: "bg-green-50 text-green-700 border border-green-200",
    dot: "bg-green-500",
    label: "✓ Completed",
  },
  pending: {
    wrapper: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    dot: "bg-yellow-500 animate-pulse",
    label: "⏳ Pending",
  },
  rejected: {
    wrapper: "bg-red-50 text-red-700 border border-red-200",
    dot: "bg-red-500",
    label: "✕ Rejected",
  },
  "in-progress": {
    wrapper: "bg-blue-50 text-blue-700 border border-blue-200",
    dot: "bg-blue-500",
    label: "▶ In Progress",
  },
};

const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG["in-progress"];

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg ${config.wrapper}`}
    >
      <span className={`w-2 h-2 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
