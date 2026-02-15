// import React, { useState,useEffect } from "react";
// import { toast } from "react-toastify";
// import { Plus, Search, Filter, Eye, Download, Loader2, Edit } from "lucide-react";
// import {
//     useGetQuotationsQuery,
//     useSendQuotationMutation,
//     useApproveQuotationMutation,
// } from "@/api/finance/Quatation_Billing/quatation.api";
// import UpdateQuotationModal from './UpdateQuotationModal'
// import { useNavigate } from "react-router-dom";


// const QuotationListComponent = ({ onAddNew, onViewInvoice }) => {
//     const { data: quotations, isLoading, isError, refetch } = useGetQuotationsQuery();
//     const [sendQuotation, { isLoading: isSending }] = useSendQuotationMutation();
//     const [approveQuotation, { isLoading: isApproving }] = useApproveQuotationMutation();
//     const [searchTerm, setSearchTerm] = useState("");
//     const [statusFilter, setStatusFilter] = useState("All");
//     const navigate = useNavigate()
//     // State for latest invoices and update modal
//     const [latestInvoices, setLatestInvoices] = useState({});
//     console.log(latestInvoices);

//     const   [updateModalOpen, setUpdateModalOpen] = useState(false);
//     const [selectedQuotation, setSelectedQuotation] = useState(null);

//     const handleSend = async (id) => {
//         try {
//             const res = await sendQuotation(id).unwrap();  
//             if (res.success && res.quotation) {
//                 toast.success("Quotation sent successfully!");
//                 refetch();
//                 if (res.quotation?.pdfUrl) {
//                     onViewInvoice({
//                         grandTotal: res.quotation.grandTotal,
//                         pdfUrl: res.quotation.pdfUrl,
//                     });
//                 }
//             }
//         } catch (err) {
//             toast.error("Failed to send quotation!");
//             console.error("Send error:", err);
//         }
//     };

//     useEffect(() => {
//     if (!quotations) return;

//     quotations.forEach((q) => {
//         if (q.dueDate) {
//             const dueDate = new Date(q.dueDate);
//             const today = new Date();

//             // Difference in days
//             const diffInDays = Math.ceil(
//                 (dueDate - today) / (1000 * 60 * 60 * 24)
//             );

//             if (diffInDays === 2) {
//                 toast.warning(
//                     `⏰ Reminder: Quotation ${q.number} for ${q.client?.name || "Client"} is due in 2 days!`
//                 );
//             }

//             if (diffInDays < 0) {
//                 toast.error(
//                     `⚠️ Overdue: Quotation ${q.number} for ${q.client?.name || "Client"} is past due!`
//                 );
//             }
//         }
//     });
// }, [quotations]);

//     const handleApprove = async (id) => {
//         try {
//             const res = await approveQuotation(id).unwrap();
//             await refetch();
//             if (res.success && res.invoice) {
//                 toast.success("Quotation approved successfully!");
//                 if (res.invoice.pdfUrl) {
//                     setLatestInvoices(prev => ({
//                         ...prev,
//                         [id]: res.invoice
//                     }));
//                     onViewInvoice({
//                         invoiceId: res.invoice.invoiceId,
//                         grandTotal: res.invoice.grandTotal,
//                         paymentStatus: res.invoice.paymentStatus,
//                         pdfUrl: res.invoice.pdfUrl,
//                     });
//                 }
//             }
//         } catch (err) {
//             toast.error("Failed to approve quotation!");
//             console.error("Approve error:", err);
//         }
//     };

//     const handleViewPDF = (url) => {
//         if (!url) {
//             toast.error("PDF not available!");
//             return;
//         }
//         window.open(url, "_blank");
//     };

//     const handleDownloadPDF = (url, filename) => {
//         const link = document.createElement("a");
//         link.href = url;
//         link.download = filename;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//     };
//     const handleViewInvoice = (quotationId) => {

//         if (!quotationId) {
//             toast.error("Invoice not available!");
//             return;
//         }
//         navigate(`/finance/invoices/${quotationId}`);
//     };
//     const filteredQuotations = quotations?.filter((q) => {
//         const matchesSearch =
//             searchTerm === "" ||
//             q.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             (q.client?.name && q.client.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
//             (q.project?.name && q.project.name.toLowerCase().includes(searchTerm.toLowerCase()));
//         const matchesStatus = statusFilter === "All" || q.status === statusFilter;
//         return matchesSearch && matchesStatus;
//     });

