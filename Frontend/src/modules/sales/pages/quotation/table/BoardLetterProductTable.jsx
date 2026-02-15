import React from "react";
import { X } from "lucide-react";

const colWidths = {
  sNo: "w-10",
  productCode: "w-10",
  productName: "w-[11%]",
  productDescription: "w-[13%]",
  thickness: "w-16",
  length: "w-[120px]",
  height: "w-[120px]",
  size: "w-16",
  quantity: "w-20",
  rate: "w-20",
  amount: "w-24",
  lsp: "w-14",
};

const tdClass = "border border-black px-2 py-2 text-center";
const initialTable = {
  productRow: {
    sNo: "01",
    productCode: "P-09977",
    productName: "Flex Sign Board",
    productDescription: "Product Description",
    board: "12",
    thickness: "1",
    lengthInch: "4",
    lengthFt: "0",
    heightInch: "12",
    heightFt: "0",
    size: "2",
    quantity: "23",
    rate: "2354",
    amount: "2354",
    lsp: "",
  },
  letterRows: [
    {
      letters: "A,B,C",
      thickness: "12",
      length: "4",
      height: "4",
      size: "4",
      quantity: "2",
      rate: "12",
      amount: "200",
      lsp: "",
    },
    {
      letters: "A,B,C",
      thickness: "12",
      length: "4",
      height: "4",
      size: "4",
      quantity: "2",
      rate: "12",
      amount: "200",
      lsp: "",
    },
    {
      letters: "A,B,C",
      thickness: "12",
      length: "4",
      height: "4",
      size: "4",
      quantity: "2",
      rate: "12",
      amount: "200",
      lsp: "",
    },
    {
      letters: "A,B,C",
      thickness: "12",
      length: "4",
      height: "4",
      size: "4",
      quantity: "2",
      rate: "12",
      amount: "200",
      lsp: "",
    },
  ],
};

