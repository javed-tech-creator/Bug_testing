
import React, { useEffect, useRef, useState } from "react";
import { Plus, Edit2, Trash2, Search, FolderOpen, User, FileText, Calendar, X } from "lucide-react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from "@/api/finance/Quatation_Billing/project.api";
import { useGetClientsQuery } from "@/api/finance/Quatation_Billing/client.api";

// Yup validation schema
const projectSchema = Yup.object().shape({
  name: Yup.string()
    .matches(/^[A-Za-z\s]+$/, "Only letters and spaces allowed")
    .min(3, "Project name must be at least 3 characters")
    .max(50, "Project name must be at most 50 characters")
    .required("Project name is required"),
  client: Yup.string().required("Client selection is required"),
  description: Yup.string()
    .min(5, "Description must be at least 5 characters")
    .max(50, "Description must be at most 50 characters")
    .required("Description is required"),
});

const ProjectComponent = () => {
  const { data: projects, isLoading, isError } = useGetProjectsQuery();
  const [createProject] = useCreateProjectMutation();
  const [updateProject] = useUpdateProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();
  const { data: clients } = useGetClientsQuery();

  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(projectSchema),
     mode: "onChange",
  });

  const filteredProjects = projects?.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.client?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const onSubmit = async (data) => {
    try {
      if (editingProject) {
        await updateProject({ id: editingProject._id, ...data }).unwrap();
        toast.success("Project updated successfully!");
      } else {
        await createProject(data).unwrap();
        toast.success("Project created successfully!");
      }
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };
  const modalRef = useRef(null);
  useEffect(() => {
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      resetForm(); // modal close karne ke liye
    }
  };

  if (showModal) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [showModal]);

  const handleEdit = (project) => {
    setEditingProject(project);
    setValue("name", project.name);
    setValue("client", project.client?._id || "");
    setValue("description", project.description);
    setShowModal(true);
  };

  const resetForm = () => {
    reset();
    setEditingProject(null);
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(id).unwrap();
        toast.success("Project deleted successfully!");
      } catch (err) {
        console.log(err);
        
        toast.error("Failed to delete project!");
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading projects</div>;

  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-2 mb-2 flex justify-between items-center">
          <div className="flex items-center">
            <FolderOpen className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Project Management</h1>
              <p className="text-gray-600 mt-1">{projects?.length || 0} projects total</p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" /> Add New Project
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm border p-2 mb-1">
          <div className="relative max-w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-white rounded-lg mt-5 shadow-sm border overflow-hidden">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-600">Get started by adding your first project.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-900 text-white border-b border-gray-200">
                <tr>
                  <th className=" px-6 py-2 text-left">Project</th>
                  <th className=" px-6 py-2 text-left">Client</th>
                  <th className=" px-6 py-2 text-left">Description</th>
                  <th className=" px-6 py-2 text-left">Created</th>
                  <th className=" px-6 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProjects.map((project) => (
                  <tr key={project._id}>
                    <td className="py-1 px-6">{project.name}</td>
                    <td className="py-1 px-6">{project.client?.name || "-"}</td>
                    <td className="py-1 px-6">{project.description || "-"}</td>
                    <td className="py-1 px-6">{new Date(project.createdAt).toLocaleDateString()}</td>
                    <td className="py-1 px-6 text-center">
                      <button onClick={() => handleEdit(project)} className="text-blue-600 mr-2"><Edit2 /></button>
                      <button onClick={() => handleDelete(project._id)} className="text-red-600"><Trash2 /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal */}
        {showModal && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center overflow-auto pt-20 pb-10 p-4 z-50">
    <div ref={modalRef} className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-700 text-white p-2 relative">
        <h2 className="text-2xl font-bold mb-1">{editingProject ? "Edit Project" : "Add New Project"}</h2>
        <p className="text-white/80 text-sm">
          Fill in the details below to {editingProject ? "update this project" : "add a new project"}
        </p>
        <button onClick={resetForm} className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all duration-200">
          <X size={20} />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-2   space-y-4">
        {/* Project Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Project Name <span className="text-red-500">*</span></label>
          <input 
            {...register("name")} 
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? "border-red-500" : "border-gray-300"}`} 
            placeholder="Enter Project Name" 
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        {/* Client */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Client <span className="text-red-500">*</span></label>
          <select 
            {...register("client")} 
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${errors.client ? "border-red-500" : "border-gray-300"}`}
          >
            <option value="">Select Client</option>
            {clients?.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
          {errors.client && <p className="text-red-500 text-xs mt-1">{errors.client.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea 
            {...register("description")} 
            rows={3} 
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.description ? "border-red-500" : "border-gray-300"}`} 
            placeholder="Enter project description" 
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        {/* Buttons */}
        <div className="flex gap-3  justify-end">
          <button type="button" onClick={resetForm} className="px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
          <button type="submit" className="px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-600 text-white rounded-xl hover:from-gray-700 hover:to-gray-700 transition-all duration-200">
            {editingProject ? "Update Project" : "Add Project"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}


      </div>
    </div>
  );
};

export default ProjectComponent;
