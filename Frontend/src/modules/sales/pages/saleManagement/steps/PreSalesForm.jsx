// import React, { useEffect, useMemo, useState } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { Upload, FileText, X, Loader2, MapPin, Search } from "lucide-react";
// import {
//   useAddClientBriefingMutation,
//   useFetchLeadByIdQuery,
// } from "../../../../../api/sales/lead.api";
// import { toast } from "react-toastify";
// import PageHeader from "../../../components/PageHeader";
// import { useParams } from "react-router-dom";
// import { useGetProjectByIdQuery } from "../../../../../api/sales/sales.api";

// // Updated schema - made leadName optional since it's auto-filled
// const schema = yup.object().shape({
//   leadId: yup.string().required("Lead ID is required"),
//   leadName: yup.string(), // Made optional since it's auto-filled
//   clientName: yup.string().required("Client name is required"),
//   companyName: yup.string().required("Company name is required"),
//   projectName: yup.string().required("Project name is required"),
//   productName: yup.string().required("Product name is required"),
//   requirement: yup.string(),
//   clientProfile: yup.string(),
//   clientBehaviour: yup.string(),
//   discussionDone: yup.string().required("Discussion summary is required"),
//   instructionRecce: yup.string(),
//   instructionDesign: yup.string(),
//   instructionInstallation: yup.string(),
//   instructionOther: yup.string(),
//   siteLocation: yup.string().required("Site location is required"),
// });

// const PreSalesForm = () => {
//   const [documentUpload, setDocuments] = useState([]);
//   const [dragActive, setDragActive] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [geoLoading, setGeoLoading] = useState(false);

//   const { id } = useParams();

//   const {
//     data,
//     isLoading: previousDataLoading,
//     refetch,
//   } = useGetProjectByIdQuery({ id });

//   const salesData = data?.data?.result;
//   console.log(salesData)
//   const [addClientBriefing, { isLoading: briefingLoading }] =
//     useAddClientBriefingMutation();

//   const {
//     register,
//     handleSubmit,
//     control,
//     formState: { errors, isValid },
//     reset,
//     setValue,
//     watch,
//   } = useForm({
//     mode: "onChange",
//     resolver: yupResolver(schema),
//     defaultValues: {
//       leadId: id || "",
//       leadName: "",
//       clientName: "",
//       companyName: "",
//       projectName: "",
//       productName: "",
//       requirement: "",
//       clientProfile: "",
//       clientBehaviour: "",
//       discussionDone: "",
//       instructionRecce: "",
//       instructionDesign: "",
//       instructionInstallation: "",
//       instructionOther: "",
//       address: "",
//       siteLocation: "",
//     },
//   });

//   useEffect(() => {
//     if (salesData) {
//       reset({
//         leadId: id,
//         clientName: salesData?.concernPersonName || "",
//         companyName: salesData?.companyName || "",
//         requirement: salesData?.requirement || "",
//         address: salesData.address || "",
//         projectName: "",
//         productName: "",
//         clientProfile: "",
//         clientBehaviour: "",
//         discussionDone: "",
//         instructionRecce: "",
//         instructionDesign: "",
//         instructionInstallation: "",
//         instructionOther: "",
//         siteLocation: "",
//       });
//     }
//   }, [salesData, id, reset]);

//   const MAX_FILE_SIZE_MB = 10;
//   const ALLOWED_TYPES = {
//     document: [
//       "application/pdf",
//       "application/msword",
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//     ],
//     image: ["image/jpeg", "image/png", "image/jpg"],
//     audio: ["audio/mpeg", "audio/mp3", "audio/wav"],
//     video: ["video/mp4", "video/quicktime", "video/x-m4v"],
//   };

//   const getFileCategory = (type) => {
//     if (ALLOWED_TYPES.document.includes(type)) return "document";
//     if (ALLOWED_TYPES.image.includes(type)) return "image";
//     if (ALLOWED_TYPES.audio.includes(type)) return "audio";
//     if (ALLOWED_TYPES.video.includes(type)) return "video";
//     return "others";
//   };

