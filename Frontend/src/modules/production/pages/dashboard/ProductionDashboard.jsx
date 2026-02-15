import React from 'react'

const ProductionDashboard = () => {
  return (
    <div>ProductionDashboard</div>
  )
}

export default ProductionDashboard

// import React, { useState } from 'react';
// import { TrendingDown, DollarSign, Users, AlertCircle } from 'lucide-react';

// const ProductionDashboard = () => {
//   const [funnelData, setFunnelData] = useState({
//     hwc: 850,
//     wh: 720,
//     newLeads: 650,
//     presale: 420,
//     deal: 280,
//     installed: 180,
//     paymentValue: 150,
//     lostLeads: 180,
//     lostDeal: 95,
//     pendency: 65
//   });

//   const handleInputChange = (field, value) => {
//     setFunnelData(prev => ({
//       ...prev,
//       [field]: parseInt(value) || 0
//     }));
//   };

//   const totalLeads = funnelData.hwc + funnelData.wh + funnelData.newLeads;
//   const conversionRate = ((funnelData.paymentValue / totalLeads) * 100).toFixed(1);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-white mb-2">
//             Sales Flow || Business Management Pipeline
//           </h1>
//           <p className="text-gray-400">Phase I → Phase II</p>
//         </div>

//         {/* Metrics */}
//         <div className="grid grid-cols-4 gap-4 mb-8">
//           <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-xl p-5 border border-blue-500/30">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-blue-300 text-sm">Total Leads</p>
//                 <p className="text-3xl font-bold text-white">{totalLeads}</p>
//               </div>
//               <Users className="text-blue-400" size={36} />
//             </div>
//           </div>

//           <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-xl p-5 border border-green-500/30">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-green-300 text-sm">Deals Closed</p>
//                 <p className="text-3xl font-bold text-white">{funnelData.deal}</p>
//               </div>
//               <DollarSign className="text-green-400" size={36} />
//             </div>
//           </div>

//           <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-5 border border-purple-500/30">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-purple-300 text-sm">Conversion</p>
//                 <p className="text-3xl font-bold text-white">{conversionRate}%</p>
//               </div>
//               <TrendingDown className="text-purple-400" size={36} />
//             </div>
//           </div>

//           <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 backdrop-blur-sm rounded-xl p-5 border border-red-500/30">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-red-300 text-sm">Lost Total</p>
//                 <p className="text-3xl font-bold text-white">{funnelData.lostLeads + funnelData.lostDeal}</p>
//               </div>
//               <AlertCircle className="text-red-400" size={36} />
//             </div>
//           </div>
//         </div>

//         {/* Main Funnel Visualization */}
//         <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 mb-8">
//           <h2 className="text-2xl font-bold text-white mb-8 text-center">Pipeline Funnel Visualization</h2>
          
//           <div className="relative">
//             <svg width="100%" height="600" viewBox="0 0 1200 600">
//               {/* Large Input Cylinder */}
//               <g>
//                 {/* Left ellipse */}
//                 <ellipse cx="180" cy="300" rx="80" ry="180" fill="#374151" stroke="#6B7280" strokeWidth="3" />
                
//                 {/* Cylinder body */}
//                 <rect x="180" y="120" width="280" height="360" fill="#374151" />
                
//                 {/* Right ellipse */}
//                 <ellipse cx="460" cy="300" rx="80" ry="180" fill="#4B5563" stroke="#6B7280" strokeWidth="3" />
                
//                 {/* Labels inside cylinder */}
//                 <text x="300" y="250" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">
//                   [H,W,C]
//                 </text>
//                 <text x="300" y="280" textAnchor="middle" fill="#9CA3AF" fontSize="16">
//                   {funnelData.hwc}
//                 </text>
                
//                 <text x="300" y="330" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">
//                   [W,H]
//                 </text>
//                 <text x="300" y="360" textAnchor="middle" fill="#9CA3AF" fontSize="16">
//                   {funnelData.wh}
//                 </text>
                
//                 <text x="300" y="200" textAnchor="middle" fill="#60A5FA" fontSize="14">
//                   New Leads: {funnelData.newLeads}
//                 </text>
//               </g>

//               {/* Arrows to Presale */}
//               <g>
//                 <line x1="540" y1="300" x2="600" y2="300" stroke="#6B7280" strokeWidth="3" />
//                 <polygon points="600,300 585,293 585,307" fill="#6B7280" />
//               </g>

//               {/* Phase I Label */}
//               <text x="550" y="150" textAnchor="middle" fill="#60A5FA" fontSize="18" fontWeight="bold">
//                 Phase I
//               </text>
//               <line x1="520" y1="160" x2="580" y2="160" stroke="#60A5FA" strokeWidth="2" />

