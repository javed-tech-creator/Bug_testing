
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import puppeteer from "puppeteer";

export const generateQuotationPDF = async (quotationData, clientData) => {
    console.log(")))))))))))))))))))",quotationData,"((((((((((((((((((");
    console.log(")))))))))))))))))))clientData ",clientData,"((((((((((((((((((");
    
  const {
    number,
    items,
    subTotal,
    discount,
    taxes,
    shippingCharges,
    total,
    status,
    description,
    createdAt,
    notes,
    totalCGST,
    totalSGST,
    totalIGST,
    totalGSTPercent,
    totalTaxAmount,
    grandTotal,
  } = quotationData;
console.log(quotationData,"99999999999999999999999999999999");

  const formatCurrency = (amt) => `₹${Number(amt || 0).toLocaleString("en-IN")}`;

  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Quotation</title>
      <style>
          body { font-family: 'Segoe UI', Tahoma, sans-serif; margin: 0; padding: 0; color: #333; }
          .container { width: 210mm; margin: auto; padding: 20px 35px; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #28a745; padding-bottom: 10px; margin-bottom: 20px; }
          .logo { font-size: 28px; font-weight: bold; color: #28a745; }
          .title { font-size: 20px; font-weight: bold; color: #444; text-align: right; }
          .section-title { font-size: 14px; font-weight: bold; color: #28a745; margin-top: 15px; margin-bottom: 8px; border-bottom: 1px solid #ccc; padding-bottom: 4px; }
          .info { font-size: 13px; margin-bottom: 12px; }
          .info div { margin: 3px 0; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
          th { background: #f5f7fa; font-weight: 600; }
          td { font-size: 13px; }
          .summary { width: 380px; margin-left: auto; font-size: 13px; }
          .summary-row { display: flex; justify-content: space-between; padding: 4px 0; }
          .summary-row span:first-child { color: #555; }
          .total { font-weight: bold; font-size: 1.1em; border-top: 2px solid #28a745; margin-top: 8px; padding-top: 8px; color: #28a745; }
          .footer { text-align: center; font-size: 11px; color: #888; margin-top: 30px; border-top: 1px dashed #ccc; padding-top: 10px; }
      </style>
  </head>
  <body>
      <div class="container">
          <!-- Header -->
          <div class="header">
              <div class="logo">DSS</div>
              <div class="title">QUOTATION</div>
          </div>

          <!-- Client Info -->
          <div class="section-title">Client Information</div>
          <div class="info">
              <div><strong>Name:</strong> ${clientData?.name || "N/A"}</div>
              <div><strong>Email:</strong> ${clientData?.email || "N/A"}</div>
              <div><strong>Phone:</strong> ${clientData?.phone || "N/A"}</div>
              <div><strong>GSTIN:</strong> ${clientData?.gstin || "N/A"}</div>
          </div>

          <!-- Quotation Info -->
          <div class="section-title">Quotation Details</div>
          <div class="info">
              <div><strong>No:</strong> ${number}</div>
              <div><strong>Status:</strong> ${status}</div>
              <div><strong>Date:</strong> ${new Date(createdAt).toLocaleDateString("en-IN")}</div>
          </div>

          <!-- Items Table -->
          <table>
              <thead>
                  <tr>
                      <th>Sr.</th>
                      <th>Description</th>
                      <th>Qty</th>
                      <th>Rate</th>
                      <th>Discount</th>
                      <th>CGST%</th>
                      <th>SGST%</th>
                      <th>IGST%</th>
                      <th>Line Total</th>
                  </tr>
              </thead>
              <tbody>
                  ${items.map((it, i) => `
                      <tr>
                          <td>${i + 1}</td>
                          <td style="text-align:left;">${it.description || "-"}</td>
                          <td>${it.qty}</td>
                          <td>${formatCurrency(it.rate)}</td>
                          <td>${formatCurrency(it.discount)}</td>
                          <td>${it.taxRates.cgst || 0}%</td>
                          <td>${it.taxRates.sgst || 0}%</td>
                          <td>${it.taxRates.igst || 0}%</td>
                          <td>${formatCurrency((it.qty * it.rate) - it.discount)}</td>
                      </tr>
                  `).join("")}
              </tbody>
          </table>

          <!-- Summary -->
          <div class="summary">
              <div class="summary-row"><span>Subtotal:</span><span>${formatCurrency(subTotal)}</span></div>
              <div class="summary-row"><span>Discount:</span><span>${formatCurrency(discount)}</span></div>
              <div class="summary-row"><span>CGST:</span><span>${formatCurrency(totalCGST)}</span></div>
              <div class="summary-row"><span>SGST:</span><span>${formatCurrency(totalSGST)}</span></div>
              <div class="summary-row"><span>IGST:</span><span>${formatCurrency(totalIGST)}</span></div>
              <div class="summary-row"><span>Total GST %:</span><span>${totalGSTPercent}%</span></div>
              <div class="summary-row"><span>Total Tax Amount:</span><span>${formatCurrency(totalTaxAmount)}</span></div>
              <div class="summary-row"><span>Shipping:</span><span>${formatCurrency(shippingCharges)}</span></div>
              <div class="summary-row total"><span>Grand Total:</span><span>${formatCurrency(grandTotal)}</span></div>
              <div class="summary-row"><span>Notes:</span><span>${notes || "-"}</span></div>
          </div>

          <!-- Footer -->
          <div class="footer">
              This is a computer-generated quotation and does not require a signature.<br>
              Thank you for your business!
          </div>
      </div>
  </body>
  </html>
  `;

  // Create tmp folder if not exists
  const tmpDir = path.join(process.cwd(), "tmp");
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

  const filename = path.join(tmpDir, `quotation-${uuidv4()}.pdf`);

  const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  await page.pdf({ path: filename, format: "A4", printBackground: true });
  await browser.close();

  return filename;
};
