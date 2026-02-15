import ActiveProjectCard from "./ActiveProjectCard"

const projects = [
  { title: "HQ Signage Revamp", status: "Production", progress: 75 },
  { title: "Retail Store Branding", status: "Completed", progress: 100 },
  { title: "Lobby Wayfinding", status: "Production", progress: 100 },
  { title: "HQ Signage Revamp", status: "Production", progress: 75 },
  { title: "Retail Store Branding", status: "Design", progress: 50 },
  { title: "Lobby Wayfinding", status: "Production", progress: 100 },
]

export default function ActiveProjects() {
  return (
    <div className="bg-white rounded-lg border h-full flex flex-col">
      <div className="bg-blue-600 text-white px-4 py-3 font-semibold rounded-t-lg">
        Active Projects
      </div>

    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">

        {projects.map((p, i) => (
          <ActiveProjectCard key={i} {...p} />
        ))}
      </div>
    </div>
  )
}
