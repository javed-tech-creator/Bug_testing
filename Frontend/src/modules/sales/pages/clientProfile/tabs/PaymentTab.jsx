// components/PaymentTab.jsx
import React, { useState } from "react";
import { IndianRupee, Eye } from "lucide-react";
import { useGetProjectsByClientQuery } from "@/api/sales/client.api";
import { Link, useParams, useNavigate } from "react-router-dom";
import Loader from "@/components/Loader";

function PaymentTab() {
  const { id: clientId } = useParams();
  const navigate = useNavigate();

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
  const projects = data?.data?.projects || [];

if(isLoadingProjects){
  return(
    <>
    <Loader/>
    </>
  )
}
if(projects?.length == 0){
return (
  <div className="text-center text-gray-500">
    No projects found for this client. Please add a project first.
  </div>
)
}
  return (
    <div className="w-full">
      {/* <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Project Payment Overview
      </h2> */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((proj) => {
          const productNames = (proj.products || []).map(p => p.productName).join(", ");

          const quotationUrl = proj.quotationId
            ? `/sales/project/${proj._id}/quotation/${proj.quotationId}`
            : null;

          return (
            <div
              key={proj._id}
              className="border rounded-lg bg-gray-50/30 p-4 transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-lg text-gray-900">
                  {proj.projectName}
                </h3>

                <span className="text-xs bg-black text-white px-2 py-0.5 rounded">
                  {proj.projectId}
                </span>
              </div>

              <p className="text-sm text-gray-700 mb-2">
                Products:{" "}
                <span className="font-medium">
                  {productNames || "No products"}
                </span>
              </p>

              <div className="flex items-center gap-3 mt-3">

                {quotationUrl && (
                  <Link
                    to={quotationUrl}
                    className="flex items-center gap-1 text-xs text-orange-500 hover:underline"
                  >
                    <Eye size={14} /> Quotation
                  </Link>
                )}
                {!quotationUrl && (
<p>There is no payment history for this client</p>
                )}

                {/* <button
                  onClick={() => navigate(`/sales/project/${proj._id}/payment`)}
                  className="flex items-center gap-1 text-xs bg-orange-500 text-white px-3 py-1.5 rounded hover:bg-orange-700"
                >
                  <IndianRupee size={14} /> Payment
                </button> */}

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

export default PaymentTab;