//     if (isLoading)
//         return (
//             <div className="flex justify-center items-center h-64">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//                     <p className="mt-3 text-gray-600">Loading quotations...</p>
//                 </div>
//             </div>
//         );

//     if (isError)
//         return (
//             <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
//                 <div className="flex">
//                     <div className="flex-shrink-0">
//                         <svg
//                             className="h-5 w-5 text-red-400"
//                             xmlns="http://www.w3.org/2000/svg"
//                             viewBox="0 0 20 20"
//                             fill="currentColor"
//                         >
//                             <path
//                                 fillRule="evenodd"
//                                 d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                                 clipRule="evenodd"
//                             />
//                         </svg>
//                     </div>
//                     <div className="ml-3">
//                         <p className="text-sm text-red-700">
//                             Error loading quotations!
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         );

//     return (
//         <div className="space-y-6">
//             {/* Search and Filter */}
//             <div className="bg-white shadow-sm rounded-lg overflow-hidden">
//                 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 border-b border-gray-200">
//                     <div className="relative flex-1 max-w-md">
//                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                             <Search className="h-5 w-5 text-gray-400" />
//                         </div>
//                         <input
//                             type="text"
//                             placeholder="Search quotations..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                         />
//                     </div>
//                     <div className="flex items-center">
//                         <Filter className="h-5 w-5 text-gray-400 mr-2" />
//                         <select
//                             value={statusFilter}
//                             onChange={(e) => setStatusFilter(e.target.value)}
//                             className="block w-full pl-3 pr-10 py-2 border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                         >
//                             <option value="All">All Statuses</option>
//                             <option value="Draft">Draft</option>
//                             <option value="Sent">Sent</option>
//                             <option value="Approved">Approved</option>
//                         </select>
//                     </div>
//                 </div>
//             </div>

//             {/* Quotations Table */}
//             <div className="bg-white shadow-sm rounded-lg overflow-hidden">
//                 {filteredQuotations?.length === 0 ? (
//                     <div className="text-center py-12">
//                         <svg
//                             className="mx-auto h-12 w-12 text-gray-400"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             stroke="currentColor"
//                         >
//                             <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                             />
//                         </svg>
//                         <h3 className="mt-2 text-sm font-medium text-gray-900">
//                             No quotations found
//                         </h3>
//                         <p className="mt-1 text-sm text-gray-500">
//                             Get started by creating a new quotation.
//                         </p>
//                         <div className="mt-6">
//                             <button
//                                 onClick={onAddNew}
//                                 className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                             >
//                                 <Plus className="h-4 w-4 mr-2" />
//                                 New Quotation
//                             </button>
//                         </div>
//                     </div>
//                 ) : (
//                     <div className="overflow-x-auto">
//                         <table className="min-w-full divide-y divide-gray-200">
//                             <thead className="bg-gray-50">
//                                 <tr>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                                         Number
//                                     </th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                                         Client
//                                     </th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                                         Project
//                                     </th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                                         Status
//                                     </th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                                         Total
//                                     </th>
//                                     {/* 🔽 New Columns */}
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                                         Paid Amount
//                                     </th>
//                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                                          Due / Remaining
//                                     </th>
//                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                                         Payment Status
//                                     </th>
//                                     <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
//                                         Actions
//                                     </th>
//                                 </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                                 {filteredQuotations.map((q) => (

//                                     <tr key={q._id} className="hover:bg-gray-50 transition-colors">
//                                         <td className="px-6 py-4 whitespace-nowrap">{q.number}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap">{q.client?.name}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap">{q.project?.name}</td>
//                                         <td className="px-6 py-4 whitespace-nowrap">
//                                             <span
//                                                 className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${q.status === "Draft"
//                                                         ? "bg-yellow-100 text-yellow-800"
//                                                         : q.status === "Sent"
//                                                             ? "bg-blue-100 text-blue-800"
//                                                             : "bg-green-100 text-green-800"
//                                                     }`}
//                                             >
//                                                 {q.status}

//                                             </span>
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                             ₹{q.grandTotal || q.total}
//                                         </td>

