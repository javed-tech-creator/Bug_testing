import express from "express";
import upload from "../../../middlewares/finance/upload.js";
import { createExpense, getExpenses, updateExpense, deleteExpense, budgetVsActual } from "../../../controller/finance/expence/expence.js";

const ERoute = express.Router();
ERoute.post("/", upload.single("receipt"), createExpense);
ERoute.get("/", getExpenses);
ERoute.put("/:id", updateExpense);
ERoute.delete("/:id", deleteExpense);

// Budget vs Actual Report
ERoute.get("/report/budget-vs-actual", budgetVsActual);

export default ERoute;
