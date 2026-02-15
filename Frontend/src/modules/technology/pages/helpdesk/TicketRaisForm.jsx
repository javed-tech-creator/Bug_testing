// import React, { useEffect, useState } from "react";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { toast } from "react-toastify";
// import { useForm } from "react-hook-form";
// import { useLocation, useNavigate } from "react-router-dom";
// import PageHeader from "@/modules/sales/components/PageHeader";
// import { SLA_RULES } from "@/utils/slaConfig";

// // --- Dummy mutations (replace with RTK Query hooks later) ---
// const useAddTicketMutation = () => [
//   async (data) => ({ data: { success: true } }),
//   { isLoading: false },
// ];
// const useUpdateTicketMutation = () => [
//   async (data) => ({ data: { success: true } }),
//   { isLoading: false },
// ];

// // ✅ Validation schema
// const schema = yup.object().shape({
//   ticketId: yup.string().required("Ticket ID is required"),
//   ticketType: yup.string().required("Ticket Type is required"),
//   raisedBy: yup.string().required("Raised By is required"),
//   priority: yup.string().required("Priority is required"),
//   issueDescription: yup.string().required("Issue Description is required"),
//   assignedTo: yup.string().nullable().notRequired(),
//   slaTimer: yup.string().nullable().notRequired(), // ✅ required hata diya
//   status: yup.string().required("Status is required"),
//   resolutionNotes: yup.string().nullable().notRequired(),
// });

// // ✅ Reusable Input Wrapper
// const FieldWrapper = ({ label, required, error, children }) => (
//   <div className="space-y-2">
//     <label className="block text-sm font-medium text-black/80">
//       {label} {required && <span className="text-red-500">*</span>}
//     </label>
//     {children}
//     {error && <p className="text-red-500 text-sm">{error}</p>}
//   </div>
// );

// // ✅ Attachments Upload Component
// const AttachmentsUpload = ({ attachments, setAttachments }) => {
//   const handleFileChange = (e) => {
//     const newFiles = Array.from(e.target.files).map((file) => ({
//       file,
//       name: file.name,
//       url: URL.createObjectURL(file), // Preview URL
//       type: file.type,
//     }));
//     setAttachments((prev) => [...prev, ...newFiles]);
//   };

//   const handleRemoveFile = (index) => {
//     setAttachments((prev) => prev.filter((_, i) => i !== index));
//   };

//   return (
//     <div className="space-y-2 lg:col-span-3">
//       <label className="block text-sm font-medium text-black/80">
//         Attachments (Screenshots / Logs / Photos / Audio / Video)
//       </label>

//       <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 bg-gray-50 transition">
//         <span className="text-sm text-gray-500">Click and upload files here</span>
//         <input type="file" multiple onChange={handleFileChange} className="hidden" />
//       </label>

//       {attachments.length > 0 && (
//         <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
//           {attachments.map((file, index) => (
//             <div
//               key={index}
//               className="relative border rounded-lg p-2 flex flex-col items-center bg-white shadow hover:shadow-md transition"
//             >
//               {file.type.startsWith("image/") ? (
//                 <img src={file.url} alt={file.name} className="h-20 w-20 object-cover rounded" />
//               ) : file.type.startsWith("audio/") ? (
//                 <audio controls className="w-full">
//                   <source src={file.url} type={file.type} />
//                 </audio>
//               ) : file.type.startsWith("video/") ? (
//                 <video controls className="h-20 w-full rounded">
//                   <source src={file.url} type={file.type} />
//                 </video>
//               ) : (
//                 <div className="h-20 w-20 flex items-center justify-center bg-gray-100 rounded text-lg">📄</div>
//               )}

//               <p className="text-xs mt-2 text-center truncate w-20">{file.name}</p>
//               <button
//                 type="button"
//                 onClick={() => handleRemoveFile(index)}
//                 className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs hover:bg-red-600"
//               >
//                 ✕
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// const TicketAddForm = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const ticketData = location?.state?.ticketData;

