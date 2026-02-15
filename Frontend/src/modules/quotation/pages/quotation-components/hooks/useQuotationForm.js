import { useState, useEffect } from "react";

import {
  createBoardTable,
  createLetterTable,
  createBoardLetterTable,
} from "../utils/tableFactory.js";

export const useQuotationForm = () => {
  const [boardTables, setBoardTables] = useState([createBoardTable()]);
  const [letterTables, setLetterTables] = useState([createLetterTable()]);
  const [boardLetterTables, setBoardLetterTables] = useState([
    createBoardLetterTable(),
  ]);

  const [workCharges, setWorkCharges] = useState({
    acpWork: false,
    stencilWork: false,
    fabricationWork: false,
    boardRepairWork: false,
    paadWork: false,
    dismantlingWork: false,
    hydraWork: false,
    installation: true,
    ironWork: false,
    transportation: false,
    civilWork: false,
    more: false,
  });

  const [selectedWorks, setSelectedWorks] = useState([]);
  const [totalDiscount, setTotalDiscount] = useState("");
  const [cgstSgst, setCgstSgst] = useState("");

  // Calculate Additional Work Total
  const additionalWorkTotal = selectedWorks.reduce((sum, w) => {
    const charge = parseFloat(w.charge) || 0;
    return sum + charge;
  }, 0);

  // Calculate Grand Total
  const grandTotal =
    additionalWorkTotal +
    (parseFloat(cgstSgst) || 0) -
    (parseFloat(totalDiscount) || 0);

  // Initialize Installation work
  useEffect(() => {
    if (workCharges.installation) {
      setSelectedWorks((prev) => {
        const exists = prev.some((w) => w.work === "Installation");
        if (exists) return prev;

        return [
          ...prev,
          {
            id: Date.now(),
            work: "Installation",
            charge: "",
            isCustom: false,
          },
        ];
      });
    }
  }, [workCharges.installation]);

  // Board Table Handlers
  const handleBoardCellChange = (tableId, rowIndex, key, value) => {
    setBoardTables((prev) =>
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

  const addBoardTable = () => {
    setBoardTables((prev) => [...prev, createBoardTable()]);
  };

  const removeBoardTable = (tableId) => {
    setBoardTables((prev) => prev.filter((t) => t.id !== tableId));
  };

  // Letter Table Handlers
  const handleLetterCellChange = (tableId, rowIndex, key, value) => {
    setLetterTables((prev) =>
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

  const addLetterTable = () => {
    setLetterTables((prev) => [...prev, createLetterTable()]);
  };

  const removeLetterTable = (tableId) => {
    setLetterTables((prev) => prev.filter((t) => t.id !== tableId));
  };

  // Board & Letter Table Handlers
  const handleBoardLetterProductChange = (tableId, key, value) => {
    setBoardLetterTables((prev) =>
      prev.map((table) =>
        table.id === tableId
          ? {
              ...table,
              productRow: { ...table.productRow, [key]: value },
            }
          : table
      )
    );
  };

  const handleBoardLetterLetterChange = (tableId, rowIndex, key, value) => {
    setBoardLetterTables((prev) =>
      prev.map((table) =>
        table.id === tableId
          ? {
              ...table,
              letterRows: table.letterRows.map((row, idx) =>
                idx === rowIndex ? { ...row, [key]: value } : row
              ),
            }
          : table
      )
    );
  };

  const addBoardLetterTable = () => {
    setBoardLetterTables((prev) => [...prev, createBoardLetterTable()]);
  };

  const removeBoardLetterTable = (tableId) => {
    setBoardLetterTables((prev) => prev.filter((t) => t.id !== tableId));
  };

  // Work Charges Handlers
  const toggleCharge = (key, label) => {
    setWorkCharges((prev) => {
      const nextChecked = !prev[key];

      setSelectedWorks((prevWorks) => {
        const alreadyExists = prevWorks.some((w) =>
          key === "more" ? w.isCustom : w.work === label
        );

        if (nextChecked) {
          if (alreadyExists) return prevWorks;

          return [
            ...prevWorks,
            {
              id: Date.now(),
              work: key === "more" ? "" : label,
              charge: "",
              isCustom: key === "more",
            },
          ];
        }

        return prevWorks.filter((w) =>
          key === "more" ? !w.isCustom : w.work !== label
        );
      });

      return { ...prev, [key]: nextChecked };
    });
  };

  const handleWorkChange = (workId, field, value) => {
    setSelectedWorks((prev) =>
      prev.map((w) => (w.id === workId ? { ...w, [field]: value } : w))
    );
  };

  return {
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
    additionalWorkTotal,
    grandTotal,
  };
};
