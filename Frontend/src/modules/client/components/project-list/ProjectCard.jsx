import ProgressBar from "./ProgressBar"
import { useNavigate } from "react-router-dom"
export default function ProjectCard({
  title,
  location,
  products,
  stage,
  progress,
  color,
}) {
  const navigate = useNavigate()
  const badgeStyles = {
    green: "bg-green-100 text-green-600",
    orange: "bg-orange-100 text-orange-600",
    blue: "bg-blue-100 text-blue-600",
    yellow: "bg-yellow-100 text-yellow-600",
    red: "bg-red-100 text-red-600",
  }

  return (
    <div className="bg-white border rounded-lg p-4">

      {/* Top */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-semibold text-sm">{title}</h2>
          <div className="text-[10px] text-gray-500 mt-1 flex gap-4">
            <span>📍 {location}</span>
            <span>📦 {products} Products</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`text-[10px] px-3 py-1 rounded-full ${badgeStyles[color]}`}
          >
            Current Stage: {stage}
          </span>

          <button onClick={() => navigate(`project/24`)} className="bg-blue-600 text-white px-3 py-1 rounded-md text-[10px] cursor-pointer">
            View Project
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Completion</span>
          <span className={`font-medium text-${color}-600`}>
            {progress}%
          </span>
        </div>

        <ProgressBar value={progress} color={color} />
      </div>
    </div>
  )
}
