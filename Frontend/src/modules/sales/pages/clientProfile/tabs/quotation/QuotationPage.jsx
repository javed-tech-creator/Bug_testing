import React, { useRef, useState, useEffect, useCallback } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { FileText, Send, Save, Printer, ChevronLeft } from "lucide-react";
import {
  useAddQuotationMutation,
  useGetProjectsByIdQuery,
  useGetQuotationByIdQuery,
  useSendQuotationToClientMutation,
  useUpdateQuotationMutation,
} from "@/api/sales/client.api";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";
import ErrorBoundary from "@/components/ErrorBoundary";

const QuotationPage = () => {
  const { projectId } = useParams();
  const { quotationId } = useParams();
  const [formData, setFormData] = useState(null);
  const [zoom, setZoom] = useState(1);
  const previewRef = useRef();
  const containerRef = useRef();
  const formContainerRef = useRef();
  const navigate = useNavigate();

  const { data: projectData, isLoading: isProjectLoading } =
    useGetProjectsByIdQuery({ id: projectId }, { skip: !projectId });

  const {
    data: quotationData,
    isLoading: isQuotationLoading,
    refetch: refetchQuotation,
    isError
  } = useGetQuotationByIdQuery({ id: quotationId }, { skip: !quotationId });

  useEffect(() => {
    if (quotationId) refetchQuotation();
  }, [quotationId]);

  const handleFormUpdate = useCallback((data) => {
    setFormData(data);
  }, []);

  const [saveQuotation, { isLoading: isSavingQuotation }] =
    useAddQuotationMutation();
  const [sendQuotation, { isLoading: isSendingQuotation }] =
    useSendQuotationToClientMutation();
  const [updateQuotation, { isLoading: isUpdatingQuotation }] =
    useUpdateQuotationMutation();

  const handleSaveQuotation = async () => {
    if (!formData) return;

    try {
      const payload = {
        projectId,
        clientId: projectData?.data?.clientId?._id,
        ...formData,
      };

      // Update if quotationId exists
      if (quotationId) {
        await updateQuotation({ id: quotationId, formData: payload }).unwrap();
        toast.success("Quotation updated successfully");
        navigate(
          `/sales/project/${projectData?.data?._id}/quotation/${quotationId}`
        );
        refetchQuotation();
      }

      // Create if no quotationId
      else {
        const res = await saveQuotation({ formData: payload }).unwrap();
        toast.success("Quotation saved successfully");
        navigate(
          `/sales/project/${projectData?.data?._id}/quotation/${res?.data?._id}`
        );
      }
    } catch (err) {
      console.error("Save/Update error:", err.message || err);
      toast.error(err?.data?.message || "Failed to save/update quotation");
    }
  };

  const quotationHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Quotation - ${formData?.project?.title || ""}</title>
        <style>
          /* Reset and Base Styles */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
  font-family: Arial, sans-serif;
  background: #f3f4f6;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: center;
}