//   const handleFileUpload = (files) => {
//     if (!files || files.length === 0) return;

//     const validFiles = [];
//     const maxFiles = 10;

//     if (documentUpload.length + files.length > maxFiles) {
//       toast.error(`You can only upload maximum ${maxFiles} files`);
//       return;
//     }

//     Array.from(files).forEach((file) => {
//       const category = getFileCategory(file.type);

//       if (category === null) {
//         toast.error(`${file.name} is not a supported file type`);
//         return;
//       }

//       if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
//         toast.error(`${file.name} exceeds ${MAX_FILE_SIZE_MB}MB limit`);
//         return;
//       }

//       const isDuplicate = documentUpload.some(
//         (doc) => doc.name === file.name && doc.size === file.size
//       );

//       if (isDuplicate) {
//         toast.error(`${file.name} is already uploaded`);
//         return;
//       }

//       // Create enhanced file object with additional properties
//       const enhancedFile = Object.assign(file, {
//         id: Date.now() + Math.random(), // Generate unique ID
//         category: category,
//       });

//       validFiles.push(enhancedFile);
//     });

//     if (validFiles.length > 0) {
//       setDocuments((prev) => [...prev, ...validFiles]);
//       toast.success(`${validFiles.length} file(s) uploaded successfully`);
//     }
//   };

//   const removeFile = (fileId) => {
//     setDocuments((prev) => prev.filter((doc) => doc.id !== fileId));
//     toast.info("File removed");
//   };

//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return "0 Bytes";
//     const k = 1024;
//     const sizes = ["Bytes", "KB", "MB", "GB"];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
//   };

//   const handleDrag = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === "dragenter" || e.type === "dragover") {
//       setDragActive(true);
//     } else if (e.type === "dragleave") {
//       setDragActive(false);
//     }
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);

//     if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
//       handleFileUpload(e.dataTransfer.files);
//     }
//   };

//   const onSubmit = async (data) => {
//     try {
//       setIsSubmitting(true);

//       const formData = new FormData();

//       // Append all form fields
//       for (const key in data) {
//         formData.append(key, data[key]);
//       }

//       // Append only the files (not the enhanced objects with id/category)
//       documentUpload.forEach((fileObj) => {
//         // Create a new File object without the extra properties
//         const cleanFile = new File([fileObj], fileObj.name, {
//           type: fileObj.type,
//           lastModified: fileObj.lastModified,
//         });
//         formData.append("documentUpload", cleanFile);
//       });

//       const result = await addClientBriefing({
//         formData,
//       });

//       if (result?.data?.success) {
//         toast.success("Client briefing submitted successfully!");

//         // Reset form but keep lead data
//         reset({
//           leadId: id,
//           leadName: salesData?.leadName,
//           clientName: salesData?.concernPersonName || "",
//           companyName: salesData?.companyName || "",
//           projectName: "",
//           productName: "",
//           requirement: salesData?.requirement || "",
//           clientProfile: "",
//           clientBehaviour: "",
//           discussionDone: "",
//           instructionRecce: "",
//           instructionDesign: "",
//           instructionInstallation: "",
//           instructionOther: "",
//           address: salesData?.address || "",
//           siteLocation: "",
//         });

