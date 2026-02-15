
// generateInvoiceData.js
import fs from "fs";
import path from "path";
import QRCode from "qrcode";
import PDFDocument from "pdfkit";

/** ---------- Helpers ---------- **/

// INR formatter with grouping
const formatINR = (num = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(num || 0));

// Indian number to words (supports up to 999,99,99,999)
function numberToIndianWords(n) {
  n = Math.round(Number(n || 0));
  if (n === 0) return "Zero Rupees Only.";
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const twoDigits = (num) => {
    if (num < 20) return ones[num];
    const t = Math.floor(num / 10),
      o = num % 10;
    return tens[t] + (o ? "-" + ones[o] : "");
  };
  const threeDigits = (num) => {
    const h = Math.floor(num / 100),
      r = num % 100;
    return (
      (h ? ones[h] + " Hundred" + (r ? " And " : "") : "") +
      (r ? twoDigits(r) : "")
    );
  };

  // Split to Crores, Lakhs, Thousands, Hundreds
  const crore = Math.floor(n / 10000000);
  n = n % 10000000;
  const lakh = Math.floor(n / 100000);
  n = n % 100000;
  const thousand = Math.floor(n / 1000);
  n = n % 1000;
  const hundred = n;

  let out = "";
  if (crore) out += threeDigits(crore) + " Crore";
  if (lakh) out += (out ? ", " : "") + threeDigits(lakh) + " Lakh";
  if (thousand) out += (out ? ", " : "") + threeDigits(thousand) + " Thousand";
  if (hundred) out += (out ? ", " : "") + threeDigits(hundred);

  return `${out} Rupees Only.`;
}

// draw a thin line
const line = (doc, y, x1 = 40, x2 = 555) => {
  doc
    .moveTo(x1, y)
    .lineTo(x2, y)
    .strokeColor("#000000")
    .lineWidth(0.5)
    .stroke();
};

// safe text helper
const safeText = (doc, str = "", x, y, opt = {}) =>
  doc.text(str ?? "", x, y, opt);

