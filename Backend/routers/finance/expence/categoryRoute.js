import express from "express";
import { createCategory, getCategories, updateCategory, deleteCategory } from "../../../controller/finance/expence/expenceCategory.js";

const CategoryRoute = express.Router();
CategoryRoute.post("/", createCategory);
CategoryRoute.get("/", getCategories);
CategoryRoute.put("/:id", updateCategory);
CategoryRoute.delete("/:id", deleteCategory);
export default CategoryRoute;
