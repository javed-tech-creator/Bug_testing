export function StatCard({ label, value, Icon, styles = {} }) {
  const defaultStyles = {
    border: "border-blue-500",
    text: "text-blue-600",
    iconBg: "bg-blue-100",
    iconText: "text-blue-600",
    bg: "bg-white",
  }

  const merged = { ...defaultStyles, ...styles }

  return (
    <div
      className={`rounded-lg border p-4 min-h-[120px]
        ${merged.border} ${merged.bg}`}
    >
      {/* Icon */}
      <div
        className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full ${merged.iconBg}`}
      >
        {Icon && <Icon className={`h-5 w-5 ${merged.iconText}`} />}
      </div>

      {/* Value */}
      <div className={`text-md font-bold ${merged.text}`}>
        {value}
      </div>

      {/* Label */}
      <p className="text-[12px] font-semibold text-black">{label}</p>
    </div>
  )
}