/** ---------- Core PDF Generator ---------- **/
export async function generateInvoicePDF(invoiceData, res) {
  try {
    const doc = new PDFDocument({ margin: 25, });


    
    // Stream response inline
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${invoiceData.invoiceNo || "invoice"}.pdf"`
    );
    doc.pipe(res);

     const fontPath = path.join(process.cwd(), "fonts/NotoSans-Regular.ttf");
     const fontBold = path.join(process.cwd(), "fonts/NotoSans-Bold.ttf");
     if (fs.existsSync(fontBold)) doc.registerFont("NotoSans-Bold", fontBold);
  if (fs.existsSync(fontPath)) {
    doc.registerFont("NotoSans", fontPath);
    doc.font("NotoSans"); //  ab se ₹ symbol sahi aayega
  } else {
    doc.font("Helvetica");
  }


    // Company Header - LEFT SIDE
// Starting Y position
let currentY = 50;

// Company Name
doc
  .fontSize(15)
  .font("Helvetica-Bold")
  .text(invoiceData.companyName || "", 40, currentY);

// Thoda gap ke liye increment
currentY += 20;

// GSTIN
if (invoiceData.company?.gstin) {
  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .text(`GSTIN ${invoiceData.company.gstin}`, 40, currentY);
  currentY += 15; // GSTIN ke baad gap
}

// Company Address
(invoiceData.company?.addressLines || []).forEach((line) => {
  doc
    .fontSize(10)
    .font("Helvetica") // normal font for address
    .text(line, 40, currentY);
  currentY += 12; // har address line ke baad gap
});


    // TAX INVOICE - LEFT TOP CORNER, MEDIUM SIZE
    doc.fontSize(14).font("Helvetica-Bold");

// TAX INVOICE ko halka blue, chhota aur letter spacing ke sath likho
doc
  .fillColor("#4A90E2")   // halka blue color
  .fontSize(14)           // chhota font size
  .text("TAX INVOICE", 40, 25, { characterSpacing: 2 });

// Wapas black set kar do taaki baaki text default rahe
doc.fillColor("black");
    // ORIGINAL FOR RECIPIENT - RIGHT TOP CORNER
    doc.fontSize(10);
  doc
  .fontSize(11)               // thoda chhota
  .fillColor("#555555")       // halka grey color
  .text("ORIGINAL FOR RECIPIENT", 420, 25, { width: 145, align: "right" });

// Fixed position for logo (right top)
const logoPath = "assets/icons/dss_logo.webp";
const logoWidth = 100;
const logoHeight = 60; // desired height
const pageWidth = doc.page.width;   
const logoX = pageWidth - 50 - logoWidth; // right margin 50px
const logoY = 40; // header ke top ke aligned

// Set both width and height
doc.image(logoPath, logoX, logoY, { width: logoWidth, height: logoHeight });


   // Invoice Details - Single line, 3 columns
doc.fontSize(10).font("Helvetica");


 // Invoice Details - ONE LINE WITH PROPER SPACING
    doc.fontSize(9).font("Helvetica")
    .font("Helvetica-Bold")
    const pagewidth = doc.page.width;
    const margin = 40; // left margin
    const gap = 20;    // extra space from edges

    const invoiceNumX = margin;                   // left
    const invoiceDateX = pagewidth / 2.5;           // center
    const dueDateX = pagewidth - margin - gap - 100;    // right with extra gap and width for text

    const invoiceY = 140;

    // Left: Invoice #
    doc.font("Helvetica-Bold").text(`Invoice #: ${invoiceData.invoiceNo || ""}`, invoiceNumX, invoiceY);

    // Center: Invoice Date (slightly left of center for spacing)
    doc.text(`Invoice Date: ${invoiceData.invoiceDate || ""}`, invoiceDateX - 10, invoiceY);

    // Right: Due Date with width constraint
    doc.text(`Due Date: ${invoiceData.dueDate || "N/A"}`, dueDateX, invoiceY, { width: 100, align: "left" });


doc.fontSize(10);

// Customer Details - LEFT COLUMN
const customerX = 40; // left margin
let custY = invoiceY + 20; // +20 to push it slightly lower

doc.font("Helvetica-Bold");
doc.text("Customer Details:", customerX, custY);
custY += 15;

doc.font("Helvetica");
if (invoiceData.customerName) {
  doc.text(invoiceData.customerName, customerX, custY);
  custY += 13;
}
if (invoiceData.customerCompanyName) {
  doc.text(invoiceData.customerCompanyName, customerX, custY);
  custY += 13;
}
if (invoiceData.customerPhone) {
  doc.text(`Ph: ${invoiceData.customerPhone}`, customerX, custY);
  custY += 13;
}
if (invoiceData.customerEmail) {
  doc.text(`Email: ${invoiceData.customerEmail}`, customerX, custY);
  custY += 13;
}



// ================= Address Section on same line =================
// Address Section - Right of Customer Details (same horizontal line)
const addrX = 250; // right of customer details
const addrY = invoiceY + 20; // same starting Y

doc.font("Helvetica-Bold");
doc.text("Billing Address:", addrX, addrY);

doc.font("Helvetica");
let billY = addrY + 15; // start printing below label

// Print Address Line 1
if (invoiceData.customerAddressLine1) {
  doc.text(invoiceData.customerAddressLine1, addrX, billY);
  billY += 13;
}

// Print Address Line 2
if (invoiceData.customerAddressLine2) {
  doc.text(invoiceData.customerAddressLine2, addrX, billY);
  billY += 13;
}

// Print City, State, Pincode in one line
const cityStatePincode = [
  invoiceData.customerCity,
  invoiceData.customerState,
  invoiceData.customerPincode
].filter(Boolean).join(", ");

if (cityStatePincode) {
  doc.text(cityStatePincode, addrX, billY);
  billY += 13;
}



  // Enhanced Table Header with better spacing and alignment
const tableY = Math.max(billY + 25, addrY + 65);

// Add subtle background for header
doc.rect(40, tableY - 10, 530, 25).fillAndStroke("#f8f9fa", "#e9ecef");

// Improved column positioning with better spacing
const cols = {
  sn: 50,           // #
  item: 80,         // Item/Name  
  rate: 240,        // Rate/Item
  qty: 290,         // Qty
  discount: 335,    // Discount
  taxable: 385,     // Taxable Value
  tax: 450,         // Tax Amount
  amount: 515       // Amount
};

// Header text with better typography
doc.fontSize(10).font("Helvetica-Bold").fillColor("#2c3e50");
doc.text("#", cols.sn, tableY, { width: 25, align: "center" });
doc.text("Item", cols.item, tableY, { width: 150, align: "left" });
doc.text("Rate", cols.rate, tableY, { width: 45, align: "center" });
doc.text("Qty", cols.qty, tableY, { width: 35, align: "center" });
doc.text("Discount", cols.discount, tableY, { width: 45, align: "center" });
doc.text("Taxable", cols.taxable, tableY, { width: 55, align: "center" });
doc.text("Tax", cols.tax, tableY, { width: 55, align: "center" });
doc.text("Amount", cols.amount, tableY, { width: 50, align: "center" });

// 🔹 Enhanced border lines (Blue)
doc.strokeColor("#339af0").lineWidth(1);
doc.moveTo(40, tableY - 10).lineTo(570, tableY - 10).stroke(); // Top border
doc.moveTo(40, tableY + 15).lineTo(570, tableY + 15).stroke(); // Bottom header border


// Items section with alternating row colors
let itemY = tableY + 25;
let taxableTotal = 0;
let taxTotal = 0;
let grandTotal = 0;

doc.font("Helvetica").fontSize(9).fillColor("#495057");

(invoiceData.items || []).forEach((item, idx) => {
  const rate = Number(item.rate || 0);
  const qty = Number(item.qty || 0);
  const discount = Number(item.discount || 0);
  const taxRate = Number(item.gstPercent || 0);
  const discountedAmount = Number(item.discountedAmount || 0);
  const gstAmount = Number(item.gstAmount || 0);
  const amount = Number(item.amount || 0);

  taxableTotal += discountedAmount;
  taxTotal += gstAmount;
  grandTotal += amount;

  // Alternating row background
  if (idx % 2 === 0) {
    doc.rect(40, itemY - 5, 530, 20).fill("#fdfdfe");
  }

  // Row data with improved formatting and alignment
// Row data with proper spacing
  doc.fillColor("#495057");
  doc.text((idx + 1).toString(), cols.sn, itemY, { width: 20, align: "center" });
  
  // Item name - bold
  const itemName = item.name || item.description || "";
  doc.font("Helvetica-Bold");
  doc.text(itemName, cols.item, itemY, { width: 200 });
  doc.font("Helvetica"); // Reset to normal font
  
  // Numeric values with proper formatting
  doc.text(rate.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2}), 
           cols.rate, itemY, { width: 45, align: "center" });
  
  doc.text(qty.toString(), cols.qty, itemY, { width: 35, align: "center" });
  
  doc.text(`${discount}`, cols.discount, itemY, { width: 45, align: "center" });
  
  doc.text(discountedAmount.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2}), 
           cols.taxable, itemY, { width: 55, align: "center" });
  
  doc.text(`${gstAmount.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})} (${taxRate}%)`, 
           cols.tax, itemY, { width: 55, align: "center" });
  
  doc.text(amount.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2}), 
           cols.amount, itemY, { width: 50, align: "center" });

  itemY += 22;
});