//                                         {/* 🔹 Paid Amount */}
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                             ₹{q.amountPaid || 0}
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-red-700">
//                                             ₹{(q.grandTotal || q.total) - (q.amountPaid || 0)}
//                                         </td>
//                                         {/* 🔹 Payment Status */}
//                                         <td className="px-6 py-4 whitespace-nowrap">
//                                             <span
//                                                 className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${q.paymentStatus === "Pending"
//                                                         ? "bg-red-100 text-red-800"
//                                                         : q.paymentStatus === "Partial"
//                                                             ? "bg-yellow-100 text-yellow-800"
//                                                             : "bg-green-100 text-green-800"
//                                                     }`}
//                                             >
//                                                 {q.paymentStatus || "Pending"}
//                                             </span>
//                                         </td>

//                                         {/* Actions */}
//                                         <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                                             <div className="flex justify-end space-x-2">
//                                                 {/* Draft actions */}
//                                                 {q.status === "Draft" && (
//                                                     <>
//                                                         <button
//                                                             onClick={() => handleSend(q._id)}
//                                                             disabled={isSending}
//                                                             className="inline-flex items-center px-3 py-1 text-xs rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
//                                                         >
//                                                             {isSending && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
//                                                             Send
//                                                         </button>
//                                                         <button
//                                                             onClick={() => {
//                                                                 setSelectedQuotation(q);
//                                                                 setUpdateModalOpen(true);
//                                                             }}
//                                                             className="inline-flex items-center px-3 py-1 text-xs rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700"
//                                                         >
//                                                             <Edit className="h-4 w-4 mr-1" />
//                                                             Update
//                                                         </button>
//                                                     </>
//                                                 )}

//                                                 {/* Sent actions */}
//                                                 {q.status === "Sent" && (
//                                                     <>
//                                                         <button
//                                                             onClick={() => handleApprove(q._id)}
//                                                             disabled={isApproving}
//                                                             className="inline-flex items-center px-3 py-1 text-xs rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
//                                                         >
//                                                             {isApproving && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
//                                                             Approve
//                                                         </button>
//                                                         {q.pdfUrl && (
//                                                             <>
//                                                                 <button
//                                                                     onClick={() => handleViewPDF(q.pdfUrl)}
//                                                                     className="inline-flex items-center px-3 py-1 text-xs rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
//                                                                 >
//                                                                     <Eye className="h-3 w-3 mr-1" />
//                                                                     View
//                                                                 </button>
//                                                                 <button
//                                                                     onClick={() => handleDownloadPDF(q.pdfUrl, `Quotation-${q.number}.pdf`)}
//                                                                     className="inline-flex items-center px-3 py-1 text-xs rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
//                                                                 >
//                                                                     <Download className="h-3 w-3 mr-1" />
//                                                                     Download
//                                                                 </button>
//                                                             </>
//                                                         )}
//                                                     </>
//                                                 )}

//                                                 {/* Approved actions */}
//                                                 {q.status === "Approved" && (
//                                                     <>
//                                                         {q.pdfUrl && (
//                                                             <>
//                                                                 <button
//                                                                     onClick={() => handleViewPDF(q.pdfUrl)}
//                                                                     className="inline-flex items-center px-3 py-1 text-xs rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
//                                                                 >
//                                                                     <Eye className="h-3 w-3 mr-1" />
//                                                                     Quotation
//                                                                 </button>
//                                                                 <button
//                                                                     onClick={() => handleDownloadPDF(q.pdfUrl, `Quotation-${q.number}.pdf`)}
//                                                                     className="inline-flex items-center px-3 py-1 text-xs rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
//                                                                 >
//                                                                     <Download className="h-3 w-3 mr-1" />
//                                                                     Download
//                                                                 </button>
//                                                             </>
//                                                         )}
//                                                         <button
//                                                             onClick={() => handleViewInvoice(q._id)}
//                                                             className="px-3 py-1 bg-green-600 text-white rounded flex items-center"
//                                                         >
//                                                             <Eye className="h-3 w-3 mr-1" /> View Invoice
//                                                         </button>
//                                                     </>
//                                                 )}
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>

//                         </table>
//                     </div>
//                 )}
//             </div>

//             {/* Update Modal */}
//             <UpdateQuotationModal
//                 quotation={selectedQuotation}
//                 isOpen={updateModalOpen}   // Important
//                 onClose={() => setUpdateModalOpen(false)}
//                 onUpdated={() => {
//                     refetch();
//                     setUpdateModalOpen(false);
//                 }}
//             />
//         </div>
//     );
// };

