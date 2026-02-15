import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Upload, FileText, X, Loader2, MapPin } from "lucide-react";
// import {
//   useAddSalesInformMutation,
//   useFetchLeadByIdQuery,
// } from "../../../../api/sales/lead.api";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import { useSelector } from "react-redux";
import { useAddLeadMutation } from "@/api/sales/lead.api";

// ======= Yup Schema =======
const schema = yup.object().shape({
  leadId: yup.string().required("Lead ID is required"),
  leadName: yup.string(),
  clientName: yup.string().required("Client name is required"),
  companyName: yup.string().required("Company name is required"),
  projectName: yup.string().required("Project name is required"),
  productName: yup.string().required("Product name is required"),
  requirement: yup.string(),
  clientProfile: yup.string(),
  clientBehaviour: yup.string(),
  discussionDone: yup.string().required("Discussion summary is required"),
  instructionRecce: yup.string(),
  instructionDesign: yup.string(),
  instructionInstallation: yup.string(),
  instructionOther: yup.string(),
  address: yup.string(),
  siteLocation: yup.string().required("Site location is required"),
  // Additional fields from second form can go here
  expectedRevenue: yup.number().typeError("Expected Revenue must be a number"),
  remarks: yup.string(),
  salesTarget: yup.number().typeError("Sales Target must be a number"),
});

