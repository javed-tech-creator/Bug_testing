import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useQuotationForm } from "./quotation-components/hooks/useQuotationForm";
import CustomerDetails from "./quotation-components/forms/CustomerDetails";
import BoardProductTable from "./quotation-components/tables/BoardProductTable";
import LetterProductTable from "./quotation-components/tables/LetterProductTable";
import BoardLetterProductTable from "./quotation-components/tables/BoardLetterProductTable";
import AdditionalWorkSection from "./quotation-components/forms/AdditionalWorkSection";
import {
  Button,
  SectionHeader,
} from "./quotation-components/ui/CommonComponents";

const QuotationForm = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const {
    // Board Tables
    boardTables,
    handleBoardCellChange,
    addBoardTable,
    removeBoardTable,

    // Letter Tables
    letterTables,
    handleLetterCellChange,
    addLetterTable,
    removeLetterTable,

    // Board & Letter Tables
    boardLetterTables,
    handleBoardLetterProductChange,
    handleBoardLetterLetterChange,
    addBoardLetterTable,
    removeBoardLetterTable,

    // Work Charges
    workCharges,
    selectedWorks,
    toggleCharge,
    handleWorkChange,

    // Totals
    totalDiscount,
    setTotalDiscount,
    cgstSgst,
    setCgstSgst,
    grandTotal,
  } = useQuotationForm();

  const createBoardTableWithData = () => ({
    id: Date.now() + Math.random(),
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
  });

  // Additional Products state
  const [additionalBoardTables, setAdditionalBoardTables] = useState([]);
  const [additionalLetterTables, setAdditionalLetterTables] = useState([]);
  const [additionalBoardLetterTables, setAdditionalBoardLetterTables] =
    useState([]);

  // Add handlers for Additional Products
  const addAdditionalBoardTable = () => {
    setAdditionalBoardTables((prev) => [...prev, createBoardTableWithData()]);
  };
  const addAdditionalLetterTable = () => {
    setAdditionalLetterTables((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        rows: [
          {
            sNo: "01",
            productCode: "P-09977",
            productName: "Flex Sign Letter",
            productDescription: "Product Description",
            letters: "A,B,C",
            thickness: "12",
            length: "4",
            height: "4",
            quantity: "2",
            rate: "12",
            amount: "200",
            lsp: "",
          },
          {
            sNo: "",
            productCode: "",
            productName: "",
            productDescription: "",
            letters: "A,B,C",
            thickness: "12",
            length: "4",
            height: "4",
            quantity: "2",
            rate: "12",
            amount: "200",
            lsp: "",
          },
          {
            sNo: "",
            productCode: "",
            productName: "",
            productDescription: "",
            letters: "A,B,C",
            thickness: "12",
            length: "4",
            height: "4",
            quantity: "2",
            rate: "12",
            amount: "200",
            lsp: "",
          },
        ],
      },
    ]);
  };
  const addAdditionalBoardLetterTable = () => {
    setAdditionalBoardLetterTables((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        product: {
          sNo: "01",
          productCode: "",
          productName: "",
          productDescription: "",
          board: "",
          thickness: "",
          lengthInch: "",
          lengthFt: "",
          heightInch: "",
          heightFt: "",
          size: "",
          quantity: "",
          rate: "",
          amount: "",
          lsp: "",
        },
        letters: [
          {
            letters: "",
            thickness: "",
            length: "",
            height: "",
            size: "",
            quantity: "",
            rate: "",
            amount: "",
            lsp: "",
          },
        ],
      },
    ]);
  };

  // Cell change handlers for Additional Products
  const handleAdditionalBoardCellChange = (tableId, rowIndex, key, value) => {
    setAdditionalBoardTables((prev) =>
      prev.map((table) =>
        table.id === tableId
          ? {
              ...table,
              rows: table.rows.map((row, idx) =>
                idx === rowIndex ? { ...row, [key]: value } : row
              ),
            }
          : table
      )
    );
  };
  const handleAdditionalLetterCellChange = (tableId, rowIndex, key, value) => {
    setAdditionalLetterTables((prev) =>
      prev.map((table) =>
        table.id === tableId
          ? {
              ...table,
              rows: table.rows.map((row, idx) =>
                idx === rowIndex ? { ...row, [key]: value } : row
              ),
            }
          : table
      )
    );
  };
  const handleAdditionalBoardLetterProductChange = (tableId, key, value) => {
    setAdditionalBoardLetterTables((prev) =>
      prev.map((table) =>
        table.id === tableId
          ? { ...table, product: { ...table.product, [key]: value } }
          : table
      )
    );
  };
  const handleAdditionalBoardLetterLetterChange = (
    tableId,
    rowIndex,
    key,
    value
  ) => {
    setAdditionalBoardLetterTables((prev) =>
      prev.map((table) =>
        table.id === tableId
          ? {
              ...table,
              letters: table.letters.map((row, idx) =>
                idx === rowIndex ? { ...row, [key]: value } : row
              ),
            }
          : table
      )
    );
  };

  // Remove handlers for Additional Products
  const removeAdditionalBoardTable = (tableId) => {
    setAdditionalBoardTables((prev) => prev.filter((t) => t.id !== tableId));
  };
  const removeAdditionalLetterTable = (tableId) => {
    setAdditionalLetterTables((prev) => prev.filter((t) => t.id !== tableId));
  };
  const removeAdditionalBoardLetterTable = (tableId) => {
    setAdditionalBoardLetterTables((prev) =>
      prev.filter((t) => t.id !== tableId)
    );
  };

  const hasAdditionalTables =
    additionalBoardTables.length > 0 ||
    additionalLetterTables.length > 0 ||
    additionalBoardLetterTables.length > 0;

  return (
    <div className="">
      {/* HEADER */}
      <div className="bg-white sm:px-6 py-4 border-b border-gray-200 flex items-center gap-3 sm:gap-4 top-0 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="p-2 border rounded-md bg-gray-50 cursor-pointer hover:bg-gray-100"
        >
          <ArrowLeft size={20} className="text-gray-800" />
        </button>
        <h1 className="text-base sm:text-lg font-bold text-gray-900">
          Quotation Form
        </h1>
      </div>

      <div className="max-w-full mt-3">
        {/* CUSTOMER DETAILS SECTION */}
        <CustomerDetails />

        {/* PRODUCTS & PRICING */}
        <div>
          <SectionHeader title="Products & Pricing" />

          {/* 1. BOARD PRODUCTS TABLES */}
          {boardTables.map((table, idx) => (
            <BoardProductTable
              key={table.id}
              table={table}
              index={idx}
              showRemove={false}
              showBorder={true}
              clickable={true}
              onRemove={() => removeBoardTable(table.id)}
              onCellChange={(rowIndex, key, value) =>
                handleBoardCellChange(table.id, rowIndex, key, value)
              }
            />
          ))}

          {/* 2. LETTER PRODUCTS TABLES */}
          {letterTables.map((table, idx) => (
            <LetterProductTable
              key={table.id}
              table={table}
              index={idx}
              showRemove={false}
              showBorder={true}
              clickable={true}
              onRemove={() => removeLetterTable(table.id)}
              onCellChange={(rowIndex, key, value) =>
                handleLetterCellChange(table.id, rowIndex, key, value)
              }
            />
          ))}

          {/* 3. BOARD & LETTER COMBINED TABLES */}
          {boardLetterTables.map((table, idx) => (
            <BoardLetterProductTable
              key={table.id}
              table={table}
              index={idx}
              showRemove={false}
              showBorder={true}
              clickable={true}
              onRemove={() => {
                removeBoardLetterTable(table.id);
              }}
              onProductChange={(key, value) =>
                handleBoardLetterProductChange(table.id, key, value)
              }
              onLetterChange={(rowIndex, key, value) =>
                handleBoardLetterLetterChange(table.id, rowIndex, key, value)
              }
            />
          ))}
        </div>

        {/* ADDITIONAL PRODUCTS SECTION */}
        <div>
          <SectionHeader title="Additional Products" />
          <div>
            {/* Action Buttons */}
            {/* {boardTables.length > 0 && (
              <BoardProductTable
                table={boardTables[0]}
                index={0}
                onRemove={() => {}}
                onCellChange={(rowIndex, key, value) =>
                  handleBoardCellChange(boardTables[0].id, rowIndex, key, value)
                }
                showRemove={false}
              />
            )} */}
            {/* Additional Board Tables */}
            {additionalBoardTables.map((table, idx) => (
              <BoardProductTable
                key={table.id}
                table={table}
                index={idx + (boardTables.length > 0 ? 1 : 0)}
                onRemove={() => removeAdditionalBoardTable(table.id)}
                onCellChange={(rowIndex, key, value) =>
                  handleAdditionalBoardCellChange(
                    table.id,
                    rowIndex,
                    key,
                    value
                  )
                }
                showRemove={true}
              />
            ))}
            {/* Additional Letter Tables */}
            {additionalLetterTables.map((table, idx) => (
              <LetterProductTable
                key={table.id}
                table={table}
                index={idx}
                onRemove={() => removeAdditionalLetterTable(table.id)}
                onCellChange={(rowIndex, key, value) =>
                  handleAdditionalLetterCellChange(
                    table.id,
                    rowIndex,
                    key,
                    value
                  )
                }
                showRemove={true}
              />
            ))}
            {/* Additional Board+Letter Tables */}
            {additionalBoardLetterTables.map((table, idx) => (
              <BoardLetterProductTable
                key={table.id}
                table={table}
                index={idx}
                onRemove={() => removeAdditionalBoardLetterTable(table.id)}
                onProductChange={(key, value) =>
                  handleAdditionalBoardLetterProductChange(table.id, key, value)
                }
                onLetterChange={(rowIndex, key, value) =>
                  handleAdditionalBoardLetterLetterChange(
                    table.id,
                    rowIndex,
                    key,
                    value
                  )
                }
                showRemove={true}
              />
            ))}
          </div>
        </div>

        {/* ADDITIONAL WORK SECTION */}
        <div>
          {hasAdditionalTables && <SectionHeader title="Additional Work" />}
          <div className="bg-white sm:p-6 rounded-lg shadow-sm border border-gray-100">
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
              <Button
                onClick={addAdditionalBoardTable}
                className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-600"
              >
                Add Board Product
              </Button>
              <Button
                onClick={addAdditionalLetterTable}
                className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-600"
              >
                Add Letters Product
              </Button>
              <Button
                onClick={addAdditionalBoardLetterTable}
                className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-600"
              >
                Add Letters + Board Product
              </Button>
            </div>

            <AdditionalWorkSection
              workCharges={workCharges}
              selectedWorks={selectedWorks}
              totalDiscount={totalDiscount}
              cgstSgst={cgstSgst}
              grandTotal={grandTotal}
              onToggleCharge={toggleCharge}
              onWorkChange={handleWorkChange}
              onTotalDiscountChange={(e) => setTotalDiscount(e.target.value)}
              onCgstSgstChange={(e) => setCgstSgst(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="bg-white p-4 border-t border-gray-200 flex flex-wrap justify-end gap-2 sm:gap-3 bottom-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] mt-3">
        <Button variant="danger">Cancel</Button>
        <Button variant="secondary">Save as Draft</Button>
        <Button
          onClick={() =>
            navigate(`/quotation/accepted-quotation-page/${id}`, {
              state: { showButton: true, },
            })
          }
        >
          Preview
        </Button>
      </div>
    </div>
  );
};

export default QuotationForm;
