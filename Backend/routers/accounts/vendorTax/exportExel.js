import express from "express"
import {exportGSTReport} from "../../../controller/accounts/vendorTaxs/exportExel.js"

const exportGst=express.Router()

exportGst.get("/export/gst", exportGSTReport);

export default exportGst;