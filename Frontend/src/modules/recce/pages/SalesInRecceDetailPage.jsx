import React, { useState } from "react";
import { ArrowLeft, Eye, Star, MessageSquare, X, Check } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import { toast } from "react-toastify";
import { useRecceDecisionResponseMutation } from "@/api/recce/manager/request-all/request-all.api";

/* ---------- Reusable UI ---------- */

// Reusable SectionTitle component
const SectionTitle = ({ title }) => (
  <h3 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200 uppercase tracking-wide">
    {title}
  </h3>
);
const SectionHeader = ({ title, onRemark }) => (
  <div className="flex justify-between items-center mb-4 pb-2 border-b-2 border-gray-200">
    <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide">
      {title}
    </h2>

    <button
      onClick={onRemark}
      className="text-blue-600 flex items-center text-xs font-semibold border border-blue-600 px-3 py-1.5 rounded-md hover:bg-blue-50 transition-colors"
    >
      <MessageSquare size={14} className="mr-1.5" /> Add Remark
    </button>

  </div>
);

const Label = ({ children }) => (
  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
    {children}
  </label>
);

const Input = ({ value, readOnly = false }) => (
  <input
    value={value || ""}
    readOnly={readOnly}
    className={`w-full text-sm border rounded-md px-3 py-2.5 ${readOnly ? "bg-gray-100" : "bg-white"
      }`}
  />
);

const TextArea = ({ value, onChange, rows = 3, readOnly = false }) => (
  <textarea
    value={value || ""}
    onChange={onChange}
    rows={rows}
    readOnly={readOnly}
    className={`w-full text-sm border rounded-md px-3 py-2.5 resize-none ${readOnly ? "bg-gray-100" : "bg-white"
      }`}
  />
);

const FileBadge = ({ name, onClick }) => (
  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium border bg-blue-50 text-blue-700 border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors" onClick={onClick}>
    <Eye size={16} />
    {name}
  </div>
);
/* ---------- STATIC DATA ---------- */

const ASSIGNED_RECCE_DETAILS = {
  client: {
    clientCode: "CL-1021",
    clientName: "GreenFields Pvt Ltd",
    designation: "Owner",
    companyName: "GreenFields Pvt Ltd",
    phone: "9876543210",
    whatsapp: "9876543210",
    alternate: "9123456780",
    email: "contact@greenfields.com",
    salesExecutive: "Amit Verma",
    lead: "LD-8891",
    deal: "—",
    relationship: "—",
  },
  project: {
    projectName: "Retail Store Branding",
    projectCode: "PRJ-101",
    assignedDate: "2025-01-14",
    recceNotes: "Client wants high visibility signage",
  },
  site: {
    address: "24, High Street, Andheri West, Mumbai",
    location: "19.1197,72.8468",
  },
  assets: [{ name: "Design.pdf" }],
};

/* ---------- PAGE ---------- */

