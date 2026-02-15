import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";


const QuotationFormPage = () => {
  const navigate = useNavigate();
  return (
    <div className="">
      
     {/* =========================================================================
    1. HEADER BAR (Normal Scroll)
========================================================================== */}
<div className="">
  <div className="max-w-full mb-6 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
    <div className="flex flex-wrap items-center justify-between">

      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 border rounded-md bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-800" />
        </button>

        <h1 className="text-xl font-bold text-gray-800">Quotation</h1>
      </div>

      {/* Right Section */}
      <div className="flex flex-wrap items-center gap-3">
        <button className="px-4 py-2 border bg-white rounded-md text-sm text-gray-600 hover:bg-gray-100">
          Saved as Draft
        </button>
        <button className="px-4 py-2 border bg-blue-600 rounded-md text-sm text-white hover:bg-blue-700">
          Print
        </button>
        <button className="px-4 py-2 border bg-blue-600 rounded-md text-sm text-white hover:bg-blue-700">
          Download PDF
        </button>
      </div>

    </div>
  </div>
</div> 

      {/* Main Content Area */}
      <div className="mt-6">
        
        {/* --- INVOICE PAPER SECTION --- */}
        <div className="max-w-full mx-auto bg-white shadow-lg p-10 mb-8 border border-gray-300">
          
          {/* Invoice Header (Logo, Name, Address) */}
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

          {/* Bill To Section */}
          <div className="mb-8">
            <h3 className="font-bold text-sm mb-3 border-b border-gray-200 pb-1 text-gray-700">
              Bill To:
            </h3>
            <div className="grid grid-cols-4 gap-y-2 text-xs text-gray-600">
              <div className="flex flex-col">
                <span className="font-bold text-gray-800">Client Name:</span>
                <span>Abusoac Singh</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-800">Project Code:</span>
                <span>PR-87432</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-800">Invoice Date:</span>
                <span>24 Oct 2025</span>
              </div>
              <div className="flex flex-col"></div>

              <div className="flex flex-col">
                <span className="font-bold text-gray-800">Contact Number:</span>
                <span>+91 9876543210</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-800">Project Name:</span>
                <span>Main Signage Branding</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-800">Due Date:</span>
                <span>25 Oct 2025</span>
              </div>
              <div className="flex flex-col"></div>

              <div className="flex flex-col">
                <span className="font-bold text-gray-800">Email:</span>
                <span>client@gmail.com</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-800">Company Name:</span>
                <span>Abcxyz Pvt Ltd</span>
              </div>
               <div className="flex flex-col">
                <span className="font-bold text-gray-800">Address:</span>
                <span>Abc Nagar, Lucknow UP</span>
              </div>
            </div>
          </div>

          {/* --- TABLES SECTION --- */}
          <div className="space-y-8">
            {/* Table 1: Only Board Products */}
            <div>
              <div className="mb-2">
                  <h4 className="font-bold text-sm text-gray-800">Products & Pricing</h4>
                  <h5 className="font-bold text-xs text-gray-500 uppercase mt-1">Only Board Products</h5>
              </div>
              <ProductTable
                headers={['S. No', 'Product Code', 'Product Name', 'Product Description', 'Thickness (MM)', 'Length (Inch)', 'Height (Inch)', 'Size (Sq. Feet)', 'Quantity', 'Rate (Sq. Feet)', 'Amount (Rs)']}
                rows={[
                  ['01', 'P-09977', 'Flex Sign Board', 'Product Description', '12 MM', '4 Inch', '4 Inch', '4 Sq. Feet', '2', '12', '288'],
                  ['02', 'P-09977', 'Abc Sign Board', 'Product Description', '12 MM', '4 Inch', '4 Inch', '4 Sq. Feet', '2', '12', '288'],
                  ['03', 'P-09977', 'Xyz Sign Board', 'Product Description', '12 MM', '4 Inch', '4 Inch', '4 Sq. Feet', '2', '12', '288'],
                ]}
              />
            </div>

            {/* Table 2: Only Letter Products */}
            <div>
              <h5 className="font-bold text-xs text-gray-500 uppercase mb-2">
                Only Letter Products
              </h5>
              <ProductTable
                headers={['S. No', 'Product Code', 'Product Name', 'Product Description', 'Letters', 'Thickness (MM)', 'Length (Inch)', 'Height (Inch)', 'Quantity', 'Rate (Inch)', 'Amount (Rs)']}
                rows={[
                  ['01', 'P-09977', 'Flex Sign Letter', 'Product Description', 'A,B,C', '12 MM', '4 Inch', '4 Inch', '2', '12', '288'],
                  ['', '', '', '', 'A,B,C', '12 MM', '4 Inch', '4 Inch', '2', '12', '288'],
                  ['', '', '', '', 'A,B,C', '12 MM', '4 Inch', '4 Inch', '2', '12', '288'],
                ]}
              />
            </div>

            {/* Table 3: Board & Letter Products (Custom Layout) */}
            <div>
              <h5 className="font-bold text-xs text-gray-500 uppercase mb-2">
                Board & Letter Products
              </h5>
              <div className="w-full overflow-hidden border border-gray-300 text-[10px] rounded-sm">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-blue-600 text-white">
                      <th className="py-2 px-1 text-center font-semibold border-r border-blue-500 w-[4%]">S. No</th>
                      <th className="py-2 px-1  font-semibold border-r border-blue-500 w-[8%] text-center">Product Code</th>
                      <th className="py-2 px-1 font-semibold border-r border-blue-500 w-[12%] text-center">Product Name</th>
                      <th className="py-2 px-1 font-semibold border-r border-blue-500 w-[15%] text-center">Product Description</th>
                      <th className="py-2 px-1 font-semibold border-r border-blue-500 w-[6%] text-center">Board</th>
                      <th className="py-2 px-1 font-semibold border-r border-blue-500 w-[8%] text-center">Thickness (MM)</th>
                      <th className="py-2 px-1 font-semibold border-r border-blue-500 w-[8%] text-center">Length (Inch)</th>
                      <th className="py-2 px-1 font-semibold border-r border-blue-500 w-[8%] text-center">Height (Inch)</th>
                      <th className="py-2 px-1 font-semibold border-r border-blue-500 w-[10%] text-center">Size(Sq. Feet/ Inch)</th>
                      <th className="py-2 px-1 font-semibold border-r border-blue-500 w-[6%] text-center">Quantity</th>
                      <th className="py-2 px-1 font-semibold border-r border-blue-500 w-[8%] text-center">Rate (Sq. Feet/ Inch)</th>
                      <th className="py-2 px-1 font-semibold w-[7%] text-center">Amount (Rs)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="p-2 border-r border-gray-200 text-center"></td>
                      <td className="p-2 border-r border-gray-200 text-center"></td>
                      <td className="p-2 border-r border-gray-200 text-center"></td>
                      <td className="p-2 border-r border-gray-200 text-center"></td>
                      <td className="p-2 border-r border-gray-200 text-center"></td>
                      <td className="p-2 border-r border-gray-200 text-center text-gray-700">12 MM</td>
                      <td className="p-2 border-r border-gray-200 text-center text-gray-700">1 Inch</td>
                      <td className="p-2 border-r border-gray-200 text-center text-gray-700">4 Inch</td>
                      <td className="p-2 border-r border-gray-200 text-center text-gray-700">12 Feet</td>
                      <td className="p-2 border-r border-gray-200 text-center text-gray-700">2</td>
                      <td className="p-2 border-r border-gray-200 text-center text-gray-700">24</td>
                      <td className="p-2 text-center text-gray-700">1255</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="p-2 border-r border-gray-200 align-middle text-center text-gray-600">01</td>
                      <td className="p-2 border-r border-gray-200 align-middle text-center text-gray-600">P-09977</td>
                      <td className="p-2 border-r border-gray-200 align-middle text-center text-gray-600">Flex Sign Board</td>
                      <td className="p-2 border-r border-gray-200 align-middle text-center text-gray-600">Product Description</td>
                      <td className="bg-blue-600 text-white font-semibold p-2 border-r border-blue-500 text-center">Letters</td>
                      <td className="bg-blue-600 text-white font-semibold p-2 border-r border-blue-500 text-center">Thickness (MM)</td>
                      <td className="bg-blue-600 text-white font-semibold p-2 border-r border-blue-500 text-center">Length (Inch)</td>
                      <td colSpan="2" className="bg-blue-600 text-white font-semibold p-2 border-r border-blue-500 text-center">Height (Inch)</td>
                      <td className="bg-blue-600 text-white font-semibold p-2 border-r border-blue-500 text-center">Quantity</td>
                      <td className="bg-blue-600 text-white font-semibold p-2 border-r border-blue-500 text-center">Rate (Inch)</td>
                      <td className="bg-blue-600 text-white font-semibold p-2 text-center">Amount (Rs)</td>
                    </tr>
                    {[1, 2, 3].map((_, idx) => (
                      <tr key={idx} className="border-b border-gray-200">
                        <td className="p-2 border-r border-gray-200 text-center"></td>
                        <td className="p-2 border-r border-gray-200 text-center"></td>
                        <td className="p-2 border-r border-gray-200 text-center"></td>
                        <td className="p-2 border-r border-gray-200 text-center"></td>
                        <td className="p-2 border-r border-gray-200 text-center text-gray-700">A,B,C</td>
                        <td className="p-2 border-r border-gray-200 text-center text-gray-700">12 MM</td>
                        <td className="p-2 border-r border-gray-200 text-center text-gray-700">4 Inch</td>
                        <td colSpan="2" className="p-2 border-r border-gray-200 text-center text-gray-700">4 Inch</td>
                        <td className="p-2 border-r border-gray-200 text-center text-gray-700">2</td>
                        <td className="p-2 border-r border-gray-200 text-center text-gray-700">12</td>
                        <td className="p-2 text-center text-gray-700">200</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table 4: Additional Products */}
            <div>
              <h5 className="font-bold text-xs text-gray-500 uppercase mb-2">
                Additional Products
              </h5>
              <h6 className="font-bold text-[10px] text-gray-400 uppercase mb-1">
                Only Board Products
              </h6>
              <ProductTable
                headers={['S. No', 'Product Code', 'Product Name', 'Product Description', 'Thickness (MM)', 'Length (Inch)', 'Height (Inch)', 'Size (Sq. Feet)', 'Quantity', 'Rate', 'Amount (Rs)']}
                rows={[
                  ['01', 'P-09977', 'Flex Sign Board', 'Product Description', '12 MM', '4 Inch', '4 Inch', '4 Sq. Feet', '2', '12', '208'],
                  ['02', 'P-09977', 'Abc Sign Board', 'Product Description', '12 MM', '4 Inch', '4 Inch', '4 Sq. Feet', '2', '12', '208'],
                  ['03', 'P-09977', 'Xyz Sign Board', 'Product Description', '12 MM', '4 Inch', '4 Inch', '4 Sq. Feet', '2', '12', '208'],
                ]}
              />
            </div>

            {/* Additional Work Section */}
            <div className="flex justify-between mt-4">
              <div className="w-1/2">
                <h5 className="font-bold text-xs text-gray-500 uppercase">
                  Additional Work
                </h5>
              </div>
              <div className="w-1/3">
                <table className="w-full text-[10px] border border-gray-300">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="py-2 px-2 text-left">S. No</th>
                      <th className="py-2 px-2 text-left">Work</th>
                      <th className="py-2 px-2 text-right">Charge (Rs)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-2">01</td>
                      <td className="py-2 px-2">Installation</td>
                      <td className="py-2 px-2 text-right font-bold">1200</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-2">02</td>
                      <td className="py-2 px-2">Fabrication</td>
                      <td className="py-2 px-2 text-right font-bold">1200</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* --- FOOTER TOTALS & BANK --- */}
          <div className="flex justify-between mt-12 border-t border-gray-200 pt-6">
            <div className="w-1/2 text-[10px]">
              <h5 className="font-bold text-sm mb-3 text-gray-800">Bank Details</h5>
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
                  <span className="font-bold block mb-2 text-gray-800">Pay Using UPI</span>
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
                <h5 className="font-bold mb-2 text-gray-800">Terms & Conditions:</h5>
                <ol className="list-decimal list-inside text-gray-600 space-y-1">
                  <li>Payments will be made in favor of Digital Signage Solution Pvt. Ltd.</li>
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

          {/* --- SIGNATURES --- */}
          <div className="flex justify-between mt-16 pt-8">
            <div className="flex flex-col items-end">
              <div className="text-center">
                 <div className="font-serif text-3xl italic mb-1 text-slate-800">dss</div>
                 <div className="w-64 border-t border-slate-300 pt-2">
                    <p className="text-sm font-bold uppercase">Authorized Signatory</p>
                    <p className="text-xs text-slate-500">Date: 24 Dec 2025</p>
                 </div>
              </div>
            </div>

            <div className="text-center mt-6">
              <div className="border-t border-gray-400 w-48"></div>
              <div className="flex justify-between text-[10px] font-bold mt-2 text-gray-700">
                <span>Client Acceptance</span>
                <span className="font-normal text-gray-500">Date:</span>
              </div>
              <div className="text-[10px] text-left text-gray-500 mt-1">Authorized Signatory</div>
            </div>
          </div>

        </div>
      </div>

      {/* =========================================================================
          2. BOTTOM ACTION BAR (Normal Flow)
          "Send to Sales" (Orange) and "Send to Manager" (Blue)
      ========================================================================== */}
      <div className="max-w-[1400px] mx-auto mb-8 bg-white border border-gray-200 p-4 shadow-sm rounded-md flex justify-end gap-4 print:hidden">
         <button className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold text-sm rounded shadow-sm transition-colors">
            Send to Sales
         </button>
         <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded shadow-sm transition-colors">
            Send to Manager
         </button>
      </div>

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
              <th key={i} className="py-2 px-2 text-center font-semibold border-r border-blue-500 last:border-r-0 whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="py-2 px-2 text-center border-r border-gray-200 last:border-r-0 whitespace-nowrap text-gray-700">
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

export default QuotationFormPage;