//   const [attachments, setAttachments] = useState([]);

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm({
//     mode: "onChange",
//     resolver: yupResolver(schema),
//   });

//   const [addTicket, { isLoading }] = useAddTicketMutation();
//   const [updateTicket, { isLoading: updateLoading }] = useUpdateTicketMutation();

//   useEffect(() => {
//     if (ticketData) {
//       reset({
//         ticketId: ticketData.ticketId || "",
//         ticketType: ticketData.ticketType || "",
//         raisedBy: ticketData.raisedBy || "",
//         priority: ticketData.priority || "",
//         issueDescription: ticketData.issueDescription || "",
//         assignedTo: ticketData.assignedTo || "",
//         status: ticketData.status || "",
//         resolutionNotes: ticketData.resolutionNotes || "",
//       });
//     }
//   }, [ticketData, reset]);

//   const onSubmit = async (data) => {
//     try {
//       const formData = new FormData();

//       // 1️⃣ SLA calculate karo
//       const slaHours = SLA_RULES[data.priority] || 24;
//       const slaDeadline = new Date(Date.now() + slaHours * 60 * 60 * 1000);

//       // 2️⃣ Normal fields append
//       Object.entries(data).forEach(([key, value]) => {
//         formData.append(key, value);
//       });

//       // 3️⃣ SLA deadline
//       formData.append("slaTimer", slaDeadline.toISOString());

//       // 4️⃣ Attachments
//       attachments.forEach((f) => {
//         formData.append("attachments[]", f.file);
//       });

//       //  Debug log
//       for (let [key, value] of formData.entries()) {
//         if (value instanceof File) {
//           console.log(`${key}: ${value.name} | ${value.type} | ${value.size} bytes`);
//         } else {
//           console.log(`${key}: ${value}`);
//         }
//       }

//       // 5️⃣ API Call
//       if (ticketData) {
//         const id = ticketData._id;
//         const result = await updateTicket({ id, formData });
//         if (result?.data?.success) {
//           toast.success("Ticket updated successfully!");
//           reset();
//           navigate("/tickets/view");
//         }
//       } else {
//         await addTicket({ formData }).unwrap();
//         toast.success("Ticket added successfully!");
//         reset();
//         navigate("/tickets/view");
//       }
//     } catch (error) {
//       console.error("Submission error:", error);
//       toast.error(error?.message || "Failed to submit ticket. Please try again.");
//     }
//   };

//   return (
//     <div className="bg-gray-50 justify-center items-center">
//       <PageHeader title={`${ticketData ? "Update Ticket" : "Add New Ticket"}`} />
//       <div className="w-full mx-auto border border-gray-200 rounded-2xl bg-white p-4">
//         <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
//           <form onSubmit={handleSubmit(onSubmit)} className="p-4">
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
//               {/* Ticket ID */}
//               <FieldWrapper label="Ticket ID" required error={errors.ticketId?.message}>
//                 <input type="text" {...register("ticketId")} placeholder="Enter ticket ID" className="w-full px-3 py-2 text-sm border rounded-sm" />
//               </FieldWrapper>

//               {/* Ticket Type */}
//               <FieldWrapper label="Ticket Type" required error={errors.ticketType?.message}>
//                 <select {...register("ticketType")} defaultValue="" className="w-full px-3 py-2 text-sm border rounded-sm bg-white">
//                   <option value="" disabled>Select Ticket Type</option>
//                   <option value="Hardware">Hardware</option>
//                   <option value="Software">Software</option>
//                   <option value="Network">Network</option>
//                   <option value="Access">Access</option>
//                   <option value="Others">Others</option>
//                 </select>
//               </FieldWrapper>

//               {/* Raised By */}
//               <FieldWrapper label="Raised By" required error={errors.raisedBy?.message}>
//                 <input type="text" {...register("raisedBy")} placeholder="Employee ID / Department" className="w-full px-3 py-2 text-sm border rounded-sm" />
//               </FieldWrapper>

//               {/* Priority */}
//               <FieldWrapper label="Priority" required error={errors.priority?.message}>
//                 <select {...register("priority")} defaultValue="" className="w-full px-3 py-2 text-sm border rounded-sm bg-white">
//                   <option value="" disabled>Select Priority</option>
//                   <option value="Low">Low</option>
//                   <option value="Medium">Medium</option>
//                   <option value="High">High</option>
//                   <option value="Critical">Critical</option>
//                 </select>
//               </FieldWrapper>

//               {/* Issue Description */}
//               <FieldWrapper label="Issue Description" required error={errors.issueDescription?.message}>
//                 <textarea {...register("issueDescription")} placeholder="Describe the issue" className="w-full px-3 py-2 text-sm border rounded-sm" rows={3} />
//               </FieldWrapper>

//               {/* Attachments */}
//               <AttachmentsUpload attachments={attachments} setAttachments={setAttachments} />

//               {/* Assigned To */}
//               <FieldWrapper label="Assigned To" error={errors.assignedTo?.message}>
//                 <input type="text" {...register("assignedTo")} placeholder="IT Engineer / Vendor" className="w-full px-3 py-2 text-sm border rounded-sm" />
//               </FieldWrapper>

//               {/* Status */}
//               <FieldWrapper label="Status" required error={errors.status?.message}>
//                 <select {...register("status")} defaultValue="" className="w-full px-3 py-2 text-sm border rounded-sm bg-white">
//                   <option value="" disabled>Select Status</option>
//                   <option value="Open">Open</option>
//                   <option value="In-Progress">In-Progress</option>
//                   <option value="On-Hold">On-Hold</option>
//                   <option value="Resolved">Resolved</option>
//                   <option value="Closed">Closed</option>
//                 </select>
//               </FieldWrapper>

//               {/* Resolution Notes */}
//               <FieldWrapper label="Resolution Notes" error={errors.resolutionNotes?.message}>
//                 <textarea {...register("resolutionNotes")} placeholder="Add resolution details" className="w-full px-3 py-2 text-sm border rounded-sm" rows={3} />
//               </FieldWrapper>
//             </div>

//             {/* Submit */}
//             <div className="mt-4 flex justify-end">
//               <button
//                 disabled={isLoading || updateLoading}
//                 type="submit"
//                 className={`${isLoading || updateLoading ? "cursor-not-allowed bg-gray-400" : "cursor-pointer bg-orange-500 hover:bg-orange-600"} px-4 py-2 text-sm rounded-sm text-white`}
//               >
//                 {isLoading || updateLoading ? "Submitting..." : ticketData ? "Update" : "Submit"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TicketAddForm;