// Bottom border with emphasis
doc.strokeColor("#adb5bd").lineWidth(1);
doc.moveTo(40, itemY + 5).lineTo(570, itemY + 5).stroke();

// Optional: Add subtle column separators
doc.strokeColor("#e9ecef").lineWidth(0.5);
[cols.item - 10, cols.rate - 5, cols.qty - 5, cols.discount - 5, cols.taxable - 5, cols.tax - 5, cols.amount - 5].forEach(x => {
  doc.moveTo(x, tableY - 10).lineTo(x, itemY + 5).stroke();
});

// Reset stroke color for other elements
doc.strokeColor("#000000");

   // Totals Section - RIGHT ALIGNED
const totalY = itemY + 15;
const totalX = 420;

doc.fontSize(10).font("Helvetica");

//  Taxable Amount
doc.text("Taxable Amount", totalX, totalY);
doc.font("NotoSans").text(formatINR(taxableTotal), totalX + 75, totalY-3, { width: 70, align: "right" });

//  Total Tax
doc.text("Total Tax", totalX + 32, totalY + 15);
doc.font("NotoSans").text(formatINR(taxTotal || 0), totalX + 75, totalY + 15, { width: 70, align: "right" });
//  Horizontal Line (adjusted)
const linesY = totalY + 32; // Tax ke neeche thoda gap ke baad line
const lineStartX = totalX + 35;   // left se 35px aage shift
const lineEndX   = totalX + 149;  // same end point rakha hai (aap adjust kar sakte ho)

