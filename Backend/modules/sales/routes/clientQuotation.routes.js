import express from "express";
import {
  createQuotation,
  updateQuotation,
  sendQuotationToClient,
  getQuotationById,
  getQuotationsByProject
} from "../controllers/clientQuotation.controller.js";

import Upload from "../../../middlewares/master/multer.middleware.js";
import { fileValidator } from "../../../middlewares/master/fileValidator.middleware.js";

const router = express.Router();


router.post(
  "/",
  Upload("quotation").fields([
    { name: "documents", maxCount: 10 },
  ]),
  createQuotation
);


router.post(
  "/send/:id",
  Upload("quotation").fields([
    { name: "quotationPdf", maxCount: 1 },  
  ]),
  fileValidator({ types: ["pdf"], maxSizeMB: 20 }),
  sendQuotationToClient
);


router.put(
  "/:id",
  Upload("quotation").fields([
    { name: "documents", maxCount: 10 },
  ]),
  fileValidator({ types: ["image", "pdf"], maxSizeMB: 15 }),
  updateQuotation
);

router.get("/:id",getQuotationById);
router.get("/project/:projectId", getQuotationsByProject )


export default router;
