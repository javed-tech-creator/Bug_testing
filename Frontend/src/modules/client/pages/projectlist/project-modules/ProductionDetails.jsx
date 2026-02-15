import StepCard from "../../../components/project-list/project-modules/production/StepCard"
import * as Icons from "lucide-react";
import { useNavigate } from "react-router-dom"

export default function ProductionDetails() {

  const navigate = useNavigate()

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-white border rounded-lg p-4 flex items-center gap-3">
        <button className="text-xl cursor-pointer" onClick={() => navigate(-1)}>
          <Icons.ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold">Production Details</h1>
      </div>

      {/* Top Info Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Current Step */}
        <div className="bg-white border-l-4 border-orange-500 rounded-lg p-4">
          <p className="text-sm text-gray-500">Current step</p>
          <h2 className="text-lg font-semibold mt-1">Fabrication Started</h2>
          <span className="inline-block mt-2 bg-orange-100 text-orange-600 text-xs px-3 py-1 rounded-full">
            ⏳ In progress
          </span>
        </div>

        {/* Summary */}
        <div className="bg-white border-l-4 border-blue-500 rounded-lg p-4">
          <p className="text-sm text-gray-500">Production summary</p>
          <p className="text-sm text-gray-700 mt-1">
            All materials are in stock and fabrication work is underway at the factory.
            All materials are in stock and fabrication work is underway at the factory.
          </p>
        </div>

      </div>

      {/* Step-by-step Progress */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="bg-blue-600 text-white px-4 py-3 font-semibold">
          Step-by-step progress
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StepCard
            title="Job Card Created"
            desc="Your order details have been shared with the production team."
            status="done"
            time="Completed on Oct 10, 10:15 AM"
          />
          <StepCard
            title="Material Procured"
            desc="All required materials are ready at the factory."
            status="done"
            time="Completed on Oct 11, 02:15 PM"
          />
          <StepCard
            title="Fabrication Started"
            desc="Our team is currently building your signage."
            status="progress"
          />
          <StepCard
            title="QC Done"
            desc="Final quality checks and finishing will be done next."
            status="pending"
          />
        </div>
      </div>

    </div>
  )
}
