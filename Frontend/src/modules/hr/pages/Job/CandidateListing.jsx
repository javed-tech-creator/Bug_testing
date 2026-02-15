import React, { useState, useEffect } from "react";
import Table from "../../../../components/Table";
import Loader from "../../../../components/Loader";
import {View,} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import { useGetAllCandidatesQuery } from "@/api/hr/job.api";

function CandidateListing() {
  const navigate = useNavigate();

  const { data, isLoading, refetch } = useGetAllCandidatesQuery();
  const candidateData = data?.data || [];


  // Edit candidate
  const handleView = (candidate) => {
    navigate(`/hr/job/candidate/profile/${candidate._id}`);
  };


  // Table column configuration
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
            View Profile<View size={20}  className="inline ml-1"/>
          </button>
        </div>
      ),
    },
    name: { label: "Name" },
    email: { label: "Email" },
    phone: { label: "Phone" },
    jobId: {
      label: "Applied For",
      render: (val) => val?.title || "N/A", // make sure jobId is populated
    },
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
      render: (val) => new Date(val).toLocaleDateString("en-IN"),
    },
  };

  useEffect(() => {
    refetch();
  }, []);

  return (
    <div>
      <PageHeader title="Candidates" btnTitle="Add Candidate" path="/hr/job/candidate/add" />

      <div>
        {isLoading ? (
          <Loader />
        ) : (
          <Table data={candidateData} columnConfig={columnConfig} />
        )}
      </div>
    </div>
  );
}

export default CandidateListing;
