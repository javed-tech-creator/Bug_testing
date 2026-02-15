import express from "express";
import { checkRole, mockUser } from "../../../middlewares/asset.middleware/authMiddlware.js";
import { createAsset, getAllAssets, getAssets, hardDeleteAsset, patchAsset, softDeleteAsset, updateAsset } from "../../../controller/technology/asset.controller.js";

const assetRouter = express.Router();

// Sabhi routes pe pehle dummy user inject hoga
// assetRouter.use(mockUser);

assetRouter.post("/add",createAsset); //checkRole(["Manager", "HOD"]),
assetRouter.get("/get",getAssets);
assetRouter.get("/get-all-data",getAllAssets);
assetRouter.put("/update/:id",updateAsset);
assetRouter.patch("/patch-assign/:id",patchAsset);
assetRouter.delete("/delete/:id",softDeleteAsset);
assetRouter.delete("/delete-hard/:id",hardDeleteAsset);

export default assetRouter;
