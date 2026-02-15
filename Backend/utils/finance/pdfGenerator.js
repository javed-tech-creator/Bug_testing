import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import puppeteer from "puppeteer";

export const generateInvoicePDF = async (invoiceData, clientData) => {
 
  console.log(invoiceData,"bwewhfgdsufgbsdhbbh");
  
    
    
  const {
    invoiceId,
    number,
    items,
    subTotal,
    totalNetAmountAfterDiscount,
    totalDiscount,
    totalTaxAmount,
    shippingCharges,
    grandTotal,
    amountPaid,
    partialPaid,
    paymentStatus,
    paymentMode,
    totalGSTPercent,
    issuedAt,
    notes,
    taxes = {},
    project = {},
    quotation = {}
  } = invoiceData;

  const formatCurrency = (amt) => `₹${Number(amt || 0).toLocaleString("en-IN")}`;

  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Invoice</title>
      <style>
          body { font-family: 'Segoe UI', Tahoma, sans-serif; margin: 0; padding: 0; color: #333; }
          .container { width: 210mm; margin: auto; padding: 20px 35px; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #0056b3; padding-bottom: 10px; margin-bottom: 20px; }
          .logo { font-size: 28px; font-weight: bold; color: #0056b3; }
          .title { font-size: 20px; font-weight: bold; color: #444; text-align: right; }
          .section-title { font-size: 14px; font-weight: bold; color: #0056b3; margin-top: 15px; margin-bottom: 8px; border-bottom: 1px solid #ccc; padding-bottom: 4px; }
          .info, .project, .quotation { font-size: 13px; margin-bottom: 12px; }
          .info div, .project div, .quotation div { margin: 3px 0; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
          th { background: #f5f7fa; font-weight: 600; }
          td { font-size: 13px; }
          .summary { width: 350px; margin-left: auto; font-size: 13px; }
          .summary-row { display: flex; justify-content: space-between; padding: 4px 0; }
          .summary-row span:first-child { color: #555; }
          .total { font-weight: bold; font-size: 1.1em; border-top: 2px solid #0056b3; margin-top: 8px; padding-top: 8px; color: #0056b3; }
          .footer { text-align: center; font-size: 11px; color: #888; margin-top: 30px; border-top: 1px dashed #ccc; padding-top: 10px; }
      </style>
  </head>
  <body>
      <div class="container">
          <!-- Header -->
          <div class="header">
              <div class="logo">DSS</div>
              <div class="title">TAX INVOICE</div>
          </div>

          <!-- Customer Info -->
          <div class="section-title">Customer Information</div>
          <div class="info">
              <div><strong>Name:</strong> ${clientData?.name || "N/A"}</div>
              <div><strong>Email:</strong> ${clientData?.email || "N/A"}</div>
              <div><strong>Phone:</strong> ${clientData?.phone || "N/A"}</div>
              <div><strong>GSTIN:</strong> ${clientData?.gstin || "N/A"}</div>
          </div>

          <!-- Project Info -->
          <div class="section-title">Project Information</div>
          <div class="project">
              <div><strong>Project Name:</strong> ${project?.name || "N/A"}</div>
              <div><strong>Description:</strong> ${project?.description || "N/A"}</div>
          </div>

          <!-- Quotation Info -->
          <div class="section-title">Quotation Details</div>
          <div class="quotation">
              <div><strong>Quotation No:</strong> ${quotation?.number || "N/A"}</div>
              <div><strong>Status:</strong> ${quotation?.status || "N/A"}</div>
              <div><strong>SubTotal:</strong> ${formatCurrency(quotation?.subTotal || 0)}</div>
              <div><strong>Shipping:</strong> ${formatCurrency(quotation?.shippingCharges || 0)}</div>
              <div><strong>Total:</strong> ${formatCurrency(quotation?.total || 0)}</div>
          </div>

          <!-- Invoice Info -->
          <div class="section-title">Invoice Details</div>
          <div class="info">
              <div><strong>Invoice ID:</strong> ${invoiceId}</div>
              <div><strong>Invoice No:</strong> ${number}</div>
              <div><strong>Issued At:</strong> ${issuedAt ? new Date(issuedAt).toLocaleDateString("en-IN") : "N/A"}</div>
          </div>

          <!-- Items Table -->
          <table>
              <thead>
                  <tr>
                      <th>Sr.</th>
                      <th>Item / Description</th>
                      <th>Rate</th>
                      <th>Qty</th>
                      <th>Net</th>
                      <th>Discount</th>
                      <th>After Discount</th>
                      <th>CGST %</th>
                      <th>SGST %</th>
                      <th>IGST %</th>
                      <th>Tax </th>
                      <th>GST %</th>
                      <th>Total</th>
                  </tr>
              </thead>
              <tbody>
                  ${items.map((it, i) => `
                      <tr>
                          <td>${i + 1}</td>
                          <td style="text-align:left;">${it.productName}</td>
                          <td>${formatCurrency(it.rateUnit)}</td>
                          <td>${it.quantity}</td>
                          <td>${formatCurrency(it.netAmount)}</td>
                          <td>${formatCurrency(it.discount)}</td>
                          <td>${formatCurrency(it.netAmountAfterDiscount)}</td>
                          <td>${it.taxRates.cgst || 0}%</td>
                          <td>${it.taxRates.sgst || 0}%</td>
                          <td>${it.taxRates.igst || 0}%</td>
                          <td>${it.taxPrice}</td>
                          <td>${totalGSTPercent || 0}%</td>
                          <td>${formatCurrency(it.priceWithTax)}</td>
                      </tr>
                  `).join("")}
              </tbody>
          </table>

          <!-- Summary -->
          <div class="summary">
              <div class="summary-row"><span>Subtotal:</span><span>${formatCurrency(subTotal)}</span></div>
              <div class="summary-row"><span>Total Discount:</span><span>${formatCurrency(totalDiscount)}</span></div>
              <div class="summary-row"><span>Net After Discount:</span><span>${formatCurrency(totalNetAmountAfterDiscount)}</span></div>
              <div class="summary-row"><span>CGST:</span><span>${formatCurrency(taxes.cgst || 0)}</span></div>
              <div class="summary-row"><span>SGST:</span><span>${formatCurrency(taxes.sgst || 0)}</span></div>
              <div class="summary-row"><span>IGST:</span><span>${formatCurrency(taxes.igst || 0)}</span></div>
              <div class="summary-row"><span>Total Tax:</span><span>${formatCurrency(totalTaxAmount)}</span></div>
              <div class="summary-row"><span>Shipping Charges:</span><span>${formatCurrency(shippingCharges)}</span></div>
              <div class="summary-row total"><span>Grand Total:</span><span>${formatCurrency(grandTotal)}</span></div>
              <div class="summary-row"><span>Amount Paid:</span><span>${formatCurrency(amountPaid)}</span></div>
              <div class="summary-row"><span>Partial Paid:</span><span>${formatCurrency(partialPaid)}</span></div>
              <div class="summary-row"><span>Payment Status:</span><span>${paymentStatus}</span></div>
              <div class="summary-row"><span>Payment Mode:</span><span>${paymentMode}</span></div>
              <div class="summary-row"><span>Notes:</span><span>${notes || "-"}</span></div>
          </div>

          <!-- Footer -->
          <div class="footer">
              This is a computer-generated invoice and does not require a signature.<br>
              Thank you for your business!
          </div>
      </div>
  </body>
  </html>
  `;

  // Create tmp folder if not exists
  const tmpDir = path.join(process.cwd(), "tmp");
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

  const filename = path.join(tmpDir, `invoice-${uuidv4()}.pdf`);

  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  await page.pdf({ path: filename, format: "A4", printBackground: true });
  await browser.close();

  return filename;
};
