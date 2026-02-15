// import React from "react";
// import { Phone, Mail, Star } from "lucide-react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   ResponsiveContainer,
//   ReferenceLine,
// } from "recharts";
// import PaymentProjectCharts from "../../components/manager-profile/PaymentProjectCharts";
// import DesignProfile from "../../components/manager-profile/DesignProfile";

// export default function ManagerProfile() {
//   const statsCards = [
//     {
//       title: "Total Team Projects",
//       value: "128",
//       color: "border-blue-400 bg-blue-50",
//       textColor: "text-blue-600",
//     },
//     {
//       title: "Completed Designs",
//       value: "92",
//       color: "border-green-400 bg-green-50",
//       textColor: "text-green-600",
//     },
//     {
//       title: "Active Projects",
//       value: "24",
//       color: "border-yellow-400 bg-yellow-50",
//       textColor: "text-yellow-600",
//     },
//     {
//       title: "Pending Revisions",
//       value: "12",
//       color: "border-red-400 bg-red-50",
//       textColor: "text-red-600",
//     },
//   ];

//   const metricsCards = [
//     {
//       title: "Monthly Output",
//       value: "340 Designs",
//       color: "border-emerald-400 bg-emerald-50",
//       textColor: "text-emerald-600",
//     },
//     {
//       title: "Team Members",
//       value: "8",
//       color: "border-purple-400 bg-purple-50",
//       textColor: "text-purple-600",
//     },
//     {
//       title: "Avg. Delivery Time",
//       value: "3.5 Days",
//       color: "border-blue-400 bg-blue-50",
//       textColor: "text-blue-600",
//     },
//     {
//       title: "Client Feedback Score",
//       value: "4.8 / 10",
//       color: "border-yellow-400 bg-yellow-50",
//       textColor: "text-yellow-600",
//     },
//   ];

//   const teamMembers = [
//     {
//       name: "Ananya Verma",
//       role: "Graphics Designer",
//       active: 9,
//       completed: 16,
//       rating: 4.7,
//     },
//     {
//       name: "Deepak Patel",
//       role: "3D Artist",
//       active: 7,
//       completed: 13,
//       rating: 3.7,
//     },
//     {
//       name: "Riya Joshi",
//       role: "UI/UX Designer",
//       active: 6,
//       completed: 12,
//       rating: 4.8,
//     },
//   ];

//   const branchData = [
//     { name: "Barabanki", value: -10 },
//     { name: "Azamgarh", value: 20 },
//     { name: "Chinhat", value: 40 },
//   ];

//   const performers = [
//     {
//       branch: "Lucknow",
//       totalProjects: 43,
//       designers: 3,
//       target: 50,
//       achievement: 33,
//       topPerformer: "Rohan Patel",
//       color: "bg-green-500",
//     },
//     {
//       branch: "Chinhat",
//       totalProjects: 62,
//       designers: 2,
//       target: 40,
//       achievement: 55,
//       topPerformer: "Suresh Kumar",
//       color: "bg-yellow-500",
//     },
//     {
//       branch: "Azamgarh",
//       totalProjects: 58,
//       designers: 3,
//       target: 45,
//       achievement: 95,
//       topPerformer: "Pooja Singh",
//       color: "bg-green-500",
//     },
//   ];

//   const getAchievementColor = (value) => {
//     if (value >= 80) return "bg-green-500";
//     if (value >= 50) return "bg-yellow-400";
//     return "bg-red-500";
//   };

//   const clients = [
//     {
//       client: "ABC Builders",
//       executive: "Suresh Kumar",
//       project: "Brochure",
//       stage: "Review",
//       status: "Pending",
//       lastUpdate: "10 Nov 2025",
//     },
//     {
//       client: "Bright Interiors",
//       executive: "Komal Jain",
//       project: "UI Design",
//       stage: "Revision",
//       status: "Ongoing",
//       lastUpdate: "9 Nov 2025",
//     },
//     {
//       client: "DecorZone",
//       executive: "Rohan Patel",
//       project: "3D Layout",
//       stage: "Completed",
//       status: "Approved",
//       lastUpdate: "8 Nov 2025",
//     },
//   ];

