import React from "react";
import { X } from "lucide-react";

// Default table data
const defaultTable = {
  id: "default",
  rows: [
    {
      sNo: "01",
      productCode: "P-09977",
      productName: "Flex Sign Board",
      productDescription: "Product Description",
      thickness: "12",
      lengthInch: "4",
      lengthFt: "0",
      heightInch: "4",
      heightFt: "0",
      size: "4",
      quantity: "2",
      rate: "12",
      amount: "200",
      lsp: "",
    },
    {
      sNo: "02",
      productCode: "P-09977",
      productName: "Abc Sign Board",
      productDescription: "Product Description",
      thickness: "12",
      lengthInch: "4",
      lengthFt: "0",
      heightInch: "4",
      heightFt: "0",
      size: "4",
      quantity: "2",
      rate: "12",
      amount: "200",
      lsp: "",
    },
    {
      sNo: "03",
      productCode: "P-09977",
      productName: "Xyz Sign Board",
      productDescription: "Product Description",
      thickness: "12",
      lengthInch: "4",
      lengthFt: "0",
      heightInch: "4",
      heightFt: "0",
      size: "4",
      quantity: "2",
      rate: "12",
      amount: "200",
      lsp: "",
    },
  ],
};

const isProductCodeValid = (val) => /^[A-Za-z0-9-]*$/.test(val);
const isNumeric = (val) => val === "" || /^\d+$/.test(val);

// Helper functions for size and amount calculations
const calcSizeSqFt = (lengthFt, heightFt) => {
  const l = parseFloat(lengthFt);
  const h = parseFloat(heightFt);
  if (isNaN(l) || isNaN(h)) return "";
  return (l * h).toFixed(2);
};

const calcAmount = (size, qty, rate) => {
  const s = parseFloat(size);
  const q = parseFloat(qty);
  const r = parseFloat(rate);
  if (isNaN(s) || isNaN(q) || isNaN(r)) return "";
  return (s * q * r).toFixed(2);
};

