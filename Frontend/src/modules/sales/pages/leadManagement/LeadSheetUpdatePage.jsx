import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useFetchLeadByIdQuery,
  useUpdateLeadMutation,
} from "../../../../api/sales/lead.api";
import PageHeader from "@/components/PageHeader";
import { Eye, FileSpreadsheet, Headphones, Image, Mic, Plus } from "lucide-react";
import RequirementFilesModal from "../../components/RequirementFilesModal";

// Optimized Yup Schema with proper validations
const schema = yup.object().shape({
  companyName: yup.string().required("Company name is required").trim(),
  clientName: yup.string().required("Client Name is required").trim(),
  email: yup.string().email("Enter a valid email address").nullable().transform((value) => value || null),
  address: yup.string().nullable().transform((value) => value || null),
  phone: yup
    .string()
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number starting with 6-9")
    .required("Phone number is required")
    .trim(),
  remark: yup.string().nullable().transform((value) => value || null),
  requirement: yup.string().nullable().transform((value) => value || null),
  requirementFiles: yup
    .mixed()
    .test(
      "requirement-check",
      "Requirement text or file is required",
      function () {
        const { requirement } = this.parent;
        const files = this.options.context?.requirementFiles || [];
        return !!requirement || files.length > 0;
      }
    ),
  clientRatingInBusiness: yup
    .number()
    .typeError("Rating must be a number")
    .min(0, "Minimum rating is 0")
    .max(10, "Maximum rating is 10")
    .nullable()
    .transform((value) => (value === '' ? null : value)),
  clientDesignation: yup.string().nullable().transform((value) => value || null),

  altPhone: yup
    .string()
    .matches(/^$|^[6-9]\d{9}$/, "Enter a valid 10-digit phone number or leave empty")
    .nullable()
    .transform((value) => value || null),

  whatsapp: yup
    .string()
    .matches(/^$|^[6-9]\d{9}$/, "Enter a valid 10-digit WhatsApp number or leave empty")
    .nullable()
    .transform((value) => value || null),

  contactPersonName: yup.string().nullable().transform((value) => value || null),
  contactPersonEmail: yup.string().email("Enter a valid email address").nullable().transform((value) => value || null),

  contactPersonPhone: yup
    .string()
    .matches(/^$|^[6-9]\d{9}$/, "Enter a valid 10-digit phone number or leave empty")
    .nullable()
    .transform((value) => value || null),

  contactPersonAltPhone: yup
    .string()
    .matches(/^$|^[6-9]\d{9}$/, "Enter a valid 10-digit phone number or leave empty")
    .nullable()
    .transform((value) => value || null),

  contactPersonWhatsapp: yup
    .string()
    .matches(/^$|^[6-9]\d{9}$/, "Enter a valid 10-digit WhatsApp number or leave empty")
    .nullable()
    .transform((value) => value || null),

  expectedBusiness: yup
    .number()
    .typeError("Expected Business must be a number")
    .min(1000, "Minimum Business Size is ₹1000")
    .nullable()
    .transform((value) => (value === '' ? null : value)),

  leadSource: yup.string().nullable().transform((value) => value || null),
  businessType: yup.string().nullable().transform((value) => value || null),
  leadStatus: yup.string().nullable().transform((value) => value || null),
  leadLabel: yup.string().nullable().transform((value) => value || null),
});

