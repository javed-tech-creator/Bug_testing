import ProgressBar from "./ProgressBar"

const statusStyles = {
  Production: "bg-blue-100 text-blue-600",
  Completed: "bg-green-100 text-green-600",
  Design: "bg-yellow-100 text-yellow-600",
}

export default function ProjectCard({ title, status, progress }) {
  return (
    <div className="border rounded-lg p-4 bg-white">
      <h3 className="font-medium text-sm mb-2">{title}</h3>

      <span
        className={`text-xs px-2 py-1 rounded-full ${statusStyles[status]}`}
      >
        {status}
      </span>

      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Completion</span>
          <span>{progress}%</span>
        </div>

        <ProgressBar value={progress} />
      </div>
    </div>
  )
}