//               {/* Presale Box */}
//               <g>
//                 <rect x="620" y="220" width="140" height="160" rx="10" fill="#7C3AED" stroke="#9333EA" strokeWidth="3" />
//                 <text x="690" y="280" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">
//                   PRESALE
//                 </text>
//                 <text x="690" y="310" textAnchor="middle" fill="#E9D5FF" fontSize="18">
//                   {funnelData.presale}
//                 </text>
//                 <text x="690" y="250" textAnchor="middle" fill="#C084FC" fontSize="12">
//                   [H,W,C] [W,H]
//                 </text>
//                 <text x="690" y="350" textAnchor="middle" fill="#C084FC" fontSize="11">
//                   Sales Per Day
//                 </text>
//                 <text x="690" y="365" textAnchor="middle" fill="#C084FC" fontSize="11">
//                   Redial Outflow
//                 </text>
//               </g>

//               {/* Arrow down from Presale to Lost */}
//               <g>
//                 <line x1="690" y1="380" x2="690" y2="440" stroke="#EF4444" strokeWidth="2" strokeDasharray="5,5" />
//                 <polygon points="690,440 683,425 697,425" fill="#EF4444" />
//               </g>

//               {/* Phase II Label */}
//               <text x="850" y="150" textAnchor="middle" fill="#EC4899" fontSize="18" fontWeight="bold">
//                 Phase II
//               </text>
//               <line x1="820" y1="160" x2="880" y2="160" stroke="#EC4899" strokeWidth="2" />
//               <text x="850" y="180" textAnchor="middle" fill="#F472B6" fontSize="14">
//                 P.R.I
//               </text>

//               {/* Arrow to Deal */}
//               <g>
//                 <line x1="760" y1="300" x2="820" y2="300" stroke="#6B7280" strokeWidth="3" />
//                 <polygon points="820,300 805,293 805,307" fill="#6B7280" />
//               </g>

//               {/* Deal Cylinder */}
//               <g>
//                 <ellipse cx="850" cy="300" rx="40" ry="100" fill="#059669" stroke="#10B981" strokeWidth="3" />
//                 <rect x="850" y="200" width="80" height="200" fill="#059669" />
//                 <ellipse cx="930" cy="300" rx="40" ry="100" fill="#10B981" stroke="#10B981" strokeWidth="3" />
                
//                 <text x="890" y="285" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">
//                   DEAL
//                 </text>
//                 <text x="890" y="310" textAnchor="middle" fill="#D1FAE5" fontSize="16">
//                   {funnelData.deal}
//                 </text>
//               </g>

//               {/* Arrow to Installed/Payment */}
//               <g>
//                 <line x1="970" y1="300" x2="1010" y2="300" stroke="#6B7280" strokeWidth="3" />
//                 <polygon points="1010,300 995,293 995,307" fill="#6B7280" />
//               </g>

//               {/* Installed/Payment Circle */}
//               <g>
//                 <circle cx="1050" cy="260" r="35" fill="#3B82F6" stroke="#60A5FA" strokeWidth="3" />
//                 <text x="1050" y="260" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
//                   Installed
//                 </text>
//                 <text x="1050" y="275" textAnchor="middle" fill="#DBEAFE" fontSize="11">
//                   {funnelData.installed}
//                 </text>
                
//                 <circle cx="1050" cy="340" r="35" fill="#8B5CF6" stroke="#A78BFA" strokeWidth="3" />
//                 <text x="1050" y="335" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">
//                   Payment
//                 </text>
//                 <text x="1050" y="348" textAnchor="middle" fill="#EDE9FE" fontSize="11">
//                   Value
//                 </text>
//                 <text x="1050" y="360" textAnchor="middle" fill="#EDE9FE" fontSize="10">
//                   {funnelData.paymentValue}
//                 </text>
//               </g>

//               {/* Arrow down to Pendency */}
//               <g>
//                 <line x1="1050" y1="380" x2="1050" y2="440" stroke="#F59E0B" strokeWidth="2" strokeDasharray="5,5" />
//                 <polygon points="1050,440 1043,425 1057,425" fill="#F59E0B" />
//               </g>

//               {/* Pendency Box */}
//               <g>
//                 <rect x="990" y="460" width="120" height="70" rx="8" fill="#F59E0B" stroke="#FBBF24" strokeWidth="2" />
//                 <text x="1050" y="485" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
//                   PENDENCY
//                 </text>
//                 <text x="1050" y="510" textAnchor="middle" fill="#FEF3C7" fontSize="16">
//                   {funnelData.pendency}
//                 </text>
//               </g>