//   const getStatusClass = (status) => {
//     switch (status) {
//       case "Pending":
//         return "bg-yellow-400 text-black";
//       case "Ongoing":
//         return "bg-teal-500 text-white";
//       case "Approved":
//         return "bg-green-600 text-white";
//       default:
//         return "bg-gray-400 text-white";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 -mt-2">
//       <div className="max-w-8xl mx-auto">
//         {/* Header Section */}
//         <div className="bg-white shadow-sm py-4 px-6 mb-8">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-6">
//               <img
//                 src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
//                 alt="Priya Nair"
//                 className="w-28 h-28 rounded-full object-cover border-4 border-gray-200"
//               />
//               <div>
//                 <h1 className="text-4xl font-bold text-gray-900 mb-2">
//                   Priya Nair
//                 </h1>
//                 <p className="text-lg text-gray-600 mb-3">
//                   Design Manager – Central Region
//                 </p>
//                 <div className="flex items-center gap-4 text-gray-700">
//                   <div className="flex items-center gap-2 font-semibold text-gray-900">
//                     <Phone className="w-4 h-4" />
//                     <span>0987654321</span>
//                   </div>
//                   <div className="flex items-center gap-2 font-semibold text-gray-900">
//                     <Mail className="w-4 h-4" />
//                     <span>Priyanair@dss.com</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="flex gap-3">
//               <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-sm transition-colors">
//                 Export Full Report
//               </button>
//               <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-sm transition-colors">
//                 Back to Manager's List
//               </button>
//             </div>
//           </div>
//         </div>
//         <div className="px-6">
//           {/* Stats Cards Row 1 */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 ">
//             {statsCards.map((card, index) => (
//               <div
//                 key={index}
//                 className={`${card.color} border-2 rounded-sm p-6 shadow-md`}
//               >
//                 <h3 className="text-lg text-center font-semibold text-gray-800 mb-2">
//                   {card.title}
//                 </h3>
//                 <p
//                   className={`text-2xl text-center font-bold ${card.textColor}`}
//                 >
//                   {card.value}
//                 </p>
//               </div>
//             ))}
//           </div>

//           {/* Metrics Cards Row 2 */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 ">
//             {metricsCards.map((card, index) => (
//               <div
//                 key={index}
//                 className={`${card.color} border-2 rounded-sm p-6 shadow-md`}
//               >
//                 <h3 className="text-lg text-center font-semibold text-gray-800 mb-2">
//                   {card.title}
//                 </h3>
//                 <p
//                   className={`text-2xl text-center font-bold ${card.textColor}`}
//                 >
//                   {card.value}
//                 </p>
//               </div>
//             ))}
//           </div>

//           {/* Bottom Section - Team Overview and Branch Performance */}
//           <div className="grid grid-cols-1 lg:grid-cols-[65%_33.2%] gap-6">
//             {/* Team Overview */}
//             <div className="bg-white rounded-sm shadow-sm p-6 border-2 border-gray-300">
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-2xl font-bold text-gray-900">
//                   Team Overview
//                 </h2>
//                 <button className="text-blue-600 font-semibold hover:text-blue-700">
//                   View All
//                 </button>
//               </div>
//               <div className="overflow-hidden rounded-lg border border-gray-200">
//                 <table className="w-full">
//                   <thead className="bg-gray-900 text-white">
//                     <tr>
//                       <th className="text-left px-4 py-3 font-semibold">
//                         Executive
//                       </th>
//                       <th className="text-left px-4 py-3 font-semibold">
//                         Role
//                       </th>
//                       <th className="text-left px-4 py-3 font-semibold">
//                         Active Projects
//                       </th>
//                       <th className="text-left px-4 py-3 font-semibold">
//                         Completed
//                       </th>
//                       <th className="text-left px-4 py-3 font-semibold">
//                         Avg. Rating
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200">
//                     {teamMembers.map((member, index) => (
//                       <tr key={index} className="hover:bg-gray-50">
//                         <td className="px-4 py-4 font-medium text-gray-900">
//                           {member.name}
//                         </td>
//                         <td className="px-4 py-4 text-gray-700">
//                           {member.role}
//                         </td>
//                         <td className="px-4 py-4 text-gray-700 text-center">
//                           {member.active}
//                         </td>
//                         <td className="px-4 py-4 text-gray-700 text-center">
//                           {member.completed}
//                         </td>
//                         <td className="px-4 py-4 text-gray-700">
//                           <div className="flex items-center gap-1">
//                             {member.rating}
//                             <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* Branch Performance */}
//             <div className="bg-white rounded-sm shadow-sm border border-gray-300 p-6">
//               <h2 className="text-[22px] font-bold text-black mb-4">
//                 Branch Performance
//               </h2>

//               <ResponsiveContainer width="100%" height={260}>
//                 <BarChart data={branchData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

//                   {/* Y Axis with 0 visible */}
//                   <YAxis
//                     domain={[-60, 60]}
//                     ticks={[-60, -20, 0, 20, 60]}
//                     tick={{ fill: "#000", fontSize: 15, fontWeight: 500 }}
//                     axisLine={false}
//                     tickLine={false}
//                   />

//                   <XAxis
//                     dataKey="name"
//                     tick={{ fill: "#000", fontSize: 14, fontWeight: 500 }}
//                     axisLine={false}
//                     tickLine={false}
//                   />

//                   {/* 🔥 0 Line Highlight */}
//                   <ReferenceLine y={0} stroke="#9ca3af" strokeWidth={2} />

