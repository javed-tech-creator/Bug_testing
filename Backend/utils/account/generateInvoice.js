// export const generateInvoiceHTML = (invoice) => {
//   const {
//     client,
//     project,
//     items = [],
//     invoiceNumber,
//     gst = 0,
//     subTotal = 0,
//     gstAmount = 0,
//     totalAmount = 0,
//     notes = [],
//     status = "unpaid",
//     paidAmount = 0,
//     remainingAmount = totalAmount,
//     dueDate
//   } = invoice;

//   return `
//     <html>
//       <head>
//         <style>
//           body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: #f5f5f5; }
//           .invoice-container { max-width: 800px; margin: 50px auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
//           .header { background: #2c3e50; color: #fff; padding: 20px 30px; display: flex; justify-content: space-between; align-items: center; }
//           .header img { height: 50px; }
//           .header h1 { font-size: 2rem; margin: 0; }
//           .content { padding: 30px; }
//           .client-info p { margin: 4px 0; font-size: 1rem; }
//           table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//           th, td { padding: 12px; border-bottom: 1px solid #ddd; text-align: left; }
//           th { background: #34495e; color: white; text-transform: uppercase; font-weight: 500; font-size: 0.85rem; }
//           tbody tr:hover { background: #f8f9ff; transition: all 0.3s ease; }
//           .totals { margin-top: 20px; width: 100%; }
//           .totals td { padding: 10px; }
//           .totals tr:last-child { background: #2c3e50; color: white; font-weight: bold; font-size: 1.1rem; }
//           .payments { margin-top: 30px; }
//           .payments h3 { margin-bottom: 10px; }
//           .payments ul { list-style: none; padding-left: 0; }
//           .payments li { margin-bottom: 5px; }
//           .footer { text-align: center; padding: 15px 0; font-size: 0.85rem; color: #555; border-top: 1px solid #ddd; margin-top: 40px; }
//         </style>
//       </head>
//       <body>
//         <div class="invoice-container">
//           <div class="header">
//             <img src="https://dummyimage.com/100x50/2c3e50/fff.png&text=Logo" alt="Company Logo"/>
//             <h1>Invoice #${invoiceNumber}</h1>
//           </div>

//           <div class="content">
//             <div class="client-info">
//               <p><strong>Client:</strong> ${client}</p>
//               <p><strong>Project:</strong> ${project}</p>
//               <p><strong>Status:</strong> ${status}</p>
//               <p><strong>Paid Amount:</strong> ₹${paidAmount}</p>
//               <p><strong>Remaining Amount:</strong> ₹${remainingAmount}</p>
//               <p><strong>Due Date:</strong> ${dueDate ? new Date(dueDate).toLocaleDateString() : ''}</p>
//             </div>

//             <table>
//               <thead>
//                 <tr>
//                   <th>Description</th>
//                   <th>Quantity</th>
//                   <th>Rate</th>
//                   <th>Total</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 ${items.map(item => `
//                   <tr>
//                     <td>${item.description || ''}</td>
//                     <td>${item.quantity || 0}</td>
//                     <td>₹${item.rate || 0}</td>
//                     <td>₹${(item.quantity || 0) * (item.rate || 0)}</td>
//                   </tr>
//                 `).join('')}
//               </tbody>
//             </table>

//             <table class="totals">
//               <tr>
//                 <td>Sub Total:</td>
//                 <td>₹${subTotal}</td>
//               </tr>
//               <tr>
//                 <td>GST (${gst}%):</td>
//                 <td>₹${gstAmount}</td>
//               </tr>
//               <tr>
//                 <td><strong>Total Amount:</strong></td>
//                 <td><strong>₹${totalAmount}</strong></td>
//               </tr>
//             </table>

//             ${notes.length > 0 ? `
//               <div class="payments">
//                 <h3>Payments / Notes</h3>
//                 <ul>
//                   ${notes.map(p => `<li>${p.type?.toUpperCase() || 'NOTE'} - ₹${p.amount || 0} on ${p.date ? new Date(p.date).toLocaleDateString() : ''}</li>`).join('')}
//                 </ul>
//               </div>
//             ` : ''}