// export default QuotationListComponent;
import React, { useState, } from "react";
import { toast } from "react-toastify";
import { Plus, Search, Filter, Eye, Download, Loader2, Edit } from "lucide-react";
import {
  useGetQuotationsQuery,
  useSendQuotationMutation,
  useApproveQuotationMutation,

} from "@/api/finance/Quatation_Billing/quatation.api";
import UpdateQuotationModal from "./UpdateQuotationModal";


const QuotationListComponent = ({ onAddNew, onViewInvoice }) => {
  const { data: quotations, isLoading, isError, refetch } = useGetQuotationsQuery();
  const [sendQuotation, { isLoading: isSending }] = useSendQuotationMutation();
  const [approveQuotation, { isLoading: isApproving }] = useApproveQuotationMutation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");


  const [latestInvoices, setLatestInvoices] = useState({});
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  console.log(latestInvoices);

  // 🟢 Already notified quotations (to avoid duplicate toasts)


  // 📌 Send Quotation
  const handleSend = async (id) => {
    try {
      const res = await sendQuotation(id).unwrap();
      if (res.success && res.quotation) {
        toast.success("Quotation sent successfully!");
        refetch();
        if (res.quotation?.pdfUrl) {
          onViewInvoice({
            grandTotal: res.quotation.grandTotal,
            pdfUrl: res.quotation.pdfUrl,
          });
        }
      }
    } catch (err) {
      toast.error("Failed to send quotation!");
      console.error("Send error:", err);
    }
  };

  // 📌 Due Date Reminder


  // 📌 Approve Quotation
  const handleApprove = async (id) => {
    try {
      const res = await approveQuotation(id).unwrap();
      await refetch();
      if (res.success && res.invoice) {
        toast.success("Quotation approved successfully!");
        if (res.invoice.pdfUrl) {
          setLatestInvoices((prev) => ({
            ...prev,
            [id]: res.invoice,
          }));
          onViewInvoice({
            invoiceId: res.invoice.invoiceId,
            grandTotal: res.invoice.grandTotal,
            paymentStatus: res.invoice.paymentStatus,
            pdfUrl: res.invoice.pdfUrl,
          });
        }
      }
    } catch (err) {
      toast.error("Failed to approve quotation!");
      console.error("Approve error:", err);
    }
  };

  // 📌 View PDF
  const handleViewPDF = (url) => {
    if (!url) {
      toast.error("PDF not available!");
      return;
    }
    window.open(url, "_blank");
  };

  // 📌 Download PDF
  const handleDownloadPDF = (url, filename) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 📌 View Invoice
  const handleViewInvoice = (quotationId) => {
    if (!quotationId) {
      toast.error("Invoice not available!");
      return;
    }
    // Naya tab me open karna
    const url = `/finance/invoices/${quotationId}`;
    window.open(url, "_blank"); // "_blank" ensures new tab
  };

  // 📌 Filters
  const filteredQuotations = quotations?.filter((q) => {
    const matchesSearch =
      searchTerm === "" ||
      q.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.client?.name && q.client.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (q.project?.name && q.project.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "All" || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 📌 Loading State
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading quotations...</p>
        </div>
      </div>
    );

  // 📌 Error State
  if (isError)
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
        <p className="text-sm text-red-700">Error loading quotations!</p>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* 🔍 Search and Filter */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-gray-200">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search quotations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex items-center">
            <Filter className="h-5 w-5 text-gray-400 mr-2" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="All">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Sent">Sent</option>
              <option value="Approved">Approved</option>
            </select>
          </div>
        </div>
      </div>

      {/* 📌 Quotations Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {filteredQuotations?.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="mt-2 text-sm font-medium text-gray-900">No quotations found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new quotation.</p>
            <div className="mt-6">
              <button
                onClick={onAddNew}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Quotation
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-1 text-left text-xs font-medium text-white uppercase">Number</th>
                  <th className="px-6 py-1 text-left text-xs font-medium text-white uppercase">Client</th>
                  <th className="px-6 py-1 text-left text-xs font-medium text-white uppercase">Project</th>
                  <th className="px-6 py-1 text-left text-xs font-medium text-white uppercase">Status</th>
                  <th className="px-6 py-1 text-left text-xs font-medium text-white uppercase">Total</th>
                  <th className="px-6 py-1 text-left text-xs font-medium text-white uppercase">Paid Amount</th>
                  <th className="px-6 py-1 text-left text-xs font-medium text-white uppercase">Due / Remaining</th>
                  <th className="px-6 py-1 text-left text-xs font-medium text-white uppercase">Due Date</th>
                  <th className="px-6 py-1 text-left text-xs font-medium text-white uppercase">Payment Status</th>
                  <th className="px-6 py-1 text-right text-xs font-medium text-white uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredQuotations.map((q) => (
                  <tr key={q._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-1 whitespace-nowrap">{q.number}</td>
                    <td className="px-6 py-1 whitespace-nowrap">{q.client?.name}</td>
                    <td className="px-6 py-1 whitespace-nowrap">{q.project?.name}</td>
                    <td className="px-6 py-1 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${q.status === "Draft"
                            ? "bg-yellow-100 text-yellow-800"
                            : q.status === "Sent"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                      >
                        {q.status}
                      </span>
                    </td>
                    <td className="px-6 py-1 whitespace-nowrap text-sm text-gray-900">
                      ₹{q.grandTotal || q.total}
                    </td>
                    <td className="px-6 py-1 whitespace-nowrap text-sm text-gray-900">₹{q.amountPaid || 0}</td>
                    <td className="px-6 py-1 whitespace-nowrap text-sm text-red-700">
                      ₹{(q.grandTotal || q.total) - (q.amountPaid || 0)}
                    </td>
                    <td className="px-6 py-1 whitespace-nowrap text-sm text-gray-900"> {q.dueDate ? q.dueDate.split("T")[0] : "N/A"}</td>
                    <td className="px-6 py-1 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${q.paymentStatus === "Pending"
                            ? "bg-red-100 text-red-800"
                            : q.paymentStatus === "Partial"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                      >
                        {q.paymentStatus || "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-1 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {/* Draft Actions */}
                        {q.status === "Draft" && (
                          <>
                            <button
                              onClick={() => handleSend(q._id)}
                              disabled={isSending}
                              className="inline-flex items-center px-3 py-1 text-xs rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                            >
                              {isSending && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
                              Send
                            </button>

                          </>
                        )}

                        {/* Sent Actions */}
                        {q.status === "Sent" && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedQuotation(q);
                                setUpdateModalOpen(true);
                              }}
                              className="inline-flex items-center px-3 py-1 text-xs rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Update
                            </button>
                            
                              <button
                                onClick={() => handleSend(q._id)}
                                disabled={isSending}
                                className="inline-flex items-center px-3 py-1 text-xs rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                              >
                                {isSending && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
                                Send
                              </button>
                    
                            <button
                              onClick={() => handleApprove(q._id)}
                              disabled={isApproving}
                              className="inline-flex items-center px-3 py-1 text-xs rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                            >
                              {isApproving && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
                              Approve
                            </button>
                            {q.pdfUrl && (
                              <>
                                <button
                                  onClick={() => handleViewPDF(q.pdfUrl)}
                                  className="inline-flex items-center px-3 py-1 text-xs rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </button>
                                <button
                                  onClick={() =>
                                    handleDownloadPDF(q.pdfUrl, `Quotation-${q.number}.pdf`)
                                  }
                                  className="inline-flex items-center px-3 py-1 text-xs rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                  <Download className="h-3 w-3 mr-1" />
                                  Download
                                </button>
                              </>
                            )}
                          </>
                        )}

                        {/* Approved Actions */}
                        {q.status === "Approved" && (
                          <>
                            {q.pdfUrl && (
                              <>
                                <button
                                  onClick={() => handleViewPDF(q.pdfUrl)}
                                  className="inline-flex items-center px-3 py-1 text-xs rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
                                >
                                  <Eye className="h-3 w-3 mr-1" /> Quotation
                                </button>
                                <button
                                  onClick={() =>
                                    handleDownloadPDF(q.pdfUrl, `Quotation-${q.number}.pdf`)
                                  }
                                  className="inline-flex items-center px-3 py-1 text-xs rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                  <Download className="h-3 w-3 mr-1" /> Download
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleViewInvoice(q._id)}
                              className="px-3 py-1 bg-green-600 text-white rounded flex items-center"
                            >
                              <Eye className="h-3 w-3 mr-1" /> View Invoice
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Update Modal */}
      <UpdateQuotationModal
        quotation={selectedQuotation}
        isOpen={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        onUpdated={() => {
          refetch();
          setUpdateModalOpen(false);
        }}
      />
    </div>
  );
};

export default QuotationListComponent;
