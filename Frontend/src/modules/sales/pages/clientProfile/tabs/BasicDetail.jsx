// import React, { use, useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { toast } from "react-toastify";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   useFetchLeadByIdQuery,
//   useGetUserByDepartmentQuery,
//   useUpdateLeadMutation,
// } from "@/api/sales/lead.api";
// import Loader from "@/components/Loader";
// import { Pencil } from "lucide-react";
// import {
//   useGetClientByIdQuery,
//   useUpdateClientMutation,
// } from "@/api/sales/client.api";
// import { useSelector } from "react-redux";

// // Client Schema
// const clientSchema = yup.object().shape({
//   clientName: yup.string().required("Client name is required"),
//   companyName: yup.string().required("Company name is required"),
//   phone: yup
//     .string()
//     .required("Client contact number is required")
//     .matches(/^[0-9]{10}$/, "Enter a valid 10-digit number"),
//   altPhone: yup.string().nullable(),
//   email: yup.string().email("Enter a valid email"),
//   city: yup.string(),
//   pincode: yup.string(),
//   address: yup.string().required("Full address is required"),
//   businessType: yup.string(),
//   designation: yup.string(),
//   clientRating: yup.string(),
//   revenue: yup.string().required("Revenue level is required"),
//   satisfaction: yup.string().required("Satisfaction level is required"),
//   repeatPotential: yup.string().required("Repeat potential is required"),
//   complexity: yup.string().required("Complexity level is required"),
//   engagement: yup.string().required("Engagement level is required"),
//   positiveAttitude: yup
//     .string()
//     .required("Positive attitude rating is required"),
// });

// // Lead Schema
// const leadSchema = yup.object().shape({
//   requirement: yup.string(),
//   phone: yup.number().nullable().typeError("Enter a valid phone number"),
//   altPhone: yup.number().nullable().typeError("Enter a valid alternate number"),
//   remark: yup.string(),
//   leadType: yup.string().required("Client type is required"),
//   clientRatingInBusiness: yup
//     .number()
//     .min(0)
//     .max(10)
//     .required("Client rating is required"),
//   leadSource: yup.string(),
//   expectedBusiness: yup.string(),
//   relationshipManager: yup
//     .string()
//     .required("Relationship Manager is required"),
//   dealBy: yup.string().required("Deal By is required"),
//   leadBy: yup.string().required("Lead By is required"),
// });

// const BesicDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { data, isFetching, refetch } = useGetClientByIdQuery({ id });
//   const [updateLead] = useUpdateLeadMutation();
//   const [updateClient] = useUpdateClientMutation();

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [clientSubmitting, setClientSubmitting] = useState(false);
//   const [isClientEditable, setIsClientEditable] = useState(false);
//   const [isLeadEditable, setIsLeadEditable] = useState(false);
//   const [activeLeadIndex, setActiveLeadIndex] = useState(0);
//   const [documentUpload, setDocuments] = useState([]);
//   const res = useSelector((state) => state.auth.userData);
//   const user = res?.user || {};

//   const { data: getUser, isLoading } = useGetUserByDepartmentQuery({
//     deptId: user.department?._id || "",
//   });
//   const userList = isLoading ? [] : getUser?.data?.users || [];
//   console.log(userList);

//   // const userList = [
//   //   { _id: "u1", name: "Amit Sharma" },
//   //   { _id: "u2", name: "Priya Patel" },
//   //   { _id: "u3", name: "Rahul Verma" },
//   //   { _id: "u4", name: "Sneha Iyer" },
//   //   { _id: "u5", name: "Vikram Singh" },
//   // ];

//   // Client Form
//   const {
//     register: registerClient,
//     handleSubmit: handleClientSubmit,
//     formState: { errors: clientErrors },
//     reset: resetClient,
//     watch: watchClient,
//   } = useForm({
//     mode: "onChange",
//     resolver: yupResolver(clientSchema),
//   });

//   // Lead Form
//   const {
//     register: registerLead,
//     handleSubmit: handleLeadSubmit,
//     formState: { errors: leadErrors },
//     reset: resetLead,
//     watch: watchLead,
//     setValue: setLeadValue,
//     setValue: setDealValue,
//     setValue: setrelationValue,
//   } = useForm({
//     mode: "onChange",
//     resolver: yupResolver(leadSchema),
//   });

//   const expectedBusiness = watchLead("expectedBusiness");

//   useEffect(() => {
//     if (data?.data) {
//       const client = data?.data;
//       const lead = client.leadData?.[activeLeadIndex] || {};

