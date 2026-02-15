import React, { useRef, useState, useEffect, useCallback } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { FileText, Download, Send, Save, Printer } from "lucide-react";
import { useGetProjectsByIdQuery } from "@/api/sales/client.api";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

const QuotationPreview = ({ data }) => {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <div className="text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Fill in the form to preview quotation</p>
        </div>
      </div>
    );
  }

  const products = data.products || [];
  const totalAmount = data.totalAmount || 0;
  const discountAmount = data.discountAmount || 0;
  const netAmount = data.netAmount || 0;

  return (
    <div
      id="print-content"
      className="relative p-6 py-8 font-sans text-sm bg-white overflow-hidden"
      style={{
        width: "210mm",
        minHeight: "297mm",
      }}
    >
      {/* Watermark */}
      <div
        className="absolute inset-0 italic flex items-center justify-center pointer-events-none select-none"
        style={{
          transform: "rotate(-30deg)",
          opacity: 0.03,
          fontSize: "3rem",
          fontWeight: "bold",
          color: "#000",
          whiteSpace: "nowrap",
          textAlign: "center",
          zIndex: 0.1,
        }}
      >
        3S DIGITAL SIGNAGE SOLUTIONS
      </div>

      {/* Letterhead */}
      <div className="border-b-2 border-orange-600 pb-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              3S Digital Signage Solutions
            </h1>
            <p className="text-xs text-gray-600 mt-1">
              Phone: +91 9876543210 | Email: info@dsscrm.com
            </p>
            <p className="text-xs text-gray-600">Website: www.dsscrm.com</p>
          </div>
          <div className="text-right">
            <div className="bg-orange-600 text-white px-4 py-2 rounded">
              <p className="text-bse font-semibold">QUOTATION</p>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Date: {new Date().toLocaleDateString("en-IN")}
            </p>
          </div>
        </div>
      </div>

      {/* Client & Project Info */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="text-xs font-bold text-orange-600 mb-2 uppercase">
            Quotation To
          </h3>
          <p className="font-bold text-gray-900">{data.client?.name}</p>
          <p className="text-xs text-gray-700">{data.client?.company}</p>
          <p className="text-xs text-gray-600 mt-1">
            Contact: {data.client?.contact}
          </p>
          <p className="text-xs text-gray-600 mt-1">{data.client?.address}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded">
          <h3 className="text-xs font-bold text-orange-600 mb-2 uppercase">
            Project Details
          </h3>
          <p className="font-bold text-gray-900">{data.project?.title}</p>
          <p className="text-xs text-gray-700">Code: {data.project?.code}</p>
          <p className="text-xs text-gray-600 mt-1">
            {data.project?.description}
          </p>
        </div>
      </div>

      {/* Products Table */}
      <table className="w-full text-xs border-collapse mb-6">
        <thead>
          <tr className="bg-orange-600 text-white">
            <th className="border border-orange-700 p-2 text-left">S.No</th>
            <th className="border border-orange-700 p-2 text-left">
              Product Description
            </th>
            <th className="border border-orange-700 p-2 text-right">
              Rate (₹)
            </th>
            <th className="border border-orange-700 p-2 text-center">Qty</th>
            <th className="border border-orange-700 p-2 text-right">
              Amount (₹)
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => {
            const qty = Number(p.qty) || 0;
            const price = Number(p.basePrice) || 0;
            const total = qty * price;

            return (
              <tr key={i} className="border-b">
                <td className="border border-gray-300 p-2 text-center">
                  {i + 1}
                </td>
                <td className="border border-gray-300 p-2">{p.name}</td>
                <td className="border border-gray-300 p-2 text-right">
                  {price.toLocaleString("en-IN")}
                </td>
                <td className="border border-gray-300 p-2 text-center">
                  {qty}
                </td>
                <td className="border border-gray-300 p-2 text-right font-medium">
                  {total.toLocaleString("en-IN")}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-between mb-6">
        <div className="text-left ml-1 mt-2">
          <p className="text-xs font-bold text-gray-900 mb-8">
            Authorized Signature
          </p>
          <div className="border-t border-gray-400 inline-block w-48 pt-1">
            <p className="text-xs text-gray-600">DSS CRM System</p>
          </div>
        </div>
        <div className="w-64">
          <div className="flex justify-between py-2 border-b">
            <span className="text-xs font-medium">Subtotal:</span>
            <span className="text-xs font-bold">
              ₹{totalAmount.toLocaleString("en-IN")}
            </span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between py-2 border-b text-red-600">
              <span className="text-xs font-medium">Discount:</span>
              <span className="text-xs font-bold">
                - ₹{discountAmount.toLocaleString("en-IN")}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center py-2 bg-orange-600 text-white px-3 rounded mt-2">
            <span className="text-sm font-bold">Net Amount:</span>
            <span className="text-lg font-bold">
              ₹{netAmount.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* Remarks */}
      {data.remark && (
        <div className="bg-gray-50 p-4 rounded mb-6">
          <h3 className="text-xs font-bold text-gray-900 mb-2">
            Remarks / Terms & Conditions:
          </h3>
          <p className="text-xs text-gray-700 whitespace-pre-wrap">
            {data.remark}
          </p>
        </div>
      )}

      {/* Terms & Conditions Footer */}
      <footer className="mt-10 pt-4 border-gray-300">
        <div className="bg-orange-100 border border-orange-100 p-2 mb-3">
          <p className="text-xs font-bold text-gray-900">Note: 18% GST EXTRA</p>
        </div>

        <div className="text-xs space-y-1.5">
          <h4 className="font-bold text-gray-900 underline mb-2">
            Terms & Condition:
          </h4>
          <p>
            <span className="font-semibold">1)</span> Payment will be made in
            favour of <strong>3s DIGITAL SIGNAGE SOLUTION PVT.LTD.</strong>
          </p>
          <p>
            <span className="font-semibold">2)</span> 50% Payment required with
            confirmation
          </p>
          <p>
            <span className="font-semibold">3)</span> If we share the cdr file
            with you then the designing charge paid by you will not be deducted
            from the total amount of the product.
          </p>
          <p>
            <span className="font-semibold">4)</span> 50% Post Production or
            before Installation
          </p>
          <p className="bg-gray-100 p-1.5 border-l-4 border-orange-600 font-semibold">
            <span className="font-bold">5)</span> 50% Folding Work By The Client
            Side
          </p>
        </div>

        <div className="mt-4 pt-3 border-t text-center text-xs text-gray-400">
          Generated by DSS CRM System | © 3S Digital Signage Solutions Pvt. Ltd.
        </div>
      </footer>
    </div>
  );
};
export default QuotationPreview;