const LeadSheetUpdatePage = () => {
  const { id } = useParams();
  const [requirementFiles, setRequirementFiles] = useState([]);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = React.useRef(null);
  const audioChunksRef = React.useRef([]);
  const { data, isLoading, refetch } = useFetchLeadByIdQuery({ id });
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const [fileLead, setFileLead] = useState(null);
  const leadData = data?.data;
  const navigate = useNavigate();
  const [updateLead, { isLoading: updateLoading, error: errorLoading }] =
    useUpdateLeadMutation();

  // Default values object
  const defaultValues = {
    companyName: "",
    clientName: "",
    email: "",
    address: "",
    phone: "",
    altPhone: "",
    whatsapp: "",
    clientDesignation: "",
    contactPersonName: "",
    contactPersonEmail: "",
    contactPersonPhone: "",
    contactPersonAltPhone: "",
    contactPersonWhatsapp: "",
    remark: "",
    requirement: "",
    requirementFiles: "",
    clientRatingInBusiness: null,
    expectedBusiness: null,
    leadSource: "",
    businessType: "",
    leadStatus: "",
    leadLabel: "",
    dealIncentive: "",
    leadIncentive: "",
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
    mode: "onChange", // Validate on change for better UX
  });

  // Watch form values
  const watchLeadSource = watch("leadSource");
  const expectedBusiness = watch("expectedBusiness");

  // Reset form when leadData is available
  useEffect(() => {
    if (leadData) {
      const resetData = {
        companyName: leadData.companyName || "",
        clientName: leadData.clientName || "",
        email: leadData.email || "",
        address: leadData.address || "",
        phone: leadData.phone || "",
        altPhone: leadData.altPhone || "",
        whatsapp: leadData.whatsapp || "",
        clientDesignation: leadData.clientDesignation || "",
        contactPersonName: leadData.contactPersonName || "",
        contactPersonEmail: leadData.contactPersonEmail || "",
        contactPersonPhone: leadData.contactPersonPhone || "",
        contactPersonAltPhone: leadData.contactPersonAltPhone || "",
        contactPersonWhatsapp: leadData.contactPersonWhatsapp || "",
        remark: leadData.remark || "",
        requirement: leadData?.requirement || "",
        requirementFiles: leadData?.requirementFiles || "",
        clientRatingInBusiness: leadData.clientRatingInBusiness || null,
        expectedBusiness: leadData.expectedBusiness || null,
        leadSource: leadData.leadSource || "",
        businessType: leadData.businessType || "",
        leadStatus: leadData?.leadStatus || "",
        leadLabel: leadData?.leadLabel || "",
        dealIncentive: "",
        leadIncentive: "",
      };
      reset(resetData);
    }
  }, [leadData, reset]);

  // Calculate incentives when expectedBusiness changes
  useEffect(() => {
    if (expectedBusiness) {
      const amount = parseFloat(expectedBusiness);
      if (!isNaN(amount)) {
        const dealPercent = parseFloat(import.meta.env.VITE_DEAL_INCENTIVE) || 0;
        const leadPercent = parseFloat(import.meta.env.VITE_LEAD_INCENTIVE) || 0;

        setValue("dealIncentive", ((amount * dealPercent) / 100).toFixed(2), {
          shouldValidate: true,
        });
        setValue("leadIncentive", ((amount * leadPercent) / 100).toFixed(2), {
          shouldValidate: true,
        });
      }
    }
  }, [expectedBusiness, setValue]);

  // Form submission handler
  const onSubmit = async (formData) => {
    try {
      const cleanedData = {
        ...formData,
        requirementFiles: requirementFiles.length > 0 ? requirementFiles : formData.requirementFiles,
      };
      const formDataToSend = new FormData();

      Object.keys(cleanedData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      });

      requirementFiles.forEach((file, index) => {
        formDataToSend.append(`documents`, file);
      });

      formDataToSend.append('salesTLId', '68807201f4ef3f295e0ff4dc');

      const res = await updateLead({ id, formData: formDataToSend }).unwrap();

      toast.success("Lead updated successfully!");
      refetch();
      navigate("/sales/leads/sheet");
    } catch (error) {
      console.error("Update error:", error);
      const errorMessage = error?.data?.message || error?.message || "Failed to update lead. Please try again.";
      toast.error(errorMessage);
    }
  };

  // Helper function for input classes
  const getInputClassName = (fieldName, hasError = false) => {
    const baseClasses = "w-full px-3 py-2 text-sm border rounded-sm focus:ring-2 transition-colors duration-200 focus:outline-none";
    const bgColor = leadData?.[fieldName] ? "bg-gray-50" : "bg-white";
    const borderColor = hasError ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-gray-200 focus:border-black";

    return `${baseClasses} ${bgColor} ${borderColor}`;
  };

  // Helper function for select classes
  const getSelectClassName = (fieldName, hasError = false) => {
    const baseClasses = "w-full px-3 py-2 text-sm border rounded-sm focus:ring-2 transition-colors duration-200 focus:outline-none text-gray-900";
    const bgColor = leadData?.[fieldName] ? "bg-gray-50" : "bg-white";
    const borderColor = hasError ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-gray-200 focus:border-gray-500";

    return `${baseClasses} ${bgColor} ${borderColor}`;
  };

  // Error message component
  const ErrorMessage = ({ message }) => (
    <p className="text-red-500 text-xs mt-1 flex items-center">
      <span className="mr-1">⚠</span>
      {message}
    </p>
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading lead data...</div>
      </div>
    );
  }

  const openImagesInNewTabs = () => {
    leadData?.requirementFiles?.forEach((file) => {
      if (file?.public_url) {
        window.open(file.public_url, "_blank");
      }
    });
  };


  const startRecording = async () => {
    try {
      setShowAttachMenu(false)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioFile = new File([audioBlob], "voice-note.webm", {
          type: "audio/webm",
        });

        setRequirementFiles((prev) => [...prev, audioFile]);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.log(err)
      toast.error("Microphone access denied");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const getFileType = (url = "") => {
    const ext = url.split(".").pop().toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
    if (["mp4", "webm", "ogg"].includes(ext)) return "video";
    if (["mp3", "wav", "aac", "m4a"].includes(ext)) return "audio";
    return "document";
  };

  return (
    <div className="">
      <RequirementFilesModal
        open={fileModalOpen}
        onClose={() => setFileModalOpen(false)}
        lead={fileLead}
      />
      <PageHeader title="Client Briefing From" />

      <div className="flex w-full justify-center items-center">
        <div className="w-full mx-auto rounded-lg p-4 border">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <form onSubmit={handleSubmit(onSubmit)} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 gap-x-4">
                {/* Company / Individual Name */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company / Individual Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("companyName")}
                    placeholder="Enter company or individual name"
                    className={getInputClassName("companyName", !!errors.companyName)}
                  />
                  {errors.companyName && <ErrorMessage message={errors.companyName.message} />}
                </div>

                {/* Client Name */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("clientName")}
                    placeholder="Enter client name"
                    className={getInputClassName("clientName", !!errors.clientName)}
                  />
                  {errors.clientName && <ErrorMessage message={errors.clientName.message} />}
                </div>

                {/* Client Designation */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client Designation
                  </label>
                  <input
                    type="text"
                    {...register("clientDesignation")}
                    placeholder="Enter client designation"
                    className={getInputClassName("clientDesignation")}
                  />
                </div>

                {/* Client Email */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client Email
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="Enter client email"
                    className={getInputClassName("email", !!errors.email)}
                  />
                  {errors.email && <ErrorMessage message={errors.email.message} />}
                </div>

                {/* Client Phone Number */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    {...register("phone")}
                    placeholder="Enter 10-digit phone number"
                    className={getInputClassName("phone", !!errors.phone)}
                  />
                  {errors.phone && <ErrorMessage message={errors.phone.message} />}
                </div>

                {/* Client Alternate Number */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client Alternate Number
                  </label>
                  <input
                    type="tel"
                    {...register("altPhone")}
                    placeholder="Enter alternate phone number"
                    className={getInputClassName("altPhone", !!errors.altPhone)}
                  />
                  {errors.altPhone && <ErrorMessage message={errors.altPhone.message} />}
                </div>

                {/* Client WhatsApp Number */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    {...register("whatsapp")}
                    placeholder="Enter WhatsApp number"
                    className={getInputClassName("whatsapp", !!errors.whatsapp)}
                  />
                  {errors.whatsapp && <ErrorMessage message={errors.whatsapp.message} />}
                </div>

                {/* Contact Person Name */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Person Name
                  </label>
                  <input
                    type="text"
                    {...register("contactPersonName")}
                    placeholder="Enter contact person name"
                    className={getInputClassName("contactPersonName")}
                  />
                </div>

                {/* Contact Person Email */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Person Email
                  </label>
                  <input
                    type="email"
                    {...register("contactPersonEmail")}
                    placeholder="Enter contact person email"
                    className={getInputClassName("contactPersonEmail", !!errors.contactPersonEmail)}
                  />
                  {errors.contactPersonEmail && <ErrorMessage message={errors.contactPersonEmail.message} />}
                </div>

                {/* Contact Person Phone */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Person Phone
                  </label>
                  <input
                    type="tel"
                    {...register("contactPersonPhone")}
                    placeholder="Enter contact person phone"
                    className={getInputClassName("contactPersonPhone", !!errors.contactPersonPhone)}
                  />
                  {errors.contactPersonPhone && <ErrorMessage message={errors.contactPersonPhone.message} />}
                </div>

                {/* Contact Person Alternate Number */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Person Alternate Number
                  </label>
                  <input
                    type="tel"
                    {...register("contactPersonAltPhone")}
                    placeholder="Enter alternate phone number"
                    className={getInputClassName("contactPersonAltPhone", !!errors.contactPersonAltPhone)}
                  />
                  {errors.contactPersonAltPhone && <ErrorMessage message={errors.contactPersonAltPhone.message} />}
                </div>

                {/* Contact Person WhatsApp */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Person WhatsApp
                  </label>
                  <input
                    type="tel"
                    {...register("contactPersonWhatsapp")}
                    placeholder="Enter WhatsApp number"
                    className={getInputClassName("contactPersonWhatsapp", !!errors.contactPersonWhatsapp)}
                  />
                  {errors.contactPersonWhatsapp && <ErrorMessage message={errors.contactPersonWhatsapp.message} />}
                </div>

                {/* Address */}
                <div className="space-y-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    {...register("address")}
                    placeholder="Enter full address"
                    rows="2"
                    className={getInputClassName("address")}
                  />
                </div>

                {/* Requirement
                <div className="space-y-1 md:col-span-2 flex justify-between">
                  <div className="basis-10/12">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Requirement
                    </label>
                    <textarea
                      {...register("requirement")}
                      placeholder="Enter project details"
                      rows="2"
                      className={getInputClassName("requirement")}
                    />
                  </div>

                  <div className=" basic-2/12  flex items-center justify-end basis-2/12 gap-3 mt-2">
                    <label className="px-3 py-1.5 text-sm bg-gray-200 rounded cursor-pointer">
                      Upload
                      <input
                        type="file"
                        multiple
                        hidden
                        {...register("requirementFiles")}
                        onChange={(e) => {
                          setRequirementFiles(Array.from(e.target.files));
                        }}
                      />
                    </label>
                    {leadData?.requirementFiles?.length > 0 && (
                      <button
                        type="button"
                        className="text-xs underline text-blue-500 cursor-pointer"
                        onClick={openImagesInNewTabs}
                      >
                        Open Images
                      </button>
                    )}



                    {requirementFiles?.length > 0 && (
                      <span className="text-xs text-gray-600">
                        {requirementFiles?.length} file(s) selected
                      </span>
                    )}
                  </div>
                </div> */}

                <div className="space-y-1 md:col-span-2">
                  <label className="block text-sm font-medium text-black/80 mb-1">
                    Requirement <span className="text-red-500">*</span>
                  </label>

                  <div className="relative flex items-center border border-gray-300 rounded-sm px-1 bg-white">

                    <button
                      type="button"
                      onClick={() => setShowAttachMenu(!showAttachMenu)}
                      className="text-xl px-2"
                    >
                      <Plus size={35} className="cursor-pointer hover:bg-gray-200 bg-gray-100 rounded-full p-1 text-black/80" />
                    </button>

                    {/* Text Input */}
                    <textarea
                      {...register("requirement")}
                      rows={1}
                      placeholder="Describe the customer's requirements..."
                      className="flex-1 px-2 py-2 text-sm resize-none outline-none leading-[32px]"
                    />
                    {leadData?.requirementFiles?.length > 0 && (
                      <button
                        onClick={() => {
                          setFileLead(leadData);
                          setFileModalOpen(true);
                        }}
                        title="View Requirement Files"
                        type="button"
                        className="text-orange-500 hover:text-orange-600 border-orange-500 cursor-pointer border p-1 rounded-xl"
                      >
                        <Eye size={20} />
                      </button>
                    )}


                    <button
                      type="button"
                      onMouseDown={startRecording}
                      onMouseUp={stopRecording}
                      className={`text-xl px-2 ${isRecording ? "text-red-500" : ""}`}
                      title="Hold to record"
                    >
                      <Mic size={35} className="cursor-pointer rounded-full hover:bg-gray-200 bg-gray-100 p-1.5  text-black/80" />
                    </button>


                    {/* Attach Menu */}
                    {showAttachMenu && (
                      <div onMouseLeave={() => setShowAttachMenu(!showAttachMenu)} className="absolute bottom-14 left-0 bg-white shadow-sm border rounded-md w-40 z-10">
                        <label className="block px-3 py-2 cursor-pointer hover:bg-gray-100 text-gray-800">
                          <FileSpreadsheet size={20} className=" inline-block" /> Document
                          <input
                            type="file"
                            hidden
                            onChange={(e) =>
                              setRequirementFiles((prev) => [
                                ...prev,
                                ...Array.from(e.target.files),
                              ])
                            }
                          />
                        </label>

                        <label className="block px-3 py-2 cursor-pointer hover:bg-gray-100 text-gray-800">
                          <Image size={20} className=" inline-block" /> Photo / Video
                          <input
                            type="file"
                            accept="image/*,video/*"
                            hidden
                            multiple
                            onChange={(e) =>
                              setRequirementFiles((prev) => [
                                ...prev,
                                ...Array.from(e.target.files),
                              ])
                            }
                          />
                        </label>
                        {/* {leadData?.requirementFiles?.length > 0 && (
                          <button
                            onClick={() => {
                              setFileLead(leadData);
                              setFileModalOpen(true);
                            }}
                            title="View Requirement Files"
                            type="button"
                            className="text-orange-500 absolute hover:text-orange-600 cursor-pointer"
                          >
                            <Eye size={16} />
                          </button>
                        )} */}

                        <label className="block px-3 py-2 cursor-pointer hover:bg-gray-100 text-gray-800">
                          <Headphones size={20} className=" inline-block" /> Audio
                          <input
                            type="file"
                            accept="audio/*"
                            hidden
                            onChange={(e) =>
                              setRequirementFiles((prev) => [
                                ...prev,
                                ...Array.from(e.target.files),
                              ])
                            }
                          />
                        </label>
                      </div>
                    )}
                  </div>



                  {/* File count */}
                  {requirementFiles.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      {requirementFiles.length} attachment(s) added
                    </p>
                  )}

                  {errors.requirement && (
                    <p className="text-red-500 text-sm">{errors.requirement.message}</p>
                  )}
                </div>

                {/* Expected Business Size */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Business (₹)
                  </label>
                  <input
                    type="number"
                    step="1000"
                    {...register("expectedBusiness")}
                    placeholder="Enter amount"
                    className={getInputClassName("expectedBusiness", !!errors.expectedBusiness)}
                  />
                  {errors.expectedBusiness && <ErrorMessage message={errors.expectedBusiness.message} />}
                </div>

                {/* Deal Incentive */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deal Incentive ({import.meta.env.VITE_DEAL_INCENTIVE || 2}%)
                  </label>
                  <input
                    type="text"
                    {...register("dealIncentive")}
                    readOnly
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm bg-gray-50 cursor-not-allowed"
                  />
                </div>

                {/* Lead Incentive */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lead Incentive ({import.meta.env.VITE_LEAD_INCENTIVE || 2}%)
                  </label>
                  <input
                    type="text"
                    {...register("leadIncentive")}
                    readOnly
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm bg-gray-50 cursor-not-allowed"
                  />
                </div>

                {/* Lead Label */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lead Label
                  </label>
                  <select
                    {...register("leadLabel")}
                    className={getSelectClassName("leadLabel")}
                  >
                    <option value="">Select Lead Label</option>
                    <option value="UNTOUCHED">UNTOUCHED</option>
                    <option value="HOT">HOT</option>
                    <option value="WARM">WARM</option>
                    <option value="COLD">COLD</option>
                  </select>
                </div>

                {/* Client Rating */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client Rating
                  </label>
                  <select
                    {...register("clientRatingInBusiness")}
                    className={getSelectClassName("clientRatingInBusiness", !!errors.clientRatingInBusiness)}
                  >
                    <option value="">Select Rating</option>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                      <option key={rating} value={rating}>
                        {rating}
                      </option>
                    ))}
                  </select>
                  {errors.clientRatingInBusiness && <ErrorMessage message={errors.clientRatingInBusiness.message} />}
                </div>

                {/* Business Type */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Type
                  </label>
                  <select
                    {...register("businessType")}
                    className={getSelectClassName("businessType")}
                  >
                    <option value="">Select Business Type</option>
                    <option value="b2b">B2B</option>
                    <option value="b2c">B2C</option>
                    <option value="b2g">B2G</option>
                    <option value="retail">Retail</option>
                    <option value="wholesale">Wholesale</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="service">Service</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Lead Status */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lead Status
                  </label>
                  <select
                    {...register("leadStatus")}
                    className={getSelectClassName("leadStatus")}
                  >
                    <option value="">Select Lead Status</option>
                    <option value="PENDING">PENDING</option>
                    <option value="ASSIGNED">ASSIGNED</option>
                    <option value="IN PROGRESS">IN PROGRESS</option>
                    <option value="FOLLOW UP">FOLLOW UP DONE</option>
                  </select>
                </div>

                {/* Remark */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Remark
                  </label>
                  <input
                    type="text"
                    {...register("remark")}
                    placeholder="Enter remarks"
                    className={getInputClassName("remark")}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate("/sales/leads/sheet")}
                  className="px-5 py-2 text-sm border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateLoading || !isDirty}
                  className={`px-6 py-2 text-sm rounded-sm transition-all duration-200 ${updateLoading || !isDirty
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-800 text-white shadow-sm hover:shadow-md"
                    }`}
                >
                  {updateLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </span>
                  ) : "Update Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadSheetUpdatePage;