//       // Reset Client Form
//       resetClient({
//         clientName: client.name || "",
//         companyName: client.companyName || "",
//         phone: client.phone || "",
//         altPhone: lead.altPhone || "",
//         email: client.email || "",
//         city: client.city || "",
//         pincode: client.pincode || "",
//         address: client.address || "",
//         businessType: client.businessType || "",
//         designation: client.designation || "",
//         clientRating: client.clientRating || 0,
//         satisfaction: client.satisfaction || null,
//         repeatPotential: client.repeatPotential || null,
//         complexity: client.complexity || null,
//         engagement: client.engagement || null,
//         positiveAttitude: client.positiveAttitude || null,
//         revenue: client.revenue || null,
//       });

//       // Reset Lead Form
//       resetLead({
//         leadSource: lead.leadSource || "",
//         phone: lead.phone || "",
//         altPhone: lead.altPhone || "",
//         leadBy: lead.leadBy?._id || "",
//         leadType: lead.leadType || "",
//         clientRatingInBusiness: lead.clientRatingInBusiness || "",
//         expectedBusiness: lead.expectedBusiness || "",
//         requirement: lead.requirement || "",
//         remark: lead.remark || "",
//         relationshipManager: lead?.relationshipManager?._id || "",
//         dealBy: lead?.assignTo?.[0]?.userId || "",
//       });
//     }
//   }, [data, resetClient, resetLead, activeLeadIndex]);

//   useEffect(() => {
//     if (expectedBusiness) {
//       const amount = parseFloat(expectedBusiness);
//       if (!isNaN(amount)) {
//         const dealPercent =
//           parseFloat(import.meta.env.VITE_DEAL_INCENTIVE) || 0;
//         const leadPercent =
//           parseFloat(import.meta.env.VITE_LEAD_INCENTIVE) || 0;
//         const relationPercent =
//           parseFloat(import.meta.env.VITE_RELATION_INCENTIVE) || 0;

//         setLeadValue(
//           "dealIncentive",
//           ((amount * dealPercent) / 100).toFixed(2)
//         );

//         setDealValue(
//           "leadIncentive",
//           ((amount * leadPercent) / 100).toFixed(2)
//         );

//         setrelationValue(
//           "relationIncentive",
//           ((amount * relationPercent) / 100).toFixed(2)
//         );
//       }
//     }
//   }, [expectedBusiness, setLeadValue, setDealValue, setrelationValue]);

//   // Client Update Handler
//   const onClientUpdate = async (formDataValues) => {
//     try {
//       setClientSubmitting(true);

//       const clientData = {
//         name: formDataValues.clientName,
//         companyName: formDataValues.companyName,
//         phone: formDataValues.phone,
//         altPhone: formDataValues.altPhone,
//         email: formDataValues.email,
//         city: formDataValues.city,
//         pincode: formDataValues.pincode,
//         address: formDataValues.address,
//         businessType: formDataValues.businessType,
//         designation: formDataValues.designation,
//         clientRating: formDataValues.clientRating,
//         revenue: formDataValues.revenue,
//         satisfaction: formDataValues.satisfaction,
//         repeatPotential: formDataValues.repeatPotential,
//         complexity: formDataValues.complexity,
//         engagement: formDataValues.engagement,
//         positiveAttitude: formDataValues.positiveAttitude,
//       };

//       const result = await updateClient({ id, formData: clientData });
//       if (result?.data?.success) {
//         toast.success("Client details updated successfully!");
//         refetch();
//         setIsClientEditable(false);
//       } else {
//         toast.error(result?.error?.data?.message || "Client update failed");
//       }
//     } catch (err) {
//       toast.error("Error while updating client");
//     } finally {
//       setClientSubmitting(false);
//     }
//   };

//   // Lead Update Handler
//   const onLeadUpdate = async (formDataValues) => {
//     try {
//       setIsSubmitting(true);

//       const currentLead = data?.data?.leadData?.[activeLeadIndex];
//       if (!currentLead?._id) {
//         toast.error("No lead found to update");
//         return;
//       }

//       // Build pure JSON body
//       const leadData = {
//         clientId: id,
//         phone: formDataValues.phone,
//         altPhone: formDataValues.altPhone,
//         requirement: formDataValues.requirement,
//         remark: formDataValues.remark,
//         leadType: formDataValues.leadType,
//         clientRatingInBusiness: formDataValues.clientRatingInBusiness,
//         expectedBusiness: formDataValues.expectedBusiness,
//         leadSource: formDataValues.leadSource,
//         relationshipManager: formDataValues.relationshipManager,
//         assignTo: [formDataValues.dealBy] || data?.leadData?.assignTo,
//         leadBy: formDataValues.leadBy,
//         // If documents required, send URLs or separate upload API
//       };

//       const result = await updateLead({
//         id: currentLead._id,
//         formData: leadData,
//       });

//       if (result?.data?.success) {
//         toast.success("Lead details updated successfully!");
//         refetch();
//         setIsLeadEditable(false);
//       } else {
//         toast.error(result?.error?.data?.message || "Lead update failed");
//       }
//     } catch {
//       toast.error("Error while updating lead");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (isFetching) return <Loader />;