//         setDocuments([]);
//       } else {
//         throw new Error(result?.error?.message || "Submission failed");
//       }
//     } catch (error) {
//       console.error("Submission error:", error);
//       toast.error(
//         error.message || "Failed to submit briefing. Please try again."
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const groupedFiles = useMemo(() => {
//     return documentUpload.reduce((acc, file) => {
//       const cat = file.category || "others";
//       acc[cat] = acc[cat] || [];
//       acc[cat].push(file);
//       return acc;
//     }, {});
//   }, [documentUpload]);

//   if (previousDataLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="flex items-center space-x-2">
//           <Loader2 className="w-6 h-6 animate-spin" />
//           <span>Loading lead data...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex-col justify-center items-center">

//       <div className="mx-auto border border-gray-200 rounded-2xl bg-white p-4">
//         <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
//           <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-2">
//             {/* Client Details */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Client Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   {...register("clientName")}
//                   placeholder="Enter client name"
//                   className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200"
//                 />
//                 {errors.clientName && (
//                   <p className="text-red-500 text-sm mt-1 flex items-center">
//                     <span className="mr-1">⚠</span>
//                     {errors.clientName.message}
//                   </p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Company Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   {...register("companyName")}
//                   placeholder="Enter company name"
//                   className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200"
//                 />
//                 {errors.companyName && (
//                   <p className="text-red-500 text-sm mt-1 flex items-center">
//                     <span className="mr-1">⚠</span>
//                     {errors.companyName.message}
//                   </p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Project Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   {...register("projectName")}
//                   placeholder="Enter project name"
//                   className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200"
//                 />
//                 {errors.projectName && (
//                   <p className="text-red-500 text-sm mt-1 flex items-center">
//                     <span className="mr-1">⚠</span>
//                     {errors.projectName.message}
//                   </p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Product Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   {...register("productName")}
//                   placeholder="Enter product name"
//                   className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200"
//                 />
//                 {errors.productName && (
//                   <p className="text-red-500 text-sm mt-1 flex items-center">
//                     <span className="mr-1">⚠</span>
//                     {errors.productName.message}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Client Information */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Client's Requirements
//                 </label>
//                 <textarea
//                   {...register("requirement")}
//                   placeholder="Describe client's requirements and needs..."
//                   rows={2}
//                   className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200 resize-vertical"
//                 />
//                 {errors.requirement && (
//                   <p className="text-red-500 text-sm mt-1 flex items-center">
//                     <span className="mr-1">⚠</span>
//                     {errors.requirement.message}
//                   </p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Client's Profile
//                 </label>
//                 <textarea
//                   {...register("clientProfile")}
//                   placeholder="Describe client's background, position, company type..."
//                   rows={2}
//                   className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200 resize-vertical"
//                 />
//                 {errors.clientProfile && (
//                   <p className="text-red-500 text-sm mt-1 flex items-center">
//                     <span className="mr-1">⚠</span>
//                     {errors.clientProfile.message}
//                   </p>
//                 )}
//               </div>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Client's Behaviour
//                 </label>
//                 <textarea
//                   {...register("clientBehaviour")}
//                   placeholder="Describe client's communication style, decision-making process..."
//                   rows={2}
//                   className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200 resize-vertical"
//                 />
//                 {errors.clientBehaviour && (
//                   <p className="text-red-500 text-sm mt-1 flex items-center">
//                     <span className="mr-1">⚠</span>
//                     {errors.clientBehaviour.message}
//                   </p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Discussion Done (with client){" "}
//                   <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   {...register("discussionDone")}
//                   placeholder="Summarize the key points discussed with the client..."
//                   rows={2}
//                   className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200 resize-vertical"
//                 />
//                 {errors.discussionDone && (
//                   <p className="text-red-500 text-sm mt-1 flex items-center">
//                     <span className="mr-1">⚠</span>
//                     {errors.discussionDone.message}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Team Instructions */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Instructions to Recce Team
//                 </label>
//                 <textarea
//                   {...register("instructionRecce")}
//                   placeholder="Specific instructions for site survey team..."
//                   rows={2}
//                   className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200 resize-vertical"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Instructions to Design Team
//                 </label>
//                 <textarea
//                   {...register("instructionDesign")}
//                   placeholder="Design requirements and specifications..."
//                   rows={2}
//                   className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200 resize-vertical"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Instructions to Installation Team
//                 </label>
//                 <textarea
//                   {...register("instructionInstallation")}
//                   placeholder="Installation guidelines and requirements..."
//                   rows={2}
//                   className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200 resize-vertical"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Instructions to Other Teams
//                 </label>
//                 <textarea
//                   {...register("instructionOther")}
//                   placeholder="Any other specific instructions..."
//                   rows={2}
//                   className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200 resize-vertical"
//                 />
//               </div>
//             </div>

//             {/* location */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Address
//                 </label>
//                 <textarea
//                   {...register("address")}
//                   placeholder="Enter address..."
//                   rows={1}
//                   className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200 resize-vertical"
//                 />
//                 {errors.address && (
//                   <p className="text-red-500 text-sm mt-1 flex items-center">
//                     <span className="mr-1">⚠</span>
//                     {errors.address.message}
//                   </p>
//                 )}
//               </div>
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Site Location <span className="text-red-500">*</span>
//                 </label>

//                 <div className="flex flex-col gap-2 sm:flex-row">
//                   <textarea
//                     rows={1}
//                     type="text"
//                     {...register("siteLocation")}
//                     placeholder="Enter site location manually"
//                     className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors duration-200 resize-vertical"
//                   />

//                   <button
//                     type="button"
//                     onClick={() =>
//                       setValue("siteLocation", salesData?.address || "", {
//                         shouldValidate: true,
//                       })
//                     }
//                     className="px-3 py-2 text-xs sm:text-sm bg-gray-100 rounded-lg border hover:bg-gray-200 whitespace-nowrap"
//                   >
//                     Same as Address
//                   </button>

//                   <button
//                     type="button"
//                     disabled={geoLoading}
//                     onClick={() => {
//                       setGeoLoading(true);
//                       navigator.geolocation.getCurrentPosition(
//                         (pos) => {
//                           const { latitude, longitude } = pos.coords;
//                           setValue(
//                             "siteLocation",
//                             JSON.stringify([
//                               { lat: latitude },
//                               { long: longitude },
//                             ]),
//                             { shouldValidate: true }
//                           );

//                           toast.success("Location captured successfully");
//                           setGeoLoading(false);
//                         },
//                         (err) => {
//                           toast.error("Failed to fetch location");
//                           setGeoLoading(false);
//                         }
//                       );
//                     }}
//                     className="px-3 py-2 text-xs bg-gray-100 rounded-lg border hover:bg-gray-200 disabled:opacity-50 whitespace-nowrap"
//                   >
//                     {geoLoading ? (
//                       <Loader2 className="w-5 h-5 animate-spin" />
//                     ) : (
//                       <MapPin size={20} />
//                     )}
//                   </button>
//                 </div>

//                 {errors.siteLocation && (
//                   <p className="text-red-500 text-sm mt-1 flex items-center">
//                     <span className="mr-1">⚠</span>
//                     {errors.siteLocation.message}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Document Upload */}
//             <div className="space-y-2">
//               <h3 className="text-sm font-medium text-gray-700">
//                 Document Upload
//                 {documentUpload.length > 0 && (
//                   <span className="ml-2 text-black">
//                     ({documentUpload.length} files)
//                   </span>
//                 )}
//               </h3>

//               {/* Upload Area */}
//               <div
//                 className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all ${
//                   dragActive
//                     ? "border-black bg-blue-50"
//                     : "border-gray-300 hover:border-gray-400"
//                 }`}
//                 onDragEnter={handleDrag}
//                 onDragLeave={handleDrag}
//                 onDragOver={handleDrag}
//                 onDrop={handleDrop}
//               >
//                 <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
//                 <div className="space-y-1">
//                   <p className="text-sm font-medium text-gray-900">
//                     Drop files here or click to upload
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     PDF, DOC, DOCX, JPG, PNG, MP3, WAV, MP4 up to 10MB each
//                   </p>
//                 </div>
//                 <input
//                   type="file"
//                   multiple
//                   onChange={(e) => handleFileUpload(e.target.files)}
//                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                   accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp3,.wav,.mp4,.m4v,.mov"
//                 />
//               </div>

//               {/* Display uploaded files */}
//               {Object.entries(groupedFiles).map(([category, files]) => (
//                 <div key={category} className="space-y-2">
//                   <h4 className="text-sm font-semibold capitalize text-gray-700 flex items-center">
//                     {category} files
//                     <span className="ml-2 bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs">
//                       {files.length}
//                     </span>
//                   </h4>
//                   <div className="space-y-1">
//                     {files.map((doc) => (
//                       <div
//                         key={doc.id}
//                         className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
//                       >
//                         <div className="flex items-center gap-3">
//                           <FileText className="w-5 h-5 text-gray-500" />
//                           <div>
//                             <p className="text-sm font-medium text-gray-900">
//                               {doc.name}
//                             </p>
//                             <p className="text-xs text-gray-500">
//                               {formatFileSize(doc.size)}
//                             </p>
//                           </div>
//                         </div>
//                         <button
//                           type="button"
//                           onClick={() => removeFile(doc.id)}
//                           className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50"
//                           title="Remove file"
//                         >
//                           <X className="w-4 h-4" />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Submit Button */}
//             <div className="flex justify-end pt-4 border-t border-gray-200">
//               <button
//                 disabled={isSubmitting || !isValid}
//                 type="submit"
//                 className={`flex text-sm items-center gap-2 px-4 py-2 rounded font-medium transition-all duration-200 ${
//                   isSubmitting || !isValid
//                     ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                     : "bg-black text-white hover:bg-black hover:scale-105 shadow-lg"
//                 }`}
//               >
//                 {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
//                 {isSubmitting ? "Submitting..." : "Submit Briefing"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PreSalesForm;

import React, { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Upload,
  FileText,
  X,
  Loader2,
  MapPin,
  Search,
  Edit2,
  Save,
  Eye,
  ExternalLink,
  ArrowBigRight,
  ArrowBigLeft,
} from "lucide-react";
import { toast } from "react-toastify";
import { useGetProjectByIdQuery } from "../../../../../api/sales/sales.api";
import { useParams } from "react-router-dom";
import Loader from "../../../../../components/Loader";

const mockSalesData = {
  success: true,
  data: {
    result: {
      salesManagementStep: 0,
      _id: "6889d96ca2aec8676b6f3d0b",
      leadId: "6889d01a77d5e95f52ab050e",
      clientName: "jitendra",
      companyName: "code crafter",
      projectName: "ABCD",
      productName: "1233ABC",
      clientProfile: "abcde",
      clientBehaviour: "Good",
      discussionDone: "good",
      instructionRecce: "best",
      instructionDesign: "good1",
      instructionInstallation: "good11",
      instructionOther: "best",
      projectId: "DSS/2025/0024",
      siteLocation: "123 Main St, Sample City",
      address: "456 Office Blvd, Business District",
      requirement: "Need comprehensive solution for business automation",
      documentUpload: [
        {
          url: "https://res.cloudinary.com/dvnhxgltf/image/upload/v1753864555/client-briefings/6fd662ac-4a0b-435c-b5f5-7331c8cb733f-Screenshot_2025-07-29_151209.png.png",
          public_id:
            "client-briefings/6fd662ac-4a0b-435c-b5f5-7331c8cb733f-Screenshot_2025-07-29_151209.png",
          _id: "6889d96ca2aec8676b6f3d0c",
        },
        {
          url: "https://res.cloudinary.com/dvnhxgltf/image/upload/v1753864556/client-briefings/80956d3e-05f6-49b7-9952-3817c4cde1d2-Screenshot_2025-07-29_151546.png.png",
          public_id:
            "client-briefings/80956d3e-05f6-49b7-9952-3817c4cde1d2-Screenshot_2025-07-29_151546.png",
          _id: "6889d96ca2aec8676b6f3d0d",
        },
      ],
      createdAt: "2025-07-30T08:35:56.415Z",
      updatedAt: "2025-07-30T08:35:56.415Z",
      __v: 0,
    },
  },
};

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
  siteLocation: yup.string().required("Site location is required"),
});