//               {/* Lost Leads Bucket */}
//               <g>
//                 <rect x="620" y="460" width="120" height="80" rx="8" fill="#DC2626" stroke="#EF4444" strokeWidth="2" />
//                 <text x="680" y="485" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
//                   LOST LEADS
//                 </text>
//                 <text x="680" y="505" textAnchor="middle" fill="white" fontSize="11">
//                   BUCKET
//                 </text>
//                 <text x="680" y="525" textAnchor="middle" fill="#FEE2E2" fontSize="18">
//                   {funnelData.lostLeads}
//                 </text>
//               </g>

//               {/* Lost Deal Bucket */}
//               <g>
//                 <rect x="820" y="460" width="120" height="80" rx="8" fill="#B91C1C" stroke="#DC2626" strokeWidth="2" />
//                 <text x="880" y="485" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
//                   LOST DEAL
//                 </text>
//                 <text x="880" y="505" textAnchor="middle" fill="white" fontSize="11">
//                   BUCKET
//                 </text>
//                 <text x="880" y="525" textAnchor="middle" fill="#FEE2E2" fontSize="18">
//                   {funnelData.lostDeal}
//                 </text>
//               </g>

//               {/* Arrow from Deal to Lost Deal */}
//               <g>
//                 <line x1="890" y1="400" x2="880" y2="450" stroke="#EF4444" strokeWidth="2" strokeDasharray="5,5" />
//                 <polygon points="880,450 873,435 887,435" fill="#EF4444" />
//               </g>

//               {/* "NOT INTERESTED LEADS BUCKET" label at bottom */}
//               <text x="300" y="560" textAnchor="middle" fill="#9CA3AF" fontSize="14">
//                 NOT INTERESTED LEADS BUCKET
//               </text>
//             </svg>
//           </div>
//         </div>

//         {/* Input Controls */}
//         <div className="grid grid-cols-2 gap-8">
//           <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
//             <h3 className="text-xl font-bold text-white mb-4">Lead Sources</h3>
//             <div className="space-y-4">
//               <div>
//                 <label className="text-gray-300 text-sm block mb-2">[H,W,C] Leads</label>
//                 <input
//                   type="number"
//                   value={funnelData.hwc}
//                   onChange={(e) => handleInputChange('hwc', e.target.value)}
//                   className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="text-gray-300 text-sm block mb-2">[W,H] Leads</label>
//                 <input
//                   type="number"
//                   value={funnelData.wh}
//                   onChange={(e) => handleInputChange('wh', e.target.value)}
//                   className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="text-gray-300 text-sm block mb-2">New Leads</label>
//                 <input
//                   type="number"
//                   value={funnelData.newLeads}
//                   onChange={(e) => handleInputChange('newLeads', e.target.value)}
//                   className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="text-gray-300 text-sm block mb-2">Presale</label>
//                 <input
//                   type="number"
//                   value={funnelData.presale}
//                   onChange={(e) => handleInputChange('presale', e.target.value)}
//                   className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 />
//               </div>
//               <div>
//                 <label className="text-gray-300 text-sm block mb-2">Deal</label>
//                 <input
//                   type="number"
//                   value={funnelData.deal}
//                   onChange={(e) => handleInputChange('deal', e.target.value)}
//                   className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
//             <h3 className="text-xl font-bold text-white mb-4">Final Stages</h3>
//             <div className="space-y-4">
//               <div>
//                 <label className="text-gray-300 text-sm block mb-2">Installed</label>
//                 <input
//                   type="number"
//                   value={funnelData.installed}
//                   onChange={(e) => handleInputChange('installed', e.target.value)}
//                   className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="text-gray-300 text-sm block mb-2">Payment Value</label>
//                 <input
//                   type="number"
//                   value={funnelData.paymentValue}
//                   onChange={(e) => handleInputChange('paymentValue', e.target.value)}
//                   className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
//                 />
//               </div>
//               <div>
//                 <label className="text-gray-300 text-sm block mb-2">Pendency</label>
//                 <input
//                   type="number"
//                   value={funnelData.pendency}
//                   onChange={(e) => handleInputChange('pendency', e.target.value)}
//                   className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
//                 />
//               </div>
//               <div>
//                 <label className="text-gray-300 text-sm block mb-2">Lost Leads</label>
//                 <input
//                   type="number"
//                   value={funnelData.lostLeads}
//                   onChange={(e) => handleInputChange('lostLeads', e.target.value)}
//                   className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
//                 />
//               </div>
//               <div>
//                 <label className="text-gray-300 text-sm block mb-2">Lost Deal</label>
//                 <input
//                   type="number"
//                   value={funnelData.lostDeal}
//                   onChange={(e) => handleInputChange('lostDeal', e.target.value)}
//                   className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductionDashboard;