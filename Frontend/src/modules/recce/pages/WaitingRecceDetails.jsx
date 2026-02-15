import React, { useState, useRef } from "react";
import { MapPin, Upload, X, Plus, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

// --- REUSABLE COMPONENTS ---
const SectionTitle = ({ title }) => (
  <h3 className="text-sm font-bold text-black mb-3">{title}</h3>
);

const Label = ({ children }) => (
  <label className="block text-xs font-semibold text-gray-700 mb-1">
    {children}
  </label>
);

const Input = ({
  value,
  placeholder,
  type = "text",
  readOnly = false,
  className = "",
  onChange,
}) => (
  <input
    type={type}
    value={value || ""}
    onChange={onChange}
    placeholder={placeholder}
    readOnly={readOnly}
    className={`w-full text-sm border border-gray-200 rounded px-3 py-2 text-gray-700 focus:outline-none bg-gray-50 
    ${
      readOnly
        ? "cursor-not-allowed focus:border-gray-200"
        : "focus:border-blue-500"
    } 
    ${className}`}
  />
);

const TextArea = ({
  value,
  placeholder,
  rows = 3,
  readOnly,
  onChange,
  className = "",
}) => (
  <textarea
    value={value || ""}
    onChange={onChange}
    placeholder={placeholder}
    rows={rows}
    readOnly={readOnly}
    className={`w-full text-sm border border-gray-200 rounded px-3 py-2 text-gray-700 focus:outline-none bg-gray-50 resize-none 
    ${
      readOnly
        ? "cursor-not-allowed focus:border-gray-200"
        : "focus:border-blue-500"
    } 
    ${className}`}
  />
);

const FileBadge = ({ name, type = "blue" }) => {
  const colors =
    type === "blue" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600";
  return (
    <div
      className={`inline-flex items-center px-3 py-1.5 rounded text-xs font-medium ${colors} mr-2 mb-2 hover:opacity-80`}
    >
      {name}
    </div>
  );
};

const InfoBox = ({ title, items }) => (
  <div className="bg-gray-50 p-3 rounded mb-3 border border-gray-100">
    <h4 className="text-xs font-bold text-gray-800 mb-2">{title}</h4>
    <ul className="list-disc list-inside space-y-1">
      {items.map((item, idx) => (
        <li key={idx} className="text-xs text-gray-600 pl-1">
          {item}
        </li>
      ))}
    </ul>
  </div>
);

// --- CUSTOM HOOK ---
const useSectionForm = (
  storageKey,
  initialValues,
  validateFn,
  onSaveCallback
) => {
  const [data, setData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isEditable, setIsEditable] = useState(false);

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSave = () => {
    const newErrors = validateFn ? validateFn(data) : {};
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setIsEditable(false);
      if (onSaveCallback) onSaveCallback();
    }
  };

  const handleCancel = () => {
    setData(initialValues);
    setErrors({});
    setIsEditable(false);
  };

  return {
    data,
    errors,
    isEditable,
    handleChange,
    handleEdit: () => setIsEditable(true),
    handleSave,
    handleCancel,
    setData,
  };
};

