// utils/htmlToPdf.js
import html_to_pdf from "html-pdf-node";

const htmlToPdf = async (htmlContent) => {
  try {
    if (!htmlContent) return null;

    const file = { content: htmlContent };

    const pdfBuffer = await html_to_pdf.generatePdf(file, {
      format: "A4",
      printBackground: true,
    });

    return pdfBuffer;
  } catch (err) {
    console.error("PDF generation error:", err.message);
    return null;
  }
};

export default htmlToPdf;
