// src/components/DynamicTable.jsx
import React, { useEffect, useRef } from "react";
import $ from "jquery";

// DataTables + Buttons
import "datatables.net-dt";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "datatables.net-buttons-dt/css/buttons.dataTables.min.css";
import "datatables.net-buttons/js/dataTables.buttons";
import "datatables.net-buttons/js/buttons.html5";
import "datatables.net-buttons/js/buttons.print";

// JSZip + pdfMake setup
import JSZip from "jszip";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.vfs;


window.pdfMake = pdfMake;
window.JSZip = JSZip;

const DynamicTable = ({
  data = [],
  columnConfig = {},
  handleUpdate = () => {},
  isLoading = false,
  isSuccess =[],
}) => {
  const tableRef = useRef();

  useEffect(() => {
    if (!data.length) return;

    let columns = Object.keys(data[0]);
    // If actions exist, move it to the beginning
    if (columnConfig["actions"]) {
      columns = ["actions", ...columns];
    }
    const exportColumns = columns
      .map((col, index) => (col !== "actions" ? index + 1 : null))
      .filter((index) => index !== null); // Skip 'actions' column
    // +1 because S. No. is index 0

    const table = $(tableRef.current).DataTable({
      destroy: true,
      scrollX: true,
      responsive: true,
      autoWidth: false,
      language: {
        emptyTable: "No records available",
      },
      dom: "<'flex flex-wrap justify-between items-center p-2'Bf><'mt-2't><'p-2 flex justify-between items-center'lip>",
      buttons: [
        {
          extend: "copyHtml5",
          exportOptions: { columns: exportColumns },
          className: "btn-dt",
          text: "Copy",
        },
        {
          extend: "csvHtml5",
          exportOptions: { columns: exportColumns },
          className: "btn-dt",
          text: "CSV",
        },
        {
          extend: "excelHtml5",
          exportOptions: { columns: exportColumns },
          className: "btn-dt",
          text: "Excel",
        },
        {
          extend: "pdfHtml5",
          exportOptions: {
            columns: function (idx, data, node) {
              return $(node).text().toLowerCase() !== "actions"; // Exclude "Actions" column
            },
          },
          orientation: "landscape",
          pageSize: "A4",
          className: "btn-dt",
          text: "PDF",
          customize: function (doc) {
            // General styles
            doc.pageMargins = [20, 20, 20, 20];
            doc.defaultStyle.fontSize = 7.5;
            doc.styles.tableHeader.alignment = "left";

            // Wrap text inside Description column
            const body = doc.content[1].table.body;
            const descColIndex = body[0].findIndex((header) => {
              const hText = typeof header === "string" ? header : header.text;
              return hText?.toString().toLowerCase().includes("description");
            });

            if (descColIndex !== -1) {
              for (let i = 1; i < body.length; i++) {
                body[i][descColIndex].alignment = "left";
                body[i][descColIndex].text =
                  body[i][descColIndex].text?.toString() ||
                  body[i][descColIndex].toString();
                body[i][descColIndex].margin = [0, 2, 0, 2];
                body[i][descColIndex].fontSize = 7;
              }
            }

            // Capitalize header
            doc.content[1].table.body[0] = doc.content[1].table.body[0].map(
              (cell) => {
                if (typeof cell === "string") return cell.toUpperCase();
                if (typeof cell.text === "string")
                  return { ...cell, text: cell.text.toUpperCase() };
                return cell;
              }
            );

            // Adjust column widths: Fixed width for description, auto for others
            const colCount = doc.content[1].table.body[0].length;
            doc.content[1].table.widths = Array(colCount)
              .fill("*")
              .map((w, i) => (i === descColIndex ? "auto" : "*"));
          },
        },
      {
  extend: "print",
  exportOptions: { columns: exportColumns },
  className: "btn-dt",
  text: "Print",
  title: "", // Remove default title
  customize: function (win) {
    $(win.document.body).prepend(`
      <h3 style="text-align:center; font-size:18pt; margin-bottom:10px;">
        3S Digital Signage Solution
      </h3>
    `);

    // Optional: table and body styling
    $(win.document.body).css("font-size", "10pt");
    $(win.document.body).find("table").addClass("compact").css("font-size", "inherit");
  }
}

      ],
    });

    return () => table.destroy();
  }, [data]);

  if (!data.length && isSuccess) {
    return (
     <div className="flex flex-col items-center justify-center py-10 text-gray-500">
  {/* Icon */}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-12 h-12 mb-3 text-gray-400 animate-bounce"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12A9 9 0 113 12a9 9 0 0118 0z" />
  </svg>

  {/* Title */}
  <h2 className="text-lg font-semibold text-gray-600">No Data Found</h2>

  {/* Description */}
  <p className="text-sm text-gray-400 mt-1">There’s nothing to display right now.</p>

  {/* Action Button (optional) */}
  <button
    onClick={() =>  window.location.reload()}
    className="mt-4 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-lg shadow transition-all duration-300 cursor-pointer"
  >
    Reload
  </button>
</div>

    );
  }

let columns = data.length && data[0] ? Object.keys(data[0]).filter(key => key !== "productId") : [];

if (columnConfig["actions"]) {
  columns = ["actions", ...columns];
}

  return (
    <div className="w-full overflow-x-auto p-4 bg-white border border-gray-200 rounded-lg shadow-md mb-2">
      <style>
        {`
          .btn-dt {
            background-color: #f3f4f6;
            border: 1px solid #d1d5db;
            padding: 6px 12px;
            margin: 4px;
            font-size: 0.75rem;
            font-weight: 600;
            color: #111827;
            border-radius: 4px;
            cursor: pointer;
          }
          .btn-dt:hover {
            background-color: #e5e7eb;
          }
          table.dataTable thead th {
            background-color: #111827;
            color: white;
            text-align: center;
          }
        `}
      </style>

{isLoading ? (
  <div className="w-full border border-gray-200 shadow-md rounded-xl overflow-hidden animate-pulse ">
    <div className="bg-gray-200 px-4 py-3">
      <div className="grid grid-cols-8 gap-4">
        {[...Array(8)].map((_, idx) => (
          <div
            key={idx}
            className="h-4 bg-gray-300 rounded"
          ></div>
        ))}
      </div>
    </div>
    {[...Array(6)].map((_, rowIdx) => (
      <div
        key={rowIdx}
        className="px-4 py-3 border-t border-gray-200"
      >
        <div className="grid grid-cols-8 gap-4">
          {[...Array(8)].map((_, colIdx) => (
            <div
              key={colIdx}
              className="h-4 bg-gray-200 rounded"
            ></div>
          ))}
        </div>
      </div>
    ))}
  </div>
) : (
  // Your actual <table> JSX here
       <table
        ref={tableRef}
        className="min-w-max w-full text-sm text-left border border-gray-300"
      >
        <thead>
          <tr>
            <th className="px-3 py-2 font-semibold text-xs uppercase text-center border border-gray-200 bg-gray-900 text-white">
              S. No.
            </th>
            {columns.map((col) => (
              <th
                key={col}
                className="px-3 py-2 font-semibold text-xs uppercase text-center border border-gray-200 bg-gray-900 text-white"
              >
                {columnConfig[col]?.label || col}
              </th>
            ))}
          </tr>
        </thead>
    <tbody className="text-gray-700">
  {data.map((row, idx) => (
    <tr
      key={row._id || idx}
      className={idx % 2 === 0 ? "bg-white hover:bg-gray-50" : "bg-gray-50 hover:bg-gray-100 transition-colors"}
    >
      {/* Serial Number */}
      <td className="px-3 py-2 text-center border border-gray-200 font-medium">
        {idx + 1}
      </td>

      {/* Columns */}
      {columns.map((col) => {
        let content = columnConfig[col]?.render
          ? columnConfig[col].render(row[col], row)
          : row[col];

       // Special styling for createdAt
// Special styling for createdAt
if (col === "createdAt") {
  const date = new Date(row[col]);
const formattedDate = date.toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});  const formattedTime = date.toLocaleTimeString(); // Sirf time

  content = (
    <div className="flex flex-col items-center">
      {/* Date */}
      <span className="  px-2 py-1 rounded-t-md text-sm font-medium w-fit">
        {formattedDate}
      </span>

      {/* Time (smaller) */}
      <span className="  px-2 py-0.5 rounded-b-md text-xs w-fit">
        {formattedTime}
      </span>
    </div>
  );
}

  //  InStock (red) & UsedStock (green) styling
  let extraClass = "";
  if (col === "inStock") {
    extraClass = "text-red-600 font-semibold";
  } else if (col === "usedStock") {
    extraClass = "text-green-600 font-semibold";
  }

        return (
          <td
            key={col}
            className={`px-3 py-2 text-center border border-gray-200 ${extraClass}`}
            style={{ whiteSpace: "nowrap" }}
          >
            {content}
          </td>
        );
      })}
    </tr>
  ))}
</tbody>

      </table>
)}


    </div>
  );
};

export default DynamicTable;
