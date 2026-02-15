export default function ProgressBar({ value, color }) {
  const barColors = {
    green: "bg-green-500",
    orange: "bg-orange-500",
    blue: "bg-blue-600",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
  }

  return (
    <div className="w-full h-2 bg-gray-200 rounded-full">
      <div
        className={`h-2 rounded-full ${barColors[color]}`}
        style={{ width: `${value}%` }}
      />
    </div>
  )
}