.quotation-container {
  width: 210mm;
  min-height: 297mm;
  background: white;
  padding: 10mm;      /* optimal for PDF */
  margin: 0;
  box-shadow: none;
  overflow: hidden;
}

          
          /* Watermark */
          .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-30deg);
            font-size: 3rem;
            font-weight: bold;
            color: #000000;
            opacity: 0.03;
            white-space: nowrap;
            z-index: 0;
            pointer-events: none;
            user-select: none;
          }
          
          /* Letterhead */
          .letterhead {
            border-bottom: 2px solid #dc2626;
            padding-bottom: 1rem;
            margin-bottom: 1.5rem;
            position: relative;
            z-index: 1;
          }
          
          .company-name {
            font-size: 1.875rem;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 0.25rem;
          }
          
          .quotation-badge {
            background: #dc2626;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 0.25rem;
            display: inline-block;
            font-weight: 600;
          }
          
          /* Client & Project Info */
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
            margin-bottom: 1.5rem;
          }
          
          .info-box {
            background: #f9fafb;
            padding: 1rem;
            border-radius: 0.375rem;
          }
          
          .section-title {
            font-size: 0.75rem;
            font-weight: bold;
            color: #dc2626;
            text-transform: uppercase;
            margin-bottom: 0.5rem;
          }
          
          /* Table Styles */
          .product-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 1.5rem;
            font-size: 0.75rem;
          }
          
          .product-table th {
            background: #dc2626;
            color: white;
            border: 1px solid #b91c1c;
            padding: 0.5rem;
            text-align: left;
            font-weight: 600;
          }
          
          .product-table td {
            border: 1px solid #d1d5db;
            padding: 0.5rem;
          }
          
          .text-right {
            text-align: right;
          }
          
          .text-center {
            text-align: center;
          }
          
          /* Pricing Summary */
          .pricing-summary {
            width: 16rem;
            margin-left: auto;
          }
          
          .price-row {
            display: flex;
            justify-content: space-between;
            padding: 0.5rem 0;
            border-bottom: 1px solid #e5e7eb;
          }
          
          .net-amount {
            background: #dc2626;
            color: white;
            padding: 0.75rem;
            border-radius: 0.375rem;
            margin-top: 0.5rem;
            font-weight: bold;
          }
          
          /* Signature */
          .signature {
            margin-top: 3rem;
          }
          
          .signature-line {
            border-top: 1px solid #9ca3af;
            width: 12rem;
            padding-top: 0.25rem;
          }
          
          /* Footer */
          .terms-box {
            background: #fef3c7;
            border: 1px solid #fef3c7;
            padding: 0.5rem;
            margin-bottom: 0.75rem;
          }
          
          .terms-list {
            font-size: 0.75rem;
            line-height: 1.4;
          }
          
          .terms-list p {
            margin-bottom: 0.5rem;
          }
          
          .highlight-box {
            background: #f3f4f6;
            padding: 0.5rem;
            border-left: 4px solid #dc2626;
            font-weight: 600;
            margin: 0.5rem 0;
          }
          
          .footer-note {
            margin-top: 1rem;
            padding-top: 0.75rem;
            border-top: 1px solid #d1d5db;
            text-align: center;
            font-size: 0.75rem;
            color: #6b7280;
          }
          
          /* Print Specific Styles */
          @media print {
            body {
              background: white;
              padding: 0;
            }
            
            .quotation-container {
              box-shadow: none;
              padding: 10mm;
              margin: 0;
              width: 100%;
              min-height: 100vh;
              border:1px solid #1d0c05;
            }
            
            .no-print {
              display: none !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="quotation-container">
          <!-- Watermark -->
          <div class="watermark">3S DIGITAL SIGNAGE SOLUTIONS</div>
          
          <!-- Letterhead -->
          <div class="letterhead">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <h1 class="company-name">3S Digital Signage Solutions</h1>
                <p style="font-size: 0.75rem; color: #6b7280; margin-top: 0.25rem;">
                  Phone: +91 9876543210 | Email: info@dsscrm.com
                </p>
                <p style="font-size: 0.75rem; color: #6b7280;">Website: www.dsscrm.com</p>
              </div>
              <div style="text-align: right;">
                <div class="quotation-badge">QUOTATION</div>
                <p style="font-size: 0.75rem; color: #6b7280; margin-top: 0.5rem;">
                  Date: ${new Date().toLocaleDateString("en-IN")}
                </p>
              </div>
            </div>
          </div>
          
          <!-- Client & Project Info -->
          <div class="info-grid">
            <div class="info-box">
              <div class="section-title">Quotation To</div>
              <p style="font-weight: bold; color: #1f2937; margin-bottom: 0.25rem;">${
                formData?.client?.name || "N/A"
              }</p>
              <p style="font-size: 0.75rem; color: #374151;">${
                formData?.client?.company || "N/A"
              }</p>
              <p style="font-size: 0.75rem; color: #6b7280; margin-top: 0.5rem;">
                Contact: ${formData?.client?.contact || "N/A"}
              </p>
              <p style="font-size: 0.75rem; color: #6b7280;">${
                formData?.client?.address || "N/A"
              }</p>
            </div>
            
            <div class="info-box">
              <div class="section-title">Project Details</div>
              <p style="font-weight: bold; color: #1f2937; margin-bottom: 0.25rem;">${
                formData?.project?.title || "N/A"
              }</p>
              <p style="font-size: 0.75rem; color: #374151;">Code: ${
                formData?.project?.code || "N/A"
              }</p>
              <p style="font-size: 0.75rem; color: #6b7280; margin-top: 0.5rem;">
                ${formData?.project?.description || "N/A"}
              </p>
            </div>
          </div>
          
          <!-- Products Table -->
          <table class="product-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Product Description</th>
                <th class="text-right">Rate (₹)</th>
                <th class="text-center">Qty</th>
                <th class="text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${
                formData?.products
                  ?.map((p, i) => {
                    const qty = Number(p.qty) || 0;
                    const price = Number(p.basePrice) || 0;
                    const total = qty * price;

                    return `
                  <tr>
                    <td class="text-center">${i + 1}</td>
                    <td>${p.name || "Product"}</td>
                    <td class="text-right">${price.toLocaleString("en-IN")}</td>
                    <td class="text-center">${qty}</td>
                    <td class="text-right" style="font-weight: 600;">${total.toLocaleString(
                      "en-IN"
                    )}</td>
                  </tr>
                `;
                  })
                  .join("") || ""
              }
            </tbody>
          </table>
          
          <!-- Totals and Signature -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem;">
            <div class="signature">
              <p style="font-size: 0.75rem; font-weight: bold; color: #1f2937; margin-bottom: 2rem;">
                Authorized Signature
              </p>
              <div class="signature-line">
                <p style="font-size: 0.75rem; color: #6b7280;">DSS CRM System</p>
              </div>
            </div>
            
            <div class="pricing-summary">
              <div class="price-row">
                <span style="font-size: 0.75rem; font-weight: 500;">Subtotal:</span>
                <span style="font-size: 0.75rem; font-weight: bold;">₹${(
                  formData?.totalAmount || 0
                ).toLocaleString("en-IN")}</span>
              </div>
              ${
                formData?.discountAmount > 0
                  ? `
                <div class="price-row" style="color: #dc2626;">
                  <span style="font-size: 0.75rem; font-weight: 500;">Discount:</span>
                  <span style="font-size: 0.75rem; font-weight: bold;">- ₹${(
                    formData?.discountAmount || 0
                  ).toLocaleString("en-IN")}</span>
                </div>
              `
                  : ""
              }
              <div class="net-amount">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 0.875rem;">Net Amount:</span>
                  <span style="font-size: 1.125rem;">₹${(
                    formData?.netAmount || 0
                  ).toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Remarks -->
          ${
            formData?.remark
              ? `
            <div class="info-box" style="margin-bottom: 1.5rem;">
              <div class="section-title">Remarks / Terms & Conditions:</div>
              <p style="font-size: 0.75rem; color: #374151; white-space: pre-wrap;">${formData?.remark}</p>
            </div>
          `
              : ""
          }
          
          <!-- Footer Terms -->
          <footer>
            <div class="terms-box">
              <p style="font-size: 0.75rem; font-weight: bold; color: #1f2937;">Note: 18% GST EXTRA</p>
            </div>
            
            <div class="terms-list">
              <h4 style="font-size: 0.75rem; font-weight: bold; color: #1f2937; text-decoration: underline; margin-bottom: 0.5rem;">
                Terms & Condition:
              </h4>
              <p><span style="font-weight: 600;">1)</span> Payment will be made in favour of <strong>3S DIGITAL SIGNAGE SOLUTION PVT.LTD.</strong></p>
              <p><span style="font-weight: 600;">2)</span> 50% Payment required with confirmation</p>
              <p><span style="font-weight: 600;">3)</span> If we share the cdr file with you then the designing charge paid by you will not be deducted from the total amount of the product.</p>
              <p><span style="font-weight: 600;">4)</span> 50% Post Production or before Installation</p>
              <div class="highlight-box">
                <span style="font-weight: 600;">5)</span> 50% Folding Work By The Client Side
              </div>
            </div>
            
            <div class="footer-note">
              Generated by DSS CRM System | © 3S Digital Signage Solutions Pvt. Ltd.
            </div>
          </footer>
        </div>
      </body>
    </html>
  `;

  const handleSendToClient = async () => {
    if (!formData) {
      alert("Quotation data missing");
      return;
    }

    if (!quotationId) {
      alert("Please save the quotation first");
      return;
    }

    try {
      console.log();
      const formData = { html: quotationHtml };
      console.log(formData);
      const res = await sendQuotation({ id: quotationId, formData }).unwrap();

      toast.success("Quotation sent successfully to client");
    } catch (err) {
      console.error("Send quotation error:", err);
      toast.error("Failed to send quotation");
    }
  };

  const handlePrint = () => {
    if (!formData) return;

    const printWindow = window.open("", "_blank", "width=1000,height=800");

    //   const printHtml = `
    //   <!DOCTYPE html>
    //   <html>
    //     <head>
    //       <title>Quotation - ${formData?.project?.title || ""}</title>
    //       <style>
    //         /* Reset and Base Styles */
    //         * {
    //           margin: 0;
    //           padding: 0;
    //           box-sizing: border-box;
    //         }

    //         body {
    //           font-family: Arial, sans-serif;
    //           background: #f3f4f6;
    //           padding: 20px;
    //           display: flex;
    //           justify-content: center;
    //           align-items: center;
    //           min-height: 100vh;
    //         }

    //         .quotation-container {
    //           width: 210mm;
    //           min-height: 297mm;
    //           background: white;
    //           padding: 25mm;
    //           margin: 0 auto;
    //           box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    //           position: relative;
    //           overflow: hidden;
    //         }

    //         /* Watermark */
    //         .watermark {
    //           position: absolute;
    //           top: 50%;
    //           left: 50%;
    //           transform: translate(-50%, -50%) rotate(-30deg);
    //           font-size: 4rem;
    //           font-weight: bold;
    //           color: #000000;
    //           opacity: 0.03;
    //           white-space: nowrap;
    //           z-index: 0;
    //           pointer-events: none;
    //           user-select: none;
    //         }

    //         /* Letterhead */
    //         .letterhead {
    //           border-bottom: 2px solid #dc2626;
    //           padding-bottom: 1rem;
    //           margin-bottom: 1.5rem;
    //           position: relative;
    //           z-index: 1;
    //         }

    //         .company-name {
    //           font-size: 1.875rem;
    //           font-weight: bold;
    //           color: #1f2937;
    //           margin-bottom: 0.25rem;
    //         }

    //         .quotation-badge {
    //           background: #dc2626;
    //           color: white;
    //           padding: 0.5rem 1rem;
    //           border-radius: 0.25rem;
    //           display: inline-block;
    //           font-weight: 600;
    //         }

    //         /* Client & Project Info */
    //         .info-grid {
    //           display: grid;
    //           grid-template-columns: 1fr 1fr;
    //           gap: 1.5rem;
    //           margin-bottom: 1.5rem;
    //         }

    //         .info-box {
    //           background: #f9fafb;
    //           padding: 1rem;
    //           border-radius: 0.375rem;
    //         }

    //         .section-title {
    //           font-size: 0.75rem;
    //           font-weight: bold;
    //           color: #dc2626;
    //           text-transform: uppercase;
    //           margin-bottom: 0.5rem;
    //         }

    //         /* Table Styles */
    //         .product-table {
    //           width: 100%;
    //           border-collapse: collapse;
    //           margin-bottom: 1.5rem;
    //           font-size: 0.75rem;
    //         }

    //         .product-table th {
    //           background: #dc2626;
    //           color: white;
    //           border: 1px solid #b91c1c;
    //           padding: 0.5rem;
    //           text-align: left;
    //           font-weight: 600;
    //         }

    //         .product-table td {
    //           border: 1px solid #d1d5db;
    //           padding: 0.5rem;
    //         }

    //         .text-right {
    //           text-align: right;
    //         }

    //         .text-center {
    //           text-align: center;
    //         }

    //         /* Pricing Summary */
    //         .pricing-summary {
    //           width: 16rem;
    //           margin-left: auto;
    //         }

    //         .price-row {
    //           display: flex;
    //           justify-content: space-between;
    //           padding: 0.5rem 0;
    //           border-bottom: 1px solid #e5e7eb;
    //         }

    //         .net-amount {
    //           background: #dc2626;
    //           color: white;
    //           padding: 0.75rem;
    //           border-radius: 0.375rem;
    //           margin-top: 0.5rem;
    //           font-weight: bold;
    //         }

    //         /* Signature */
    //         .signature {
    //           margin-top: 3rem;
    //         }

    //         .signature-line {
    //           border-top: 1px solid #9ca3af;
    //           width: 12rem;
    //           padding-top: 0.25rem;
    //         }

    //         /* Footer */
    //         .terms-box {
    //           background: #fef3c7;
    //           border: 1px solid #fef3c7;
    //           padding: 0.5rem;
    //           margin-bottom: 0.75rem;
    //         }

    //         .terms-list {
    //           font-size: 0.75rem;
    //           line-height: 1.4;
    //         }

    //         .terms-list p {
    //           margin-bottom: 0.5rem;
    //         }

    //         .highlight-box {
    //           background: #f3f4f6;
    //           padding: 0.5rem;
    //           border-left: 4px solid #dc2626;
    //           font-weight: 600;
    //           margin: 0.5rem 0;
    //         }

    //         .footer-note {
    //           margin-top: 1rem;
    //           padding-top: 0.75rem;
    //           border-top: 1px solid #d1d5db;
    //           text-align: center;
    //           font-size: 0.75rem;
    //           color: #6b7280;
    //         }

    //         /* Print Specific Styles */
    //         @media print {
    //           body {
    //             background: white;
    //             padding: 0;
    //           }

    //           .quotation-container {
    //             box-shadow: none;
    //             padding: 10mm;
    //             margin: 0;
    //             width: 100%;
    //             min-height: 100vh;
    //             border:1px solid #1d0c05;
    //           }

    //           .no-print {
    //             display: none !important;
    //           }
    //         }
    //       </style>
    //     </head>
    //     <body>
    //       <div class="quotation-container">
    //         <!-- Watermark -->
    //         <div class="watermark">3S DIGITAL SIGNAGE SOLUTIONS</div>

    //         <!-- Letterhead -->
    //         <div class="letterhead">
    //           <div style="display: flex; justify-content: space-between; align-items: flex-start;">
    //             <div>
    //               <h1 class="company-name">3S Digital Signage Solutions</h1>
    //               <p style="font-size: 0.75rem; color: #6b7280; margin-top: 0.25rem;">
    //                 Phone: +91 9876543210 | Email: info@dsscrm.com
    //               </p>
    //               <p style="font-size: 0.75rem; color: #6b7280;">Website: www.dsscrm.com</p>
    //             </div>
    //             <div style="text-align: right;">
    //               <div class="quotation-badge">QUOTATION</div>
    //               <p style="font-size: 0.75rem; color: #6b7280; margin-top: 0.5rem;">
    //                 Date: ${new Date().toLocaleDateString("en-IN")}
    //               </p>
    //             </div>
    //           </div>
    //         </div>

    //         <!-- Client & Project Info -->
    //         <div class="info-grid">
    //           <div class="info-box">
    //             <div class="section-title">Quotation To</div>
    //             <p style="font-weight: bold; color: #1f2937; margin-bottom: 0.25rem;">${
    //               formData.client?.name || "N/A"
    //             }</p>
    //             <p style="font-size: 0.75rem; color: #374151;">${
    //               formData.client?.company || "N/A"
    //             }</p>
    //             <p style="font-size: 0.75rem; color: #6b7280; margin-top: 0.5rem;">
    //               Contact: ${formData.client?.contact || "N/A"}
    //             </p>
    //             <p style="font-size: 0.75rem; color: #6b7280;">${
    //               formData.client?.address || "N/A"
    //             }</p>
    //           </div>

    //           <div class="info-box">
    //             <div class="section-title">Project Details</div>
    //             <p style="font-weight: bold; color: #1f2937; margin-bottom: 0.25rem;">${
    //               formData.project?.title || "N/A"
    //             }</p>
    //             <p style="font-size: 0.75rem; color: #374151;">Code: ${
    //               formData.project?.code || "N/A"
    //             }</p>
    //             <p style="font-size: 0.75rem; color: #6b7280; margin-top: 0.5rem;">
    //               ${formData.project?.description || "N/A"}
    //             </p>
    //           </div>
    //         </div>

    //         <!-- Products Table -->
    //         <table class="product-table">
    //           <thead>
    //             <tr>
    //               <th>S.No</th>
    //               <th>Product Description</th>
    //               <th class="text-right">Rate (₹)</th>
    //               <th class="text-center">Qty</th>
    //               <th class="text-right">Amount (₹)</th>
    //             </tr>
    //           </thead>
    //           <tbody>
    //             ${
    //               formData.products
    //                 ?.map((p, i) => {
    //                   const qty = Number(p.qty) || 0;
    //                   const price = Number(p.basePrice) || 0;
    //                   const total = qty * price;

    //                   return `
    //                 <tr>
    //                   <td class="text-center">${i + 1}</td>
    //                   <td>${p.name || "Product"}</td>
    //                   <td class="text-right">${price.toLocaleString("en-IN")}</td>
    //                   <td class="text-center">${qty}</td>
    //                   <td class="text-right" style="font-weight: 600;">${total.toLocaleString(
    //                     "en-IN"
    //                   )}</td>
    //                 </tr>
    //               `;
    //                 })
    //                 .join("") || ""
    //             }
    //           </tbody>
    //         </table>

    //         <!-- Totals and Signature -->
    //         <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem;">
    //           <div class="signature">
    //             <p style="font-size: 0.75rem; font-weight: bold; color: #1f2937; margin-bottom: 2rem;">
    //               Authorized Signature
    //             </p>
    //             <div class="signature-line">
    //               <p style="font-size: 0.75rem; color: #6b7280;">DSS CRM System</p>
    //             </div>
    //           </div>

    //           <div class="pricing-summary">
    //             <div class="price-row">
    //               <span style="font-size: 0.75rem; font-weight: 500;">Subtotal:</span>
    //               <span style="font-size: 0.75rem; font-weight: bold;">₹${(
    //                 formData.totalAmount || 0
    //               ).toLocaleString("en-IN")}</span>
    //             </div>
    //             ${
    //               formData.discountAmount > 0
    //                 ? `
    //               <div class="price-row" style="color: #dc2626;">
    //                 <span style="font-size: 0.75rem; font-weight: 500;">Discount:</span>
    //                 <span style="font-size: 0.75rem; font-weight: bold;">- ₹${(
    //                   formData.discountAmount || 0
    //                 ).toLocaleString("en-IN")}</span>
    //               </div>
    //             `
    //                 : ""
    //             }
    //             <div class="net-amount">
    //               <div style="display: flex; justify-content: space-between; align-items: center;">
    //                 <span style="font-size: 0.875rem;">Net Amount:</span>
    //                 <span style="font-size: 1.125rem;">₹${(
    //                   formData.netAmount || 0
    //                 ).toLocaleString("en-IN")}</span>
    //               </div>
    //             </div>
    //           </div>
    //         </div>

    //         <!-- Remarks -->
    //         ${
    //           formData.remark
    //             ? `
    //           <div class="info-box" style="margin-bottom: 1.5rem;">
    //             <div class="section-title">Remarks / Terms & Conditions:</div>
    //             <p style="font-size: 0.75rem; color: #374151; white-space: pre-wrap;">${formData.remark}</p>
    //           </div>
    //         `
    //             : ""
    //         }

    //         <!-- Footer Terms -->
    //         <footer>
    //           <div class="terms-box">
    //             <p style="font-size: 0.75rem; font-weight: bold; color: #1f2937;">Note: 18% GST EXTRA</p>
    //           </div>

    //           <div class="terms-list">
    //             <h4 style="font-size: 0.75rem; font-weight: bold; color: #1f2937; text-decoration: underline; margin-bottom: 0.5rem;">
    //               Terms & Condition:
    //             </h4>
    //             <p><span style="font-weight: 600;">1)</span> Payment will be made in favour of <strong>3S DIGITAL SIGNAGE SOLUTION PVT.LTD.</strong></p>
    //             <p><span style="font-weight: 600;">2)</span> 50% Payment required with confirmation</p>
    //             <p><span style="font-weight: 600;">3)</span> If we share the cdr file with you then the designing charge paid by you will not be deducted from the total amount of the product.</p>
    //             <p><span style="font-weight: 600;">4)</span> 50% Post Production or before Installation</p>
    //             <div class="highlight-box">
    //               <span style="font-weight: 600;">5)</span> 50% Folding Work By The Client Side
    //             </div>
    //           </div>

    //           <div class="footer-note">
    //             Generated by DSS CRM System | © 3S Digital Signage Solutions Pvt. Ltd.
    //           </div>
    //         </footer>
    //       </div>
    //     </body>
    //   </html>
    // `;

    printWindow.document.write(quotationHtml);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.onafterprint = () => {
          setTimeout(() => printWindow.close(), 100);
        };
      }, 500);
    };
  };

  useEffect(() => {
    if (!quotationId || !quotationData) return;

    const q = quotationData.data;

    const transformed = {
      client: {
        name: q.client?.name || "",
        company: q.client?.company || "",
        contact: q.client?.contact || "",
        email: q.client?.email || "",
        address: q.client?.address || "",
      },
      project: {
        title: q.project?.title || "",
        code: q.project?.code || "",
        description: q.project?.description || "",
      },
      products:
        q.products?.map((p, i) => ({
          id: p._id || i,
          name: p.name,
          unit: p.unit,
          qty: p.qty,
          basePrice: p.basePrice,
        })) || [],
      totalAmount: q.pricing?.totalAmount || 0,
      discountPercent: q.pricing?.discountPercent || 0,
      discountAmount: q.pricing?.discountAmount || 0,
      netAmount: q.pricing?.netAmount || 0,
      remark: q.remark || "",
    };

    setFormData(transformed);
  }, [quotationId, quotationData]);
  useEffect(() => {
    if (quotationId) return; // edit mode → skip project load
    if (!projectData?.data) return;

    const p = projectData.data;

    const transformed = {
      client: {
        name: p.clientId?.name || "",
        company: p.clientId?.companyName || "",
        contact: p.clientId?.phone || "",
        email: p.clientId?.email || "",
        address: p.clientId?.address || p.address || "",
      },
      project: {
        title: p.projectName || "",
        code: p.projectId || "",
        description: p.projectDescription || "",
      },
      products:
        p.products?.map((x, i) => ({
          id: x._id || i,
          name: x.productName || "",
          unit: "pcs",
          qty: x.quantity || 1,
          basePrice: Number(x.unitPrice || x.totalPrice || 0),
        })) || [],
      totalAmount: Number(p.totalAmount || 0),
      discountPercent: Number(p.discountPercent || 0),
      discountAmount: Number(p.discountAmount || 0),
      netAmount: Number(p.payableAmount || 0),
      remark: p.remarks || "",
    };

    setFormData(transformed);
  }, [projectData]);

  // Synchronized scroll for both containers
  useEffect(() => {
    const previewContainer = containerRef.current;
    const formContainer = formContainerRef.current;

    if (!previewContainer || !formContainer) return;

    const syncScroll = () => {
      const scrollPercentage =
        formContainer.scrollTop /
        (formContainer.scrollHeight - formContainer.clientHeight);

      const previewScrollTop =
        scrollPercentage *
        (previewContainer.scrollHeight - previewContainer.clientHeight);

      previewContainer.scrollTop = previewScrollTop;
    };

    formContainer.addEventListener("scroll", syncScroll);
    return () => formContainer.removeEventListener("scroll", syncScroll);
  }, []);

  // Mouse wheel zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        setZoom((prev) =>
          Math.min(2, Math.max(0.5, +(prev + delta).toFixed(2)))
        );
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  if (isProjectLoading || isQuotationLoading || !formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }
  if (!formData || isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        No Data Found
      </div>
    );
  }
  // console.log("Rendering QuotationPage with formData:", projectData);
  return (
    <>
      <div id="pdf-render" style={{ display: "none" }}></div>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b sticky -top-4 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-orange-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Quotation Generator
                  </h1>
                  <p className="text-sm text-gray-500">
                    {projectData?.data?.projectId || "DSS CRM System"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(-1, { replace: true })}
                  className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-neutral-400 text-white rounded-lg hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back To Projects
                </button>
                <button
                  onClick={handleSaveQuotation}
                  disabled={
                    !formData || isSavingQuotation || isUpdatingQuotation
                  }
                  className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Save className="w-4 h-4" />
                  {isSavingQuotation
                    ? "Saving..."
                    : isUpdatingQuotation
                    ? "Updating..."
                    : quotationId
                    ? "Update"
                    : "Save"}
                </button>
                <button
                  onClick={handleSendToClient}
                  disabled={!formData}
                  className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-4 h-4" />
                  {isSendingQuotation?"Sending..":"Send"}
                </button>

                <button
                  onClick={handlePrint}
                  disabled={!formData}
                  className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Printer className="w-4 h-4" />
                  Print
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ErrorBoundary>
            <QuotationForm
              onUpdate={handleFormUpdate}
              initialData={formData}
              formContainerRef={formContainerRef}
            />
          </ErrorBoundary>

          <div className="flex flex-col">
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700">
                    Zoom:
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-32"
                  />
                  <span className="text-sm font-medium text-gray-900">
                    {Math.round(zoom * 100)}%
                  </span>
                </div>
              </div>
            </div>

            <div
              ref={containerRef}
              className="overflow-auto border border-gray-200 bg-gray-100 rounded-lg"
              style={{ height: "calc(100vh - 240px)" }}
            >
              <div
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: "top left",
                  width: "210mm",
                  minHeight: "297mm",
                }}
              >
                <div
                  ref={previewRef}
                  style={{
                    width: "210mm",
                    minHeight: "297mm",
                    backgroundColor: "white",
                  }}
                >
                  <ErrorBoundary>
                    <QuotationPreview data={formData} />
                  </ErrorBoundary>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const QuotationForm = ({ onUpdate, initialData, formContainerRef }) => {
  const { register, control, watch, setValue } = useForm({
    defaultValues: initialData || {
      client: { name: "", company: "", contact: "", email: "", address: "" },
      project: { title: "", code: "", description: "" },
      products: [],
      totalAmount: 0,
      discountPercent: 0,
      discountAmount: 0,
      netAmount: 0,
      remark: "",
    },
  });

  const { fields } = useFieldArray({ control, name: "products" });
  const isInitialLoad = useRef(true);

  // Watch all form values
  const allFormValues = watch();

  // Watch calculation fields
  const products = watch("products");
  const discountPercent = watch("discountPercent");
  const discountAmount = watch("discountAmount");

  // Initial data set
  useEffect(() => {
    if (initialData && isInitialLoad.current) {
      Object.keys(initialData).forEach((key) => {
        setValue(key, initialData[key]);
      });
      isInitialLoad.current = false;
    }
  }, [initialData, setValue]);

  // Calculations
  useEffect(() => {
    if (isInitialLoad.current) return;

    const calculatedTotal = (products || []).reduce((sum, p) => {
      const qty = Number(p.qty) || 0;
      const price = Number(p.basePrice) || 0;
      return sum + qty * price;
    }, 0);

    let finalDiscount = 0;

    if (discountPercent > 0) {
      finalDiscount = (calculatedTotal * discountPercent) / 100;
    } else if (discountAmount > 0) {
      finalDiscount = Number(discountAmount);
    }

    const netAmt = calculatedTotal - finalDiscount;

    setValue("totalAmount", calculatedTotal, {
      shouldValidate: false,
      shouldDirty: false,
    });
    setValue("discountAmount", finalDiscount, {
      shouldValidate: false,
      shouldDirty: false,
    });
    setValue("netAmount", netAmt, {
      shouldValidate: false,
      shouldDirty: false,
    });
  }, [products, discountPercent, discountAmount, setValue]);

  // ✅ Preview update - onUpdate ab dependency me safe hai
  useEffect(() => {
    if (isInitialLoad.current) return;
    onUpdate(allFormValues);
  }, [allFormValues, onUpdate]); // ✅ Ab onUpdate memoized hai toh safe hai

  const handleDiscountPercentChange = (e) => {
    const percent = e.target.value === "" ? "" : Number(e.target.value);
    setValue("discountPercent", percent, { shouldValidate: false });
    setValue("discountAmount", 0, { shouldValidate: false });
  };

  const handleDiscountAmountChange = (e) => {
    const amount = e.target.value === "" ? "" : Number(e.target.value);
    setValue("discountAmount", amount, { shouldValidate: false });
    setValue("discountPercent", 0, { shouldValidate: false });
  };

  return (
    <div
      ref={formContainerRef}
      className="bg-white rounded-lg shadow-sm p-4 flex flex-col gap-2 overflow-auto"
    >
      {/* Client Details - Editable */}
      <div className="borde border-orange-600">
        <h3 className="font-semibold text-sm text-gray-900 mb-3">
          Client Details
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              {...register("client.name")}
              className="w-full px-3 py-2 text-sm border rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Company
            </label>
            <input
              type="text"
              {...register("client.company")}
              className="w-full px-3 py-2 text-sm border rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Contact
            </label>
            <input
              type="text"
              {...register("client.contact")}
              className="w-full px-3 py-2 text-sm border rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              {...register("client.email")}
              className="w-full px-3 py-2 text-sm border rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              {...register("client.address")}
              rows={1}
              className="w-full px-3 py-2 text-sm border rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Project Details - Editable */}
      <div className="borde border-orange-600">
        <h3 className="font-semibold text-sm text-gray-900 mb-3">
          Project Details
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Project Title
            </label>
            <input
              type="text"
              {...register("project.title")}
              className="w-full px-3 py-2 text-sm border rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Project ID
            </label>
            <input
              type="text"
              {...register("project.code")}
              className="w-full px-3 py-2 text-sm border rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register("project.description")}
              rows={2}
              className="w-full px-3 py-2 text-sm border rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="borde border-orange-600 ">
        <h3 className="font-semibold text-sm text-gray-900 mb-3">
          Products & Pricing
        </h3>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
                  Product
                </th>
                <th className="px-3 py-2 min-w-[100px] text-center text-xs font-semibold text-gray-700 w-24">
                  Price (₹)
                </th>
                <th className="px-3 min-w-[90px] py-2 text-center text-xs font-semibold text-gray-700 w-16">
                  Qty
                </th>
                <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700 w-28">
                  Total (₹)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {fields.map((item, i) => {
                const qty = Number(watch(`products.${i}.qty`)) || 0;
                const price = Number(watch(`products.${i}.basePrice`)) || 0;
                const total = qty * price;

                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-gray-900">{item.name}</td>

                    {/* Editable Price Field */}
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="0"
                        {...register(`products.${i}.basePrice`)}
                        className="w-full px-2 py-1 text-right text-sm border rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="0"
                        {...register(`products.${i}.qty`)}
                        className="w-full px-2 py-1 text-center text-sm border rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </td>

                    {/* Calculated Total */}
                    <td className="px-3 py-2 text-right font-medium text-gray-900">
                      ₹{total.toLocaleString("en-IN")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pricing Summary */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <h3 className="font-semibold text-sm text-gray-900 mb-2">
          Pricing Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Total Amount
            </label>
            <input
              type="number"
              {...register("totalAmount")}
              disabled
              className="w-full px-3 py-2 text-sm border rounded bg-white font-semibold text-gray-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Discount %
            </label>
            <input
              type="number"
              step="0.01"
              value={discountPercent || ""}
              onChange={handleDiscountPercentChange}
              placeholder="0"
              className="w-full px-3 py-2 text-sm border rounded focus:ring-2 focus:ring-orange-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Discount Amount
            </label>
            <input
              type="number"
              step="1"
              value={discountAmount || ""}
              onChange={handleDiscountAmountChange}
              placeholder="0"
              className="w-full px-3 py-2 text-sm border rounded focus:ring-2 focus:ring-orange-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Net Amount
            </label>
            <input
              type="number"
              {...register("netAmount")}
              disabled
              className="w-full px-3 py-2 text-sm border rounded bg-orange-600 text-white font-bold"
            />
          </div>
        </div>
      </div>

      {/* Remarks */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Remarks / Terms & Conditions
        </label>
        <textarea
          {...register("remark")}
          rows={2}
          placeholder="Enter any additional remarks, terms, or conditions..."
          className="w-full px-3 py-2 text-sm border rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
      </div>
    </div>
  );
};

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

export default QuotationPage;
