import React from "react";
import { X } from "lucide-react";

const isAlpha = (val) => /^[A-Za-z\s]*$/.test(val);
const isAlphaComma = (val) => /^[A-Za-z,\s]*$/.test(val);
const isNumeric = (val) => /^\d*$/.test(val);
const isProductCodeValid = (val) => /^[A-Za-z0-9-]*$/.test(val);

const LetterProductTable = ({
  table,
  index,
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

  const getInputProps = () => ({
    readOnly: !clickable,
    disabled: !clickable,
    className: `${inputClass} ${
      !clickable ? "pointer-events-none cursor-not-allowed" : ""
    }`,
  });

  const getReadOnlyProps = (align = "center") => ({
    readOnly: true,
    disabled: true,
    className: `w-full text-${align} text-[10px] sm:text-xs px-2 py-1
      border-none outline-none focus:ring-0 focus:outline-none
      pointer-events-none bg-transparent`,
  });

  const currentTable =
    table && Array.isArray(table.rows) && table.rows.length > 0
      ? table
      : {
          rows: [
            {
              sNo: "",
              productCode: "",
              productName: "",
              productDescription: "",
              letters: "",
              thickness: "",
              length: "",
              height: "",
              quantity: "",
              rate: "",
              amount: "",
              lsp: "",
            },
          ],
        };

  const calculateAmount = (row) => {
    const quantity = Number(row.quantity || 0);
    const rate = Number(row.rate || 0);
    const length = Number(row.length || 0);
    const height = Number(row.height || 0);

    if (!quantity || !rate) return "";

    let usedSize = 0;

    // 🔐 RULES
    if (length === height) {
      // both same → take ONLY ONE value
      usedSize = length;
    } else {
      // different → take the bigger one
      usedSize = length > height ? length : height;
    }

    if (!usedSize) return "";

    // 🚫 absolutely no length * height possible
    return String(quantity * rate * usedSize);
  };

  // Validation wrapper for cell change
  const handleCellChange = (rowIdx, key, value) => {
    if (["productName", "productDescription"].includes(key)) {
      if (!isAlpha(value)) return;
    } else if (key === "letters") {
      if (!isAlphaComma(value)) return;
    } else if (key === "productCode") {
      if (!isProductCodeValid(value)) return;
    } else if (
      [
        "sNo",
        "thickness",
        "length",
        "height",
        "quantity",
        "rate",
        "amount",
      ].includes(key)
    ) {
      if (!isNumeric(value)) return;
    }

    // update the edited cell
    onCellChange(rowIdx, key, value);

    // auto-calculate quantity and amount when letters changes
    if (key === "letters") {
      const lettersCount = value
        ? value
            .replace(/,/g, "") // remove commas
            .split("") // split into characters
            .filter((ch) => ch.trim()).length // remove spaces
        : "";

      onCellChange(rowIdx, "quantity", lettersCount);

      const updatedRow = {
        ...currentTable.rows[rowIdx],
        letters: value,
        quantity: lettersCount,
      };

      const amount = calculateAmount(updatedRow);
      onCellChange(rowIdx, "amount", amount);
    }

    // auto-calculate amount when quantity, rate, length, or height changes
    if (["quantity", "rate", "length", "height"].includes(key)) {
      const updatedRow = {
        ...currentTable.rows[rowIdx],
        [key]: value,
        amount: "", // clear any previously wrong calculation
      };

      const amount = calculateAmount(updatedRow);
      onCellChange(rowIdx, "amount", amount);
    }
  };
  // table.rows is the array of row data
  return (
    <div className="bg-white p-4 sm:p-6 shadow-sm border border-gray-100 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-900 text-xs sm:text-sm">
          Only Letter Products
        </h3>

        {showRemove && (
          <button
            onClick={onRemove}
            className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-red-600 text-white hover:bg-red-700 transition-all cursor-pointer"
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
                  <th className="px-1 py-2 text-center text-[10px] sm:text-xs font-semibold text-white w-12 whitespace-nowrap border border-black">
                    S. No
                  </th>
                  <th className="px-2 py-2 text-[10px] sm:text-xs font-semibold text-white border border-black">
                    Product Code
                  </th>
                  <th className="px-2 py-2 text-[10px] sm:text-xs font-semibold text-white w-[11%] whitespace-normal border border-black">
                    Product Name
                  </th>
                  <th className="px-2 py-2 text-[10px] sm:text-xs font-semibold text-white w-[13%] whitespace-normal border border-black">
                    Product Description
                  </th>
                  <th className="px-2 py-2 text-[10px] sm:text-xs font-semibold text-white border border-black">
                    Letters
                  </th>
                  <th className="px-2 py-2 text-[10px] sm:text-xs font-semibold text-white border border-black">
                    Thickness (MM)
                  </th>
                  <th className="px-2 py-2 text-[10px] sm:text-xs font-semibold text-white border border-black">
                    Length (Inch)
                  </th>
                  <th className="px-2 py-2 text-[10px] sm:text-xs font-semibold text-white border border-black">
                    Height (Inch)
                  </th>
                  <th className="px-2 py-2 text-[10px] sm:text-xs font-semibold text-white border border-black">
                    Quantity
                  </th>
                  <th className="px-2 py-2 text-[10px] sm:text-xs font-semibold text-white border border-black">
                    Rate  <br /> (/inch)
                  </th>
                  <th className="px-2 py-2 text-[10px] sm:text-xs font-semibold text-white border border-black">
                    Amount (Rs)
                  </th>
                  {showLsp && (
                    <th className="px-2 py-2 text-[10px] sm:text-xs font-semibold text-white border border-black">
                      LSP
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className="bg-white text-center">
                {/* FIRST ROW (WITH ROWSPAN) */}
                <tr className="hover:bg-gray-50">
                  <td
                    rowSpan={currentTable.rows.length}
                    className="px-1 py-2 text-center w-12 border border-black"
                  >
                    <input
                      value={currentTable.rows[0].sNo || ""}
                      {...getReadOnlyProps("center")}
                    />
                  </td>
                  <td
                    rowSpan={currentTable.rows.length}
                    className="px-2 py-2 border border-black align-middle"
                  >
                    <input
                      value={currentTable.rows[0].productCode || ""}
                      {...getReadOnlyProps("center")}
                    />
                  </td>
                  <td
                    rowSpan={currentTable.rows.length}
                    className="px-2 py-2 border border-black align-middle"
                  >
                    <input
                      value={currentTable.rows[0].productName || ""}
                      className="w-full break-words whitespace-normal"
                      {...getReadOnlyProps("left")}
                    />
                  </td>
                  <td
                    rowSpan={currentTable.rows.length}
                    className="px-2 py-2 border border-black align-middle"
                  >
                    <input
                      value={currentTable.rows[0].productDescription || ""}
                      className="w-full break-words whitespace-normal"
                      {...getReadOnlyProps("left")}
                    />
                  </td>

                  <td className="px-2 py-2 border border-black">
                    <input
                      value={currentTable.rows[0].letters || ""}
                      onChange={(e) =>
                        clickable && handleCellChange(0, "letters", e.target.value)
                      }
                      {...getInputProps()}
                    />
                  </td>
                  <td className="px-2 py-2 border border-black">
                    <input
                      value={currentTable.rows[0].thickness || ""}
                      onChange={(e) =>
                        clickable && handleCellChange(0, "thickness", e.target.value)
                      }
                      {...getInputProps()}
                    />
                  </td>
                  <td className="px-2 py-2 border border-black">
                    <input
                      value={currentTable.rows[0].length || ""}
                      onChange={(e) =>
                        clickable && handleCellChange(0, "length", e.target.value)
                      }
                      {...getInputProps()}
                    />
                  </td>
                  <td className="px-2 py-2 border border-black">
                    <input
                      value={currentTable.rows[0].height || ""}
                      onChange={(e) =>
                        clickable && handleCellChange(0, "height", e.target.value)
                      }
                      {...getInputProps()}
                    />
                  </td>
                  <td className="px-2 py-2 border border-black">
                    <input
                      value={currentTable.rows[0].quantity || ""}
                      {...getReadOnlyProps("center")}
                    />
                  </td>
                  <td className="px-2 py-2 border border-black">
                    <input
                      value={currentTable.rows[0].rate || ""}
                      onChange={(e) =>
                        clickable && handleCellChange(0, "rate", e.target.value)
                      }
                      {...getInputProps()}
                    />
                  </td>
                  <td className="px-2 py-2 border border-black">
                    <input
                      value={currentTable.rows[0].amount || ""}
                      {...getReadOnlyProps("center")}
                    />
                  </td>
                  {showLsp && (
                    <td className="px-2 py-2 border border-black">
                      <input
                        value={currentTable.rows[0].lsp || ""}
                        onChange={(e) =>
                          clickable && handleCellChange(0, "lsp", e.target.value)
                        }
                        placeholder="Write your selling point"
                        {...getInputProps()}
                      />
                    </td>
                  )}
                </tr>

                {/* REMAINING ROWS */}
                {currentTable.rows.slice(1).map((row, i) => (
                  <tr key={i + 1} className="hover:bg-gray-50">
                    <td className="px-2 py-2 border border-black">
                      <input
                        value={row.letters || ""}
                        onChange={(e) =>
                          clickable && handleCellChange(i + 1, "letters", e.target.value)
                        }
                        {...getInputProps()}
                      />
                    </td>
                    <td className="px-2 py-2 border border-black">
                      <input
                        value={row.thickness || ""}
                        onChange={(e) =>
                          clickable && handleCellChange(i + 1, "thickness", e.target.value)
                        }
                        {...getInputProps()}
                      />
                    </td>
                    <td className="px-2 py-2 border border-black">
                      <input
                        value={row.length || ""}
                        onChange={(e) =>
                          clickable && handleCellChange(i + 1, "length", e.target.value)
                        }
                        {...getInputProps()}
                      />
                    </td>
                    <td className="px-2 py-2 border border-black">
                      <input
                        value={row.height || ""}
                        onChange={(e) =>
                          clickable && handleCellChange(i + 1, "height", e.target.value)
                        }
                        {...getInputProps()}
                      />
                    </td>
                    <td className="px-2 py-2 border border-black">
                      <input
                        value={row.quantity || ""}
                        {...getReadOnlyProps("center")}
                      />
                    </td>
                    <td className="px-2 py-2 border border-black">
                      <input
                        value={row.rate || ""}
                        onChange={(e) =>
                          clickable && handleCellChange(i + 1, "rate", e.target.value)
                        }
                        {...getInputProps()}
                      />
                    </td>
                    <td className="px-2 py-2 border border-black">
                      <input
                        value={row.amount || ""}
                        {...getReadOnlyProps("center")}
                      />
                    </td>
                    {showLsp && (
                      <td className="px-2 py-2 border border-black">
                        <input
                          value={row.lsp || ""}
                          onChange={(e) =>
                            clickable && handleCellChange(i + 1, "lsp", e.target.value)
                          }
                          placeholder="Write your selling point"
                          {...getInputProps()}
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

export default LetterProductTable;