//   const clientFields = [
//     { name: "clientName", label: "Client Name *" },
//     { name: "companyName", label: "Company / Individual Name *" },
//     { name: "phone", label: "Client Contact Number *" },
//     { name: "altPhone", label: "Alternate Number" },
//     { name: "email", label: "Email" },
//     { name: "city", label: "City" },
//     { name: "pincode", label: "Pincode" },
//     // { name: "businessType", label: "Business Type" },
//   ];

//   const clientData = data?.data;
//   const leadData = clientData?.leadData || [];
//   console.log({leadData})
//   return (
//     <div className="space-y-6">
//       {/* Client Details Section */}
//       <div className="bg-white rounded-md shadow-md border border-gray-200 overflow-hidden">
//         <div className="flex justify-between items-center px-4 py-3 border-b">
//           <h2 className="text-lg font-semibold">Client Basic Details</h2>
//           <button
//             type="button"
//             onClick={() => setIsClientEditable((prev) => !prev)}
//             className="px-3 py-1.5 text-sm rounded-sm border border-gray-300 hover:bg-gray-100 transition flex items-center"
//           >
//             <Pencil className="inline mr-1" size={16} />
//             {isClientEditable ? "Cancel Edit" : "Edit Client"}
//           </button>
//         </div>

//         <form
//           onSubmit={handleClientSubmit(onClientUpdate)}
//           className="p-4 space-y-4"
//         >
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
//             {clientFields.map((f) => (
//               <div key={f.name} className="space-y-2">
//                 <label className="block text-gray-800 text-sm font-medium mb-1">
//                   {f.label}
//                 </label>
//                 <input
//                   type="text"
//                   {...registerClient(f.name)}
//                   placeholder={`Enter ${f.label}`}
//                   disabled={!isClientEditable}
//                   className={`w-full px-3 py-2 text-sm border rounded-sm transition-colors duration-200 ${
//                     isClientEditable
//                       ? "border-gray-300 focus:ring-2 focus:ring-black focus:border-black"
//                       : "bg-gray-50 border-gray-200 cursor-not-allowed"
//                   }`}
//                 />
//                 {clientErrors[f.name] && (
//                   <p className="text-red-500 text-sm mt-1 flex items-center">
//                     ⚠ {clientErrors[f.name].message}
//                   </p>
//                 )}
//               </div>
//             ))}

//             {/* Business Type */}
//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Business Type
//               </label>
//               <select
//                 {...registerClient("businessType")}
//                 disabled={!isClientEditable}
//                 className={`w-full px-3 py-2 text-sm border rounded-sm ${
//                   isClientEditable
//                     ? "border-gray-300 focus:ring-2 focus:ring-black focus:border-black"
//                     : "bg-gray-50 border-gray-200 cursor-not-allowed"
//                 }`}
//               >
//                 <option value="">Select Business Type</option>
//                 <option value="b2b">B2B</option>
//                 <option value="b2c">B2C</option>
//                 <option value="b2g">B2G</option>
//                 <option value="retail">Retail</option>
//                 <option value="wholesale">Wholesale</option>
//                 <option value="manufacturing">Manufacturing</option>
//                 <option value="service">Service</option>
//                 <option value="other">Other</option>
//               </select>
//               {clientErrors.businessType && (
//                 <p className="text-red-500 text-sm mt-1 flex items-center">
//                   <span className="mr-1">⚠</span>
//                   {clientErrors.businessType?.message}
//                 </p>
//               )}
//             </div>

//             <div className="space-y-2">
//               <label className="block text-gray-800 text-sm font-medium mb-1">
//                 Overall Client Rating *
//               </label>

//               <select
//                 {...registerClient("clientRating")}
//                 disabled={!isClientEditable}
//                 className={`w-full px-3 py-2 text-sm border rounded-sm ${
//                   isClientEditable
//                     ? "border-gray-300 focus:ring-2 focus:ring-black focus:border-black"
//                     : "bg-gray-50 border-gray-200 cursor-not-allowed"
//                 }`}
//               >
//                 <option value="">Select Rating</option>
//                 {[...Array(11)].map((_, i) => (
//                   <option key={i} value={i}>
//                     {i}
//                   </option>
//                 ))}
//               </select>

//               {clientErrors.clientRating && (
//                 <p className="text-red-500 text-sm mt-1 flex items-center">
//                   ⚠ {clientErrors.clientRating.message}
//                 </p>
//               )}
//             </div>