const PreSalesEditForm = ({onNext}) => {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [documentUpload, setDocuments] = useState([]);
  const [existingDocuments, setExistingDocuments] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const {
    data,
    isLoading: salesLoding,
    error,
  } = useGetProjectByIdQuery({ id });
  const salesData = data?.data?.result;

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
      leadId: "",
      leadName: "",
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
    },
  });

  useEffect(() => {
    if (salesData) {
      const formData = {
        leadId: salesData.leadId || "",
        clientName: salesData.clientName || "",
        companyName: salesData.companyName || "",
        projectName: salesData.projectName || "",
        productName: salesData.productName || "",
        requirement: salesData.requirement || "",
        clientProfile: salesData.clientProfile || "",
        clientBehaviour: salesData.clientBehaviour || "",
        discussionDone: salesData.discussionDone || "",
        instructionRecce: salesData.instructionRecce || "",
        instructionDesign: salesData.instructionDesign || "",
        instructionInstallation: salesData.instructionInstallation || "",
        instructionOther: salesData.instructionOther || "",
        address: salesData.address || "",
        siteLocation: salesData.siteLocation || "Site Location",
      };

      reset(formData);
      setExistingDocuments(salesData.documentUpload || []);
      setIsLoading(false);
    }
  }, [salesData, reset]);

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

      const enhancedFile = Object.assign(file, {
        id: Date.now() + Math.random(),
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

  const removeExistingFile = (fileId) => {
    setExistingDocuments((prev) => prev.filter((doc) => doc._id !== fileId));
    toast.info("Existing file will be removed on save");
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileNameFromUrl = (url) => {
    const parts = url.split("/");
    const fileName = parts[parts.length - 1];
    return fileName.replace(".png.png", ".png").replace(".jpg.jpg", ".jpg");
  };

  const previewFile = (url) => {
    window.open(url, "_blank");
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
    onNext()
    // try {
    //   setIsSubmitting(true);

    //   const formData = new FormData();

    //   for (const key in data) {
    //     formData.append(key, data[key]);
    //   }

    //   documentUpload.forEach((fileObj) => {
    //     const cleanFile = new File([fileObj], fileObj.name, {
    //       type: fileObj.type,
    //       lastModified: fileObj.lastModified,
    //     });
    //     formData.append("documentUpload", cleanFile);
    //   });

    //   // Here you would make the API call to update the briefing
    //   // const result = await updateClientBriefing({ formData });

    //   // Simulate API call
    //   setTimeout(() => {
    //     toast.success("Client briefing updated successfully!");
    //     setIsEditing(false);
    //     setDocuments([]);
    //     setIsSubmitting(false);
    //   }, 2000);
    // } catch (error) {
    //   console.error("Update error:", error);
    //   toast.error("Failed to update briefing. Please try again.");
    //   setIsSubmitting(false);
    // }
  };

  const groupedFiles = useMemo(() => {
    return documentUpload.reduce((acc, file) => {
      const cat = file.category || "others";
      acc[cat] = acc[cat] || [];
      acc[cat].push(file);
      return acc;
    }, {});
  }, [documentUpload]);

  const handleBack = () => {
    window.history.back();
  };
  if (isLoading) {
    return (
    <Loader/>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex-col justify-center items-center">
      <div className="mx-auto border border-gray-200 rounded-2xl bg-white p-4">
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header with Edit Button */}
          {/* <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Client Briefing Details</h2>
              <p className="text-sm text-gray-500">Project ID: {salesData?.projectId}</p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              {isEditing ? "Cancel Edit" : "Edit"}
            </button>
          </div> */}

          <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-2">
              {/* View-only mode footer */}
            {!isEditing && (
              <div className="pb-3 border-b border-gray-200">
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <p>
                    Briefing At:{" "}
                    {new Date(salesData?.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    Last Updated:{" "}
                    {new Date(salesData?.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
            {/* Client Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("clientName")}
                  disabled={!isEditing}
                  placeholder="Enter client name"
                  className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg transition-colors duration-200 ${
                    isEditing
                      ? "focus:ring-2 focus:ring-black focus:border-black"
                      : "bg-gray-50 cursor-not-allowed"
                  }`}
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
                  disabled={!isEditing}
                  placeholder="Enter company name"
                  className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg transition-colors duration-200 ${
                    isEditing
                      ? "focus:ring-2 focus:ring-black focus:border-black"
                      : "bg-gray-50 cursor-not-allowed"
                  }`}
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
                  disabled={!isEditing}
                  placeholder="Enter project name"
                  className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg transition-colors duration-200 ${
                    isEditing
                      ? "focus:ring-2 focus:ring-black focus:border-black"
                      : "bg-gray-50 cursor-not-allowed"
                  }`}
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
                  disabled={!isEditing}
                  placeholder="Enter product name"
                  className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg transition-colors duration-200 ${
                    isEditing
                      ? "focus:ring-2 focus:ring-black focus:border-black"
                      : "bg-gray-50 cursor-not-allowed"
                  }`}
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
                  disabled={!isEditing}
                  placeholder="Describe client's requirements and needs..."
                  rows={2}
                  className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg transition-colors duration-200 resize-vertical ${
                    isEditing
                      ? "focus:ring-2 focus:ring-black focus:border-black"
                      : "bg-gray-50 cursor-not-allowed"
                  }`}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client's Profile
                </label>
                <textarea
                  {...register("clientProfile")}
                  disabled={!isEditing}
                  placeholder="Describe client's background, position, company type..."
                  rows={2}
                  className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg transition-colors duration-200 resize-vertical ${
                    isEditing
                      ? "focus:ring-2 focus:ring-black focus:border-black"
                      : "bg-gray-50 cursor-not-allowed"
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client's Behaviour
                </label>
                <textarea
                  {...register("clientBehaviour")}
                  disabled={!isEditing}
                  placeholder="Describe client's communication style, decision-making process..."
                  rows={2}
                  className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg transition-colors duration-200 resize-vertical ${
                    isEditing
                      ? "focus:ring-2 focus:ring-black focus:border-black"
                      : "bg-gray-50 cursor-not-allowed"
                  }`}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discussion Done (with client){" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("discussionDone")}
                  disabled={!isEditing}
                  placeholder="Summarize the key points discussed with the client..."
                  rows={2}
                  className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg transition-colors duration-200 resize-vertical ${
                    isEditing
                      ? "focus:ring-2 focus:ring-black focus:border-black"
                      : "bg-gray-50 cursor-not-allowed"
                  }`}
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
                  disabled={!isEditing}
                  placeholder="Specific instructions for site survey team..."
                  rows={2}
                  className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg transition-colors duration-200 resize-vertical ${
                    isEditing
                      ? "focus:ring-2 focus:ring-black focus:border-black"
                      : "bg-gray-50 cursor-not-allowed"
                  }`}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructions to Design Team
                </label>
                <textarea
                  {...register("instructionDesign")}
                  disabled={!isEditing}
                  placeholder="Design requirements and specifications..."
                  rows={2}
                  className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg transition-colors duration-200 resize-vertical ${
                    isEditing
                      ? "focus:ring-2 focus:ring-black focus:border-black"
                      : "bg-gray-50 cursor-not-allowed"
                  }`}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructions to Installation Team
                </label>
                <textarea
                  {...register("instructionInstallation")}
                  disabled={!isEditing}
                  placeholder="Installation guidelines and requirements..."
                  rows={2}
                  className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg transition-colors duration-200 resize-vertical ${
                    isEditing
                      ? "focus:ring-2 focus:ring-black focus:border-black"
                      : "bg-gray-50 cursor-not-allowed"
                  }`}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructions to Other Teams
                </label>
                <textarea
                  {...register("instructionOther")}
                  disabled={!isEditing}
                  placeholder="Any other specific instructions..."
                  rows={2}
                  className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg transition-colors duration-200 resize-vertical ${
                    isEditing
                      ? "focus:ring-2 focus:ring-black focus:border-black"
                      : "bg-gray-50 cursor-not-allowed"
                  }`}
                />
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  {...register("address")}
                  disabled={!isEditing}
                  placeholder="Enter address..."
                  rows={1}
                  className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg transition-colors duration-200 resize-vertical ${
                    isEditing
                      ? "focus:ring-2 focus:ring-black focus:border-black"
                      : "bg-gray-50 cursor-not-allowed"
                  }`}
                />
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
                    disabled={!isEditing}
                    placeholder="Enter site location manually"
                    className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-lg transition-colors duration-200 resize-vertical ${
                      isEditing
                        ? "focus:ring-2 focus:ring-black focus:border-black"
                        : "bg-gray-50 cursor-not-allowed"
                    }`}
                  />

                  {isEditing && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setValue("siteLocation", watch("address") || "", {
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
                    </>
                  )}
                </div>

                {errors.siteLocation && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.siteLocation.message}
                  </p>
                )}
              </div>
            </div>

            {/* Existing Documents */}
            {existingDocuments.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700">
                  Existing Documents ({existingDocuments.length} files)
                </h3>
                <div className="space-y-1">
                  {existingDocuments.map((doc) => (
                    <div
                      key={doc._id}
                      className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {getFileNameFromUrl(doc.url)}
                          </p>
                          <p className="text-xs text-gray-500">Existing file</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => previewFile(doc.url)}
                          className="text-blue-500 hover:text-blue-700 transition-colors p-1 rounded-full hover:bg-blue-100"
                          title="Preview file"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => removeExistingFile(doc._id)}
                            className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50"
                            title="Remove file"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Document Upload - Only show when editing */}
            {isEditing && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700">
                  Add New Documents
                  {documentUpload.length > 0 && (
                    <span className="ml-2 text-black">
                      ({documentUpload.length} new files)
                    </span>
                  )}
                </h3>

                {/* Upload Area */}
                <div
                  className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all ${
                    dragActive
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
                      New {category} files
                      <span className="ml-2 bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs">
                        {files.length}
                      </span>
                    </h4>
                    <div className="space-y-1">
                      {files.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-green-500" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {doc.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatFileSize(doc.size)} - New file
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
            )}

            {/* Submit Button - Only show when editing */}
            {isEditing && (
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  disabled={isSubmitting || !isValid}
                  type="submit"
                  className={`flex text-sm items-center gap-2 px-4 py-2 rounded font-medium transition-all duration-200 ${
                    isSubmitting || !isValid
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-black text-white hover:bg-black hover:scale-105 shadow-lg"
                  }`}
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <Save className="w-4 h-4" />
                  {isSubmitting ? "Updating..." : "Update Briefing"}
                </button>
              </div>
            )}

          
          <div className="mt-4 px-2 flex justify-between text-[14px]">
            <button
              type="button"
              onClick={handleBack}
              className={` cursor-pointer px-6 py-2 bg-gray-600 rounded-sm text-white focus:ring-offset-2 transform  transition-all duration-200 shadow-lg`}
            >
              <ArrowBigLeft className="inline" /> Back
            </button>

            <button
              type="submit"
              className={`  px-6 py-2 bg-black rounded-sm text-white focus:ring-offset-2 transform hover:scale-105 transition-all duration-200 shadow-lg`}
            >
              Next <ArrowBigRight className="inline" />
            </button>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PreSalesEditForm;