const SalesInformFormPage = () => {
   const res = useSelector((state) => state.auth.user);
 const user = res?.user || {}
 const id = user?._id || null
  const navigate = useNavigate();

  const [documentUpload, setDocuments] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);

  const { data , isLoading: previousDataLoading } = {
    leadName: "John Doe Lead",
    concernPersonName: "John Doe",
    companyName: "Code Crafter Web Solutions",
    requirement: "Digital Signage Installation",
    address: "123 Elm Street, Global City, Earth",
  }
  // useFetchLeadByIdQuery({ id });
  const leadData = data?.result;

  const [addSalesInform] = useAddLeadMutation();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      leadId: id || "",
      userId: user?.id,
      leadName:"",
      clientName: "",
      companyName: "",
      projectName: "",
      productName: "",
      requirement: "",
      clientProfile: "",
      clientBehaviour: "",
      discussionDone: "",
      instructionRecce: "",
      instructionDesign: "",
      instructionInstallation: "",
      instructionOther: "",
      address: "",
      siteLocation: "",
      salesTarget: "",
      expectedRevenue: "",
      remarks: "",
    },
  });

  // Prefill lead data
  useEffect(() => {
    if (leadData) {
      reset({
        leadId: id,
        userId: user?.id,
        leadName: leadData?.leadName || "",
        clientName: leadData?.concernPersonName || "",
        companyName: leadData?.companyName || "",
        projectName: "",
        productName: "",
        requirement: leadData?.requirement || "",
        clientProfile: "",
        clientBehaviour: "",
        discussionDone: "",
        instructionRecce: "",
        instructionDesign: "",
        instructionInstallation: "",
        instructionOther: "",
        address: leadData?.address || "",
        siteLocation: "",
        expectedRevenue: "",
        remarks: "",
        salesTarget: "",
      });
    }
  }, [leadData, id, reset, user]);

  // ======= File Upload Logic =======
  const MAX_FILE_SIZE_MB = 10;
  const ALLOWED_TYPES = {
    document: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    image: ["image/jpeg", "image/png", "image/jpg"],
    audio: ["audio/mpeg", "audio/mp3", "audio/wav"],
    video: ["video/mp4", "video/quicktime", "video/x-m4v"],
  };

  const getFileCategory = (type) => {
    if (ALLOWED_TYPES.document.includes(type)) return "document";
    if (ALLOWED_TYPES.image.includes(type)) return "image";
    if (ALLOWED_TYPES.audio.includes(type)) return "audio";
    if (ALLOWED_TYPES.video.includes(type)) return "video";
    return "others";
  };

  const handleFileUpload = (files) => {
    if (!files || files.length === 0) return;
    const validFiles = [];
    const maxFiles = 10;

    if (documentUpload.length + files.length > maxFiles) {
      toast.error(`You can only upload maximum ${maxFiles} files`);
      return;
    }

    Array.from(files).forEach((file) => {
      const category = getFileCategory(file.type);

      if (!category) {
        toast.error(`${file.name} is not a supported file type`);
        return;
      }

      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast.error(`${file.name} exceeds ${MAX_FILE_SIZE_MB}MB limit`);
        return;
      }

      const isDuplicate = documentUpload.some(
        (doc) => doc.name === file.name && doc.size === file.size
      );
      if (isDuplicate) {
        toast.error(`${file.name} is already uploaded`);
        return;
      }

      const enhancedFile = Object.assign(file, {
        id: Date.now() + Math.random(),
        category,
      });
      validFiles.push(enhancedFile);
    });

    if (validFiles.length > 0) {
      setDocuments((prev) => [...prev, ...validFiles]);
      toast.success(`${validFiles.length} file(s) uploaded successfully`);
    }
  };

  const removeFile = (fileId) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== fileId));
    toast.info("File removed");
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const groupedFiles = useMemo(() => {
    return documentUpload.reduce((acc, file) => {
      const cat = file.category || "others";
      acc[cat] = acc[cat] || [];
      acc[cat].push(file);
      return acc;
    }, {});
  }, [documentUpload]);

  // ======= Submit Handler =======
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      for (const key in data) {
        formData.append(key, data[key]);
      }

      documentUpload.forEach((fileObj) => {
        const cleanFile = new File([fileObj], fileObj.name, {
          type: fileObj.type,
          lastModified: fileObj.lastModified,
        });
        formData.append("documentUpload", cleanFile);
      });

      const result = await addSalesInform({ formData });

      if (result?.data?.success) {
        toast.success("Sales Inform submitted successfully!");
        reset();
        setDocuments([]);
        navigate("/sales/sales-management-sheet");
      } else {
        toast.error(result?.error?.data?.message || "Submission failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while submitting the form");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (previousDataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Loading lead data...</span>
      </div>
    );
  }

  return (
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
            {/* ===== Client & Project Info ===== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {["clientName", "companyName", "projectName", "productName"].map((field) => (
                <div key={field} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field === "clientName"
                      ? "Client Name"
                      : field === "companyName"
                      ? "Company Name"
                      : field === "projectName"
                      ? "Project Name"
                      : "Product Name"}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register(field)}
                    placeholder={`Enter ${field}`}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200"
                  />
                  {errors[field] && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors[field].message}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* ===== Client Requirements / Profile / Behavior ===== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {["requirement", "clientProfile", "clientBehaviour", "discussionDone"].map((field) => (
                <div key={field} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field === "discussionDone" ? "Discussion Done *" : field === "requirement" ? "Client Requirements" : field === "clientProfile" ? "Client Profile" : "Client Behaviour"}
                  </label>
                  <textarea
                    {...register(field)}
                    rows={field === "discussionDone" ? 3 : 2}
                    placeholder={`Enter ${field}`}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200 resize-vertical"
                  />
                  {errors[field] && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors[field].message}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* ===== Instructions ===== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {["instructionRecce", "instructionDesign", "instructionInstallation", "instructionOther"].map((field) => (
                <div key={field} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.replace("instruction", "Instructions to ")}
                  </label>
                  <textarea
                    {...register(field)}
                    rows={2}
                    placeholder={`Enter ${field}`}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200 resize-vertical"
                  />
                </div>
              ))}
            </div>

            {/* ===== Location ===== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  {...register("address")}
                  rows={1}
                  placeholder="Enter address"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200 resize-vertical"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Site Location *</label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <textarea
                    {...register("siteLocation")}
                    rows={1}
                    placeholder="Enter site location manually"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200 resize-vertical"
                  />
                  <button
                    type="button"
                    onClick={() => setValue("siteLocation", leadData?.address || "", { shouldValidate: true })}
                    className="px-3 py-2 text-xs sm:text-sm bg-gray-100 rounded-md border hover:bg-gray-200 whitespace-nowrap"
                  >
                    Same as Address
                  </button>
                  <button
                    type="button"
                    disabled={geoLoading}
                    onClick={() => {
                      setGeoLoading(true);
                      navigator.geolocation.getCurrentPosition(
                        (pos) => {
                          const { latitude, longitude } = pos.coords;
                          setValue(
                            "siteLocation",
                            JSON.stringify([{ lat: latitude }, { long: longitude }]),
                            { shouldValidate: true }
                          );
                          toast.success("Location captured successfully");
                          setGeoLoading(false);
                        },
                        () => {
                          toast.error("Failed to fetch location");
                          setGeoLoading(false);
                        }
                      );
                    }}
                    className="px-3 py-2 text-xs bg-gray-100 rounded-md border hover:bg-gray-200 disabled:opacity-50 whitespace-nowrap"
                  >
                    {geoLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin size={20} />}
                  </button>
                </div>
                {errors.siteLocation && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.siteLocation.message}
                  </p>
                )}
              </div>
            </div>

            {/* ===== Sales Specific Fields ===== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {["salesTarget", "expectedRevenue", "remarks"].map((field) => (
                <div key={field} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.replace(/([A-Z])/g, " $1")}</label>
                  <input
                    type={field === "remarks" ? "text" : "number"}
                    {...register(field)}
                    placeholder={`Enter ${field}`}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200"
                  />
                  {errors[field] && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <span className="mr-1">⚠</span>
                      {errors[field].message}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* ===== Document Upload ===== */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">
                Document Upload
                {documentUpload.length > 0 && <span className="ml-2 text-black">({documentUpload.length} files)</span>}
              </h3>
              <div
                className={`relative border-2 border-dashed rounded-md p-6 text-center transition-all ${dragActive ? "border-black bg-blue-50" : "border-gray-300 hover:border-gray-400"}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-900">Drop files here or click to upload</p>
                <p className="text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG, MP3, WAV, MP4 up to 10MB each</p>
                <input type="file" multiple onChange={(e) => handleFileUpload(e.target.files)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp3,.wav,.mp4,.m4v,.mov" />
              </div>

              {Object.entries(groupedFiles).map(([category, files]) => (
                <div key={category} className="space-y-2">
                  <h4 className="text-sm font-semibold capitalize text-gray-700 flex items-center">
                    {category} files
                    <span className="ml-2 bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs">{files.length}</span>
                  </h4>
                  <div className="space-y-1">
                    {files.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <FileText size={18} />
                          <div>
                            <p className="text-sm font-medium truncate max-w-xs">{doc.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(doc.size)}</p>
                          </div>
                        </div>
                        <button type="button" onClick={() => removeFile(doc.id)} className="text-red-500 hover:text-red-600">
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className={`w-full mt-4 px-6 py-2 rounded-md text-white font-medium transition-colors ${
                isValid ? "bg-black hover:bg-gray-900" : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit Sales Inform"}
            </button>
          </form>
        </div>
  );
};

export default SalesInformFormPage;