//             <div className="lg:col-span-3">
//               <label className="block text-sm font-medium mb-1 text-gray-800">
//                 Full Address <span className="text-red-500">*</span>
//               </label>
//               <textarea
//                 {...registerClient("address")}
//                 placeholder="Enter full address"
//                 rows={2}
//                 disabled={!isClientEditable}
//                 className={`w-full px-3 py-2 text-sm border rounded-sm transition-colors duration-200 resize-none ${
//                   isClientEditable
//                     ? "border-gray-300 focus:ring-2 focus:ring-black focus:border-black"
//                     : "bg-gray-100 border-gray-200 cursor-not-allowed"
//                 }`}
//               />
//               {clientErrors.address && (
//                 <p className="text-red-500 text-sm mt-1 flex items-center">
//                   ⚠ {clientErrors.address.message}
//                 </p>
//               )}
//             </div>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 -mt-3">
//             {[
//               { name: "revenue", label: "Revenue" },
//               { name: "satisfaction", label: "Satisfaction" },
//               { name: "repeatPotential", label: "Repeat Potential" },
//               { name: "complexity", label: "Complexity" },
//               { name: "engagement", label: "Engagement" },
//               { name: "positiveAttitude", label: "Positive Attitude" },
//             ].map((f) => (
//               <div key={f.name} className="space-y-2">
//                 <label className="block text-sm font-medium mb-1 text-gray-800">
//                   {f.label}
//                 </label>
//                 <select
//                   {...registerClient(f.name)}
//                   disabled={!isClientEditable}
//                   className={`w-full px-3 py-2 text-sm border rounded-sm transition-colors duration-200 ${
//                     isClientEditable
//                       ? "border-gray-300 focus:ring-2 focus:ring-black focus:border-black"
//                       : "bg-gray-50 border-gray-200 cursor-not-allowed"
//                   }`}
//                 >
//                   <option value="">Select {f.label}</option>
//                   <option value="HIGH">HIGH</option>
//                   <option value="LOW">LOW</option>
//                 </select>
//                 {clientErrors[f.name] && (
//                   <p className="text-red-500 text-sm mt-1">
//                     ⚠ {clientErrors[f.name].message}
//                   </p>
//                 )}
//               </div>
//             ))}
//           </div>

//           {isClientEditable && (
//             <button
//               type="submit"
//               disabled={clientSubmitting}
//               className={`w-fit px-6 py-2 rounded-sm text-white font-medium transition-colors ${
//                 clientSubmitting
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-black hover:bg-black/80 cursor-pointer"
//               }`}
//             >
//               {clientSubmitting
//                 ? "Updating Client..."
//                 : "Update Client Details"}
//             </button>
//           )}
//         </form>
//       </div>

//       {/* Lead Details Section */}
//       {leadData.length > 0 && (
//         <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
//           <div className="flex justify-between items-center px-4 py-3 border-b">
//             <div className="flex items-center gap-4">
//               <h2 className="text-lg font-semibold">Lead Details</h2>
//               {leadData.length > 1 && (
//                 <div className="flex gap-2">
//                   {leadData.map((lead, index) => (
//                     <button
//                       key={lead._id}
//                       type="button"
//                       onClick={() => setActiveLeadIndex(index)}
//                       className={`px-3 py-1 text-sm rounded-sm border transition ${
//                         activeLeadIndex === index
//                           ? "bg-black text-white border-black"
//                           : "border-gray-300 hover:bg-gray-100"
//                       }`}
//                     >
//                       Lead {index + 1}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//             <div className="flex items-center gap-2">
//               <div className="text-sm text-gray-600 mr-4">
//                 Lead ID:{" "}
//                 {leadData[activeLeadIndex]?.leadId ||
//                   leadData[activeLeadIndex]?._id}
//               </div>
//               <button
//                 type="button"
//                 onClick={() => setIsLeadEditable((prev) => !prev)}
//                 className="px-3 py-1.5 text-sm rounded-sm border border-gray-300 hover:bg-gray-100 transition flex items-center"
//               >
//                 <Pencil className="inline mr-1" size={16} />
//                 {isLeadEditable ? "Cancel Edit" : "Edit Lead"}
//               </button>
//             </div>
//           </div>

//           <form
//             onSubmit={handleLeadSubmit(onLeadUpdate)}
//             className="p-4 space-y-4"
//           >
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
//               {/* Lead Source */}
//               <div className="space-y-2">
//                 <label className="block text-gray-800 text-sm font-medium mb-1">
//                   Lead Source
//                 </label>
//                 <input
//                   type="text"
//                   {...registerLead("leadSource")}
//                   placeholder="Enter Lead Source"
//                   disabled
//                   className={`w-full px-3 py-2 text-sm border rounded-sm ${
//                     false
//                       ? "border-gray-300 focus:ring-2 focus:ring-black focus:border-black"
//                       : "bg-gray-50 border-gray-200 cursor-not-allowed"
//                   }`}
//                 />
//                 {leadErrors.leadSource && (
//                   <p className="text-red-500 text-sm mt-1 flex items-center">
//                     ⚠ {leadErrors.leadSource.message}
//                   </p>
//                 )}
//               </div>

