import { useState } from "react"
import ProjectCard from "../../components/project-list/ProjectCard"
import Tabs from "../../components/project-list/Tabs"
import * as Icons from "lucide-react";
import { useNavigate } from "react-router-dom"

const allProjects = [
  {
    id: 1,
    title: "Retail Store Branding",
    location: "New York, NY",
    products: 17,
    stage: "Completed",
    status: "Completed",
    progress: 100,
    color: "green",
  },
  {
    id: 2,
    title: "Hotel Grand Entry",
    location: "Mumbai, MH",
    products: 12,
    stage: "Production",
    status: "Active",
    progress: 75,
    color: "orange",
  },
  {
    id: 3,
    title: "Corporate Office Tower",
    location: "Bangalore, KA",
    products: 25,
    stage: "Completed",
    status: "Completed",
    progress: 100,
    color: "green",
  },
  {
    id: 4,
    title: "Shopping Mall Facade",
    location: "Delhi, DL",
    products: 18,
    stage: "Production",
    status: "Active",
    progress: 45,
    color: "blue",
  },
  {
    id: 5,
    title: "Restaurant Interior",
    location: "Pune, MH",
    products: 8,
    stage: "Pending",
    status: "Pending",
    progress: 30,
    color: "yellow",
  },
  {
    id: 6,
    title: "Airport Terminal Signage",
    location: "Chennai, TN",
    products: 22,
    stage: "Lost",
    status: "Lost",
    progress: 0,
    color: "red",
  },
]

export default function ProjectList() {
  const [activeFilter, setActiveFilter] = useState("All Projects")
  const [searchText, setSearchText] = useState("")
  const navigate = useNavigate()

  let filteredProjects = activeFilter === "All Projects" 
    ? allProjects 
    : allProjects.filter(p => p.status === activeFilter)

  // Apply search filter
  if (searchText.trim()) {
    filteredProjects = filteredProjects.filter(p =>
      p.title.toLowerCase().includes(searchText.toLowerCase()) ||
      p.location.toLowerCase().includes(searchText.toLowerCase())
    )
  }

  return (
    <div className="">

      {/* Header */}
      <div className="bg-white rounded-lg border p-4 mb-4 flex items-center gap-4">
        <button className="text-xl cursor-pointer" onClick={() => navigate(-1)}>
          <Icons.ArrowLeft  size={20} />
        </button>
        <h1 className="text-lg font-semibold">Project List</h1>

        <div className="ml-auto flex items-center gap-3">
          <input
            type="text"
            placeholder="Search by title or location"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm bg-gray-100 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <Tabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      </div>

      {/* Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((p, i) => (
            <ProjectCard key={i} {...p} />
          ))
        ) : (
          <div className="col-span-full bg-white rounded-lg border p-8 text-center">
            <p className="text-gray-500">No projects found</p>
          </div>
        )}
      </div>
    </div>
  )
}
