// CandidateProfilePage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Edit,
  FileText,
  Calendar,
  Send,
  XCircle,
  CheckCircle,
  User,
  Briefcase,
  Clock,
  Download,
} from "lucide-react";

import PageHeader from "@/components/PageHeader";
import Loader from "../../../../../components/Loader";

import {
  useChangeCandidateStatusMutation,
  useGetCandidateByIdQuery,
  useScheduleInterviewMutation,
  useUploadOfferLetterMutation,
  useUpdateResumeMutation,
} from "@/api/hr/job.api";

export default function CandidateProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, refetch } = useGetCandidateByIdQuery(
    { id },
    {
      skip: !id,
    }
  );
  const candidate = data?.data || null;


  const [scheduleInterview, { isLoading: scheduling }] =
    useScheduleInterviewMutation();
  const [changeStatus, { isLoading: statusChanging }] =
    useChangeCandidateStatusMutation();
  const [uploadOffer, { isLoading: uploadingOffer }] =
    useUploadOfferLetterMutation();
  const [updateResume, { isLoading: updatingResume }] =
    useUpdateResumeMutation();

  // Local UI state
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);

  // form state
  const [interviewForm, setInterviewForm] = useState({
    inerviewDate: "",
    interviewer: "",
  });
  const [statusForm, setStatusForm] = useState({ status: "", reason: "" });

  useEffect(() => {
    if (candidate) {
      setInterviewForm({
        inerviewDate: candidate.inerviewDate
          ? new Date(candidate.inerviewDate).toISOString().slice(0, 16)
          : "",
        interviewer: candidate.interviewer || "",
      });
    }
  }, [candidate]);

  if (isLoading) return <Loader />;

  if (!candidate)
    return (
      <div>
        <PageHeader title="Candidate" btnTitle="Back" path="/hr/candidate" />
        <div className="text-center py-12">Candidate not found</div>
      </div>
    );

  /* ----------------------
     Handlers
  ----------------------*/
  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        interviewDate: interviewForm.inerviewDate
          ? new Date(interviewForm.inerviewDate).toISOString()
          : null,
        interviewer: interviewForm.interviewer,
        feedback:interviewForm.feedback || null
      };
      await scheduleInterview({ id: candidate._id,  formData}).unwrap();
      toast.success("Interview scheduled");
      setShowInterviewModal(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to schedule interview");
    }
  };

  const handleChangeStatus = async (e) => {
    e.preventDefault();
    try {
      const formData =  {status: statusForm.status,
        remarks: statusForm.reason}
      await changeStatus({
        id: candidate._id,
        formData
      }).unwrap();
      toast.success("Status updated");
      setShowStatusModal(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  const handleOfferUpload = async (e) => {
    e.preventDefault();
    const file = e.target.elements.offer?.files[0];
    if (!file) return toast.error("Please select a file");
    try {
      const fd = new FormData();
      fd.append("offerLatter", file);
      await uploadOffer({ id: candidate._id, formData: fd }).unwrap();
      toast.success("Offer letter uploaded");
      setShowOfferModal(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to upload offer letter");
    }
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    const file = e.target.elements.resume?.files[0];
    if (!file) return toast.error("Please select a file");
    try {
      const fd = new FormData();
      fd.append("resume", file);
      await updateResume({ id: candidate._id, formData: fd }).unwrap();
      toast.success("Resume updated successfully");
      setShowResumeModal(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update resume");
    }
  };

  /* ----------------------
     UI helpers
  ----------------------*/
  const statusColor = {
    Applied: "bg-gray-100 text-gray-700 border-gray-200",
    Shortlisted: "bg-blue-50 text-blue-700 border-blue-200",
    Interviewed: "bg-orange-50 text-orange-700 border-orange-200",
    Offered: "bg-purple-50 text-black border-purple-200",
    Selected: "bg-indigo-50 text-indigo-700 border-indigo-200",
    Hired: "bg-green-50 text-green-700 border-green-200",
    Rejected: "bg-red-50 text-red-700 border-red-200",
  };

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  return (
    <div>
      {/* <PageHeader
        title={`Candidate: ${candidate.name}`}
        btnTitle="Back to candidates"
        path="/hr/candidate"
      /> */}

      <div className="grid gap-4 mt-4">
        {/* Main Content */}
        <div className="border-l-4 rounded-xl border-black">
          <ProfileCard
            candidate={candidate}
            onOpenInterview={() => setShowInterviewModal(true)}
            onOpenStatus={() => setShowStatusModal(true)}
            onOpenOffer={() => setShowOfferModal(true)}
            onOpenResume={() => setShowResumeModal(true)}
            statusColor={statusColor}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-4 grid grid-cols-2 gap-4">
          {/* Candidate Details */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4 border-b   border-gray-100">
              <h4 className="font-medium text-gray-900">Details</h4>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-start gap-2">
                <Briefcase size={14} className="text-gray-400 mt-0.5" />
                <div className="text-sm">
                  <div className="text-gray-500">Position</div>
                  <div className="text-gray-900 font-medium">
                    {candidate.jobId?.title || "—"}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock size={14} className="text-gray-400 mt-0.5" />
                <div className="text-sm">
                  <div className="text-gray-500">Experience</div>
                  <div className="text-gray-900">
                    {candidate.experience || "—"}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-3.5 h-3.5 rounded bg-gray-400 mt-0.5 flex-shrink-0"></div>
                <div className="text-sm">
                  <div className="text-gray-500">Skills</div>
                  <div className="text-gray-900">
                    {candidate.skills?.length
                      ? candidate.skills.join(", ")
                      : "—"}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="w-3.5 h-3.5 rounded bg-gray-400 mt-0.5 flex-shrink-0"></div>
                <div className="text-sm">
                  <div className="text-gray-500">Source</div>
                  <div className="text-gray-900">{candidate.source}</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Calendar size={14} className="text-gray-400 mt-0.5" />
                <div className="text-sm">
                  <div className="text-gray-500">Applied Date</div>
                  <div className="text-gray-900">
                    {new Date(candidate.appliedDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Resume */}
              <div className="border-t border-gray-100 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Resume
                  </span>
                  <button
                    className="text-xs px-2 py-1 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 transition-colors"
                    onClick={() => setShowResumeModal(true)}
                  >
                    {candidate?.resume?.public_url || candidate.resume?.url
                      ? "Replace"
                      : "Upload"}
                  </button>
                </div>
                {candidate.resume?.url || candidate?.resume?.public_url ? (
                  <a
                    href={
                      candidate?.resume?.public_url ||
                      `${backendUrl}/${candidate?.resume?.url}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Download size={12} />
                    View Resume
                  </a>
                ) : (
                  <div className="text-sm text-gray-500">
                    No resume uploaded
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="grid gap-4">
            {/* Interview & Offer */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="p-4 border-b border-gray-100">
                <h4 className="font-medium text-gray-900">Interview & Offer</h4>
              </div>
              <div className="p-4 space-y-2">
                {/* Interview */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Interview
                    </span>
                    <button
                      className="text-xs px-2 py-1 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 transition-colors"
                      disabled={candidate?.feedback}
                      onClick={() => setShowInterviewModal(true)}
                    >
                     {candidate?.feedback? "Interviewed": (candidate.inerviewDate ? "Reschedule" : "Schedule")}
                    </button>
                  </div>
                  {candidate.inerviewDate ? (
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center gap-1 mb-1">
                        <Calendar size={12} />
                        {new Date(candidate.inerviewDate).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        Interviewer: {candidate.interviewer || "Not assigned"}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">
                      No interview scheduled
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100"></div>

                {/* Offer */}
                <div className="">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <FileText size={16} className="text-gray-500" />
                      Offer Letter
                    </h3>
                    <button
                      className="text-xs px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                      onClick={() => setShowOfferModal(true)}
                    >
                      {candidate?.offerLetter?.url ? "Replace" : "Upload"}
                    </button>
                  </div>

                  <div className="space-y-2">
                    {/* Offer letter status */}
                    <div className="text-sm text-gray-700">
                      {candidate?.offerLetter?.public_url ||
                      candidate?.offerLetter?.url
                        ? "✅ Offer letter uploaded"
                        : "⚠️ No offer letter uploaded"}
                    </div>
                    <div className="text-xs text-gray-500">
                      Status:{" "}
                      <span className="font-medium">
                        {candidate.offerLetterStatus || "Pending"}
                      </span>
                    </div>

                    {/* Download link */}
                    {candidate?.offerLetter?.public_url ||
                    candidate?.offerLetter?.url ? (
                      <a
                        href={
                          candidate?.offerLetter?.public_ur ||
                          `${backendUrl}/${candidate?.offerLetter?.url}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Download size={14} />
                        View Offer Letter
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white h-fit border border-gray-200 rounded-lg">
              <div className="p-2 border-b border-gray-100">
                <h4 className="font-medium text-gray-900">Quick Actions</h4>
              </div>
              <div className="p-4 space-y-2">
                <button
                  className="w-full px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  disabled={candidate?.status == "Hired"}
                  onClick={() => {
                    setStatusForm({ status: "Hired", reason: "" });
                    setShowStatusModal(true);
                  }}
                >
                  <CheckCircle size={14} />
                  Mark as Hired
                </button>

                <button
                  className={` ${candidate?.status == "Hired" ? "bg-red-400 cursor-not-allowed":"bg-red-600 hover:bg-red-700"} w-full px-3 py-2  text-white text-sm rounded  transition-colors flex items-center justify-center gap-2`}
                  disabled={candidate?.status == "Hired"}
                  onClick={() => {
                    setStatusForm({ status: "Rejected", reason: "" });
                    setShowStatusModal(true);
                  }}
                >
                  <XCircle size={14} />
                  Reject Candidate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interview */}
      {showInterviewModal && (
        <Modal
          onClose={() => setShowInterviewModal(false)}
          title="Schedule Interview"
        >
          <form onSubmit={handleScheduleInterview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date & Time
              </label>
              <input
  type="datetime-local"
  value={
    candidate?.inerviewDate
      ? new Date(candidate.inerviewDate).toISOString().slice(0, 16) // 👉 correct format
      : interviewForm.inerviewDate
  }
  disabled={candidate?.feedback}
  onChange={(e) =>
    setInterviewForm((s) => ({
      ...s,
      inerviewDate: e.target.value,
    }))
  }
  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent"
  required
/>

            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interviewer
              </label>
              <input
                type="text"
                value={candidate?.interviewer || interviewForm.interviewer}
                disabled={candidate?.feeback}
                onChange={(e) =>
                  setInterviewForm((s) => ({
                    ...s,
                    interviewer: e.target.value,
                  }))
                }
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interview Feedback
              </label>
              <textarea
                type="text"
                value={candidate?.feedback || interviewForm.feedback}
                disabled={candidate?.feedback}
                onChange={(e) =>
                  setInterviewForm((s) => ({
                    ...s,
                    feedback: e.target.value,
                  }))
                }
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                onClick={() => setShowInterviewModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded hover:bg-blue-700 transition-colors"
                disabled={scheduling}
              >
                {scheduling ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Status */}
      {showStatusModal && (
        <Modal
          onClose={() => setShowStatusModal(false)}
          title={`Change Status${
            statusForm.status ? ` → ${statusForm.status}` : ""
          }`}
        >
          <form onSubmit={handleChangeStatus} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                required
                value={statusForm.status}
                onChange={(e) =>
                  setStatusForm((s) => ({ ...s, status: e.target.value }))
                }
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="">Select Status</option>
                <option value="Applied">Applied</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interviewed">Interviewed</option>
                <option value="Offered">Offered</option>
                <option value="Selected">Selected</option>
                <option value="Hired">Hired</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason / Note
              </label>
              <textarea
                value={statusForm.reason}
                onChange={(e) =>
                  setStatusForm((s) => ({ ...s, reason: e.target.value }))
                }
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowStatusModal(false)}
                type="button"
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded hover:bg-blue-700 transition-colors"
                disabled={statusChanging}
              >
                {statusChanging ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Offer */}
      {showOfferModal && (
        <Modal
          onClose={() => setShowOfferModal(false)}
          title="Upload Offer Letter"
        >
          <form onSubmit={handleOfferUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select File
              </label>
              <input
                type="file"
                name="offer"
                accept=".pdf,.doc,.docx"
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                onClick={() => setShowOfferModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded hover:bg-black transition-colors"
                disabled={uploadingOffer}
              >
                {uploadingOffer ? "Uploading..." : "Upload & Send"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Resume */}
      {showResumeModal && (
        <Modal onClose={() => setShowResumeModal(false)} title="Upload Resume">
          <form onSubmit={handleResumeUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Resume File
              </label>
              <input
                type="file"
                name="resume"
                accept=".pdf,.doc,.docx"
                required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                onClick={() => setShowResumeModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded hover:bg-blue-700 transition-colors"
                disabled={updatingResume}
              >
                {updatingResume ? "Uploading..." : "Upload"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ------------------------------
   ProfileCard component
--------------------------------*/
function ProfileCard({
  candidate,
  onOpenInterview,
  onOpenStatus,
  onOpenOffer,
  onOpenResume,
  statusColor,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="p-6">
        <div className="flex gap-4">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white text-xl font-semibold flex-shrink-0">
            {candidate.name?.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {candidate.name}
                </h2>
                <div className="text-sm text-gray-600 space-y-0.5">
                  <div>{candidate.email}</div>
                  <div>{candidate.phone}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                    statusColor[candidate.status] ||
                    "bg-gray-100 text-gray-700 border-gray-200"
                  }`}
                >
                  {candidate.status}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <span className="text-sm text-gray-500">Applied for: </span>
              <span className="text-sm font-medium text-gray-900">
                {candidate.jobId?.title || "—"}
              </span>
            </div>

            <div className="flex gap-2 flex-wrap">
              {candidate.interviewer? ( <button
                onClick={onOpenInterview}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors flex items-center gap-1.5"
              >
                <Calendar size={14} />
                Interview Feedback
              </button>):(
                 <button
                onClick={onOpenInterview}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors flex items-center gap-1.5"
              >
                <Calendar size={14} />
                Interview
              </button>
              )}
              <button
                onClick={onOpenStatus}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                Change Status
              </button>
              <button
                onClick={onOpenOffer}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors flex items-center gap-1.5"
              >
                <Send size={14} />
                Offer
              </button>
              <button
                onClick={onOpenResume}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors flex items-center gap-1.5"
              >
                <FileText size={14} />
                Resume
              </button>
            </div>

            {candidate.remarks && (
              <div className="mt-4 p-3 bg-gray-50 border-l-4 border-blue-400 rounded">
                <div className="text-sm">
                  <span className="font-medium text-gray-900">Remarks: </span>
                  <span className="text-gray-700">{candidate.remarks}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------
   Modal component
--------------------------------*/
function Modal({ children, onClose, title }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 relative">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <XCircle size={20} className="text-gray-400" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
