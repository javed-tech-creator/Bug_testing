

import BeforeAfterMockup from "../../../components/project-list/project-modules/mockup/BeforeAfterMockup"
import MockupApprovalPanel from "../../../components/project-list/project-modules/mockup/MockupApprovalPanel"
import * as Icons from "lucide-react";
import { useNavigate } from "react-router-dom"

export default function MockupDetails() {

  const navigate = useNavigate()

  return (
    <div className=" min-h-screen space-y-6">

      {/* Header */}
      <div className="bg-white border rounded-lg p-4 flex items-center gap-3">
        <button className="text-xl cursor-pointer" onClick={() => navigate(-1)}>
          <Icons.ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold">Mockup Details</h1>
      </div>

      {/* Section */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="bg-blue-600 text-white px-4 py-3 font-semibold">
          ABC Mockup
        </div>

        <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BeforeAfterMockup />
          <MockupApprovalPanel/>
        </div>
      </div>

    </div>
  )
}
