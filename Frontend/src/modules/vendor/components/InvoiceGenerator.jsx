// hooks/useInvoiceGenerator.js

import { useState, useEffect } from "react";

export const useInvoiceGenerator = () => {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [invoiceTime, setInvoiceTime] = useState("");

  useEffect(() => {
    const year = new Date().getFullYear();
    const key = `invoice-counter-${year}`;
    const currentCounter = parseInt(localStorage.getItem(key) || "0", 10) + 1;
    localStorage.setItem(key, currentCounter.toString());

    setInvoiceNumber(`INV-${year}-${currentCounter}`);
    setInvoiceDate(new Date().toLocaleDateString());
    setInvoiceTime(new Date().toLocaleTimeString());
  }, []);

  return { invoiceNumber, invoiceDate, invoiceTime };
};
