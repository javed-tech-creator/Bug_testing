import express from "express";

import { authWithPermissions } from "../../../../middlewares/master/authMiddleware.js";
import { addProductToProject, deleteProductFromProject } from "../../controllers/common/newProductAddRemove.controller.js";
const productAddRemove = express.Router();

productAddRemove.post("/add", authWithPermissions(), addProductToProject);
productAddRemove.delete("/delete", authWithPermissions(), deleteProductFromProject);

export default productAddRemove;
