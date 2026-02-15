import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import PageHeader from "../../../../../components/PageHeader";

// Mock Project Data
const mockProjects = [
  { _id: "1", projectName: "Digital Billboard", projectId: "DB001" },
  { _id: "2", projectName: "Retail Signage", projectId: "RS002" },
  { _id: "3", projectName: "Corporate Display", projectId: "CD003" },
  { _id: "4", projectName: "LED Panel System", projectId: "LP004" },
  { _id: "5", projectName: "Interactive Kiosk", projectId: "IK005" },
  { _id: "6", projectName: "Video Wall Display", projectId: "VW006" },
];

const schema = yup.object().shape({
  project: yup.string().required("Project is required"),
  complaintType: yup.string().required("Please select a complaint type"),
  subject: yup.string().required("Subject is required"),
  description: yup.string().required("Description is required"),
  priority: yup.string().required("Priority is required"),
  file: yup
    .mixed()
    .test("fileSize", "File size must be less than 5MB", (value) => {
      return !value || !value[0] || value[0].size <= 5 * 1024 * 1024;
    })
    .test("fileType", "Only PDF, DOC, DOCX, JPG, PNG files allowed", (value) => {
      if (!value || !value[0]) return true;
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/jpg",
        "image/png"
      ];
      return allowedTypes.includes(value[0].type);
    }),
});

const RaiseComplainPage = ({ _id }) => {
  const {
    register,
    setValue,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [projects, setProjects] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [readonlyProject, setReadonlyProject] = useState(null);

  useEffect(() => {
    // Simulate API fetch
    setProjects(mockProjects);

    // If _id is passed, set project value and disable selection
    if (_id) {
      const found = mockProjects.find((p) => p._id === _id);
      if (found) {
        setValue("project", found._id);
        setReadonlyProject(found);
      }
    }
  }, [_id]);

  const filteredProjects = projects.filter((project) =>
    project.projectName.toLowerCase().includes(searchText.toLowerCase()) ||
    project.projectId.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setShowSuggestions(e.target.value.length > 0);
  };

  const selectProject = (project) => {
    setValue("project", project._id);
    setSearchText("");
    setShowSuggestions(false);
  };

  const onSubmit = (data) => {
    const selectedProject = projects.find((p) => p._id === data.project);
    console.log("Complaint Data:", { ...data, selectedProject });
    reset();
    setSearchText("");
  };

  const selectedProject = watch("project");
  const selectedProjectData = projects.find(p => p._id === selectedProject);

  return (
    <div className="">
      <PageHeader title="Raise a Complaint" />
      <div className="mx-auto ">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="p-6">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                
                {/* Project Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Project</label>
                  {!readonlyProject ? (
                    <>
                      <select
                        {...register("project")}
                        className="w-full border border-gray-300 px-3 py-2 text-sm rounded-md focus:outline-none focus:ring focus:ring-black focus:border-black"
                      >
                        <option value="" selected disabled>Select Project</option>
                        {projects.map((project) => (
                          <option key={project._id} value={project._id}>
                            {project.projectName} ({project.projectId})
                          </option>
                        ))}
                      </select>
                      {errors.project && (
                        <p className="text-xs text-red-600 mt-1">{errors.project.message}</p>
                      )}
                    </>
                  ) : (
                    <input
                      disabled
                      value={`${readonlyProject.projectName} (${readonlyProject.projectId})`}
                      className="w-full border border-gray-300 px-3 py-2 text-sm rounded-md bg-gray-100 text-gray-600"
                    />
                  )}
                </div>

                {/* Search Bar with Suggestions */}
                <div className="relative">
                  <label className="block text-sm font-medium text-black mb-1">Search Projects</label>
                  <input
                    type="text"
                    placeholder="Search by name or ID..."
                    className={`${selectedProject?'bg-gray-100':'bg-white'} w-full border border-gray-300 px-3 py-2 text-sm rounded-md focus:outline-none focus:ring focus:ring-black focus:border-black`}
                    value={searchText}
                    onChange={handleSearchChange}
                    onFocus={() => searchText.length > 0 && setShowSuggestions(true)}
                     disabled={selectedProject}
                  />
                  
                  {/* Search Suggestions Dropdown */}
                  {showSuggestions && filteredProjects.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {filteredProjects.map((project) => (
                        <div
                          key={project._id}
                          className="px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onClick={() => selectProject(project)}
                        >
                          <div className="font-medium text-black/80">{project.projectName} <span className="text-sm text-gray-500">({project.projectId})</span></div>
                          
                        </div>
                      ))}
                    </div>
                  )}
                  
                </div>

                {/* Complaint Type */}
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Complaint Type</label>
                  <select
                    {...register("complaintType")}
                    className="w-full border border-gray-300 px-3 py-2 text-sm rounded-md focus:outline-none focus:ring focus:ring-black focus:border-black"
                  >
                    <option value="">Select Type</option>
                    <option value="technical">Technical Issue</option>
                    <option value="billing">Billing Issue</option>
                    <option value="service">Service Issue</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="performance">Performance</option>
                  </select>
                  {errors.complaintType && (
                    <p className="text-xs text-red-600 mt-1">{errors.complaintType.message}</p>
                  )}
                </div>
              </div>

              {/* Second Row: Subject, Priority, File */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
                
                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Subject</label>
                  <input
                    type="text"
                    {...register("subject")}
                    className="w-full border border-gray-300 px-3 py-2 text-sm rounded-md focus:outline-none focus:ring focus:ring-black focus:border-black"
                    placeholder="Brief summary of the issue"
                  />
                  {errors.subject && (
                    <p className="text-xs text-red-600 mt-1">{errors.subject.message}</p>
                  )}
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-black mb-1">Priority</label>
                  <div className="flex gap-4 p-2 px-4 border border-gray-300 rounded-md">
                    {[
                      { value: "Low", color: "text-green-600" },
                      { value: "Medium", color: "text-yellow-600" },
                      { value: "High", color: "text-red-600" }
                    ].map(({ value, color }) => (
                      <label key={value} className="flex items-center gap-2">
                        <input 
                          type="radio" 
                          value={value} 
                          {...register("priority")}
                          className="w-4 h-4"
                        />
                        <span className={`text-sm font-medium ${color}`}>{value}</span>
                      </label>
                    ))}
                  </div>
                  {errors.priority && (
                    <p className="text-xs text-red-600 mt-1">{errors.priority.message}</p>
                  )}
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Attach File
                    <span className="text-gray-500 font-normal"> (Optional)</span>
                  </label>
                  <input 
                    type="file" 
                    {...register("file")} 
                    className="w-full text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring focus:ring-black focus:border-black file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp4"
                  />
                  <p className="text-sm text-gray-500 mt-1">Max 5MB • JPG, PNG , MP4 , PDF, DOC allowed</p>
                  {errors.file && (
                    <p className="text-xs text-red-600 mt-1">{errors.file.message}</p>
                  )}
                </div>
              </div>

              {/* Third Row: Description */}
              <div className="mb-2">
                <label className="block text-sm font-medium text-black mb-1">Description</label>
                <textarea
                  rows="4"
                  {...register("description")}
                  className="w-full border border-gray-300 px-3 py-2 text-sm rounded-md focus:outline-none focus:ring focus:ring-black focus:border-black resize-none"
                  placeholder="Provide detailed information about the issue, including steps to reproduce, expected vs actual behavior, and any error messages"
                />
                {errors.description && (
                  <p className="text-xs text-red-600 ">{errors.description.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors focus:outline-none focus:ring focus:ring-black focus:ring-offset-2"
                >
                  Submit Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaiseComplainPage;