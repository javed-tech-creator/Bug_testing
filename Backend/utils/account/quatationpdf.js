export const quatationInvoiceHtml = (invoice) => {
  const { client, project, invoiceNumber, items, subTotal, gstAmount, totalAmount, paidAmount, remainingAmount, notes, dueDate, status } = invoice;

  // Generate rows for items
  const itemRows = items.map((item, index) => `
    <tr>
      <td style="padding:8px; border:1px solid #ccc;">${index + 1}</td>
      <td style="padding:8px; border:1px solid #ccc;">${item.description}</td>
      <td style="padding:8px; border:1px solid #ccc;">${item.quantity}</td>
      <td style="padding:8px; border:1px solid #ccc;">${item.rate.toLocaleString()}</td>
      <td style="padding:8px; border:1px solid #ccc;">${(item.quantity * item.rate).toLocaleString()}</td>
    </tr>
  `).join("");

  // Generate rows for notes
  const noteRows = notes.map((note, index) => `
    <tr>
      <td style="padding:8px; border:1px solid #ccc;">${index + 1}</td>
      <td style="padding:8px; border:1px solid #ccc;">${note.type}</td>
      <td style="padding:8px; border:1px solid #ccc;">${note.amount.toLocaleString()}</td>
      <td style="padding:8px; border:1px solid #ccc;">${note.method || "-"}</td>
      <td style="padding:8px; border:1px solid #ccc;">${new Date(note.date).toLocaleDateString()}</td>
    </tr>
  `).join("");

  return `
  <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1, h2, h3 { margin: 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
        th { background-color: #f0f0f0; }
        .totals { margin-top: 20px; width: 300px; float: right; }
        .totals td { border: none; padding: 4px; }
      </style>
    </head>
    <body>
      <h1>Invoice</h1>
      <h3>Invoice Number: ${invoiceNumber}</h3>
      <h3>Client: ${client}</h3>
      <h3>Project: ${project}</h3>
      <h3>Status: ${status}</h3>
      <h3>Due Date: ${new Date(dueDate).toLocaleDateString()}</h3>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Rate</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
        </tbody>
      </table>

      <table class="totals">
        <tr>
          <td>SubTotal:</td>
          <td>${subTotal.toLocaleString()}</td>
        </tr>
        <tr>
          <td>GST:</td>
          <td>${gstAmount.toLocaleString()}</td>
        </tr>
        <tr>
          <td>Total Amount:</td>
          <td>${totalAmount.toLocaleString()}</td>
        </tr>
        <tr>
          <td>Paid Amount:</td>
          <td>${paidAmount.toLocaleString()}</td>
        </tr>
        <tr>
          <td>Remaining Amount:</td>
          <td>${remainingAmount.toLocaleString()}</td>
        </tr>
      </table>

      ${notes.length ? `
        <h3>Notes / Payments:</h3>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${noteRows}
          </tbody>
        </table>
      ` : ""}
    </body>
  </html>
  `;
};
