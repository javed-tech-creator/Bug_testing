import React, { useState } from "react";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";
import { useParams } from "react-router-dom";
import Loader from "@/components/Loader";
import { useGetProjectsByClientQuery } from "@/api/sales/client.api";

const DesignTab = () => {
  const [expandedProduct, setExpandedProduct] = useState(null);
  const { id: clientId } = useParams();

  const { data, isLoading } = useGetProjectsByClientQuery(
    { clientId },
    { skip: !clientId }
  );

  const projects = data?.data?.projects || [];

  const toggleProduct = (id) => {
    setExpandedProduct(expandedProduct === id ? null : id);
  };

  if (isLoading) return <Loader />;
if(projects?.length == 0)
return (
  <div className="text-center text-gray-500">
    No projects found for this client. Please add a project first.
  </div>
)

  return (
    <div className=" space-y-4">

      {/* All Projects */}
      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project._id}
            className="border rounded-lg bg-white shadow-sm p-4"
          >
            {/* Project Header */}
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">
                  {project.projectName}
                </h3>
                <p className="text-sm text-gray-500">
                  Code: {project.projectId}
                </p>
              </div>
            </div>

            {/* All Products */}
            <div className="space-y-3">
              {project.products?.map((prod) => (
                <div
                  key={prod._id}
                  className="border border-gray-200 rounded-md p-4 bg-gray-50"
                >
                  {/* Product Title */}
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-base font-medium text-gray-800">
                        {prod.productName}
                      </p>
                      <p className="text-xs text-gray-500">
                        Product ID: {prod._id}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleProduct(prod._id)}
                      className="flex items-center gap-1 text-sm text-white bg-black px-3 cursor-pointer py-1.5 rounded-md hover:bg-gray-800"
                    >
                      {expandedProduct === prod._id ? (
                        <>
                          <ChevronUp size={16} /> Close
                        </>
                      ) : (
                        <>
                          <ChevronDown size={16} /> View Recce
                        </>
                      )}
                    </button>
                  </div>

                  {/* Recce Details View */}
                  {expandedProduct === prod._id && (
                    <div className="mt-4 border-t pt-3 space-y-3">

                      {/* Recce Basic Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white">
                          <span className="font-semibold">Recce Date:</span>
                          <p>{prod.recceDate || "N/A"}</p>
                        </div>

                        <div className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white">
                          <span className="font-semibold">Recce By:</span>
                          <p>{prod.recceBy || "N/A"}</p>
                        </div>

                        <div className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white">
                          <span className="font-semibold">Site Status:</span>
                          <p>{prod.siteStatus || "N/A"}</p>
                        </div>
                      </div>

                      {/* Recce Notes */}
                      <div className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white">
                        <span className="font-semibold">Recce Notes:</span>
                        <p className="mt-1">
                          {prod.recceNotes || "No notes added"}
                        </p>
                      </div>

                      {/* Recce Files */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="border border-dashed border-gray-300 rounded-md p-3 text-center text-sm text-gray-600">
                          <FileText size={18} className="inline-block mb-1" />
                          <p>Recce Images</p>
                          {prod.recceImages?.length ? (
                            <p className="text-green-600">
                              {prod.recceImages.length} files
                            </p>
                          ) : (
                            <p>No files</p>
                          )}
                        </div>

                        <div className="border border-dashed border-gray-300 rounded-md p-3 text-center text-sm text-gray-600">
                          <FileText size={18} className="inline-block mb-1" />
                          <p>Measurement Files</p>
                          {prod.measurementFiles?.length ? (
                            <p className="text-green-600">
                              {prod.measurementFiles.length} files
                            </p>
                          ) : (
                            <p>No files</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default DesignTab;
