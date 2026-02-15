import React, { useState } from "react";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";
import { useParams } from "react-router-dom";
import Loader from "@/components/Loader";
import { useGetProjectsByClientQuery } from "@/api/sales/client.api";

const RecceFormPage = () => {
  const [expandedProduct, setExpandedProduct] = useState(null);
  const { id: clientId } = useParams();

  const { data, isLoading } = useGetProjectsByClientQuery(
    { clientId },
    { skip: !clientId }
  );

  const projects = data?.data?.projects || [];

  const toggleProduct = (prodId) => {
    setExpandedProduct(expandedProduct === prodId ? null : prodId);
  };

  if (isLoading) return <Loader />;


  if(projects?.length == 0)
return (
  <div className="text-center text-gray-500">
    No projects found for this client. Please add a project first.
  </div>
)
  return (
    <div className="space-y-4 ">

      {projects?.map((project) => (
        <div
          key={project._id}
          className="border rounded-xl p-4 bg-white shadow-sm"
        >
          {/* Project Header */}
          <div className="mb-3">
            <h3 className="font-semibold text-gray-900 text-lg">
              {project.projectName}
            </h3>
            <p className="text-sm text-gray-500">Code: {project.projectId}</p>
          </div>

          {/* Product List */}
          {project.products?.map((prod) => {
            const recce = prod?.recceDetails || {}; // Recce coming from backend
            const files = recce?.files || [];

            const isOpen = expandedProduct === prod._id;

            return (
              <div
                key={prod._id}
                className="border rounded-lg p-4 bg-gray-50 mb-3"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">
                      {prod.productName}
                    </p>
                    <p className="text-xs text-gray-500">
                      Product ID: {prod._id}
                    </p>
                  </div>

                  <button
                    onClick={() => toggleProduct(prod._id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-black text-white rounded-md hover:bg-gray-900"
                  >
                    {isOpen ? (
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

                {/* Expanded Recce Section */}
                {isOpen && (
                  <div className="mt-4 border-t pt-4 space-y-3">

                    {/* Row 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                      <div className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white">
                        <span className="font-semibold">Measurement Date:</span>
                        <p>{recce.measurementDate || "N/A"}</p>
                      </div>

                      <div className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white">
                        <span className="font-semibold">Height:</span>
                        <p>{recce.height || "N/A"}</p>
                      </div>

                      <div className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white">
                        <span className="font-semibold">Width:</span>
                        <p>{recce.width || "N/A"}</p>
                      </div>
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                      <div className="border bg-white border-gray-300 rounded-md px-3 py-2 text-sm">
                        <span className="font-semibold">Lit Type:</span>
                        <p>{recce.litType || "N/A"}</p>
                      </div>

                      <div className="border bg-white border-gray-300 rounded-md px-3 py-2 text-sm">
                        <span className="font-semibold">Connection Point:</span>
                        <p>{recce.connectionPoint || "N/A"}</p>
                      </div>

                      <div className="border bg-white border-gray-300 rounded-md px-3 py-2 text-sm">
                        <span className="font-semibold">Visibility:</span>
                        <p>{recce.visibility || "N/A"}</p>
                      </div>
                    </div>

                    {/* Row 3 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="border bg-white border-gray-300 rounded-md px-3 py-2 text-sm">
                        <span className="font-semibold">Shapes:</span>
                        <p>{recce.shapes || "N/A"}</p>
                      </div>

                      <div className="border bg-white border-gray-300 rounded-md px-3 py-2 text-sm">
                        <span className="font-semibold">Colors:</span>
                        <p>{recce.colors || "N/A"}</p>
                      </div>

                      <div className="border bg-white border-gray-300 rounded-md px-3 py-2 text-sm">
                        <span className="font-semibold">Height From Road:</span>
                        <p>{recce.heightFromRoad || "N/A"}</p>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="border bg-white border-gray-300 rounded-md px-3 py-2 text-sm">
                      <span className="font-semibold">Mounting Details:</span>
                      <p className="mt-1">{recce.mountingDetails || "N/A"}</p>
                    </div>

                    <div className="border bg-white border-gray-300 rounded-md px-3 py-2 text-sm">
                      <span className="font-semibold">Fabrication Work:</span>
                      <p className="mt-1">{recce.fabricationWork || "N/A"}</p>
                    </div>

                    {/* Files */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium flex items-center">
                        Uploaded Files
                        <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                          {files.length}
                        </span>
                      </h3>

                      {files.length === 0 ? (
                        <p className="text-xs text-gray-500">No files found</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {files.map((f) => (
                            <div
                              key={f._id}
                              className="flex items-center justify-between bg-gray-50 p-3 rounded-md border border-gray-200"
                            >
                              <div className="flex items-center gap-3">
                                <FileText size={18} />
                                <p className="text-sm font-medium truncate">
                                  {f.name}
                                </p>
                              </div>

                              <button
                                onClick={() => window.open(f.url, "_blank")}
                                className="text-xs px-3 py-1 border rounded-md bg-white hover:bg-gray-50"
                              >
                                View
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default RecceFormPage;
