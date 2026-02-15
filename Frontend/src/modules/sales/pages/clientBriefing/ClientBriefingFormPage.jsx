import React, { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Upload, FileText, X, Loader2, MapPin, Search } from "lucide-react";
import {
  useAddClientBriefingMutation,
  useFetchLeadByIdQuery,
} from "../../../../api/sales/lead.api";
import { toast } from "react-toastify";
import PageHeader from "../../components/PageHeader";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";


const schema = yup.object().shape({
  leadId: yup.string().required("Lead ID is required"),
  leadName: yup.string(), // Made optional since it's auto-filled
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
  siteLocation: yup.string().required("Site location is required"),
});

const ClientBriefingFormPage = () => {

  const res = useSelector((state) => state.auth.userData);
  const user = res?.user || {}

  const [documentUpload, setDocuments] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);

  const { id } = useParams();

  const {
    data,
    isLoading: previousDataLoading,
    refetch,
  } = useFetchLeadByIdQuery({ id });

  const leadData = data?.data?.result;
  const [addClientBriefing, { isLoading: briefingLoading }] =
    useAddClientBriefingMutation();
  const navigate = useNavigate()
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
      userId: user?._id,
      leadName: "",
      clientName: "",
      companyName: "",
      projectName: "",
      productName: "",
      requirement: "",
      requirementFiles: "",
      clientProfile: "",
      clientBehaviour: "",
      discussionDone: "",
      instructionRecce: "",
      instructionDesign: "",
      instructionInstallation: "",
      instructionOther: "",
      address: "",
      siteLocation: "",
    },
  });

  useEffect(() => {
    if (leadData) {
      reset({
        leadId: id,
        userId: user?._id,
        leadName: leadData?.leadName,
        clientName: leadData?.concernPersonName || "",
        companyName: leadData?.companyName || "",
        requirement: leadData?.requirement || "",
        requirementFiles: leadData?.requirementFiles || "",
        address: leadData.address || "",
        projectName: "",
        productName: "",
        clientProfile: "",
        clientBehaviour: "",
        discussionDone: "",
        instructionRecce: "",
        instructionDesign: "",
        instructionInstallation: "",
        instructionOther: "",
        siteLocation: "",
      });
    }
  }, [leadData, id, reset]);

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

      if (category === null) {
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

      // Create enhanced file object with additional properties
      const enhancedFile = Object.assign(file, {
        id: Date.now() + Math.random(), // Generate unique ID
        category: category,
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
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();

      // Append all form fields
      for (const key in data) {
        formData.append(key, data[key]);
      }

      // Append only the files (not the enhanced objects with id/category)
      documentUpload.forEach((fileObj) => {
        // Create a new File object without the extra properties
        const cleanFile = new File([fileObj], fileObj.name, {
          type: fileObj.type,
          lastModified: fileObj.lastModified,
        });
        formData.append("documentUpload", cleanFile);
      });

      const result = await addClientBriefing({
        formData,
      });

      if (result?.data?.success) {
        toast.success("Client briefing submitted successfully!");

        // Reset form but keep lead data
        reset({
          leadId: id,
          userId: userData?.id,
          leadName: leadData?.leadName,
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
        });

        setDocuments([]);
        navigate('/sales/sales-management-sheet')
      } else {
        console.log(result)
        toast.error(
          result?.error?.data?.message || "Failed to submit briefing. Please try again."
        );
        throw new Error(result?.error?.message || "Submission failed");
      }
    } catch (error) {
      console.error("Submission error:", error);
      // toast.error(
      //   error || "Failed to submit briefing. Please try again."
      // );
    } finally {
      setIsSubmitting(false);
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

  if (previousDataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading lead data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex-col justify-center items-center">
      <PageHeader title="Client Briefing Form" />

      <div className="mx-auto border border-gray-200 rounded-2xl bg-white p-4">
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-2">

            {/* Client Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("clientName")}
                  placeholder="Enter client name"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200"
                />
                {errors.clientName && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.clientName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("companyName")}
                  placeholder="Enter company name"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200"
                />
                {errors.companyName && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.companyName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("projectName")}
                  placeholder="Enter project name"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200"
                />
                {errors.projectName && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.projectName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("productName")}
                  placeholder="Enter product name"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200"
                />
                {errors.productName && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.productName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Client Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client's Requirements
                </label>
                <textarea
                  {...register("requirement")}
                  placeholder="Describe client's requirements and needs..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200 resize-vertical"
                />
                {errors.requirement && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.requirement.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client's Profile
                </label>
                <textarea
                  {...register("clientProfile")}
                  placeholder="Describe client's background, position, company type..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200 resize-vertical"
                />
                {errors.clientProfile && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.clientProfile.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client's Behaviour
                </label>
                <textarea
                  {...register("clientBehaviour")}
                  placeholder="Describe client's communication style, decision-making process..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200 resize-vertical"
                />
                {errors.clientBehaviour && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.clientBehaviour.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discussion Done (with client){" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("discussionDone")}
                  placeholder="Summarize the key points discussed with the client..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200 resize-vertical"
                />
                {errors.discussionDone && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.discussionDone.message}
                  </p>
                )}
              </div>
            </div>

            {/* Team Instructions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructions to Recce Team
                </label>
                <textarea
                  {...register("instructionRecce")}
                  placeholder="Specific instructions for site survey team..."
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200 resize-vertical"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructions to Design Team
                </label>
                <textarea
                  {...register("instructionDesign")}
                  placeholder="Design requirements and specifications..."
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200 resize-vertical"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructions to Installation Team
                </label>
                <textarea
                  {...register("instructionInstallation")}
                  placeholder="Installation guidelines and requirements..."
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200 resize-vertical"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructions to Other
                </label>
                <textarea
                  {...register("instructionOther")}
                  placeholder="Any other specific instructions..."
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200 resize-vertical"
                />
              </div>
            </div>

            {/* location */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  {...register("address")}
                  placeholder="Enter address..."
                  rows={1}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200 resize-vertical"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.address.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site Location <span className="text-red-500">*</span>
                </label>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <textarea
                    rows={1}
                    type="text"
                    {...register("siteLocation")}
                    placeholder="Enter site location manually"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200 resize-vertical"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setValue("siteLocation", leadData?.address || "", {
                        shouldValidate: true,
                      })
                    }
                    className="px-3 py-2 text-xs sm:text-sm bg-gray-100 rounded-lg border hover:bg-gray-200 whitespace-nowrap"
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
                            JSON.stringify([
                              { lat: latitude },
                              { long: longitude },
                            ]),
                            { shouldValidate: true }
                          );

                          toast.success("Location captured successfully");
                          setGeoLoading(false);
                        },
                        (err) => {
                          toast.error("Failed to fetch location");
                          setGeoLoading(false);
                        }
                      );
                    }}
                    className="px-3 py-2 text-xs bg-gray-100 rounded-lg border hover:bg-gray-200 disabled:opacity-50 whitespace-nowrap"
                  >
                    {geoLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <MapPin size={20} />
                    )}
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

            {/* Document Upload */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">
                Document Upload
                {documentUpload.length > 0 && (
                  <span className="ml-2 text-black">
                    ({documentUpload.length} files)
                  </span>
                )}
              </h3>
              

              {/* Upload Area */}
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all ${dragActive
                    ? "border-black bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                  }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >

                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-900">
                    Drop files here or click to upload
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, DOCX, JPG, PNG, MP3, WAV, MP4 up to 10MB each
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp3,.wav,.mp4,.m4v,.mov"
                />
              </div>

              {/* Display uploaded files */}
              {Object.entries(groupedFiles).map(([category, files]) => (
                <div key={category} className="space-y-2">
                  <h4 className="text-sm font-semibold capitalize text-gray-700 flex items-center">
                    {category} files
                    <span className="ml-2 bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs">
                      {files.length}
                    </span>
                  </h4>
                  <div className="space-y-1">
                    {files.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {doc.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(doc.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(doc.id)}
                          className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50"
                          title="Remove file"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <button
                disabled={isSubmitting || !isValid}
                type="submit"
                className={`flex text-sm items-center gap-2 px-4 py-2 rounded font-medium transition-all duration-200 ${isSubmitting || !isValid
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-black text-white hover:bg-black hover:scale-105 shadow-lg"
                  }`}
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? "Submitting..." : "Submit Briefing"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClientBriefingFormPage;