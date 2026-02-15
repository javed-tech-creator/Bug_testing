    import React, { useState, useEffect, useRef } from "react";
    import {
      ArrowLeft,
      Lightbulb,
      MapPin,
      Upload,
      X,
      Plus,
      Check,
      Eye,
      Save,
      Rocket,
    } from "lucide-react";
    import { useNavigate, useParams, useLocation } from "react-router-dom";
    import { useSelector } from "react-redux";
    import { Dialog } from "@headlessui/react";
    import { toast } from "react-toastify";
    import Loader from "@/components/Loader";
    import PlanningLogModal from "../components/PlanningLogModal";

    // ... (Reusable components) ...
    const SectionTitle = ({ title }) => (
      <h3 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200 uppercase tracking-wide">
        {title}
      </h3>
    );

    const Label = ({ children }) => (
      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
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
        className={`w-full text-sm border border-gray-300 rounded-md px-3 py-2.5 text-gray-800 focus:outline-none bg-gray-50 
        ${
          readOnly
            ? "cursor-not-allowed focus:border-gray-300"
            : "focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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
        className={`w-full text-sm border border-gray-300 rounded-md px-3 py-2.5 text-gray-800 focus:outline-none bg-gray-50 resize-none 
        ${
          readOnly
            ? "cursor-not-allowed focus:border-gray-300"
            : "focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        } 
        ${className}`}
      />
    );

    const FileBadge = ({ name, type = "blue", onClick }) => {
      const colors =
        type === "blue"
          ? "bg-blue-50 text-blue-700 border-blue-200"
          : "bg-gray-100 text-gray-700 border-gray-200";
      return (
        <button
          onClick={onClick}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium border ${colors} mr-2 mb-2 hover:opacity-80 transition-opacity cursor-pointer`}
        >
          <Eye size={16} />
          {name}
        </button>
      );
    };

    const InfoBox = ({ title, items }) => (
      <div className="bg-gray-50 p-4 rounded-md mb-4 border border-gray-200">
        <h4 className="text-sm font-bold text-gray-800 mb-3">{title}</h4>
        <ul className="list-disc list-inside space-y-2">
          {items.map((item, idx) => (
            <li key={idx} className="text-sm text-gray-700 pl-1">
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
      onSaveCallback,
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

    const STATIC_RECCE_DETAILS = {
      _id: "RECCE-001",
      status: "inprogress",
      createdAt: "2025-01-15T10:30:00Z",
      updatedAt: "2025-01-15T12:00:00Z",

      clientId: {
        clientId: "CL-1001",
        name: "GreenFields Pvt Ltd",
        designation: "Manager",
        companyName: "GreenFields",
        phone: "9876543210",
        whatsapp: "9876543210",
        altPhone: "9123456780",
        email: "contact@greenfields.com",
      },

      projectId: {
        projectId: "PRJ-101",
        projectName: "Retail Store Branding",
        address: "24, High Street, Andheri West, Mumbai",
        siteLocation: "19.1197,72.8468",
        discussionDone: "Pending",
        remarks: "Client wants high visibility signage",
        products: [
          {
            _id: "P1",
            productId: "LED-001",
            productName: "LED Sign Board",
            quantity: 2,
            status: "New",
          },
        ],
        documents: [
          {
            name: "Design.pdf",
            url: "#",
          },
        ],
      },

      recceAssignment: {
        assignedBy: { name: "Amit Verma" },
        priority: "High",
        assignedAt: "2025-01-14",
      },

      reviewSubmit: {
        checks: [
          { label: "Site photos taken", checked: true },
          { label: "Measurements recorded", checked: false },
        ],
      },
    };

    const RecceDetails = () => {
      const navigate = useNavigate();
      const { id } = useParams();
      const location = useLocation();
      const fromRoute = location.state?.from;
      const isReceivedRecce = fromRoute === "received";
      const isAssignedRecce = fromRoute === "assigned";
      const isUpcomingRecce = fromRoute === "upcoming";

      // Get user role for conditional rendering
      const authData = useSelector((state) => state.auth?.userData);
      const user = authData?.user || {};
      const userRole = user?.designation?.title?.toLowerCase();
      const isExecutive = {
        executive: true,
        "recce executive": true,
      }[userRole] || false;

      const recceDetails = STATIC_RECCE_DETAILS;
      const productListData = {
        data: [
          {
            _id: "LED-001",
            title: "LED Sign Board",
            productId: "LED-001",
          },
          {
            _id: "ACP-002",
            title: "ACP Signage",
            productId: "ACP-002",
          },
          {
            _id: "NEON-003",
            title: "Neon Sign Board",
            productId: "NEON-003",
          },
        ],
      };

      const [recceStatus, setRecceStatus] = useState();
      const [lastStep, setLastStep] = useState(
        recceDetails?.lastStep || "/recce/product-requirements",
      );

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
          .replace("-", "-"),
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
            .replace("-", "-"),
        );
      };

      // --- SECTIONS (Initial Static Data) ---
      const basic = useSectionForm("recce_basic_info", {}, null, updateSaveTime);
      const contact = useSectionForm(
        "recce_contact_info",
        {},
        null,
        updateSaveTime,
      );
      const project = useSectionForm(
        "recce_project_info",
        {},
        null,
        updateSaveTime,
      );
      const site = useSectionForm(
        "recce_site_info",
        { siteLocation: "" },
        null,
        updateSaveTime,
      );

      useEffect(() => {
        if (recceDetails) {
          const projectData = recceDetails.projectId || {};
          const clientData = recceDetails.clientId || {};
          const assignmentData = recceDetails.recceAssignment || {};
          const reviewData = recceDetails.reviewSubmit || {};

          setRecceStatus(
            recceDetails.status ? recceDetails.status.toLowerCase() : "inprogress",
          );
          setLastStep(recceDetails.lastStep || "/recce/product-requirements");

          basic.setData({
            clientCode: clientData.clientId || "",
            clientName: clientData.name || "",
            clientDesignation: clientData.designation || "",
            companyName: clientData.companyName || "",
            mobileNumber: clientData.phone || "",
            whatsappNumber: clientData.whatsapp || "",
            alternateNumber: clientData.altPhone || "",
            email: clientData.email || "",
            salesExecutive: assignmentData.assignedBy?.name || "",
            lead: clientData.leadId?.[0] || "",
            deal: projectData.dealBy || "",
            relationship: projectData.relationshipManager || "",
          });

          contact.setData({
            person: clientData.name || "",
            designation: clientData.designation || "",
            contactNumber: clientData.phone || "",
            alternateNumber: clientData.altPhone || "",
            email: clientData.email || "",
          });

          project.setData({
            projectName: projectData.projectName || "",
            projectCode: projectData.projectId || "",
            assignedDate: assignmentData.assignedAt
              ? assignmentData.assignedAt
              : "",
            finalRecceConfirmation: projectData.discussionDone || "",
            receivedDate: recceDetails.updatedAt
              ? recceDetails.updatedAt.split("T")[0]
              : "",
            recceNotes: projectData.remarks || "",
            deadline: projectData.deadline || "",
            clientRequirement:
              projectData.clientRequirement ||
              (projectData.remarks
                ? `${projectData.remarks}. Signage should have clear branding, high visibility from the main road, durable outdoor material, and text readable from a distance without obstruction.`
                : "Client requires high-visibility signage with clear branding. Preferred durable materials suitable for outdoor conditions, readable from a distance, and compliant with site size constraints."),
            clientExpectation:
              projectData.clientExpectation ||
              (projectData.remarks
                ? "Client expects a premium finish with strong night visibility, clean installation, and color consistency matching brand guidelines. Design should enhance storefront appeal without obstructing CCTV or entry points."
                : "Client expects a premium finish with strong night visibility, clean installation, and color consistency matching brand guidelines."),
          });
          if (isReceivedRecce) {
            project.setData((prev) => ({ ...prev }));
            project.handleEdit();
          }

          site.setData({
            fullAddress: projectData.address || "",
            siteLocation: projectData.siteLocation || "",
          });

          const defaultChecklist = [
            { label: "Tools Ready", checked: false },
            { label: "Recce Form Ready", checked: false },
            { label: "Client Confirmed", checked: false },
            { label: "GPS Camera ON", checked: false },
            { label: "Device Storage Checked", checked: false },
          ];
          const apiChecks = Array.isArray(reviewData.checks)
            ? reviewData.checks
            : [];
          setChecklist(
            defaultChecklist.map((item) => {
              const matched = apiChecks.find((c) => c.label === item.label);
              return matched ? { ...item, checked: matched.checked } : item;
            }),
          );

          if (projectData.documents && projectData.documents.length > 0) {
            const images = projectData.documents.map((doc, idx) => ({
              id: Date.now() + idx,
              name: doc.name || `Image ${idx + 1}`,
              desc: doc.type || "",
              file: doc.url || null,
            }));
            setRawRecceImages(images);
          } else {
            setRawRecceImages([]);
          }

          const assets =
            projectData.documents?.map((doc) => {
              const extractedName =
                doc.name || (doc.url ? doc.url.split("/").pop() : "Document");
              return {
                name: extractedName,
                url: doc.url || "",
              };
            }) || [];
          setAssetsList(assets);

          if (projectData.products && projectData.products.length > 0) {
            const productData = projectData.products.map((prod) => {
              let recceProductId = prod.productId;
              if (recceProductId && typeof recceProductId === "object") {
                recceProductId =
                  recceProductId._id || recceProductId.productId || "";
              }
              let productCode =
                typeof recceProductId === "string" ? recceProductId : "N/A";
              return {
                id: prod._id,
                productId: recceProductId,
                productName: prod.productName,
                productCode,
                quantity: prod.quantity,
                status:
                  !prod.status || prod.status === "PLANNED" || prod.status === "New"
                    ? "New Recce"
                    : prod.status,
              };
            });
            setProducts(productData);
          }
        }
      }, []);

      // --- DESIGN ASSETS ---
      const [assetsList, setAssetsList] = useState([]);
      const [assetModal, setAssetModal] = useState({ isOpen: false, assetName: "" });

      const openAssetModal = (name) => {
        setAssetModal({ isOpen: true, assetName: name });
      };

      const closeAssetModal = () => {
        setAssetModal({ isOpen: false, assetName: "" });
      };

      // --- CLIENT INTERACTION ---
      const proofFileRef = useRef(null);
      const [clientInteraction, setClientInteraction] = useState({
        metClient: false,
        personMet: "",
        contactNumber: "",
        reasonForNotMeeting: "",
        rescheduleDate: "",
        proofImage: "",
      });
      const [isSaving, setIsSaving] = useState(false);

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

      const handleSaveClientInteraction = async () => {
        setIsSaving(true);
        setTimeout(() => {
          toast.success("Client interaction saved (static)");
          setIsSaving(false);
        }, 500);
      };

      // --- CHECKLIST ---
      const [checklist, setChecklist] = useState([]);

      const toggleChecklist = (idx) => {
        const updated = [...checklist];
        updated[idx].checked = !updated[idx].checked;
        setChecklist(updated);
      };

      // --- RAW RECCE ---
      const rawFileRef = useRef(null);
      const [rawRecceImages, setRawRecceImages] = useState([]);
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
      const [products, setProducts] = useState(() => {
        const initialProducts = recceDetails?.projectId?.products || [];
        return initialProducts.map((prod) => ({
          id: prod._id,
          productId: prod.productId,
          productName: prod.productName,
          productCode: prod.productId,
          quantity: prod.quantity || 1,
          status: "New Recce",
        }));
      });

      const [isSavingRecceProduct, setIsSavingRecceProduct] = useState(false);

      const [showAddProductModal, setShowAddProductModal] = useState(false);
      const [modalProductData, setModalProductData] = useState({
        productId: "",
        quantity: "",
        productName: "",
      });

      const handleAddProduct = () => {
        setModalProductData({ productId: "", quantity: "", productName: "" });
        setShowAddProductModal(true);
      };

      const handleModalProductChange = (field, value) => {
        if (field === "quantity") {
          if (!/^\d*$/.test(value)) {
            return;
          }
        } else if (field === "productName") {
          if (!/^[a-zA-Z\s]*$/.test(value)) {
            return;
          }
        }
        setModalProductData((prev) => ({ ...prev, [field]: value }));
      };

      const handleModalSaveProduct = () => {
        if (
          !modalProductData.productId ||
          !modalProductData.quantity ||
          !modalProductData.productName
        ) {
          toast.error(
            "Please select a product, enter quantity, and provide a product name",
          );
          return;
        }
        const alreadyExists = products.some(
          (p) => p.productId === modalProductData.productId,
        );
        if (alreadyExists) {
          toast.error(`Product is already added. Please edit quantity instead.`);
          setShowAddProductModal(false);
          return;
        }
        const nameExists = products.some(
          (p) =>
            p.productName?.toLowerCase().trim() ===
            modalProductData.productName.toLowerCase().trim(),
        );
        if (nameExists) {
          toast.error(
            `Product name "${modalProductData.productName}" already exists. Please use a different name.`,
          );
          return;
        }
        const selected = productListData?.data?.find(
          (p) => p._id === modalProductData.productId,
        );
        const productCode = selected?.productId || "N/A";
        const productName = modalProductData.productName;
        setProducts((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            productId: modalProductData.productId,
            productName,
            productCode,
            quantity: Number(modalProductData.quantity),
            status: "New Recce",
          },
        ]);
        setShowAddProductModal(false);
        setModalProductData({ productId: "", quantity: "", productName: "" });
        toast.success("Product updated (static)");
      };

      const handleRemoveProduct = (idx) => {
        setProducts((prev) => prev.filter((_, i) => i !== idx));
        toast.success("Product updated (static)");
      };

      const handleProductChange = (idx, field, value) => {
        const updated = [...products];
        if (field === "quantity") {
          updated[idx][field] = value < 0 ? 0 : value;
        } else {
          updated[idx][field] = value;
        }
        if (field === "productId") {
          const selected = productListData?.data?.find((p) => p._id === value);
          if (selected) {
            updated[idx].productCode = selected.productId;
          }
        }
        updated[idx].isEdited = true;
        setProducts(updated);
      };

      // --- MODAL STATE ---
      const [showPlanningLogModal, setShowPlanningLogModal] = useState(false);
      const [showDiscussionLogModal, setShowDiscussionLogModal] = useState(false);
      const [selectedPlanningLog, setSelectedPlanningLog] = useState(null);

      // --- STATIC DATA FOR NEW TABLES ---
      const planningLogs = [
        {
          sno: 1,
          dateTime: "15 Jan 2025, 10:30 AM",
          coordinator: "Amit Verma",
          manager: "Neha Kapoor",
          projectStatus: "On Track",
          planningStatus: "Submitted",
          remark: "Initial planning submitted for client review and approval.",
        },
        {
          sno: 2,
          dateTime: "16 Jan 2025, 11:15 AM",
          coordinator: "Rohit Sharma",
          manager: "Rajesh Kumar",
          projectStatus: "Approved",
          planningStatus: "Approved",
          remark: "Planning approved by manager. Proceed with execution phase.",
        },
        {
          sno: 3,
          dateTime: "17 Jan 2025, 02:30 PM",
          coordinator: "Priya Singh",
          manager: "Neha Kapoor",
          projectStatus: "Hold By Client",
          planningStatus: "Rejected",
          remark:
            "Client requested modifications in timeline and resource allocation.",
        },
      ];

      const discussionLogs = [
        {
          id: 1,
          date: "15 Jan 2025, 12:00 PM",
          dept: "Sales",
          repName: "Amit Verma",
          designation: "Sales Manager",
          clientRepName: "Rakesh Patel",
          clientDesignation: "Owner",
          discussion:
            "Client discussed preferred LED size, placement above shutter and power availability.",
          remarks: "Need night visibility mockups",
        },
        {
          id: 2,
          date: "16 Jan 2025, 02:30 PM",
          dept: "Design",
          repName: "Neha Singh",
          designation: "Design Lead",
          clientRepName: "Rakesh Patel",
          clientDesignation: "Owner",
          discussion:
            "Finalized font style and color temperature. Client approved sample visuals.",
          remarks: "Proceed with final design",
        },
      ];

      const isUpdating = isSavingRecceProduct;

      return (
        <div className=" bg-gray-50">
          {isUpdating && (
            <div className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm">
              <Loader />
            </div>
          )}

          {/* Header */}
          <div className="bg-white p-4 shadow-sm flex justify-between items-center mb-6 border-b-2 border-gray-200">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                title="Back"
              >
                <ArrowLeft size={18} />
              </button>
              <h1 className="text-lg font-bold text-gray-800">Recce Details</h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                title="PSL"
                className="flex items-center justify-center px-3 py-2 border bg-blue-600 rounded-md text-white hover:bg-blue-700 transition-all"
                onClick={() => navigate("/recce/psl-page")}
              >
                <Lightbulb className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowDiscussionLogModal(true)}
                className="bg-blue-600 text-white text-xs px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors shadow-sm"
              >
                Client Discussion Logs
              </button>
              {/* <button
                onClick={() => setShowPlanningLogModal(true)}
                className="bg-blue-600 text-white text-xs px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors shadow-sm"
              >
                Planning Logs
              </button> */}
            </div>
          </div>

          <div className="max-w-full mx-auto  space-y-6">
            {/* Basic Client Info - Full Width */}
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <SectionTitle title="Basic Client Information" />
                <div className="flex items-center gap-2">
                  {fromRoute !== "upcoming" &&
                    !isAssignedRecce &&
                    (!basic.isEditable ? (
                      <button
                        onClick={basic.handleEdit}
                        className="text-xs px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors font-medium"
                      >
                        Edit
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={basic.handleSave}
                          className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                        >
                          Save
                        </button>
                        <button
                          onClick={basic.handleCancel}
                          className="text-xs px-3 py-1.5 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors font-medium"
                        >
                          Cancel
                        </button>
                      </>
                    ))}
                </div>
              </div>
              <div className="grid grid-cols-4 gap-6">
                {[
                  { label: "Client Code", key: "clientCode" },
                  { label: "Client Name", key: "clientName" },
                  { label: "Client Designation", key: "clientDesignation" },
                  { label: "Company Name", key: "companyName" },
                  { label: "Mobile Number", key: "mobileNumber", hideInUpcoming: true, executiveOnly: true },
                  { label: "WhatsApp Number", key: "whatsappNumber", hideInUpcoming: true, executiveOnly: true },
                  { label: "Alternate Number", key: "alternateNumber", hideInUpcoming: true, executiveOnly: true },
                  { label: "Email ID", key: "email", hideInUpcoming: true, executiveOnly: true },
                  { label: "Sales Executive", key: "salesExecutive" },
                  { label: "Lead", key: "lead" },
                  { label: "Deal", key: "deal" },
                  { label: "Relationship", key: "relationship" },
                ]
                  .filter((field) => {
                    // Hide contact fields in upcoming recce and for non-executives
                    if (field.hideInUpcoming && field.executiveOnly) {
                      return !isUpcomingRecce && isExecutive;
                    }
                    return true;
                  })
                  .map((field) => (
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

            {/* Contact Person - Full Width */}
            {!isUpcomingRecce && (
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <SectionTitle title="Contact Person Details (On Site)" />
                <div className="flex items-center gap-2">
                  {fromRoute !== "upcoming" &&
                    !isAssignedRecce &&
                    (!contact.isEditable ? (
                      <button
                        onClick={contact.handleEdit}
                        className="text-xs px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors font-medium"
                      >
                        Edit
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={contact.handleSave}
                          className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                        >
                          Save
                        </button>
                        <button
                          onClick={contact.handleCancel}
                          className="text-xs px-3 py-1.5 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors font-medium"
                        >
                          Cancel
                        </button>
                      </>
                    ))}
                </div>
              </div>
              <div className="grid grid-cols-4 gap-6">
                <div>
                  <Label>Contact Person</Label>
                  <Input
                    value={contact.data.person}
                    readOnly={!contact.isEditable}
                    onChange={(e) => contact.handleChange("person", e.target.value)}
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
              </div>
              <div className="grid grid-cols-4 gap-6 mt-6">
                <div>
                  <Label>Email</Label>
                  <Input
                    value={contact.data.email}
                    readOnly={!contact.isEditable}
                    onChange={(e) => contact.handleChange("email", e.target.value)}
                  />
                </div>
              </div>
            </div>
            )}

            {/* Project Info - Full Width */}
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <SectionTitle title="Project Information" />
                <div className="flex items-center gap-2">
                  {fromRoute !== "upcoming" &&
                    !isAssignedRecce &&
                    (!project.isEditable ? (
                      <button
                        onClick={project.handleEdit}
                        className="text-xs px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors font-medium"
                      >
                        Edit
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={project.handleSave}
                          className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                        >
                          Save
                        </button>
                        <button
                          onClick={project.handleCancel}
                          className="text-xs px-3 py-1.5 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors font-medium"
                        >
                          Cancel
                        </button>
                      </>
                    ))}
                </div>
              </div>
              <div className="grid grid-cols-4 gap-6">
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
                {fromRoute === "received" ? (
                  <div>
                    <Label>Deadline</Label>
                    <Input
                      type="date"
                      value={project.data.deadline}
                      readOnly={!project.isEditable}
                      onChange={(e) =>
                        project.handleChange("deadline", e.target.value)
                      }
                    />
                  </div>
                ) : (
                  <div>
                    <Label>Final Recce Confirmation</Label>
                    <Input
                      value={project.data.finalRecceConfirmation}
                      readOnly={!project.isEditable}
                      onChange={(e) =>
                        project.handleChange(
                          "finalRecceConfirmation",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-4 gap-6 mt-6">
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
                <div className="col-span-3">
                  <Label>Recce Notes / Remark</Label>
                  <TextArea
                    value={project.data.recceNotes}
                    rows={1}
                    readOnly={!project.isEditable}
                    onChange={(e) =>
                      project.handleChange("recceNotes", e.target.value)
                    }
                    className="h-[42px]"
                  />
                </div>
              </div>
            </div>

            {/* Site Address - Full Width */}
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <SectionTitle title="Site Address" />
                <div className="flex items-center gap-2">
                  {fromRoute !== "upcoming" &&
                    !isAssignedRecce &&
                    (!site.isEditable ? (
                      <button
                        onClick={site.handleEdit}
                        className="text-xs px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors font-medium"
                      >
                        Edit
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={site.handleSave}
                          className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                        >
                          Save
                        </button>
                        <button
                          onClick={site.handleCancel}
                          className="text-xs px-3 py-1.5 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors font-medium"
                        >
                          Cancel
                        </button>
                      </>
                    ))}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 mb-4">
                <div>
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
                <div className="w-full h-48 border-2 border-gray-300 rounded-lg overflow-hidden">
                  {site.data.siteLocation ? (
                    <iframe
                      title="Google Map"
                      width="100%"
                      height="100%"
                      loading="lazy"
                      allowFullScreen
                      src={`https://www.google.com/maps?q=${site.data.siteLocation}&output=embed`}
                    ></iframe>
                  ) : (
                    <div className="flex justify-center items-center h-full text-gray-500 bg-gray-100">
                      Map Not Available
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Instructions - Full Width */}
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <SectionTitle title="Instructions" />
              <div className="grid grid-cols-3 gap-6">
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
                <InfoBox
                  title="Site Warnings (To Recce)"
                  items={[
                    "Electrical wires above signage area",
                    "Customers crowd during peak hours",
                  ]}
                />
              </div>
            </div>

            {/* Design Assets - Full Width */}
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <SectionTitle title="Design Assets Provided by Sales" />
              <div className="flex flex-wrap gap-3">
                {assetsList.length > 0 ? (
                  assetsList.map((a, idx) => (
                    <FileBadge key={idx} name={a.name} onClick={() => openAssetModal(a.name)} />
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No assets available</p>
                )}
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
                      onClick={() => window.open(`#`, '_blank')}
                      className="px-5 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-200 active:scale-95"
                    >
                      Download Asset
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Conditional Sections */}
            {fromRoute !== "upcoming" && (!isAssignedRecce || isReceivedRecce) && (
              <>
                {/* Client Interaction - Full Width */}
                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                  <SectionTitle title="Client Interaction" />
                  <input
                    type="file"
                    ref={proofFileRef}
                    className="hidden"
                    onChange={handleProofFileUpload}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                      <Label>Met Client on Site?</Label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleInteractionChange("metClient", true)}
                          className={`text-sm px-4 py-2.5 rounded-md border transition-colors ${
                            clientInteraction.metClient
                              ? "bg-blue-100 text-blue-700 border-blue-300"
                              : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          onClick={() =>
                            handleInteractionChange("metClient", false)
                          }
                          className={`text-sm px-4 py-2.5 rounded-md border transition-colors ${
                            !clientInteraction.metClient
                              ? "bg-blue-100 text-blue-700 border-blue-300"
                              : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    {clientInteraction.metClient && (
                      <div className="col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label>Person Met</Label>
                          <Input
                            value={clientInteraction.personMet}
                            onChange={(e) =>
                              handleInteractionChange("personMet", e.target.value)
                            }
                            placeholder="Full Name"
                          />
                        </div>
                        <div>
                          <Label>Contact Number</Label>
                          <Input
                            value={clientInteraction.contactNumber}
                            onChange={(e) =>
                              handleInteractionChange(
                                "contactNumber",
                                e.target.value,
                              )
                            }
                            placeholder="Phone Number"
                            type="tel"
                          />
                        </div>
                      </div>
                    )}

                    {!clientInteraction.metClient && (
                      <div className="col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                        <div className="w-full">
                          <Label>Reason for Not Meeting</Label>
                          <input
                            type="text"
                            value={clientInteraction.reasonForNotMeeting}
                            onChange={(e) =>
                              handleInteractionChange(
                                "reasonForNotMeeting",
                                e.target.value,
                              )
                            }
                            placeholder="Reason..."
                            className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="w-full">
                          <Label>Upload Proof</Label>
                          <div
                            onClick={() => proofFileRef.current.click()}
                            className="w-full text-sm border border-gray-300 border-dashed rounded-md px-3 py-2.5 text-gray-600 bg-gray-50 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
                          >
                            <span className="truncate pr-2">
                              {clientInteraction.proofImage ? (
                                <span className="text-gray-900 font-medium">
                                  {clientInteraction.proofImage
                                    .split("/")
                                    .pop()
                                    .slice(0, 15) + "..."}
                                </span>
                              ) : (
                                "Click to Upload"
                              )}
                            </span>
                            <Upload size={16} className="text-blue-500 shrink-0" />
                          </div>
                        </div>

                        <div className="w-full">
                          <Label>Reschedule Date</Label>
                          <Input
                            type="date"
                            value={clientInteraction.rescheduleDate}
                            onChange={(e) =>
                              handleInteractionChange(
                                "rescheduleDate",
                                e.target.value,
                              )
                            }
                            className="w-full"
                          />
                        </div>
                      </div>
                    )}

                    {/* ... neeche ka save button code same rahega ... */}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleSaveClientInteraction}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                      <Save size={16} />
                      {isSaving ? "Saving..." : "Save Client Interaction"}
                    </button>
                  </div>
                </div>

                {/* Checklist - Full Width */}
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
                            ${
                              item.checked
                                ? "bg-blue-600 border-blue-600"
                                : "bg-white border-gray-300"
                            }`}
                        >
                          {item.checked && (
                            <Check size={14} className="text-white" />
                          )}
                        </div>
                        <span
                          className={`text-sm font-medium ${
                            item.checked ? "text-gray-800" : "text-gray-600"
                          }`}
                        >
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Raw Recce - Full Width */}
                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                  <SectionTitle title="Raw Recce" />

                  <input
                    type="file"
                    ref={rawFileRef}
                    className="hidden"
                    onChange={handleRawFileSelect}
                  />

                  {/* Changed grid-cols-2 to grid-cols-1 so it takes full width */}
                  <div className="grid grid-cols-1 gap-6 w-full">
                    {rawRecceImages.map((img, idx) => (
                      <div
                        key={img.id}
                        className="border-2 border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors w-full bg-white"
                      >
                        {/* --- First Line: Upload, Product Name, and Buttons --- */}
                        <div className="flex flex-col md:flex-row items-end gap-4 w-full">
                          {/* Upload Section */}
                          <div className="flex-1 w-full">
                            <Label>Upload</Label>
                            <div
                              onClick={() => triggerRawFileUpload(idx)}
                              className="border-2 border-dashed border-gray-300 rounded-md p-2.5 flex items-center justify-between bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors h-10"
                            >
                              <div className="flex items-center gap-2 text-gray-600 text-sm overflow-hidden">
                                <Upload size={16} className="shrink-0" />
                                <span className="truncate">
                                  {img.file
                                    ? (() => {
                                        try {
                                          const url = new URL(
                                            img.file,
                                            window.location.origin,
                                          );
                                          const parts = url.pathname.split("/");
                                          return parts[parts.length - 1].length > 30
                                            ? parts[parts.length - 1].slice(0, 15) +
                                                "..." +
                                                parts[parts.length - 1].slice(-10)
                                            : parts[parts.length - 1];
                                        } catch {
                                          const parts = img.file.split("/");
                                          return parts[parts.length - 1].length > 30
                                            ? parts[parts.length - 1].slice(0, 15) +
                                                "..." +
                                                parts[parts.length - 1].slice(-10)
                                            : parts[parts.length - 1];
                                        }
                                      })()
                                    : "Upload File"}
                                </span>
                                {img.file && (
                                  <span className="text-green-500 font-bold shrink-0">
                                    ✓
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Product Name Section */}
                          <div className="flex-1 w-full">
                            <Label>Product Name</Label>
                            <Input
                              value={img.name}
                              className="h-10"
                              onChange={(e) =>
                                handleRawImageChange(idx, "name", e.target.value)
                              }
                            />
                          </div>

                          {/* Buttons (Remove & Add) */}
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => handleRemoveRawImage(idx)}
                              className="w-10 h-10 bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100 transition-colors flex items-center justify-center"
                              title="Remove"
                            >
                              <X size={18} />
                            </button>

                            {idx === rawRecceImages.length - 1 &&
                              (isReceivedRecce || !isAssignedRecce) && (
                                <button
                                  onClick={handleAddRawImage}
                                  className="w-10 h-10 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                                  title="Add New"
                                >
                                  <Plus size={18} />
                                </button>
                              )}
                          </div>
                        </div>

                        {/* --- Second Line: Description --- */}
                        <div className="mt-4 w-full">
                          <Label>Description</Label>
                          <Input
                            value={img.desc}
                            onChange={(e) =>
                              handleRawImageChange(idx, "desc", e.target.value)
                            }
                            placeholder="Add description..."
                            className="w-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Product Section - Full Width */}
                <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                  <SectionTitle title="Product Section (From Sales Team)" />

                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <Label>Client Requirement</Label>
                      <TextArea
                        value={project.data.clientRequirement}
                        rows={3}
                        readOnly={!isReceivedRecce}
                        onChange={(e) =>
                          project.handleChange("clientRequirement", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label>Client Expectation</Label>
                      <TextArea
                        value={project.data.clientExpectation}
                        rows={3}
                        readOnly={!isReceivedRecce}
                        onChange={(e) =>
                          project.handleChange("clientExpectation", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto border border-gray-300 rounded-lg">
                    <table className="w-full table-fixed text-sm text-left border border-gray-300">
                      <thead className="bg-gray-800 text-white">
                        <tr>
                          <th className="px-4 py-3 font-semibold text-center w-[60px]">
                            S.No.
                          </th>
                          <th className="px-4 py-3 font-semibold w-[200px]">
                            Product Name
                          </th>
                          <th className="px-4 py-3 font-semibold text-center w-[140px]">
                            Product Code
                          </th>
                          <th className="px-4 py-3 font-semibold text-center w-[100px]">
                            Quantity
                          </th>
                          <th className="px-4 py-3 font-semibold text-center w-[120px]">
                            Status
                          </th>
                          <th className="px-4 py-3 font-semibold text-center w-[150px]">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {products.map((prod, idx) => {
                          let displayStatus = prod.status;
                          if (recceStatus === "draft") displayStatus = "Draft";
                          else if (recceStatus === "completed")
                            displayStatus = "Completed";
                          else displayStatus = "New Recce";
                          return (
                            <tr
                              key={`${prod.id}-${idx}`}
                              className="bg-white hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-4 py-3 text-center font-medium">
                                {idx + 1}
                              </td>
                              <td className="px-4 py-3">
                                <div className="text-sm font-medium text-gray-800">
                                  {prod.productName}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <div className="text-sm font-medium text-gray-700">
                                  {prod.productCode || "N/A"}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <Input
                                  type="number"
                                  min="0"
                                  onKeyDown={(e) =>
                                    ["e", "E", "+", "-", "."].includes(e.key) &&
                                    e.preventDefault()
                                  }
                                  value={prod.quantity}
                                  onChange={(e) =>
                                    handleProductChange(
                                      idx,
                                      "quantity",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Enter qty"
                                  className="w-16 text-center px-2 mx-auto"
                                />
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className="inline-flex items-center justify-center px-3 py-2 rounded-md text-xs font-semibold bg-gray-200 text-gray-800">
                                  New
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => {
                                      if (
                                        displayStatus === "New Recce" ||
                                        displayStatus === "Draft"
                                      ) {
                                        localStorage.setItem(
                                          "active_recce_project_id",
                                          id,
                                        );
                                        localStorage.setItem(
                                          "active_product_id",
                                          prod.productId,
                                        );
                                        localStorage.setItem(
                                          "active_recce_product_internal_id",
                                          prod.id,
                                        );
                                        const lastStep =
                                          prod.lastStep ||
                                          "/recce/product-requirements";
                                        navigate(lastStep);
                                      }
                                    }}
                                    title="Start Recce Work"
                                    className={`h-9 w-9 flex items-center justify-center rounded-md transition-colors ${
                                      displayStatus === "Completed"
                                        ? "bg-green-500 text-white"
                                        : displayStatus === "Draft"
                                          ? "bg-yellow-500 text-white hover:bg-yellow-600"
                                          : "bg-blue-600 text-white hover:bg-blue-700"
                                    }`}
                                  >
                                    <Rocket size={16} />
                                  </button>

                                  <button
                                    onClick={() => handleRemoveProduct(idx)}
                                    disabled={isSavingRecceProduct}
                                    className="h-9 w-9 flex items-center justify-center rounded-md border-2 border-red-200 bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50 transition-colors"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {isReceivedRecce || !isAssignedRecce ? (
                    <div className="mt-5">
                      <button
                        onClick={handleAddProduct}
                        className="bg-blue-600 text-white text-sm px-5 py-2.5 rounded-md font-semibold shadow-sm hover:bg-blue-700 flex items-center gap-2 transition-colors"
                      >
                        <Plus size={16} /> Add Product
                      </button>
                    </div>
                  ) : null}
                </div>
              </>
            )}

            {/* Recce Planning Logs - Full Width */}
            {fromRoute !== "upcoming" && fromRoute !== "received" && fromRoute !== "assigned" &&  (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Header Section */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                  <SectionTitle title="Recce Planning Logs" />
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">
                    {planningLogs.length} Total Entries
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-left border-separate border-spacing-0">
                    <thead>
                      <tr className="bg-gray-50/50">
                        <th className="px-6 py-4 font-bold text-gray-600 uppercase tracking-tighter text-[11px] border-b border-gray-100">
                          S.NO
                        </th>
                        <th className="px-6 py-4 font-bold text-gray-600 uppercase tracking-tighter text-[11px] border-b border-gray-100">
                          Date & Time
                        </th>
                        <th className="px-6 py-4 font-bold text-gray-600 uppercase tracking-tighter text-[11px] border-b border-gray-100">
                          Planner Details
                        </th>
                        <th className="px-6 py-4 font-bold text-gray-600 uppercase tracking-tighter text-[11px] border-b border-gray-100">
                          Status
                        </th>
                        <th className="px-6 py-4 font-bold text-gray-600 uppercase tracking-tighter text-[11px] border-b border-gray-100">
                          Lead Type
                        </th>
                        <th className="px-6 py-4 font-bold text-gray-600 uppercase tracking-tighter text-[11px] border-b border-gray-100 text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {planningLogs.map((log, index) => (
                        <tr
                          key={log.id}
                          className="group hover:bg-blue-50/40 transition-all duration-200"
                        >
                          <td className="px-6 py-4 font-mono text-gray-400 text-xs">
                            {(index + 1).toString().padStart(2, "0")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-gray-900 font-medium">
                              {log.dateTime.split(" ")[0]}
                            </span>
                            <span className="block text-[11px] text-gray-400">
                              {log.dateTime.split(" ")[1]}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-800">
                                {log.planner}
                              </span>
                              <span className="text-xs text-blue-500 font-medium">
                                {log.designation}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ${
                                log.status === "On Route"
                                  ? "bg-blue-50 text-blue-700 ring-blue-600/20"
                                  : "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${log.status === "On Route" ? "bg-blue-600" : "bg-emerald-600"}`}
                              />
                              {log.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 rounded text-[11px] font-bold bg-gray-100 text-gray-600 border border-gray-200 uppercase">
                              {log.leadType}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm group-hover:shadow"
                              onClick={() => setShowPlanningLogModal(true)}
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <PlanningLogModal
            isOpen={showPlanningLogModal}
            onClose={() => setShowPlanningLogModal(false)}
            logs={planningLogs}
          />

          {/* Discussion Log Modal */}
          <Dialog
            open={showDiscussionLogModal}
            onClose={() => setShowDiscussionLogModal(false)}
            className="relative z-50"
          >
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              aria-hidden="true"
            />

            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-[1400px] rounded-xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title className="text-xl font-bold text-gray-800">
                    Complete Client Discussion Log
                  </Dialog.Title>
                  <button
                    onClick={() => setShowDiscussionLogModal(false)}
                    className="hover:bg-gray-200 rounded-full p-1.5 text-gray-600 hover:text-red-500 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Table Container */}
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  {/* Scroll area */}
                  <div className="max-h-[65vh] overflow-y-auto">
                    <table className="min-w-screen text-sm text-left">
                      {/* STICKY HEADER */}
                      <thead className="bg-gray-800 text-white sticky top-0 z-20">
                        <tr>
                          <th className="px-4 py-3 h-14 font-semibold whitespace-nowrap">
                            S.NO
                          </th>
                          <th className="px-4 py-3 h-14 font-semibold whitespace-nowrap">
                            Date & Time
                          </th>
                          <th className="px-4 py-3 h-14 font-semibold whitespace-nowrap">
                            Department
                          </th>
                          <th className="px-4 py-3 h-14 font-semibold whitespace-nowrap">
                            Representative Name
                          </th>
                          <th className="px-4 py-3 h-14 font-semibold whitespace-nowrap">
                            Designation
                          </th>
                          <th className="px-4 py-3 h-14 font-semibold whitespace-nowrap">
                            Client Name
                          </th>
                          <th className="px-4 py-3 h-14 font-semibold whitespace-nowrap">
                            Designation
                          </th>
                          <th className="px-4 py-3 h-14 font-semibold whitespace-nowrap w-40">
                            Discussion with Client
                          </th>
                          <th className="px-4 py-3 h-14 font-semibold whitespace-nowrap w-40">
                            Remarks
                          </th>
                        </tr>
                      </thead>

                      {/* TABLE BODY */}
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {discussionLogs.map((log, index) => (
                          <tr
                            key={log.id || index}
                            className="hover:bg-gray-50 align-top transition"
                          >
                            <td className="px-4 py-3 font-medium text-gray-900">
                              {index + 1}
                            </td>
                            <td className="px-4 py-3 text-gray-700">{log.date}</td>
                            <td className="px-4 py-3 text-gray-700">{log.dept}</td>
                            <td className="px-4 py-3 text-gray-700">
                              {log.repName}
                            </td>
                            <td className="px-4 py-3 text-gray-700">
                              {log.designation}
                            </td>
                            <td className="px-4 py-3 text-gray-700">
                              {log.clientRepName}
                            </td>
                            <td className="px-4 py-3 text-gray-700">
                              {log.clientDesignation}
                            </td>
                            <td className="px-4 py-3 text-gray-600 leading-relaxed">
                              {log.discussion}
                            </td>
                            <td className="px-4 py-3 text-gray-600 leading-relaxed">
                              {log.remarks}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-5 flex justify-end">
                  <button
                    onClick={() => setShowDiscussionLogModal(false)}
                    className="bg-gray-700 text-white px-6 py-2.5 rounded-md text-sm font-semibold hover:bg-gray-800 transition"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </Dialog>

          {/* Add Product Modal */}
          <Dialog
            open={showAddProductModal}
            onClose={() => setShowAddProductModal(false)}
            className="relative z-50"
          >
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              aria-hidden="true"
            />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title className="text-xl font-bold text-gray-800">
                    Add Product
                  </Dialog.Title>
                  <button
                    onClick={() => setShowAddProductModal(false)}
                    className="hover:bg-gray-200 rounded-full p-1.5 text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-5">
                  <div>
                    <Label>Signage</Label>
                    <select
                      value={modalProductData.productId || ""}
                      onChange={(e) =>
                        handleModalProductChange("productId", e.target.value)
                      }
                      className="w-full text-sm border border-gray-300 rounded-md px-3 py-2.5 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    >
                      <option value="">Select a product...</option>
                      {productListData?.data?.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.title}
                        </option>
                      ))}
                    </select>
                    {modalProductData.productId && (
                      <p className="text-xs text-green-600 mt-2 font-medium">
                        Selected Product Code:{" "}
                        {
                          productListData?.data?.find(
                            (p) => p._id === modalProductData.productId,
                          )?.productId
                        }
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min="0"
                      onKeyDown={(e) =>
                        ["e", "E", "+", "-", ".", ",", " "].includes(e.key) &&
                        e.preventDefault()
                      }
                      onPaste={(e) => e.preventDefault()}
                      value={modalProductData.quantity}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, "");
                        handleModalProductChange("quantity", value);
                      }}
                      placeholder="Enter quantity"
                    />
                  </div>

                  <div>
                    <Label>Product Name</Label>
                    <Input
                      type="text"
                      value={modalProductData.productName}
                      onChange={(e) =>
                        handleModalProductChange("productName", e.target.value)
                      }
                      placeholder="Enter product name"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => setShowAddProductModal(false)}
                    className="bg-gray-300 text-gray-800 px-5 py-2.5 rounded-md text-sm font-semibold hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleModalSaveProduct}
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Check size={16} /> Save
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </Dialog>
        </div>
      );
    };

    export default RecceDetails;