const BoardProductTable = ({
  table,
  onRemove,
  showRemove = true,
  onCellChange,
  showBorder = true,
  clickable = true,
  showLsp = true,
}) => {
  const inputClass = `w-full text-center text-[10px] sm:text-xs px-1 py-1 ${
    showBorder
      ? "rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-300"
      : ""
  } `;
  const getInputProps = (extraClass = "") => ({
    readOnly: !clickable,
    disabled: !clickable,
    className: `${inputClass} ${extraClass} ${
      !clickable ? "pointer-events-none cursor-not-allowed" : ""
    }`,
  });

  const getReadOnlyProps = (extraClass = "", align = "center") => ({
    readOnly: true,
    disabled: true,
    className: `w-full text-${align} text-[10px] sm:text-xs px-2 py-1
      border-none outline-none focus:ring-0 focus:outline-none
      pointer-events-none bg-transparent ${extraClass}`,
  });

  const currentTable =
    table && Array.isArray(table.rows) && table.rows.length > 0
      ? table
      : defaultTable;

  // Helper for blur conversion on inch/feet fields (now a no-op)

  // Validation wrapper for cell change
  const handleCellChange = (rowIdx, key, value) => {
    // Inch handling: allow free typing, update feet preview only, never overwrite inch
    if (key === "lengthInch" || key === "heightInch") {
      onCellChange && onCellChange(rowIdx, key, value);

      if (value !== "" && !isNaN(value)) {
        const totalInch = parseInt(value, 10);
        const ft = totalInch > 0 ? Math.ceil(totalInch / 12) : 0;
        const ftKey = key === "lengthInch" ? "lengthFt" : "heightFt";

        // update ft
        onCellChange && onCellChange(rowIdx, ftKey, ft.toString());

        // 🔥 FIX: recalculate size & amount after inch → ft conversion
        const updatedLengthFt =
          ftKey === "lengthFt" ? ft : currentTable.rows[rowIdx].lengthFt;
        const updatedHeightFt =
          ftKey === "heightFt" ? ft : currentTable.rows[rowIdx].heightFt;

        const size = calcSizeSqFt(updatedLengthFt, updatedHeightFt);
        onCellChange && onCellChange(rowIdx, "size", size);

        const amount = calcAmount(size, row.quantity, row.rate);
        onCellChange && onCellChange(rowIdx, "amount", amount);
      }
      return;
    }
    // Feet handling: recalculate size and amount
    if (key === "lengthFt" || key === "heightFt") {
      onCellChange && onCellChange(rowIdx, key, value);

      const updatedLengthFt =
        key === "lengthFt" ? value : currentTable.rows[rowIdx].lengthFt;
      const updatedHeightFt =
        key === "heightFt" ? value : currentTable.rows[rowIdx].heightFt;

      const size = calcSizeSqFt(updatedLengthFt, updatedHeightFt);
      onCellChange && onCellChange(rowIdx, "size", size);

      onCellChange && onCellChange(rowIdx, "amount", amount);

      return;
    }

    if (["productName", "productDescription"].includes(key)) {
      // No special validation for productName or productDescription
    } else if (key === "productCode") {
      if (!isProductCodeValid(value)) return;
    } else if (["sNo", "thickness", "quantity", "rate"].includes(key)) {
      if (!isNumeric(value)) return;
    }

    onCellChange && onCellChange(rowIdx, key, value);
    // After updating quantity or rate, recalculate amount
    const row = currentTable.rows[rowIdx];
    const size = row.size;
    const updatedQty = key === "quantity" ? value : row.quantity;
    const updatedRate = key === "rate" ? value : row.rate;
    const amount = calcAmount(size, updatedQty, updatedRate);
    onCellChange && onCellChange(rowIdx, "amount", amount);
  };
  // End of handleCellChange

  return (
    <div className="bg-white sm:p-6 shadow-sm border border-gray-100 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-900 text-xs sm:text-sm">
          Only Board Products
        </h3>
        {showRemove && (
          <button
            onClick={onRemove}
            className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-md bg-red-600 text-white hover:bg-red-700 transition-all cursor-pointer"
            title="Remove Table"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        )}
      </div>

      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden border border-gray-300">
            <table className="w-full border border-black border-collapse text-center">
              <thead className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-600">
                <tr>
                  <th className="px-2 py-2 text-center text-[10px] sm:text-xs font-semibold text-white w-10 whitespace-nowrap border border-black">
                    S. No
                  </th>
                  <th className="px-2 py-2 text-center text-[10px] sm:text-xs font-semibold text-white w-10 whitespace-nowrap border border-black">
                    Product Code
                  </th>
                  <th className="px-2 py-2 text-center text-[10px] sm:text-xs font-semibold text-white w-[11%] whitespace-normal border border-black">
                    Product Name
                  </th>
                  <th className="px-2 py-2 text-center text-[10px] sm:text-xs font-semibold text-white w-[13%] whitespace-normal border border-black">
                    Product Description
                  </th>
                  <th className="px-2 py-2 text-center text-[10px] sm:text-xs font-semibold text-white w-16 whitespace-nowrap border border-black">
                    Thickness 
                    <br />(MM)
                  </th>
                  <th className="px-2 py-2 text-center text-[10px] sm:text-xs font-semibold text-white w-[120px] whitespace-nowrap border border-black">
                    <div className="border-b pb-1 mb-1 whitespace-nowrap">
                      Length
                    </div>
                    <div className="flex gap-2 justify-center">
                      <span className="flex-1 text-[9px] sm:text-[10px] whitespace-nowrap">
                        Inch
                      </span>
                      <span className="flex-1 text-[9px] sm:text-[10px] whitespace-nowrap">
                        Ft
                      </span>
                    </div>
                  </th>
                  <th className="px-2 py-2 text-center text-[10px] sm:text-xs font-semibold text-white w-[120px] whitespace-nowrap border border-black">
                    <div className="border-b pb-1 mb-1 whitespace-nowrap">
                      Height
                    </div>
                    <div className="flex gap-2 justify-center">
                      <span className="flex-1 text-[9px] sm:text-[10px] whitespace-nowrap">
                        Inch
                      </span>
                      <span className="flex-1 text-[9px] sm:text-[10px] whitespace-nowrap">
                        Ft
                      </span>
                    </div>
                  </th>
                  <th className="px-2 py-2 text-center text-[10px] sm:text-xs font-semibold text-white w-16 whitespace-nowrap border border-black">
                    Total Size
                     <br /> (Sq. Ft)
                  </th>
                  <th className="px-2 py-2 text-center text-[10px] sm:text-xs font-semibold text-white w-20 whitespace-nowrap border border-black">
                    Quantity
                  </th>
                  <th className="px-2 py-2 text-center text-[10px] sm:text-xs font-semibold text-white w-20 whitespace-nowrap border border-black">
                    Rate <br /> (/Sq. Ft)
                  </th>
                  <th className="px-2 py-2 text-center text-[10px] sm:text-xs font-semibold text-white w-24 whitespace-nowrap border border-black">
                    Amount (Rs)
                  </th>
                  {showLsp && (
                    <th className="px-2 py-2 text-center text-[10px] sm:text-xs font-semibold text-white w-14 whitespace-nowrap border border-black">
                      LSP
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-center">
                {currentTable.rows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-gray-50">
                    <td className="px-2 py-2 text-center border border-black">
                      <input
                        value={row.sNo}
                        {...getReadOnlyProps("", "center")}
                      />
                    </td>
                    <td className="px-2 py-2 text-center border border-black">
                      <input
                        value={row.productCode}
                        {...getReadOnlyProps("", "center")}
                      />
                    </td>
                    <td className="px-2 py-2 border border-black">
                      <input
                        value={row.productName}
                        className="w-full break-words whitespace-normal"
                        {...getReadOnlyProps("", "center")}
                      />
                    </td>
                    <td className="px-2 py-2 border border-black">
                      <input
                        value={row.productDescription}
                        className="w-full break-words whitespace-normal"
                        {...getReadOnlyProps("", "center")}
                      />
                    </td>
                    <td className="px-2 py-2 text-center border border-black">
                      <input
                        value={row.thickness}
                        onChange={(e) =>
                          clickable &&
                          handleCellChange(rowIdx, "thickness", e.target.value)
                        }
                        {...getInputProps()}
                      />
                    </td>
                    <td className="px-2 py-2 border border-black">
                      <div className="flex gap-1 items-center justify-center">
                        <input
                          value={row.lengthInch}
                          onChange={(e) =>
                            clickable &&
                            handleCellChange(
                              rowIdx,
                              "lengthInch",
                              e.target.value
                            )
                          }
                          {...getInputProps("w-10 sm:w-12")}
                        />
                        <span className="text-gray-400 font-bold text-xs">
                          |
                        </span>
                        <input
                          value={row.lengthFt}
                          {...getReadOnlyProps("w-8")}
                        />
                      </div>
                    </td>
                    <td className="px-2 py-2 border border-black">
                      <div className="flex gap-1 items-center justify-center">
                        <input
                          value={row.heightInch}
                          onChange={(e) =>
                            clickable &&
                            handleCellChange(
                              rowIdx,
                              "heightInch",
                              e.target.value
                            )
                          }
                          {...getInputProps("w-10 sm:w-12")}
                        />
                        <span className="text-gray-400 font-bold text-xs">
                          |
                        </span>
                        <input
                          value={row.heightFt}
                          {...getReadOnlyProps("w-8")}
                        />
                      </div>
                    </td>
                    <td className="px-2 py-2 text-center border border-black">
                      <input value={row.size} {...getReadOnlyProps("w-8")} />
                    </td>
                    <td className="px-2 py-2 text-center border border-black">
                      <input
                        value={row.quantity}
                        onChange={(e) =>
                          clickable &&
                          handleCellChange(rowIdx, "quantity", e.target.value)
                        }
                        {...getInputProps()}
                      />
                    </td>
                    <td className="px-2 py-2 text-center border border-black">
                      <input
                        value={row.rate}
                        onChange={(e) =>
                          clickable &&
                          handleCellChange(rowIdx, "rate", e.target.value)
                        }
                        {...getInputProps()}
                      />
                    </td>
                    <td className="px-2 py-2 text-center border border-black">
                      <input value={row.amount} {...getReadOnlyProps("w-8")} />
                    </td>
                    {showLsp && (
                      <td className="px-2 py-2 text-center border border-black">
                        <input
                          value={row.lsp}
                          onChange={(e) =>
                            clickable &&
                            handleCellChange(rowIdx, "lsp", e.target.value)
                          }
                          placeholder="Write your selling point"
                          {...getInputProps("placeholder-gray-400")}
                        />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardProductTable;