//                   <Bar
//                     dataKey="value"
//                     fill="#7C87FF"
//                     barSize={50}
//                     radius={[4, 4, 4, 4]}
//                   />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           <div className="bg-white rounded-sm shadow-sm border-2 border-gray-300 p-8 mt-5">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-3xl font-bold text-gray-900">
//                 Top Performers
//               </h2>
//               <button className="text-blue-600 font-semibold text-lg hover:text-blue-700">
//                 View All
//               </button>
//             </div>

//             <div className="overflow-hidden rounded-lg border border-gray-200">
//               <table className="w-full">
//                 <thead className="bg-gray-900 text-white">
//                   <tr>
//                     <th className="text-left px-6 py-4 font-semibold text-base">
//                       Branch
//                     </th>
//                     <th className="text-left px-6 py-4 font-semibold text-base">
//                       Total Projects
//                     </th>
//                     <th className="text-left px-6 py-4 font-semibold text-base">
//                       Designers
//                     </th>
//                     <th className="text-left px-6 py-4 font-semibold text-base">
//                       Target
//                     </th>
//                     <th className="text-left px-6 py-4 font-semibold text-base">
//                       Achievement
//                     </th>
//                     <th className="text-left px-6 py-4 font-semibold text-base">
//                       Top Performer
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-gray-200">
//                   {performers.map((performer, index) => (
//                     <tr
//                       key={index}
//                       className="hover:bg-gray-50 transition-colors"
//                     >
//                       <td className="px-6 py-5 font-semibold text-gray-900 text-lg">
//                         {performer.branch}
//                       </td>

//                       <td className="px-6 py-5 text-gray-700 text-lg">
//                         {performer.totalProjects}
//                       </td>

//                       <td className="px-6 py-5 text-gray-700 text-lg">
//                         {performer.designers}
//                       </td>

//                       <td className="px-6 py-5 text-gray-700 text-lg">
//                         {performer.target}
//                       </td>

//                       <td className="px-6 py-5">
//                         <div className="flex items-center gap-3">
//                           <span className="font-semibold text-gray-900 text-lg w-12">
//                             {performer.achievement}%
//                           </span>

//                           <div className="flex-1 bg-gray-200 rounded-full h-3 max-w-xs">
//                             <div
//                               className={`${getAchievementColor(
//                                 performer.achievement
//                               )} h-3 rounded-full transition-all duration-500`}
//                               style={{ width: `${performer.achievement}%` }}
//                             ></div>
//                           </div>
//                         </div>
//                       </td>

//                       <td className="px-6 py-5 text-gray-900 font-medium text-lg">
//                         {performer.topPerformer}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           <PaymentProjectCharts />

//           <div className="bg-white rounded-sm shadow-sm border-2 border-gray-300 p-6 mt-6">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-2xl font-bold text-gray-900">
//                 Client & Lead Management Summary
//               </h2>
//               <button className="text-blue-600 font-semibold text-lg hover:text-blue-700">
//                 View All
//               </button>
//             </div>

//             <div className="overflow-hidden rounded-lg border border-gray-300">
//               <table className="w-full border-collapse">
//                 <thead className="bg-gray-900 text-white">
//                   <tr>
//                     <th className="text-left px-6 py-4 font-semibold text-base">
//                       Client
//                     </th>
//                     <th className="text-left px-6 py-4 font-semibold text-base">
//                       Executive
//                     </th>
//                     <th className="text-left px-6 py-4 font-semibold text-base">
//                       Project
//                     </th>
//                     <th className="text-left px-6 py-4 font-semibold text-base">
//                       Stage
//                     </th>
//                     <th className="text-left px-6 py-4 font-semibold text-base">
//                       Status
//                     </th>
//                     <th className="text-left px-6 py-4 font-semibold text-base">
//                       Last Update
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-gray-200">
//                   {clients.map((item, index) => (
//                     <tr key={index} className="hover:bg-gray-50 transition">
//                       {/* Client */}
//                       <td className="px-6 py-4 text-gray-900 font-medium text-lg">
//                         {item.client}
//                       </td>

//                       {/* Executive */}
//                       <td className="px-6 py-4 text-gray-700 text-lg">
//                         {item.executive}
//                       </td>

//                       {/* Project */}
//                       <td className="px-6 py-4 text-gray-700 text-lg">
//                         {item.project}
//                       </td>

//                       {/* Stage */}
//                       <td className="px-6 py-4 text-gray-700 text-lg">
//                         {item.stage}
//                       </td>

//                       {/* Status Badge */}
//                       <td className="px-6 py-4">
//                         <span
//                           className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getStatusClass(
//                             item.status
//                           )}`}
//                         >
//                           {item.status}
//                         </span>
//                       </td>

//                       {/* Last Update */}
//                       <td className="px-6 py-4 text-gray-700 text-lg">
//                         {item.lastUpdate}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           <DesignProfile/>
//         </div>
//       </div>
//     </div>
//   );
// }
