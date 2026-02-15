import { useState, useEffect, useRef } from "react";
import * as Icons from "lucide-react";

export function ProjectCard() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState({
    name: "Hotel Grand Entry",
    id: "#PRJ-2024-014",
    status: "Quotation in progress"
  });
  const dropdownRef = useRef(null);

  const projects = [
    { name: "Hotel Grand Entry", id: "#PRJ-2024-014", status: "Quotation in progress" },
    { name: "Corporate Office Tower", id: "#PRJ-2024-013", status: "Design in progress" },
    { name: "Shopping Mall Facade", id: "#PRJ-2024-012", status: "Production in progress" },
    { name: "Residential Complex", id: "#PRJ-2024-011", status: "Installation in progress" },
    { name: "Restaurant Interior", id: "#PRJ-2024-010", status: "Recce in progress" },
    { name: "Airport Terminal Signage", id: "#PRJ-2024-009", status: "Mockup in progress" },
    { name: "Luxury Villa Entrance", id: "#PRJ-2024-008", status: "Sales in progress" },
    { name: "Tech Park Lobby", id: "#PRJ-2024-007", status: "Production in progress" },
    { name: "Hospital Wayfinding", id: "#PRJ-2024-006", status: "Installation in progress" },
    { name: "Retail Store Branding", id: "#PRJ-2024-005", status: "Design in progress" },
    { name: "Educational Campus", id: "#PRJ-2024-004", status: "Quotation in progress" },
    { name: "Sports Complex Signage", id: "#PRJ-2024-003", status: "Recce in progress" },
    { name: "Convention Center", id: "#PRJ-2024-002", status: "Mockup in progress" },
    { name: "Hotel Lobby Renovation", id: "#PRJ-2024-001", status: "Production in progress" },
  ];

  const steps = [
    "Sales",
    "Recce",
    "Design",
    "Mockup",
    "Quotation",
    "Production",
    "Installation",
  ];

  // Function to get current step index from status
  const getCurrentStepIndex = (status) => {
    const statusMap = {
      "Sales in progress": 0,
      "Recce in progress": 1,
      "Design in progress": 2,
      "Mockup in progress": 3,
      "Quotation in progress": 4,
      "Production in progress": 5,
      "Installation in progress": 6,
    };
    return statusMap[status] ?? 0;
  };

  // Calculate progress percentage
  const currentStepIndex = getCurrentStepIndex(selectedProject.status);
  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <div>
          <h2 className="font-semibold">
            {selectedProject.name} {selectedProject.id}
          </h2>
          <span className="inline-block mt-1 bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full">
            ⏳ Current: {selectedProject.status}
          </span>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex justify-center align-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-md text-sm"
          >
            <Icons.Briefcase size={20} /> Project <Icons.ChevronDown size={16} />
          </button>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-60 border border-gray-100 overflow-hidden max-h-96">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 sticky top-0 bg-white">
                Select Project
              </div>
              <div className="overflow-y-auto max-h-80">
                {projects.map((project, index) => (
                  <button
                    key={project.id}
                    onClick={() => handleProjectSelect(project)}
                    className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-all duration-150 flex items-center justify-between group ${
                      selectedProject.id === project.id 
                        ? 'bg-blue-50 text-blue-700 font-medium' 
                        : 'text-gray-700'
                    } ${index !== 0 ? 'border-t border-gray-50' : ''}`}
                  >
                    <span className="flex-1">{project.name}</span>
                    {selectedProject.id === project.id && (
                      <Icons.Check size={16} className="text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 pt-4">
        <ProgressBar value={progressPercentage} />
      </div>

      {/* Steps */}
      <div className="p-6">
        <div className="relative flex justify-between items-center">
          {/* DASHED LINE */}
          <div className="absolute left-6 right-6 top-5 border-t-2 border-dashed border-green-400 z-0" />

          {steps.map((step, index) => {
            const completed = index < currentStepIndex;
            const current = index === currentStepIndex;

            return (
              <div key={step} className="flex flex-col items-center z-10">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full border-2
                    ${completed
                      ? "bg-green-500 text-white border-green-500"
                      : current
                        ? "border-orange-500 text-orange-500 border-dashed bg-white"
                        : "bg-blue-600 text-white border-blue-600"
                    }`}
                >
                  {completed ? <Icons.Check size={20} /> : index + 1}
                </div>
                <span className="text-xs mt-2 text-gray-600">{step}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ProgressBar Component
export function ProgressBar({ value }) {
  return (
    <div className="w-full h-2 bg-gray-200 rounded-full">
      <div
        className={`h-2 rounded-full transition-all duration-500 ${
          value === 100 ? "bg-green-500" : value >= 75 ? "bg-blue-600" : "bg-orange-500"
        }`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}