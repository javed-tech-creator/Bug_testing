import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { FaCartPlus, FaEdit, FaTruck } from "react-icons/fa";
import StatusSummaryCards from "../components/StatusPaymentOrder";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DateRangeFilter from "../components/purchaseOrder/DateRangePickerModal";
import StatusTabs from "../components/purchaseOrder/StatusTabs";
import PaymentModal from "../components/purchaseOrder/UpdatePaymentModal";
import { MdDelete, MdEdit } from "react-icons/md";
import {
  useGetInvoicesQuery,
  useLazyGetInvoicePdfQuery,
} from "@/api/vendor/invoice.api";
import dayjs from "dayjs";
import DataLoading from "../components/DataLoading";
import { RiFileList3Line } from "react-icons/ri";
import {
  useDeleteDraftMutation,
  useGetDraftsQuery,
} from "@/api/vendor/draft.api";
import { skipToken } from "@reduxjs/toolkit/query";
import { Api } from "@mui/icons-material";
import { toast } from "react-toastify";
import ConfirmDialog from "@/components/ConfirmationToastPopUp";

const OrdersTable = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDraftId, setSelectedDraftId] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [invoiceData, setInvoiceData] = useState({});
  // payment modal
  const [showModal, setShowModal] = useState(false);

  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState({
    start: dayjs().subtract(7, "day").format("YYYY-MM-DD"),
    end: dayjs().format("YYYY-MM-DD"),
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  console.log("today date is", dateRange);

  // delete drafts Api
  const [deleteDraft, { isLoading: draftDeleteLoading }] =
    useDeleteDraftMutation();

  // getting Drafts data from backend
  const {
    data: DraftsData,
    isLoading: DraftsLoading,
    refetch: refetchDrafts,
  } = useGetDraftsQuery(
    filterStatus === "Drafts"
      ? {
          page: currentPage,
          limit: itemsPerPage,
          startDate: dateRange.start || undefined,
          endDate: dateRange.end || undefined,
        }
      : skipToken
  );

  // ✅ Call Get API
  const {
    data: invoices,
    isLoading: invoiceLoading,
    // isError: invoiceError,
    isFetching: refetchInvoices,
  } = useGetInvoicesQuery(
    filterStatus !== "Drafts"
      ? {
          page: currentPage,
          limit: itemsPerPage,
          status: filterStatus !== "all" ? filterStatus : undefined,
          startDate: dateRange.start || undefined,
          endDate: dateRange.end || undefined,
        }
      : skipToken // <-- RTK Query ka built-in feature to skip API call
  );

  // 🟢 Final data to use
  const finalData = filterStatus === "Drafts" ? DraftsData : invoices;
  const isLoading = filterStatus === "Drafts" ? DraftsLoading : invoiceLoading;

  //  const invoices = data?.data || [];
  // const totalInvoices = data?.total || 0;
  console.log("finaldata is :-", finalData);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus]);

  const filteredList = (finalData?.data || []).filter((order) => {
    const query = searchQuery.toLowerCase();
    const invoiceId =
      order.invoiceId?.toLowerCase() || order.draftId?.toLowerCase();
    const customerName = order.customerName?.toLowerCase() || "";
    return invoiceId.includes(query) || customerName.includes(query);
  });

  const [getInvoicePdf, { isLoading: pdfIsLoading, isFetching }] =
    useLazyGetInvoicePdfQuery();

  //  const handleDownloadInvoice = async (invoiceId) => {
  //     try {
  //       const response = await getInvoicePdf(invoiceId).unwrap();
  // console.log("pdf response",response);

  //       // Convert blob to file download
  //       const url = window.URL.createObjectURL(new Blob([response]));
  //       const link = document.createElement("a");
  //       link.href = url;
  //       link.setAttribute("download", `${invoiceId}.pdf`);
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //     } catch (err) {
  //       console.error("Error downloading invoice:", err);
  //     }
  //   };

  const [previewUrl, setPreviewUrl] = useState(null);
  // const handleDownloadInvoice = async (invoiceId) => {
  //   try {
  //     const response = await getInvoicePdf(invoiceId).unwrap();

  //     // Blob banaye PDF ka
  //     const blob = new Blob([response], { type: "application/pdf" });
  //     const url = window.URL.createObjectURL(blob);

  //     // ✅ New tab me preview + download link
  //     const html = `
  //       <html>
  //         <head><title>Invoice Preview</title></head>
  //         <body style="margin:0">
  //           <iframe src="${url}" style="width:100%;height:90vh;" frameborder="0"></iframe>
  //           <div style="text-align:center;margin-top:10px;">
  //             <a href="${url}" download="${invoiceId}.pdf" style="font-size:16px; text-decoration:none; color:blue;">
  //               Download PDF
  //             </a>
  //           </div>
  //         </body>
  //       </html>
  //     `;

  //     // New tab open karo
  //     const previewWindow = window.open("", "_blank");
  //     previewWindow.document.write(html);

  //   } catch (err) {
  //     console.error("Error opening/downloading invoice:", err);
  //   }
  // };

  const handleDownloadInvoice = async (invoiceId) => {
    try {
      const response = await getInvoicePdf(invoiceId).unwrap();

      // PDF Blob banaye
      const blob = new Blob([response], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      // Modal ke liye state me set karo
      setPreviewUrl(url);
    } catch (err) {
      console.error("Error fetching invoice:", err);
    }
  };

  const handleCloseModal = () => {
    if (previewUrl) {
      window.URL.revokeObjectURL(previewUrl); // memory cleanup
    }
    setPreviewUrl(null);
  };

  const onRangeChange = (range) => {
    console.log("Selected Range:", range);
    setDateRange(range); // ✅ Save date range
  };

  const navigate = useNavigate();

  const handleDelete = async (draftId) => {
    try {
      const res = await deleteDraft(draftId).unwrap();
      toast.success(res.message || "Draft deleted successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete draft");
    }
  };

  const { drafts } = useParams();

  useEffect(() => {
    if (drafts) {
      // Agar URL me param hai to usko filterStatus bana do
      setFilterStatus(drafts);
    } else {
      // Agar param nahi hai to default "all"
      setFilterStatus("all");
    }
  }, [drafts]);

  const handleEdit = (draftId) => {
    navigate(`/vendor/generateinvoice/${draftId}`);
  };

  return (
    <>
      {(pdfIsLoading || isFetching) && (
        <>
          {/* Background overlay */}
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"></div>

          {/* Modal loader */}
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
              <DataLoading />
              <p className="mt-4 text-gray-700">Loading PDF, please wait...</p>
            </div>
          </div>
        </>
      )}

      <div className="w-full rounded-xl bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 p-[1px] shadow mb-5">
        <div className="bg-white rounded-xl p-3 sm:px-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Title */}
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
            <RiFileList3Line className="w-6 h-6 text-orange-500" />
            <span>Orders</span>
          </h2>

          {/* Right Side: Date Filter & Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <button
              type="button"
              className="text-white bg-orange-400 hover:bg-orange-500 px-4 py-2 rounded-md text-sm font-medium shadow"
              onClick={() => navigate("/vendor/generateinvoice")}
            >
              + Create Invoice
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-xl space-y-6 mb-2">
        {/* Status Tabs, Date Filter, and Search Bar - Single Line Responsive Layout */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left Group: Status Tabs */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-wrap">
            <StatusTabs
              onTabChange={(value) => setFilterStatus(value)}
              filterStatus={filterStatus}
              orders={filteredList}
            />
          </div>

          {/* Right Group: Date Range + Search Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
            <DateRangeFilter onRangeChange={onRangeChange} />
            <input
              type="text"
              placeholder="Search by Bill# or Customer Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto max-h-[52vh] overflow-y-scroll hide-scrollbar ">
          <table className="min-w-full text-sm text-left ">
            <thead className="bg-black text-white sticky top-0 z-5">
              {filterStatus === "Drafts" ? (
                <tr>
                  <th className="p-3 font-semibold text-center border">
                    Bill#
                  </th>
                  <th className="p-3 font-semibold text-center border">
                    Customer
                  </th>
                  <th className="p-3 font-semibold text-center border">
                    {" "}
                    Created Date
                  </th>
                  <th className="p-3 font-semibold text-center border">
                    Amount
                  </th>
                  <th className="p-3 font-semibold text-center border">
                    Document Type
                  </th>
                  <th className="p-3 font-semibold text-center border">
                    Action
                  </th>
                </tr>
              ) : (
                <tr>
                  <th className="p-3 font-semibold text-center border">
                    Bill#
                  </th>
                  <th className="p-3 font-semibold text-center border">
                    Customer
                  </th>
                  <th className="p-3 font-semibold text-center border">Date</th>
                  <th className="p-3 font-semibold text-center border">
                    Amount
                  </th>
                  <th className="p-3 font-semibold text-center border">
                    Status
                  </th>
                  <th className="p-3 font-semibold text-center border">Mode</th>
                  <th className="p-3 font-semibold text-center border">
                    Action
                  </th>
                </tr>
              )}
            </thead>
            <tbody>
              {isLoading || refetchInvoices ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-6 text-gray-500 bg-white"
                  >
                    <DataLoading />
                  </td>
                </tr>
              ) : filteredList.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-6 text-gray-500 bg-white"
                  >
                    No{" "}
                    <span>
                      {filterStatus === "all"
                        ? "orders"
                        : filterStatus === "Drafts"
                        ? filterStatus
                        : "orders"}
                    </span>{" "}
                    found
                  </td>
                </tr>
              ) : filterStatus === "Drafts" ? (
                // 🟢 Drafts Rows
                filteredList.map((order, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="p-3 text-center font-mono border border-gray-200">
                      {order.draftId}
                    </td>
                    <td className="p-3 text-center border border-gray-200">
                      <div className="flex flex-col items-center">
                        <span className="font-medium">
                          {order.customerName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {order.customerPhone}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-center border border-gray-200">
                      {new Date(order.createdOn).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-3 text-center font-medium text-gray-800 border border-gray-200">
                      ₹ {order.grandTotal}
                    </td>
                    <td className="p-3 text-center border border-gray-200">
                      {order.documentType || "Invoice"}
                    </td>
                    <td className="p-3 text-center border border-gray-200">
                      <div className="flex gap-3 justify-center items-center">
                        {/* Edit Button */}
                        <button
                          onClick={() => handleEdit(order.draftId)}
                          className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 
                 shadow-sm transition transform hover:scale-105 cursor-pointer"
                          title="Edit Draft"
                        >
                          <FaEdit size={16} />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => {
                            setSelectedDraftId(order.draftId);
                            setOpenDialog(true);
                          }}
                          disabled={draftDeleteLoading}
                          className="p-2 rounded-full bg-red-50 text-orange-500 hover:bg-red-100 
                 shadow-sm transition transform hover:scale-105 cursor-pointer"
                          title="Delete Draft"
                        >
                          <MdDelete size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                filteredList.map((order, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="p-3 text-center font-mono border border-gray-200">
                      {order.invoiceId}
                    </td>
                    <td className="p-3 text-center border border-gray-200">
                      <div className="flex flex-col items-center">
                        <span className="font-medium">
                          {order.customerName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {order.customerPhone}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-center border border-gray-200">
                      {new Date(order.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-3 text-center font-medium text-gray-800 border border-gray-200">
                      ₹ {order.grandTotal}
                    </td>
                    <td className="p-3 text-center border border-gray-200">
                      {(() => {
                        const statusClasses = {
                          Paid: "bg-green-100 text-green-700",
                          Pending: "bg-red-100 text-red-700",
                          Partial: "bg-yellow-100 text-yellow-700",
                        };

                        const pendingAmount =
                          order.grandTotal - order.amountPaid;

                        return (
                          <div className="inline-flex flex-col items-center">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm 
            ${
              statusClasses[order.paymentStatus] || "bg-gray-100 text-gray-600"
            }`}
                            >
                              {order.paymentStatus}
                            </span>

                            {order.paymentStatus === "Partial" && (
                              <span className="text-[10px] font-semibold text-blue-500 mt-1">
                                Pending: ₹{pendingAmount}
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </td>

                    <td className="p-3 text-center border border-gray-200">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded-full capitalize
        ${
          order.paymentMode.toLowerCase() === "pending"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-blue-100 text-blue-800"
        }
      `}
                      >
                        {order.paymentMode}
                      </span>
                    </td>

                    <td className="p-3 text-center border border-gray-200">
                      <div className="flex gap-2 justify-center items-center">
                        <button
                          onClick={() => {
                            setShowModal(true);
                            setInvoiceData({
                              invoiceId: order.invoiceId,
                              amountPending:
                                (Number(order.grandTotal) || 0) -
                                (Number(order.amountPaid) || 0),
                              phone: order.customerPhone,
                              customer: order.customerName,
                            });
                          }}
                          disabled={order.paymentStatus === "Paid"}
                          className={`bg-blue-100 text-black px-3 py-1.5 rounded-md shadow-sm transition
    ${
      order.paymentStatus === "Paid"
        ? "opacity-50 cursor-not-allowed"
        : "hover:bg-blue-200 cursor-pointer"
    }`}
                        >
                          ₹
                        </button>

                        <button
                          onClick={() => handleDownloadInvoice(order.invoiceId)}
                          className="bg-purple-100 hover:bg-purple-200 cursor-pointer text-black px-3 py-1.5 rounded-md flex items-center gap-1 shadow-sm transition"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 5c-7.633 0-11 7-11 7s3.367 7 11 7 11-7 11-7-3.367-7-11-7zm0 12c-2.761 0-5-2.239-5-5s2.239-5 5-5c2.762 0 5 2.239 5 5s-2.238 5-5 5zm0-8a3 3 0 100 6 3 3 0 000-6z" />
                          </svg>
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Row: Summary on left, Pagination on right */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start  gap-4">
          {/* Left: Summary Cards */}
          <div className="w-full md:w-auto">
            {filterStatus === "Drafts" ? (
              ""
            ) : (
              <StatusSummaryCards orders={filteredList} />
            )}
          </div>

          {/* Right: Pagination */}
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-2">
            {/* Prev Button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 border rounded-md ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              Prev
            </button>

            {/* Page Numbers */}
            {[
              ...Array(
                Math.ceil((finalData?.total || 0) / itemsPerPage)
              ).keys(),
            ].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page + 1)}
                className={`px-3 py-1 border rounded-md ${
                  currentPage === page + 1
                    ? "bg-blue-500 text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {page + 1}
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  prev < Math.ceil((finalData?.total || 0) / itemsPerPage)
                    ? prev + 1
                    : prev
                )
              }
              disabled={
                currentPage ===
                Math.ceil((finalData?.total || 0) / itemsPerPage)
              }
              className={`px-3 py-1 border rounded-md ${
                currentPage ===
                Math.ceil((finalData?.total || 0) / itemsPerPage)
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* payment modal  */}
      <PaymentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        invoiceData={invoiceData}
      />

      {/* Modal */}
      {previewUrl && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width: "80%",
              height: "90%",
              backgroundColor: "#fff",
              borderRadius: "8px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* PDF iframe */}
            <iframe
              src={previewUrl}
              style={{ flex: 1, border: "none" }}
              title="Invoice Preview"
            />

            {/* Buttons row */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "20px",
                padding: "10px",
                borderTop: "1px solid #ddd",
              }}
            >
              {/* Close button */}
              <button
                onClick={handleCloseModal}
                style={{
                  background: "#dc2626",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "8px 16px",
                  cursor: "pointer",
                }}
              >
                Close
              </button>

              {/* Download button */}
              <a
                href={previewUrl}
                download={`Invoice.pdf`}
                style={{
                  background: "orange",
                  color: "#fff",
                  borderRadius: "4px",
                  padding: "8px 16px",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Download PDF
              </a>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={openDialog}
        title="Confirm Delete"
        message="Are you sure you want to delete this record? This action cannot be undone."
        onConfirm={() => {
          handleDelete(selectedDraftId); // delete ke liye id pass karo agar zarurat ho
          setOpenDialog(false);
        }}
        onCancel={() => setOpenDialog(false)}
      />
    </>
  );
};

export default OrdersTable;
