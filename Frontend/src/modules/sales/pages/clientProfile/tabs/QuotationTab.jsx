// src/pages/Quotation/MainQuotation.jsx
import React, { useState } from "react";
import { FileText, Eye, Pencil, Plus } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useGetProjectsByClientQuery } from "@/api/sales/client.api";
import Loader from "@/components/Loader";

const MainQuotation = () => {
  const navigate = useNavigate();
  const { id: clientId } = useParams();
  const [expandedProject, setExpandedProject] = useState(null);
  const {
    data,
    isLoading: isLoadingProjects,
    refetch: refetchProjects,
  } = useGetProjectsByClientQuery(
    { clientId },
    {
      skip: !clientId,
    }
  );

  const projectsData = data?.data?.projects || [];

  const handleAddQuotation = (id) => {
    const projectId = id;
    navigate(`/sales/project/${projectId}/quotation`);
  };

  const handleEditQuotation = ({ quotationId, projectId }) => {
    console.log("Editing quotation:", quotationId);
    navigate(`/sales/project/${projectId}/quotation/${quotationId}`);
  };


if(isLoadingProjects){
  return <Loader/>
}

if(projectsData.length === 0){
  return (
    <div className="text-center text-gray-500">
      No projects found for this client. Please add a project first.
    </div>
  );
}


  return (
    <div className="space-y-4">
      {/* <h2 className="text-xl font-semibold border-b pb-2">Quotation Management</h2> */}

      {/* ===== Client Info Section ===== */}
      {/* <div className="bg-white border rounded-md-lg p-4 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-2">Client Details</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <p><span className="font-medium text-gray-600">Name:</span> {clientInfo.name}</p>
          <p><span className="font-medium text-gray-600">Contact Person:</span> {clientInfo.contact}</p>
          <p><span className="font-medium text-gray-600">Phone:</span> {clientInfo.phone}</p>
          <p><span className="font-medium text-gray-600">Email:</span> {clientInfo.email}</p>
        </div>
      </div> */}

      {/* ===== Project List ===== */}
      {projectsData.map((project) => (
        <div
          key={project.id}
          className="border rounded-lg p-4 bg-white shadow-sm"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">
                {project?.projectName}
              </h3>
              <p className="text-sm text-gray-500">
                Code: {project?.projectId}
              </p>
            </div>
            <div className="flex gap-2">
              {/* {project?.hasQuotation ? (
                <>
                  <button
                    onClick={() => handleViewQuotation(project._id)}
                    className="flex items-center gap-1 bg-gray-200 px-3 py-1.5  cursor-pointer text-sm rounded-md hover:bg-gray-300"
                  >
                    <Eye size={16} /> View
                  </button>
                  <button
                    onClick={() =>
                      handleEditQuotation({
                        quotationId: project?.quotationId,
                        projectId: project._id,
                      })
                    }
                    className="flex items-center gap-1 bg-black text-white px-3 py-1.5 cursor-pointer text-sm rounded-md hover:bg-gray-800"
                  >
                    <Pencil size={16} /> Edit Quotation
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleAddQuotation(project._id)}
                  className="flex items-center gap-1 bg-black text-white px-3 py-1.5 cursor-pointer  text-sm rounded-md hover:bg-gray-800"
                >
                  <Plus size={16} /> Add Quotation
                </button>
              )} */}
              <p>There is no quotation for this project.</p>
            </div>
          </div>

          {/* Inline Form Area */}
          {expandedProject === project._id && (
            <div className="mt-4 border-t pt-3">
              <p className="text-sm text-gray-500 mb-2">
                {project.hasQuotation
                  ? "Editing existing quotation..."
                  : "Creating new quotation..."}
              </p>
              <div className="border rounded-md p-3 bg-gray-50">
                <button
                  onClick={() => navigate(`/quotation/form/${project._id}`)}
                  className="flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 w-full"
                >
                  <FileText size={16} /> Open Quotation Form
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MainQuotation;
