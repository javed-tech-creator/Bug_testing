import express from "express";
import { createBudget, getBudgets, updateBudget, deleteBudget } from "../../../controller/finance/expence/budget.js";

const BRoute = express.Router();
BRoute.post("/", createBudget);
BRoute.get("/", getBudgets);
BRoute.put("/:id", updateBudget);
BRoute.delete("/:id", deleteBudget);

export default BRoute;
