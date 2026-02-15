import React from "react";
import { useNavigate } from "react-router-dom";
import { Download, Printer, ArrowLeft } from "lucide-react";
import DSSLogo from "../../../assets/dss_logo.webp";

const PaymentReceipt = () => {
  const navigate = useNavigate();
  const receiptData = {
    receiptNo: "RCPT-0912",
    date: "24 Oct 2025",
    type: "Initial Payment",
    client: {
      name: "Abc Singh",
      company: "Abc Pvt. Ltd.",
      code: "CL-2981",
    },
    project: {
      quotationNo: "QT-0912",
      name: "Main Signage Branding",
      code: "PR-87432",
    },
    amounts: {
      total: "2,25,500",
      initial: "1,12,750",
      balance: "1,12,750",
      words: "Rupees One Lakh Twelve Thousand Seven Hundred Fifty Only",
    },
    payment: {
      mode: "UPI",
      refNo: "UPI982734892",
    },
  };

  return (
    <div className="min-h-screen">
      <div className="flex flex-wrap items-center justify-between mb-6 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="p-2 border rounded-md bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-800" />
          </button>

          <h1 className="text-xl font-bold text-gray-800">
            Initial Payment Receipt
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border bg-white rounded-md text-sm text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer">
            Download PDF
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 border bg-white rounded-md text-sm text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Print Receipt
          </button>
        </div>
      </div>

      {/* Main Receipt Card */}
      <div className="mx-auto shadow-lg rounded-sm overflow-hidden p-12 bg-white border border-gray-200 ">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <img src={DSSLogo} alt="DSS Logo" className="h-16 mb-2" />
            <h2 className="text-blue-600 font-bold text-xl uppercase tracking-tight">
              Digital Signage Solutions PVT. LTD.
            </h2>
            <div className="text-xs text-slate-500 mt-2 leading-relaxed max-w-sm">
              633/003 Cc Gulzar Colony Chinhat Industria Area Chinhat, Lucknow,
              Uttar Pradesh 226028
              <br />
              GSTIN: GST089892387928937289372 | PAN: UESK830SH
              <br />
              +9187643210, +919876543210 | info@dssup.com
              <br />
              www.dssup.com
            </div>
          </div>
          <div className="text-right">
            <h1 className="text-2xl font-bold text-blue-600 mb-2">
              PAYMENT RECEIPT
            </h1>
            <div className="grid grid-cols-2 text-sm gap-x-4">
              <span className="text-slate-500">Receipt No:</span>{" "}
              <span className="font-semibold">{receiptData.receiptNo}</span>
              <span className="text-slate-500">Date:</span>{" "}
              <span className="font-semibold">{receiptData.date}</span>
              <span className="text-slate-500">Type:</span>{" "}
              <span className="text-blue-600 font-bold">
                {receiptData.type}
              </span>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-12 mb-10 border-t border-gray-100 pt-6">
          <div>
            <h3 className="font-bold text-sm mb-4 border-b pb-2">
              Client Details
            </h3>
            <div className="grid grid-cols-3 text-sm gap-y-2">
              <span className="text-slate-500">Client Name:</span>{" "}
              <span className="col-span-2 font-semibold">
                {receiptData.client.name}
              </span>
              <span className="text-slate-500">Company:</span>{" "}
              <span className="col-span-2 font-semibold">
                {receiptData.client.company}
              </span>
              <span className="text-slate-500">Client Code:</span>{" "}
              <span className="col-span-2 font-semibold">
                {receiptData.client.code}
              </span>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-sm mb-4 border-b pb-2">
              Project Details
            </h3>
            <div className="grid grid-cols-3 text-sm gap-y-2">
              <span className="text-slate-500">Quotation No:</span>{" "}
              <span className="col-span-2 font-semibold">
                {receiptData.project.quotationNo}
              </span>
              <span className="text-slate-500">Project Name:</span>{" "}
              <span className="col-span-2 font-semibold">
                {receiptData.project.name}
              </span>
              <span className="text-slate-500">Project Code:</span>{" "}
              <span className="col-span-2 font-semibold">
                {receiptData.project.code}
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Banner */}
        <div className="bg-blue-50 rounded-md p-8 mb-8 text-center">
          <div className="grid grid-cols-3 mb-6">
            <div>
              <p className="text-xs text-slate-500 uppercase mb-2">
                Total Quotation Amount
              </p>
              <p className="text-3xl font-bold text-blue-700">
                ₹{receiptData.amounts.total}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase mb-2">
                Initial Payment (50%)
              </p>
              <p className="text-3xl font-bold text-blue-600">
                ₹{receiptData.amounts.initial}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase mb-2">
                Balance Amount (50%)
              </p>
              <p className="text-3xl font-bold text-blue-500">
                ₹{receiptData.amounts.balance}
              </p>
            </div>
          </div>
          <div className="pt-4 border-t border-blue-100">
            <p className="text-sm italic text-slate-600 mb-2">
              Amount in Words: {receiptData.amounts.words}
            </p>
            <p className="text-sm font-medium">
              Payment Mode:{" "}
              <span className="font-bold">{receiptData.payment.mode}</span> |
              Transaction Ref No:{" "}
              <span className="font-bold">{receiptData.payment.refNo}</span>
            </p>
          </div>
        </div>

        {/* Footer Terms */}
        <div className="mb-16">
          <p className="text-xs font-bold mb-1">Note:</p>
          <p className="text-xs text-slate-700 mb-4 font-semibold">
            Balance payable post-production / before installation
          </p>
          <p className="text-xs text-slate-500 italic leading-relaxed">
            We hereby acknowledge the receipt of the above-mentioned amount
            against the referenced quotation. This payment is treated as initial
            advance and the project execution will proceed as per agreed terms
            and conditions.
          </p>
        </div>

        {/* Signature */}
        <div className="flex flex-col items-end">
          <div className="text-center">
            <div className="font-serif text-3xl italic mb-1 text-slate-800">
              dss
            </div>
            <div className="w-64 border-t border-slate-300 pt-2">
              <p className="text-sm font-bold uppercase">
                Authorized Signatory
              </p>
              <p className="text-xs text-slate-500">Date: 24 Dec 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentReceipt;
