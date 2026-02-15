import express from "express";

import { authWithPermissions } from "../../../../middlewares/master/authMiddleware.js";
import { getAllSignageProducts } from "../../controllers/common/signageProductList.controller.js";
const signageProductListRoute = express.Router();

signageProductListRoute.get(
  "/list",
  authWithPermissions(),
  getAllSignageProducts,
);

export default signageProductListRoute;