//               {/* Client Type */}
//               <div className="space-y-2">
//                 <label className="block text-gray-800 text-sm font-medium mb-1">
//                   Client Type *
//                 </label>
//                 <input
//                   type="text"
//                   {...registerLead("leadType")}
//                   placeholder="Enter Client Type"
//                   disabled
//                   className={`w-full px-3 py-2 text-sm border rounded-sm ${
//                     false
//                       ? "border-gray-300 focus:ring-2 focus:ring-black focus:border-black"
//                       : "bg-gray-50 border-gray-200 cursor-not-allowed"
//                   }`}
//                 />
//                 {leadErrors.leadType && (
//                   <p className="text-red-500 text-sm mt-1 flex items-center">
//                     ⚠ {leadErrors.leadType.message}
//                   </p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-gray-800 text-sm font-medium mb-1">
//                   Client Rating in Business *
//                 </label>

//                 <select
//                   {...registerLead("clientRatingInBusiness")}
//                   disabled={!isLeadEditable}
//                   className={`w-full px-3 py-2 text-sm border rounded-sm ${
//                     isLeadEditable
//                       ? "border-gray-300 focus:ring-2 focus:ring-black focus:border-black"
//                       : "bg-gray-50 border-gray-200 cursor-not-allowed"
//                   }`}
//                 >
//                   <option value="">Select Rating</option>
//                   {Array.from({ length: 11 }, (_, i) => (
//                     <option key={i} value={i}>
//                       {i}
//                     </option>
//                   ))}
//                 </select>

//                 {leadErrors.clientRatingInBusiness && (
//                   <p className="text-red-500 text-sm mt-1 flex items-center">
//                     ⚠ {leadErrors.clientRatingInBusiness.message}
//                   </p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-gray-800 text-sm font-medium mb-1">
//                   Phone Number
//                 </label>
//                 <input
//                   type="number"
//                   {...registerLead("phone")}
//                   placeholder="Enter Mobile Number"
//                   disabled={!isLeadEditable}
//                   className={`w-full px-3 py-2 text-sm border rounded-sm ${
//                     isLeadEditable
//                       ? "border-gray-300 focus:ring-2 focus:ring-black focus:border-black"
//                       : "bg-gray-50 border-gray-200 cursor-not-allowed"
//                   }`}
//                 />
//                 {leadErrors.phone && (
//                   <p className="text-red-500 text-sm mt-1 flex items-center">
//                     ⚠ {leadErrors.phone.message}
//                   </p>
//                 )}
//               </div>
//               {/* Alternate Phone */}
//               <div className="space-y-2">
//                 <label className="block text-gray-800 text-sm font-medium mb-1">
//                   Alternate Number
//                 </label>
//                 <input
//                   type="number"
//                   {...registerLead("altPhone")}
//                   placeholder="Enter Alternate Number"
//                   disabled={!isLeadEditable}
//                   className={`w-full px-3 py-2 text-sm border rounded-sm ${
//                     isLeadEditable
//                       ? "border-gray-300 focus:ring-2 focus:ring-black focus:border-black"
//                       : "bg-gray-50 border-gray-200 cursor-not-allowed"
//                   }`}
//                 />
//                 {leadErrors.altPhone && (
//                   <p className="text-red-500 text-sm mt-1 flex items-center">
//                     ⚠ {leadErrors.altPhone.message}
//                   </p>
//                 )}
//               </div>
//               {/* Expected Business */}
//               <div className="space-y-2">
//                 <label className="block text-gray-800 text-sm font-medium mb-1">
//                   Expected Business Size (₹)
//                 </label>
//                 <input
//                   type="number"
//                   {...registerLead("expectedBusiness")}
//                   placeholder="Enter expected business size in rupees"
//                   disabled={!isLeadEditable}
//                   className={`w-full px-3 py-2 text-sm border rounded-sm transition-colors duration-200 ${
//                     isLeadEditable
//                       ? "border-gray-300 focus:ring-2 focus:ring-black focus:border-black"
//                       : "bg-gray-50 border-gray-200 cursor-not-allowed"
//                   }`}
//                 />
//                 {leadErrors.expectedBusiness && (
//                   <p className="text-red-500 text-sm mt-1 flex items-center">
//                     <span className="mr-1">⚠</span>
//                     {leadErrors.expectedBusiness?.message}
//                   </p>
//                 )}
//               </div>

//               {/* Deal Incentive */}
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-800 mb-1">
//                   Deal Incentive ({import.meta.env.VITE_DEAL_INCENTIVE || 2}%)
//                 </label>
//                 <input
//                   type="text"
//                   {...registerLead("dealIncentive")}
//                   readOnly
//                   className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 transition-colors duration-200 bg-gray-100 cursor-not-allowed"
//                 />
//               </div>

