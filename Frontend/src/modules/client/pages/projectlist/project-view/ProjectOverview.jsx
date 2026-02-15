import ProjectHeader from "../../../components/project-list/project-view/ProjectHeader"
import DetailCard from "../../../components/project-list/project-view/DetailCard"
import { useNavigate } from "react-router-dom"
import * as Icons from "lucide-react";

export default function ProjectOverview() {
  const navigate = useNavigate()
  return (
    <div className="space-y-6">

      <div className="bg-white rounded-lg border p-4 mb-4 flex items-center gap-4">
        <button className="text-xl cursor-pointer" onClick={() => navigate(-1)}>
          <Icons.ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold">Project Overview</h1>
      </div>
      {/* Header */}
      <ProjectHeader />

      {/* Modules Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <DetailCard onClick={() => navigate(`sales`)} title="Sales Details" icon="📁" />
        <DetailCard onClick={() => navigate(`recce`)} title="Recce Details" icon="📏" />
        <DetailCard onClick={() => navigate(`design`)} title="Design Details" icon="🎨" />
        <DetailCard onClick={() => navigate(`mockup`)} title="Mockup Details" icon="🧩" />
        <DetailCard onClick={() => navigate(`quotation`)}  title="Quotation Details" icon="📄" />
        <DetailCard onClick={() => navigate(`production`)} title="Production Details" icon="🏭" />
        <DetailCard onClick={() => navigate(`installation`)} title="Installation Details" icon="🛠️" />
        <DetailCard onClick={() => navigate(`/client/payments`)} title="Payments Details" icon="💳" />
        <DetailCard onClick={() => navigate(`/client/documents`)} title="Documents Details" icon="📂" />
        <DetailCard onClick={() => navigate(`/client/discussions`)} title="Discussions" icon="💬" />
      </div>

    </div>
  )
}