doc.moveTo(lineStartX, linesY)   // start X
   .lineTo(lineEndX, linesY)     // end X
   .lineWidth(1)
   .strokeColor("black")
   .stroke();

//  Grand Total
doc.fontSize(13).font("NotoSans-Bold");
doc.text("Total", totalX+42, totalY + 35);
doc.text(formatINR(invoiceData.totalAmount), totalX + 75, totalY + 35, { width: 70, align: "right" });


 
// Summary Info
const summaryY = totalY + 65;
doc.fontSize(8).font("Helvetica");

const totalItems = (invoiceData.items || []).length;
const totalQty = (invoiceData.items || []).reduce((a, b) => a + Number(b.qty || 0), 0);
//  Left side text
doc.text(`Total Items / Qty : ${totalItems} / ${totalQty}`, 50, summaryY);

//  Right side text
const rightMargin = 50;   // right se margin
const leftStart = 220;    // left wale text ke baad start hoga
const usableWidth = doc.page.width - leftStart - rightMargin;

doc.text(
  `Total amount (in words): ${numberToIndianWords(invoiceData.totalAmount)}`,
  leftStart, // left se start
  summaryY,
  {
    width: usableWidth,   // itna space milega expand hone ke liye
    align: "right",       // hamesha right edge se align rahega
  }
);
// 🔹 Border line matching table width (40 → 570)
const lineY = summaryY + 12;
doc.strokeColor("#339af0").lineWidth(1);
doc.moveTo(40, lineY).lineTo(570, lineY).stroke();



// Amount Paid/Payable - Right aligned, stacked (closer to summary)
const amountPaid = Number(invoiceData.amountPaid || 0);
const amountPayable = Number(invoiceData.amountPayable || 0);

doc.fontSize(12).font("NotoSans-Bold").fillColor("#111");;

//  Full payment done → only Amount Paid
if (invoiceData.paymentStatus === "Paid") {
const checkIconPath = path.join(process.cwd(), "assets/icons/check.png");

const paidY = summaryY + 20;
const iconSize = 14;
const marginRight = 40;

const label = "Amount Paid";
doc.font("NotoSans-Bold").fontSize(10);
const textWidth = doc.widthOfString(label); // text ki width nikal li

// X position calculate (right side se)
const totalWidth = iconSize + 4 + textWidth; // icon + gap + text
const startX = doc.page.width - marginRight - totalWidth;

//  Icon draw
if (fs.existsSync(checkIconPath)) {
  doc.image(checkIconPath, startX, paidY + 1, { width: iconSize, height: iconSize });
}

//  Text draw (icon ke baad)
doc.fillColor("#333")
  .text(label, startX + iconSize + 4, paidY, {
    lineBreak: false,
  });


//  Pending (nothing paid yet) → only Amount Payable
} else if (invoiceData.paymentStatus === "Pending") {
const rightMargin = 50; // right se gap
const textWidth = 170;
const pageWidth = doc.page.width;

const startX = pageWidth - rightMargin - textWidth;

doc.font("NotoSans-Bold").fontSize(10).text(
  `Amount Payable:     ${formatINR(amountPayable)}`,
  startX,
  summaryY + 20,
  { width: textWidth, align: "right" }
);


//  Partial payment → show both
} else if (invoiceData.paymentStatus === "Partial") {
 const rightMargin = 50; // jitna gap chahiye right side se
const textWidth = 170;
const pageWidth = doc.page.width; // PDF page ka width

const startX = pageWidth - rightMargin - textWidth;

doc.font("NotoSans-Bold").fontSize(10).text(
  `Amount Payable:     ${formatINR(amountPayable)}`,
  startX,
  summaryY + 20,
  { width: textWidth, align: "right" }
);

doc.font("NotoSans-Bold").fontSize(10).text(
  `Amount Paid:     ${formatINR(amountPaid)}`,
  startX,
  summaryY + 35,
  { width: textWidth, align: "right" }
);

}




    const paymentY = summaryY + 75;
