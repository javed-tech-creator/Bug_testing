export default function StepCard({ title, desc, status, time }) {
  const styles = {
    done: "border-green-500 bg-green-50",
    progress: "border-orange-500 bg-orange-50",
    pending: "border-gray-300 bg-gray-50 opacity-70",
  }

  const badge = {
    done: "✔ Completed",
    progress: "⏳ In progress",
    pending: "⏱ Pending",
  }

  return (
    <div className={`border-l-4 rounded-lg p-4 text-sm ${styles[status]}`}>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-gray-600 mt-1">{desc}</p>

      {time && (
        <p className="text-xs text-gray-500 mt-2">{time}</p>
      )}

      {status !== "done" && (
        <span className="inline-block mt-2 bg-white border px-2 py-1 text-xs rounded-full">
          {badge[status]}
        </span>
      )}
    </div>
  )
}