//               {/* Lead Incentive */}
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-800 mb-1">
//                   Lead Incentive ({import.meta.env.VITE_LEAD_INCENTIVE || 2}%)
//                 </label>
//                 <input
//                   type="text"
//                   {...registerLead("leadIncentive")}
//                   readOnly
//                   className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 transition-colors duration-200 bg-gray-100 cursor-not-allowed"
//                 />
//               </div>

//               {/* Relationship Incentive */}
//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-800 mb-1">
//                   Relationship Incentive (
//                   {import.meta.env.VITE_RELATION_INCENTIVE || 2}%)
//                 </label>
//                 <input
//                   type="text"
//                   {...registerLead("relationIncentive")}
//                   readOnly
//                   className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 transition-colors duration-200 bg-gray-100 cursor-not-allowed"
//                 />
//               </div>
//               {/* Remark */}
//               <div className="space-y-2">
//                 <label className="block text-gray-800 text-sm font-medium mb-1">
//                   Remark
//                 </label>
//                 <input
//                   type="text"
//                   {...registerLead("remark")}
//                   placeholder="Enter Remark"
//                   disabled={!isLeadEditable}
//                   className={`w-full px-3 py-2 text-sm border rounded-sm ${
//                     isLeadEditable
//                       ? "border-gray-300 focus:ring-2 focus:ring-black focus:border-black"
//                       : "bg-gray-50 border-gray-200 cursor-not-allowed"
//                   }`}
//                 />
//                 {leadErrors.remark && (
//                   <p className="text-red-500 text-sm mt-1 flex items-center">
//                     ⚠ {leadErrors.remark.message}
//                   </p>
//                 )}
//               </div>
//               <div className="lg:col-span-2">
//                 <label className="block text-sm font-medium mb-1 text-gray-800">
//                   Requirement
//                 </label>
//                 <textarea
//                   {...registerLead("requirement")}
//                   placeholder="Enter Full Requirement"
//                   rows={1}
//                   disabled={!isLeadEditable}
//                   className={`w-full px-3 py-2 text-sm border rounded-sm transition-colors duration-200 resize-none ${
//                     isLeadEditable
//                       ? "border-gray-300 focus:ring-2 focus:ring-black focus:border-black"
//                       : "bg-gray-100 border-gray-200 cursor-not-allowed"
//                   }`}
//                 />
//                 {leadErrors.requirement && (
//                   <p className="text-red-500 text-sm mt-1 flex items-center">
//                     ⚠ {leadErrors.requirement.message}
//                   </p>
//                 )}
//               </div>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
//               {[
//                 { name: "relationshipManager", label: "Relationship Manager" },
//                 { name: "dealBy", label: "Deal By" },
//                 { name: "leadBy", label: "Lead By" },
//               ].map((f) => (
//                 <div key={f.name} className="space-y-2">
//                   <label className="block text-sm font-medium mb-1 text-gray-800">
//                     {f.label}
//                   </label>
//                   <select
//                     {...registerLead(f.name)}
//                     disabled={!isLeadEditable}
//                     className={`w-full px-3 py-2 text-sm border rounded-sm transition-colors duration-200 ${
//                       isLeadEditable
//                         ? "border-gray-300 focus:ring-2 focus:ring-black focus:border-black"
//                         : "bg-gray-50 border-gray-200 cursor-not-allowed"
//                     }`}
//                   >
//                     <option value="">Select {f.label}</option>
//                     {userList.map((user) => (
//                       <option
//                         key={user._id}
//                         value={
//                           user._id ||
//                           leadData[activeLeadIndex]?.[f.leadBy]?.name
//                         }
//                       >
//                         {user.name ||
//                           leadData[activeLeadIndex]?.[f.leadBy]?.name}
//                       </option>
//                     ))}
//                   </select>
//                   {leadErrors[f.name] && (
//                     <p className="text-red-500 text-sm mt-1">
//                       ⚠ {leadErrors[f.name].message}
//                     </p>
//                   )}
//                 </div>
//               ))}
//             </div>

//             {isLeadEditable && (
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className={`w-fit px-6 py-2 rounded-sm text-white font-medium transition-colors ${
//                   isSubmitting
//                     ? "bg-gray-400 cursor-not-allowed"
//                     : "bg-black hover:bg-gray-900"
//                 }`}
//               >
//                 {isSubmitting ? "Updating Lead..." : "Update Lead Details"}
//               </button>
//             )}
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BesicDetail;





import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import {
  useGetClientByIdQuery,
  useUpdateClientMutation,
} from "@/api/sales/client.api";
import Loader from "@/components/Loader";
import { Edit2, User, Building, Phone, Mail, MapPin, Briefcase, Star, TrendingUp, Smile, Repeat, Target, Heart, BarChart3 } from "lucide-react";