doc.fontSize(10).font("NotoSans-Bold");

if (invoiceData.bankDetails?.upiId && invoiceData.paymentStatus !== "Paid") {
  //  Case 1: Agar UPI ID hai
  doc.text("Pay using UPI:", 50, paymentY);
  doc.text("Bank Details:", 180, paymentY);

  doc.font("NotoSans");

  const upiId = invoiceData.bankDetails.upiId;
  const payeeName = invoiceData.companyName || "Vendor";
  const amount = invoiceData.amountPayable || 0;
  console.log("UPI ID for QR:", upiId);

  const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
    payeeName
  )}&am=${amount}&cu=INR`;

  // Show UPI ID text
  // doc.text(upiId, 50, paymentY + 15);

  // Generate QR Code with Promise
  try {
    const qrDataUrl = await new Promise((resolve, reject) => {
      QRCode.toDataURL(upiString, { margin: 1, width: 120 }, (err, url) => {
        if (err) reject(err);
        else resolve(url);
      });
    });

    const qrImg = qrDataUrl.replace(/^data:image\/png;base64,/, "");
    const qrBuffer = Buffer.from(qrImg, "base64");
    doc.image(qrBuffer, 50, paymentY + 15, { width: 100, height: 100 });
  } catch (qrError) {
    console.error("QR Code generation error:", qrError);
    doc.text("QR Code generation failed", 50, paymentY + 35);
  }

  //  Bank details right side
  const bank = invoiceData.bankDetails || {};
  doc.text(`Bank: ${bank.bank || ""}`, 180, paymentY + 15);
  doc.text(`Account #: ${bank.accountNo || ""}`, 180, paymentY + 30);
  doc.text(`IFSC Code: ${bank.ifsc || ""}`, 180, paymentY + 45);
  doc.text(`Branch: ${bank.branch || ""}`, 180, paymentY + 60);

} else {
  //  Case 2: Agar UPI ID nahi hai → sirf Bank details
  doc.text("Bank Details:", 50, paymentY);
  doc.font("NotoSans");

  const bank = invoiceData.bankDetails || {};
  doc.text(`Bank: ${bank.bank || ""}`, 50, paymentY + 15);
  doc.text(`Account #: ${bank.accountNo || ""}`, 50, paymentY + 30);
  doc.text(`IFSC Code: ${bank.ifsc || ""}`, 50, paymentY + 45);
  doc.text(`Branch: ${bank.branch || ""}`, 50, paymentY + 60);
}

//  Signature Section
const sigY = paymentY + 10;  // 150 se kam karke 60 kar diya taki upar aa jaye
const rightsMargin = 50; 
const sigWidth = 120;

// "For Company Name"
doc.text(
  `For ${invoiceData.companyName || ""}`, 
  doc.page.width - rightsMargin - sigWidth, 
  sigY, 
  { width: sigWidth, align: "center" }
);

//  Signature Image (agar available hai)
if (invoiceData.signatureImagePath && fs.existsSync(invoiceData.signatureImagePath)) {
  doc.image(
    invoiceData.signatureImagePath, 
    doc.page.width - rightsMargin - sigWidth, 
    sigY + 20, 
    { fit: [sigWidth, 50], align: "center" }
  );
}

//  Authorized Signatory text
doc.text(
  invoiceData.authorizedSignatory || "Authorized Signatory", 
  doc.page.width - rightsMargin - sigWidth, 
  sigY + 80, 
  { width: sigWidth, align: "center" }
);



    // Footer
    const footerY = 720;
    line(doc, footerY);
    
    doc.fontSize(8);
    doc.text("DSS | Simple Invoicing, Billing and Payments | Visit dsscrm.in", 40, footerY + 10);
    doc.text("Page 1 / 1 • This is a digitally signed document.", 40, footerY + 25);
    
    doc.text("Powered By", 480, footerY + 10);
    doc.text(invoiceData.company?.website || "www.codecrafter.co.in", 480, footerY + 25);

    // End the document AFTER QR code is processed
    doc.end();
    
  } catch (err) {
    console.error("Invoice PDF Error:", err);
    if (!res.headersSent) {
      res.status(500).send("Error generating PDF");
    }
  }
}