//           </div>

//           <div class="footer">
//             Thank you for your business! Please pay by the due date.  
//             <br>Company Address | Email | Phone
//           </div>
//         </div>
//       </body>
//     </html>
//   `;
// };

import fs from "fs";
import path from "path";

export const generateInvoiceHTML = (invoice) => {
  console.log(invoice,"invoi");
  
  const {
    client,
    project,
    clientPhone,
    clientEmail,
    items = [],
    invoiceNumber = "-",
    subTotal = 0,
    gst = 0,
    gstAmount = 0,
    totalAmount = 0,
    status = "pending",
    paidAmount = 0,
    remainingAmount = totalAmount - paidAmount,
    invoiceDate,
    dueDate,
    createdAt,
    notes = [],
    bankDetails = {},
    customerDetails = {},
    billingAddress = '',
    gstin = '29ABCDE1234F1Z5'
  } = invoice;

  // --- Logo handling ---
  let logoSrc = '';
  try {
    const logoPath = path.join(process.cwd(), 'assets', 'icons', 'dss logo.PNG');
    const logoBase64 = fs.readFileSync(logoPath, { encoding: 'base64' });
    logoSrc = `data:image/png;base64,${logoBase64}`;
  } catch (err) {
    console.error("Logo file read error:", err);
    logoSrc = '';
  }

  // --- Payment Section ---
  const getPaymentSection = () => `
    <p><strong>Total Amount:</strong> ₹${totalAmount.toFixed(2)}</p>
    <p><strong>Amount Paid:</strong> ₹${paidAmount.toFixed(2)}</p>
    <p><strong>Remaining Amount:</strong> ₹${remainingAmount.toFixed(2)}</p>
    <p><strong>Status:</strong> ${status}</p>
  `;

  // --- Bank Details ---
  const getBankDetailsSection = () => {
    if (bankDetails && Object.keys(bankDetails).length > 0) {
      return `
        <div class="section bank-details-section">
          <h3>Bank Details:</h3>
          <p>Bank: ${bankDetails.bankName || '-'}</p>
          <p>Account #: ${bankDetails.accountNumber || '-'}</p>
          <p>IFSC Code: ${bankDetails.ifscCode || '-'}</p>
          <p>Branch: ${bankDetails.branch || '-'}</p>
        </div>
      `;
    }
    return '';
  };

  // --- Convert total amount to words ---
  const getWordsTotal = (num) => {
    if (typeof num !== 'number') num = parseFloat(num) || 0;
    const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
      'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 
      'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const numToWords = (n) => {
      if (n < 20) return a[n];
      if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
      if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + numToWords(n % 100) : '');
      if (n < 100000) return numToWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + numToWords(n % 1000) : '');
      if (n < 10000000) return numToWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + numToWords(n % 100000) : '');
      return numToWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + numToWords(n % 10000000) : '');
    };
    let words = numToWords(Math.floor(num));
    let paise = Math.round((num - Math.floor(num)) * 100);
    if (paise > 0) words += ` and ${numToWords(paise)} Paise`;
    return words + ' Rupees Only.';
  };

  // --- Format Dates ---
  const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-GB') : '-';

  // --- HTML ---
  return `
  <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; font-size: 14px; margin: 0; padding: 0; }
        .invoice-container { width: 8.5in; min-height: 11in; margin: 0 auto; padding: 20px 40px; border: 1px solid #ccc; box-sizing: border-box; }
        .header-section { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
        .company-info { font-size: 12px; }
        .invoice-title { font-size: 24px; font-weight: bold; margin: 0; color: #3b82f6; }
        .invoice-meta-dates { display: flex; justify-content: space-between; margin-top: 10px; }
        .details-section { display: flex; justify-content: space-between; margin-bottom: 20px; }
        .customer-info, .billing-address { width: 48%; }
        .item-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .item-table th, .item-table td { padding: 8px; text-align: left; border-bottom: 1px solid #ccc; }
        .totals-table { width: 50%; float: right; border-collapse: collapse; margin-top: 20px; }
        .totals-table td { padding: 5px; text-align: right; border: none; }
        .totals-table .total-row td { font-weight: bold; border-top: 2px solid #000; }
        .amount-words { clear: both; margin-top: 40px; text-align:right; }
        .payment-details { text-align: right; margin-top: 10px; }
        .signature-section { margin-top: 50px; text-align: right; }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="header-section">
          <div class="company-info">
            <p class="invoice-title">TAX INVOICE</p>
            <p style="font-weight: bold; font-size: 24px; margin: 0;">3S Digital Signage Solutions</p>
            <p style="font-size: 16px; margin: 0;">GSTIN: ${gstin}</p>
            <p style="font-size: 14px; margin: 0;">No. 123, 4th Floor, Tech Park</p>
            <p style="font-size: 14px; margin: 0;">MG Road, Indiranagar</p>
            <p style="font-size: 14px; margin: 0;">Bengaluru - 560038</p>
            <p style="font-size: 14px; margin: 0;">Karnataka, India</p>
          </div>
          <div style="display: flex; align-items: center; gap: 20px;">
            ${logoSrc ? `<img src="${logoSrc}" alt="Company Logo" style="height: 100px; width: auto;" />` : ''}
          </div>
        </div>

        <div class="invoice-meta-dates">
          <div><strong>Invoice #:</strong> ${invoiceNumber}</div>
          <div><strong>Due Date:</strong> ${formatDate(dueDate)}</div>
          <div><strong>Invoice Date:</strong> ${formatDate(createdAt)}</div>
        </div>

        <div class="details-section">
          <div class="customer-info">
            <p><strong>Customer Details:</strong></p>
            <p>Client: ${customerDetails.name || client || '-'}</p>
            <p>Project: ${customerDetails.company || project || '-'}</p>
            <p>Ph: ${invoice.clientPhone || '-'}</p>
            <p>Email: ${invoice.clientEmail || '-'}</p>
          </div>
          <div class="billing-address">
            <p><strong>Billing Address:</strong></p>
            <p>${billingAddress || '-'}</p>
          </div>
        </div>

        <table class="item-table">
          <thead>
            <tr style="border-top: 2px solid #3b82f6; border-bottom: 2px solid #3b82f6;">
              <th>#</th>
              <th>Item</th>
              <th>Rate</th>
              <th>Qty</th>
              <th>Discount</th>
              <th>Tax</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${items.map((item, index) => {
              const itemAmount = (item.rate * item.quantity) - (item.discount || 0);
              const itemTax = (itemAmount * gst) / 100;
              const itemTotal = itemAmount + itemTax;
              return `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.description || '-'}</td>
                  <td>${item.rate || '0'}</td>
                  <td>${item.quantity || '0'}</td>
                  <td>${item.discount || '0'}</td>
                  <td>${gst}%</td>
                  <td>${itemTotal.toFixed(2)}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <table class="totals-table">
          <tr><td>Taxable Amount</td><td>${subTotal.toFixed(2)}</td></tr>
          <tr><td>Total Tax</td><td>${gstAmount.toFixed(2)}</td></tr>
          <tr class="total-row"><td>Total</td><td>${totalAmount.toFixed(2)}</td></tr>
        </table>

        <div class="amount-words"><strong>Total amount (in words):</strong> ${getWordsTotal(totalAmount)}</div>
        <hr />
        <div class="payment-details">${getPaymentSection()}</div>
        ${getBankDetailsSection()}
   <hr style="border: none; height: 2px; background-color: #000; margin-top: 200px;" />
       <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; font-size: 10px; color: #777;">
  <div>
    <span>DSS | Simple Invoicing, Billing and Payments | Visit dsscrm.in</span><br/>
    <span>Page 1/1 This is a digitally signed document.</span>
  </div>
  <div style="text-align: right;">
    <span>Powered By www.3sdss.com</span>
  </div>
</div>
      
      </div>
    </body>
  </html>
  `;
};