const WaitingRecceDetails = () => {
  const navigate = useNavigate();
  // const { id } = useParams(); // ID not currently used but kept for routing context
  
  // --- DYNAMIC TIME STATE ---
  const [lastSaved, setLastSaved] = useState(
    new Date()
      .toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replace(",", "")
      .replace(" ", "-")
      .replace("-", "-")
  );

  const updateSaveTime = () => {
    setLastSaved(
      new Date()
        .toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
        .replace(",", "")
        .replace(" ", "-")
        .replace("-", "-")
    );
  };

  // --- SECTIONS (Initial Static Data) ---
  const basic = useSectionForm(
    "recce_basic_info",
    {
      clientCode: "CL-2025-001",
      clientName: "Rahul Singh",
      clientDesignation: "Manager",
      companyName: "Tech Solutions Pvt Ltd",
      mobileNumber: "+91 9876543210",
      whatsappNumber: "+91 9876543210",
      alternateNumber: "",
      email: "rahul@techsol.com",
      salesExecutive: "Amit Kumar",
      lead: "Website Inquiry",
      deal: "Closed",
      relationship: "Existing",
    },
    null,
    updateSaveTime
  );

  const contact = useSectionForm(
    "recce_contact_info",
    {
      person: "Shivam Rai",
      designation: "Site Supervisor",
      contactNumber: "+91 8888899999",
      alternateNumber: "",
      email: "shivam@techsol.com",
    },
    null,
    updateSaveTime
  );

  const project = useSectionForm(
    "recce_project_info",
    {
      projectName: "Office Signage Refurbishment",
      projectCode: "PRJ-SIGN-88",
      assignedDate: "10-12-2025 09:00 AM",
      finalRecceConfirmation: "Pending",
      receivedDate: "11-12-2025",
      recceNotes: "Ensure measurements are taken for the main lobby wall.",
    },
    null,
    updateSaveTime
  );

  const site = useSectionForm(
    "recce_site_info",
    {
      fullAddress: "Plot No. 45, Sector 62, Noida, Uttar Pradesh",
      landmark: "Near Metro Station",
    },
    null,
    updateSaveTime
  );

  // --- DESIGN ASSETS ---
  const [assetsList] = useState([
    "brand_font.ttf",
    "logo.ai",
    "reference_mockup.jpg",
    "color_palette.pdf",
  ]);

  // --- CLIENT INTERACTION ---
  const proofFileRef = useRef(null);
  const [clientInteraction, setClientInteraction] = useState({
    metClient: true,
    personMet: "Shivam Rai",
    contactNumber: "+91 8888899999",
    reasonForNotMeeting: "",
    rescheduleDate: "",
    proofImage: "site_visit_proof.jpg",
  });

  const handleInteractionChange = (field, value) => {
    setClientInteraction((prev) => ({ ...prev, [field]: value }));
  };

  const handleProofFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setClientInteraction((prev) => ({
        ...prev,
        proofImage: e.target.files[0].name,
      }));
    }
  };

  // --- CHECKLIST ---
  const [checklist, setChecklist] = useState([
    { label: "Tools Ready", checked: true },
    { label: "Recce Form Ready", checked: true },
    { label: "Client Confirmed", checked: true },
    { label: "GPS Camera ON", checked: true },
    { label: "Device Storage Checked", checked: true },
  ]);

  const toggleChecklist = (idx) => {
    const updated = [...checklist];
    updated[idx].checked = !updated[idx].checked;
    setChecklist(updated);
  };

  // --- RAW RECCE ---
  const rawFileRef = useRef(null);
  const [rawRecceImages, setRawRecceImages] = useState([
    { id: 1, name: "Front Facade", desc: "Main entrance view", file: "IMG_2025.jpg" },
  ]);
  const [activeUploadIndex, setActiveUploadIndex] = useState(null);

  const handleAddRawImage = () => {
    const newId = Date.now();
    setRawRecceImages((prev) => [
      ...prev,
      { id: newId, name: `Image ${prev.length + 1}`, desc: "", file: null },
    ]);
  };

  const handleRemoveRawImage = (idx) => {
    const updated = rawRecceImages.filter((_, i) => i !== idx);
    setRawRecceImages(updated);
  };

  const handleRawImageChange = (idx, field, value) => {
    const updated = [...rawRecceImages];
    updated[idx][field] = value;
    setRawRecceImages(updated);
  };

  const triggerRawFileUpload = (idx) => {
    setActiveUploadIndex(idx);
    if (rawFileRef.current) rawFileRef.current.click();
  };

  const handleRawFileSelect = (e) => {
    if (e.target.files && e.target.files[0] && activeUploadIndex !== null) {
      const file = e.target.files[0];
      const updated = [...rawRecceImages];
      updated[activeUploadIndex].file = file.name;
      setRawRecceImages(updated);
      setActiveUploadIndex(null);
      e.target.value = "";
    }
  };

  // --- PRODUCT LOGIC ---
  const [products, setProducts] = useState([
    { id: 1, name: "LED Frontlit Board", code: "FN-LIT-021", status: "Done" },
    {
      id: 2,
      name: "Acrylic Letters",
      code: "ACR-LET-005",
      status: "Draft",
    },
  ]);

  const handleAddProduct = () => {
    const newId = Date.now();
    setProducts((prev) => [
      ...prev,
      { id: newId, name: "", code: "", status: "New" },
    ]);
  };

  const handleRemoveProduct = (idx) => {
    const updated = products.filter((_, i) => i !== idx);
    setProducts(updated);
  };

  const handleProductChange = (idx, field, value) => {
    const updated = [...products];
    updated[idx][field] = value;
    setProducts(updated);
  };

  const handleProductAction = (product) => {
    if (product.status === "New" || product.status === "Draft") {
      let nextPath = "/recce/product-requirements"; 
      if (product.status === "New") {
        const updatedProducts = products.map((p) =>
          p.id === product.id
            ? { ...p, status: "Draft", lastStep: nextPath }
            : p
        );
        setProducts(updatedProducts); 
      }
      else if (product.status === "Draft" && product.lastStep) {
        nextPath = product.lastStep;
      }
      navigate(nextPath);
    }
  };

  const getButtonStyle = (status) => {
    const baseClasses =
      "text-white text-xs px-4 py-2 rounded font-medium shadow-sm flex items-center justify-center gap-2";

    switch (status) {
      case "Done":
        return `${baseClasses} bg-green-500 cursor-default opacity-90`;
      case "Draft":
        return `${baseClasses} bg-yellow-500 hover:bg-yellow-600 cursor-pointer`;
      case "New":
        return `${baseClasses} bg-blue-600 hover:bg-blue-700 cursor-pointer`;
      default:
        return `${baseClasses} bg-gray-400`;
    }
  };

  const getButtonLabel = (status) => {
    switch (status) {
      case "Done":
        return "Done Recce";
      case "Draft":
        return "Draft Recce"; 
      case "New":
        return "New Recce";
      default:
        return "Recce";
    }
  };
  
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white p-3 shadow-sm flex justify-between items-center mb-4 rounded-t-lg">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-gray-800">Waiting Recce Details</h1>
        </div>
        <span className="text-xs text-gray-500">
          Auto Saved on: {lastSaved}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* LEFT COLUMN */}
        <div className="space-y-4">
         
          {/* Basic Client Info */}
          <div className="bg-white p-4 rounded shadow-sm relative">
            <div className="flex items-center justify-between mb-3">
              <SectionTitle title="Basic Client Information" />
              <div className="flex items-center gap-2">
                {!basic.isEditable ? (
                  <button
                    onClick={basic.handleEdit}
                    className="text-xs px-3 py-1 border rounded bg-gray-50 hover:bg-gray-100"
                  >
                    Edit
                  </button>
                ) : (
                  <>
                    <button
                      onClick={basic.handleSave}
                      className="text-xs px-3 py-1 bg-blue-600 text-white rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={basic.handleCancel}
                      className="text-xs px-3 py-1 border rounded bg-white ml-2"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {[
                { label: "Client Code", key: "clientCode" },
                { label: "Client Name", key: "clientName" },
                { label: "Client Designation", key: "clientDesignation" },
                { label: "Company Name", key: "companyName" },
                { label: "Mobile Number", key: "mobileNumber" },
                { label: "WhatsApp Number", key: "whatsappNumber" },
                { label: "Alternate Number", key: "alternateNumber" },
                { label: "Email ID", key: "email" },
                { label: "Sales Executive", key: "salesExecutive" },
                { label: "Lead", key: "lead" },
                { label: "Deal", key: "deal" },
                { label: "Relationship", key: "relationship" },
              ].map((field) => (
                <div key={field.key}>
                  <Label>{field.label}</Label>
                  <Input
                    value={basic.data[field.key]}
                    placeholder={field.label}
                    readOnly={!basic.isEditable}
                    onChange={(e) =>
                      basic.handleChange(field.key, e.target.value)
                    }
                  />
                  {basic.errors[field.key] && (
                    <div className="text-xs text-red-600 mt-1">
                      {basic.errors[field.key]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Contact Person */}
          <div className="bg-white p-4 rounded shadow-sm relative">
            <div className="flex items-center justify-between mb-3">
              <SectionTitle title="Contact Person Details (On Site)" />
              <div className="flex items-center gap-2">
                {!contact.isEditable ? (
                  <button
                    onClick={contact.handleEdit}
                    className="text-xs px-3 py-1 border rounded bg-gray-50 hover:bg-gray-100"
                  >
                    Edit
                  </button>
                ) : (
                  <>
                    <button
                      onClick={contact.handleSave}
                      className="text-xs px-3 py-1 bg-blue-600 text-white rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={contact.handleCancel}
                      className="text-xs px-3 py-1 border rounded bg-white ml-2"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label>Contact Person</Label>
                <Input
                  value={contact.data.person}
                  readOnly={!contact.isEditable}
                  onChange={(e) =>
                    contact.handleChange("person", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>Contact Person Designation</Label>
                <Input
                  value={contact.data.designation}
                  readOnly={!contact.isEditable}
                  onChange={(e) =>
                    contact.handleChange("designation", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>Contact Number</Label>
                <Input
                  value={contact.data.contactNumber}
                  readOnly={!contact.isEditable}
                  onChange={(e) =>
                    contact.handleChange("contactNumber", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>Alternate Number</Label>
                <Input
                  value={contact.data.alternateNumber}
                  readOnly={!contact.isEditable}
                  onChange={(e) =>
                    contact.handleChange("alternateNumber", e.target.value)
                  }
                />
              </div>
              <div className="col-span-2">
                <Label>Email</Label>
                <Input
                  value={contact.data.email}
                  readOnly={!contact.isEditable}
                  onChange={(e) =>
                    contact.handleChange("email", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Project Info */}
          <div className="bg-white p-4 rounded shadow-sm relative">
            <div className="flex items-center justify-between mb-3">
              <SectionTitle title="Project Information" />
              <div className="flex items-center gap-2">
                {!project.isEditable ? (
                  <button
                    onClick={project.handleEdit}
                    className="text-xs px-3 py-1 border rounded bg-gray-50 hover:bg-gray-100"
                  >
                    Edit
                  </button>
                ) : (
                  <>
                    <button
                      onClick={project.handleSave}
                      className="text-xs px-3 py-1 bg-blue-600 text-white rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={project.handleCancel}
                      className="text-xs px-3 py-1 border rounded bg-white ml-2"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label>Project Name</Label>
                <Input
                  value={project.data.projectName}
                  readOnly={!project.isEditable}
                  onChange={(e) =>
                    project.handleChange("projectName", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>Project Code</Label>
                <Input
                  value={project.data.projectCode}
                  readOnly={!project.isEditable}
                  onChange={(e) =>
                    project.handleChange("projectCode", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>Assigned Date</Label>
                <Input
                  value={project.data.assignedDate}
                  readOnly={!project.isEditable}
                  onChange={(e) =>
                    project.handleChange("assignedDate", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>Final Recce Confirmation</Label>
                <Input
                  value={project.data.finalRecceConfirmation}
                  readOnly={!project.isEditable}
                  onChange={(e) =>
                    project.handleChange(
                      "finalRecceConfirmation",
                      e.target.value
                    )
                  }
                />
              </div>
              <div>
                <Label>Received Date</Label>
                <Input
                  value={project.data.receivedDate}
                  readOnly={!project.isEditable}
                  onChange={(e) =>
                    project.handleChange("receivedDate", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="mb-2">
              <Label>Recce Notes / Remark</Label>
              <TextArea
                value={project.data.recceNotes}
                rows={2}
                readOnly={!project.isEditable}
                onChange={(e) =>
                  project.handleChange("recceNotes", e.target.value)
                }
              />
            </div>
          </div>

          {/* Site Address */}
          <div className="bg-white p-4 rounded shadow-sm relative">
            <div className="flex items-center justify-between mb-3">
              <SectionTitle title="Site Address" />
              <div className="flex items-center gap-2">
                {!site.isEditable ? (
                  <button
                    onClick={site.handleEdit}
                    className="text-xs px-3 py-1 border rounded bg-gray-50 hover:bg-gray-100"
                  >
                    Edit
                  </button>
                ) : (
                  <>
                    <button
                      onClick={site.handleSave}
                      className="text-xs px-3 py-1 bg-blue-600 text-white rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={site.handleCancel}
                      className="text-xs px-3 py-1 border rounded bg-white ml-2"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="mb-4">
              <Label>Full Address</Label>
              <TextArea
                value={site.data.fullAddress}
                rows={3}
                readOnly={!site.isEditable}
                onChange={(e) =>
                  site.handleChange("fullAddress", e.target.value)
                }
              />
            </div>
            <div className="mb-4">
              <Label>Landmark</Label>
              <Input
                value={site.data.landmark}
                readOnly={!site.isEditable}
                onChange={(e) => site.handleChange("landmark", e.target.value)}
              />
            </div>
            {/* Map Section */}
            <div className="w-full h-32 bg-blue-50 border border-blue-100 rounded flex items-center justify-center overflow-hidden relative">
              <div className="absolute inset-0 bg-gray-200 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/OpenStreetMap_Layer.png')] bg-cover bg-center opacity-80"></div>
              {/* relative class used to prevent z-index overlap with header */}
              <div className="relative bg-white p-2 rounded shadow flex items-center gap-2">
                <MapPin className="text-red-500" size={16} />
                <span className="text-xs font-bold text-gray-700">
                  {site.data.landmark || "Orbit Plaza"}
                </span>
              </div>
            </div>
          </div>
          {/* Design Assets - Read Only */}
          <div className="bg-white p-4 rounded shadow-sm relative">
            <div className="flex items-center justify-between mb-3">
              <SectionTitle title="Design Assets Provided by Sales" />
            </div>
            <div className="flex flex-wrap gap-4 mb-4">
              {assetsList.map((a, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <FileBadge name={a} />
                </div>
              ))}
            </div>
            <FileBadge name="color_palette.pdf" />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">
          {/* Instructions */}
          <div className="bg-white p-4 rounded shadow-sm">
            <SectionTitle title="Instructions" />
            <InfoBox
              title="Client Instructions (To Recce)"
              items={[
                "Wants bright visibility at night",
                "Prefers bold letters",
                "Wants exact positioning above shutter",
              ]}
            />
            <InfoBox
              title="Sales Instructions (To Recce)"
              items={[
                "Take marking photo exactly where signage will be installed",
                "Confirm client's preferred color tone",
                "Capture at least 8 photos and 360° video",
              ]}
            />
          </div>

          {/* Client Interaction */}
          <div className="bg-white p-4 rounded shadow-sm">
            <SectionTitle title="Client Interaction" />
            <input
              type="file"
              ref={proofFileRef}
              className="hidden"
              onChange={handleProofFileUpload}
            />
            <div className="grid grid-cols-12 gap-4 mb-4">
              <div className="col-span-3">
                <Label>Met Client on Site?</Label>
                <div className="flex">
                  <button
                    onClick={() => handleInteractionChange("metClient", true)}
                    className={`text-xs px-4 py-2 rounded-l border ${
                      clientInteraction.metClient
                        ? "bg-blue-100 text-blue-700 border-blue-200"
                        : "bg-white text-gray-500"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => handleInteractionChange("metClient", false)}
                    className={`text-xs px-4 py-2 rounded-r border ${
                      !clientInteraction.metClient
                        ? "bg-blue-100 text-blue-700 border-blue-200"
                        : "bg-white text-gray-500"
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
              <div className="col-span-5">
                <Label>Person Met</Label>
                <Input
                  value={clientInteraction.personMet}
                  onChange={(e) =>
                    handleInteractionChange("personMet", e.target.value)
                  }
                  placeholder="Full Name"
                  readOnly={!clientInteraction.metClient}
                />
              </div>
              <div className="col-span-4">
                <Label>Contact Number</Label>
                <Input
                  value={clientInteraction.contactNumber}
                  onChange={(e) =>
                    handleInteractionChange("contactNumber", e.target.value)
                  }
                  placeholder="Number"
                />
              </div>
            </div>
            {!clientInteraction.metClient && (
              <div className="mb-4">
                <Label>Reason for Not Meeting</Label>
                <Input
                  value={clientInteraction.reasonForNotMeeting}
                  onChange={(e) =>
                    handleInteractionChange(
                      "reasonForNotMeeting",
                      e.target.value
                    )
                  }
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Suggest Reschedule Date</Label>
                <div className="relative">
                  <Input
                    type="date"
                    value={clientInteraction.rescheduleDate}
                    onChange={(e) =>
                      handleInteractionChange("rescheduleDate", e.target.value)
                    }
                  />
                </div>
              </div>
              <div>
                <Label>Upload Proof Image</Label>
                <div
                  onClick={() => proofFileRef.current.click()}
                  className="w-full text-sm border border-gray-200 border-dashed rounded px-3 py-2 text-gray-600 bg-gray-50 flex items-center justify-between cursor-pointer hover:bg-gray-100"
                >
                  <span className="truncate">
                    {clientInteraction.proofImage || "Click to Upload"}
                  </span>
                  <Upload size={14} className="text-blue-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div className="bg-white p-4 rounded shadow-sm">
            <SectionTitle title="Checklist" />
            <div className="space-y-2">
              {checklist.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 cursor-pointer group"
                  onClick={() => toggleChecklist(idx)}
                >
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center ${
                      item.checked
                        ? "bg-green-500 border-green-500"
                        : "bg-gray-50 border-gray-300"
                    }`}
                  >
                    {item.checked && <Check size={10} className="text-white" />}
                  </div>
                  <span
                    className={`text-xs ${
                      item.checked
                        ? "text-gray-800 font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Raw Recce */}
          <div className="bg-white p-4 rounded shadow-sm">
            <SectionTitle title="Raw Recce" />
            <input
              type="file"
              ref={rawFileRef}
              className="hidden"
              onChange={handleRawFileSelect}
            />
            <div className="mb-2">
              <Label>Upload Raw Recce Images</Label>
            </div>
            {rawRecceImages.map((img, idx) => (
              <div
                key={img.id}
                className="mb-6 border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="flex gap-2 mb-2">
                  <div
                    onClick={() => triggerRawFileUpload(idx)}
                    className="flex-1 border border-gray-200 rounded p-2 flex items-center justify-between bg-white cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-gray-500 text-xs">
                      <Upload size={14} />
                      <span>{img.file ? img.file : "Upload File"}</span>
                      {img.file && <span className="text-green-500">✓</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveRawImage(idx)}
                    className="bg-red-100 text-red-600 border border-red-200 p-2 rounded hover:bg-red-200"
                  >
                    <X size={16} />
                  </button>
                  {idx === rawRecceImages.length - 1 && (
                    <button
                      onClick={handleAddRawImage}
                      className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                    >
                      <Plus size={16} />
                    </button>
                  )}
                </div>
                <div className="mb-2">
                  <Label>Product Name</Label>
                  <Input
                    value={img.name}
                    onChange={(e) =>
                      handleRawImageChange(idx, "name", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Input
                    value={img.desc}
                    onChange={(e) =>
                      handleRawImageChange(idx, "desc", e.target.value)
                    }
                    placeholder="Add description..."
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Product Section */}
          <div className="bg-white p-4 rounded shadow-sm">
            <SectionTitle title="Product Section (From Sales Team)" />
            <div className="mb-4">
              <Label>Client Requirement</Label>
              <div className="bg-gray-50 p-3 rounded text-xs text-gray-600 border border-gray-100">
                Client wants a bright LED board that is clearly visible from the
                main road.
              </div>
            </div>

            <div className="space-y-4">
              {products.map((prod, idx) => (
                <div
                  key={prod.id}
                  className="grid grid-cols-12 gap-2 items-end"
                >
                  <div className="col-span-1 text-center">
                    <Label>S.No.</Label>
                    <div className="text-xs p-2 bg-gray-50 rounded border text-center">
                      {idx + 1}
                    </div>
                  </div>
                  <div className="col-span-4">
                    <Label>Product Name</Label>
                    <Input
                      value={prod.name}
                      onChange={(e) =>
                        handleProductChange(idx, "name", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-span-3">
                    <Label>Product Code</Label>
                    <Input
                      value={prod.code}
                      onChange={(e) =>
                        handleProductChange(idx, "code", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-span-3">
                    <Label>Status</Label>
                    <button
                      onClick={() => handleProductAction(prod)}
                      className={`w-full text-xs py-2 rounded transition-colors ${getButtonStyle(
                        prod.status
                      )}`}
                    >
                      {getButtonLabel(prod.status)}
                    </button>
                  </div>
                  <div className="col-span-1">
                    <Label>Action</Label>
                    <button
                      onClick={() => handleRemoveProduct(idx)}
                      className="w-full h-[34px] flex items-center justify-center bg-red-50 border border-red-200 text-red-600 rounded hover:bg-red-100 transition-colors"
                      title="Remove Product"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <button
                onClick={handleAddProduct}
                className="bg-blue-600 text-white text-xs px-4 py-2 rounded font-medium shadow-sm hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus size={14} /> Add Product
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- NEW SECTION: RECCE WAITING LOGS (Replaces Planning Logs) --- */}
      <div className="bg-white p-4 rounded shadow-sm mt-4">
        <SectionTitle title="Recce Waiting Logs" />

        {/* Row 1: Status & Dates */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <Label>Recce Status</Label>
            <div className="w-full text-sm border border-gray-200 rounded px-3 py-2 text-red-600 bg-red-50 font-medium">
              Hold By Client
            </div>
          </div>
          <div>
            <Label>1st Asking Date</Label>
            <Input value="11/12/25 10:00 AM" readOnly={true} />
          </div>
          <div>
            <Label>Waiting Time</Label>
            <Input value="1 Day, 3 hrs, 44 Minutes" readOnly={true} />
          </div>
          <div>
            <Label>Last Updated Date</Label>
            <Input value="11/12/25 10:00 AM" readOnly={true} />
          </div>
        </div>

        {/* Row 2: Discussion 1 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="md:col-span-1">
            <Label>Discussion Date</Label>
            <Input value="11/12/25 10:00 AM" readOnly={true} />
          </div>
          <div className="md:col-span-3">
            <Label>Discussion Summery</Label>
            <Input 
              value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore" 
              readOnly={true} 
            />
          </div>
        </div>

        {/* Row 3: Discussion 2 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="md:col-span-1">
            <Label>Discussion Date</Label>
            <Input value="12/12/25 10:00 AM" readOnly={true} />
          </div>
          <div className="md:col-span-3">
            <Label>Discussion Summery</Label>
            <Input 
              value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore" 
              readOnly={true} 
            />
          </div>
        </div>

        {/* Row 4: Remark */}
        <div>
          <Label>Remark</Label>
          <div className="w-full text-sm border border-gray-200 rounded px-3 py-2 text-gray-600 bg-gray-50 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </div>
        </div>
      </div>

    </div>
  );
};

export default WaitingRecceDetails;