const SalesInRecceDetailPage = () => {
  const navigate = useNavigate();
  const data = ASSIGNED_RECCE_DETAILS;

  const { id } = useParams();
  console.log('id:>', id)

  const [recceDecisionResponse, { isLoading }] =
    useRecceDecisionResponseMutation();


  const [checklist, setChecklist] = useState([
    { label: "Client name, company, contact details", checked: false },
    { label: "Site location(s) For signage", checked: false },
    { label: "Type of signage (indoor/outdoor)", checked: false },
    { label: "Quantity Required", checked: false },
    { label: "Size Estimates", checked: false },
    { label: "Material Preference (if any)", checked: false },
    { label: "Illumination needed? (LED, backlit, non-lit)", checked: false },
    { label: "Photos / site survey requested", checked: false },
    { label: "Decision maker identified", checked: false },
    { label: "Site measurements idea", checked: false },
    { label: "Installation environment checked (wall, glass, pole, structure)", checked: false },
    { label: "Visibility distance requirement confirmed", checked: false },
    { label: "Local regulations / permits required", checked: false },
    { label: "Electrical access confirmed (if illuminated)", checked: false },
    { label: "Mounting method desired", checked: false },
    { label: "Material suitability required", checked: false },
  ]);

  const toggleChecklist = (idx) => {
    setChecklist((prev) =>
      prev.map((item, i) =>
        i === idx ? { ...item, checked: !item.checked } : item
      )
    );
  };

  /* ---------- Asset Modal ---------- */
  const [assetModal, setAssetModal] = useState({ isOpen: false, assetName: "" });

  const openAssetModal = (name) => {
    setAssetModal({ isOpen: true, assetName: name });
  };

  const closeAssetModal = () => {
    setAssetModal({ isOpen: false, assetName: "" });
  };

  /* ---------- Remark Modal ---------- */
  const [remarkModal, setRemarkModal] = useState({
    open: false,
    title: "",
    remark: "",
    rating: 0,
  });

  const [sectionRemarks, setSectionRemarks] = useState({
  basicClientRemark: { rating: 0, title: "Basic Client Information", remark: "" },
  projectInformationRemark: { rating: 0, title: "Project Information", remark: "" },
  sideAddressRemark: { rating: 0, title: "Site Address", remark: "" },
  designAssetsRemark: { rating: 0, title: "Design Assets", remark: "" },
});

const openRemark = (sectionKey) => {
  const existing = sectionRemarks[sectionKey];

  setRemarkModal({
    open: true,
    currentSection: sectionKey,
    remark: existing?.remark || "",
    rating: existing?.rating || 0,
  });
};


const saveRemark = () => {
  setSectionRemarks((prev) => ({
    ...prev,
    [remarkModal.currentSection]: {
      ...prev[remarkModal.currentSection],
      rating: remarkModal.rating,
      remark: remarkModal.remark,
    },
  }));

  setRemarkModal({
    open: false,
    currentSection: "",
    remark: "",
    rating: 0,
  });
};


  /* ---------- Feedback ---------- */
  const [formData, setFormData] = useState({
    comment: "",
    rating: 0,
    decision: "",
    declineRemark: "",
    flagType: "",
    flagRemark: "",
  });

  const decisionColor = {
    accept: "bg-green-50 text-green-700 border-green-300",
    decline: "bg-red-50 text-red-700 border-red-300",
    flag: "bg-yellow-50 text-yellow-700 border-yellow-300",
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitFeedback = async () => {
    try {
      if (!formData.decision) {
        toast.error("Please select a decision");
        return;
      }

      let payload = {
        id: id,
        status: formData.decision,
        recceRemark: formData.comment,
        remarkRating: formData.rating,
      };

      // ACCEPT
     if (formData.decision === "accept") {
  payload = {
    ...payload,

    basicClientRemark: sectionRemarks.basicClientRemark,
    projectInformationRemark: sectionRemarks.projectInformationRemark,
    sideAddressRemark: sectionRemarks.sideAddressRemark,
    designAssetsRemark: sectionRemarks.designAssetsRemark,

    reccefeedback: {
      rating: formData.rating,
      title: "Overall Feedback",
      remark: formData.comment,
    },

    receiving_checklist: checklist
      .filter((item) => item.checked)
      .map((item) => item.label),
  };
}


      // DECLINE
      if (formData.decision === "decline") {
        payload = {
          ...payload,
          declineRemark: formData.declineRemark,
        };
      }

      // FLAG
      if (formData.decision === "flag") {
        payload = {
          ...payload,
          flagType: formData.flagType,
          flagRemark: formData.flagRemark,
        };
      }

      const res = await recceDecisionResponse(payload).unwrap();

      toast.success(res?.data?.message ?? res?.message ?? "Recce decision submitted successfully");
      navigate(-1);

    } catch (error) {
      console.error("Decision API Error:", error);
      toast.error(error?.data?.message ?? error?.error?.message ?? error?.message ?? "Something went wrong");
    }
  };


  return (
    <div className="bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center gap-3 border-b mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-lg font-bold text-gray-800">
          Sales In Recce Detail Page
        </h1>
      </div>

      <div className="pb-10 space-y-6">

        {/* Basic Client Info */}
        <div className="bg-white p-5 rounded-lg shadow-sm border">
          <SectionHeader
            title="Basic Client Information"
         onRemark={() => openRemark("basicClientRemark")}
          />
          <div className="grid grid-cols-4 gap-6">
            <div><Label>Client Code</Label><Input value={data.client.clientCode} readOnly /></div>
            <div><Label>Client Name (as per Govt ID)</Label><Input value={data.client.clientName} readOnly /></div>
            <div><Label>Client Designation</Label><Input value={data.client.designation} readOnly /></div>
            <div><Label>Company Name (Optional)</Label><Input value={data.client.companyName} readOnly /></div>
            <div><Label>Mobile Number</Label><Input value={data.client.phone} readOnly /></div>
            <div><Label>WhatsApp Number</Label><Input value={data.client.whatsapp} readOnly /></div>
            <div><Label>Alternate Number</Label><Input value={data.client.alternate} readOnly /></div>
            <div><Label>Email ID (Official)</Label><Input value={data.client.email} readOnly /></div>
            <div><Label>Sales Executive</Label><Input value={data.client.salesExecutive} readOnly /></div>
            <div><Label>Lead</Label><Input value={data.client.lead} readOnly /></div>
            <div><Label>Deal</Label><Input value={data.client.deal} readOnly /></div>
            <div><Label>Relationship</Label><Input value={data.client.relationship} readOnly /></div>
          </div>
        </div>

        {/* Project Info */}
        <div className="bg-white p-5 rounded-lg shadow-sm border">
          <SectionHeader
            title="Project Information"
            onRemark={() => openRemark("projectInformationRemark")}
          />
          <div className="grid grid-cols-4 gap-6">
            <div><Label>Project Name</Label><Input value={data.project.projectName} readOnly /></div>
            <div><Label>Project Code</Label><Input value={data.project.projectCode} readOnly /></div>
            <div><Label>Assigned Date</Label><Input value={data.project.assignedDate} readOnly /></div>
          </div>
          <div className="mt-4">
            <Label>Recce Notes</Label>
            <TextArea value={data.project.recceNotes} rows={2} readOnly />
          </div>
        </div>

        {/* Site Address */}
        <div className="bg-white p-5 rounded-lg shadow-sm border">
          <SectionHeader
            title="Site Address"
            onRemark={() => openRemark("sideAddressRemark")}
          />
          <TextArea value={data.site.address} rows={3} readOnly />
          <div className="w-full h-48 border-2 border-gray-300 rounded-lg overflow-hidden mt-4">
            <iframe
              title="Google Map"
              width="100%"
              height="100%"
              loading="lazy"
              src={`https://www.google.com/maps?q=${data.site.location}&output=embed`}
            />
          </div>
        </div>

        {/* Assets */}
        <div className="bg-white p-5 rounded-lg shadow-sm border">
          <SectionHeader
            title="Design Assets"
            onRemark={() => openRemark("designAssetsRemark")}
          />
          <div className="flex gap-3">
            {data.assets.map((a, i) => (
              <FileBadge key={i} name={a.name} onClick={() => openAssetModal(a.name)} />
            ))}
          </div>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <SectionTitle title="Checklist" />
          <div className="grid grid-cols-3 gap-4">
            {checklist.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-md cursor-pointer select-none hover:bg-gray-100 transition-colors"
                onClick={() => toggleChecklist(idx)}
              >
                <div
                  className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors
                    ${item.checked
                      ? "bg-blue-600 border-blue-600"
                      : "bg-white border-gray-300"
                    }`}
                >
                  {item.checked && (
                    <Check size={14} className="text-white" />
                  )}
                </div>
                <span
                  className={`text-sm font-medium ${item.checked ? "text-gray-800" : "text-gray-600"
                    }`}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback */}
        <div className="bg-white p-5 rounded-lg shadow-sm border">
          <SectionHeader
            title="Recce Feedback Panel"
            onRemark={() => openRemark("Recce Feedback Panel")}
          />

          {/* 📝 Comment – ALWAYS */}
          <div className="mb-4">
            <Label>Recce Executive Comment</Label>
            <TextArea
              value={formData.comment}
              onChange={(e) => handleChange("comment", e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* ⭐ Rating – ALWAYS */}
            <div>
              <Label>Remark Score</Label>
              <div className="flex items-center justify-between bg-gray-50 border rounded-md px-3 py-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={18}
                      onClick={() => handleChange("rating", star)}
                      className={`cursor-pointer ${star <= formData.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                        }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {formData.rating}/5
                </span>
              </div>
            </div>

            {/* Decision */}
            <div>
              <Label>Final Decision</Label>
              <select
                value={formData.decision}
                onChange={(e) => handleChange("decision", e.target.value)}
                className={`w-full border rounded-md px-3 py-2.5 text-sm transition
          ${decisionColor[formData.decision] ||
                  "bg-white text-gray-700 border-gray-300"
                  }
        `}
              >
                <option value="">Select Decision</option>
                <option value="accept">✅ Accept</option>
                <option value="decline">❌ Decline</option>
                <option value="flag">🚩 Flag</option>
              </select>
            </div>
          </div>

          {/* Decline Remark */}
          {formData.decision === "decline" && (
            <div className="mt-4">
              <Label>Decline Remark</Label>
              <TextArea
                value={formData.declineRemark}
                onChange={(e) =>
                  handleChange("declineRemark", e.target.value)
                }
                rows={2}
              />
            </div>
          )}

          {/* Flag Fields */}
          {formData.decision === "flag" && (
            <div className="grid grid-cols-2 gap-6 mt-4">
              <div>
                <Label>Flag Type</Label>
                <select
                  value={formData.flagType}
                  onChange={(e) => handleChange("flagType", e.target.value)}
                  className="w-full border rounded-md px-3 py-2.5 text-sm"
                >
                  <option value="">Select Flag Type</option>
                  <option value="High Impact">🔴 High Impact</option>
                  <option value="Medium Impact">🟡 Medium Impact</option>
                  <option value="Low Impact">🟢 Low Impact</option>
                </select>
              </div>

              <div>
                <Label>Flag Remark</Label>
                <TextArea
                  value={formData.flagRemark}
                  onChange={(e) =>
                    handleChange("flagRemark", e.target.value)
                  }
                  rows={2}
                />
              </div>
            </div>
          )}
        </div>


        {/* Submit */}
        <div className="flex justify-end bg-white p-5 rounded-lg shadow-sm border">
          <button
            onClick={handleSubmitFeedback}
            // className="bg-blue-600 text-white px-6 py-2.5 rounded-md font-semibold hover:bg-blue-700"
            className="bg-blue-600 text-white px-6 py-2.5 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50"
            disabled={isLoading}

          >
            {isLoading ? "Submitting..." : "Submit Recce Feedback"}
          </button>
        </div>
      </div>

      {/* Asset Modal */}
      {assetModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with stronger blur */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={closeAssetModal}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b bg-white">
              <h3 className="text-xl font-semibold text-gray-900 leading-none">
                {assetModal.assetName}
              </h3>
              <button
                onClick={closeAssetModal}
                className="p-2 hover:bg-gray-100 text-gray-500 hover:text-gray-700 rounded-full transition-all"
              >
                <X size={22} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="flex items-center justify-center min-h-[400px] bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl">
                <div className="text-center">
                  <p className="text-gray-400 font-medium italic">
                    Previewing: {assetModal.assetName}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end items-center gap-3 p-4 border-t bg-gray-50/80 backdrop-blur-sm">
              <button
                onClick={closeAssetModal}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => window.open(`#`, "_blank")}
                className="px-5 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-200 active:scale-95"
              >
                Download Asset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔔 Remark Modal */}


      <Dialog open={remarkModal.open} onClose={() => setRemarkModal({ open: false })}>
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

        {/* Modal */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white w-full max-w-lg rounded-xl shadow-xl">

            {/* Header */}
            <div className="flex justify-between items-center px-5 py-4 border-b">
              <Dialog.Title className="text-lg font-semibold">
                Additional Instructions / Remarks
              </Dialog.Title>
              <button
                onClick={() => setRemarkModal({ open: false })}
                className="text-gray-500 hover:text-black"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-5">

              {/* Rating Score */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating Score
                </label>

                <div className="flex items-center justify-between border rounded-md px-4 py-3">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() =>
                          setRemarkModal((p) => ({ ...p, rating: star }))
                        }
                        className={`text-xl transition ${star <= remarkModal.rating
                          ? "text-yellow-400"
                          : "text-gray-300 hover:text-yellow-300"
                          }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>

                  <span className="text-sm text-gray-500">
                    {remarkModal.rating || 0}/5
                  </span>
                </div>
              </div>

              {/* Remark */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remark
                </label>
                <textarea
                  rows={4}
                  value={remarkModal.remark}
                  onChange={(e) =>
                    setRemarkModal((p) => ({ ...p, remark: e.target.value }))
                  }
                  placeholder="Enter your remark here..."
                  className="w-full border rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-5 py-4 border-t">
              <button
                onClick={() => setRemarkModal({ open: false })}
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={saveRemark}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

    </div>
  );
};

export default SalesInRecceDetailPage;
