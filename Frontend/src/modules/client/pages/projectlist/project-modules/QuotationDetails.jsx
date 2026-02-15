import React, { useEffect, useState } from "react";
import LetterProductTable from "../../../components/project-list/project-modules/quotation/LetterProductTable";
import BoardLetterProductTable from "../../../components/project-list/project-modules/quotation/BoardLetterProductTable";
import BoardProductTable from "../../../components/project-list/project-modules/quotation/BoardProductTable";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as Icons from "lucide-react";
const QuotationDetails = () => {
    const [showButton, setShowButton] = useState(true);
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate()
    useEffect(() => {
        // agar state se true aaya → buttons hide
        if (location?.state?.showButton === true) {
            setShowButton(false);
        } else {
            setShowButton(true);
        }
    }, [location]);

    // Print handler
    const handlePrint = () => {
        window.print();
    };

    // Download PDF handler (placeholder: triggers print dialog)
    const handleDownloadPDF = () => {
        window.print();
    };

    return (
        <div className=" bg-gray-50  text-gray-800">
            {/* =========================================================================
          1. HEADER BAR (Normal Scroll)
      ========================================================================== */}
            <div className="max-w-[1400px] mx-auto mb-6 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex flex-wrap items-center justify-between">
                    <div className="p-4 flex items-center gap-3">
                        <button className="text-xl cursor-pointer" onClick={() => navigate(-1)}>
                            <Icons.ArrowLeft size={20} />
                        </button>
                        <h1 className="text-lg font-semibold">Design Details</h1>
                    </div>


                    {/* Right Section */}
                    <div className="flex flex-wrap items-center gap-3">
                        {showButton && (
                            <button className="px-4 py-2 border bg-green-600 rounded-md text-sm text-white hover:bg-green-700 cursor-pointer">
                                Accepted On : 12/01/25 -11:00 AM
                            </button>
                        )}
                        <button
                            className="px-4 py-2 border bg-blue-600 rounded-md text-sm text-white hover:bg-blue-700 cursor-pointer"
                            onClick={handlePrint}
                        >
                            Print
                        </button>
                        <button
                            className="px-4 py-2 border bg-blue-600 rounded-md text-sm text-white hover:bg-blue-700 cursor-pointer"
                            onClick={handleDownloadPDF}
                        >
                            Download PDF
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="mt-6">
                {/* --- INVOICE PAPER SECTION --- */}
                <div className="max-w-[1400px] mx-auto bg-white shadow-lg p-10 mb-8 border border-gray-300">
                    {/* Invoice Header */}
                    <div className="flex justify-between items-start mb-10 border-b border-gray-100 pb-8">
                        <div className="flex flex-col gap-1">
                            {/* Logo Image */}
                            <div className="mb-4">
                                <img
                                    src="/dss_logo.webp"
                                    alt="DSS Logo"
                                    className="w-48 h-auto object-contain"
                                />
                            </div>

                            {/* Company Name */}
                            <h1 className="text-blue-600 font-bold text-2xl tracking-tight mb-2">
                                Digital Signage Solutions PVT. LTD.
                            </h1>

                            {/* Address Block */}
                            <div className="text-sm text-gray-600 leading-relaxed font-medium">
                                <p>633/003 Cc Gulzar Colony Chinhat Industria Area Chinhat,</p>
                                <p>Lucknow, Uttar Pradesh 226028</p>
                                <p className="mt-1">
                                    GSTIN: GST089892387928937289372 | PAN: UESK830SH
                                </p>
                                <p>+9187643210, +919876543210 | info@dssup.com</p>
                                <p>www.dssup.com</p>
                            </div>
                        </div>

                        {/* Right Side: Invoice # */}
                        <div className="text-right mt-2">
                            <h2 className="text-blue-600 font-bold text-xl uppercase tracking-wide">
                                TAX INVOICE
                            </h2>
                            <p className="text-sm font-semibold text-gray-600 mt-1">
                                Invoice #: INV-175
                            </p>
                        </div>
                    </div>

                    {/* Bill To Section (Read Only – Alternative Design) */}
                    <div className="mb-10 border border-gray-200 rounded-xl overflow-hidden">
                        {/* Top Accent Header */}
                        <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-600 px-6 py-3">
                            <h3 className="text-white font-semibold tracking-wide text-sm uppercase">
                                Billing & Project Details
                            </h3>
                        </div>

                        {/* Content */}
                        <div className="p-6 bg-white grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Client</p>
                                    <p className="text-lg font-semibold text-gray-800">
                                        Abusoac Singh
                                    </p>
                                    <p className="text-sm text-gray-600">Abcxyz Pvt Ltd</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">
                                            Client Code
                                        </p>
                                        <p className="font-medium text-gray-800">CL-2981</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">
                                            Project Code
                                        </p>
                                        <p className="font-medium text-gray-800">PR-87432</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">
                                            Project Name
                                        </p>
                                        <p className="font-medium text-gray-800">
                                            Main Signage Branding
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase">Contact</p>
                                        <p className="font-medium text-gray-800">+91 9876543210</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500 uppercase">
                                        Billing Address
                                    </p>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        Abc Nagar, Lucknow UP
                                    </p>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="border border-gray-100 rounded-lg p-5 bg-gray-50 space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Invoice No</span>
                                    <span className="font-semibold text-gray-800">INV-175</span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Invoice Date</span>
                                    <span className="font-semibold text-gray-800">
                                        24 Oct 2025
                                    </span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Due Date</span>
                                    <span className="font-semibold text-gray-800">
                                        25 Oct 2025
                                    </span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Email</span>
                                    <span className="font-medium text-gray-800">
                                        client@gmail.com
                                    </span>
                                </div>

                                <div className="pt-4 border-t border-gray-200">
                                    {/* <span className="inline-block text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">
                    Accepted Quotation
                  </span> */}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- TABLES SECTION --- */}
                    <div className="overflow-x-auto">
                        <BoardProductTable
                            showRemove={false}
                            showBorder={false}
                            clickable={false}
                            showLsp={false}
                        />
                        <LetterProductTable
                            showRemove={false}
                            showBorder={false}
                            clickable={false}
                            showLsp={false}
                            table={{
                                rows: [
                                    {
                                        sNo: "01",
                                        productCode: "P-09977",
                                        productName: "Flex Sign Letter",
                                        productDescription: "Product Description",
                                        letters: "A,B,C",
                                        thickness: "12",
                                        length: "4",
                                        height: "4",
                                        quantity: "2",
                                        rate: "12",
                                        amount: "200",
                                        lsp: "",
                                    },
                                    {
                                        sNo: "",
                                        productCode: "",
                                        productName: "",
                                        productDescription: "",
                                        letters: "A,B,C",
                                        thickness: "12",
                                        length: "4",
                                        height: "4",
                                        quantity: "2",
                                        rate: "12",
                                        amount: "200",
                                        lsp: "",
                                    },
                                    {
                                        sNo: "",
                                        productCode: "",
                                        productName: "",
                                        productDescription: "",
                                        letters: "A,B,C",
                                        thickness: "12",
                                        length: "4",
                                        height: "4",
                                        quantity: "2",
                                        rate: "12",
                                        amount: "200",
                                        lsp: "",
                                    },
                                ],
                            }}
                        />
                        <BoardLetterProductTable
                            showRemove={false}
                            showBorder={false}
                            clickable={false}
                            showLsp={false}
                        />
                    </div>

                    {/* --- FOOTER TOTALS & BANK --- */}
                    <div className="flex justify-between mt-12 border-t border-gray-200 pt-6">
                        <div className="w-1/2 text-[10px]">
                            <h5 className="font-bold text-sm mb-3 text-gray-800">
                                Bank Details
                            </h5>
                            <div className="flex gap-6">
                                <div className="space-y-1.5 text-gray-600">
                                    <div className="grid grid-cols-[80px_1fr] gap-2">
                                        <span className="font-bold text-gray-800">Bank Name:</span>
                                        <span>State Bank Of India</span>
                                        <span className="font-bold text-gray-800">Account No:</span>
                                        <span>00000000000001</span>
                                        <span className="font-bold text-gray-800">IFSC:</span>
                                        <span>SBIN0000001</span>
                                        <span className="font-bold text-gray-800">Branch:</span>
                                        <span>Gomti Nagar, Lucknow</span>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <span className="font-bold block mb-2 text-gray-800">
                                        Pay Using UPI
                                    </span>
                                    {/* QR Placeholder */}
                                    <div className="w-20 h-20 bg-gray-100 flex items-center justify-center border border-gray-200 rounded overflow-hidden">
                                        <img
                                            src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
                                            alt="UPI QR Code"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h5 className="font-bold mb-2 text-gray-800">
                                    Terms & Conditions:
                                </h5>
                                <ol className="list-decimal list-inside text-gray-600 space-y-1">
                                    <li>
                                        Payments will be made in favor of Digital Signage Solution
                                        Pvt. Ltd.
                                    </li>
                                    <li>50% Payment required with confirmation.</li>
                                    <li>50% Post Production or before installation.</li>
                                    <li>Scuff Folding work by the client side.</li>
                                </ol>
                            </div>
                        </div>

                        <div className="w-1/3 flex flex-col items-end text-xs text-gray-700">
                            <div className="w-full flex justify-between py-1.5 border-b border-gray-100">
                                <span>Total Discount</span>
                                <span>₹800</span>
                            </div>
                            <div className="w-full flex justify-between py-1.5 border-b border-gray-100">
                                <span>Taxable Amount</span>
                                <span>₹800</span>
                            </div>
                            <div className="w-full flex justify-between py-1.5 border-b border-gray-100">
                                <span>CGST + SGST</span>
                                <span>₹800</span>
                            </div>
                            <div className="w-full flex justify-between py-3 border-t border-b-2 border-gray-200 font-bold text-lg mt-2 text-blue-600">
                                <span>Grand Total</span>
                                <span>₹2,25,500</span>
                            </div>
                            <div className="text-[10px] text-gray-500 mt-2 w-full text-right italic">
                                Two Lakh Twenty-Five Thousand Five Hundred Only
                            </div>
                        </div>
                    </div>

                    {/* --- SIGNATURES (UPDATED to Match Screenshot) --- */}
                    <div className="flex justify-between mt-20 pt-8 items-end px-2">
                        {/* LEFT SIDE - DSS */}
                        <div className="flex flex-col w-64">
                            <div className="mb-2 pl-2">
                                {/* Reusing logo from header to match the stylized 'dss' in screenshot */}
                                <img
                                    src="/dss_logo.webp"
                                    alt="DSS Signature"
                                    className="h-14 object-contain -ml-2 filter grayscale brightness-50 contrast-125"
                                />
                            </div>

                            <div className="border-t border-gray-800 w-full"></div>

                            <div className="flex justify-between items-baseline mt-1.5">
                                <span className="text-[11px] font-bold text-gray-900">
                                    DSS Signage Solutions
                                </span>
                                <span className="text-[10px] text-gray-500">
                                    Date: 24 Dec 25
                                </span>
                            </div>

                            <div className="text-[10px] text-gray-500 mt-0.5">
                                Authorized Signatory
                            </div>
                        </div>

                        {/* RIGHT SIDE - CLIENT */}
                        <div className="flex flex-col w-64 items-end">
                            <div className="mb-2 flex justify-center h-16 w-full items-end pr-4">
                                {/* SVG to mimic the tall scribbly signature from screenshot */}
                                <svg
                                    viewBox="0 0 200 100"
                                    className="h-full w-40"
                                    fill="none"
                                    stroke="black"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M60,90 C70,50 50,20 80,10 C90,40 85,70 100,80 C120,30 140,20 150,50 C160,80 170,85 190,80" />
                                    <path
                                        d="M40,70 L180,70"
                                        strokeOpacity="0.1"
                                        strokeWidth="1"
                                    />
                                </svg>
                            </div>

                            <div className="border-t border-gray-800 w-full"></div>

                            <div className="flex justify-between items-baseline mt-1.5 w-full">
                                <span className="text-[11px] font-bold text-gray-900">
                                    Client Acceptance
                                </span>
                                <span className="text-[10px] text-gray-500">
                                    Date: 24 Dec 25
                                </span>
                            </div>

                            <div className="text-[10px] text-gray-500 mt-0.5 w-full text-left">
                                Authorized Signatory
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* =========================================================================
          2. BOTTOM ACTION BAR (Normal Flow)
      ========================================================================== */}

            {!showButton && (
                <div className="max-w-[1400px] mx-auto mb-8 bg-white border border-gray-200 p-4 shadow-sm rounded-md flex justify-end gap-4 print:hidden">
                    <button className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold text-sm rounded shadow-sm transition-colors cursor-pointer">
                        Send to Sales
                    </button>
                    {/* <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded shadow-sm transition-colors cursor-pointer">
            Send to Manager
          </button> */}
                </div>
            )}
        </div>
    );
};

// --- Helper Components ---

const ProductTable = ({ headers, rows }) => (
    <div className="w-full overflow-hidden border border-gray-300 text-[10px] rounded-sm">
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-blue-600 text-white">
                        {headers.map((h, i) => (
                            <th
                                key={i}
                                className="py-2 px-2 text-center font-semibold border-r border-blue-500 last:border-r-0 whitespace-nowrap"
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, idx) => (
                        <tr
                            key={idx}
                            className="border-b border-gray-200 hover:bg-blue-50 transition-colors"
                        >
                            {row.map((cell, cIdx) => (
                                <td
                                    key={cIdx}
                                    className="py-2 px-2 text-center border-r border-gray-200 last:border-r-0 whitespace-nowrap text-gray-700"
                                >
                                    {cell || "-"}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default QuotationDetails;
