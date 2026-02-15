export default function SummaryCard({ title, amount, footer, color }) {
  const borderMap = {
    blue: "border-blue-500",
    green: "border-green-500",
    orange: "border-orange-500",
  }

  return (
    <div className={`bg-white border rounded-lg p-4 ${borderMap[color]}`}>
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-xl font-semibold mt-1">{amount}</h2>
      <p className={`text-xs text-${color}-400 mt-1`}>{footer}</p>
    </div>
  )
}
