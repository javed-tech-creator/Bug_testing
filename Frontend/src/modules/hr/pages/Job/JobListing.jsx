import React, { useState, useEffect } from "react";
import Table from "../../../../components/Table";
import Loader from "../../../../components/Loader";
import {
  CheckCircle,
  FileUser,
  LoaderCircle,
  SquarePen,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import {
  useChangeJobStatusMutation,
  useGetAllJobPostQuery,
} from "@/api/hr/job.api";
import { toast } from "react-toastify";

function JobListing() {
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useGetAllJobPostQuery();

  const jobData = data?.data || [];
  console.log(jobData);
  // 🔍 Validation Rules
  const validateAlpha = (str) => /^[A-Za-z\s]+$/.test(str || "");

  const validateSkills = (str) => {
    if (Array.isArray(str)) {
      str = str.join(",");
    }

    if (typeof str !== "string") {
      return false;
    }

    return str
      .split(",")
      .map((s) => s.trim())
      .every((skill) => /^[A-Za-z\s]+$/.test(skill));
  };

  const validateOpenings = (val) => /^\d{1,2}$/.test(String(val));

  // ✅ Filter only valid job entries
  const validatedJobData = jobData || [];
  const [closeJob, { isLoading: closeLoading, error }] =
    useChangeJobStatusMutation();
  const [closeLoadingId, setCloseLoadingId] = useState(null);
  const handleEdit = (item) => {
    navigate(`/hr/job/post/edit/${item._id}`);
  };

  const handleClose = async (item) => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to close this job?"
      );
      if (!confirmed) return;

      setCloseLoadingId(item._id);
      await closeJob({ id: item._id }).unwrap();

      toast.success("Job closed successfully");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to close job");
    } finally {
      setCloseLoadingId(null);
    }
  };

  const handleViewApplication = (item) => {
    navigate(`/hr/job/application/${item?._id}`);
  };

  // ✅ Table Column Config
  const columnConfig = {
    actions: {
      label: "Actions",
      render: (val, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="p-1 text-orange-500 rounded cursor-pointer"
            title="Edit"
          >
            <SquarePen size={20} />
          </button>

          <button
            onClick={() => handleClose(row)}
            disabled={closeLoadingId === row._id || row.status === "Closed"}
            className="p-1 rounded cursor-pointer"
            title={row.status === "Closed" ? "Job Already Closed" : "Close Job"}
          >
            {closeLoadingId === row._id ? (
              <LoaderCircle className="animate-spin text-red-500" size={20} />
            ) : row.status === "Closed" ? (
              <CheckCircle className="text-gray-400" size={20} />
            ) : (
              <XCircle className="text-red-500" size={20} />
            )}
          </button>
        </div>
      ),
    },
    postedAt: {
      label: "Posted Date",
      render: (val) => new Date(val).toLocaleDateString("en-IN"),
    },
    status: { label: "Status" },
    title: { label: "Job Title" },
    jobType: { label: "Job Type" },
    employmentType: { label: "Employment Type" },
    experience: {
      label: "Experience",
      render: (val, row) => {
        const type = row?.experienceType || "";
        return val ? `${val} ${type}` : "-";
      },
    },
    salaryRange: { label: "Salary Range" },
    openings: { label: "Openings" },
    viewApplication: {
      label: "Applications",
      render: (val, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleViewApplication(row)}
            className="p-1 text-orange-500 rounded cursor-pointer"
            title="View Applications"
          >
            View <FileUser size={20} className="inline ml-1" />
          </button>
        </div>
      ),
    },
  };

  useEffect(() => {
    refetch();
  }, []);

  return (
    <div>
      <PageHeader title="Job Posts" btnTitle="Add Post" path="/hr/job/add" />

      <div>
        {isLoading ? (
          <Loader />
        ) : (
          <Table data={validatedJobData} columnConfig={columnConfig} />
        )}
      </div>
    </div>
  );
}

export default JobListing;
