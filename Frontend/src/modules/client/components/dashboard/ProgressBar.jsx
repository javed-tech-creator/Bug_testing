export default function ProgressBar({ value }) {
  return (
    <div className="w-full h-2 bg-gray-200 rounded-full">
      <div
        className={`h-2 rounded-full ${
          value === 100 ? "bg-green-500" : value >= 75 ? "bg-blue-600" : "bg-orange-500"
        }`}
        style={{ width: `${value}%` }}
      />
    </div>
  )
}
