import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { View } from "lucide-react";
import Table from "../../../../components/Table";
import Loader from "../../../../components/Loader";
import PageHeader from "@/components/PageHeader";

import {
  useGetCandidateByJobIdQuery,
} from "@/api/hr/job.api";
import { Title } from "@mui/icons-material";

function CandidateListByJob() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  // Candidates for this job
  const {
    data: candidateRes,
    isLoading: candidatesLoading,
    refetch,
  } = useGetCandidateByJobIdQuery({id}, { skip: !id });

  const candidateData = candidateRes?.data || [];

  // Navigation to candidate profile
  const handleView = (candidate) => {
    navigate(`/hr/job/candidate/profile/${candidate._id}`);
  };

  // Table column config
  const columnConfig = {
    actions: {
      label: "Actions",
      render: (val, row) => (
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => handleView(row)}
            className="p-1 text-orange-500 rounded cursor-pointer"
            title="View Profile"
          >
            View Profile <View size={20} className="inline ml-1" />
          </button>
        </div>
      ),
    },
    name: { label: "Name" },
    email: { label: "Email" },
    phone: { label: "Phone" },
    experience: {
      label: "Experience",
      render: (val, row) => {
        const type = row?.experienceType || "";
        return val ? `${val} ${type}` : "-";
      },
    },
    skills: {
      label: "Skills",
      render: (val) => val?.join(", ") || "-",
    },
    status: { label: "Status" },
    appliedDate: {
      label: "Applied On",
      render: (val) =>new Date(val).toLocaleString("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
  hour12: false
})
,
    },
  };

  useEffect(() => {
    if (id) refetch();
  }, [id, refetch]);

  if (candidatesLoading) return <Loader />;

  return (
    <div>
      <PageHeader
       title={`Candidates for Job: ${candidateData[0]?.jobId?.title ?? "Title"}`}
        btnTitle="Back to Jobs"
        path="/hr/job"
      />

      <div className="mt-4">
        {candidateData.length > 0 ? (
          <Table data={candidateData} columnConfig={columnConfig} />
        ) : (
          <div className="text-center py-10 text-gray-500">
            No candidates found for this job
          </div>
        )}
      </div>
    </div>
  );
}

export default CandidateListByJob;