// Client Schema
const clientSchema = yup.object().shape({
  clientName: yup.string().required("Client name is required"),
  companyName: yup.string().required("Company name is required"),
  phone: yup
    .string()
    .required("Client contact number is required")
    .matches(/^[0-9]{10}$/, "Enter a valid 10-digit number"),
  altPhone: yup.string().nullable(),
  email: yup.string().email("Enter a valid email"),
  city: yup.string(),
  pincode: yup.string(),
  address: yup.string().required("Full address is required"),
  businessType: yup.string(),
  designation: yup.string(),
  clientRating: yup.string(),
  revenue: yup.string().required("Revenue level is required"),
  satisfaction: yup.string().required("Satisfaction level is required"),
  repeatPotential: yup.string().required("Repeat potential is required"),
  complexity: yup.string().required("Complexity level is required"),
  engagement: yup.string().required("Engagement level is required"),
  positiveAttitude: yup.string().required("Positive attitude rating is required"),
});

const BasicDetail = () => {
  const { id } = useParams();
  
  const { data, isFetching, refetch } = useGetClientByIdQuery({ id });
  const [updateClient] = useUpdateClientMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState("basic");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(clientSchema),
  });

  useEffect(() => {
    if (data?.data) {
      const client = data.data;
      reset({
        clientName: client.name || "",
        companyName: client.companyName || "",
        phone: client.phone || "",
        altPhone: client.altPhone || "",
        email: client.email || "",
        city: client.city || "",
        pincode: client.pincode || "",
        address: client.address || "",
        businessType: client.businessType || "",
        designation: client.designation || "",
        clientRating: client.clientRating || "0",
        revenue: client.revenue || "LOW",
        satisfaction: client.satisfaction || "LOW",
        repeatPotential: client.repeatPotential || "LOW",
        complexity: client.complexity || "LOW",
        engagement: client.engagement || "LOW",
        positiveAttitude: client.positiveAttitude || "LOW",
      });
    }
  }, [data, reset]);

  const onSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      const clientData = {
        name: formData.clientName,
        companyName: formData.companyName,
        phone: formData.phone,
        altPhone: formData.altPhone,
        email: formData.email,
        city: formData.city,
        pincode: formData.pincode,
        address: formData.address,
        businessType: formData.businessType,
        designation: formData.designation,
        clientRating: formData.clientRating,
        revenue: formData.revenue,
        satisfaction: formData.satisfaction,
        repeatPotential: formData.repeatPotential,
        complexity: formData.complexity,
        engagement: formData.engagement,
        positiveAttitude: formData.positiveAttitude,
      };

      const result = await updateClient({ id, formData: clientData });
      if (result?.data?.success) {
        toast.success("Client details updated successfully!");
        refetch();
        setIsModalOpen(false);
      } else {
        toast.error(result?.error?.data?.message || "Update failed");
      }
    } catch (err) {
      toast.error("Error while updating client");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFetching) return <Loader />;

  const client = data?.data;
  
  const getRatingColor = (rating) => {
    const num = parseInt(rating);
    if (num >= 8) return "text-green-600";
    if (num >= 5) return "text-orange-500";
    return "text-red-500";
  };

  const getBadgeColor = (value) => {
    return value === "HIGH" 
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200";
  };

  return (
    <div className="space-y-4">
      {/* Client Profile Card */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center border-2 border-gray-300">
              <User size={32} className="text-gray-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{client?.name}</h2>
              <div className="flex justify-center">
              <p className="text-gray-600 flex items-center gap-1">
                <Building size={16} />
                {client?.companyName}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRatingColor(client?.clientRating)}`}>
                  <Star size={12} className="inline mr-1" />
                  Rating: {client?.clientRating || 0}/10
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getBadgeColor(client?.businessType)}`}>
                  {client?.businessType || "Not Specified"}
                </span>
              </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-orange-500 cursor-pointer hover:bg-orange-600 text-white rounded-lg flex items-center gap-2 transition"
          >
            <Edit2 size={16} />
            Edit Details
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Contact Information */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-700 flex items-center gap-1">
              <Phone size={16} />
              Contact Information
            </h3>
            <div className="space-y-2 pl-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Phone:</span>
                <span className="font-medium">{client?.phone}</span>
              </div>
              {client?.altPhone && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Alternate:</span>
                  <span className="font-medium">{client?.altPhone}</span>
                </div>
              )}
              {client?.email && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Email:</span>
                  <span className="font-medium flex items-center gap-1">
                    <Mail size={14} />
                    {client?.email}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <h3 className="font-medium text-gray-700 flex items-center gap-1">
              <MapPin size={16} />
              Address
            </h3>
            <div className="space-y-2 pl-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Address:</span>
                <span className="font-medium text-right">{client?.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">City:</span>
                <span className="font-medium">{client?.city || "Not specified"}</span>
              </div>
              {client?.pincode && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Pincode:</span>
                  <span className="font-medium">{client?.pincode}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Client Metrics */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
            <BarChart3 size={16} />
            Client Metrics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className={`p-3 rounded-lg border ${getBadgeColor(client?.revenue)}`}>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={14} />
                <span className="text-xs font-medium">Revenue</span>
              </div>
              <span className="font-semibold">{client?.revenue || "N/A"}</span>
            </div>
            
            <div className={`p-3 rounded-lg border ${getBadgeColor(client?.satisfaction)}`}>
              <div className="flex items-center gap-2 mb-1">
                <Smile size={14} />
                <span className="text-xs font-medium">Satisfaction</span>
              </div>
              <span className="font-semibold">{client?.satisfaction || "N/A"}</span>
            </div>
            
            <div className={`p-3 rounded-lg border ${getBadgeColor(client?.repeatPotential)}`}>
              <div className="flex items-center gap-2 mb-1">
                <Repeat size={14} />
                <span className="text-xs font-medium">Repeat Potential</span>
              </div>
              <span className="font-semibold">{client?.repeatPotential || "N/A"}</span>
            </div>
            
            <div className={`p-3 rounded-lg border ${getBadgeColor(client?.complexity)}`}>
              <div className="flex items-center gap-2 mb-1">
                <Target size={14} />
                <span className="text-xs font-medium">Complexity</span>
              </div>
              <span className="font-semibold">{client?.complexity || "N/A"}</span>
            </div>
            
            <div className={`p-3 rounded-lg border ${getBadgeColor(client?.engagement)}`}>
              <div className="flex items-center gap-2 mb-1">
                <Briefcase size={14} />
                <span className="text-xs font-medium">Engagement</span>
              </div>
              <span className="font-semibold">{client?.engagement || "N/A"}</span>
            </div>
            
            <div className={`p-3 rounded-lg border ${getBadgeColor(client?.positiveAttitude)}`}>
              <div className="flex items-center gap-2 mb-1">
                <Heart size={14} />
                <span className="text-xs font-medium">Attitude</span>
              </div>
              <span className="font-semibold">{client?.positiveAttitude || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-[1px] bg-opacity-50 flex items-center justify-center  z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Edit Client Details</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Section Tabs */}
            <div className="flex border-b">
              {["basic", "contact", "metrics"].map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`px-4 py-3 font-medium text-sm ${
                    activeSection === section
                      ? "border-b-2 border-orange-500 text-orange-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {section === "basic" && "Basic Info"}
                  {section === "contact" && "Contact & Address"}
                  {section === "metrics" && "Client Metrics"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto max-h-[60vh]">
              <div className="p-4">
                {/* Basic Info Section */}
                {activeSection === "basic" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Client Name *</label>
                      <input
                        type="text"
                        {...register("clientName")}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                      {errors.clientName && (
                        <p className="text-red-500 text-sm mt-1">{errors.clientName.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Company Name *</label>
                      <input
                        type="text"
                        {...register("companyName")}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                      {errors.companyName && (
                        <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Business Type</label>
                      <select
                        {...register("businessType")}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Designation</label>
                      <input
                        type="text"
                        {...register("designation")}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Client Rating</label>
                      <select
                        {...register("clientRating")}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option value="">Select Rating</option>
                        {[...Array(11)].map((_, i) => (
                          <option key={i} value={i}>{i}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Contact & Address Section */}
                {activeSection === "contact" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Phone *</label>
                      <input
                        type="text"
                        {...register("phone")}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Alternate Phone</label>
                      <input
                        type="text"
                        {...register("altPhone")}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input
                        type="email"
                        {...register("email")}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">City</label>
                      <input
                        type="text"
                        {...register("city")}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Pincode</label>
                      <input
                        type="text"
                        {...register("pincode")}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1">Address *</label>
                      <textarea
                        {...register("address")}
                        rows={2}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Client Metrics Section */}
                {activeSection === "metrics" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      { name: "revenue", label: "Revenue Level" },
                      { name: "satisfaction", label: "Satisfaction Level" },
                      { name: "repeatPotential", label: "Repeat Potential" },
                      { name: "complexity", label: "Complexity Level" },
                      { name: "engagement", label: "Engagement Level" },
                      { name: "positiveAttitude", label: "Positive Attitude" },
                    ].map((field) => (
                      <div key={field.name}>
                        <label className="block text-sm font-medium mb-1">{field.label} *</label>
                        <select
                          {...register(field.name)}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        >
                          <option value="">Select {field.label}</option>
                          <option value="HIGH">HIGH</option>
                          <option value="LOW">LOW</option>
                        </select>
                        {errors[field.name] && (
                          <p className="text-red-500 text-sm mt-1">{errors[field.name].message}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 p-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BasicDetail;