const BoardLetterProductTable = ({
  onRemove,
  showRemove = true,
  showBorder = true,
  clickable = true,
  showLsp = true,
}) => {
  const [table, setTable] = React.useState(initialTable);

  const inputClass = `w-full text-center text-[10px] sm:text-xs px-1 py-1 ${
    showBorder
      ? "rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-300"
      : ""
  } `;

  // Unified input props helper
  const getInputProps = (extraClass = "") => ({
    readOnly: !clickable,
    disabled: !clickable,
    className: `${inputClass} ${extraClass} ${
      !clickable ? "pointer-events-none cursor-not-allowed" : ""
    }`,
  });

  // Read-only input props for plain text look
  const getReadOnlyProps = (align = "center") => ({
    readOnly: true,
    disabled: true,
    className: `w-full text-${align} text-[10px] sm:text-xs px-2 py-1
      border-none outline-none focus:ring-0 focus:outline-none
      pointer-events-none bg-transparent`,
  });

  // Validation helpers
  const isAlpha = (val) => /^[A-Za-z\s]*$/.test(val);
  const isAlphaComma = (val) => /^[A-Za-z,\s]*$/.test(val);
  const isNumeric = (val) => /^\d*$/.test(val);
  const isProductCodeValid = (val) => /^[A-Za-z0-9-]*$/.test(val);

  // Calculation helpers
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

  const handleProductChange = (field, value) => {
    // text validations
    if (["productName", "productDescription"].includes(field)) {
      if (!isAlpha(value)) return;
    } else if (field === "productCode") {
      if (!isProductCodeValid(value)) return;
    } else if (
      [
        "sNo",
        "board",
        "thickness",
        "lengthInch",
        "lengthFt",
        "heightInch",
        "heightFt",
        "quantity",
        "rate",
        "lsp",
      ].includes(field)
    ) {
      if (!isNumeric(value)) return;
    }

    setTable((prev) => {
      const updated = { ...prev.productRow, [field]: value };

      // 🔁 INCH → FT conversion
      if (field === "lengthInch" || field === "heightInch") {
        const totalInch = parseInt(value, 10);
        const ft = value ? Math.ceil(totalInch / 12) : 0;

        if (field === "lengthInch") updated.lengthFt = ft.toString();
        if (field === "heightInch") updated.heightFt = ft.toString();
      }

      // 📐 SIZE calculation (Ft × Ft)
      const size = calcSizeSqFt(updated.lengthFt, updated.heightFt);
      if (size !== "") updated.size = size;

      // 💰 AMOUNT calculation
      const amount = calcAmount(size, updated.quantity, updated.rate);
      if (amount !== "") updated.amount = amount;

      return {
        ...prev,
        productRow: updated,
      };
    });
  };

  // Calculation helpers for LETTER rows (same as Board tables)
  const calcLetterSizeSqFt = (length, height) => {
    const l = parseFloat(length);
    const h = parseFloat(height);
    if (isNaN(l) || isNaN(h)) return "";
    return (l * h).toFixed(2);
  };

  const calcLetterAmount = (size, qty, rate) => {
    const s = parseFloat(size);
    const q = parseFloat(qty);
    const r = parseFloat(rate);
    if (isNaN(s) || isNaN(q) || isNaN(r)) return "";
    return (s * q * r).toFixed(2);
  };

  const handleLetterChange = (rowIndex, field, value) => {
    // Only allow characters for letters, numbers for others
    if (field === "letters") {
      if (!isAlphaComma(value)) return;
    } else if (
      [
        "thickness",
        "length",
        "height",
        "size",
        "quantity",
        "rate",
        "amount",
        "lsp",
      ].includes(field)
    ) {
      if (!isNumeric(value)) return;
    }
    setTable((prev) => {
      const updatedRows = [...prev.letterRows];
      const updatedRow = {
        ...updatedRows[rowIndex],
        [field]: value,
      };

      // 🔠 AUTO QUANTITY FROM LETTERS (comma optional)
      if (field === "letters") {
        const lettersCount = value
          ? value
              .replace(/,/g, "") // remove commas
              .split("") // split characters
              .filter((ch) => ch.trim()).length // remove spaces
          : "";

        updatedRow.quantity = lettersCount;
      }

      // 📐 SIZE + 💰 AMOUNT calculation
      if (["length", "height", "quantity", "rate", "letters"].includes(field)) {
        const size = calcLetterSizeSqFt(updatedRow.length, updatedRow.height);
        updatedRow.size = size;

        const amount = calcLetterAmount(
          size,
          updatedRow.quantity,
          updatedRow.rate,
        );
        updatedRow.amount = amount;
      }

      updatedRows[rowIndex] = updatedRow;
      return {
        ...prev,
        letterRows: updatedRows,
      };
    });
  };
  return (
    <div className="bg-white sm:p-6 shadow-sm border border-gray-100 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-900 text-xs sm:text-sm">
          Board & Letter Products
        </h3>
        {showRemove && (
          <button
            className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-red-600 text-white transition-all cursor-pointer"
            title="Remove Table"
            onClick={() => {
              onRemove();
            }}
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
                  <th
                    className={`px-2 py-2 text-center text-[10px] sm:text-xs font-semibold text-white ${colWidths.sNo} whitespace-nowrap border border-black`}
                  >
                    S. No
                  </th>
                  <th
                    className={`px-2 py-2 text-center text-[10px] sm:text-xs font-semibold text-white ${colWidths.productCode} whitespace-nowrap border border-black`}
                  >
                    Product Code
                  </th>
                  <th
                    className={`px-2 py-2 text-center text-[10px] sm:text-xs font-semibold text-white ${colWidths.productName} whitespace-normal border border-black`}
                  >
                    Product Name
                  </th>
                  <th
                    className={`px-2 py-2 text-center text-[10px] sm:text-xs font-semibold text-white ${colWidths.productDescription} whitespace-normal border border-black`}
                  >
                    Product Description
                  </th>
                  <th
                    className={`px-2 py-2 text-center text-[10px] sm:text-xs font-semibold text-white w-20 whitespace-nowrap border border-black`}
                  >
                    Board
                  </th>
                  <th
                    className={`px-2 py-2 text-center text-[10px] sm:text-xs font-semibold text-white ${colWidths.thickness} whitespace-nowrap border border-black`}
                  >
                    Thickness <br /> (MM)
                  </th>
                  <th
                    className={`px-2 py-2 text-center text-[10px] sm:text-xs font-semibold text-white ${colWidths.length} whitespace-nowrap border border-black`}
                    colSpan={2}
                  >
                    <div className="border-b  pb-1 mb-1 whitespace-nowrap">
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
                  <th
                    className={`px-2 py-2 text-center text-[10px] sm:text-xs font-semibold text-white ${colWidths.height} whitespace-nowrap border border-black`}
                    colSpan={2}
                  >
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
                  <th
                    className={`px-2 py-2 text-center text-[10px] sm:text-xs font-semibold text-white ${colWidths.size} whitespace-nowrap border border-black`}
                  >
                    Total Size <br /> (Sq. Ft)
                  </th>
                  <th
                    className={`px-2 py-2 text-center text-[10px] sm:text-xs font-semibold text-white ${colWidths.quantity} whitespace-nowrap border border-black`}
                  >
                    Quantity
                  </th>
                  <th
                    className={`px-2 py-2 text-center text-[10px] sm:text-xs font-semibold text-white ${colWidths.rate} whitespace-nowrap border border-black`}
                  >
                    Rate <br /> (/Sq. Ft)
                  </th>
                  <th
                    className={`px-2 py-2 text-center text-[10px] sm:text-xs font-semibold text-white ${colWidths.amount} whitespace-nowrap border border-black`}
                  >
                    Amount (Rs)
                  </th>
                  {showLsp && (
                    <th
                      className={`px-2 py-2 text-center text-[10px] sm:text-xs font-semibold text-white ${colWidths.lsp} whitespace-nowrap border border-black`}
                    >
                      LSP
                    </th>
                  )}
                </tr>
              </thead>

              <tbody>
                {/* BOARD ROW */}
                <tr>
                  <td
                    rowSpan={table.letterRows.length + 2}
                    className={`${tdClass} ${colWidths.sNo}`}
                  >
                    <input
                      value={table.productRow.sNo}
                      {...getReadOnlyProps("center")}
                    />
                  </td>
                  <td
                    rowSpan={table.letterRows.length + 2}
                    className={`${tdClass} ${colWidths.productCode}`}
                  >
                    <input
                      value={table.productRow.productCode}
                      {...getReadOnlyProps("center")}
                    />
                  </td>
                  <td
                    rowSpan={table.letterRows.length + 2}
                    className={`${tdClass} ${colWidths.productName}`}
                  >
                    <input
                      value={table.productRow.productName}
                      className="w-full break-words whitespace-normal"
                      {...getReadOnlyProps("left")}
                    />
                  </td>
                  <td
                    rowSpan={table.letterRows.length + 2}
                    className={`${tdClass} ${colWidths.productDescription}`}
                  >
                    <input
                      value={table.productRow.productDescription}
                      className="w-full break-words whitespace-normal"
                      {...getReadOnlyProps("left")}
                    />
                  </td>
                  <td className={`${tdClass} w-20`}>
                    <input
                      value={table.productRow.board}
                      onChange={(e) =>
                        clickable &&
                        handleProductChange("board", e.target.value)
                      }
                      {...getInputProps()}
                    />
                  </td>
                  <td className={`${tdClass} ${colWidths.thickness}`}>
                    <input
                      value={table.productRow.thickness}
                      onChange={(e) =>
                        clickable &&
                        handleProductChange("thickness", e.target.value)
                      }
                      {...getInputProps()}
                    />
                  </td>
                  {/* Length Inch */}
                  <td className={`${tdClass} ${colWidths.length}`}>
                    <input
                      value={table.productRow.lengthInch}
                      onChange={(e) =>
                        clickable &&
                        handleProductChange("lengthInch", e.target.value)
                      }
                      {...getInputProps()}
                    />
                  </td>
                  {/* Length Ft */}
                  <td className={`${tdClass} ${colWidths.length}`}>
                    <input
                      value={table.productRow.lengthFt}
                      {...getReadOnlyProps("center")}
                    />
                  </td>
                  {/* Height Inch */}
                  <td className={`${tdClass} ${colWidths.height}`}>
                    <input
                      value={table.productRow.heightInch}
                      onChange={(e) =>
                        clickable &&
                        handleProductChange("heightInch", e.target.value)
                      }
                      {...getInputProps()}
                    />
                  </td>
                  {/* Height Ft */}
                  <td className={`${tdClass} ${colWidths.height}`}>
                    <input
                      value={table.productRow.heightFt}
                      {...getReadOnlyProps("center")}
                    />
                  </td>
                  <td className={`${tdClass} ${colWidths.size}`}>
                    <input
                      value={table.productRow.size}
                      {...getReadOnlyProps("center")}
                    />
                  </td>
                  <td className={`${tdClass} ${colWidths.quantity}`}>
                    <input
                      value={table.productRow.quantity}
                      onChange={(e) =>
                        clickable &&
                        handleProductChange("quantity", e.target.value)
                      }
                      {...getInputProps()}
                    />
                  </td>
                  <td className={`${tdClass} ${colWidths.rate}`}>
                    <input
                      value={table.productRow.rate}
                      onChange={(e) =>
                        clickable && handleProductChange("rate", e.target.value)
                      }
                      {...getInputProps()}
                    />
                  </td>
                  <td className={`${tdClass} ${colWidths.amount}`}>
                    <input
                      value={table.productRow.amount}
                      {...getReadOnlyProps("center")}
                    />
                  </td>
                  {showLsp && (
                    <td className={`${tdClass} ${colWidths.lsp}`}>
                      <input
                        value={table.productRow.lsp}
                        onChange={(e) =>
                          clickable &&
                          handleProductChange("lsp", e.target.value)
                        }
                        placeholder="Write your selling point"
                        {...getInputProps("placeholder-gray-400")}
                      />
                    </td>
                  )}
                </tr>

                {/* LETTER HEADER ROW */}
                <tr className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-600">
                  <td className={tdClass + " text-white text-xs"}>Letters</td>
                  <td className={tdClass + " text-white text-xs"}>
                    Thickness (MM)
                  </td>
                  <td className={tdClass + " text-white text-xs"} colSpan={2}>
                    Length
                  </td>
                  <td className={tdClass + " text-white text-xs"} colSpan={2}>
                    Height
                  </td>
                  {/* Removed Total Size (Sq. Ft) column header */}
                  <td className={tdClass + " text-white text-xs"} colSpan={2}>
                    Quantity
                  </td>
                  <td className={tdClass + " text-white text-xs"}>
                    Rate (/inch)
                  </td>
                  <td className={tdClass + " text-white text-xs"}>
                    Amount (Rs)
                  </td>
                  {showLsp && (
                    <td className={tdClass + " text-white text-xs"}>LSP</td>
                  )}
                </tr>

                {/* LETTER ROWS */}
                {table.letterRows.map((row, i) => (
                  <tr key={i}>
                    <td className={`${tdClass} ${colWidths.sNo}`}>
                      <input
                        value={row.letters}
                        onChange={(e) =>
                          clickable &&
                          handleLetterChange(i, "letters", e.target.value)
                        }
                        {...getInputProps()}
                      />
                    </td>
                    <td className={`${tdClass} ${colWidths.thickness}`}>
                      <input
                        value={row.thickness}
                        onChange={(e) =>
                          clickable &&
                          handleLetterChange(i, "thickness", e.target.value)
                        }
                        {...getInputProps()}
                      />
                    </td>
                    <td
                      className={`${tdClass} ${colWidths.length}`}
                      colSpan={2}
                    >
                      <input
                        value={row.length}
                        onChange={(e) =>
                          clickable &&
                          handleLetterChange(i, "length", e.target.value)
                        }
                        {...getInputProps()}
                      />
                    </td>
                    <td
                      className={`${tdClass} ${colWidths.height}`}
                      colSpan={2}
                    >
                      <input
                        value={row.height}
                        onChange={(e) =>
                          clickable &&
                          handleLetterChange(i, "height", e.target.value)
                        }
                        {...getInputProps()}
                      />
                    </td>
                    {/* Removed Size column from letter rows */}
                    <td
                      className={`${tdClass} ${colWidths.quantity}`}
                      colSpan={2}
                    >
                      <input
                        value={row.quantity}
                        onChange={(e) =>
                          clickable &&
                          handleLetterChange(i, "quantity", e.target.value)
                        }
                        {...getInputProps()}
                      />
                    </td>
                    <td className={`${tdClass} ${colWidths.rate}`}>
                      <input
                        value={row.rate}
                        onChange={(e) =>
                          clickable &&
                          handleLetterChange(i, "rate", e.target.value)
                        }
                        {...getInputProps()}
                      />
                    </td>
                    <td className={`${tdClass} ${colWidths.amount}`}>
                      <input
                        value={row.amount || ""}
                        {...getReadOnlyProps("center")}
                      />
                    </td>
                    {showLsp && (
                      <td className={`${tdClass} ${colWidths.lsp}`}>
                        <input
                          value={row.lsp}
                          onChange={(e) =>
                            clickable &&
                            handleLetterChange(i, "lsp", e.target.value)
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

export default BoardLetterProductTable;
